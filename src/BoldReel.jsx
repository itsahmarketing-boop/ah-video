import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT, FONT_EN } from './theme.js';
import { palette } from './Preview.jsx';

/* ========================================================================
   Bold ইঞ্জিন: একটাই সাহসী পরিচয়, কিন্তু ভেতরে অনেক সৃজনশীল উপাদান।
   রং ব্র্যান্ড থেকে; পটভূমি, আকৃতি, দৃশ্যের সাজ seed + niche অনুযায়ী বদলায়।
   ======================================================================== */

const bn = (n) => String(n).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
const bn2en = (s) => String(s).replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'.indexOf(d));
const seedRand = (seed) => { let x = (seed * 9301 + 49297) % 233280; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };

/* ---------- ছোট অ্যানিমেশন সহায়ক ---------- */
const useIn = (delay = 0, damping = 15) => { const f = useCurrentFrame(), { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } }); };
const Rise = ({ delay = 0, y = 60, children, style }) => { const p = useIn(delay); return <div style={{ transform: `translateY(${(1 - p) * y}px)`, opacity: p, ...style }}>{children}</div>; };

/* ---------- মূল শব্দ হাইলাইট (Bold ব্লক) ---------- */
const Hl = ({ text, words = [], pop, popInk, delay = 0 }) => {
  const f = useCurrentFrame();
  if (!words || !words.length) return <>{text}</>;
  const re = new RegExp('(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
  return <>{String(text).split(re).map((part, i) => {
    if (!words.includes(part)) return <span key={i}>{part}</span>;
    const p = spring({ frame: f - delay - 6, fps: 30, config: { damping: 9 } });
    return <span key={i} style={{ display: 'inline-block', background: pop, color: popInk, padding: '0 22px', borderRadius: 16, transform: `rotate(-2deg) scale(${0.6 + p * 0.4})` }}>{part}</span>;
  })}</>;
};

/* ---------- নিশ অনুযায়ী মোটিফ + seed অনুযায়ী পটভূমি ---------- */
const Star8 = ({ cx, cy, r, stroke, sw = 1.5 }) => { const p = []; for (let i = 0; i < 16; i++) { const a = (Math.PI / 8) * i, rr = i % 2 ? r * 0.6 : r; p.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`); } return <polygon points={p.join(' ')} fill="none" stroke={stroke} strokeWidth={sw} />; };

const Motif = ({ c, niche, rnd }) => {
  const f = useCurrentFrame(), { width, height } = useVideoConfig();
  if (niche === 'islamic') {
    const rows = []; for (let y = 0; y < 13; y++) for (let x = 0; x < 7; x++) rows.push([x * 180 + (y % 2) * 90, y * 170]);
    return <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.09, transform: `translateY(${-(f % 170)}px)` }}>{rows.map(([x, y], i) => <Star8 key={i} cx={x} cy={y} r={58} stroke={c.pop} />)}</svg>;
  }
  if (niche === 'gaming') {
    const tri = Array.from({ length: 10 }).map(() => [rnd() * width, rnd() * height, 40 + rnd() * 90, rnd() * 360]);
    return <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.18 }}>{tri.map(([x, y, s, r], i) => <polygon key={i} points={`${x},${y - s} ${x + s},${y + s} ${x - s},${y + s}`} fill="none" stroke={c.pop} strokeWidth="2" transform={`rotate(${r + f * 0.3} ${x} ${y})`} />)}</svg>;
  }
  // default: নরম বড় বৃত্ত
  return <>
    <div style={{ position: 'absolute', width: 540, height: 540, borderRadius: '50%', left: -160, top: height * 0.3, border: `2px solid ${c.pop}22` }} />
    <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', right: -120, top: height * 0.1, background: `radial-gradient(circle,${c.pop}18,transparent 70%)` }} />
  </>;
};

const BG = ({ c, niche, seed, bgVar }) => {
  const f = useCurrentFrame(), { width, height } = useVideoConfig();
  const rnd = seedRand(seed + 7);
  const drift = Math.sin(f / 90) * 30;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(150deg, ${c.deep} 0%, ${c.deep2} 55%, ${c.deep} 100%)` }}>
      <div style={{ position: 'absolute', width: width * 1.1, height: width * 1.1, borderRadius: '50%', left: -width * 0.2, top: -width * 0.3 + drift, background: `radial-gradient(circle, ${c.primary}66, transparent 62%)`, opacity: 0.7 }} />
      <Motif c={c} niche={niche} rnd={rnd} />
      {bgVar % 2 === 0 && <div style={{ position: 'absolute', top: -60, right: -40, width: 520, height: 520, border: `3px solid ${c.pop}`, borderRadius: 60, opacity: 0.22, transform: 'rotate(18deg)' }} />}
      {bgVar % 2 === 1 && <svg width="520" height="520" style={{ position: 'absolute', top: 80, right: -80, opacity: 0.3 }}>{[0, 1, 2, 3].map((i) => <circle key={i} cx="260" cy="260" r={90 + i * 55} fill="none" stroke={c.pop} strokeWidth="2" strokeDasharray="6 14" />)}</svg>}
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${c.pop}0f 1.5px, transparent 1.5px)`, backgroundSize: '46px 46px', opacity: 0.4 }} />
    </AbsoluteFill>
  );
};

const Numeral = ({ c, n }) => (
  <div style={{ position: 'absolute', top: 140, right: 110, fontFamily: FONT_EN, fontWeight: 800, fontSize: 290, color: 'transparent', WebkitTextStroke: `3px ${c.pop}88`, lineHeight: 0.8 }}>{String(n).padStart(2, '0')}</div>
);
const Chip = ({ c, children }) => (
  <Rise delay={1}><div style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 700, fontSize: 32, color: c.popInk, background: c.pop, padding: '12px 30px', borderRadius: 999 }}>{children}</div></Rise>
);
const Footer = ({ c, brand, progress }) => (
  <div style={{ position: 'absolute', left: 110, right: 110, bottom: 130, display: 'flex', alignItems: 'center', gap: 22 }}>
    {brand.logo ? <Img src={brand.logo} style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', boxShadow: `0 0 0 4px rgba(255,255,255,0.25)` }} />
      : <div style={{ width: 76, height: 76, borderRadius: '50%', background: c.pop, color: c.popInk, fontFamily: FONT, fontWeight: 700, fontSize: 32, display: 'grid', placeItems: 'center' }}>{(brand.name || 'হু').slice(0, 1)}</div>}
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: c.cream }}>{brand.name}</div>
    <div style={{ flex: 1, height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.16)', overflow: 'hidden' }}>
      <div style={{ width: `${Math.round(progress * 100)}%`, height: '100%', background: c.pop, borderRadius: 8 }} />
    </div>
  </div>
);

/* ======================= দৃশ্যের ধরন অনুযায়ী আলাদা সাজ ======================= */
/* ---------- সমৃদ্ধ মোশন উপাদান ---------- */
const Wipe = ({ c }) => {
  const f = useCurrentFrame(), { width } = useVideoConfig();
  if (f > 15) return null;
  const x = interpolate(f, [0, 13], [0, width * 1.3], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: `linear-gradient(90deg, ${c.pop}, ${c.primary})`, transform: `translateX(${x}px) skewX(-8deg)` }} />;
};
/* হাইলাইট শব্দ: পেছনের ব্লক বাঁ থেকে এঁকে ওঠে, তারপর লেখা ফোটে */
const DrawWord = ({ w, c, delay }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: { damping: 11 } });
  const tp = spring({ frame: f - delay - 4, fps, config: { damping: 12 } });
  return (
    <span style={{ position: 'relative', display: 'inline-block', padding: '0 20px', color: c.popInk }}>
      <span style={{ position: 'absolute', inset: 0, background: c.pop, borderRadius: 16, transformOrigin: 'left', transform: `scaleX(${p}) rotate(-2deg)` }} />
      <span style={{ position: 'relative', opacity: tp }}>{w}</span>
    </span>
  );
};
/* শিরোনাম: প্রতিটা শব্দ পর্দার নিচ থেকে উঠে, মাস্ক সরিয়ে ফোটে (kinetic) */
const KHead = ({ text, words = [], c, size, delay = 0, color }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.14, color: color || c.cream, letterSpacing: -1, display: 'flex', flexWrap: 'wrap' }}>
      {String(text).split(' ').map((w, i) => {
        if (words && words.includes(w)) return <span key={i} style={{ marginRight: '0.26em' }}><DrawWord w={w} c={c} delay={delay + 4 + i * 3} /></span>;
        const p = spring({ frame: f - delay - i * 3, fps, config: { damping: 13, mass: 0.8 } });
        const clip = `inset(${(1 - Math.min(1, p * 1.25)) * 115}% 0 -12% 0)`;
        return <span key={i} style={{ display: 'inline-block', marginRight: '0.26em', transform: `translateY(${(1 - p) * 55}px)`, clipPath: clip, WebkitClipPath: clip }}>{w}</span>;
      })}
    </div>
  );
};
/* টাইপরাইটার লাইন */
const TypeLine = ({ text, delay = 0, style, c }) => {
  const f = useCurrentFrame();
  const chars = Array.from(String(text)), n = Math.floor(interpolate(f, [delay, delay + chars.length * 1.1], [0, chars.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return <div style={style}>{chars.slice(0, n).join('')}<span style={{ color: c.pop, opacity: f % 16 < 8 && n < chars.length ? 0.8 : 0 }}>▌</span></div>;
};

const SceneHook = ({ s, c, n }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const zoom = interpolate(f, [0, 80], [1.0, 1.05]);
  const kp = spring({ frame: f - 2, fps, config: { damping: 9 } });
  const np = spring({ frame: f - 10, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      <div style={{ position: 'absolute', top: 120, left: 110, transform: `translateY(${(1 - kp) * -50}px) scale(${0.6 + kp * 0.4})`, opacity: Math.min(1, kp * 1.6), fontFamily: FONT, fontWeight: 700, fontSize: 32, color: c.popInk, background: c.pop, padding: '12px 30px', borderRadius: 999 }}>{s.kicker || 'হুরাইরা'}</div>
      <div style={{ position: 'absolute', top: 140, right: 110, transform: `translateX(${(1 - np) * 140}px)`, opacity: np, fontFamily: FONT_EN, fontWeight: 800, fontSize: 290, color: 'transparent', WebkitTextStroke: `3px ${c.pop}88`, lineHeight: 0.8 }}>{String(n).padStart(2, '0')}</div>
      <AbsoluteFill style={{ padding: '0 110px 420px', justifyContent: 'flex-end' }}>
        <KHead text={s.text} words={s.big} c={c} size={150} delay={8} />
        {s.sub && <TypeLine text={s.sub} delay={34} c={c} style={{ fontFamily: FONT, fontWeight: 500, fontSize: 46, lineHeight: 1.5, color: 'rgba(255,255,255,0.8)', maxWidth: 820, marginTop: 30 }} />}
      </AbsoluteFill>
      <Wipe c={c} />
    </AbsoluteFill>
  );
};

const ScenePoint = ({ s, c, n }) => (
  <>
    <Numeral c={c} n={n} />
    <AbsoluteFill style={{ padding: '220px 110px 360px', justifyContent: 'center' }}>
      <Rise delay={2}><div style={{ width: 90, height: 10, background: c.pop, borderRadius: 8, marginBottom: 44 }} /></Rise>
      <Rise delay={6} y={60}><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 112, lineHeight: 1.28, color: c.cream }}>
        <Hl text={s.text} words={s.big} pop={c.pop} popInk={c.popInk} delay={6} /></div></Rise>
    </AbsoluteFill>
  </>
);

const SceneList = ({ s, c, n }) => (
  <>
    <AbsoluteFill style={{ padding: '240px 110px 340px', justifyContent: 'center', gap: 28 }}>
      <Rise delay={2}><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 86, color: c.cream, marginBottom: 20 }}>{s.text}</div></Rise>
      {(s.items || []).map((it, i) => (
        <Rise key={i} delay={10 + i * 8} y={50}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, background: 'rgba(255,255,255,0.08)', border: `2px solid ${c.pop}55`, borderRadius: 28, padding: '28px 34px' }}>
            <div style={{ minWidth: 76, height: 76, borderRadius: 20, background: c.pop, color: c.popInk, display: 'grid', placeItems: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 40 }}>{bn('১২৩৪৫'[i] || i + 1)}</div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 54, color: c.cream, lineHeight: 1.3 }}>{it}</div>
          </div>
        </Rise>
      ))}
    </AbsoluteFill>
  </>
);

const SceneStat = ({ s, c }) => {
  const f = useCurrentFrame(), p = useIn(4, 12);
  const raw = String(s.value || '');
  const m = bn2en(raw).match(/-?\d+(\.\d+)?/);
  let shown = raw;
  if (m) {
    const target = parseFloat(m[0]), prog = interpolate(f, [6, 42], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const dec = (m[0].split('.')[1] || '').length, cur = (target * prog).toFixed(dec);
    shown = bn(raw.replace(m[0], cur));
  }
  const sz = 520, r = 232, circ = 2 * Math.PI * r;
  const spin = interpolate(f, [6, 48], [-270, -90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // লোডিং-এর মতো ঘুরে আঁকা
  return (
    <AbsoluteFill style={{ padding: '200px 110px 340px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      {/* রিং আর তার ঠিক মাঝখানে সংখ্যা */}
      <div style={{ position: 'relative', width: sz, height: sz, display: 'grid', placeItems: 'center' }}>
        <svg width={sz} height={sz} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14" />
          <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke={c.pop} strokeWidth="14" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - 0.72 * p)} transform={`rotate(${spin} ${sz / 2} ${sz / 2})`} />
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 150, lineHeight: 1, color: c.pop, transform: `scale(${0.9 + p * 0.1})` }}>{shown}</div>
      </div>
      {/* লেখা রিং-এর স্পষ্ট নিচে, ফাঁক রেখে */}
      <Rise delay={14}><div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 58, color: c.cream, marginTop: 72, maxWidth: 820, lineHeight: 1.4 }}>{s.text}</div></Rise>
    </AbsoluteFill>
  );
};

const SceneQuote = ({ s, c }) => (
  <AbsoluteFill style={{ padding: '240px 120px 360px', justifyContent: 'center' }}>
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 300, lineHeight: 0.7, color: c.pop, height: 160 }}>“</div>
    <Rise delay={5} y={50}><div style={{ fontFamily: FONT, fontWeight: 700, fontStyle: 'italic', fontSize: 92, lineHeight: 1.4, color: c.cream }}>{s.text}</div></Rise>
    {s.source && <Rise delay={14}><div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 44, color: c.pop, marginTop: 36 }}>— {s.source}</div></Rise>}
  </AbsoluteFill>
);

const SceneCta = ({ s, c }) => {
  const f = useCurrentFrame(), pulse = 1 + Math.sin(f / 7) * 0.03;
  return (
    <AbsoluteFill style={{ padding: '220px 110px 360px', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 36 }}>
      <Rise delay={4} y={60}><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 130, lineHeight: 1.2, color: c.cream }}>
        <Hl text={s.text} words={s.big} pop={c.pop} popInk={c.popInk} delay={4} /></div></Rise>
      {s.sub && <Rise delay={12}><div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 50, color: 'rgba(255,255,255,0.82)', maxWidth: 820 }}>{s.sub}</div></Rise>}
      <Rise delay={18}><div style={{ transform: `scale(${pulse})`, fontFamily: FONT, fontWeight: 800, fontSize: 52, color: c.popInk, background: c.pop, padding: '26px 64px', borderRadius: 999 }}>ফলো করুন</div></Rise>
    </AbsoluteFill>
  );
};

const KIND = { hook: SceneHook, point: ScenePoint, list: SceneList, stat: SceneStat, quote: SceneQuote, cta: SceneCta };

const Trans = ({ dur, children, dir = 0 }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const inp = spring({ frame: f, fps, config: { damping: 18, mass: 0.9 } });
  const out = interpolate(f, [dur - 12, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dirs = [[0, 80], [90, 0], [0, -80], [-90, 0]], [dx, dy] = dirs[dir % 4];
  const tx = (1 - inp) * dx - out * dx * 0.6, ty = (1 - inp) * dy - out * dy * 0.6;
  const sc = (0.92 + inp * 0.08) + out * 0.06;
  return <AbsoluteFill style={{ opacity: Math.min(1, inp * 1.3) * (1 - out), transform: `translate(${tx}px,${ty}px) scale(${sc})` }}>{children}</AbsoluteFill>;
};

export const ReelBold = ({ scenes = [], timing = [], brand = {}, total = 300, audio, niche = 'default', seed = 1, wide = false }) => {
  const c = palette(brand);
  const f = useCurrentFrame();
  const rnd = seedRand(seed);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <BG c={c} niche={niche} seed={seed} bgVar={Math.floor(rnd() * 2)} />
      {scenes.map((s, i) => {
        const tm = timing[i] || { from: i * 90, dur: 90 };
        const Comp = KIND[s.kind] || ScenePoint;
        return (
          <Sequence key={i} from={tm.from} durationInFrames={tm.dur}>
            <Trans dur={tm.dur} dir={i}><Comp s={s} c={c} n={i + 1} /></Trans>
          </Sequence>
        );
      })}
      <Footer c={c} brand={brand} progress={Math.min(1, f / total)} />
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};

/* থাম্বনেইল (স্থির কভার): প্রথম দৃশ্যের শিরোনাম, অ্যানিমেশন ছাড়া */
const StaticHl = ({ text, words = [], c }) => {
  if (!words || !words.length) return <>{text}</>;
  const re = new RegExp('(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
  return <>{String(text).split(re).map((p, i) => (words.includes(p)
    ? <span key={i} style={{ background: c.pop, color: c.popInk, padding: '0 20px', borderRadius: 16, display: 'inline-block', transform: 'rotate(-2deg)' }}>{p}</span>
    : <span key={i}>{p}</span>))}</>;
};
export const ThumbBold = ({ scenes = [], brand = {}, niche = 'default', seed = 1, title, wide = false }) => {
  const c = palette(brand), s = (scenes && scenes[0]) || {}, head = title || s.text || '';
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <BG c={c} niche={niche} seed={seed} bgVar={seed % 2} />
      <div style={{ position: 'absolute', top: 120, left: 110, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: c.popInk, background: c.pop, padding: '12px 30px', borderRadius: 999 }}>{s.kicker || brand.name || ''}</div>
      <AbsoluteFill style={{ padding: wide ? '0 120px 200px' : '0 110px 320px', justifyContent: 'flex-end' }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: wide ? 120 : 148, lineHeight: 1.14, color: c.cream, letterSpacing: -1 }}>
          <StaticHl text={head} words={s.big || []} c={c} />
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 110, bottom: 140, display: 'flex', alignItems: 'center', gap: 20 }}>
        {brand.logo ? <Img src={brand.logo} style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 4px rgba(255,255,255,0.25)' }} />
          : <div style={{ width: 76, height: 76, borderRadius: '50%', background: c.pop, color: c.popInk, fontFamily: FONT, fontWeight: 700, fontSize: 32, display: 'grid', placeItems: 'center' }}>{(brand.name || 'হু').slice(0, 1)}</div>}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: c.cream }}>{brand.name}</div>
      </div>
    </AbsoluteFill>
  );
};
