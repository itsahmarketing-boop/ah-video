// Bitbucket ব্যাকআপ: অ্যাপ থেকে কাজ নেয়, ভিডিও বানায়, ফাইল সরাসরি Google Drive এ আপলোড করে অ্যাপকে জানায়
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const { JOB_ID: id, JOB_TAG: tag, JOB_KEY: key, CALLBACK: cb } = process.env;
if (!id || !tag || !key || !/^https:\/\/script\.google\.com\//.test(cb || '')) { console.error('missing variables'); process.exit(1); }
const base = { backup: 1, key, id, tag };
const send = (body) => fetch(cb, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.text());
const why = (e) => String((e && e.message) || e) + (e && e.cause ? ' (' + (e.cause.code || e.cause.message || e.cause) + ')' : '');

try {
  const got = JSON.parse(await send({ ...base, get: 1 }));
  if (!got.ok || !got.job) throw new Error('কাজ পাওয়া যায়নি: ' + (got.error || ''));
  fs.writeFileSync('job.json', got.job);
  execFileSync('node', ['scripts/prepare.mjs', 'job.json'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/render.mjs'], { stdio: 'inherit', env: { ...process.env, RENDER_CONCURRENCY: process.env.RENDER_CONCURRENCY || '2' } });
  const files = fs.readdirSync('out').filter((n) => /\.(mp4|jpg)$/.test(n)).sort();
  if (!files.length) throw new Error('কোনো ফাইল তৈরি হয়নি');
  for (const n of files) {
    const s = JSON.parse(await send({ ...base, session: n }));
    if (!s.ok || !s.url) throw new Error('আপলোড লিংক পাওয়া যায়নি: ' + (s.error || ''));
    const buf = fs.readFileSync(path.join('out', n));
    const up = await fetch(s.url, { method: 'PUT', headers: { 'Content-Type': s.mime, 'Content-Length': String(buf.length) }, body: buf });
    const j = await up.json().catch(() => ({}));
    if (!up.ok || !j.id) throw new Error('Drive আপলোড হয়নি: ' + up.status);
    console.log('uploaded', n, j.id, Math.round(buf.length / 1024) + ' KB', (await send({ ...base, uploaded: n, driveId: j.id })).slice(0, 80));
  }
  console.log(await send({ ...base, done: 1 }));
} catch (e) {
  console.error(e);
  await send({ ...base, error: why(e).slice(0, 300) }).catch(() => {});
  process.exit(1);
}
