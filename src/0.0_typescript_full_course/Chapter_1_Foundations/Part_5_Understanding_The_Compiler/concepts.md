# Part 5: Understanding The Compiler — tsconfig.json Deep Dive

## ��� Learning Objectives

- Master tsconfig.json configuration
- Understand each compiler option
- Configure for different project types (AI, Web, Library)
- Optimize for development vs production
- Understand strict mode and its benefits
- Learn advanced compiler options

---

## What is tsconfig.json?

`tsconfig.json` is the heart of your TypeScript project. It tells the TypeScript compiler:
- Where to find source files
- Where to output compiled code
- How strictly to check types
- What JavaScript features to target

---

## Complete tsconfig.json Explained

```json
{
  "compilerOptions": {
    // === TARGET & MODULE ===
    "target": "ES2020",                    // JavaScript version to compile
    "module": "commonjs",                  // Module system ("commonjs", "esnext", "es6")
    "lib": ["ES2020"],                     // Available built-in types
    
    // === FILE PATHS ===
    "outDir": "./dist",                    // Where compiled JS is output
    "rootDir": "./src",                    // Location of .ts files
    "baseUrl": "./src",                    // Base for module resolution
    
    // === TYPE CHECKING (STRICT MODE) ===
    "strict": true,                        // Enable ALL strict checks (recommended!)
    "noImplicitAny": true,                 // Error on implicit 'any'
    "strictNullChecks": true,              // null/undefined must be explicit
    "strictFunctionTypes": true,           // Strict function type checking
    "strictPropertyInitialization": true, // Properties must be initialized
    "noImplicitThis": true,                // Error on implicit 'this'
    "alwaysStrict": true,                  // "use strict" in output
    
    // === ADDITIONAL CHECKS ===
    "noUnusedLocals": true,                // Error on unused variables
    "noUnusedParameters": true,            // Error on unused function parameters
    "noImplicitReturns": true,             // Function must return on all paths
    "noFallthroughCasesInSwitch": true,   // No fall-through in switch
    
    // === OUTPUT QUALITY ===
    "declaration": true,                   // Generate .d.ts files
    "declarationMap": true,                // Maps for .d.ts files
    "sourceMap": true,                     // Generate source maps for debugging
    "inlineSourceMap": false,              // Embed source map in JS file
    
    // === INTEROPERABILITY ===
    "esModuleInterop": true,               // Better commonjs interop
    "allowSyntheticDefaultImports": true,  // Default import from modules
    "skipLibCheck": true,                  // Don't check third-party library types
    "forceConsistentCasingInFileNames": true,  // Case-sensitive imports
    
    // === MODULE RESOLUTION ===
    "moduleResolution": "node",            // How to resolve modules
    "resolveJsonModule": true,             // Can import JSON files
    "allowJs": true,                       // Compile JavaScript files too
    "checkJs": false                       // Don't check JavaScript files
  },
  
  // === INCLUDE/EXCLUDE ===
  "include": ["src/**/*"],                 // Which files to compile
  "exclude": ["node_modules", "dist"],    // Which files to skip
  
  // === REFERENCES (for monorepos) ===
  "references": [
    { "path": "../utils" }
  ]
}
```

---

## Understanding Key Options

### Target vs Module

**`target`**: What JavaScript version your code compiles to.

```typescript
// Modern ES2020 source
const name = "Alice";
const add = (a: number, b: number) => a + b;
```

Compiles differently depending on target:

```javascript
// "target": "ES2020"
const name = "Alice";
const add = (a, b) => a + b;
```

```javascript
// "target": "ES2015"
const name = "Alice";
const add = (a, b) => a + b;
```

```javascript
// "target": "ES5"
var name = "Alice";
var add = function(a, b) { return a + b; };
```

**Choose based on browser support**:
- Modern browsers (Chrome 80+): ES2020
- Older browsers (IE 11): ES5
- Node.js 14+: ES2020
- Mobile browsers: ES2015

### Module vs ModuleResolution

**`module`**: What format the code uses for imports/exports.

```typescript
// Source
import { add } from './math';
export function result() { }
```

With `"module": "commonjs"`:
```javascript
const { add } = require('./math');
module.exports = { result };
```

With `"module": "es6"`:
```javascript
import { add } from './math';
export function result() { }
```

### Strict Mode (Most Important)

**`"strict": true`** enables all strict checks. This is highly recommended:

```typescript
// With "strict": true
let name: string;
name = null;  // ❌ Error: null not assignable

function greet(user: any) {  // ❌ Error: avoid 'any'
  return `Hello, ${user.name}`;  // ❌ Error: 'name' might be undefined
}
```

Without strict mode, these slide through and become runtime bugs.

### Declaration Files (.d.ts)

With `"declaration": true`:

**Original TypeScript** (src/math.ts):
```typescript
export function add(a: number, b: number): number {
  return a + b;
}

export interface Calculator {
  add(...args: number[]): number;
}
```

**Generates** (dist/math.d.ts):
```typescript
export declare function add(a: number, b: number): number;
export interface Calculator {
  add(...args: number[]): number;
}
```

This .d.ts file tells other developers/IDEs what your code exports and what types they have.

---

## Configuration for Different Project Types

### AI/LLM Engineering Project

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": "./src",
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Frontend React Project

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",               // ESM for better bundling
    "jsx": "react-jsx",               // React JSX support
    "lib": ["ES2020", "DOM", "DOM.Iterable"],  // Browser APIs
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true"
  }
}
```

### Library Published to npm

```json
{
  "compilerOptions": {
    "target": "ES2015",              // Broader compatibility
    "module": "commonjs",  
    "lib": ["ES2015"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "declaration": true,            // Must generate .d.ts
    "declarationMap": true,
    "sourceMap": true",
    "esModuleInterop": true
  }
}
```

---

## Real-World: Debugging Configuration Issues

### Issue: "Cannot find module 'express'"

**Cause**: `moduleResolution` set incorrectly or module not installed

**Solution**:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",  // ← This is important
    "types": ["node"]             // Add type declarations
  }
}
```

### Issue: Import statement with different casing works in development but fails in production

**Cause**: Windows is case-insensitive, but Linux/Mac aren't

**Solution**:
```json
{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true  // ← Enforce strict casing
  }
}
```

This catches the issue before deploying.

### Issue: Unused variables/imports piling up in code

**Cause**: No checking for unused code

**Solution**:
```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "newline": true
  }
}
```

Your IDE highlights unused code, helping you keep code clean.

---

## Development vs Production

### Development (Most Lenient)

```json
{
  "compilerOptions": {
    "strict": false,        // Allow development shortcuts
    "nocheck": true,        // Faster compilation
    "sourceMap": true"      // Better debugging
  }
}
```

### Production (Most Strict)

```json
{
  "compilerOptions": {
    "strict": true,         // All checks enabled
    "declaration": true,             // Generate types
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### Using Multiple Configs

```bash
# Compile for production
npx tsc --project tsconfig.prod.json

# Or use npm scripts
"scripts": {
  "build": "tsc --project tsconfig.prod.json",
  "dev": "tsc --project tsconfig.dev.json --watch"
}
```

---

## Advanced Options

### `baseUrl` for Clean Imports

Without baseUrl:
```typescript
import { Helper } from '../../../utils/helpers';
```

With `"baseUrl": "./src"`:
```typescript
import { Helper } from 'utils/helpers';
```

Much cleaner!

### `paths` for Module Aliases

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@utils/*": ["./utils/*"],
      "@components/*": ["./components/*"]
    }
  }
}
```

Now you can import:
```typescript
import { Helper } from '@utils/helpers';
import { Button } from '@components/Button';
```

---

## Checking Your Config

```bash
# See what TypeScript will do with your config
npx tsc --showConfig -p ./tsconfig.json

# Validate your tsconfig.json
npx tsc --noEmit  # Check types without generating output
```

---

## ✅ Checklist

- [ ] Understand what tsconfig.json does
- [ ] Know what `"strict": true` enables
- [ ] Understand target vs module
- [ ] Can configure for your project type
- [ ] Know how to enable source maps for debugging
- [ ] Understand declaration files (.d.ts)
- [ ] Know how to configure for production
- [ ] Ready to master advanced TypeScript!
