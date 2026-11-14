// props.json থেকে ভিডিও আর থাম্বনেইল বানায়: out/ ফোল্ডারে (16:9 ফাইলের নামে "wide")
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const props = JSON.parse(fs.readFileSync('props.json', 'utf8'));
fs.mkdirSync('out', { recursive: true });
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const run = (args) => execFileSync(npx, ['remotion', ...args, '--props=props.json', '--log=warn'], { stdio: 'inherit', shell: process.platform === 'win32' });
const conc = process.env.RENDER_CONCURRENCY ? [`--concurrency=${process.env.RENDER_CONCURRENCY}`] : [];
if (props.frames) conc.push(`--frames=${props.frames[0]}-${props.frames[1]}`);   // কাটছাঁট

if (props.kind === 'image') {
  run(['still', 'src/index.js', 'Poster', 'out/poster.jpg', '--image-format=jpeg', '--jpeg-quality=92']);
} else if (props.kind === 'quiz') {
  run(['render', 'src/index.js', 'Quiz', 'out/quiz.mp4', '--codec=h264', '--crf=20', ...conc]);
  run(['still', 'src/index.js', 'Thumb', 'out/quiz.jpg', '--image-format=jpeg', '--jpeg-quality=90']);
} else {
  const f = props.format || 'vertical';
  if (f === 'vertical' || f === 'both') {
    run(['render', 'src/index.js', 'Reel', 'out/reel.mp4', '--codec=h264', '--crf=20', ...conc]);
    run(['still', 'src/index.js', 'Thumb', 'out/reel.jpg', '--image-format=jpeg', '--jpeg-quality=90']);
  }
  if (f === 'wide' || f === 'both') {
    run(['render', 'src/index.js', 'ReelWide', 'out/reel-wide.mp4', '--codec=h264', '--crf=20', ...conc]);
    run(['still', 'src/index.js', 'ThumbWide', 'out/reel-wide.jpg', '--image-format=jpeg', '--jpeg-quality=90']);
  }
}
console.log('rendered:', fs.readdirSync('out').join(', '));
