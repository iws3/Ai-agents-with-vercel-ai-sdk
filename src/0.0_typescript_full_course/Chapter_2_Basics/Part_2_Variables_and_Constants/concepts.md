# Part 2: Variables and Constants (Beginner Deep Dive)

## 🎯 Learning Objectives

After this part, you'll understand:
- Difference between `const`, `let`, and `var` and when each applies
- When to use each declaration keyword and why (const by default!)
- What immutability really means (reference vs value mutation)
- Scope and where variables are accessible (block, function, global)
- Best practices for variable declaration and naming conventions
- TypeScript type inference with variables
- The Temporal Dead Zone and why it matters
- Memory and performance implications of variable choices
- Accessing variables across different scope levels

---

## 📝 Key Terms

- **const**: Prevents reassignment (immutable reference, not value)
- **let**: Allows reassignment (mutable)
- **var**: Legacy declaration (avoid in modern code)
- **Immutability**: Can't be changed after assignment
- **Scope**: The area of code where a variable is accessible
- **Block Scope**: Scope limited to `{}` blocks
- **Temporal Dead Zone**: Period before variable is declared

---

## 🎯 const vs let vs var

### The Modern Rule: const by Default

```typescript
// ✅ BEST: Use const for everything that doesn't need to change
const greeting = "Hello";
const port = 3000;
const people = ["Alice", "Bob"];

// ✅ OK: Use let only when reassignment is needed
let count = 0;
count = 1;     // Reassigning is OK
count++;

// ❌ NEVER: Avoid var entirely
var oldStyle = "Don't use";  // Ignore this!
```

**The modern motto:**
1. **Default to `const`** - Most variables won't change
2. **Fallback to `let`** - When reassignment is genuinely needed
3. **Never `var`** - Confusing scoping and other issues

---

## 🔒 Understanding const

`const` is NOT about immutability of values—it's about preventing reassignment:

### Primitive Values (Cannot Change)

```typescript
const username = "alice";
username = "bob";          // ❌ ERROR: Can't reassign

const age = 30;
age = 31;                  // ❌ ERROR: Can't reassign

const active = true;
active = false;            // ❌ ERROR: Can't reassign
```

### Objects (Can Mutate, Can't Reassign)

```typescript
const user = { name: "Alice", age: 30 };

// ✅ OK - Changing properties IS allowed
user.age = 31;
user.name = "Alicia";
user.email = "alice@example.com";  // Adding new property

// ❌ ERROR - Reassigning the variable is NOT allowed
user = { name: "Bob", age: 25 };
user = null;
```

### Arrays (Can Mutate, Can't Reassign)

```typescript
const items = [1, 2, 3];

// ✅ OK - Modifying array contents IS allowed
items.push(4);             // [1, 2, 3, 4]
items[0] = 10;             // [10, 2, 3, 4]
items.pop();               // [10, 2, 3]
items.splice(1, 1);        // [10, 3]

// ❌ ERROR - Reassigning the variable is NOT allowed
items = [5, 6, 7];
items = null;
```

**Key insight:** `const` means "this variable binding never changes," not "this value never changes."

For true immutability:

```typescript
// ✅ If you want truly immutable objects
const user = { readonly name: "Alice" };  // readonly prevents mutation

// ✅ Or use Object.freeze()
const config = Object.freeze({ apiUrl: "https://api.example.com" });
config.apiUrl = "https://...";  // ❌ ERROR: property is frozen
```

---

## 🔄 Understanding let

`let` allows reassignment and has block scope:

```typescript
let count = 0;
count = 1;             // ✅ OK - Reassign
count++;               // ✅ OK - Increment
count += 5;            // ✅ OK - Modify

let isActive = true;
isActive = false;      // ✅ OK - Change value
isActive = true;       // ✅ OK - Change again
```

**When to use `let`:**
- Loop counters
- Accumulating values
- State that changes
- Temporary calculations

```typescript
// Loop counter - naturally changes
let sum = 0;
for (let i = 0; i < 10; i++) {
  sum += i;  // Both sum and i change
}

// Status tracking
let status = "pending";
status = "loading";
status = "complete";
```

---

## ❌ Why Not var?

`var` has confusing scoping that leads to bugs:

### Hoisting Issues

```typescript
// With var - hoisted to top (confusing!)
console.log(x);  // undefined (not an error!)
var x = 5;

// With let - causes error (clearer!)
console.log(y);  // ❌ ERROR: y is not defined
let y = 5;
```

### Function Scope vs Block Scope

```typescript
if (true) {
  var confusing = "I'm function-scoped!";
  let clear = "I'm block-scoped!";
}

console.log(confusing);  // ✅ Accessible! (surprising!)
console.log(clear);      // ❌ ERROR: not defined (expected!)
```

### Accidental Redeclaration

```typescript
var x = 1;
var x = 2;  // ✅ Allowed! (probably a bug)
var x = 3;  // ✅ Allowed! (probably a bug)

let y = 1;
let y = 2;  // ❌ ERROR: already declared (catches mistake!)
```

**Bottom line:** `var` is legacy. Use `const`/`let` in modern code.

---

## ⏳ Understanding the Temporal Dead Zone

The **Temporal Dead Zone (TDZ)** is a unique JavaScript feature where variables declared with `let` and `const` cannot be accessed before their declaration. This is different from `var` (which has hoisting).

### How It Works

Variables are created in two phases:

1. **Hoisting Phase**: JavaScript scans the code and "reserves" the variable
2. **Initialization Phase**: The variable is assigned a value

**With `var`:** Hoisted variables are *initialized* to `undefined`
**With `let`/`const`:** Hoisted variables are *not initialized* (TDZ!)

```typescript
// TDZ starts here
console.log(x);  // ❌ ERROR: ReferenceError
let x = 5;       // TDZ ends here, x is initialized
console.log(x);  // ✅ OK: 5
```

### Real-World Examples of TDZ Issues

```typescript
// ❌ COMMON MISTAKE - Using variable before it's declared
function processData(data: any) {
  if (data.id) {
    console.log(result);  // ❌ ERROR: result is in TDZ!
  }
  let result = "processed";  // TDZ ends here
}

// ✅ CORRECT - Declare at start
function processData(data: any) {
  let result: string;  // TDZ ends here (even without value)
  
  if (data.id) {
    console.log(result);  // ✅ OK - declared, might be undefined
  }
  result = "processed";
}
```

### TDZ with Loops

```typescript
// ❌ Loop variable is in TDZ until declaration
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    // When callback runs, i is captured
    // TDZ is already past - i is accessible
    console.log(i);  // ✅ Works: 0, 1, 2
  }, 100);
}

// Compare with var (no TDZ)
for (var j = 0; j < 3; j++) {
  setTimeout(() => {
    console.log(j);  // All print: 2, 2, 2 (due to var hoisting)
  }, 100);
}
```

### Why TDZ Exists

**Benefits:**
- ✅ Prevents accidental use of undefined variables
- ✅ Forces declaration before use
- ✅ Makes bugs obvious immediately
- ✅ Encourages good coding practices

**Analogy:** Like reserving seats at a theater - the seat exists (hoisted) but you can't sit in it until it's properly set up (initialized).

---

## 📍 Scope: Where Variables Exist

Scope defines visibility and lifetime of variables:

### Global Scope

```typescript
const GLOBAL_CONSTANT = "Accessible everywhere";

function demo() {
  console.log(GLOBAL_CONSTANT);  // ✅ Can access
}

if (true) {
  console.log(GLOBAL_CONSTANT);  // ✅ Can access
}
```

### Function Scope

```typescript
function myFunction() {
  const localVar = "Only in this function";
  console.log(localVar);  // ✅ Can access
}

console.log(localVar);    // ❌ ERROR: not in scope
```

### Block Scope (let/const)

```typescript
// if block
if (true) {
  const blockVar = "Only in this block";
  console.log(blockVar);  // ✅ OK
}
console.log(blockVar);    // ❌ ERROR

// for loop block
for (let i = 0; i < 3; i++) {
  console.log(i);  // ✅ OK (0, 1, 2)
}
console.log(i);    // ❌ ERROR: i not in scope

// while loop block
while (true) {
  const temp = "Only in this block";
  break;
}
console.log(temp);  // ❌ ERROR
```

### Nested Scopes

```typescript
const outer = "Can be accessed from inner";

function outer_function() {
  const func_level = "Can be accessed from inner blocks";

  if (true) {
    const block_level = "Only in this block";
    console.log(outer);          // ✅ Outer scope
    console.log(func_level);     // ✅ Function scope
    console.log(block_level);    // ✅ Block scope
  }

  console.log(block_level);      // ❌ ERROR: Not in function scope
}

console.log(func_level);         // ❌ ERROR: Function scope is private
```

---

## 🔮 Type Inference with Variables

TypeScript automatically determines variable types:

```typescript
// TypeScript infers: string
const greeting = "Hello";

// TypeScript infers: number
const count = 42;

// TypeScript infers: boolean
const isActive = true;

// TypeScript infers: string[]
const names = ["Alice", "Bob", "Charlie"];

// TypeScript infers: { name: string; age: number }
const user = { name: "Alice", age: 30 };
```

You can also explicitly annotate:

```typescript
// Explicit - Usually not needed (inference is fine)
const greeting: string = "Hello";
const count: number = 42;

// Where explicit helps - ambiguous types
const items: (string | number)[] = [1, "two", 3];
const maybe: string | null = null;
```

---

## 🌟 Best Practices

### ✅ GOOD: const First Approach

```typescript
// Constants at top
const API_URL = "https://api.example.com";
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

// State that changes
let retries = 0;
let currentUser = null;

// Use const for unchanging references
const user = { name: "Alice", age: 30 };
user.age = 31;  // ✅ Mutation OK, reassignment not OK
```

### ✅ GOOD: Minimize Scope

```typescript
function process(items: string[]) {
  // Results only needed in if block
  if (items.length > 0) {
    const filtered = items.filter(item => item.includes("test"));
    return filtered.length;
  }
  return 0;
}
```

### ❌ BAD: Over-Scoped Variables

```typescript
function process(items: string[]) {
  // filtered not needed until if block
  const filtered = items.filter(item => item.includes("test"));
  
  if (items.length > 0) {
    return filtered.length;
  }
  return 0;
}
```

### ✅ GOOD: Clear Reassignment Pattern

```typescript
let status = "pending";

if (success) {
  status = "completed";
} else {
  status = "failed";
}

console.log(status);  // Clear it changes
```

---

## 📚 Real-World Examples

### Configuration (Multiple const)

```typescript
const DATABASE_URL = "postgres://localhost:5432/mydb";
const JWT_SECRET = "your-secret-key";
const CACHE_TTL = 3600;
const MAX_CONNECTIONS = 50;

// Never changes once defined
```

### Loop with let

```typescript
let total = 0;

for (let i = 0; i < 100; i++) {
  if (i % 2 === 0) {
    total += i;  // Both total and i change
  }
}

console.log(total);  // 2450
```

### State Management

```typescript
let userId = null;
let isLoading = false;

async function loadUser(id: number) {
  isLoading = true;
  try {
    const response = await fetch(`/api/users/${id}`);
    userId = id;
  } finally {
    isLoading = false;
  }
}
```

---

## ⚠️ Common Mistakes

### Mistake 1: Expecting const to Prevent Mutations

```typescript
// ❌ WRONG - Thinking const prevents changes
const user = { name: "Alice", age: 30 };
user.age = 31;         // This works! const doesn't prevent mutations

// ✅ RIGHT - Understand const prevents reassignment
user = { name: "Bob" };  // This fails! const reassignment not allowed
```

### Mistake 2: Using let Unnecessarily

```typescript
// ❌ BAD - Item never changes
let item = "constant value";
console.log(item);

// ✅ GOOD - Use const when value doesn't change
const item = "constant value";
console.log(item);
```

### Mistake 3: Temporal Dead Zone

```typescript
// ❌ ERROR - Using before declaration
console.log(value);         // ERROR: not yet declared
const value = 42;

// ✅ CORRECT - Declare first
const value = 42;
console.log(value);         // ✅ 42
```

### Mistake 4: Mixed const/let Usage

```typescript
// ❌ BAD - Inconsistent and confusing
var x = 1;
let y = 2;
const z = 3;
var a = 4;
let b = 5;

// ✅ GOOD - Consistent approach
const CONSTANT_VALUE = 1;
const API_URL = "https://...";

let counter = 0;
let status = "pending";
```

---

## 📚 Resources

- [const vs let vs var (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [JavaScript Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope)
- [Temporal Dead Zone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone)

---

## ✅ Checklist

- [ ] Know when to use `const` (default choice)
- [ ] Know when to use `let` (when reassignment needed)
- [ ] Understand `const` prevents reassignment, not mutation
- [ ] Understand scope and where variables are accessible
- [ ] Know why `var` is problematic
- [ ] Can predict variable scoping behavior
- [ ] Follow "const by default" principle
- [ ] Keep variables in narrowest possible scope

