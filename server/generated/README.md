# Generated Draft Screens (UNVERIFIED)

These `.tsx` files were produced by AI batch generation. They are **standalone
demo drafts**, NOT wired into the live application and NOT part of the
TypeScript build (they are listed in `tsconfig.json` `exclude`).

## Honest status

- They were generated in isolation and import from paths that do not exist in
  this project (e.g. `../utils/trpc`, `./ui/button`). As written, the majority
  do **not** type-check against this codebase.
- Many contain mock/placeholder data inside the component, which does not meet
  this project's "real data only" standard.
- To turn any single draft into a real feature you must: fix imports to the
  project's actual modules (`@/lib/trpc`, `@/components/ui/*`), replace mock
  data with real tRPC queries, and register a route in `client/src/App.tsx`.

Treat this folder as a **brainstorming/reference library**, not shippable code.
