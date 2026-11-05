// `npm run build`. The public site is fully static (`nuxt generate`). The
// editor site (STUDIO_EDITOR=true, see docs/editor-setup.md) keeps a small
// server for Nuxt Studio's login (`nuxt build`). Both hosts run this same
// command, because vercel.json sets one build command for every project.
import { spawnSync } from 'node:child_process';

const command = process.env.STUDIO_EDITOR === 'true' ? 'build' : 'generate';
console.log(`Building with \`nuxt ${command}\`${command === 'build' ? ' (editor site)' : ''}`);
const result = spawnSync('npx', ['nuxt', command], { stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(result.status ?? 1);
