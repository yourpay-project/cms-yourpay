# Commit split plan (from single "initial commit")

Use this to replace the single large commit with logical, trackable commits.  
**Conventional Commits**, no trailers. Run from repo root.

---

## Prerequisites

- Current state: one commit ahead of `origin/main` (e.g. `feat: initial commit`).
- Goal: redo as multiple small commits so history is clear.

---

## Option A: Soft reset and re-commit in order

```bash
# 1. Keep all changes, undo the last commit (working tree unchanged)
git reset --soft HEAD~1

# 2. Unstage everything so we can stage by group
git reset HEAD
```

Then create commits in this order (stage only the listed paths per commit).

---

### Commit 1 – Theme and Tailwind

**Message:** `style: theme tokens and Tailwind success/warning for badges`

**Paths:**

- `src/index.css`
- `tailwind.config.js`

```bash
git add src/index.css tailwind.config.js
git commit -m "style: theme tokens and Tailwind success/warning for badges"
```

---

### Commit 2 – shadcn config and button in shared

**Message:** `chore: shadcn components in shared/ui, remove legacy components/ui button`

**Paths:**

- `components.json`
- `src/shared/ui/button.tsx` (if modified)
- `src/shared/ui/index.ts` (only if this commit touches button export)
- Delete: `src/components/ui/button.tsx` (if still present)

If `components.json` and shared button were part of a larger shadcn init, stage only the files that belong to “move button to shared / shadcn config”.  
If `src/components/ui/button.tsx` was already deleted and the only change is config, stage just:

- `components.json`

and commit:

```bash
git add components.json
# if button moved to shared and components/ui deleted:
# git add src/shared/ui/button.tsx src/shared/ui/index.ts
# git add -u src/components/ui/button.tsx
git commit -m "chore: shadcn components in shared/ui, remove legacy components/ui button"
```

---

### Commit 3 – Shared calendar

**Message:** `feat(shared): calendar in shared/ui with month/year dropdown`

**Paths:**

- `src/shared/ui/calendar.tsx`
- `src/shared/ui/index.ts` (calendar export)

```bash
git add src/shared/ui/calendar.tsx src/shared/ui/index.ts
git commit -m "feat(shared): calendar in shared/ui with month/year dropdown"
```

---

### Commit 4 – Filter badge colors and FilterSelectWithClear

**Message:** `feat(shared): filter badge colors and FilterSelectWithClear in shared/ui`

**Paths:**

- `src/shared/lib/filter-badge-colors.ts`
- `src/shared/lib/index.ts`
- `src/shared/ui/filter-select-with-clear.tsx` (moved from KYC)
- `src/shared/ui/index.ts` (exports for filter-select and badge usage)

Remove from KYC if still there: `src/pages/kyc-submission/ui/FilterSelectWithClear.tsx` (or treat as “moved” in this commit).

```bash
git add src/shared/lib/filter-badge-colors.ts src/shared/lib/index.ts
git add src/shared/ui/filter-select-with-clear.tsx src/shared/ui/index.ts
# If KYC still has local FilterSelectWithClear and you're deleting it:
# git add -u src/pages/kyc-submission/ui/FilterSelectWithClear.tsx
git commit -m "feat(shared): filter badge colors and FilterSelectWithClear in shared/ui"
```

---

### Commit 5 – DataTable viewport and scroll behavior

**Message:** `feat(shared): data-table fixed viewport height and content-sized empty state`

**Paths:**

- `src/shared/ui/data-table/lib/data-table-constants.ts` (TABLE_BODY_VIEWPORT_HEIGHT)
- `src/shared/ui/data-table/lib/use-data-table.ts`
- `src/shared/ui/data-table/ui/data-table-scroll-area.tsx`
- `src/shared/ui/data-table/ui/data-table.tsx`
- `src/shared/ui/data-table/index.ts`
- `src/shared/ui/index.ts` (TABLE_BODY_VIEWPORT_HEIGHT export)

```bash
git add src/shared/ui/data-table/lib/data-table-constants.ts
git add src/shared/ui/data-table/lib/use-data-table.ts
git add src/shared/ui/data-table/ui/data-table-scroll-area.tsx
git add src/shared/ui/data-table/ui/data-table.tsx
git add src/shared/ui/data-table/index.ts src/shared/ui/index.ts
git commit -m "feat(shared): data-table fixed viewport height and content-sized empty state"
```

---

### Commit 6 – User Yourpay page filters and layout

**Message:** `feat(pages): User Yourpay filters card, country buttons, search`

**Paths:**

- `src/pages/user-list/index.ts`
- `src/pages/user-list/model/constants.ts`
- `src/pages/user-list/model/index.ts`
- `src/pages/user-list/model/use-user-list-filters.ts`
- `src/pages/user-list/ui/UserListFiltersCard.tsx`
- `src/pages/user-list/ui/UserListFiltersGrid.tsx`
- `src/pages/user-list/ui/UserListPage.tsx`
- `src/pages/user-list/ui/UserListSearchBar.tsx`

```bash
git add src/pages/user-list/
git commit -m "feat(pages): User Yourpay filters card, country buttons, search"
```

---

### Commit 7 – KYC submission filters and date picker

**Message:** `feat(pages): KYC submission filters card, date range picker, FilterSelectWithClear`

**Paths:**

- `src/pages/kyc-submission/model/use-kyc-submission-filters.ts`
- `src/pages/kyc-submission/ui/DateRangePickerDropdownContent.tsx`
- `src/pages/kyc-submission/ui/DateRangePickerWithPresets.tsx`
- `src/pages/kyc-submission/ui/KycSubmissionFiltersCard.tsx`
- `src/pages/kyc-submission/ui/KycSubmissionFiltersGrid.tsx`
- `src/pages/kyc-submission/ui/KycSubmissionPage.tsx`

(And any removal of `FilterSelectWithClear` from KYC if not done in commit 4.)

```bash
git add src/pages/kyc-submission/
git commit -m "feat(pages): KYC submission filters card, date range picker, FilterSelectWithClear"
```

---

### Commit 8 – Widgets use TABLE_BODY_VIEWPORT_HEIGHT

**Message:** `feat(widgets): UserTable and KycSubmissionTable use TABLE_BODY_VIEWPORT_HEIGHT`

**Paths:**

- `src/widgets/user-table/ui/UserTable.tsx`
- `src/widgets/kyc-submission-table/ui/KycSubmissionTable.tsx`

```bash
git add src/widgets/user-table/ui/UserTable.tsx src/widgets/kyc-submission-table/ui/KycSubmissionTable.tsx
git commit -m "feat(widgets): UserTable and KycSubmissionTable use TABLE_BODY_VIEWPORT_HEIGHT"
```

---

### Commit 9 – Docs and TSDocs

**Message:** `docs: README data-table viewport and filters, TSDocs for changed modules`

**Paths:**

- `README.md` – section 5.5 (viewport height, TABLE_BODY_VIEWPORT_HEIGHT, filter badges, calendar, example with `scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}`).
- TSDoc updates: `shared/ui/data-table/lib/data-table-constants.ts`, `shared/ui/data-table/lib/use-data-table.ts`, `shared/ui/data-table/ui/data-table-scroll-area.tsx`, `shared/lib/filter-badge-colors.ts`, `shared/ui/filter-select-with-clear.tsx`, `shared/ui/calendar.tsx`, `pages/user-list/model/use-user-list-filters.ts`, `pages/user-list/ui/UserListPage.tsx`, `pages/user-list/ui/UserListFiltersCard.tsx`, `pages/kyc-submission/ui/KycSubmissionPage.tsx`, `pages/kyc-submission/ui/KycSubmissionFiltersCard.tsx`.
- Optional: `.cursorrules` (omit or separate commit if you prefer).

```bash
git add README.md
git add src/shared/ui/data-table/lib/data-table-constants.ts src/shared/ui/data-table/lib/use-data-table.ts
git add src/shared/ui/data-table/ui/data-table-scroll-area.tsx
git add src/shared/lib/filter-badge-colors.ts src/shared/ui/filter-select-with-clear.tsx src/shared/ui/calendar.tsx
git add src/pages/user-list/model/use-user-list-filters.ts src/pages/user-list/ui/UserListPage.tsx src/pages/user-list/ui/UserListFiltersCard.tsx
git add src/pages/kyc-submission/ui/KycSubmissionPage.tsx src/pages/kyc-submission/ui/KycSubmissionFiltersCard.tsx
git commit -m "docs: README data-table viewport and filters, TSDocs for changed modules"
```

---

## Option B: Interactive rebase (advanced)

If the single commit is already pushed and you prefer to split it in place:

```bash
git rebase -i HEAD~1
# Mark the commit as "edit"
# Then: git reset --soft HEAD~1  and follow the staging/commit steps above.
# Finally: git rebase --continue (and fix any conflicts if needed).
```

---

## Summary

| # | Commit message |
|---|----------------|
| 1 | style: theme tokens and Tailwind success/warning for badges |
| 2 | chore: shadcn components in shared/ui, remove legacy components/ui button |
| 3 | feat(shared): calendar in shared/ui with month/year dropdown |
| 4 | feat(shared): filter badge colors and FilterSelectWithClear in shared/ui |
| 5 | feat(shared): data-table fixed viewport height and content-sized empty state |
| 6 | feat(pages): User Yourpay filters card, country buttons, search |
| 7 | feat(pages): KYC submission filters card, date range picker, FilterSelectWithClear |
| 8 | feat(widgets): UserTable and KycSubmissionTable use TABLE_BODY_VIEWPORT_HEIGHT |
| 9 | docs: README data-table viewport and filters, TSDocs for changed modules |

After splitting, verify: `git log --oneline` and run tests/lint.
