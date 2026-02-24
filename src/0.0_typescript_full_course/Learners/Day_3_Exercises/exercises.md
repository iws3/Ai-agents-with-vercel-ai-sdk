# Day 3: How TypeScript Compiles - Exercises

## 📝 Understanding the Compilation Process!

---

## 🟢 Exercise 1: See Type Erasure in Action (Beginner)

**Objective:** Observe how types disappear during compilation.

**Tasks:**
1. Create `src/type-erasure.ts`:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

console.log(user);
```

2. Compile: `npx tsc`
3. Open `dist/type-erasure.js`
4. Compare source and compiled version
5. Document what changed
6. Submit as `exercise-1.md` with:
   - Original TypeScript
   - Compiled JavaScript
   - List of changes
   - Explanation of type erasure

---

## 🟡 Exercise 2: Use Source Maps for Debugging (Intermediate)

**Objective:** Debug TypeScript in browser/debugger using source maps.

**Tasks:**
1. Ensure `tsconfig.json` has `"sourceMap": true`
2. Create `src/with-errors.ts`:
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

function printProduct(product: Product): void {
  console.log(`Product: ${product.name}`);
  console.log(`Price: $${product.price}`);
}

const product: Product = {
  id: 1,
  name: "Laptop",
  price: 999.99
};

printProduct(product);
```

3. Compile: `npx tsc`
4. Check that `.js.map` files are created
5. Debug the compiled code
6. Verify source map shows ORIGINAL TypeScript
7. Submit explanation of how source maps help debugging

---

## 🔴 Exercise 3: Understand Compiler Options (Advanced)

**Objective:** See how different tsconfig settings affect output.

**Tasks:**
1. Create `src/compiler-test.ts`:
```typescript
const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

interface Config {
  readonly debug: boolean;
  readonly timeout?: number;
}

const config: Config = {
  debug: true,
  timeout: 5000
};

console.log(greet("TypeScript"));
```

2. Compile with different `target` values:
   - `target: "ES5"`
   - `target: "ES2015"`
   - `target: "ES2020"`

3. Compare the three `.js` files generated
4. Document the differences
5. Submit analysis of:
   - Smallest output
   - Most readable
   - Best for your use case
   - Why targets matter

---

## 📋 Submission Checklist

- [ ] My folder: `Solutions/YOUR-GITHUB-USERNAME/`
- [ ] Files: `exercise-1.md`, `exercise-2.md`, `exercise-3.md`
- [ ] Code compiles correctly
- [ ] Analysis is detailed
- [ ] I explain the "why," not just the "what"

---

## 💡 Tips

- **Exercise 1:** You'll be amazed how much disappears!
- **Exercise 2:** Source maps are powerful debugging tools
- **Exercise 3:** Different targets = different audience
- **Understand compilation tools** = Better TypeScript developer

---

## 🎉 Share your compilation insights!

Complete at least Exercise 1! 🚀
