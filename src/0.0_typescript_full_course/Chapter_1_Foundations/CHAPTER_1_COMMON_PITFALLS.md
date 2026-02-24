# Chapter 1: Common Pitfalls & How to Avoid Them

## Pitfall 1: Forgetting to Compile

**The Problem**:
```bash
# You try to run TypeScript directly
node src/index.ts

# Error: SyntaxError: Unexpected token ':'
# Node.js doesn't understand TypeScript syntax!
```

**The Solution**:
```bash
# Always compile FIRST
npm run build        # Creates dist/index.js

# Then run the compiled JavaScript
npm start           # Runs dist/index.js
```

**Remember**: TypeScript only runs in TypeScript-aware tools (tsc compiler, Node + ts-node, etc.), not plain Node.js.

---

## Pitfall 2: Using `any` Type

**The Problem**:
```typescript
// Using any - Defeats the purpose of TypeScript!
function processData(data: any): any {
  return data.value + 10;  // No type checking!
}

processData({ value: "string" });  // Error at runtime, not compile-time!
```

**The Solution**:
```typescript
// Use proper types
interface Data {
  value: number;
}

function processData(data: Data): number {
  return data.value + 10;  // TypeScript checks before runtime!
}

processData({ value: "string" });  // Compile error - caught immediately!
```

**Remember**: `any` means "I don't want type safety here". Avoid it unless absolutely necessary.

---

## Pitfall 3: Forgetting Type Annotations in Functions

**The Problem**:
```typescript
// Unclear what parameters this needs
function getUserData(id) {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

// Parent code might pass wrong type
getUserData("not-an-id-12345");  // Was this supposed to be a number?
```

**The Solution**:
```typescript
// Clear parameter and return types
function getUserData(id: number): Promise<User> {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

getUserData("abc");  // Compile error - must be number!
```

**Remember**: Always annotate function parameters and return types explicitly.

---

## Pitfall 4: Ignoring tsconfig.json

**The Problem**:
```json
// Default/minimal tsconfig.json
{
  "compilerOptions": {}
}

// Not strict enough! Many errors slip through
```

**The Solution**:
```json
{
  "compilerOptions": {
    "strict": true,              // Enable all strict checks
    "noImplicitAny": true,       // Error on implicit any
    "strictNullChecks": true,    // Must handle null/undefined
    "noUnusedLocals": true,      // Error on unused variables
    "noUnusedParameters": true,  // Error on unused parameters
    "target": "ES2020",
    "module": "commonjs"
  }
}
```

**Remember**: Start with `"strict": true` for new projects. It catches more bugs.

---

## Pitfall 5: Not Understanding Type vs Runtime

**The Problem**:
```typescript
// TypeScript Type
interface User {
  id: number;
  name: string;
}

// Later... at runtime
if (typeof user === User) {  // ❌ Error!
  // User is a TYPE (compile-time), not a value (runtime)
  // At runtime, User doesn't exist!
}
```

**The Solution**:
```typescript
// Use type guards for runtime checks
if (typeof user === "object" && "name" in user && "id" in user) {
  // user has the right properties
}

// Or use libraries like zod for validation
import { z } from "zod";
const userSchema = z.object({ id: z.number(), name: z.string() });
if (userSchema.safeParse(user).success) {
  // Valid user
}
```

**Remember**: Types vanish after compilation. For runtime checking, use actual JavaScript checks or validation libraries.

---

## Pitfall 6: Null/Undefined Not Handled

**The Problem**:
```typescript
function getName(user: { name: string }) {
  return user.name.toUpperCase();  // What if user is null?
}

const result = getName(null);  // Runtime error: cannot read property 'name' of null
```

**The Solution**:
```typescript
// Option 1: Make null explicit
interface User {
  name: string;
}

function getName(user: User | null) {
  if (user === null) return "UNKNOWN";
  return user.name.toUpperCase();
}

// Option 2: Use optional property
interface User {
  name?: string;  // Can be missing
}

function getName(user: User) {
  return (user.name || "UNKNOWN").toUpperCase();
}
```

**Remember**: In strict mode, null and undefined must be explicitly handled.

---

## Pitfall 7: Wrong File extension

**The Problem**:
```bash
# If you create index.js instead of index.ts
# TypeScript compiler doesn't process it!

echo "console.log('hello');" > src/index.js  # ❌ Wrong!
```

**The Solution**:
```bash
# Always use .ts for TypeScript files
echo "console.log('hello');" > src/index.ts  # ✓ Correct

# For React components, use .tsx
echo "export const Button = () => <button>Click</button>" > src/Button.tsx
```

**Remember**: Source files MUST be `.ts` or `.tsx`. The compiler won't process `.js` files by default.

---

## Pitfall 8: Case Sensitivity in Imports

**The Problem**:
```typescript
// File: src/components/Button.tsx

// Windows is case-insensitive, so this works locally:
import { Button } from './button';  // lowercase!

// But deploy to Linux/Mac (case-sensitive) and it breaks!
// Module not found: ./button (correct path is ./Button.tsx)
```

**The Solution**:
```json
// In tsconfig.json, enforce case sensitivity
{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true
  }
}
```

And always use correct casing:
```typescript
import { Button } from './Button';  // Correct - matches filename
```

**Remember**: Use `forceConsistentCasingInFileNames` to catch this during development.

---

