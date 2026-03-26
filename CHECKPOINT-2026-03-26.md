# Checkpoint - 2026-03-26

## Current Objective

Standardize UI code quality across the codebase based on strict `.mdc` rules:
- FSD boundaries and public API discipline
- Senior UI composition (orchestrator-first)
- No nested ternary / reduce inline conditional complexity
- Segment purity (`model/lib/api` must stay pure `.ts`; JSX only in `ui/*.tsx`)
- Production-safe Tailwind usage (avoid dynamic arbitrary class interpolation)

## Branch and Repository State

- Branch: `chore/refactor/improve-bad-code`
- Working tree status at checkpoint creation: clean
- Remote push status: all recent commits already pushed

## Critical Rules Already Applied

Primary rule source currently used:
- `.cursor/rules/senior-ui-architechture.mdc` (latest updated and committed)

Key strict points now enforced in actual refactors:
- **Suspense placement:** inside shell (not wrapping shell)
- **Tailwind JIT trap avoidance:** no dynamic `max-w-[${...}]` classes
- **Prefer derived constants over imperative rendering blocks**
- **Map callback extraction** for heavy UI in list rendering

## Important Refactor Decisions and Why

1. **Modal width strategy**
   - Dynamic width from config is now applied with inline `style.maxWidth` (runtime safe).
   - Static fallback remains Tailwind class (`max-w-[520px]`).
   - Reason: dynamic arbitrary Tailwind classes are unsafe in production JIT compilation.

2. **Modal loading UX**
   - `<Suspense>` moved inside `<Modal>` content area.
   - Reason: shell appears instantly; user sees modal frame while content chunk loads.

3. **Segment purity fixes**
   - JSX-producing helpers moved to real UI components in `ui/`.
   - Pure data/state/formatting logic remains in `.ts` model files.

## Commits in This Phase (Recent to Older)

- `8ce69ba` refactor(modal-manager): split compare card and normalize device item view model
- `9bbcf92` refactor(modal-manager): simplify kyc modal rendering states
- `cc3b514` refactor(modal-manager): clean wallet modal state and section rendering
- `397ce05` refactor(modal-manager): fix dynamic width and suspense shell loading
- `a2dd636` chore(rules): update senior ui architecture protocol
- `375c04d` refactor(kyc): precompute arc expiry input view values
- `42fcfce` refactor(modal-manager): simplify user devices state rendering
- `a63db71` chore(rules): consolidate senior ui architecture guidance
- `daab10e` refactor(modal-manager): pass modal width via tailwind class
- `14daa2b` refactor(modal): simplify width handling with tailwind classes
- `99fc96d` refactor(ui): enforce ts/tsx purity for modal and transaction table

## High-Value Files Touched (Latest Batches)

- `src/widgets/modal-manager/ui/ModalContainer.tsx`
- `src/shared/ui/modal/ui/Modal.tsx`
- `src/shared/ui/modal/ui/Modal.type.ts`
- `src/widgets/modal-manager/ui/UserViewDevices.tsx`
- `src/widgets/modal-manager/ui/UserViewWallets.tsx`
- `src/widgets/modal-manager/ui/KycEplStatus.tsx`
- `src/widgets/modal-manager/ui/KycVerificationCheck.tsx`
- `src/widgets/modal-manager/ui/KycDocumentImagesCompare.tsx`
- `src/widgets/modal-manager/ui/KycDocumentImagesCompareCard.tsx` (new)
- `src/widgets/modal-manager/ui/UserViewDeviceItem.tsx`
- `src/pages/kyc-submission-detail/ui/KycSubmissionDetailPageHeader.tsx`
- `src/pages/fee-config/model/use-fee-config-filters.ts`
- `src/shared/ui/SelectDropdownMenuContent.tsx`
- `src/pages/transactions/ui/TransactionsFiltersGrid.tsx`
- `README.md`

## Known Patterns to Continue (Do Not Regress)

- Keep parent files as orchestrators; split dense section rendering into focused subcomponents.
- Avoid helper functions returning JSX in non-UI segments.
- Avoid dynamic Tailwind arbitrary class strings built from template interpolation.
- Use guard clauses for loading/error/empty states where applicable.
- Keep file length under lint threshold (`max-lines` is enforced in pre-commit).

## Immediate Next Refactor Targets (Recommended)

1. `src/pages/transactions/model/use-transactions-filters.ts`
   - Centralize repeated filter title derivation helper to reduce copy-paste in badge mapping.
2. `src/pages/user-detail/ui/IdentityAccessBadges.tsx`
   - Split dense map callback and remove imperative node assembly in item rendering.
3. `src/shared/ui/date-range-picker-dropdown-content.tsx`
   - Replace `let + if` node derivation with declarative section rendering.
4. `src/pages/countries/ui/CountriesModalForm.tsx`
   - Normalize status-button class derivation with helper/lookup to avoid inline class branching.
5. `src/widgets/modal-manager/ui/CountriesModalForm.tsx`
   - Keep parity with pages version after class derivation cleanup.

## Checklist for Next Session Start

1. Read `.cursor/rules/senior-ui-architechture.mdc` first.
2. Run quick scan in target scope:
   - nested ternary search
   - heavy `.map()` callback rendering
   - max-lines risk
3. Refactor in small batches.
4. Run lints on edited files.
5. Commit + push per batch.
6. Update README when there is meaningful composition change.

## Notes for Continuity

- Current repository is clean and synchronized after the latest pushed commit.
- If a commit fails due to pre-commit (`max-lines`), split component/file rather than bypassing hooks.
- Keep modal-manager work incremental to avoid wide regressions.

## TODO (Next Session, Not Done Yet)

- [ ] Refactor `src/pages/transactions/model/use-transactions-filters.ts`
  - Extract shared helper for filter title resolution used across options/date-range badge paths.
  - Remove repeated fallback pattern for label derivation.

- [ ] Refactor `src/pages/user-detail/ui/IdentityAccessBadges.tsx`
  - Extract badge item rendering into focused subcomponent/helper to reduce map callback density.
  - Remove imperative `let + if` UI-node assembly in mapped item.

- [ ] Refactor `src/shared/ui/date-range-picker-dropdown-content.tsx`
  - Replace imperative node assembly (`let + if`) with declarative rendering blocks.
  - Keep keyboard/focus behavior identical.

- [ ] Refactor `src/pages/countries/ui/CountriesModalForm.tsx`
  - Centralize active/inactive button class derivation (helper or map).
  - Avoid inline template branching in className while preserving visual states.

- [ ] Refactor `src/widgets/modal-manager/ui/CountriesModalForm.tsx`
  - Apply the same class derivation normalization as page-level modal form.
  - Ensure behavior parity between page and modal-manager variants.

- [ ] Re-run repo-wide cleanup scan (non-modal scope)
  - Search nested ternary and imperative render-derivation leftovers in `pages/` and `shared/ui/`.
  - Keep commits split by file/group and commit-safe under lint hooks.

- [ ] Documentation sync for non-modal refactor
  - Update `README.md` if component composition changes significantly in shared/page-level filter components.
