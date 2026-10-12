# Local extraction validation

Validated on 2026-10-12 with Node 24.14.1, TypeScript 7.0.2, Shiki 4.5.0, JDK 25.0.4.1, Maven 3.9.15, and installed Microsoft Edge.

- The canonical grammar retains the exact SHA-256 recorded in `PROVENANCE.md`. CommonJS raw grammar access and typed ESM rendering/token APIs pass.
- Four shared-package tests cover scope behavior, source/Unicode preservation, multiline state, HTML escaping, aliases, unknown-language fallback, and manual/tagged release version validation. Type checking passes. The production browser bundle successfully runs bundled WASM, HTML rendering, and tokens, including from an isolated checkout.
- All five affected npm repositories built/tested in fresh isolated checkouts with local tarballs and no sibling source access: shared highlighting, documentation, specification, VS Code, and website. VS Code began with an empty Kalm dependency cache and resolved server/fixtures from a local file registry.
- Documentation preserves all 117 documents, its ESM/CommonJS exports, and its legacy grammar asset export. The grammar is generated from the new package.
- All nine specification layout/highlighting/pagination tests pass across every Markdown edition. The final 1.1.0 light, dark, and print PDFs were generated; representative code pages were rendered to PNG and inspected. Each theme has six code colors, including print; page counts remain 20 for these outputs. Token intersections preserve wrapped source and synthetic continuation indentation without restarting grammar state.
- VS Code's eleven tests and VSIX packaging pass. The packaged grammar matches the canonical bytes; grammar and server staging precede packaging.
- Website type/content/build/link checks and all 22 browser tests pass, including themes, copy behavior, tabs, responsive layouts, legacy URLs, and JavaScript-disabled rendering.
- Updated tools npm staging and distribution assembly pass. ZIP/TAR contents, deterministic checksums, launchers and packaged compile/run verification pass. The distribution's legacy grammar path contains the canonical bytes.
- New/changed workflows pass actionlint 1.7.7. Specification's existing `queue: max` is not recognized by that older linter; the remainder was linted with that one line omitted and the unchanged queue setting was separately checked against [current GitHub documentation](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency). Job timeouts remain below one hour, with no schedules added.

No GitHub remote was attached to this repository. Nothing was pushed, published or deployed for this extraction. Live releases, registry access, and the optional GitHub integration run remain dependent on creating the remote, publishing the highlighting package, and granting consumer package-read access. Consumer lockfiles must be generated against the real registry after publication; no guessed URLs are committed.

Scratch logs, isolated checkouts, tarballs, and PDF review images are under the workspace's `.migration/` directory. Generated PDF/website/extension/distribution artifacts remain ignored. The new extraction commits use Conventional Commit messages. SSH signing remains locked, so signing is disabled only for these commit commands, without changing Git signing configuration.
