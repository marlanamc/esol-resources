'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/** One playback/recording owner. Late permission and playback results are cancelled. */
export function useRescueAudio() {
  const player = useRef<HTMLAudioElement | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const recordingUrl = useRef<string | null>(null);
  const recordingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const alive = useRef(true);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [permissionPending, setPermissionPending] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [error, setError] = useState('');

  const stop = useCallback(() => {
    generation.current++;
    if (player.current) { player.current.pause(); player.current.onended = null; player.current.onerror = null; player.current = null; }
    window.speechSynthesis?.cancel();
    setBusy(false);
  }, []);
  const stopRecording = useCallback(() => {
    if (recordingTimer.current) clearTimeout(recordingTimer.current);
    if (recorder.current?.state === 'recording') recorder.current.stop();
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
    setRecording(false);
  }, []);
  const reset = useCallback(() => {
    stop(); stopRecording();
    if (recordingUrl.current) URL.revokeObjectURL(recordingUrl.current);
    recordingUrl.current = null;
    setHasRecording(false); setError(''); setPermissionPending(false);
  }, [stop, stopRecording]);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; reset(); };
  }, [reset]);

  const play = useCallback(async (url: string, rate: number, onEnded?: () => void) => {
    stopRecording(); stop(); setError(''); setBusy(true);
    const token = generation.current;
    const audio = new Audio(url);
    audio.playbackRate = rate;
    audio.preservesPitch = true;
    player.current = audio;
    audio.onended = () => { if (token === generation.current && alive.current) { setBusy(false); onEnded?.(); } };
    const fail = () => { if (token === generation.current && alive.current) { setBusy(false); setError('Audio could not play. Retry, or use the device voice below.'); } };
    audio.onerror = fail;
    try { await audio.play(); } catch { fail(); }
  }, [stop, stopRecording]);

  const speak = useCallback((text: string, rate: number, onEnded: () => void) => {
    stopRecording(); stop(); setError('');
    if (!('speechSynthesis' in window)) { setError('This device cannot play a model right now. Please retry the audio. Your progress is kept.'); return; }
    const token = generation.current;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = window.speechSynthesis.getVoices().find(item => item.lang.replace('_', '-').toLowerCase() === 'en-us');
    if (voice) utterance.voice = voice;
    utterance.lang = 'en-US'; utterance.rate = rate;
    utterance.onend = () => { if (token === generation.current && alive.current) { setBusy(false); onEnded(); } };
    utterance.onerror = () => { if (token === generation.current && alive.current) { setBusy(false); setError('Device voice could not play. Please retry the model audio.'); } };
    setBusy(true); window.speechSynthesis.speak(utterance);
  }, [stop, stopRecording]);

  const record = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { setError('Recording is unavailable here. You can still say it aloud and earn your practice points.'); return; }
    reset(); setPermissionPending(true);
    const token = generation.current;
    try {
      const input = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current || token !== generation.current) { input.getTracks().forEach(track => track.stop()); return; }
      stream.current = input;
      const media = new MediaRecorder(input);
      recorder.current = media;
      const chunks: Blob[] = [];
      media.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      media.onstop = () => {
        input.getTracks().forEach(track => track.stop());
        if (!alive.current || token !== generation.current || !chunks.length) return;
        recordingUrl.current = URL.createObjectURL(new Blob(chunks, { type: media.mimeType }));
        setHasRecording(true); setRecording(false);
      };
      media.onerror = () => { stopRecording(); setError('Recording could not finish. You can still practice aloud.'); };
      media.start(); setRecording(true);
      recordingTimer.current = setTimeout(stopRecording, 60000);
    } catch {
      stream.current?.getTracks().forEach(track => track.stop());
      if (alive.current && token === generation.current) setError('Microphone access was not available. Say it aloud instead — your practice still counts.');
    } finally { if (alive.current && token === generation.current) setPermissionPending(false); }
  }, [reset, stopRecording]);
  return { busy, recording, permissionPending, hasRecording, error, play, speak, stop, reset, record, stopRecording,
    listenToMe: () => { if (recordingUrl.current) void play(recordingUrl.current, 1); } };
}
