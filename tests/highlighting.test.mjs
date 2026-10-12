import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createKalmHighlighter, kalmGrammar, resolveLanguage, themes } from '@kalm-lang/syntax-highlighting';

test('raw grammar works in CommonJS and keeps the editor scope', () => {
  const grammar = createRequire(import.meta.url)('@kalm-lang/syntax-highlighting/grammar');
  assert.deepEqual(grammar, kalmGrammar);
  assert.equal(grammar.scopeName, 'source.kalm');
});

test('Node HTML and tokens preserve source, theme colors, escaping, and multiline state', async () => {
  const highlighter = await createKalmHighlighter();
  try {
    const source = '## block\ncontinued ##\npub fun title(@Deprecated name: Text?) -> Text = @"héllo ${name?.upper() ?? \\"guest\\"}";\n# 😀 <script>&\n';
    for (const theme of Object.values(themes)) {
      const { tokens } = highlighter.codeToTokens(source, { lang: 'kalm', theme });
      assert.equal(tokens.map(line => line.map(token => token.content).join('')).join('\n'), source);
      assert.ok(new Set(tokens.flat().map(token => token.color)).size > 3);
      assert.equal(tokens[0][0].color, tokens[1][0].color, 'block comment state must cross lines');
      for (const line of tokens) for (const token of line) assert.ok(Number.isInteger(token.offset));
    }
    const html = highlighter.codeToHtml(source, { lang: 'kalm', themes });
    assert.match(html, /--shiki-dark/);
    assert.match(html, /(?:&lt;|&#x3C;)script(?:&gt;|>)(?:&amp;|&#x26;)/);
    assert.doesNotMatch(html, /<script>/);
    assert.equal(resolveLanguage('unsupported'), 'text');
    assert.equal(resolveLanguage('kalms'), 'kalm');
    assert.equal(resolveLanguage(''), 'text');
    assert.equal(highlighter.codeToTokens('', { lang: 'text', theme: themes.light }).tokens.length, 1);
    for (const lang of ['java', 'bash', 'xml', 'kotlin', 'json']) {
      assert.ok(highlighter.codeToHtml('value = "test"', { lang, themes }).includes('shiki'));
    }
  } finally { highlighter.dispose(); }
});

test('existing Kalm scopes retain comments, operators, types, calls and annotations', async () => {
  const highlighter = await createKalmHighlighter();
  try {
    const source = '### documentation\n## block ##\npub fun run(@Deprecated name: Text?) -> Text = name?.upper() ?? "Anonymous";\n'
      + 'sayLine(@"Augmented: ${visitorName.decorated()} $totalVisits");\n'
      + 'handle (error: java.io.IOException) {\n  fix ready = true\n}';
    const tokens = highlighter.codeToTokens(source, { lang: 'kalm', theme: themes.light, includeExplanation: true }).tokens.flat();
    const has = (value, scope) => tokens.some(token => token.content.includes(value) && token.explanation?.some(part => part.scopes.some(s => s.scopeName === scope)));
    assert.ok(has('documentation', 'comment.block.documentation.kalm'));
    assert.ok(has('?.', 'keyword.operator.kalm'));
    assert.ok(has('Text', 'support.type.kalm'));
    assert.ok(has('decorated', 'entity.name.function.call.kalm'));
    assert.ok(has('IOException', 'support.type.kalm'));
    assert.ok(has('fix', 'keyword.control.kalm'));
    assert.ok(tokens.some(token => token.content.includes('Deprecated') && token.explanation?.some(part => part.scopes.some(s => s.scopeName.includes('annotation')))));
  } finally { highlighter.dispose(); }
});
