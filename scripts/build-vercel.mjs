import { mkdir, readdir, copyFile } from 'node:fs/promises';

// Publish browser assets only. The Worker bundle and API source are server code.
await mkdir('public', { recursive: true });
const files = (await readdir('dist', { withFileTypes: true }))
  .filter(file => file.isFile() && /\.(html|js|css|svg)$/.test(file.name));
for (const file of files) {
  await copyFile(`dist/${file.name}`, `public/${file.name}`);
}
console.log(`Prepared ${files.length} browser assets for Vercel. AI routes use api/.`);
