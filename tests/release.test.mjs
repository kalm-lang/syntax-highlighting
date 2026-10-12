import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test('manual and tagged package releases resolve versions and reject invalid inputs', () => {
  const resolve = env => spawnSync(process.execPath, ['scripts/resolve-release-version.mjs'], {
    encoding: 'utf8', env: { ...process.env, EVENT_NAME: 'workflow_dispatch', INPUT_VERSION: '', INPUT_STATUS: '', TAG_NAME: '', ...env },
  });
  const base = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).version;
  assert.equal(resolve({}).stdout, `version=${base}\ntag=v${base}\nprerelease=${base.includes('-')}\n`);
  assert.equal(resolve({ INPUT_VERSION: '1.2.3', INPUT_STATUS: 'draft' }).stdout,
    resolve({ EVENT_NAME: 'push', TAG_NAME: 'v1.2.3-draft' }).stdout);
  assert.notEqual(resolve({ EVENT_NAME: 'push', TAG_NAME: 'v01.2.3' }).status, 0);
  assert.notEqual(resolve({ INPUT_VERSION: '1.2.3; echo invalid' }).status, 0);
});
