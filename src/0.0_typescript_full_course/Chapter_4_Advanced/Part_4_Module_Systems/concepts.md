# Part 4: Module Systems (Advanced Deep Dive)

## Learning Objectives

After this part you'll understand:
- CommonJS vs ES Modules
- Module resolution strategies
- Path aliases and baseUrl
- Circular dependency prevention
- Monorepo structure with TypeScript

---

## Module Systems

### CommonJS (Traditional Node)

```typescript
// Exporting
export = Database;
module.exports = { name: "app" };

// Importing
import * as db from "./database";
const config = require("./config");
```

### ES Modules (Modern Standard)

```typescript
// Exporting
export const name = "app";
export default class Database {}

// Importing
import Database, { name } from "./database";
import * as utils from "./utils";
```

---

## Module Resolution

TypeScript resolves imports via strategy set in tsconfig.json:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@utils/*": ["./utils/*"],
      "@components/*": ["./components/*"]
    }
  }
}
```

Usage:
```typescript
import { Helper } from "@utils/helpers";
import { Button } from "@components/Button";
```

---

## Circular Dependencies

BAD: Circular import
```typescript
// a.ts
import { B } from "./b";
export class A extends B {}

// b.ts
import { A } from "./a";
export class B extends A {}
```

GOOD: Use interfaces to break cycle
```typescript
// types.ts
export interface IEntity {
  id: string;
}

// a.ts
import { IEntity } from "./types";
export class A implements IEntity {
  id = "";
}

// b.ts
import { IEntity } from "./types";
export class B implements IEntity {
  id = "";
}
```

---

## Dynamic Imports

```typescript
// Lazy load only when needed
async function loadPlugin(name: string) {
  const module = await import(`./plugins/${name}`);
  return module.default;
}

// Top-level await in modules
const data = await fetch("/api/config").then(r => r.json());
```

---

## Monorepo Structure

```
workspace/
├── packages/
│   ├── core/
│   │   ├── tsconfig.json
│   │   └── src/
│   ├── utils/
│   │   ├── tsconfig.json
│   │   └── src/
│   └── api/
│       ├── tsconfig.json
│       └── src/
└── tsconfig.json  # Base config
```

Root tsconfig.json:
```json
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./packages/api" }
  ]
}
```

---

## Barrel Exports

Simplify imports with index.ts:

```typescript
// src/components/index.ts
export { Button } from "./Button";
export { Alert } from "./Alert";
export { Modal } from "./Modal";

// Usage
import { Button, Alert } from "./components";  // Clean!
```

---

## Checklist

- [ ] Understand CommonJS and ES Modules
- [ ] Configure module resolution
- [ ] Use path aliases
- [ ] Avoid circular dependencies
- [ ] Structure monorepos with TypeScript references
- [ ] Use barrel exports for clean APIs
