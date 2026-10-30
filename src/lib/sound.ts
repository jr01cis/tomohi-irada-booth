/**
 * Booth sound effects. Everything is synthesized with Web Audio so the app needs no audio files and works offline.
 * To replace a sound with a real recording, drop `<name>.mp3` (or .wav / .m4a) into src/assets/sounds/ and rebuild:
 * a file with the same name as a sound below wins over the synth.
 */

export type Sfx =
  | 'tap'
  | 'whoosh'
  | 'spinStart'
  | 'spinTick'
  | 'prize'
  | 'bigPrize'
  | 'tick'
  | 'tickHot'
  | 'beep'
  | 'timeUp'
  | 'correct'
  | 'wrong'
  | 'reveal'
  | 'key'
  | 'yeah'
  | 'voucher'
  | 'blip'

const MUTE_KEY = 'irada.muted'
const SAMPLES = import.meta.glob('../assets/sounds/*.{mp3,wav,m4a}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null
const buffers = new Map<string, AudioBuffer>()
let muted = readMuted()

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

export function isMuted() {
  return muted
}

export function setMuted(value: boolean) {
  muted = value
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0')
  } catch {
    /* per-device preference only */
  }
  if (value) window.speechSynthesis?.cancel()
}

/** Call from any user gesture. iOS only starts audio inside one. */
export function unlock() {
  try {
    const nav = navigator as Navigator & { audioSession?: { type: string } }
    /* iOS 17+: play through the silent switch, like a game */
    if (nav.audioSession && nav.audioSession.type !== 'playback') nav.audioSession.type = 'playback'
  } catch {
    /* older Safari */
  }
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.75
    master.connect(ctx.destination)
    const silent = ctx.createBuffer(1, 1, 22050)
    const src = ctx.createBufferSource()
    src.buffer = silent
    src.connect(ctx.destination)
    src.start(0)
    void loadSamples()
  }
  if (ctx.state === 'suspended') void ctx.resume()
}

async function loadSamples() {
  for (const [path, url] of Object.entries(SAMPLES)) {
    const name = path.split('/').pop()!.replace(/\.[^.]+$/, '')
    try {
      const data = await (await fetch(url)).arrayBuffer()
      buffers.set(name, await ctx!.decodeAudioData(data))
    } catch {
      /* keep the synth for this one */
    }
  }
}

interface ToneOpts {
  type?: OscillatorType
  gain?: number
  at?: number
  to?: number
  attack?: number
}

function tone(freq: number, dur: number, o: ToneOpts = {}) {
  const c = ctx!
  const t = c.currentTime + (o.at ?? 0)
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = o.type ?? 'sine'
  osc.frequency.setValueAtTime(freq, t)
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur)
  const peak = o.gain ?? 0.3
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + (o.attack ?? 0.005))
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(master!)
  osc.start(t)
  osc.stop(t + dur + 0.03)
}

interface NoiseOpts {
  freq?: number
  to?: number
  q?: number
  gain?: number
  at?: number
  attack?: number
  filter?: BiquadFilterType
}

function noise(dur: number, o: NoiseOpts = {}) {
  const c = ctx!
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
    const d = noiseBuffer.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  const t = c.currentTime + (o.at ?? 0)
  const src = c.createBufferSource()
  src.buffer = noiseBuffer
  const f = c.createBiquadFilter()
  f.type = o.filter ?? 'bandpass'
  f.frequency.setValueAtTime(o.freq ?? 1000, t)
  if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur)
  f.Q.value = o.q ?? 1
  const g = c.createGain()
  const peak = o.gain ?? 0.2
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + (o.attack ?? 0.01))
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(master!)
  src.start(t, Math.random())
  src.stop(t + dur + 0.05)
}

const bell = (freq: number, dur: number, gain: number, at = 0) => {
  tone(freq, dur, { gain, at })
  tone(freq * 2, dur * 0.6, { gain: gain * 0.25, at })
}

function fanfare(big: boolean) {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((f, i) => {
    const last = i === notes.length - 1
    tone(f, last ? 0.75 : 0.16, { type: 'triangle', gain: 0.22, at: i * 0.1 })
    tone(f / 2, last ? 0.75 : 0.16, { type: 'sawtooth', gain: 0.04, at: i * 0.1 })
  })
  if (big) {
    tone(659.25, 0.9, { type: 'triangle', gain: 0.14, at: 0.42 })
    tone(783.99, 0.9, { type: 'triangle', gain: 0.12, at: 0.42 })
  }
}

function cheer(gain: number) {
  for (let i = 0; i < 6; i++) {
    noise(1.4 + Math.random() * 0.5, { freq: 700 + Math.random() * 1600, q: 0.7, gain: gain * (0.6 + Math.random() * 0.4), at: 0.25 + i * 0.05, attack: 0.25 })
  }
}

function say(text: string) {
  const s = window.speechSynthesis
  if (!s) return
  try {
    s.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.pitch = 1.35
    u.rate = 1.05
    u.volume = 1
    const voice = s.getVoices().find((v) => /en[-_]US/i.test(v.lang) && /Samantha|Ava|Allison|Google US/i.test(v.name))
    if (voice) u.voice = voice
    s.speak(u)
  } catch {
    /* no speech engine */
  }
}

const SYNTH: Record<Sfx, () => void> = {
  tap: () => tone(620, 0.06, { gain: 0.07, to: 480 }),
  key: () => tone(900, 0.045, { gain: 0.08, type: 'triangle' }),
  blip: () => tone(1100, 0.09, { gain: 0.1, to: 1600 }),
  whoosh: () => noise(0.38, { freq: 350, to: 2200, q: 0.8, gain: 0.07, attack: 0.12 }),
  spinStart: () => noise(0.7, { freq: 300, to: 2600, q: 0.9, gain: 0.14, attack: 0.2 }),
  spinTick: () => {
    noise(0.018, { freq: 3500, q: 2, gain: 0.35, filter: 'highpass' })
    tone(2100, 0.025, { gain: 0.04, type: 'triangle' })
  },
  prize: () => fanfare(false),
  bigPrize: () => {
    fanfare(true)
    cheer(0.06)
  },
  tick: () => tone(1250, 0.03, { gain: 0.05, type: 'triangle' }),
  tickHot: () => tone(1600, 0.05, { gain: 0.12, type: 'triangle' }),
  beep: () => tone(880, 0.14, { gain: 0.2, type: 'square', attack: 0.004 }),
  timeUp: () => {
    tone(440, 0.55, { type: 'square', gain: 0.1, to: 200 })
    tone(110, 0.4, { gain: 0.25, to: 60 })
  },
  correct: () => {
    bell(880, 0.14, 0.22)
    bell(1318.5, 0.28, 0.22, 0.09)
  },
  wrong: () => {
    tone(196, 0.24, { type: 'square', gain: 0.07, to: 140 })
    tone(98, 0.24, { gain: 0.15, to: 70 })
  },
  reveal: () => [1046.5, 1318.5, 1568, 2093].forEach((f, i) => bell(f, 0.35, 0.07, i * 0.07)),
  voucher: () => [1568, 2093, 2349, 2637, 3136].forEach((f, i) => bell(f, 0.4, 0.05, i * 0.05)),
  yeah: () => {
    fanfare(true)
    cheer(0.07)
    setTimeout(() => !muted && say('Yeah!'), 380)
  },
}

export function play(name: Sfx) {
  if (muted || !ctx || !master) return
  if (ctx.state === 'suspended') void ctx.resume()
  try {
    const buf = buffers.get(name)
    if (buf) {
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.connect(master)
      src.start()
      return
    }
    SYNTH[name]()
  } catch {
    /* a missed sound never breaks the flow */
  }
}

export const sfx = { play, unlock, isMuted, setMuted }
