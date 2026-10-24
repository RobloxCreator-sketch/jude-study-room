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

New lessons are still part of the bundled app in this version. Moving lessons into the online classroom and adding a tutor lesson editor is a separate feature, after which normal lesson edits would not need an app release. Assignments, submissions, and grades already sync online; click Refresh to load the other person's changes.

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
