import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { FONT, makeTheme } from './theme.js';
import { Background, Chrome, Floater, Hl, Kicker, Rise } from './parts.jsx';
import { VARIANTS, SceneTrans, AnimText, Deco } from './anim.jsx';

/* একটা দৃশ্য: ধরন অনুযায়ী সাজানো */
const Scene = ({ s, t, dur, wide, idx, v }) => {
  const big = wide ? 1 : 1.12;
  const textSize = (s.kind === 'hook' || s.kind === 'cta' ? 92 : s.kind === 'quote' ? 58 : 68) * big;
  const cardBox = v.card && s.kind !== 'list' ? { background: t.card, border: `2px solid ${t.line}`, borderRadius: 44, padding: wide ? '56px 64px' : '60px 54px',
    boxShadow: t.dark ? '0 30px 80px -30px rgba(0,0,0,0.7)' : '0 40px 90px -40px rgba(15,23,42,0.45)', boxSizing: 'border-box' } : {};
  const body = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 34, alignItems: wide ? 'flex-start' : 'center', textAlign: wide ? 'left' : 'center', maxWidth: wide ? 1050 : 920, width: '100%', ...cardBox }}>
      {s.kicker && <Rise delay={2}><Kicker t={t}>{s.kicker}</Kicker></Rise>}
      {s.kind === 'stat' && s.value && <Rise delay={4}><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 190 * big, lineHeight: 1, color: t.dark ? t.hi : t.primary }}>{s.value}</div></Rise>}
      {s.kind === 'quote' && <Rise delay={2}><div style={{ fontSize: 160, lineHeight: 0.6, color: t.gold || t.primary, fontFamily: 'Georgia, serif' }}>“</div></Rise>}
      <AnimText text={s.text} words={s.big || []} color={t.dark ? t.hi : t.primary} mode={v.text} delay={6}
        style={{ fontFamily: FONT, fontWeight: 700, fontSize: textSize, lineHeight: 1.32, color: t.ink, fontStyle: s.kind === 'quote' ? 'italic' : 'normal' }} />
      {s.kind === 'list' && Array.isArray(s.items) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignSelf: 'stretch' }}>
          {s.items.map((it, i) => (
            <Rise key={i} delay={14 + i * 9} y={40}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, background: t.card, border: `2px solid ${t.line}`, borderRadius: 26, padding: '22px 30px', textAlign: 'left',
                boxShadow: t.dark ? 'none' : '0 18px 40px -24px rgba(15,23,42,0.45)' }}>
                <div style={{ minWidth: 58, height: 58, borderRadius: 18, background: t.primary, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 32 }}>{'১২৩৪'[i]}</div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 46 * big, color: t.ink, lineHeight: 1.3 }}>{it}</div>
              </div>
            </Rise>
          ))}
        </div>
      )}
      {s.kind === 'quote' && s.source && <Rise delay={16}><div style={{ fontFamily: FONT, fontSize: 38, color: t.sub }}>— {s.source}</div></Rise>}
      {s.kind === 'cta' && s.sub && <Rise delay={14}><div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 44 * big, color: t.sub }}>{s.sub}</div></Rise>}
      {s.kind === 'cta' && <Rise delay={22}><CtaButton t={t} /></Rise>}
    </div>
  );
  const showObj = s.object && s.kind !== 'quote' && s.kind !== 'list';
  return (
    <SceneTrans kind={v.trans} dur={dur}>
      {wide ? (
        <AbsoluteFill style={{ flexDirection: idx % 2 ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', padding: '170px 120px 150px' }}>
          {body}
          {showObj && <Floater name={s.object} size={460} t={t} />}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '220px 80px 200px', gap: 40, flexDirection: 'column' }}>
          {showObj && <Floater name={s.object} size={s.kind === 'hook' || s.kind === 'cta' ? 380 : 320} t={t} />}
          {body}
        </AbsoluteFill>
      )}
    </SceneTrans>
  );
};
const CtaButton = ({ t }) => {
  const f = useCurrentFrame(), pulse = 1 + Math.sin(f / 6) * 0.03;
  return <div style={{ transform: `scale(${pulse})`, fontFamily: FONT, fontWeight: 700, fontSize: 44, color: '#fff', background: `linear-gradient(135deg, ${t.primary}, ${t.hi})`,
    padding: '22px 52px', borderRadius: 999, boxShadow: `0 24px 50px -18px ${t.primary}` }}>ফলো করুন · শেয়ার করুন</div>;
};

/* শুরুর ঝলক: পর্দা জুড়ে রঙের পর্দা সরে যায় */
const Wipe = ({ t }) => {
  const f = useCurrentFrame(), { width } = useVideoConfig();
  const x = interpolate(f, [0, 14], [0, width * 1.2], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: `linear-gradient(90deg, ${t.primary}, ${t.hi})`, transform: `translateX(${x}px)` }} />;
};

export const Reel = ({ scenes = [], timing = [], brand, style, audio, total = 300, wide = false, variant = 0 }) => {
  const t = makeTheme(brand, style);
  const f = useCurrentFrame();
  const v = VARIANTS(variant);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background t={t} />
      <Deco kind={v.deco} t={t} />
      {scenes.map((s, i) => (
        <Sequence key={i} from={timing[i] ? timing[i].from : i * 90} durationInFrames={timing[i] ? timing[i].dur : 90}>
          <Scene s={s} t={t} dur={timing[i] ? timing[i].dur : 90} wide={wide} idx={i + v.seed} v={v} />
        </Sequence>
      ))}
      <Chrome t={t} progress={f / total} wide={wide} />
      <Sequence durationInFrames={16}><Wipe t={t} /></Sequence>
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};

/* থাম্বনেইল: বড় শিরোনাম আর প্রতীক */
export const Thumb = ({ scenes = [], brand, style, wide = false, title }) => {
  const t = makeTheme(brand, style), s = scenes[0] || {};
  const head = title || s.text || '';
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background t={t} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: wide ? '120px 110px' : '200px 80px', flexDirection: wide ? 'row' : 'column', gap: 50 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignItems: wide ? 'flex-start' : 'center', textAlign: wide ? 'left' : 'center', maxWidth: wide ? 1100 : 940 }}>
          {s.kicker && <Kicker t={t}>{s.kicker}</Kicker>}
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: wide ? 110 : 116, lineHeight: 1.25, color: t.ink, textShadow: t.dark ? '0 6px 24px rgba(0,0,0,0.4)' : 'none' }}>
            <Hl text={head} words={s.big || []} color={t.dark ? t.hi : t.primary} />
          </div>
        </div>
        {s.object && <Floater name={s.object} size={wide ? 560 : 520} t={t} still />}
      </AbsoluteFill>
      <Chrome t={t} progress={1} wide={wide} />
    </AbsoluteFill>
  );
};
