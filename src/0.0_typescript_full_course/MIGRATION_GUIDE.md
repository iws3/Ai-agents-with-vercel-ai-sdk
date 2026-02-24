# JavaScript to TypeScript Migration Guide

Step-by-step guide for migrating JavaScript projects to TypeScript.

---

## Phase 1: Preparation (Week 1)

### Step 1: Audit Your Codebase
```bash
# Count files
find . -name "*.js" | wc -l      # JS files count
find . -name "*.ts" | wc -l      # TS files count
find . -name "*.jsx" | wc -l     # JSX files count
```

### Step 2: Set Up Infrastructure
```bash
npm install --save-dev typescript
npm install --save-dev ts-node
npm install --save-dev @types/node
npx tsc --init
```

### Step 3: Initialize tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Phase 2: File-by-File Migration (Weeks 2-3)

### Step 1: Rename Files
```bash
# Start with isolated utility files
mv src/utils/helpers.js src/utils/helpers.ts
mv src/config.js src/config.ts
```

### Step 2: Add Type Annotations (Gracually)
```typescript
// Before
export function add(a, b) {
  return a + b;
}

// After
export function add(a: number, b: number): number {
  return a + b;
}
```

### Step 3: Create Type Definitions
```bash
# For third-party libraries
npm install --save-dev @types/express
npm install --save-dev @types/react
npm install --save-dev @types/node
```

---

## Phase 3: Gradual Strictness (Week 4+)

### Option A: Incremental Strictness
```json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": false
  }
}
```

### Option B: File-Level Overrides
```typescript
// @ts-check
// Ì±Ü Enable checks for specific file

// OR

// @ts-ignore
declare const legacyVar: any;
// Ì±Ü Ignore specific issues
```

---

## Phase 4: Common Patterns

### Pattern 1: React Components
```typescript
// types.ts
export interface Props {
  title: string;
  count?: number;
  onClose: () => void;
}

// Before
function Header(props) {
  return <h1>{props.title}</h1>;
}

// After
const Header: React.FC<Props> = ({ title, count, onClose }) => {
  return (
    <div>
      <h1>{title}</h1>
      {count && <span>{count}</span>}
      <button onClick={onClose}>Close</button>
    </div>
  );
};
```

### Pattern 2: Express Routes
```typescript
// Before
app.get('/users/:id', (req, res) => {
  const user = getUser(req.params.id);
  res.json(user);
});

// After
interface User {
  id: number;
  name: string;
  email: string;
}

app.get<{ id: string }>('/users/:id', (req, res): void => {
  const user = getUser(parseInt(req.params.id));
  res.json<User>(user);
});
```

### Pattern 3: APIs and HTTP Calls
```typescript
// types.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
}

// Before
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// After
async function getUser(id: number): Promise<UserData> {
  const response = await fetch(`/api/users/${id}`);
  const data: ApiResponse<UserData> = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error(data.error || 'Unknown error');
  }
  
  return data.data;
}
```

### Pattern 4: Node.js Utilities
```typescript
// Before
const fs = require('fs');

function readJson(path) {
  const content = fs.readFileSync(path, 'utf8');
  return JSON.parse(content);
}

// After
import fs from 'fs';

interface JsonData {
  [key: string]: any;
}

function readJson(path: string): JsonData {
  const content = fs.readFileSync(path, 'utf8');
  return JSON.parse(content) as JsonData;
}
```

---

## Phase 5: Handling Third-Party Libraries

### Untyped Libraries
```typescript
// Option 1: Declare module
declare module 'untyped-lib' {
  export function getData(): any;
}

// Option 2: Create .d.ts file
// types/untyped-lib.d.ts
declare module 'untyped-lib' {
  function getData(): Promise<any>;
  export = getData;
}

// Option 3: Use any (temporary)
import someLib from 'untyped-lib' as any;
```

### Partially Typed Libraries
```typescript
import Library, {
  TypedExport,
  UntypedExport as any
} from 'partial-lib';

// Mix typed and untyped
const result = new Library();
```

---

## Phase 6: Testing Migration

### Jest Configuration
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ]
};
```

### Test File Example
```typescript
// src/utils/__tests__/helpers.test.ts
import { add, multiply } from '../helpers';

describe('Math utilities', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  
  it('should multiply two numbers', () => {
    expect(multiply(2, 3)).toBe(6);
  });
});
```

---

## Migration Checklist

### Week 1: Setup
- [ ] Install TypeScript
- [ ] Create tsconfig.json
- [ ] Update package.json scripts
- [ ] Update build configuration
- [ ] Set up editor (VS Code)

### Week 2-3: Migration
- [ ] Create types/ directory
- [ ] Migrate utility files
- [ ] Migrate config files
- [ ] Migrate service files
- [ ] Migrate component files
- [ ] Install @types packages
- [ ] Fix compilation errors

### Week 4: Testing & Refinement
- [ ] Run all tests
- [ ] Update test files to TypeScript
- [ ] Enable strict mode gradually
- [ ] Review coverage
- [ ] Update documentation

### Week 5: Production
- [ ] Update CI/CD pipeline
- [ ] Build in CI
- [ ] Deploy
- [ ] Monitor for issues
- [ ] Celebrate! Ìæâ

---

## Common Challenges & Solutions

### Challenge 1: "Property does not exist"
```typescript
// ‚ùå Problem
const data = JSON.parse(json);
console.log(data.user.name); // ‚ùå Object could be anything

// ‚úÖ Solution
interface ParsedData {
  user: {
    name: string;
  };
}

const data = JSON.parse(json) as ParsedData;
console.log(data.user.name); // ‚úÖ Safe
```

### Challenge 2: "Cannot find module"
```typescript
// ‚ùå Problem
import { config } from './config.js'; // Extension not found in TS

// ‚úÖ Solution
import { config } from './config'; // Drop .js extension
```

### Challenge 3: "Argument of type 'any'"
```typescript
// ‚ùå Problem
const x: any = getValue();
console.log(x.foo.bar.baz);

// ‚úÖ Solution
interface Value {
  foo: { bar: { baz: string } };
}

const x: Value = getValue();
console.log(x.foo.bar.baz); // Safe!
```

### Challenge 4: Circular Dependencies
```typescript
// types.ts
export interface User {
  posts: Post[];
}

export interface Post {
  author: User;
}

// ‚ùå Circular - both depend on each other

// ‚úÖ Solution: Extract to shared file
// shared.d.ts
export interface BaseUser {
  id: number;
  name: string;
}

export interface BasePost {
  id: number;
  title: string;
}

// Then reference as needed
```

---

## Performance Impact

| Aspect | Impact | Mitigation |
|--------|--------|-----------|
| Build time | +20-50% | Use ts-loader with cache |
| Bundle size | +0-5% | Tree-shaking enabled |
| Editor lag | -20-30% | Type checking performance |
| Type checking | +5-30 sec | Separate TS check from build |

---

## Success Metrics

Track your migration progress:

```bash
# TypeScript files percentage
ts_files=$(find src -name "*.ts" | wc -l)
js_files=$(find src -name "*.js" | wc -l)
percentage=$((ts_files * 100 / (ts_files + js_files)))
echo "TypeScript coverage: ${percentage}%"
```

**Target**: Reach 100% TypeScript coverage before enabling `strict: true`.

---

## Final Tips

1. **Don't rush**: Better to migrate 10% well than 100% poorly
2. **Test continuously**: Keep test suite passing
3. **Use gradual strictness**: Enable strict mode file by file
4. **Document decisions**: Record why you chose certain patterns
5. **Code review**: Have team review TypeScript patterns
6. **Share knowledge**: Pair program with less experienced members

---

