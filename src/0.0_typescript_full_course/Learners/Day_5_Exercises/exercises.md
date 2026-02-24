# Day 5: TypeScript Compiler Configuration - Exercises

## 📝 Master the Compiler!

---

## 🟢 Exercise 1: Strict Mode Detective (Beginner)

**Objective:** Understand what strict mode catches.

**Tasks:**
1. Create `src/strict-mode-test.ts`:
```typescript
function greet(name) {
  return "Hello, " + name;
}

let value;
value = "string";
console.log(value.charAt(0));

class User {
  id: number;
  name: string;
}

const user = new User();
console.log(user.id);
```

2. Compile with `"strict": false` - note any errors
3. Change to `"strict": true` - note errors now
4. Fix ALL errors
5. Document in `exercise-1.md`:
   - Original code
   - Errors found with strict mode
   - Fixed version
   - Explanation of each fix

---

## 🟡 Exercise 2: Configure for Different Projects (Intermediate)

**Objective:** Create appropriate configs for different scenarios.

**Tasks:**
1. Create three tsconfig files:

**tsconfig.node.json** (Node.js backend)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "declaration": true,
    "sourceMap": true
  }
}
```

**tsconfig.browser.json** (Frontend/React)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true
  }
}
```

**tsconfig.strict.json** (Maximum checks)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "sourceMap": true
  }
}
```

2. For each config, write a sample `.ts` file that compiles with it
3. Write explanation of why each option is set that way
4. Submit all three configs + sample files

---

## 🔴 Exercise 3: Analyze Compiler Diagnostics (Advanced)

**Objective:** Understand compiler error messages deeply.

**Tasks:**
1. Create `src/diagnostic-test.ts` with intentional errors:
```typescript
interface Config {
  readonly timeout: number;
  maxRetries?: number;
}

function processRequest(url: string, config?: Config): Promise<void> {
  // Missing implementation - intentional errors
}

const user: { id: number; name: string } = { id: "123", name: "Alice" };

function calculate(a: number, b: number): number {
  // Missing return
}

let status;
status.toString();  // Potential null/undefined issue

const data: any = {};  // Error: any type with strict mode
```

2. Compile and record each error message
3. For each error, document:
   - Error code (e.g., TS2345)
   - What it means
   - How to fix it
   - Why TypeScript caught it

4. Create `exercise-3.md` with:
   - Table of errors with codes
   - Explanation of root cause
   - How strict mode helped
   - Lessons learned

---

## 📋 Submission Checklist

- [ ] My folder: `Solutions/YOUR-GITHUB-USERNAME/`
- [ ] Files: `exercise-1.md`, `exercise-2/` (configs), `exercise-3.md`
- [ ] All code compiles with appropriate config
- [ ] Explanations are clear
- [ ] I understand the "why" behind each setting

---

## 💡 Tips

- **Exercise 1:** Strict mode is your safety net
- **Exercise 2:** Different projects need different configs
- **Exercise 3:** Error codes are meaningful - understand them!
- **Reference Day 5 lesson** - All these topics are explained there

---

## 🎉 Master compiler configuration!

Complete Exercise 1 minimum! 🚀
