// lib/utils/sound-fx.ts
// Web Audio API synthesizer — no external audio assets.

'use client';

let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (sharedContext && sharedContext.state !== 'closed') return sharedContext;

  const AudioContextClass =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  try {
    sharedContext = new AudioContextClass();
    return sharedContext;
  } catch {
    return null;
  }
}

function playTone(
  frequency: number,
  durationSeconds: number,
  options: {
    type?: OscillatorType;
    gain?: number;
    startDelay?: number;
    decay?: boolean;
  } = {},
): void {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === 'suspended') {
    void context.resume();
  }

  const { type = 'sine', gain = 0.18, startDelay = 0, decay = true } = options;
  const startTime = context.currentTime + startDelay;
  const endTime = startTime + durationSeconds;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(gain, startTime);
  if (decay) {
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);
  } else {
    gainNode.gain.setValueAtTime(gain, endTime - 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);
  }

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(endTime + 0.02);
}

/**
 * Sonar ping — 880Hz with exponential decay, radar-like feel.
 */
export function playSonarPing(): void {
  playTone(880, 0.6, { type: 'sine', gain: 0.16, decay: true });
  playTone(1320, 0.35, { type: 'sine', gain: 0.06, startDelay: 0.02, decay: true });
}

/**
 * Alarm beep — alternating 1200Hz / 900Hz, for critical alerts.
 */
export function playAlarmBeep(): void {
  playTone(1200, 0.18, { type: 'square', gain: 0.1, startDelay: 0, decay: false });
  playTone(900, 0.18, { type: 'square', gain: 0.1, startDelay: 0.2, decay: false });
  playTone(1200, 0.18, { type: 'square', gain: 0.1, startDelay: 0.4, decay: false });
}

/**
 * Success chime — pleasant 3-note arpeggio (C5-E5-G5).
 */
export function playSuccessChime(): void {
  playTone(523.25, 0.22, { type: 'triangle', gain: 0.14, startDelay: 0, decay: false });
  playTone(659.25, 0.22, { type: 'triangle', gain: 0.14, startDelay: 0.14, decay: false });
  playTone(783.99, 0.4, { type: 'triangle', gain: 0.16, startDelay: 0.28, decay: true });
}

/**
 * Subtle UI click — short low tone.
 */
export function playUiClick(): void {
  playTone(420, 0.06, { type: 'sine', gain: 0.05, decay: true });
}
