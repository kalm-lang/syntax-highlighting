import type { HighlighterCore, LanguageRegistration } from 'shiki';
export declare const kalmGrammar: LanguageRegistration;
export declare const themes: Readonly<{ light: 'github-light'; dark: 'github-dark' }>;
export declare const languages: readonly string[];
export declare function resolveLanguage(language?: string): string;
export declare function createKalmHighlighter(): Promise<HighlighterCore>;
