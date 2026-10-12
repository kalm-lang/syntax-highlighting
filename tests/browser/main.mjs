import { createKalmHighlighter, themes } from '@kalm-lang/syntax-highlighting';
try {
  const highlighter = await createKalmHighlighter();
  const source = 'fix value: Text = "<hello> 😀"';
  const { tokens } = highlighter.codeToTokens(source, { lang: 'kalm', theme: themes.light });
  const html = highlighter.codeToHtml(source, { lang: 'kalm', themes });
  const rendered = document.createElement('div');
  rendered.innerHTML = html;
  window.result = { source: tokens.map(line => line.map(token => token.content).join('')).join('\n'),
    colors: new Set(tokens.flat().map(token => token.color)).size,
    html, rendered: rendered.textContent };
  highlighter.dispose();
} catch (error) { window.failure = String(error); }
