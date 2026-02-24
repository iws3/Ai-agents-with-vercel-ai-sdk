# Chapter 1: TypeScript Performance & Optimization Tips

TypeScript adds little runtime overhead, but can impact compile-time. Here's how to optimize!

---

## Compile-Time Performance

### Tip 1: Use Specific Import Paths

❌ **Slow - Forces TypeScript to check many files**:
```typescript
import { User } from "..";  // Ambiguous
import * as utils from "utils";  // Everything
```

✅ **Fast - Direct path**:
```typescript
import { User } from "../types/user";
import { getUserById } from "../utils/database";
```

**Why**: TypeScript doesn't have to search multiple paths.

---

### Tip 2: Enable Skip Lib Check

```json
// tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true  # Skip type-checking node_modules
  }
}
```

**Performance**: Can cut compile time by 20-30% for large projects!

---

### Tip 3: Use NoEmit in Development

Watch mode compiles but doesn't write files:

```json
{
  "compilerOptions": {
    "noEmit": true  # Don't generate .js files
  }
}
```

Or in script:
```json
{
  "scripts": {
    "check": "tsc --noEmit"  # Just type-check, don't compile
  }
}
```

---

### Tip 4: Exclude Unnecessary Folders

```json
{
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

**Why**: TypeScript only processes needed files.

---

### Tip 5: Use Project References for Large Codebases

For monorepos or huge projects:

```json
// packages/core/tsconfig.json
{
  "compilerOptions": { "composite": true },
  "references": []
}

// packages/ui/tsconfig.json
{
  "compilerOptions": { "composite": true },
  "references": [{ "path": "../core" }]
}
```

TypeScript compiles each project separately and caches results!

---

## Runtime Performance

### Tip 1: Tree-Shaking Works with TypeScript

```typescript
// src/utils.ts
export function used() { /* ... */ }
export function unused() { /* ... */ }

// src/index.ts
import { used } from "./utils";
used();  // Only 'used' is included in final bundle

// 'unused' function is removed by bundler
```

**Key**: Use ES6 modules for tree-shaking to work.

---

### Tip 2: Lazy Load Types to Speed Up Startup

❌ **Slow - Loads everything immediately**:
```typescript
import { HugeType } from "./huge-types";

export function process(data: HugeType) {
  // ...
}
```

✅ **Fast - Load only when needed**:
```typescript
import type { HugeType } from "./huge-types";

export function process(data: HugeType) {
  // ...
}
```

**Note**: `import type` is erased at compile time (zero runtime cost!).

---

### Tip 3: Use Intersection Types Instead of Unions for Performance

```typescript
// ❌ Union - TypeScript checks each possibility
type Result = { success: true; data: string } | { success: false; error: string };

// ✅ Intersection - Single check
type BaseResult = { success: boolean };
type SuccessResult = BaseResult & { data: string };
type ErrorResult = BaseResult & { error: string };
type Result = SuccessResult | ErrorResult;
```

---

### Tip 4: Prefer Direct Types Over Complex Generics

❌ **Complex**:
```typescript
function process<T extends { id: number } & Partial<{ name: string }> & Record<string, unknown>>(value: T) {
  // TypeScript works hard to understand this
}
```

✅ **Simple**:
```typescript
interface Item {
  id: number;
  name?: string;
  [key: string]: unknown;
}

function process(value: Item) {
  // Clear and fast
}
```

---

## File Size Tips

### Tip 1: Use Const Assertions

❌ **Large - TypeScript infers unions**:
```typescript
const directions = ["north", "south", "east", "west"];
// Type: string[]  - Could be any string!
```

✅ **Smaller - Exact literal types**:
```typescript
const directions = ["north", "south", "east", "west"] as const;
// Type: ("north" | "south" | "east" | "west")[]
```

**Benefit**: More type-safety, sometimes smaller output.

---

### Tip 2: Use Type Aliases for External APIs

```typescript
// Better than repeating the type everywhere
type ApiResponse = {
  data: unknown;
  status: number;
};

async function fetchUser(id: number): Promise<ApiResponse> { /* ... */ }
async function fetchPosts(userId: number): Promise<ApiResponse> { /* ... */ }
```

### Tip 3: Declare Return Types Explicitly

TypeScript can infer, but explicit is often clearer:

```typescript
// Explicit - clear what returns
function sum(a: number, b: number): number {
  return a + b;
}

// Let TypeScript do less work
function formatDate(date: Date) {  // Type inferred
  return date.toLocaleDateString();
}
```

---

## Memory Tips

### Tip 1: Avoid Circular References

❌ **Bad - File A imports B, B imports A**:
```typescript
// user.ts
import { Post } from "./post";
export interface User { posts: Post[] }

// post.ts
import { User } from "./user";
export interface Post { author: User }
```

✅ **Good - Use interfaces to break cycle**:
```typescript
// types/user.ts
export interface User { id: number }

// types/post.ts
import { User } from "./user";
export interface Post { author: User }
```

---

### Tip 2: Limit Global Ambient Types

```typescript
// ❌ Don't do this everywhere - slows TypeScript down
declare global {
  interface Window { myCustomAPI: any }
}

// ✅ More targeted
declare module "my-package" {
  // Local type augmentation
}
```

---

## Debugging Compile Time

### Measure Compilation Speed

```bash
# Show which files take longest to compile
tsc --diagnostics

# Sample different time phases
tsc --listFiles

# Show file count per project reference
tsc -p . --listFilesOnly
```

### Typical Times
- Small project (< 100 files): 1-2 seconds
- Medium project (< 1000 files): 5-10 seconds
- Large project (> 1000 files): 20+ seconds

---

## Before Optimizing

**Remember**: Premature optimization is the root of all evil!

Only optimize if:
- ✅ Compile time is noticeably slow (> 10s)
- ✅ You've measured and identified the bottleneck
- ✅ You have a specific goal (e.g., "under 5s")

---

## Optimization Checklist

- [ ] Enable `skipLibCheck`
- [ ] Exclude unnecessary files
- [ ] Use specific import paths
- [ ] Remove unused dependencies
- [ ] Profile compile time (if slow)
- [ ] Consider project references (if very large)
- [ ] Check for circular dependencies
- [ ] Prefer `import type` for types-only imports

---

