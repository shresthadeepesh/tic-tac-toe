// Every effect is synthesised with the Web Audio API, so the game ships no
// audio files and nothing is fetched at runtime.

export type SoundName = 'placeX' | 'placeO' | 'win' | 'lose' | 'draw' | 'ui' | 'undo';

const STORAGE_KEY = 'ticTacToe.muted';

interface INote {
  frequency: number;
  // Seconds from the start of the effect.
  delay: number;
  duration: number;
  gain: number;
  type: OscillatorType;
}

const EFFECTS: Record<SoundName, INote[]> = {
  placeX: [{ frequency: 523.25, delay: 0, duration: 0.14, gain: 0.16, type: 'triangle' }],
  placeO: [{ frequency: 392, delay: 0, duration: 0.14, gain: 0.16, type: 'triangle' }],
  win: [
    { frequency: 523.25, delay: 0, duration: 0.18, gain: 0.14, type: 'sine' },
    { frequency: 659.25, delay: 0.1, duration: 0.18, gain: 0.14, type: 'sine' },
    { frequency: 783.99, delay: 0.2, duration: 0.28, gain: 0.14, type: 'sine' },
    { frequency: 1046.5, delay: 0.32, duration: 0.42, gain: 0.12, type: 'sine' }
  ],
  lose: [
    { frequency: 392, delay: 0, duration: 0.22, gain: 0.13, type: 'sine' },
    { frequency: 311.13, delay: 0.14, duration: 0.26, gain: 0.13, type: 'sine' },
    { frequency: 233.08, delay: 0.3, duration: 0.5, gain: 0.12, type: 'sine' }
  ],
  draw: [
    { frequency: 329.63, delay: 0, duration: 0.24, gain: 0.12, type: 'sine' },
    { frequency: 329.63, delay: 0.2, duration: 0.34, gain: 0.1, type: 'sine' }
  ],
  ui: [{ frequency: 880, delay: 0, duration: 0.07, gain: 0.08, type: 'sine' }],
  undo: [
    { frequency: 440, delay: 0, duration: 0.1, gain: 0.1, type: 'triangle' },
    { frequency: 329.63, delay: 0.07, duration: 0.14, gain: 0.1, type: 'triangle' }
  ]
};

const readMuted = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    // Private mode and blocked storage both land here; sound stays on.
    return false;
  }
};

let muted = readMuted();
let context: AudioContext | null = null;

export const isMuted = (): boolean => muted;

export const setMuted = (value: boolean): void => {
  muted = value;

  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Preference simply does not survive a reload.
  }
};

const getContext = (): AudioContext | null => {
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  if (!context) context = new Ctor();

  // Browsers start the context suspended until a gesture unlocks it.
  if (context.state === 'suspended') void context.resume();

  return context;
};

export const playSound = (name: SoundName): void => {
  if (muted) return;

  const ctx = getContext();
  if (!ctx) return;

  const start = ctx.currentTime;

  EFFECTS[name].forEach(({ frequency, delay, duration, gain, type }) => {
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    const at = start + delay;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);

    // Ramped either side so the note does not click on or off.
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(gain, at + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);

    oscillator.connect(envelope).connect(ctx.destination);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.02);
  });
};
