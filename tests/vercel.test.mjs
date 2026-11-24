import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import ai from '../api/ai.js';
import status from '../api/ai/status.js';

test('Vercel serves browser files without publishing server bundles or secrets', async () => {
  execFileSync(process.execPath, ['scripts/build-vercel.mjs']);
  const files = await readdir('public');
  assert.ok(files.includes('index.html'));
  assert.ok(files.includes('app.js'));
  assert.ok(!files.some(name => name.includes('server') || name.includes('.env')));
  assert.match(await readFile('public/index.html', 'utf8'), /TuonTa/);
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, 'public');
});

test('Vercel AI and status entry points use Web Request/Response handlers', async () => {
  const response = await status.fetch(new Request('https://tuonta.example/api/ai/status'));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(typeof body.configured, 'boolean');
  assert.equal(body.provider, 'Groq');
  assert.ok(!('GROQ_API_KEY' in body));
  const invalidMethod = await ai.fetch(new Request('https://tuonta.example/api/ai'));
  assert.equal(invalidMethod.status, 405);
});
