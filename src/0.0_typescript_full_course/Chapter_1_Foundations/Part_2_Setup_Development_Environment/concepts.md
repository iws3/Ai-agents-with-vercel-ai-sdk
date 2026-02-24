# Part 2: Setup Development Environment — Complete Guide

## ��� Learning Objectives

- Install Node.js and npm (or yarn)
- Set up TypeScript compiler
- Configure a TypeScript project with tsconfig.json
- Use VS Code for TypeScript development
- Understand the compilation workflow
- Set up a complete development environment for AI/Frontend projects

## ���️ Key Terms

- **Node.js**: JavaScript runtime enabling JavaScript outside browsers
- **npm/yarn**: Package managers for JavaScript dependencies
- **TypeScript Compiler (tsc)**: Tool that converts TypeScript to JavaScript
- **tsconfig.json**: Configuration file defining compiler options
- **Dev Dependencies**: Tools needed only during development, not production
- **Global vs Local Installation**: Installing tools system-wide vs project-specific
- **Compilation Output**: Generated JavaScript from TypeScript source

---

## Why Proper Setup Matters

Many developers skip proper environment setup and pay for it later. A well-configured environment enables:

- **Fast development**: Hot reload, instant error feedback
- **Production quality**: Strict type checking, optimized output
- **Team consistency**: Everyone uses same configuration
-  **Debugging**: Source maps, clear error messages
- **Scaling**: Works well whether project is 10 lines or 100k+ lines

---

## Step-by-Step Setup Guide

### 1. Install Node.js and npm

Node.js includes npm (Node Package Manager) automatically.

**Windows**: Download from https://nodejs.org/
- Choose LTS (Long Term Support) version
- Run installer, follow defaults
- Restart computer after installation

**macOS / Linux**: 
```bash
# Using Homebrew on macOS
brew install node

# Verify installation
node --version   # Should show v18+ or v20+
npm --version    # Should show 9+
```

### 2. Create Your First TypeScript Project

```bash
# Create a project directory
mkdir my-typescript-project
cd my-typescript-project

# Initialize npm project
npm init -y

# Install TypeScript locally
npm install --save-dev typescript

# Verify installation
npx tsc --version
```

### 3. Create tsconfig.json

TypeScript needs configuration. Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",                    // JavaScript version to target
    "module": "commonjs",                  // Module system
    "lib": ["ES2020"],                     // Available built-in types
    "outDir": "./dist",                    // Where compiled JS goes
    "rootDir": "./src",                    // Where TS source files are
    "strict": true,                        // Strict type checking
    "esModuleInterop": true,               // Better JS interop
    "skipLibCheck": true,                  // Don't check library types
    "forceConsistentCasingInFileNames": true,  // Consistent naming
    "resolveJsonModule": true,             // Import JSON files
    "declaration": true,                   // Generate .d.ts files
    "declarationMap": true,                // Maps for declarations
    "sourceMap": true                      // Debugging support
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Create Project Structure

```
my-typescript-project/
├── src/
│   └── index.ts          # Your TypeScript code
├── dist/                 # Generated JavaScript (created by compiler)
├── package.json          # Project metadata
├── tsconfig.json         # TypeScript configuration
└── node_modules/         # Dependencies
```

### 5. Add npm Scripts

In `package.json`, add these scripts for convenience:

```json
{
  "scripts": {
    "build": "tsc",                    // Compile once
    "dev": "tsc --watch",              // Auto-compile on changes
    "start": "node dist/index.js"      // Run compiled code
  }
}
```

Now you can:
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode (recompile on file changes)
- `npm start` - Run the compiled JavaScript

### 6. Install VS Code Extensions

**Extensions to install**:
1. **ES7+ React/Redux/React-Native snippets** - Code snippets
2. **Prettier** - Code formatting
3. **ESLint** - Code quality checking

These massively speed up development.

---

## Understanding the Compilation Process

### What Happens When You Run `tsc`

```
TypeScript Source (src/index.ts)
    ⬇️
Parsing (reads and understands code structure)
    ⬇️
Type Checking (verifies type correctness)
    ⬇️
Code Generation (converts to JavaScript)
    ⬇️
Output (dist/index.js)
```

### Before and After Compilation

**TypeScript Source** (src/index.ts):
```typescript
interface User {
  name: string;
  age: number;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}! You are ${user.age} years old.`;
}

const user: User = { name: "Alice", age: 30 };
console.log(greetUser(user));
```

**Compiled JavaScript** (dist/index.js):
```javascript
"use strict";
function greetUser(user) {
  return "Hello, " + user.name + "! You are " + user.age + " years old.";
}
const user = { name: "Alice", age: 30 };
console.log(greetUser(user));
```

Notice: All type annotations (`interface User`, `: User`, `: string`) are completely removed. The compiled JavaScript has NO type information.

---

## Environment Setup for Different Scenarios

### AI Engineering Project Setup

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "moduleResolution": "node"
  },
  "dependencies": {
    "axios": "latest",         // For API calls
    "dotenv": "latest"         // For environment variables
  },
  "devDependencies": {
    "typescript": "latest",
    "ts-node": "latest"        // Run TypeScript directly
  }
}
```

### Frontend React Project Setup

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",        // ES6 modules for bundlers
    "jsx": "react-jsx",        // React JSX support
    "strict": true",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]  // Browser APIs
  },
  "dependencies": {
    "react": "18.x",
    "react-dom": "18.x"
  }
}
```

---

## ��� Real-World Examples

### Development Workflow

```bash
# 1. Create a new feature file in src/
echo "export function newFeature() { }" > src/feature.ts

# 2. Terminal 1: Watch for auto-compilation
npm run dev

# 3. Terminal 2: Make changes, see them instantly
# Edit src/feature.ts
# Watch shows: src/feature.ts successfully compiled

# 4. Run your code
npm start
```

### Debugging with Source Maps

With `"sourceMap": true` in tsconfig.json:

**In Browser DevTools**:
- You see your original TypeScript code
- Breakpoints work in TypeScript files
- Debugging is human-readable

Without source maps:
- You see compiled JavaScript
- Hard to debug minified code
- Error line numbers don't match source

---

## ⚠️ Common Setup Issues

### Issue: `tsc: command not found`
```bash
# Solution: Install TypeScript
npm install --save-dev typescript
# Use with npx
npx tsc --version
```

### Issue: `Cannot find module`
```bash
# Solution: Install missing dependency
npm install missing-package
```

### Issue: Port Already in Use
```bash
# Solution: Kill process on port
lsof -i :3000  # Find process
kill -9 <PID>  # Kill it
```

---

## ��� Resources

- [Node.js Official Site](https://nodejs.org/)
- [npm Documentation](https://docs.npmjs.com/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [VS Code TypeScript Support](https://code.visualstudio.com/docs/languages/typescript)

## ✅ Checklist

- [ ] Node.js and npm installed
- [ ] Created tsconfig.json
- [ ] Set up project directory structure
- [ ] Can run `npm run build` successfully
- [ ] VS Code extensions installed
- [ ] Can run `npm run dev` with auto-compilation
- [ ] Understand where compiled JavaScript goes
- [ ] Ready to write your first TypeScript program!
