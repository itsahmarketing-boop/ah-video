// অ্যাপের পাঠানো কাজ (job.json) থেকে ভয়েস ফাইল আর ভিডিওর props বানায়
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const FPS = 30;
const job = JSON.parse(fs.readFileSync(process.argv[2] || 'job.json', 'utf8'));
const pub = 'public';
fs.mkdirSync(pub, { recursive: true });
for (const f of fs.readdirSync(pub)) if (/^(voice\.wav|seg-)/.test(f)) fs.rmSync(path.join(pub, f));

const ffmpeg = (args) => execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['remotion', 'ffmpeg', '-y', '-loglevel', 'error', ...args], { stdio: 'inherit', shell: process.platform === 'win32' });

/* ১৬-বিট PCM থেকে WAV */
function wav(pcm, rate) {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}
const RATE = 24000;
const silence = (sec) => Buffer.alloc(Math.round(sec * RATE) * 2);
/* যেকোনো অংশকে (PCM বা mp3) একই মানের PCM এ আনা */
function toPcm(part, i) {
  if (part.pcm) {
    const raw = Buffer.from(part.pcm, 'base64');
    if ((part.rate || RATE) === RATE) return raw;
    const src = path.join(pub, `seg-${i}-in.wav`), out = path.join(pub, `seg-${i}-out.raw`);
    fs.writeFileSync(src, wav(raw, part.rate)); ffmpeg(['-i', src, '-f', 's16le', '-ac', '1', '-ar', String(RATE), out]);
    return fs.readFileSync(out);
  }
  const src = path.join(pub, `seg-${i}.${/mpeg|mp3/.test(part.mime || '') ? 'mp3' : 'bin'}`), out = path.join(pub, `seg-${i}.raw`);
  fs.writeFileSync(src, Buffer.from(part.b64, 'base64'));
  ffmpeg(['-i', src, '-f', 's16le', '-ac', '1', '-ar', String(RATE), out]);
  return fs.readFileSync(out);
}

const v = job.voice || {};
const texts = v.texts || (job.scenes || []).map((s) => s.say || s.text || '');
let pcm = null, segSec = null;
if (v.all && v.all.pcm) pcm = toPcm(v.all, 'all');
else if (Array.isArray(v.segs) && v.segs.length) {
  const bufs = [], secs = [];
  v.segs.forEach((s, i) => {
    const b = Buffer.concat((s.parts || []).map((p, j) => toPcm(p, `${i}-${j}`)).concat([silence(0.35)]));
    bufs.push(b); secs.push(b.length / 2 / RATE);
  });
  pcm = Buffer.concat(bufs); segSec = secs;
}
const lead = 0.5, tail = 1.2;   // শুরুতে আর শেষে একটু সময়
let audio = null, voiceSec = 0;
if (pcm && pcm.length) {
  const full = Buffer.concat([silence(lead), pcm, silence(tail)]);
  fs.writeFileSync(path.join(pub, 'voice.wav'), wav(full, RATE));
  audio = 'voice.wav'; voiceSec = pcm.length / 2 / RATE;
}

/* দৃশ্যের সময়: আলাদা অংশ থাকলে মাপমতো, এক টানা ভয়েস হলে লেখার দৈর্ঘ্যের অনুপাতে */
function timingFor(n, weights) {
  const totalSec = audio ? voiceSec + lead + tail : Math.max(6, n * 4.5);
  let secs;
  if (segSec && segSec.length === n) secs = segSec.slice();
  else { const w = weights.map((x) => Math.max(8, x)); const sum = w.reduce((a, b) => a + b, 0); secs = w.map((x) => (x / sum) * (audio ? voiceSec : totalSec)); }
  if (audio) { secs[0] += lead; secs[n - 1] += tail; }
  let from = 0;
  const timing = secs.map((s) => { const dur = Math.max(45, Math.round(s * FPS)); const o = { from, dur }; from += dur; return o; });
  return { timing, total: from };
}

const brand = job.brand || {};
let props;
if (job.type === 'reel' || job.type === 'promo') {
  const scenes = job.scenes || [];
  const { timing, total } = timingFor(scenes.length, texts.length === scenes.length ? texts.map((x) => x.length) : scenes.map((s) => (s.say || s.text || '').length));
  props = { kind: 'reel', scenes, timing, total, brand, style: job.style || 'clean', audio, format: job.format || 'vertical', title: (scenes[0] || {}).text, niche: brand.niche || job.niche || 'default' };
} else if (job.type === 'image') {
  props = { kind: 'image', job, brand };
} else {   // কুইজ
  const w = texts.length >= 4 ? [texts[0].length, texts.slice(1, 2).join('').length, texts.slice(2, -1).join('').length, texts[texts.length - 1].length] : [15, 30, 40, 15];
  const { timing, total } = timingFor(4, w);
  const sc = job.scene || {};
  props = { kind: 'quiz', job: { ...job, voice: undefined }, timing, total, brand, audio, style: sc.style || 'geometric',
    title: job.q, scenes: [{ kind: 'hook', kicker: job.kicker || 'সাপ্তাহিক প্রশ্ন', text: job.q, big: sc.hl || [], object: sc.intro || 'book' }] };
}
/* ধরন নম্বর: অ্যাপ পাঠালে সেটা, না পাঠালে কাজের আইডি থেকে; প্রতিটা ভিডিও আলাদা দেখাবে */
const hash = (s) => { let h = 0; for (const c of String(s || '')) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
props.variant = Number.isFinite(job.variant) ? job.variant : hash(job.id || job.draft_id || Date.now()) % 64;
props.seed = (props.variant || 0) + hash(job.id || '') % 97 + 1;   // Bold ইঞ্জিনের বৈচিত্র্যের জন্য
/* কাটছাঁট: শুরু আর শেষ থেকে কত সেকেন্ড বাদ যাবে */
if (props.total && job.trim) {
  const a = Math.max(0, Math.round((+job.trim.start || 0) * FPS)), b = Math.max(0, Math.round((+job.trim.end || 0) * FPS));
  if (a + b < props.total - 30) props.frames = [a, props.total - 1 - b];
}
fs.writeFileSync('props.json', JSON.stringify(props));
console.log('prepared', props.kind, 'frames', props.total || '-', 'audio', audio || 'none');
