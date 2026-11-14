// পরীক্ষার কাজ: নকল ভয়েস (হালকা সুর) দিয়ে একটা রিল
import fs from 'node:fs';
const rate = 24000, sec = 14, n = rate * sec, b = Buffer.alloc(n * 2);
for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(Math.sin(i / rate * 2 * Math.PI * 220) * 1500 * (i % rate < rate * 0.7 ? 1 : 0)), i * 2);
const texts = ['আসসালামু আলাইকুম, বিক্রি বাড়ানোর তিনটি সহজ উপায় জেনে নিন।', 'প্রথমত নিয়মিত পোস্ট, দ্বিতীয়ত সঠিক দর্শক, তৃতীয়ত সৎ বিজ্ঞাপন।', 'আমাদের অভিজ্ঞতায় নিয়মিত পোস্টে রিচ বাড়ে।', 'আজই শুরু করুন, ফ্রি পরামর্শের জন্য ইনবক্স করুন।'];
const job = {
  type: 'reel', id: 'rtest01', style: process.argv[2] || 'dark', format: process.argv[3] || 'vertical',
  brand: { name: 'AH Marketing', website: 'itsahmarketing-boop.github.io', primary: '#4F46E5', accent: '#0F172A' },
  scenes: [
    { kind: 'hook', kicker: 'মার্কেটিং টিপস', text: 'বিক্রি বাড়ানোর তিনটি সহজ উপায়', big: ['বিক্রি'], object: 'chart', say: texts[0] },
    { kind: 'list', text: 'যা করবেন', items: ['নিয়মিত পোস্ট', 'সঠিক দর্শক', 'সৎ বিজ্ঞাপন'], say: texts[1] },
    { kind: 'stat', text: 'নিয়মিত পোস্টে রিচ বাড়ে', value: '৩ গুণ', object: 'bulb', say: texts[2] },
    { kind: 'cta', text: 'আজই শুরু করুন', sub: 'ফ্রি পরামর্শের জন্য ইনবক্স করুন', object: 'mic', say: texts[3] },
  ],
  voice: { all: { pcm: b.toString('base64'), rate }, texts },
};
fs.writeFileSync('job.json', JSON.stringify(job));
console.log('test job written');
