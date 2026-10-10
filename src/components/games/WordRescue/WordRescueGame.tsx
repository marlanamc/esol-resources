'use client';

import { sanitizeInternalHref } from '@/lib/learner/navigation';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, Globe, Lightbulb, Mic, Square, Volume2 } from 'lucide-react';
import { RESCUE_COLLECTIONS, RESCUE_WORD_BY_ID, rescueAudioPath } from '@/lib/word-rescue/content';
import { applyRescueAction, emptyRescueProgress } from '@/lib/word-rescue/progression';
import { WORD_RESCUE_POINTS } from '@/lib/word-rescue/types';
import type { ClipKind, RescueCollection, HelpLanguage, RescueAction, RescueProgress, RescueResult, RescueWord } from '@/lib/word-rescue/types';
import { useRescueAudio } from './useRescueAudio';
import styles from './WordRescue.module.css';

const clipText = (word: RescueWord, clip: ClipKind) => clip === 'word' ? word.term : word[clip];
export default function WordRescueGame({ preview = false, assignmentId = null }: { preview?: boolean; assignmentId?: string | null }) {
  const searchParams = useSearchParams();
  const requestedCollection = searchParams.get('collection');
  const fromMap = searchParams.get('fromMap') === '1';
  const launched = useRef(false);
  const returnHref = sanitizeInternalHref(searchParams.get('returnTo')) ?? (requestedCollection ? '/dashboard/map' : '/dashboard/activities?category=pronunciation');
  const [collections, setCollections] = useState<RescueCollection[]>(preview ? RESCUE_COLLECTIONS : []);
  const selectedCollection = collections.find(set => set.id === requestedCollection);
  const [state, setState] = useState<RescueProgress>(emptyRescueProgress);
  const latest = useRef(state);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const sending = useRef(false);
  const [pending, setPending] = useState<RescueAction | null>(null);
  const pendingRef = useRef<RescueAction | null>(null);
  const storageKey = useRef('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [weekly, setWeekly] = useState(!!selectedCollection);
  const [week, setWeek] = useState(selectedCollection?.id ?? collections[1]?.id ?? 'everyday');
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [buildStep, setBuildStep] = useState<0 | 1>(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [lastClip, setLastClip] = useState<{ clip: ClipKind; rate: number }>({ clip: 'word', rate: 1 });
  const audio = useRescueAudio();
  const session = state.session;
  const word = session ? RESCUE_WORD_BY_ID[session.wordIds[session.index]] : null;
  const allowedWords = new Set(collections.flatMap(set => set.wordIds));
  const sessionLocked = !!session && session.index < session.wordIds.length && session.wordIds.some(id => !allowedWords.has(id));
  const revisitCount = Object.entries(state.words).filter(([id, item]) => allowedWords.has(id) && item.confidence === 'again').length;
  const roundComplete = !!session && session.wordIds.length > 0 && session.wordIds.every(id => !!session.finished[id]);
  const roundPoints = roundComplete ? session!.wordIds.length * WORD_RESCUE_POINTS : 0;
  const active = !!word && !menu && !sessionLocked;
  const disabled = saving || !!pending || !loaded;
  const stepTitle = useRef<HTMLHeadingElement | null>(null);

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
        localStorage.setItem('word-rescue-preview-state', JSON.stringify(result.state));
      } else {
        const response = await fetch('/api/word-rescue', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, assignmentId }), signal: AbortSignal.timeout(20000) });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Please retry saving your practice.');
        result = body;
      }
      accept(result.state); savePending(null);
      if (action.type === 'finish') {
        setReceipt(preview ? 'Practice complete. Preview only — no account points awarded.' : result.pointsAwarded ? 'Practice saved. +2 points.' : 'Practice saved. Your 2 points were already credited.');
        window.dispatchEvent(new Event('activity-progress-updated'));
      }
      return true;
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Your practice could not be saved. Please retry.');
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
          const stored = localStorage.getItem('word-rescue-preview-state');
          next = stored ? JSON.parse(stored) : emptyRescueProgress();
        } else {
          const response = await fetch('/api/word-rescue', { signal: AbortSignal.timeout(20000) });
          if (!response.ok) throw new Error('Saved practice could not be loaded. Please sign in and reload.');
          const data = await response.json();
          storageKey.current = `word-rescue-pending:${data.userId}:${assignmentId ?? 'global'}`;
          next = data.state;
          if (!cancelled) {
            const available: RescueCollection[] = data.collections ?? [];
            setCollections(available);
            const selected = available.find(set => set.id === requestedCollection && set.sourceActivityId) ?? available.find(set => set.sourceActivityId);
            setWeek(selected?.id ?? '');
            if (selected && requestedCollection) setWeekly(true);
            if (requestedCollection && !available.some(set => set.id === requestedCollection)) setNotice('That week is not released for your class yet. Choose an available collection.');
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
      } catch (failure) { if (!cancelled) setError(failure instanceof Error ? failure.message : 'Please reload your saved practice.'); }
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
    if (!fromMap || !loaded || disabled || !selectedCollection || launched.current) return;
    launched.current = true;
    void send({ type: 'start', id: crypto.randomUUID(), collectionId: selectedCollection.id }).then(ok => {
      if (!ok) return;
      setMenu(false);
      const current = latest.current.session;
      setStage(current?.said ? 2 : current?.heard.includes('word') ? 1 : 0);
      setBuildStep(0);
    });
  }, [fromMap, loaded, disabled, selectedCollection, send]);

  const move = (next: 0 | 1 | 2) => { audio.stop(); setStage(next); requestAnimationFrame(() => stepTitle.current?.focus()); };
  const play = (clip: ClipKind, rate: number, device = false) => {
    if (!word || !session || disabled) return;
    const onEnded = () => {
      if (!session.heard.includes(clip)) void send({ type: 'heard', sessionId: session.id, wordId: word.id, clip });
    };
    setLastClip({ clip, rate });
    if (device) audio.speak(clipText(word, clip), rate, onEnded);
    else void audio.play(rescueAudioPath(word.id, clip), rate, onEnded);
  };
  const audioControls = (clip: ClipKind) => <div className={styles.audioRow}>
    <button className={styles.audio} disabled={disabled || audio.recording || audio.permissionPending} onClick={() => play(clip, 1)}><Volume2 aria-hidden size={23} /><span>Hear normally</span><small>1× speed</small></button>
    <button className={styles.audio} disabled={disabled || audio.recording || audio.permissionPending} onClick={() => play(clip, .7)}><Volume2 aria-hidden size={23} /><span>Hear slowly</span><small>0.7× speed</small></button>
  </div>;
  const chooseLanguage = (language: HelpLanguage) => { void send({ type: 'language', language }); };
  const hint = word?.help?.[state.language];
  const languageHelp = word && <section className={styles.help}>
    <button className={styles.helpToggle} onClick={() => setHelpOpen(value => !value)} aria-expanded={helpOpen} aria-controls="rescue-language-help"><Globe size={21} aria-hidden /><span>Help in my language</span>{helpOpen ? <ChevronUp aria-hidden size={20} /> : <ChevronDown aria-hidden size={20} />}</button>
    {helpOpen && <div id="rescue-language-help">
      <div className={styles.languages} role="group" aria-label="Help language"><button lang="es" disabled={disabled} aria-pressed={state.language === 'es'} onClick={() => chooseLanguage('es')}>Español</button><button lang="pt-BR" disabled={disabled} aria-pressed={state.language === 'pt-BR'} onClick={() => chooseLanguage('pt-BR')}>Português (Brasil)</button></div>
      <div lang={state.language}>
        <p className={styles.muted}>{state.language === 'es' ? 'Guía aproximada · escucha el audio' : 'Guia aproximado · ouça o áudio'}</p>
        {hint?.sounds && <p className={styles.soundGuide}>{hint.sounds}</p>}
        <ul className={styles.tips}>{(hint?.tips ?? (state.language === 'es' ? ['Escucha la palabra despacio y después a velocidad normal.', 'Repite con el audio. La guía de sonidos para esta palabra todavía está en preparación.'] : ['Ouça a palavra devagar e depois na velocidade normal.', 'Repita com o áudio. O guia de sons desta palavra ainda está em preparação.'])).map(tip => {
          const colon = tip.indexOf(':');
          return <li key={tip}>{colon >= 0 ? <><strong>{tip.slice(0, colon + 1)}</strong>{tip.slice(colon + 1)}</> : tip}</li>;
        })}</ul>
      </div>
    </div>}
  </section>;

  return <div className={styles.root}><div className={styles.inner}>
    {preview && <div className={styles.preview}>Teacher preview · draft audio and language guides · no account points</div>}
    <header className={styles.header}><div className={styles.brand}>
      {active && !fromMap ? <button aria-label="Back to word collections" className={styles.iconButton} onClick={() => { audio.reset(); setMenu(true); }}><ArrowLeft aria-hidden size={24} /></button> : <a href={returnHref} aria-label={requestedCollection ? "Back to course map" : "Back to pronunciation activities"} className={styles.iconButton}><ArrowLeft aria-hidden size={24} /></a>}
      <span>Word Rescue</span></div><span className={styles.muted}>{active && session ? `${session.index + 1} of ${session.wordIds.length}` : ''}</span></header>
    {loaded && sessionLocked && <p role="status" className={styles.status}>Your saved session is kept safe. Its week must be released before you can continue.</p>}
    {notice && <p role="status" className={styles.status}>{notice}</p>}
    {(error || pending) && <div className={styles.error} role="alert"><p>{error || 'An earlier practice step is waiting to save.'}</p>{pending && <button className={styles.secondary} disabled={saving} onClick={() => void send(pending, true)}>{saving ? 'Saving…' : 'Retry save'}</button>}{!loaded && <button className={styles.secondary} onClick={() => window.location.reload()}>Reload saved practice</button>}</div>}
    {!loaded && !error ? <p role="status">Loading your practice…</p> : receipt ? <section aria-live="polite" aria-atomic="true"><Check aria-hidden size={32} /><h1 className={styles.heading}>{roundComplete ? 'Round complete!' : 'Your practice counts.'}</h1>{roundComplete ? <div className={styles.roundReward}><strong className={styles.rewardTotal}>{preview ? `${roundPoints} practice points` : `+${roundPoints} points earned`}</strong><p>{preview ? 'A full round earns these points in the live activity. No account points are awarded in preview.' : `You practiced ${session!.wordIds.length} words. Your points are saved!`}</p></div> : <p className={styles.status}>{receipt}</p>}{fromMap && !word ? <a className={styles.primary} href={returnHref}>Back to course map<ArrowRight aria-hidden size={20} /></a> : <button className={styles.primary} onClick={() => { audio.reset(); setReceipt(null); setStage(0); setBuildStep(0); }}>{word ? 'Next word' : 'See my practice'}<ArrowRight aria-hidden size={20} /></button>}</section> : !active ? <section>
      <h1 className={styles.heading}>{session && session.index >= session.wordIds.length && !menu ? 'A little more confident.' : 'Which words today?'}</h1>
      {selectedCollection && <p className={styles.status}>This week: {selectedCollection.label}</p>}
      <p className={styles.subtitle}>Three words. A few small steps. Listen, try, and make them your own.</p>
      {word && !sessionLocked && <button className={styles.primary} disabled={disabled} onClick={() => setMenu(false)}>Continue {word.term}<ArrowRight aria-hidden size={20} /></button>}
      {!fromMap && <div className={styles.collections}>
        <button className={styles.collection} disabled={disabled || !!word} onClick={() => setWeekly(value => !value)} aria-expanded={weekly}>This week’s words<small>Choose the week your class is studying</small></button>
        {weekly && !collections.some(set => set.sourceActivityId) && <p className={styles.muted}>Your teacher hasn’t released any vocabulary weeks yet. You can practice everyday words.</p>}
        {weekly && collections.some(set => set.sourceActivityId) && <div><label htmlFor="rescue-week">Class vocabulary week</label><select className={styles.select} id="rescue-week" value={week} onChange={event => setWeek(event.target.value)}>{collections.filter(item => item.sourceActivityId).map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select><button disabled={disabled || !!word || !week} className={styles.primary} onClick={async () => { if (await send({ type: 'start', id: crypto.randomUUID(), collectionId: week })) { setMenu(false); setStage(0); setBuildStep(0); } }}>Practice this week<ArrowRight aria-hidden size={20} /></button></div>}
        <button className={styles.collection} disabled={disabled || !!word} onClick={async () => { if (await send({ type: 'start', id: crypto.randomUUID(), collectionId: 'everyday' })) { setMenu(false); setStage(0); setBuildStep(0); } }}>Everyday tricky words<small>Through, prohibited, achieve, and more</small></button>
        <button className={styles.collection} disabled={disabled || !!word || !revisitCount} onClick={async () => { if (await send({ type: 'start', id: crypto.randomUUID(), collectionId: 'again' })) { setMenu(false); setStage(0); setBuildStep(0); } }}>Practice again<small>{revisitCount} words you chose to revisit</small></button>
      </div>}
      {fromMap && <a className={styles.primary} href={returnHref}>Back to course map</a>}
      <p className={styles.muted} style={{ marginTop: 20 }}>{word ? 'Finish your saved session before starting another collection.' : 'Earn 2 points for each word you practice. Recording is always optional.'}</p>
    </section> : word && session && <section>
      <ol className={styles.steps} aria-label="Practice steps">{['Hear', 'Build', 'Try'].map((label, index) => <li key={label} aria-current={stage === index ? 'step' : undefined}>{label}</li>)}</ol>
      <h1 ref={stepTitle} tabIndex={-1} className={stage === 0 ? styles.word : styles.heading}>{stage === 0 ? highlighted(word) : stage === 1 ? 'Build it up.' : 'Make it your own.'}</h1>
      {stage === 0 ? <>
        <p className={styles.meaning}>{word.definition}</p>{audioControls('word')}
        {word.clue && <p className={styles.clue}><Lightbulb aria-hidden size={21} /><span>{word.clue}</span></p>}
        {languageHelp}
        <button className={styles.primary} disabled={disabled || !session.heard.includes('word')} onClick={() => move(1)}>Build it up<ArrowRight aria-hidden size={20} /></button>
        <p className={styles.muted} style={{ textAlign: 'center', marginTop: 10 }}>{session.heard.includes('word') ? 'Your practice counts.' : 'Listen to the whole word to continue.'}</p>
      </> : stage === 1 ? <>
        <p className={styles.subtitle}>Listen, say it, then add a little more.</p>
        <p className={styles.muted}>{buildStep === 0 ? 'A SHORT PHRASE' : 'THE WHOLE SENTENCE'}</p>
        <p className={styles.phrase}>{buildStep === 0 ? word.phrase : word.sentence}</p>
        {audioControls(buildStep === 0 ? 'phrase' : 'sentence')}
        <button className={styles.primary} disabled={disabled || !session.heard.includes(buildStep === 0 ? 'phrase' : 'sentence')} onClick={() => { audio.stop(); if (buildStep === 0) setBuildStep(1); else move(2); }}> {buildStep === 0 ? 'Try the sentence' : 'Ready to try'}<ArrowRight aria-hidden size={20} /></button>
        <button className={styles.secondary} onClick={() => { if (buildStep === 1) { audio.stop(); setBuildStep(0); } else move(0); }}>Go back a step</button>
      </> : <>
        <p className={styles.subtitle}>Say the sentence aloud. Take your time.</p><p className={styles.phrase}>{word.sentence}</p>{audioControls('sentence')}
        <div className={styles.recording}><p className={styles.muted}>Optional · hear yourself</p>
          <button className={styles.secondary} disabled={disabled || audio.permissionPending} onClick={() => { if (audio.recording) audio.stopRecording(); else void audio.record(); }}>{audio.recording ? <><Square aria-hidden size={18} /> Stop recording</> : <><Mic aria-hidden size={18} /> {audio.permissionPending ? 'Waiting for microphone…' : audio.hasRecording ? 'Record again' : 'Record myself'}</>}</button>
          {audio.hasRecording && <button className={styles.secondary} onClick={audio.listenToMe}><Volume2 aria-hidden size={18} /> Listen to me</button>}
          <p className={styles.muted} style={{ marginTop: 8 }}>Only on this device. Deleted when you leave this word. Up to one minute.</p>
        </div>
        {!session.said ? <button className={styles.primary} disabled={disabled || audio.recording || audio.permissionPending} onClick={() => { audio.stop(); void send({ type: 'said', sessionId: session.id, wordId: word.id }); }}>I said it aloud<Check aria-hidden size={20} /></button> : <>
          <p className={styles.subtitle} style={{ marginTop: 24 }}>You practiced. How does it feel?</p>
          <button className={styles.primary} disabled={disabled || audio.recording || audio.permissionPending} onClick={() => { audio.reset(); void send({ type: 'finish', sessionId: session.id, wordId: word.id, confidence: 'easier' }); }}>Feels easier</button>
          <button className={styles.secondary} disabled={disabled || audio.recording || audio.permissionPending} onClick={() => { audio.reset(); void send({ type: 'finish', sessionId: session.id, wordId: word.id, confidence: 'again' }); }}>Practice again</button>
          <p className={styles.muted} style={{ textAlign: 'center', marginTop: 10 }}>Either choice earns 2 practice points.</p>
        </>}
      </>}
      {audio.busy && <button className={styles.secondary} onClick={audio.stop}>Stop audio</button>}
      {audio.error && <div role="alert" className={styles.error}><p>{audio.error}</p><button className={styles.secondary} disabled={disabled} onClick={() => play(lastClip.clip, lastClip.rate)}>Retry audio</button><button className={styles.secondary} disabled={disabled} onClick={() => play(lastClip.clip, lastClip.rate, true)}>Use device voice</button><p className={styles.muted}>Device voices vary. Listen to your teacher’s model when available.</p></div>}
      {saving && <p role="status" className={styles.muted}>Saving practice…</p>}
    </section>}
    {preview && <button className={styles.secondary} style={{ marginTop: 40 }} onClick={() => { audio.reset(); accept(emptyRescueProgress()); savePending(null); setReceipt(null); setMenu(false); setStage(0); setBuildStep(0); setError(''); localStorage.removeItem('word-rescue-preview-state'); }}>Reset preview</button>}
  </div></div>;
}

function highlighted(word: RescueWord) {
  const index = word.highlight ? word.term.indexOf(word.highlight) : -1;
  if (index < 0 || !word.highlight) return word.term;
  return <>{word.term.slice(0, index)}<mark>{word.highlight}</mark>{word.term.slice(index + word.highlight.length)}</>;
}
