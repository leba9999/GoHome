# GoHome – Copilot Instructions

## What Is This App
GoHome is a **mobile-first PWA** (Progressive Web App) work-time tracker. A single user enters her arrival time; the app calculates and displays the earliest leave time. Work day = 8 h + 30 min lunch, but lunch is only added when the scheduled day is **≥ 4 hours** (i.e. `leaveTime = arrival + 8h30min` normally, `arrival + 8h` for short days). The target platform is an Android phone installed via Chrome "Add to Home Screen". Uses `next-pwa` for offline/service-worker support.

## Stack
Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (`radix-nova` style).

## Developer Commands
```bash
npm run dev          # starts dev server with Turbopack (SW disabled in dev)
npm run build        # production build with --webpack (required by next-pwa)
npm run typecheck    # tsc --noEmit (no test suite exists)
npm run lint         # ESLint
npm run format       # Prettier (ts/tsx files)
```

## Project Structure
- `app/` – Next.js App Router pages/layouts. `layout.tsx` wraps everything in `<ThemeProvider>`.
- `components/ui/` – All UI primitives. **Do not create UI components outside this folder.**
- `components/theme-provider.tsx` – Wraps `next-themes`; adds `d` hotkey to toggle dark/light.
- `lib/utils.ts` – Only exports `cn()` (`clsx` + `tailwind-merge`).
- `hooks/use-mobile.ts` – Breakpoint hook used by `sidebar.tsx`.

## Adding UI Components
Use the shadcn CLI – do **not** hand-write components from scratch:
```bash
npx shadcn@latest add <component-name>
```
Components land in `components/ui/` automatically.

## Component Conventions
- Every component uses function declarations (not `const` arrow functions) and is a named export.
- All root elements carry a `data-slot="<component-name>"` attribute for CSS targeting (e.g. `data-slot="button"`, `data-slot="card"`).
- Variants are built with `cva` from `class-variance-authority`; always spread `VariantProps<typeof xVariants>` in the prop type.
- Use `Slot` from `radix-ui` (not `@radix-ui/react-slot`) for `asChild` patterns.
- Icons come exclusively from `@tabler/icons-react` (e.g. `IconChevronDown`, `IconX`).

## Styling Rules
- Tailwind CSS v4: no `tailwind.config.ts`. Theme tokens are CSS custom properties defined in `app/globals.css` using `oklch()` colour values.
- Dark mode is toggled via a `.dark` class (attribute `class`) – use `dark:` variants accordingly.
- Border-radius scale: `--radius-sm/md/lg/xl/2xl/3xl/4xl` derived from `--radius: 0.625rem`.
- Avoid hardcoded colours; always use semantic tokens (`bg-primary`, `text-muted-foreground`, `border-input`, etc.).
- `cn()` is the only helper for conditional class merging.

## Composite/Layout Components
- `Field` / `FieldGroup` / `FieldSet` (`components/ui/field.tsx`) – use for labelled form inputs; supports `orientation="horizontal|vertical"` and `aria-invalid`.
- `InputGroup` (`components/ui/input-group.tsx`) – wraps `Input`/`Textarea` with inline or block addons/buttons; use `data-align="inline-start|inline-end|block-start|block-end"` on addons.
- `ButtonGroup` (`components/ui/button-group.tsx`) – joins buttons/selects by collapsing borders; supports `orientation="horizontal|vertical"`.
- `Item` / `ItemGroup` (`components/ui/item.tsx`) – generic list-row primitive with variant/size props; use instead of custom `<li>` rows.
- `Empty` / `EmptyHeader` (`components/ui/empty.tsx`) – empty-state placeholder with dashed border.
- `Sidebar` (`components/ui/sidebar.tsx`) – full sidebar system with `SidebarProvider` context; state persisted via cookie `sidebar_state`; keyboard shortcut `b`; collapses to icon strip (`3rem`) or sheet on mobile.

## Path Aliases
`@/` maps to the workspace root. Use `@/components/ui/<name>`, `@/lib/utils`, `@/hooks/<name>` for all imports.
