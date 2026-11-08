# Dependency verification — Phase 1

Checked against npm on November 5, 2026. Runtime packages and direct development
tools use exact versions. `package-lock.json` records the resolved graph.

Runtime: Next.js 16.4.5, React/React DOM 19.3.1, Auth0 Next.js SDK 4.33.0,
Supabase JS 2.119.0. Development: Tailwind/PostCSS integration 4.3.4,
ESLint 10.14.0, Next ESLint config 16.4.5, Node types 26.6.6,
React/React DOM types 19.3.0, TypeScript native compiler 7.0.2.

## Compatibility details

- TypeScript 7 does not expose the compiler API required by typescript-eslint
  and Next's programmatic type checks. Following Microsoft's documented
  side-by-side setup, `@typescript/native` aliases TypeScript 7.0.2, while
  `typescript` aliases the latest `@typescript/typescript6` compatibility package
  6.0.2. `npm run typecheck` runs the native TypeScript 7 compiler; Next and
  ESLint use the compatible API. No type or lint checks are disabled.
- A pinned minimatch 11.0.5 override fixes the development-tool advisory
  GHSA-g3hv-75wg-m249. Validate lint and a clean install when changing it.
- Some plugins pulled in by the latest Next ESLint config still declare ESLint
  peers only through version 9. npm emits peer warnings with ESLint 10.14.0.
  The complete project lint and a fresh npm ci passed, but this is not an
  upstream declaration of ESLint 10 support.

## Verification

- `npm ci` succeeded in an isolated directory using only the manifests.
- `npm run lint`, `npm run typecheck`, and `npm run build -- --webpack` passed.
- npm audit reported zero findings across runtime and development packages
  after the minimatch override. This does not establish absence of vulnerabilities;
  check maintainer advisories as well.
- Webpack reports Auth0 SDK dynamic-import warnings for optional DPoP utilities.
  The build succeeds. The [dated hosted report](https://agentguard-eight.vercel.app/evidence)
  records the separately verified passkey sign-in and review.

The version and advisory observations above are dated November 5.

Reference: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0
