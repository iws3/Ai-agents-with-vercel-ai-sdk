# Chapter 1: How to Convert JavaScript Code to TypeScript

Have existing JavaScript code? Here's how to progressively add TypeScript to it!

---

## Step 1: Set Up TypeScript in Existing Project

```bash
# Install TypeScript as dev dependency
npm install --save-dev typescript

# Create tsconfig.json
npx tsc --init

# Update tsconfig.json for gentle migration
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "jsx": "react",
    "allowJs": true,           # KEY: Allow .js files while migrating
    "checkJs": false,          # Don't check .js files yet
    "noUnusedLocals": false,   # Relax rules during migration
    "noUnusedParameters": false,
    "strict": false            # Start loose, tighten later
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Key Setting**: `"allowJs": true` - This lets TypeScript understand plain JavaScript files.

---

## Step 2: Rename Files .js → .ts

```bash
# From command line (one by one):
mv src/index.js src/index.ts
mv src/utils.js src/utils.ts

# Or rename in VS Code:
# Right-click file → Rename
```

---

## Step 3: Compile and Check for Errors

```bash
npm run build
# Don't worry about errors yet!
```

---

## Step 4: Add Types Gradually

### Option A: Start with Function Parameters

**Before (JavaScript)**:
```javascript
function greet(name) {
  return "Hello, " + name;
}
```

**After (TypeScript)**:
```typescript
function greet(name: string): string {
  return "Hello, " + name;
}
```

**Progress**:
- [ ] Add parameter types
- [ ] Add return types
- [ ] Compile without errors

---

### Option B: Add Interface Types

**Before (JavaScript)**:
```javascript
function createUser(data) {
  return {
    id: data.id,
    name: data.name,
    email: data.email
  };
}
```

**After (TypeScript)**:
```typescript
interface UserData {
  id: number;
  name: string;
  email: string;
}

function createUser(data: UserData): UserData {
  return {
    id: data.id,
    name: data.name,
    email: data.email
  };
}
```

---

### Option C: Use `any` as Temporary Placeholder

**During migration**:
```typescript
// Less ideal, but allows incremental migration
function processData(data: any): any {
  return data;
}

// Later: Replace with proper types
interface Data {
  id: number;
  value: string;
}

function processData(data: Data): Data {
  return data;
}
```

---

## Step 5: Gradually Increase strictness

### Phase 1: Current Setup (loose)
```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "strict": false
  }
}
```

### Phase 2: After ~30% Typed
```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "noImplicitAny": true,      # Error on missing types
    "strictNullChecks": true
  }
}
```

### Phase 3: After ~70% Typed
```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "strict": true
  }
}
```

### Phase 4: Full Migration (all .ts files)
```json
{
  "compilerOptions": {
    "allowJs": false,           # JS no longer allowed
    "checkJs": false,           # Not needed
    "strict": true
  }
}
```

---

## Real-World Migration Example

### Original JavaScript File

```javascript
// lib.js - Pure JavaScript
export const calculateTotal = (items) => {
  let sum = 0;
  for (const item of items) {
    sum += item.price * item.quantity;
  }
  return sum;
};

export const applyCoupon = (total, code) => {
  if (code === "SAVE10") {
    return total * 0.9;
  }
  return total;
};
```

### Step-by-Step TypeScript Conversion

**Step 1**: Rename to `.ts`
```typescript
// lib.ts
export const calculateTotal = (items) => {
  // ... same code
};
```

**Step 2**: Add parameter types
```typescript
interface Item {
  price: number;
  quantity: number;
}

type CouponCode = string;

export const calculateTotal = (items: Item[]) => {
  let sum = 0;
  for (const item of items) {
    sum += item.price * item.quantity;
  }
  return sum;
};

export const applyCoupon = (total: number, code: CouponCode) => {
  if (code === "SAVE10") {
    return total * 0.9;
  }
  return total;
};
```

**Step 3**: Add return types
```typescript
export const calculateTotal = (items: Item[]): number => {
  let sum = 0;
  for (const item of items) {
    sum += item.price * item.quantity;
  }
  return sum;
};

export const applyCoupon = (total: number, code: CouponCode): number => {
  if (code === "SAVE10") {
    return total * 0.9;
  }
  return total;
};
```

**Step 4**: Final optimized version
```typescript
interface Item {
  price: number;
  quantity: number;
}

type CouponCode = "SAVE10" | "SAVE20" | "SAVE30";

export const calculateTotal = (items: Item[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const applyCoupon = (total: number, code: CouponCode): number =>
  code === "SAVE10"
    ? total * 0.9
    : code === "SAVE20"
    ? total * 0.8
    : total * 0.7;
```

---

## Managing Migration

### Quick Track (Days)
- Start with `allowJs: true`
- Rename critical files to `.ts`
- Add types to public APIs
- Gradually increase strictness

### Careful Track (Weeks)
- One file at a time
- Type each parameter
- Add interfaces
- Update tests
- Ensure all pass

---

## Tools to Help Migration

### TypeScript Conversion Tools
```bash
# Automatically add type annotations (experimental)
npx tsc --strict src/index.ts --noEmit --generateSourceMap false
```

### Generate Types from JSDoc
```javascript
// Use JSDoc comments for migration helper
/**
 * @param {number} age
 * @returns {string}
 */
export function getCategory(age) {
  return age < 18 ? "minor" : "adult";
}

// Later convert to TypeScript
export function getCategory(age: number): string {
  return age < 18 ? "minor" : "adult";
}
```

---

## Common Migration Challenges

### Challenge 1: Third-party Libraries Without Types
```typescript
// Some packages don't have TypeScript types
import something from "old-library";  // no types
const result: any = something();  // Use any temporarily
```

**Solution**:
```bash
# Try to install types separately
npm install --save-dev @types/old-library

# Or create minimal types
// types.d.ts
declare module "old-library" {
  export default function something(): any;
}
```

---

### Challenge 2: Complex Runtime Data
```typescript
// Data from APIs - you don't control the shape
const data = await fetch("/api/users").then(r => r.json());

// Option 1: Use any temporarily
const users: any = data;

// Option 2: Define what you expect
interface User {
  id: number;
  name: string;
}
const users: User[] = data;  // Hope it matches!

// Option 3: Runtime validation
import { z } from "zod";
const UserSchema = z.object({ id: z.number(), name: z.string() });
const users = data.map((u: any) => UserSchema.parse(u));
```

---

### Challenge 3: Asynchronous Type Discovery
```typescript
// Old code: Unclear what function returns
function getData() {
  return fetch("/api/data").then(r => r.json());
}

// New code: Be explicit
interface ApiResponse {
  status: "success" | "error";
  data?: any;
  error?: string;
}

async function getData(): Promise<ApiResponse> {
  const response = await fetch("/api/data");
  return response.json();
}
```

---

## Migration Checklist

- [ ] TypeScript installed
- [ ] tsconfig.json created
- [ ] allowJs enabled
- [ ] Rename critical files to .ts
- [ ] Add types to public APIs
- [ ] Add types to functions
- [ ] Add types to classes
- [ ] Add types to interfaces/types
- [ ] Run tests
- [ ] Increase strictness
- [ ] Update documentation
- [ ] Turn off allowJs

---

