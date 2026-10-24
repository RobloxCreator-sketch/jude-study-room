# JSR personal tutoring system: gradual academic upgrade

## Review of the existing system

Working: GitHub Pages course website, shared username/password accounts, server-side tutor/student permissions, editable descriptions and outlines, immediate enrollment, simple specialty requirements, shared assignment grades, desktop lessons/units, hidden drafts, file submissions, and read-only student preview.

Gaps: enrollment was optional even for GED; GED completion was inferred from coursework; electives had no slot limits or pause/withdraw/wishlist; course categories were free text; pathways supported only a flat list of required courses; website course listings referenced classrooms created in the app; lessons required associated assignments; metadata did not include departments, codes, duration, difficulty, prerequisites, or portfolio rules; desktop visibility did not yet follow elective enrollment status.

## Stage 1 — official GED foundation (this update)

- Every student is enrolled in Mathematics, Language Arts, Science, and Social Studies. IDs 0–3 remain stable.
- Normalize older enrollment records by adding required subjects while preserving electives, specialty selection, and all classroom work.
- Required subjects cannot be paused, withdrawn, or removed through student requests.
- Store official subject pass records independently of assignment grades and enrollment. Only the tutor can record or correct them, with an optional test date and a server-side change history.
- My path separates remaining and completed official GED requirements. Coursework grades show practice progress only.
- Completing an official subject keeps enrollment and material access. Existing tutor draft visibility remains in force.
- GED requirements in existing simple specialty paths use the official result.
- Additive desktop metadata displays required/official-pass badges; older clients remain supported.
- No real subject is marked passed automatically. The tutor records actual results.

## Stage 2 — electives and desktop enrollment lifecycle

- One active elective slot initially; two after at least one tutor-recorded official GED pass.
- Unlimited wishlist. Pause, withdrawal, and resuming preserve all responses, grades, notes, files, and completed work.
- Enforce slot limits on the server, including specialty/bulk enrollment, with concurrency checks.
- Decide migration behavior for existing multiple electives without silently withdrawing anyone.
- Active desktop dashboard reflects enrollment. Paused/withdrawn work moves to an accessible archive; enrollment is separate from content visibility.
- Keep the same rule in student views, file access, legacy-client saves, and the tutor preview. A stale desktop save must never erase inactive course work.
- Developmental support remains optional and never becomes an additional GED requirement. Classify its slot policy explicitly before enforcing it.

## Stage 3 — course organization and richer authoring

- Manage departments, course codes, and five categories: Required GED, Developmental, Academic extensions, Creative/practical electives, Advanced.
- Academic extensions include Mathematics, English, Science, and History.
- Add estimated length, difficulty, recommended prerequisites, availability, and visibility.
- Support units and lessons without mandatory assignments; optional practice, final projects, and portfolios.
- Typical planning ranges: smaller electives 1–2 months; major academic extensions 3–4 months or longer. Tutor-editable estimates, not fixed pacing rules.
- Website authoring creates and manages the underlying classroom; stable IDs keep existing material and submissions attached.

## Stage 4 — richer academic pathways

- Required courses plus choose-N elective groups, alternatives, and branching paths; never require an entire department by accident.
- Recommended prerequisites remain distinct from any future enrollment restrictions.
- Show complete, in-progress, remaining, elective options, and overall requirement progress.
- Changing a specialty preserves enrollments and completed coursework. Pathway matching changes independently from a course's completion record.
- Tutor can choose which courses count, including documented overrides, without altering the student's actual grades or official GED records.

## Verification and release rules

Implement one stage at a time; test student/tutor boundaries, concurrent saves, old desktop clients, hidden drafts, and data preservation. Publish website changes through GitHub Pages and compatible desktop UI changes through the existing classroom-content channel. Keep accounts, records, credentials, and submissions on the classroom service; never commit live data to the public repository.

JSR remains a personal tutoring system. Multi-school accounts, tenancy, accredited degrees, and institutional administration are outside this plan.
