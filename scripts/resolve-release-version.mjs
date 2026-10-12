import { readFileSync } from 'node:fs';
const base = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).version;
const fromTag = process.env.EVENT_NAME === 'push';
const version = fromTag ? (process.env.TAG_NAME ?? '').replace(/^v/, '')
  : `${process.env.INPUT_VERSION?.trim() || base}${['', 'final', '-final'].includes(process.env.INPUT_STATUS?.trim() ?? '') ? '' : '-' + process.env.INPUT_STATUS.trim().replace(/^-/, '')}`;
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[a-z][a-z0-9-]*)?$/.test(version)) throw new Error(`Invalid release version: ${version}`);
console.log(`version=${version}`);
console.log(`tag=v${version}`);
console.log(`prerelease=${version.includes('-')}`);
