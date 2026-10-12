'use client';

import { RESCUE_WORD_PARTS } from '@/data/word-rescue-word-parts';
import { sanitizeInternalHref } from '@/lib/learner/navigation';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, ChevronRight, ChevronUp, Globe, Lightbulb, Mic, RotateCcw, Sparkles, Square, ThumbsUp, Volume2 } from 'lucide-react';
import { RESCUE_COLLECTIONS, RESCUE_WORD_BY_ID, rescueAudioPath } from '@/lib/word-rescue/content';
import { applyRescueAction, emptyRescueProgress } from '@/lib/word-rescue/progression';
import { WORD_RESCUE_POINTS } from '@/lib/word-rescue/types';
import type { ClipKind, RescueCollection, HelpLanguage, RescueAction, RescueProgress, RescueResult, RescueWord } from '@/lib/word-rescue/types';
import { useRescueAudio } from './useRescueAudio';
import styles from './WordRescue.module.css';
import { WordRewardToast } from './WordRewardToast';

/** Only messages written for learners reach the screen; parser and network internals never do. */
class LearnerMessage extends Error {}
const SAVE_FALLBACK = 'Your practice could not be saved. Check your connection, then tap Retry save.';
const BUSY_MESSAGE = 'Word Lab is busy right now. Your step is kept. Tap Retry save in a moment.';
// AbortSignal.timeout is missing on iOS 15 and older Android browsers.
const timeoutSignal = (ms: number) => {
  if (typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms);
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
};
const readJson = (response: Response) => response.json().catch(() => null);
const focusSoon = (ref: RefObject<HTMLElement | null>) => requestAnimationFrame(() => ref.current?.focus({ preventScroll: false }));

const clipText = (word: RescueWord, clip: ClipKind) => clip === 'word' ? word.term : word[clip];
export default function WordRescueGame({ preview = false, assignmentId = null }: { preview?: boolean; assignmentId?: string | null }) {
  const searchParams = useSearchParams();
  const requestedCollection = searchParams.get('collection');
  const fromMap = searchParams.get('fromMap') === '1';
  const launched = useRef(false);
  const returnHref = sanitizeInternalHref(searchParams.get('returnTo')) ?? (requestedCollection === 'again' ? '/dashboard' : requestedCollection ? '/dashboard/map' : '/dashboard/activities?category=pronunciation');
  const [collections, setCollections] = useState<RescueCollection[]>(preview ? RESCUE_COLLECTIONS : []);
  const selectedCollection = collections.find(set => set.id === requestedCollection);
  const [state, setState] = useState<RescueProgress>(emptyRescueProgress);
  const latest = useRef(state);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSaving, setShowSaving] = useState(false);
  const sending = useRef(false);
  const [pending, setPending] = useState<RescueAction | null>(null);
  const pendingRef = useRef<RescueAction | null>(null);
  const storageKey = useRef('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [wordReward, setWordReward] = useState<{ id: string; points: number } | null>(null);
  const clearWordReward = useCallback(() => setWordReward(null), []);
  const [menu, setMenu] = useState(!fromMap && requestedCollection !== 'again');
  const [weekly, setWeekly] = useState(!!selectedCollection);
  const [week, setWeek] = useState(selectedCollection?.id ?? collections[1]?.id ?? 'everyday');
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [savedWordId, setSavedWordId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [lastClip, setLastClip] = useState<{ clip: ClipKind; rate: number }>({ clip: 'word', rate: 1 });
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  const audio = useRescueAudio();
  const session = state.session;
  const word = receipt && savedWordId ? RESCUE_WORD_BY_ID[savedWordId] : session ? RESCUE_WORD_BY_ID[session.wordIds[session.index]] : null;
  const allowedWords = new Set(collections.flatMap(set => set.wordIds));
  const sessionLocked = !!session && session.index < session.wordIds.length && session.wordIds.some(id => !allowedWords.has(id));
  const revisitCount = Object.entries(state.words).filter(([id, item]) => allowedWords.has(id) && item.confidence === 'again').length;
  const roundComplete = !!session && session.wordIds.length > 0 && session.wordIds.every(id => !!session.finished[id]);
  const roundPoints = roundComplete ? session!.wordIds.length * WORD_RESCUE_POINTS : 0;
  const active = !!word && !menu && !sessionLocked;
  const disabled = saving || !!pending || !loaded;
  const sectionButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const menuHeading = useRef<HTMLHeadingElement>(null);
  const wordHeading = useRef<HTMLHeadingElement>(null);
  const weeklyWordCount = selectedCollection?.wordIds.length ?? 6;

  useEffect(() => {
    if (!saving) { setShowSaving(false); return; }
    const timer = setTimeout(() => setShowSaving(true), 600);
    return () => clearTimeout(timer);
  }, [saving]);

  const accept = useCallback((next: RescueProgress) => { latest.current = next; setState(next); }, []);
  const savePending = useCallback((action: RescueAction | null) => {
    pendingRef.current = action; setPending(action);
    try {
      if (!storageKey.current) return;
      if (action) localStorage.setItem(storageKey.current, JSON.stringify(action));
      else localStorage.removeItem(storageKey.current);
    } catch { setNotice('Device storage is unavailable. Keep this page open until your practice is saved.'); }
  }, []);
  const send = useCallback(async (action: RescueAction, retry = false) => {
    if (sending.current || (!retry && pendingRef.current)) return false;
    sending.current = true; setSaving(true); setError(''); savePending(action);
    try {
      let result: RescueResult;
      if (preview) {
        const transition = applyRescueAction(latest.current, action);
        result = { state: transition.state, pointsAwarded: 0, credited: false };
        try { localStorage.setItem('word-rescue-preview-state', JSON.stringify(result.state)); } catch { /* preview keeps working in memory */ }
      } else {
        const response = await fetch('/api/word-rescue', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, assignmentId }), signal: timeoutSignal(20000) });
        const body = await readJson(response);
        if (!response.ok || !body) {
          if (response.status === 429 || response.status >= 500 || !body) throw new LearnerMessage(BUSY_MESSAGE);
          throw new LearnerMessage(typeof body.error === 'string' ? body.error : SAVE_FALLBACK);
        }
        result = body;
      }
      accept(result.state); savePending(null);
      if (action.type === 'said') setStage(2);
      if (action.type === 'finish') {
        setSavedWordId(action.wordId);
        setStage(2);
        if (!preview && result.pointsAwarded > 0) {
          setWordReward({ id: `${action.sessionId}:${action.wordId}`, points: result.pointsAwarded });
        }
        setReceipt(preview ? 'Practice complete. Preview only, no account points awarded.' : result.pointsAwarded ? `Practice saved. +${WORD_RESCUE_POINTS} points.` : `Practice saved. Your ${WORD_RESCUE_POINTS} points were already credited.`);
        window.dispatchEvent(new Event('activity-progress-updated'));
      }
      return true;
    } catch (failure) {
      setError(failure instanceof LearnerMessage ? failure.message : SAVE_FALLBACK);
      return false;
    } finally { sending.current = false; setSaving(false); }
  }, [accept, assignmentId, preview, savePending]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        let next: RescueProgress;
        if (preview) {
          storageKey.current = 'word-rescue-preview-pending';
          let stored: string | null = null;
          try { stored = localStorage.getItem('word-rescue-preview-state'); } catch { /* fresh preview */ }
          next = stored ? JSON.parse(stored) : emptyRescueProgress();
        } else {
          const response = await fetch('/api/word-rescue', { signal: timeoutSignal(20000) });
          const data = await readJson(response);
          if (!response.ok || !data) throw new LearnerMessage(response.status === 401 ? 'Please sign in again, then reload Word Lab.' : 'Your saved practice could not load. Check your connection and reload.');
          storageKey.current = `word-rescue-pending:${data.userId}:${assignmentId ?? 'global'}`;
          next = data.state;
          if (!cancelled) {
            const available: RescueCollection[] = data.collections ?? [];
            setCollections(available);
            const selected = available.find(set => set.id === requestedCollection && set.sourceActivityId) ?? available.find(set => set.sourceActivityId);
            setWeek(selected?.id ?? '');
            if (selected && requestedCollection) setWeekly(true);
            if (requestedCollection && requestedCollection !== 'again' && !available.some(set => set.id === requestedCollection)) setNotice('That week is not released for your class yet. Choose an available collection.');
          }
        }
        if (cancelled) return;
        accept(next);
        if (next.session?.said) setStage(2);
        else if (next.session?.heard.includes('word')) setStage(1);
        try {
          const storedPending = localStorage.getItem(storageKey.current);
          if (storedPending) { const action = JSON.parse(storedPending); pendingRef.current = action; setPending(action); }
        } catch { setNotice('Device storage is unavailable. Keep this page open until practice is saved.'); }
        setLoaded(true);
      } catch (failure) { if (!cancelled) setError(failure instanceof LearnerMessage ? failure.message : 'Your saved practice could not load. Check your connection and reload.'); }
    }
    void load();
    return () => { cancelled = true; };
  }, [accept, assignmentId, preview, requestedCollection]);
  useEffect(() => {
    const retry = () => { if (pendingRef.current && !sending.current) void send(pendingRef.current, true); };
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [send]);

  useEffect(() => {
    const launchCollection = requestedCollection === 'again' && !fromMap ? { id: 'again' } : fromMap ? selectedCollection : null;
    if (!loaded || disabled || !launchCollection || launched.current) return;
    launched.current = true;
    if (launchCollection.id === 'again' && !revisitCount && !(session?.collectionId === 'again' && session.index < session.wordIds.length)) {
      setMenu(true);
      setNotice('No words saved for later yet. Choose Practice again later after practicing a word.');
      return;
    }
    void send({ type: 'start', id: crypto.randomUUID(), collectionId: launchCollection.id, mode: fromMap ? 'weekly' : 'standalone' }).then(ok => {
      if (!ok) return;
      setMenu(false);
      const current = latest.current.session;
      setStage(current?.said ? 2 : current?.heard.includes('word') ? 1 : 0);
      setHelpOpen(false);
      focusSoon(wordHeading);
    });
  }, [fromMap, requestedCollection, revisitCount, loaded, disabled, selectedCollection, collections, session, send]);

  // Fetch the clips this stage needs before the learner taps.
  const wordId = active ? word?.id : undefined;
  const { preload } = audio;
  useEffect(() => {
    if (!wordId) return;
    preload(stage === 0 ? [rescueAudioPath(wordId, 'word')] : [rescueAudioPath(wordId, 'phrase'), rescueAudioPath(wordId, 'sentence')]);
  }, [wordId, stage, preload]);

  const startCollection = async (collectionId: string) => {
    audio.reset();
    if (!await send({ type: 'start', id: crypto.randomUUID(), collectionId })) return;
    const current = latest.current.session;
    setReceipt(null);
    setSavedWordId(null);
    setMenu(false);
    setStage(current?.said ? 2 : current?.heard.includes('word') ? 1 : 0);
    setHelpOpen(false);
    focusSoon(wordHeading);
  };
  const openMenu = () => {
    audio.reset(); setReceipt(null); setSavedWordId(null);
    setStage(session?.said ? 2 : session?.heard.includes('word') ? 1 : 0);
    setMenu(true); focusSoon(menuHeading);
  };

  const move = (next: 0 | 1 | 2) => { audio.stop(); setStage(next); requestAnimationFrame(() => sectionButtons.current[next]?.focus({ preventScroll: true })); };
  const play = (clip: ClipKind, rate: number, device = false) => {
    if (!word || !session || disabled) return;
    const onEnded = () => {
      if (!receipt && !session.heard.includes(clip)) void send({ type: 'heard', sessionId: session.id, wordId: word.id, clip });
    };
    setLastClip({ clip, rate });
    setNowPlaying(`${clip}:${rate}`);
    if (device) audio.speak(clipText(word, clip), rate, onEnded);
    else void audio.play(rescueAudioPath(word.id, clip), rate, onEnded);
  };
  const isPlaying = (key: string) => audio.busy && nowPlaying === key;
  const audioButton = (clip: ClipKind, rate: number) => {
    const playing = isPlaying(`${clip}:${rate}`);
    const label = clip === 'word' ? (rate === 1 ? 'Hear normally' : 'Hear slowly') : (rate === 1 ? 'Normal' : 'Slow');
    return <button className={styles.audio} data-playing={playing || undefined} disabled={disabled || audio.recording || audio.permissionPending} onClick={() => play(clip, rate)}>
      {playing ? <span className={styles.bars} aria-hidden><i /><i /><i /></span> : <Volume2 aria-hidden size={22} />}
      <span>{label}<span className="sr-only">: the {clip}</span></span>
      <small>{rate === 1 ? '1× speed' : '0.7× speed'}</small>
    </button>;
  };
  const audioControls = (clip: ClipKind) => <div className={styles.audioRow}>{audioButton(clip, 1)}{audioButton(clip, .7)}</div>;
  const chooseLanguage = (language: HelpLanguage) => { void send({ type: 'language', language }); };
  const hint = word?.help?.[state.language];
  const languageHelp = word && <section className={styles.help}>
    <button className={styles.helpToggle} onClick={() => setHelpOpen(value => !value)} aria-expanded={helpOpen} aria-controls="rescue-language-help"><Globe size={20} aria-hidden /><span>Help in my language</span>{helpOpen ? <ChevronUp aria-hidden size={20} /> : <ChevronDown aria-hidden size={20} />}</button>
    {helpOpen && <div id="rescue-language-help" className={styles.helpBody}>
      <div className={styles.languages} role="group" aria-label="Help language"><button lang="es" disabled={disabled} aria-pressed={state.language === 'es'} onClick={() => chooseLanguage('es')}>Español</button><button lang="pt-BR" disabled={disabled} aria-pressed={state.language === 'pt-BR'} onClick={() => chooseLanguage('pt-BR')}>Português (Brasil)</button></div>
      <div lang={state.language}>
        <p className={styles.muted}>{state.language === 'es' ? 'Guía aproximada · escucha el audio' : 'Guia aproximado · ouça o áudio'}</p>
        {RESCUE_WORD_PARTS[word.term] && <div className={styles.wordParts}><p className={styles.muted}>{state.language === 'es' ? 'La palabra por partes' : 'A palavra em partes'}</p><p className={styles.soundGuide} lang="en"><span className="sr-only">{word.term}</span><span aria-hidden>{RESCUE_WORD_PARTS[word.term]}</span></p></div>}
        {hint?.sounds && <p className={styles.soundGuide}>{hint.sounds}</p>}
        <ul className={styles.tips}>{(hint?.tips ?? (state.language === 'es' ? ['Escucha la palabra despacio y después a velocidad normal.', 'Repite con el audio. La guía de sonidos para esta palabra todavía está en preparación.'] : ['Ouça a palavra devagar e depois na velocidade normal.', 'Repita com o áudio. O guia de sons desta palavra ainda está em preparação.'])).map(tip => {
          const colon = tip.indexOf(':');
          return <li key={tip}>{colon >= 0 ? <><strong>{tip.slice(0, colon + 1)}</strong>{tip.slice(colon + 1)}</> : tip}</li>;
        })}</ul>
      </div>
    </div>}
  </section>;

  const stepToggle = (index: 0 | 1 | 2, id: string, label: string, done: boolean, locked: boolean) => <h2 className={styles.sectionHeading}>
    <button ref={node => { sectionButtons.current[index] = node; }} className={styles.sectionToggle} id={`${id}-heading`} aria-expanded={stage === index} aria-controls={id} disabled={audio.recording || audio.permissionPending || locked} onClick={() => move(index)}>
      <span className={styles.stepNumber} data-done={done || undefined}>{done ? <Check size={16} strokeWidth={3} aria-hidden /> : index + 1}</span>
      <span>{label}{done && <span className="sr-only"> (done)</span>}</span>
      {stage === index ? <ChevronUp size={20} aria-hidden /> : <ChevronDown size={20} aria-hidden />}
    </button>
  </h2>;
  const heardWord = !!receipt || !!session?.heard.includes('word');
  const heardSentence = !!receipt || !!session?.heard.includes('sentence');
  const said = !!receipt || !!session?.said;

  return <div className={styles.root}>
    {wordReward && <WordRewardToast key={wordReward.id} points={wordReward.points} onComplete={clearWordReward} />}
    <div className={styles.inner}>
    {preview && <div className={styles.preview}>Teacher preview · draft audio and language guides · no account points</div>}
    <header className={styles.header}>
      <div className={styles.brand}>
        {active && !fromMap ? <button aria-label="Back to word collections" className={styles.iconButton} onClick={openMenu}><ArrowLeft aria-hidden size={24} /></button> : <a href={returnHref} aria-label={requestedCollection === 'again' ? 'Back to dashboard' : requestedCollection ? 'Back to course map' : 'Back to pronunciation activities'} className={styles.iconButton}><ArrowLeft aria-hidden size={24} /></a>}
        <span>Word Lab</span>
      </div>
      {active && session && <div className={styles.progress}>
        <span className={styles.progressText}>{receipt ? session.index : session.index + 1} of {session.wordIds.length}</span>
        <span className={styles.progressTrack} aria-hidden>{session.wordIds.map((id, index) => <i key={id} data-state={session.finished[id] ? 'done' : index === session.index ? 'current' : undefined} />)}</span>
      </div>}
    </header>
    {loaded && sessionLocked && <p role="status" className={styles.status}>Your saved session is kept safe. Its week must be released before you can continue.</p>}
    {notice && <p role="status" className={styles.status}>{notice}</p>}
    {(error || (pending && !saving)) && <div className={styles.error} role="alert"><p>{error || 'An earlier practice step is waiting to save.'}</p>{pending && <button className={styles.secondary} disabled={saving} onClick={() => void send(pending, true)}>{saving ? 'Saving…' : 'Retry save'}</button>}{!loaded && <button className={styles.secondary} onClick={() => window.location.reload()}>Reload saved practice</button>}</div>}
    {!loaded && !error ? <p role="status" className={styles.loading}>Loading your practice…</p> : !active ? <section className={styles.menu}>
      <h1 ref={menuHeading} tabIndex={-1} className={styles.heading}>{session && session.index >= session.wordIds.length && !menu ? 'A little more confident.' : 'Which words today?'}</h1>
      {selectedCollection && <p className={styles.status}>This week: {selectedCollection.label}</p>}
      <p className={styles.subtitle}>{fromMap ? `Practice all ${weeklyWordCount} weekly words. Earn ${weeklyWordCount * WORD_RESCUE_POINTS} points.` : 'Three words. A few small steps. Listen, try, and make them your own.'}</p>
      {word && !sessionLocked && <div className={styles.resume}><p className={styles.muted}>Your practice is saved.</p><button className={styles.primary} disabled={disabled} onClick={() => { setMenu(false); focusSoon(wordHeading); }}>Resume practice: {word.term}<ArrowRight aria-hidden size={20} /></button></div>}
      {!fromMap && <div className={styles.collections}>
        <div className={styles.collectionGroup} data-open={weekly || undefined}>
          <button className={styles.collection} disabled={disabled} onClick={() => setWeekly(value => !value)} aria-expanded={weekly}>
            <span className={styles.collectionIcon} data-tone="green" aria-hidden><CalendarDays size={22} /></span>
            <span className={styles.collectionText}>This week’s words<small>Choose the week your class is studying</small></span>
            {weekly ? <ChevronUp aria-hidden size={20} /> : <ChevronDown aria-hidden size={20} />}
          </button>
          {weekly && !collections.some(set => set.sourceActivityId) && <p className={`${styles.muted} ${styles.weekPanel}`}>Your teacher hasn’t released any vocabulary weeks yet. You can practice everyday words.</p>}
          {weekly && collections.some(set => set.sourceActivityId) && <div className={styles.weekPanel}><label className={styles.label} htmlFor="rescue-week">Class vocabulary week</label><select className={styles.select} id="rescue-week" value={week} onChange={event => setWeek(event.target.value)}>{collections.filter(item => item.sourceActivityId).map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select><button disabled={disabled || !week} className={styles.primary} onClick={() => void startCollection(week)}>Practice this week<ArrowRight aria-hidden size={20} /></button></div>}
        </div>
        <button className={styles.collection} disabled={disabled} onClick={() => void startCollection('everyday')}>
          <span className={styles.collectionIcon} data-tone="rust" aria-hidden><Sparkles size={22} /></span>
          <span className={styles.collectionText}>Everyday tricky words<small>Through, prohibited, achieve, and more</small></span>
          <ChevronRight aria-hidden size={20} />
        </button>
        <button className={styles.collection} disabled={disabled || !revisitCount} onClick={() => void startCollection('again')}>
          <span className={styles.collectionIcon} data-tone="ink" aria-hidden><RotateCcw size={22} /></span>
          <span className={styles.collectionText}>Practice again<small>{revisitCount ? `${revisitCount} ${revisitCount === 1 ? 'word' : 'words'} you chose to revisit` : 'Words you save for later appear here'}</small></span>
          {revisitCount > 0 && <span className={styles.count} aria-hidden>{revisitCount}</span>}
          <ChevronRight aria-hidden size={20} />
        </button>
      </div>}
      {fromMap && <a className={styles.primary} href={returnHref}>Back to course map</a>}
      <p className={`${styles.muted} ${styles.footnote}`}>Earn {WORD_RESCUE_POINTS} points for each word you practice. Recording is always optional.</p>
    </section> : word && session && <section>
      <div key={word.id} className={styles.wordHeader}>
        <h1 ref={wordHeading} tabIndex={-1} className={styles.word}>{highlighted(word)}</h1>
        <p className={styles.meaning}>{word.definition}</p>
      </div>
      <div className={styles.accordion} data-current={stage === 0 || undefined}>
        {stepToggle(0, 'rescue-listen', heardWord ? 'Listened' : 'Listen & get help', heardWord, false)}
        <div id="rescue-listen" role="region" aria-labelledby="rescue-listen-heading" hidden={stage !== 0} className={styles.sectionBody}>
          {audioControls('word')}
          {word.clue && <p className={styles.clue}><Lightbulb aria-hidden size={20} /><span>{word.clue}</span></p>}
          {languageHelp}
          <button className={styles.primary} disabled={disabled || !heardWord} aria-describedby={heardWord ? undefined : 'rescue-listen-hint'} onClick={() => move(1)}>Ready to practice<ArrowRight aria-hidden size={20} /></button>
          {!heardWord && <p id="rescue-listen-hint" className={styles.gate}>Listen to the word once to continue.</p>}
        </div>
      </div>
      <div className={styles.accordion} data-current={stage === 1 || undefined}>
        {stepToggle(1, 'rescue-build', said ? 'Practiced' : 'Build & say', said, !heardWord)}
        <div id="rescue-build" role="region" aria-labelledby="rescue-build-heading" hidden={stage !== 1} className={styles.sectionBody}>
          <div className={styles.practiceLine}><p className={styles.phrase}>{word.phrase}</p>{audioControls('phrase')}</div>
          <div className={styles.practiceLine}><p className={styles.phrase}>{word.sentence}</p>{audioControls('sentence')}</div>
          <div className={styles.recording}>
            <p className={`${styles.recordingStatus} ${audio.recording ? styles.recordingActive : styles.muted}`} role="status" aria-atomic="true">
              {audio.recording ? <><span className={styles.recordingDot} aria-hidden="true" />Recording… speak now</> : 'Optional · hear yourself'}
            </p>
            <button className={`${styles.secondary} ${audio.recording ? styles.recordingStop : ''}`} disabled={disabled || audio.permissionPending} onClick={() => { if (audio.recording) audio.stopRecording(); else void audio.record(); }}>{audio.recording ? <><Square aria-hidden size={18} /> Stop recording</> : <><Mic aria-hidden size={18} /> {audio.permissionPending ? 'Waiting for microphone…' : audio.hasRecording ? 'Record again' : 'Record myself'}</>}</button>
            {audio.hasRecording && <button className={`${styles.secondary} ${styles.recordingReady}`} disabled={audio.recording} onClick={() => { setNowPlaying('self'); audio.listenToMe(); }}>{isPlaying('self') ? <span className={styles.bars} aria-hidden><i /><i /><i /></span> : <Volume2 aria-hidden size={18} />} Listen to yourself</button>}
            <p className={`${styles.muted} ${styles.privacy}`}>Only on this device. Deleted when you leave this word. Up to one minute.</p>
          </div>
          <button className={styles.primary} disabled={disabled || audio.recording || audio.permissionPending || !heardSentence} aria-describedby={heardSentence ? undefined : 'rescue-build-hint'} onClick={async () => { audio.stop(); if (receipt || session.said) move(2); else if (await send({ type: 'said', sessionId: session.id, wordId: word.id })) move(2); }}>I practiced it<Check aria-hidden size={20} /></button>
          {!heardSentence && <p id="rescue-build-hint" className={styles.gate}>Listen to the sentence once to continue.</p>}
        </div>
      </div>
      <div className={styles.accordion} data-current={stage === 2 || undefined}>
        {stepToggle(2, 'rescue-reflect', 'How does it feel?', !!receipt, !said)}
        <div id="rescue-reflect" role="region" aria-labelledby="rescue-reflect-heading" hidden={stage !== 2} className={styles.sectionBody}>
          <div className={styles.reflections}>
            {(['easier', 'again'] as const).map(confidence => {
              const chosen = !!receipt && session.finished[word.id] === confidence;
              return <button key={confidence} className={styles.reflection} data-chosen={chosen || undefined} disabled={disabled || !!receipt || !session.said} onClick={() => { audio.reset(); void send({ type: 'finish', sessionId: session.id, wordId: word.id, confidence }); }}>
                {chosen ? <Check size={22} aria-hidden /> : confidence === 'easier' ? <ThumbsUp size={22} aria-hidden /> : <RotateCcw size={22} aria-hidden />}
                <span>{confidence === 'easier' ? 'Feels easier' : 'Practice again later'}{chosen && <span className="sr-only"> (your choice)</span>}</span>
              </button>;
            })}
          </div>
          {receipt ? <>
            {roundComplete ? <div className={styles.roundReward} role="status">
              <strong className={styles.rewardTotal}>{preview ? `${roundPoints} practice points` : `+${roundPoints} points`}</strong>
              <p>{preview ? 'Round complete. Preview only, no account points awarded.' : `You practiced all ${session.wordIds.length} words. Your points are saved!`}</p>
              <ul className={styles.roundWords}>{session.wordIds.map(id => <li key={id} data-again={session.finished[id] === 'again' || undefined}>{session.finished[id] === 'again' ? <RotateCcw size={14} aria-hidden /> : <Check size={14} strokeWidth={3} aria-hidden />}{RESCUE_WORD_BY_ID[id]?.term}{session.finished[id] === 'again' && <span className="sr-only"> (saved to practice again)</span>}</li>)}</ul>
            </div> : <p className={styles.status} role="status">{receipt}</p>}
            {roundComplete && (fromMap || requestedCollection === 'again') ? <a className={styles.primary} href={returnHref}>{fromMap ? 'Back to course map' : 'Back to dashboard'}<ArrowRight size={20} aria-hidden /></a> : <button className={styles.primary} onClick={() => { audio.reset(); setReceipt(null); setSavedWordId(null); setStage(0); setHelpOpen(false); if (roundComplete) { setMenu(true); focusSoon(menuHeading); } else focusSoon(wordHeading); }}>{roundComplete ? 'Choose more words' : 'Next word'}<ArrowRight size={20} aria-hidden /></button>}
          </> : <p className={`${styles.muted} ${styles.footnote}`}>Either choice earns {WORD_RESCUE_POINTS} practice points.</p>}
        </div>
      </div>
      <button className={`${styles.secondary} ${styles.stopAudio}`} disabled={!audio.busy} onClick={audio.stop}><Square aria-hidden size={16} />Stop audio</button>
      {audio.error && <div role="alert" className={styles.error}><p>{audio.error}</p><button className={styles.secondary} disabled={disabled} onClick={() => play(lastClip.clip, lastClip.rate)}>Retry audio</button><button className={styles.secondary} disabled={disabled} onClick={() => play(lastClip.clip, lastClip.rate, true)}>Use device voice</button><p className={styles.muted}>Device voices vary. Listen to your teacher’s model when available.</p></div>}
      <p role="status" className={`${styles.muted} ${styles.saveStatus}`}>{showSaving ? 'Saving practice…' : ' '}</p>
    </section>}
    {preview && <button className={`${styles.secondary} ${styles.resetPreview}`} onClick={() => { audio.reset(); accept(emptyRescueProgress()); savePending(null); setReceipt(null); setMenu(false); setStage(0); setHelpOpen(false); setError(''); try { localStorage.removeItem('word-rescue-preview-state'); } catch { /* nothing stored */ } }}>Reset preview</button>}
  </div></div>;
}

function highlighted(word: RescueWord) {
  const index = word.highlight ? word.term.indexOf(word.highlight) : -1;
  if (index < 0 || !word.highlight) return word.term;
  return <>{word.term.slice(0, index)}<mark>{word.highlight}</mark>{word.term.slice(index + word.highlight.length)}</>;
}
