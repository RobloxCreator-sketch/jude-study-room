# Jude Study Room

A personal Mac and Windows app for GED tutoring. It includes four subject classrooms, video lessons, short readings, written assignments, grades, and tutor feedback.

## Download and install

Get the current version from [Releases](https://github.com/RobloxCreator-sketch/jude-study-room/releases/latest).

- **Windows (64-bit):** Run the `win-x64.exe` setup installer. If you used the older ZIP installer, install this release once; future updates can download and install from within the app.
- **Mac (Apple Silicon):** Quit the old app, unzip the `mac-arm64.zip` download, and drag Jude Study Room into Applications. Replace the old copy when asked. This personal build is ad-hoc signed and is not notarized by Apple. Keep macOS protections enabled and follow its normal app-opening prompts.

Sign in with your existing classroom username. The app uses the same hosted classroom service, so reinstalling does not delete accounts, answers, or grades. Internet is needed for shared work and YouTube videos.

## Updating the app

Choose **Updates** in the app or **Help → Check for updates**. The app also checks at launch and every six hours. Windows downloads updates only when you choose to download, and restarts only after confirmation. On Mac, an update opens the exact GitHub download for this app and your processor; replace the app manually. Save open work before installing.

The legacy 0.2.0 build does not have an updater. Install the current version once to enable the update system.

## Publishing another version

1. Make and test the app changes.
2. Increase `version` in `package.json` (for example, `0.4.0` to `0.4.1`).
3. Commit and push to `main`.

GitHub Actions runs tests, builds the Mac app on a Mac runner and the Windows installer on a Windows runner, checks that required update components are packaged, and publishes a complete GitHub Release. Downloads are kept in a draft until both platforms finish. Published versions are not overwritten; use a new version for a new update. No personal GitHub token or Apple Developer account is required by this workflow. The workflow's temporary GitHub token stays in GitHub Actions and is not bundled into the app.

GitHub handles app distribution. The separately hosted classroom service holds account records and schoolwork. Its source, database, and credentials are intentionally absent from this public app repository.

## Development

Use Node 24 and pnpm 11.25.0:

```
pnpm install
pnpm test
pnpm start
```

Build Windows on Windows with `pnpm dist:win`. Build a manual Mac download on Mac with `node scripts/package-mac.cjs arm64`.

From 0.6.0, lessons and classroom interface files update independently from the installed desktop app. They are delivered through the validated GitHub classroom channel described below. Assignments, submissions, and grades sync online; click Refresh to load the other person’s changes.

## Unit folders and Lesson 2 (0.4.0)

Open Classrooms, choose a subject, then open its Unit 1 folder. Each subject now has two lessons:

- Mathematics: two-step equations; like terms and the distributive property.
- Language Arts: main idea; evidence-based inferences.
- Science: fair experiments; data tables and line graphs.
- Social Studies: evidence and opinion; the three federal branches.

Each Lesson 2 includes a credited YouTube video, three short original readings, a visual, personal notes, and five questions worth 20 points. The science lesson also has a table and line graph. Tutor answer guides are supplied only to authenticated tutor accounts by the classroom service.

Tutors can choose **+ New unit** in a classroom, **Move** beside a lesson, and a unit folder when creating an assignment. Unit organization is shared with Jude. Existing answers, grades, due dates, feedback, and notes are preserved. Click Refresh to load changes from the other app. Both people should install 0.4.0 to use folder navigation.

## Readable math and flexible submissions (0.5.0)

The app bundles [KaTeX](https://katex.org/) under its MIT license for readable, accessible math without a CDN. Powers such as `x^2`, numeric fractions such as `1/2`, and `sqrt(x)` render automatically. Formal expressions use LaTeX inside `\( … \)`, `\[ … \]`, or `$$ … $$`. Dollar prices in prose remain plain text. Input stays editable as text while a live preview shows the formatted result. Rendering disables trusted commands and limits macro expansion.

Students can submit written answers, files, a Google Docs document link, or a combination. The student account selects files through the operating system picker. The tutor can view JPG/PNG/WebP photos in the app and download documents. Supported uploads: JPG/JPEG, PNG, WebP, PDF, DOCX, UTF-8 TXT; up to five files per assignment, 10 MB per file, and 200 MB total for this personal classroom. Convert HEIC photos to JPG. File type signatures and server-side quotas are checked.

Files are held in private classroom storage and retrieved through authenticated routes; they are absent from this public repository. Uploads submit immediately. Text and document links submit on Save. File changes update the classroom revision so simultaneous edits cannot silently overwrite work. Graded work rejects file changes and answer/link edits until the tutor clears its grade.

A Docs link opens in the browser and still needs normal Google sharing with the tutor. It is a live document, not a frozen submission; upload a PDF when a fixed copy matters. The app does not connect to Google Drive or request Google account credentials.

JSON backups include links and metadata, not attachment bytes. Download important attachments separately. The separate classroom service handles the additive metadata migration; account and work tables are preserved.

## Classroom updates without reinstalling (0.6.0)

Install 0.6.0 once on Mac and Windows. Each launch checks a dedicated GitHub `classroom` branch for validated interface and lesson files. Only changed files download; matching bundled or saved files are reused. A complete snapshot becomes active after every file’s SHA-256 and size match. The app retains a local copy and includes its original classroom for fallback. An offline launch can open that interface; signing in, saving work, and loading YouTube still require internet.

**Updates → Check classroom updates** can download improvements during a session. **Reload classroom** asks you to save first and signs you in again. It never reloads open work automatically. **Help → Recover included classroom** restores the interface shipped with the desktop app for that session.

### Publishing a lesson or interface change

1. Edit `ui/` (including `ui/lessons.js` for bundled lesson material).
2. Run `node scripts/content-manifest.cjs`.
3. Run `pnpm test` and `node scripts/validate-release.cjs`, then push to `main`.
4. GitHub validation must pass before `publish-classroom` advances the delivery branch.

Keep `package.json` at the same version for classroom-only changes. Once that desktop version has been released, the workflow skips installer builds and publishes only the classroom channel. Add matching shared assignments and tutor-only answer guides through the separate private classroom service when introducing a new assigned lesson. The classroom editor below now supports creating classes and custom lessons directly in the app.

The native bridge is versioned. Changes to `desktop/`, native dependencies, Electron, or new operating-system features need a desktop version bump and installers. Raise the manifest’s minimum shell version or bridge version when a classroom interface requires new native capabilities. Existing apps keep their saved interface if they cannot use a newer bridge.

Classroom downloads are pinned to one commit of this repository, fetched over HTTPS without credentials, bounded by file/count/total limits, and kept inside the app’s own cache. No archive extraction, native executable patches, account records, password tokens, or assignment uploads are involved in the GitHub content channel. The renderer keeps its existing sandbox, context isolation, navigation restrictions, and a narrowly checked main-frame bridge.

## Classes, lesson editor, and classroom designs

This is a classroom-content update for desktop 0.6.0; the desktop version stays unchanged. Reopen the app or choose Updates → Check classroom updates → Reload classroom after saving open work.

Tutors can use **Classrooms → Add class**, **Customize classroom**, and **Add lesson**. Classes have stable numeric IDs, their own unit folders, a name, description, icon, theme, accent/background colors, a pattern, and optional personal banner/background pictures. Six illustrated themes are included. Picture input uses the browser file picker, re-encodes to a small JPEG, and saves in the authenticated classroom state. No user-selected pictures are added to GitHub.

The lesson editor supports a goal, optional YouTube video, up to ten short readings, a step-by-step visual, assignment instructions, and a private tutor guide. Saving publishes the lesson and creates or updates its assignment. Editing keeps existing answers and grades. Custom lessons and designs are shared records, so future edits need no app download. The original GED lessons remain available.

An EffectCraft Studio starter class introduces compositions, layers, and a first title card, based on the [official EffectCraft project](https://github.com/storytold/effectcraft). Its assignment accepts a screenshot and explanation; no video render or project-file upload is required. The starter lesson has no embedded tutorial video. Tutors may add a YouTube video in the editor.

The shared service enforces tutor-only editing, hides answer guides from student responses, validates class/lesson membership, and preserves older clients’ GED views without dropping extracurricular records. Personal notes remain per account. Up to 20 classes and 200 custom lessons are supported, subject to classroom request-size limits.

## Tutor drafts and visibility

Tutors can hide or show a whole class, a unit, or an individual lesson. Hidden parent content also hides its descendants and related assignments/grades from the student view. New classes, manually created units, and new lessons start hidden; existing content keeps its prior visibility. The tutor sees hidden labels and can continue editing. Showing a parent preserves individual child draft settings.

Student responses omit hidden classes, units, lessons, assignments, and lesson notes. File download/upload/removal requests and forged submissions for hidden assignments are rejected by the classroom service. Hiding keeps saved answers, grades, notes, and uploaded files intact. A learner who already has content open should refresh to see visibility changes.

The Edit button now works for the original GED lessons as well as custom lessons. Edits replace the existing lesson ID rather than making a second copy, and preserve answers, grades, feedback, notes, and attachments. The original science table and supported source reference remain attached to the lesson when edited. If a lesson is already visible, editing it updates what Jude sees; hide it first to prepare changes privately.

Tutor accounts can choose **View as student** to preview published content and existing submissions/grades. Unenrolled electives and hidden classes, units, and lessons are excluded. The preview is read only: it blocks answer/notes saves, uploads, removals, and account changes, and omits private tutor notes and answer guides. Choose **Back to tutor** to resume editing. No additional login is needed.

## GitHub course website

The `website/` directory publishes to GitHub Pages through `.github/workflows/pages.yml`. Public visitors can browse published, visible course listings and specialty requirements. Tutor and student accounts use the existing classroom service at `jude-study-room-login.blueseed4096.chatgpt.site`; no passwords, sessions, grades, or enrollments are stored in GitHub.

In Tutor studio, edit the seeded course descriptions/outlines or add a listing linked to an app classroom. New listings and specialties start as drafts. Each specialty defines required course IDs; publishing requires all of them to be available. Student enrollment is immediate and stored under the existing student username. My path uses tutor-recorded official passes for the four permanent GED requirements. Other classes still use visible assignments meeting the course’s configurable coursework target (default 70%). This is a personal learning plan, not an accredited degree. The classroom app marks joined courses after Refresh, while keeping existing class access intact.

Future code changes publish from GitHub. Directory/outline/specialty edits save directly from the tutor’s website login without rebuilding the website or desktop app.

The gradual academic upgrade is tracked in [docs/academic-roadmap.md](docs/academic-roadmap.md). Stage 1 adds official GED records and required enrollment while preserving elective enrollment, classroom access, and all existing work. Later stages add elective lifecycle/slot rules, richer course authoring, and branching pathways.

## English lesson plan import

Five English courses were imported as hidden classroom drafts with draft website listings. Each course page uses `#course/<classroom ID>` and groups its units and lessons. Reading-only lessons support notes without creating assignments. The source plan contains 20 units, 45 lessons (35 reading/exploration lessons and 10 writing/presentation tasks). Titles, unit names, reading references, source page numbers, provided resource links, and the American Goth recommended prerequisite are retained. Full literary texts are not included. The one-time server import preserves current classroom IDs and all existing student work; a transaction marker prevents duplicates. Tutor edits are retained on future launches.

## Catalog visibility and elective enrollment

Publishing a listing makes a course browseable and opens signup; it does not enroll the student. The tutor's publish action releases that class's materials to enrolled students. The student's desktop, notes, assignment saves, file access, and tutor student-preview all require elective enrollment. Required GED classes remain enrolled. Existing enrollments and work are preserved. Existing published listings are normalized once to the new enrollment-based model; future manual classroom pauses remain respected.

A published specialty is visible even when some required courses are not open. Those course titles appear as Coming soon, without draft outlines or materials. Selecting a specialty does not enroll its courses; Join available required classes joins only published, ready courses. Public course pages show the unit/lesson outline; elective lesson bodies and assignment instructions unlock only after sign-in and enrollment. No new desktop installer is needed on 0.6.0.

## Arts courses and additional student accounts

Seven arts courses are imported once as hidden draft classrooms and draft listings: Art Appreciation (ART 1000), Art History I (ART 1001), Design 1 (DES 1000), Ceramics 1 (ART 2000), Sculpting 1 (ART 2001), Design 3: Color Theory (DES 3000), and Music Theory I (MUS 1000). They contain 29 units and 97 topic lessons, suggested course lengths, and the source's recommended progression. No homework or enrollments are automatically created.

The single tutor/admin can create additional student accounts in website Tutor studio → Add student, or desktop Account → Create / reset student login. Students must change temporary passwords. Resetting a username revokes only that student's sessions and preserves their work. The tutor selects a student to review in Tutor studio or desktop Account. Shared course content remains shared, but responses, grades, feedback, document links, attachment metadata/access, notes, enrollments, and GED records are scoped to the student username. The original single-student work is moved transactionally into its original owner's private record; new accounts start blank. A student-record owner check prevents saving a view under the wrong selected student. Global classroom revision checks continue to reject stale saves.

Old clients without a student selector continue to review the original student by default. The native 0.6.0 bridge supports the new selector and account creation through its existing actions, so this release uses classroom-content delivery rather than a new installer. There is still one personal tutor/admin; this does not add school or multi-tutor tenancy.
