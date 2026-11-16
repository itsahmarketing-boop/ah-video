import React from 'react';
import { Composition, Still } from 'remotion';
import { Reel, Thumb } from './Reel.jsx';
import { Quiz, Poster } from './Quiz.jsx';
import { LookEditorial, LookBold, LookGlass, LookArabesque } from './Preview.jsx';
import { ReelBold, ThumbBold } from './BoldReel.jsx';
import { Captioned } from './CaptionReel.jsx';
import { MoneyPhone } from './MoneyPhone.jsx';

const capSample = {
  videoFile: 'test-input.mp4', brand: { name: 'হুরাইরা', primary: '#0F766E', accent: '#134E4A' }, grade: true, total: 180,
  segments: [
    { text: 'আসসালামু আলাইকুম বন্ধুরা', from: 6, to: 52 },
    { text: 'আজ কথা বলব হালাল উপার্জন নিয়ে', from: 52, to: 120 },
    { text: 'সৎ আয়েই আসল বরকত', from: 120, to: 176 },
  ],
};

const boldSample = {
  brand: { name: 'হুরাইরা', primary: '#0F766E', accent: '#134E4A' }, niche: 'islamic', seed: 3, total: 490, audio: null,
  scenes: [
    { kind: 'hook', kicker: 'ইসলামী অর্থনীতি', text: 'হালাল আয়েই বরকত', big: ['বরকত'], sub: 'সততা থাকলে অল্প সম্পদেও শান্তি আসে।' },
    { kind: 'point', text: 'সম্পদের পরিমাণ নয়, বরকতই আসল সম্পদ', big: ['বরকতই'] },
    { kind: 'list', text: 'বরকতের তিন উৎস', items: ['সৎ উপার্জন', 'দান ও যাকাত', 'কৃতজ্ঞতা'] },
    { kind: 'stat', value: '২.৫%', text: 'বছরে সম্পদের উপর যাকাত' },
    { kind: 'quote', text: 'যে কৃতজ্ঞ হয়, তাকে আরও দেওয়া হয়', source: 'হুরাইরা' },
    { kind: 'cta', text: 'আজ থেকে শুরু করুন', big: ['শুরু'], sub: 'প্রতিদিন নতুন পাঠ পেতে ফলো করুন' },
  ],
  timing: [{ from: 0, dur: 80 }, { from: 80, dur: 80 }, { from: 160, dur: 80 }, { from: 240, dur: 80 }, { from: 320, dur: 80 }, { from: 400, dur: 90 }],
};

const FPS = 30;
const meta = ({ props }) => ({ durationInFrames: Math.max(60, Math.round(props.total || 300)) });
const sample = {
  brand: { name: 'AH Marketing', website: 'itsahmarketing-boop.github.io', primary: '#4F46E5', accent: '#0F172A' },
  style: 'dark', total: 300, audio: null,
  scenes: [
    { kind: 'hook', kicker: 'মার্কেটিং টিপস', text: 'বিক্রি বাড়ানোর তিনটি সহজ উপায়', big: ['বিক্রি'], object: 'chart' },
    { kind: 'list', text: 'যা করবেন', items: ['নিয়মিত পোস্ট', 'সঠিক দর্শক', 'সৎ বিজ্ঞাপন'] },
    { kind: 'cta', text: 'আজই শুরু করুন', sub: 'ফ্রি পরামর্শের জন্য ইনবক্স করুন', object: 'bulb' },
  ],
  timing: [{ from: 0, dur: 100 }, { from: 100, dur: 110 }, { from: 210, dur: 90 }],
};
const hur = { name: 'হুরাইরা', primary: '#0F766E', accent: '#134E4A' };

export const Root = () => (
  <>
    <Composition id="Reel" component={ReelBold} fps={FPS} width={1080} height={1920} durationInFrames={300} defaultProps={boldSample} calculateMetadata={meta} />
    <Composition id="ReelWide" component={Reel} fps={FPS} width={1920} height={1080} durationInFrames={300} defaultProps={{ ...sample, wide: true }} calculateMetadata={meta} />
    <Composition id="Quiz" component={Quiz} fps={FPS} width={1080} height={1920} durationInFrames={600} defaultProps={{ brand: sample.brand, job: { q: 'নমুনা প্রশ্ন?', options: ['ক', 'খ', 'গ', 'ঘ'] }, total: 600 }} calculateMetadata={meta} />
    <Still id="Thumb" component={ThumbBold} width={1080} height={1920} defaultProps={boldSample} />
    <Still id="ThumbWide" component={Thumb} width={1920} height={1080} defaultProps={{ ...sample, wide: true }} />
    <Still id="Poster" component={Poster} width={1080} height={1350} defaultProps={{ brand: sample.brand, job: { title: 'নমুনা শিরোনাম', style: 'clean', object: 'bulb' } }} />
    <Still id="LookEditorial" component={LookEditorial} width={1080} height={1920} defaultProps={{ brand: hur }} />
    <Still id="LookBold" component={LookBold} width={1080} height={1920} defaultProps={{ brand: hur }} />
    <Still id="LookGlass" component={LookGlass} width={1080} height={1920} defaultProps={{ brand: hur }} />
    <Still id="LookArabesque" component={LookArabesque} width={1080} height={1920} defaultProps={{ brand: hur }} />
    <Composition id="ReelBold" component={ReelBold} fps={FPS} width={1080} height={1920} durationInFrames={490} defaultProps={boldSample} calculateMetadata={meta} />
    <Composition id="Captioned" component={Captioned} fps={FPS} width={1080} height={1920} durationInFrames={180} defaultProps={capSample} calculateMetadata={meta} />
    <Composition id="CaptionedWide" component={Captioned} fps={FPS} width={1920} height={1080} durationInFrames={1350} defaultProps={capSample} calculateMetadata={meta} />
        <Composition id="MoneyPhone" component={MoneyPhone} durationInFrames={150} fps={30} width={1080} height={1920} defaultProps={{ brand: { name: 'AH Marketing', primary: '#4F46E5', accent: '#0F172A' }, base: 1250, incoming: 500, label: 'টাকা জমা হয়েছে' }} />
</>
);
