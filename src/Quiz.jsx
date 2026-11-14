import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { FONT, makeTheme } from './theme.js';
import { Background, Chrome, Floater, Hl, Kicker, Rise, fade } from './parts.jsx';

const LET = ['ক', 'খ', 'গ', 'ঘ'];
const Part = ({ dur, children }) => { const f = useCurrentFrame(); return <AbsoluteFill style={{ opacity: fade(f, dur), alignItems: 'center', justifyContent: 'center', padding: '220px 80px 200px', flexDirection: 'column', gap: 44, textAlign: 'center' }}>{children}</AbsoluteFill>; };

/* সাপ্তাহিক কুইজ: পরিচয়, প্রশ্ন, অপশন, পুরস্কার আর আহ্বান */
export const Quiz = ({ job = {}, timing = [], brand, audio, total = 600 }) => {
  const sc = job.scene || {}, t = makeTheme(brand, sc.style || 'geometric'), f = useCurrentFrame();
  const parts = timing.length === 4 ? timing : [0, 0.15, 0.45, 0.85].map((x, i, a) => ({ from: Math.round(x * total), dur: Math.round(((a[i + 1] || 1) - x) * total) }));
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background t={t} />
      <Sequence from={parts[0].from} durationInFrames={parts[0].dur}><Part dur={parts[0].dur}>
        <Floater name={sc.intro || 'book'} size={380} t={t} />
        <Rise delay={6}><Kicker t={t}>{job.kicker || 'সাপ্তাহিক প্রশ্ন'}</Kicker></Rise>
        <Rise delay={12}><div style={{ fontWeight: 700, fontSize: 96, color: t.ink, lineHeight: 1.25 }}>আজকের প্রশ্ন</div></Rise>
      </Part></Sequence>
      <Sequence from={parts[1].from} durationInFrames={parts[1].dur}><Part dur={parts[1].dur}>
        <Floater name={sc.q || 'bulb'} size={280} t={t} />
        <Rise delay={4}><div style={{ fontWeight: 700, fontSize: 70, color: t.ink, lineHeight: 1.35 }}><Hl text={job.q || ''} words={sc.hl || []} color={t.dark ? t.hi : t.primary} /></div></Rise>
      </Part></Sequence>
      <Sequence from={parts[2].from} durationInFrames={parts[2].dur}><Part dur={parts[2].dur}>
        <Rise delay={2}><div style={{ fontWeight: 600, fontSize: 46, color: t.sub, lineHeight: 1.35 }}>{job.q}</div></Rise>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignSelf: 'stretch' }}>
          {(job.options || []).map((o, i) => (
            <Rise key={i} delay={10 + i * 10} y={40}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, background: t.card, border: `2px solid ${t.line}`, borderRadius: 28, padding: '24px 30px', textAlign: 'left' }}>
                <div style={{ minWidth: 70, height: 70, borderRadius: 20, background: t.primary, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 40 }}>{LET[i]}</div>
                <div style={{ fontWeight: 600, fontSize: 50, color: t.ink, lineHeight: 1.3 }}>{o}</div>
              </div>
            </Rise>
          ))}
        </div>
      </Part></Sequence>
      <Sequence from={parts[3].from} durationInFrames={parts[3].dur}><Part dur={parts[3].dur}>
        <Floater name={sc.opts || 'coins'} size={320} t={t} />
        <Rise delay={4}><div style={{ fontWeight: 700, fontSize: 84, color: t.ink, lineHeight: 1.3 }}>কমেন্টে আপনার উত্তর দিন</div></Rise>
        {job.prize && <Rise delay={12}><Kicker t={t}>পুরস্কার: {job.prize}</Kicker></Rise>}
      </Part></Sequence>
      <Chrome t={t} progress={f / total} />
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};

/* পোস্টের ছবি (৪:৫) */
export const Poster = ({ job = {}, brand }) => {
  const t = makeTheme(brand, job.style || 'clean');
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background t={t} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '190px 90px 190px', flexDirection: 'column', gap: 40, textAlign: 'center' }}>
        {job.object && <Floater name={job.object} size={380} t={t} still />}
        {job.kicker && <Kicker t={t}>{job.kicker}</Kicker>}
        <div style={{ fontWeight: 700, fontSize: 96, color: t.ink, lineHeight: 1.28 }}><Hl text={job.title || ''} words={job.hl || []} color={t.dark ? t.hi : t.primary} /></div>
        {job.sub && <div style={{ fontWeight: 600, fontSize: 46, color: t.sub, lineHeight: 1.4 }}>{job.sub}</div>}
        {job.info && <div style={{ fontWeight: 700, fontSize: 42, color: '#fff', background: t.primary, borderRadius: 999, padding: '16px 40px' }}>{job.info}</div>}
      </AbsoluteFill>
      <Chrome t={t} progress={1} />
    </AbsoluteFill>
  );
};
