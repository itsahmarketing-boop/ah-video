import React from 'react';
import { Composition, Still } from 'remotion';
import { Reel, Thumb } from './Reel.jsx';
import { Quiz, Poster } from './Quiz.jsx';

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

export const Root = () => (
  <>
    <Composition id="Reel" component={Reel} fps={FPS} width={1080} height={1920} durationInFrames={300} defaultProps={sample} calculateMetadata={meta} />
    <Composition id="ReelWide" component={Reel} fps={FPS} width={1920} height={1080} durationInFrames={300} defaultProps={{ ...sample, wide: true }} calculateMetadata={meta} />
    <Composition id="Quiz" component={Quiz} fps={FPS} width={1080} height={1920} durationInFrames={600} defaultProps={{ brand: sample.brand, job: { q: 'নমুনা প্রশ্ন?', options: ['ক', 'খ', 'গ', 'ঘ'] }, total: 600 }} calculateMetadata={meta} />
    <Still id="Thumb" component={Thumb} width={1080} height={1920} defaultProps={sample} />
    <Still id="ThumbWide" component={Thumb} width={1920} height={1080} defaultProps={{ ...sample, wide: true }} />
    <Still id="Poster" component={Poster} width={1080} height={1350} defaultProps={{ brand: sample.brand, job: { title: 'নমুনা শিরোনাম', style: 'clean', object: 'bulb' } }} />
  </>
);
