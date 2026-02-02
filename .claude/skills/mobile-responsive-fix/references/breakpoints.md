# Common Mobile Breakpoints

## Device Reference

| Device            | Width  | Use as       |
|-------------------|--------|--------------|
| iPhone SE         | 375px  | Min baseline |
| iPhone 14         | 390px  | Common phone |
| iPhone 14 Pro Max | 430px  | Large phone  |
| iPad Mini         | 744px  | Small tablet |
| iPad Air          | 820px  | Tablet       |

## CSS Media Query Templates

### Mobile-first (preferred)
```css
/* Base styles = mobile */
.element { padding: 0.5rem; font-size: 0.875rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .element { padding: 1rem; font-size: 1rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element { padding: 1.5rem; }
}
```

### Quick fix for existing desktop-first code
```css
@media (max-width: 767px) {
  /* Mobile overrides here */
  .sidebar { display: none; }
  .main-content { width: 100%; }
  .nav-items { flex-direction: column; }
}

@media (max-width: 639px) {
  /* Small phone overrides */
  .heading { font-size: 1.25rem; }
  .card-grid { grid-template-columns: 1fr; }
}
```

## Testing Widths

Verify at these widths to cover most devices:
- **320px** - Smallest supported (older phones)
- **375px** - iPhone SE / baseline
- **428px** - Large phones
- **768px** - Tablets
- **1024px** - Desktop threshold
