# Jude Study Room

A personal Mac and Windows app for GED tutoring. It includes four subject classrooms, video lessons, short readings, written assignments, grades, and tutor feedback.

## Download and install

Get the current version from [Releases](https://github.com/RobloxCreator-sketch/jude-study-room/releases/latest).

- **Windows (64-bit):** Run the `win-x64.exe` setup installer. If you used the older ZIP installer, install this release once; future updates can download and install from within the app.
- **Mac (Apple Silicon):** Quit the old app, unzip the `mac-arm64.zip` download, and drag Jude Study Room into Applications. Replace the old copy when asked. This personal build is ad-hoc signed and is not notarized by Apple. Keep macOS protections enabled and follow its normal app-opening prompts.

Sign in with your existing classroom username. The app uses the same hosted classroom service, so reinstalling does not delete accounts, answers, or grades. Internet is needed for shared work and YouTube videos.

## Updating the app

Choose **Updates** in the app or **Help → Check for updates**. The app also checks at launch and every six hours. Windows downloads updates only when you choose to download, and restarts only after confirmation. On Mac, an update opens the exact GitHub download for this app and your processor; replace the app manually. Save open work before installing.

The legacy 0.2.0 build does not have an updater. Install 0.3.0 once to enable the update system.

## Publishing another version

1. Make and test the app changes.
2. Increase `version` in `package.json` (for example, `0.3.0` to `0.3.1`).
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
