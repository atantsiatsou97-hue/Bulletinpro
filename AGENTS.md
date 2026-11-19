<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- The app is fully client-side and offline: all data lives in a persisted zustand store (`src/lib/school/store.ts`, localStorage); no backend, because it must run on school PCs without internet.
- All grading math (averages, ranks, appreciations, distinctions, decisions) lives in pure functions in `src/lib/school/calc.ts`, covered by `calc.test.ts`; UI never recomputes these itself.
- Distinction/sanction thresholds and appreciation bands live per level group in `thresholds.cycles` (6e–5e / 4e–3e), resolved for a class via `rulesFor()` (manual `cycle` or class name); old saves go through `normalizeThresholds()` so backups keep loading.
- The UI is one stateful `SchoolApp` component (view switching via the UI store, not routes) so the same code runs in the TanStack `/` route and in the Electron build.
- Desktop build: `vite.desktop.config.ts` bundles `desktop/main.tsx` into `desktop-dist/` as a classic IIFE script (file:// blocks module scripts); `electron/build-windows.sh` packages it and builds the NSIS installer. Never add Electron code to the web app path.
- Printing uses a portal `.print-area` outside `.app-shell` with A4 `@page` rules in `src/styles.css`.
- Each level group's subject list and coefficients live in `thresholds.cycles[cycle].matieres` (editable in Settings; `OFFICIAL` in `defaults.ts` is only the starting/reset list). New classes copy that list; existing classes change only through explicit "apply" buttons (`applyOfficialSubjects`, matched by subject name so grades stay attached).
- Persistence goes through `safeStorage` in `store.ts`, which toasts instead of silently dropping writes when localStorage (~5.2M chars in Chromium/Electron) is full; Settings shows usage via `storageUsage()`, so capacity is ~2,000 students per school year.
- Installer version lives in `VERSION` in `electron/build-windows.sh` (passed to `installer.nsi`); bump it for each new installer so it upgrades in place, keeping user data in AppData.
- Offline web install: `vite-plugin-pwa` (generateSW, `/sw.js`, NetworkFirst pages + CacheFirst `/assets/`) registered only from `src/lib/school/register-sw.ts` in the `/` route, never in preview/dev or the Electron build.
- Bulletin PDFs are rendered on-device (`src/lib/school/pdf.ts`, jsPDF + html2canvas-pro on `.bulletin-page`); backups via `src/lib/school/backup.ts`.
