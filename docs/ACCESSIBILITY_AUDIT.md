# Accessibility Audit (WCAG 2.2)

Last updated: 2025-03

## Summary

- **lang attribute**: `html lang="en"` in root layout
- **Skip links**: Dashboard has "Skip to main content"; Login has "Skip to login form"
- **Form labels**: LoginForm uses `htmlFor`/`id` correctly
- **Focus styles**: Buttons use `focus-visible:ring-2` for keyboard focus
- **Error announcements**: Login error uses `role="alert"` for screen reader announcement
- **Main landmark**: Dashboard pages use `<main id="main-content">`
- **Bottom nav**: Uses `aria-label` for nav items

## Recommendations

1. **Color contrast**: Verify all text meets 4.5:1 (normal) / 3:1 (large) - design system colors should be audited
2. **Heading hierarchy**: Ensure h1 → h2 → h3 order on each page
3. **Icon-only buttons**: Add `aria-label` where missing (many already have it)
4. **Live regions**: PointsToast uses `aria-live="polite"` - good pattern for dynamic content
