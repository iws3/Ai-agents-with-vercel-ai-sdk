# Part 9: Building Libraries (Advanced Deep Dive)

## Learning Objectives

After this part you'll understand:
- Publishing to npm
- Semantic versioning
- Declaration files (.d.ts)
- Export strategies
- Breaking changes and migrations

---

## Package Setup

```json
{
  "name": "@myorg/mylib",
  "version": "1.0.0",
  "description": "Type-safe utilities",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.js",
      "types": "./dist/utils.d.ts"
    }
  },
  "files": ["dist"],
  "keywords": ["typescript", "utils"],
  "repository": "github.com/user/lib"
}
```

---

## Barrel Exports

```typescript
// src/index.ts
export * from "./utils";
export * from "./types";
export * from "./helpers";

// Allows: import { helper } from "mylib";
```

---

## Declaration Files

TypeScript auto-generates .d.ts files:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "declarationDir": "./dist"
  }
}
```

Generated types allow consumers to get IntelliSense.

---

## Type Exports

```typescript
// types.ts
export interface User {
  id: string;
  name: string;
}

export type Status = "active" | "inactive";

// index.ts
export * from "./types";
export { default as createUser } from "./create-user";
```

Consumers get full type information:
```typescript
import { User, Status } from "mylib";

const user: User = { id: "1", name: "Alice" };
```

---

## Semantic Versioning

```
1.2.3
│ │ └─ Patch (bug fixes)
│ └─── Minor (new features, backwards compatible)
└───── Major (breaking changes)
```

- v1.0.0 → v1.0.1: Bug fixes only
- v1.0.0 → v1.1.0: New features, backwards compatible
- v1.0.0 → v2.0.0: Breaking changes

---

## Breaking Changes

```typescript
// v1.0.0
export function processData(data: string): void { }

// v2.0.0 (breaking!)
export function processData(data: string, options: Options): void { }

// Better: Extend existing type
interface Options {
  verbose?: boolean;
}

export function processData(
  data: string,
  options?: Options
): void { }
```

---

## Migration Guide

```markdown
# v2.0.0 Migration Guide

## Breaking Changes

### processData signature changed
```typescript
// v1.x
processData(data);

// v2.x
processData(data, { verbose: true });
```

### Removed functions
- `processDataSync`: Use async version instead

## New Features
- Added streaming support
- Type-safe configuration
```

---

## Testing Library Types

```typescript
// types.test.ts
import { expectType, expectAssignable } from "tsd";
import { User } from "./types";

expectType<string>(({} as User).id);
expectAssignable<{ id: string }>(({ id: "1" } as User));
```

Run with:
```bash
tsd
```

---

## Publishing

```bash
# Build
npm run build

# Test
npm test

# Bump version
npm version minor  # or major, patch

# Publish
npm publish
```

---

## Checklist

- [ ] Configure package.json exports
- [ ] Generate declaration files
- [ ] Create barrel exports
- [ ] Use semantic versioning
- [ ] Document breaking changes
- [ ] Test library types
- [ ] Publish to npm
