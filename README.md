# Kalm syntax highlighting

The shared TextMate grammar and Shiki renderer for the website, specification PDFs, VS Code, and future browser tools. Package releases use independent package versions; the initial rules preserve the existing Kalm 1.1 highlighting, including historical spellings. This package does not validate programs or implement the 1.2 draft.

```sh
npm install @kalm-lang/syntax-highlighting@0.1.0
```

Consumers use GitHub's npm registry. Configure `@kalm-lang:registry=https://npm.pkg.github.com` and `//npm.pkg.github.com/:_authToken=${KALM_PACKAGES_READ_TOKEN}` in `.npmrc`. Set the environment variable to a token with `read:packages` and access to this package. Never commit a token. Node 20.18+ is supported; repository checks use Node 22+.

```js
import { createKalmHighlighter, resolveLanguage, themes } from '@kalm-lang/syntax-highlighting';
const highlighter = await createKalmHighlighter();
try {
  const lang = resolveLanguage('kalm');
  const html = highlighter.codeToHtml('fix answer = 42', { lang, themes });
  const { tokens } = highlighter.codeToTokens('fix answer = 42', { lang, theme: themes.light });
  // Tokens retain content, UTF-16 offsets, colors and multiline grammar state.
  console.log(html, tokens);
} finally { highlighter.dispose(); }
```

The same ESM API works in Vite/browser bundles using bundled Oniguruma WASM, with no Node filesystem imports or external WASM downloads. Create one highlighter per editor/renderer, reuse it, and dispose it when its owner closes. The future fiddle can use the tokens or HTML API; editor UI, execution and language-server features remain separate.

`kalmGrammar` exports the raw grammar in ESM. CommonJS build scripts and TextMate registries can use `require('@kalm-lang/syntax-highlighting/grammar')` or `require.resolve(...)` to copy the raw JSON into an editor package. Keep generated copies out of source control. `resolveLanguage` maps Kalm script/shell/file aliases and falls back to plain text for unsupported languages; the engine itself receives only resolved languages. The factory loads Kalm, Java, Bash, XML, Kotlin and JSON, with GitHub light/dark themes. It does not trim source or add application UI.

```sh
npm ci
npm test
npm run check
npx playwright install chromium
npm run test:browser
npm pack
```

For installed Microsoft Edge, set `KALM_TEST_BROWSER_CHANNEL=msedge` instead of downloading Chromium. Checks and browser smoke tests have a five-minute CI limit, with no schedules. Tags `vX.Y.Z[-status]` or manual version/status inputs publish one package and create a GitHub release without assets; releases have a ten-minute limit and reject duplicates. Publishing uses the repository's `GITHUB_TOKEN` with `packages: write`.

Until a GitHub remote exists, `npm pack --pack-destination <directory>` creates the local package. The optional `tools` workspace stages this tarball before documentation, VS Code, and website installation. Specification PDF development can install it with `npm install --no-save --no-package-lock <tarball>` as well. The default consumer manifests pin the published version and never read sibling source directories.

Create the GitHub repository and attach `origin` separately. Publish this package before documentation and other consumers, configure their read token/package access, then generate real registry-backed lockfiles. No guessed registry URLs or local tarball paths belong in committed consumer lockfiles.
