# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## Project Overview

A professional-grade NetSuite SuiteScript development project combining **TypeScript**,
**SuiteCloud Development Framework (SDF)**, ESLint, and Prettier. TypeScript source files
are transpiled to AMD JavaScript that runs inside NetSuite.

**Requirements:** Node.js 22+, Yarn 1.22.x, Java JDK 21 (for SuiteCloud CLI),
`@oracle/suitecloud-cli` installed globally.

---

## Technology Stack

- **Language**: TypeScript (compiled to AMD JS for NetSuite)
- **Package Manager**: Yarn 1.22.x
- **NetSuite API**: SuiteScript 2.1
- **Type Definitions**: `@hitc/netsuite-types`
- **Deployment**: SDF CLI (`suitecloud deploy`)
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest via `@oracle/suitecloud-unit-testing`

---

## Commands

```bash
yarn install          # Install dependencies
yarn build            # Transpile TypeScript → JavaScript (tsc)
yarn watch            # Watch mode for continuous transpilation
yarn lint             # Run ESLint
yarn lint:fix         # Run ESLint with auto-fix
yarn format           # Prettier format (src/**/*.{ts,js,json,xml})
yarn test             # Run Jest tests (via SuiteCloud unit testing framework)
yarn deploy           # Build then deploy to NetSuite (yarn build && suitecloud project:deploy)
yarn setup            # Authenticate with NetSuite account (suitecloud account:setup)
```

Run a single test file:

```bash
yarn test -- path/to/test.ts
```

---

## Architecture

### Directory Structure

```text
src/
  TypeScripts/engineering_template/              # TypeScript source (edit these)
  FileCabinet/SuiteScripts/engineering_template/ # Transpiled JS output (do not edit)
  Objects/                                       # SDF XML object definitions
  AccountConfiguration/                           # SDF account config
  FileCabinet/Templates/                         # Email/marketing templates
  Translations/                                  # Localization files
deploy.xml                                       # SDF deployment manifest
manifest.xml                                     # SDF project manifest
suitecloud.config.js                              # SDF CLI configuration
```

### TypeScript → NetSuite Pipeline

1. Write SuiteScript in `src/TypeScripts/engineering_template/`
2. `tsc` compiles to AMD modules in `src/FileCabinet/SuiteScripts/engineering_template/`
3. `yarn deploy` pushes the FileCabinet and Objects to NetSuite

**Key tsconfig settings:** AMD modules (required by NetSuite), ES2020 target, strict
mode enabled, `noEmitOnError`. NetSuite type definitions come from `@hitc/netsuite-types`
(mapped as `N` and `N/*`).

### Import Style

Write clean ES imports — `tsc` handles the AMD conversion automatically:

```typescript
import * as log from 'N/log';
import * as record from 'N/record';
import { EntryPoints } from 'N/types';
```

---

## SuiteScript Conventions

### JSDoc Headers

Every SuiteScript file must include JSDoc annotations at the top:

```typescript
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
```

### Script Type Entry Points

Use the correct entry point functions for each script type:

| Script Type   | Entry Points                                 |
| ------------- | -------------------------------------------- |
| User Event    | `beforeLoad`, `beforeSubmit`, `afterSubmit`  |
| Scheduled     | `execute`                                    |
| Map/Reduce    | `getInputData`, `map`, `reduce`, `summarize` |
| Suitelet      | `onRequest`                                  |
| Client Script | `pageInit`, `fieldChanged`, `saveRecord`     |
| RESTlet       | `get`, `post`, `put`, `delete_`              |

### SuiteQL

- Prefer `query.runSuiteQL()` over `search.create()` for complex reporting queries
- Always alias columns explicitly for clarity
- Always handle pagination for large result sets

---

## Deployment

This project targets multiple NetSuite accounts. Always confirm the target account
before deploying.

**Never deploy directly to production without first validating in sandbox.**

```bash
# Validate before any deployment
suitecloud project:validate

# Deploy (uses default auth ID in project.json)
yarn deploy

# Switch accounts via
yarn setup
```

Authentication credentials are managed via `suitecloud account:setup` and stored
outside the repo. `project.json` stores the default auth ID for SuiteCloud CLI
operations.

---

## Guardrails

- Never modify `deploy.xml` or `manifest.xml` unless explicitly asked
- Do not add new dependencies to `package.json` without asking first
- No hardcoded credentials — use Script Parameters or environment-specific
  configuration for all account IDs, URLs, and keys
- When creating a new SuiteScript file, always include the JSDoc header,
  the correct entry points for the script type, and register it in the
  SDF Objects folder if a corresponding script record XML is needed
- Include rollback procedures in deployment docs *(aspirational)*

---

## Code Conventions

- Use TypeScript for all SuiteScript files — never edit transpiled output in `FileCabinet/`
- Write ES module imports — `tsc` compiles to AMD automatically for NetSuite
- Use Script Parameters (not hardcoded values) for configuration
- Validate field IDs against NetSuite schema before use
- Include explicit environment handling where Sandbox vs. Production behavior differs
- Prefer explicit return types on all public functions
- Use `const` by default; only use `let` when reassignment is necessary

### Linting Rules

- **No `console`** — use `N/log` instead
- **No `any`** — use `@hitc/netsuite-types`; `@typescript-eslint/no-explicit-any` is enforced
- **Strict mode** — enabled in tsconfig; honor it
- **Strict equality** — `eqeqeq` enforced
- ESLint only lints `src/TypeScripts/` — transpiled output in `src/FileCabinet/SuiteScripts/` is ignored

### Logging

Use `N/log` consistently with appropriate levels:

| Level       | When to use                                               |
| ----------- | --------------------------------------------------------- |
| `log.debug` | Development diagnostics (reduce or remove for production) |
| `log.audit` | Production execution tracking and key milestones          |
| `log.error` | Caught exceptions and error conditions                    |

### Testing

Jest is configured via `@oracle/suitecloud-unit-testing` with project type `ACP`.
Tests use SuiteCloud's mock framework for NetSuite modules.
