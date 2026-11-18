import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT } from './theme.js';
import { palette } from './Preview.jsx';

/* ========================================================================
   টকিং-হেড ভিডিওর উপর অটো-ক্যাপশন (karaoke ধাঁচ: যে শব্দটা এখন বলা হচ্ছে
   সেটা ব্র্যান্ডের উজ্জ্বল রঙে জ্বলে)। + হালকা কালার গ্রেড + লোগো।
   props: { videoFile, segments:[{text,from,to}] (ফ্রেমে), brand, grade, total }
   ======================================================================== */

/* এক লাইনের ক্যাপশন: শব্দগুলো, চলতি শব্দ হাইলাইট */
const Band = ({ seg, c }) => {
  const f = useCurrentFrame();
  const { height } = useVideoConfig();
  const words = String(seg.text || '').trim().split(/\s+/).filter(Boolean);
  const dur = Math.max(1, seg.to - seg.from), per = dur / words.length;
  const idx = Math.max(0, Math.min(words.length - 1, Math.floor((f - seg.from) / per)));
  const p = spring({ frame: f - seg.from, fps: 30, config: { damping: 16, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', padding: `0 70px ${Math.round(height * 0.13)}px` }}>
      <div style={{ transform: `translateY(${(1 - p) * 34}px)`, opacity: p, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '12px 2px', maxWidth: 960 }}>
        {words.map((w, i) => {
          const on = i === idx;
          const wp = spring({ frame: f - (seg.from + i * per), fps: 30, config: { damping: 12 } });
          return (
            <span key={i} style={{
              fontFamily: FONT, fontWeight: 800, fontSize: 74, lineHeight: 1.32, margin: '0 6px',
              display: 'inline-block', transform: `scale(${on ? 1 + Math.min(0.08, wp * 0.08) : 1})`,
              color: on ? c.popInk : '#ffffff',
              background: on ? c.pop : 'transparent', padding: '2px 18px', borderRadius: 16,
              textShadow: on ? 'none' : '0 4px 16px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.9)',
            }}>{w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* হুক ইন্ট্রো: ব্র্যান্ডেড টাইটেল কার্ড, শেষে পর্দা সরে ভিডিও বের হয় */
const HookIntro = ({ hook, c, end }) => {
  const f = useCurrentFrame(), { width } = useVideoConfig();
  if (f >= end) return null;
  const wipe = interpolate(f, [end - 12, end], [0, width * 1.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p = spring({ frame: f, fps: 30, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{ transform: `translateX(${-wipe}px)` }}>
      <AbsoluteFill style={{ background: `linear-gradient(150deg, ${c.deep} 0%, ${c.deep2} 60%, ${c.deep} 100%)` }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${c.pop}12 1.5px, transparent 1.5px)`, backgroundSize: '44px 44px', opacity: 0.4 }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 120px' }}>
        <div style={{ transform: `translateY(${(1 - p) * 40}px)`, opacity: p }}>
          <div style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 700, fontSize: 30, color: c.popInk, background: c.pop, padding: '10px 26px', borderRadius: 999, marginBottom: 28 }}>{hook.kicker || 'প্রশ্ন'}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, lineHeight: 1.22, color: c.cream, letterSpacing: -1 }}>{hook.title}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
/* ভিজ্যুয়াল গ্রাফিক কাট: টকিং হেডের বদলে পুরো পর্দায় একটা পয়েন্ট-কার্ড */
const GraphicCut = ({ cut, c }) => {
  const f = useCurrentFrame();
  const inp = interpolate(f, [cut.from, cut.from + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const out = interpolate(f, [cut.to - 8, cut.to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p = spring({ frame: f - cut.from, fps: 30, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{ opacity: inp * out }}>
      <AbsoluteFill style={{ background: `linear-gradient(150deg, ${c.deep}, ${c.deep2})` }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 120px' }}>
        <div style={{ transform: `scale(${0.9 + p * 0.1})`, opacity: p, fontFamily: FONT, fontWeight: 800, fontSize: 110, lineHeight: 1.2, color: c.cream }}>
          {(cut.title || '').split(' ').map((w, i) => (cut.big || []).includes(w)
            ? <span key={i} style={{ background: c.pop, color: c.popInk, padding: '0 20px', borderRadius: 16, display: 'inline-block', margin: '0 6px' }}>{w}</span>
            : <span key={i} style={{ margin: '0 6px' }}>{w}</span>)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Captioned = ({ videoFile, segments = [], brand = {}, grade = true, total = 300, hook = null, cuts = [], hookEnd = 0 }) => {
  const c = palette(brand);
  const f = useCurrentFrame();
  const seg = segments.find((s) => f >= s.from && f < s.to);
  const filter = grade ? 'contrast(1.08) saturate(1.16) brightness(1.02)' : 'none';
  // মৃদু জুম (ken-burns) + কথার জোরের মুহূর্তে হালকা পাঞ্চ
  const kb = interpolate(f, [0, total], [1.02, 1.10]);
  const onCut = cuts.some((x) => f >= x.from - 6 && f < x.to + 6);
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <AbsoluteFill style={{ transform: `scale(${kb})` }}>
        {videoFile ? <OffthreadVideo src={staticFile(videoFile)} style={{ width: '100%', height: '100%', objectFit: 'cover', filter }} />
          : <AbsoluteFill style={{ background: `linear-gradient(150deg, ${c.deep}, ${c.deep2})` }} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 42%)' }} />
      <div style={{ position: 'absolute', top: 70, left: 70, display: 'flex', alignItems: 'center', gap: 16 }}>
        {(typeof brand.logo === 'string' && brand.logo.trim()) ? <Img src={brand.logo} style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 3px rgba(255,255,255,0.8)' }} />
          : <div style={{ width: 70, height: 70, borderRadius: '50%', background: c.pop, color: c.popInk, fontFamily: FONT, fontWeight: 700, fontSize: 30, display: 'grid', placeItems: 'center' }}>{(brand.name || 'হু').slice(0, 1)}</div>}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>{brand.name || ''}</div>
      </div>
      {cuts.map((cut, i) => <GraphicCut key={i} cut={cut} c={c} />)}
      {seg && !onCut && <Band seg={seg} c={c} />}
      {hook && hookEnd > 0 && <HookIntro hook={hook} c={c} end={hookEnd} />}
    </AbsoluteFill>
  );
};
