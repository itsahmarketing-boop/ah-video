// Bitbucket ব্যাকআপ: অ্যাপ থেকে কাজ নেয়, ভিডিও বানায়, ফাইলগুলো অ্যাপে ফেরত পাঠায়
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const { JOB_ID: id, JOB_TAG: tag, JOB_KEY: key, CALLBACK: cb } = process.env;
if (!id || !tag || !key || !/^https:\/\/script\.google\.com\//.test(cb || '')) { console.error('missing variables'); process.exit(1); }
const base = { backup: 1, key, id, tag };
const send = (body) => fetch(cb, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.text());

try {
  const got = JSON.parse(await send({ ...base, get: 1 }));
  if (!got.ok || !got.job) throw new Error('কাজ পাওয়া যায়নি: ' + (got.error || ''));
  fs.writeFileSync('job.json', got.job);
  execFileSync('node', ['scripts/prepare.mjs', 'job.json'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/render.mjs'], { stdio: 'inherit', env: { ...process.env, RENDER_CONCURRENCY: process.env.RENDER_CONCURRENCY || '2' } });
  const files = fs.readdirSync('out').filter((n) => /\.(mp4|jpg)$/.test(n));
  if (!files.length) throw new Error('কোনো ফাইল তৈরি হয়নি');
  for (const n of files) console.log('uploaded', n, (await send({ ...base, file: n, b64: fs.readFileSync(path.join('out', n)).toString('base64') })).slice(0, 100));
  console.log(await send({ ...base, done: 1 }));
} catch (e) {
  console.error(e);
  await send({ ...base, error: String((e && e.message) || e).slice(0, 300) }).catch(() => {});
  process.exit(1);
}
