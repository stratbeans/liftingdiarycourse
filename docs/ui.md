# UI Coding Standards

## Component Library

**All UI components must use [shadcn/ui](https://ui.shadcn.com/) exclusively.**

- Do not create custom components. If a UI element is needed, find the appropriate shadcn/ui component.
- Do not wrap shadcn/ui components in custom wrapper components.
- Install components via the CLI: `npx shadcn@latest add <component>`
- Components are added to `src/components/ui/` — import directly from there.

## Date Formatting

Use **[date-fns](https://date-fns.org/)** for all date formatting. No other date library should be used.

Dates must be displayed in the following format:

```
1st Sept 2025
2nd Aug 2025
3rd Jan 2026
```

Use `format` with a custom ordinal suffix. Example implementation:

```ts
import { format } from "date-fns";

function formatDate(date: Date): string {
  const day = parseInt(format(date, "d"));
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : day % 10 === 1
      ? "st"
      : day % 10 === 2
      ? "nd"
      : day % 10 === 3
      ? "rd"
      : "th";
  return `${day}${suffix} ${format(date, "MMM yyyy")}`;
}
```

Never use `Date.toLocaleDateString()`, `Intl.DateTimeFormat`, or any other formatting approach.
