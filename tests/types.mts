import { createKalmHighlighter, kalmGrammar, resolveLanguage, themes } from '@kalm-lang/syntax-highlighting';
const highlighter = await createKalmHighlighter();
const lang = resolveLanguage('kalms');
const html: string = highlighter.codeToHtml('fix x = 1', { lang, themes });
const tokens = highlighter.codeToTokens('fix x = 1', { lang, theme: themes.light });
const scope: string = kalmGrammar.scopeName;
console.log(html, tokens.tokens[0][0].content, scope);
highlighter.dispose();
