---
name: mobile-responsive-fix
description: >
  Fix mobile responsiveness issues in existing web apps where the desktop UI works correctly
  but the mobile layout has problems. Use when:
  (1) UI has overflow, spacing, alignment, or font scaling issues on small screens
  (2) User asks to "fix responsiveness", "adjust mobile layout", "improve UI on small screens"
  (3) Buttons are too small, misaligned, or text overflows on mobile
  (4) Flex/grid layouts break at smaller breakpoints
  (5) Desktop UI is already correct and should not be changed
  Applies CSS-first, minimal, incremental fixes without major refactors.
  Supports HTML, CSS, Tailwind CSS, Next.js, and React projects.
---

# Mobile Responsive Fix

## Workflow

### 1. Audit

1. Identify all page/component files rendering UI (glob for `*.tsx`, `*.jsx`, `*.css`, `*.html`)
2. Search for hardcoded widths (`w-[`, `width:`, `min-width:`, `max-width:`) that may cause overflow
3. Search for missing responsive prefixes in Tailwind (`sm:`, `md:`, `lg:`)
4. Check viewport meta tag exists: `<meta name="viewport" content="width=device-width, initial-scale=1">`

### 2. Diagnose with Checklist

Run through each issue category:

- [ ] **Horizontal overflow**: elements wider than viewport (`overflow-x`, fixed widths, wide tables/images)
- [ ] **Font scaling**: text too small (<14px) or too large on mobile; missing responsive text sizes
- [ ] **Padding/margin**: excessive spacing consuming screen real estate; content pushed offscreen
- [ ] **Flex/grid breaking**: items not wrapping (`flex-nowrap`, missing `flex-wrap`), columns not stacking
- [ ] **Touch targets**: buttons/links smaller than 44x44px; insufficient spacing between tappable elements
- [ ] **Images/media**: missing `max-w-full` or `w-full`; images overflowing containers
- [ ] **Modals/popups**: not constrained to viewport; scrolling broken inside modals
- [ ] **Navigation**: menu not collapsible; nav items overflowing horizontally

### 3. Fix (CSS-first, minimal changes)

Apply fixes in priority order. Prefer Tailwind utilities when Tailwind is present. Fall back to CSS media queries otherwise.

#### Overflow fixes
```
/* Tailwind */  overflow-x-hidden, max-w-full, w-full
/* CSS */       overflow-x: hidden; max-width: 100%; width: 100%;
```

#### Font scaling
```
/* Tailwind */  text-sm md:text-base lg:text-lg
/* CSS */       @media (max-width: 640px) { font-size: 0.875rem; }
```

#### Padding/margin reduction
```
/* Tailwind */  p-2 sm:p-4 md:p-6, gap-2 sm:gap-4
/* CSS */       @media (max-width: 640px) { padding: 0.5rem; }
```

#### Flex/grid stacking
```
/* Tailwind */  flex flex-col sm:flex-row, grid grid-cols-1 sm:grid-cols-2
/* CSS */       @media (max-width: 640px) { flex-direction: column; }
```

#### Touch target sizing
```
/* Tailwind */  min-h-[44px] min-w-[44px] p-3
/* CSS */       min-height: 44px; min-width: 44px; padding: 12px;
```

#### Image containment
```
/* Tailwind */  max-w-full h-auto
/* CSS */       max-width: 100%; height: auto;
```

### 4. Verify

- Confirm no horizontal scrollbar at 320px, 375px, 428px widths
- Confirm text is readable without zooming
- Confirm all buttons/links are tappable
- Confirm desktop layout is unchanged

## Rules

- Never change component structure or logic unless a CSS-only fix is impossible
- Never remove or alter desktop styles; only add/adjust mobile-specific styles
- Prefer adding responsive prefixes (`sm:`, `md:`) over media queries when Tailwind is present
- Keep diffs minimal; one issue per edit when possible
- Test at 375px width (iPhone SE) as the baseline mobile size

## References

- **Tailwind responsive patterns**: See [references/tailwind-responsive.md](references/tailwind-responsive.md) for utility class patterns and breakpoint reference
- **Common mobile breakpoints**: See [references/breakpoints.md](references/breakpoints.md) for device widths and media query templates
