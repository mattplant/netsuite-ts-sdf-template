# GitHub Copilot Instructions

This file provides guidance to GitHub Copilot when working with code in this repository.

---

## Project Overview

A professional-grade NetSuite SuiteScript development project combining **TypeScript**,
**SuiteCloud Development Framework (SDF)**, and Biome. TypeScript source files
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
- **Linting & Formatting**: Biome
- **Testing**: Jest via `@oracle/suitecloud-unit-testing`

---

## Architecture

### Directory Structure

```text
src/
  AccountConfiguration/                                # SDF account config
  FileCabinet/Templates/                              # Email/marketing templates
  FileCabinet/SuiteScripts/idev-engineering-netsuite/ # Transpiled JS output (do NOT edit!)
  Objects/                                            # SDF XML object definitions
  Translations/                                       # Localization files
  TypeScripts/idev-engineering-netsuite/              # TypeScript source (edit these)
  deploy.xml                                          # SDF deployment manifest
  manifest.xml                                        # SDF project manifest
biome.json                                            # Biome (lint + format) configuration
LICENSE                                               # License file
package.json                                          # Yarn configuration
suitecloud.config.js                                   # SDF CLI configuration
tsconfig.json                                          # TypeScript configuration
yarn.lock                                             # Yarn lockfile
```

### TypeScript → NetSuite Pipeline

1. Write SuiteScript in `src/TypeScripts/idev-engineering-netsuite/`
2. `tsc` compiles to AMD modules in `src/FileCabinet/SuiteScripts/idev-engineering-netsuite/`
3. `yarn deploy` pushes the FileCabinet and Objects to NetSuite

### Import Style

Write clean ES imports — `tsc` handles the AMD conversion automatically:

```typescript
import * as log from 'N/log';
import * as record from 'N/record';
import type { EntryPoints } from 'N/types';
```

---

## SuiteScript Conventions

### File Naming Convention

Files follow the pattern: `idev_[record]_[feature]_[type].ts`

| Suffix | Script Type                       |
| ------ | --------------------------------- |
| `_ue`  | UserEvent                         |
| `_mr`  | MapReduce                         |
| `_sl`  | Suitelet                          |
| `_cs`  | ClientScript                      |
| `_sc`  | ScheduledScript                   |
| `_rl`  | RESTlet                           |
| `_lib` | Shared library / common utilities |

Examples: `idev_invoice_sync_mr.ts`, `idev_utils_lib.ts`

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

---

## Guardrails

- Never modify `deploy.xml` or `manifest.xml` unless explicitly asked
- Do not add new dependencies to `package.json` without asking first
- When creating a new SuiteScript file, always include the JSDoc header,
  the correct entry points for the script type, and register it in the
  SDF Objects folder if a corresponding script record XML is needed

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

Enforced via Biome (`biome.json`), which only lints `src/TypeScripts/` — transpiled output in `src/FileCabinet/SuiteScripts/` is ignored.

- **No `console`** — use `N/log` instead (`suspicious/noConsole`)
- **No `any`** — use `@hitc/netsuite-types` (`suspicious/noExplicitAny`)
- **Strict mode** — enabled in tsconfig; honor it
- **Strict equality** — `===` enforced (`suspicious/noDoubleEquals`)
- **Explicit return types** — no Biome equivalent; enforced partially via `noImplicitReturns` in tsconfig and code review

### Logging

Use `N/log` consistently with appropriate levels:

| Level       | When to use                                               |
| ----------- | --------------------------------------------------------- |
| `log.debug` | Development diagnostics (reduce or remove for production) |
| `log.audit` | Production execution tracking and key milestones          |
| `log.error` | Caught exceptions and error conditions                    |

### Testing

- Jest is configured via `@oracle/suitecloud-unit-testing` with project type `ACP`
- Tests use SuiteCloud's mock framework for NetSuite modules
- Generate UAT test cases for all new scripts *(aspirational)*

### Deployment Documentation

- Include rollback procedures in deployment docs *(aspirational)*
