import kalmGrammar from '../grammars/kalm.tmLanguage.json' with { type: 'json' };
import legacyKalmGrammar from '../grammars/kalm-legacy.tmLanguage.json' with { type: 'json' };
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import light from '@shikijs/themes/github-light';
import dark from '@shikijs/themes/github-dark';
import java from '@shikijs/langs/java';
import bash from '@shikijs/langs/bash';
import xml from '@shikijs/langs/xml';
import kotlin from '@shikijs/langs/kotlin';
import json from '@shikijs/langs/json';

export { kalmGrammar, legacyKalmGrammar };
export const themes = Object.freeze({ light: 'github-light', dark: 'github-dark' });
export const languages = Object.freeze(['kalm', 'java', 'bash', 'xml', 'kotlin', 'json', 'text']);

/** Resolve fence/file aliases; unknown languages deliberately remain plain text. */
export function resolveLanguage(language = 'kalm') {
  const name = String(language).trim().split(/[\s,]/)[0].toLowerCase();
  const alias = { kalms: 'kalm', sh: 'bash', shell: 'bash', kt: 'kotlin', txt: 'text', plaintext: 'text' }[name] ?? name;
  return languages.includes(alias) ? alias : 'text';
}

/** Create once per renderer/editor and dispose when that owner is finished. */
export async function createKalmHighlighter({ edition = '1.2' } = {}) {
  if (!['1.2', 'legacy'].includes(edition)) throw new RangeError(`Unsupported Kalm highlighting edition: ${edition}`);
  const grammar = edition === 'legacy' ? legacyKalmGrammar : kalmGrammar;
  return createHighlighterCore({
    themes: [light, dark],
    langs: [{ ...structuredClone(grammar), name: 'kalm', aliases: ['kalms'] }, java, bash, xml, kotlin, json],
    engine: createOnigurumaEngine(import('shiki/wasm')),
  });
}
