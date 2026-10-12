// A real browser smoke test against the built ESM package, without a fiddle UI.
import { build, preview } from 'vite';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./browser/', import.meta.url));
await build({ root, logLevel: 'warn', build: { outDir: '../../dist/browser', emptyOutDir: true } });
const server = await preview({ root, logLevel: 'warn', build: { outDir: '../../dist/browser' }, preview: { host: '127.0.0.1', port: 0 } });
let browser;
try {
  browser = await chromium.launch({ channel: process.env.KALM_TEST_BROWSER_CHANNEL });
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.result || window.failure);
  const result = await page.evaluate(() => ({ result: window.result, failure: window.failure }));
  assert.equal(result.failure, undefined);
  assert.equal(result.result.source, 'fix value: Text = "<hello> 😀"');
  assert.ok(result.result.colors > 2);
  assert.equal(result.result.rendered, result.result.source);
  console.log('Built browser package: WASM, HTML, Unicode and tokens passed');
} finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
