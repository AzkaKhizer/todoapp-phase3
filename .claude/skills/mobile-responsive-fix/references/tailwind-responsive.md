# Tailwind Responsive Patterns

## Breakpoint Prefixes

| Prefix | Min-width | Typical devices        |
|--------|-----------|------------------------|
| (none) | 0px       | Mobile-first default   |
| `sm:`  | 640px     | Large phones landscape |
| `md:`  | 768px     | Tablets                |
| `lg:`  | 1024px    | Laptops                |
| `xl:`  | 1280px    | Desktops               |
| `2xl:` | 1536px    | Large screens          |

## Common Responsive Patterns

### Text sizing
```
text-xs sm:text-sm md:text-base lg:text-lg
```

### Container padding
```
px-3 sm:px-4 md:px-6 lg:px-8
py-2 sm:py-3 md:py-4
```

### Grid columns
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

### Flex direction
```
flex flex-col sm:flex-row
```

### Spacing/gap
```
gap-2 sm:gap-3 md:gap-4 lg:gap-6
space-y-2 sm:space-y-0 sm:space-x-4
```

### Show/hide elements
```
hidden sm:block       /* Hidden on mobile, visible on sm+ */
block sm:hidden       /* Visible on mobile, hidden on sm+ */
```

### Width constraints
```
w-full sm:w-auto
w-full max-w-sm mx-auto sm:max-w-none
```

### Button sizing for mobile
```
w-full sm:w-auto px-4 py-3 sm:py-2 text-base sm:text-sm min-h-[44px] sm:min-h-0
```

### Image responsiveness
```
w-full h-auto max-w-full object-cover
```

### Modal/dialog mobile
```
fixed inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
w-full h-full sm:w-auto sm:h-auto sm:max-w-lg sm:rounded-lg
```

### Table overflow
```html
<div class="overflow-x-auto -mx-4 sm:mx-0">
  <table class="min-w-full">...</table>
</div>
```

### Form inputs
```
w-full px-3 py-2 text-base sm:text-sm
```
