# Part 3: Functions and Type Annotations (Beginner Deep Dive)

## 🎯 Learning Objectives

After this part, you'll understand:
- Function syntax and comprehensive type annotations for all parameter types
- Required, optional, and default parameter patterns with trade-offs
- Return types and their importance for API contracts
- Arrow functions vs traditional functions and when each applies
- Real-world function patterns and common use cases
- Best practices, naming conventions, and common mistakes
- `this` binding behavior in different function contexts
- Function types and function composition patterns

---

## 📝 Key Terms

- **Function Signature**: Complete declaration including parameters and return type
- **Parameter**: An input variable to a function
- **Argument**: The actual value passed when calling a function
- **Return Type**: What type a function outputs
- **Arrow Function**: Concise ES6 syntax using `=>`
- **Rest Parameter**: Variable number of arguments as an array
- **Overloading**: Multiple signatures for the same function

> **Beginner Note** 🎓: Annotate function parameters and return types! They're your contract with the code - clear expectations prevent bugs.

---

## 📐 Function Syntax

### Traditional Function Declaration

```typescript
function add(a: number, b: number): number {
  return a + b;
}

add(2, 3);  // Returns 5
```

**Reading the signature:**
- `function` - Keyword to declare a function
- `add` - Function name
- `(a: number, b: number)` - Parameters with types
- `: number` - Return type (what the function outputs)
- `{ return a + b; }` - Function body

### Arrow Function (Modern & Preferred)

```typescript
// Concise - perfect for short functions
const multiply = (a: number, b: number): number => a * b;

multiply(4, 5);  // Returns 20

// Multi-line arrow function
const calculateTotal = (price: number, tax: number): number => {
  const total = price + tax;
  return total;
};
```

**Advantages of arrow functions:**
- More concise syntax
- Modern ES6+ standard
- Better for callbacks and higher-order functions
- Lexically bound `this` (benefits in classes)

### Comparing Syntax

```typescript
// Traditional
function greetTraditional(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow - equivalent
const greetArrow = (name: string): string => `Hello, ${name}!`;

// Arrow - implicit return
const greetArrowImplicit = (name: string): string => `Hello, ${name}!`;

// All work the same!
greetTraditional("Alice");    // "Hello, Alice!"
greetArrow("Alice");          // "Hello, Alice!"
greetArrowImplicit("Alice");  // "Hello, Alice!"
```

---

## 🔄 Return Types: Explicit is Better

Always declare what a function returns. This prevents bugs and documents intent.

### Primitive Return Types

```typescript
// Returns a number
function count(): number {
  return 42;
}

// Returns a string
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Returns a boolean
function isEven(x: number): boolean {
  return x % 2 === 0;
}

// Returns nothing (void)
function logMessage(msg: string): void {
  console.log(msg);
  // No return statement needed
}

// Can return multiple types (union)
function parse(input: string): number | null {
  const parsed = parseInt(input);
  return isNaN(parsed) ? null : parsed;
}
```

### Complex Return Types

```typescript
// Returns an object
interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return { id, name: "Alice" };
}

// Returns an array
function getNumbers(): number[] {
  return [1, 2, 3, 4, 5];
}

// Returns an array of objects
function getUsers(): User[] {
  return [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ];
}

// Returns a Promise (async)
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Returns a function (higher-order function)
function makeMultiplier(factor: number): (x: number) => number {
  return (x: number) => x * factor;
}

const double = makeMultiplier(2);
console.log(double(5));  // 10
```

---

## 📥 Parameters: Different Variations

### Required Parameters

Every parameter must have a corresponding argument:

```typescript
function introduce(name: string, age: number): string {
  return `I'm ${name}, age ${age}`;
}

introduce("Alice", 30);     // ✅ OK
introduce("Bob");           // ❌ ERROR: missing age parameter
introduce("Charlie", "30"); // ❌ ERROR: age must be number, not string
```

**Best practice**: List required parameters first.

### Optional Parameters

Use `?` to make a parameter optional:

```typescript
function greet(name: string, nickname?: string): string {
  if (nickname) {
    return `Hello, ${name} (${nickname})!`;
  }
  return `Hello, ${name}!`;
}

greet("Alice");              // ✅ OK - "Hello, Alice!"
greet("Alice", "Ali");       // ✅ OK - "Hello, Alice (Ali)!"
greet("Bob", undefined);     // ✅ OK - "Hello, Bob!"
```

### Default Parameters

Provide a default value when argument not supplied:

```typescript
function introduce(
  name: string,
  greeting: string = "Hello",
  punctuation: string = "!"
): string {
  return `${greeting}, ${name}${punctuation}`;
}

introduce("Alice");                          // "Hello, Alice!"
introduce("Bob", "Hi");                      // "Hi, Bob!"
introduce("Charlie", "Hey", "...");         // "Hey, Charlie..."
```

### Rest Parameters

Collect remaining arguments into an array:

```typescript
// Sum any number of arguments
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3);           // 6
sum(10, 20, 30, 40);    // 100
sum();                  // 0 (empty array)

// Combine regular and rest parameters
function buildMessage(prefix: string, ...words: string[]): string {
  return `${prefix}: ${words.join(", ")}`;
}

buildMessage("Topics", "TypeScript", "React", "Node.js");
// "Topics: TypeScript, React, Node.js"
```

### Destructured Parameters

Extract properties directly in parameter list:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Traditional
function printUser(user: User): void {
  console.log(user.id, user.name, user.email);
}

// Destructured (cleaner!)
function printUserDestructured({ id, name, email }: User): void {
  console.log(id, name, email);
}

// With defaults
function printUserWithDefaults(
  { id, name, email = "unknown@example.com" }: User
): void {
  console.log(id, name, email);
}

// Only use specific properties
function printUserName({ name }: User): void {
  console.log(name);
}
```

---

## 💪 Advanced Function Patterns

### Callback Functions

Functions that accept other functions as parameters:

```typescript
// Type for a callback function
type Callback = (result: number) => void;

function fetchData(onSuccess: Callback, onError: (msg: string) => void): void {
  try {
    const result = 42;
    onSuccess(result);
  } catch (error) {
    onError("Failed!");
  }
}

// Usage
fetchData(
  (result) => console.log("Success:", result),
  (error) => console.log("Error:", error)
);
```

### Higher-Order Functions

Functions that return other functions:

```typescript
// Create a function that multiplies
function makeMultiplier(factor: number): (x: number) => number {
  return (x: number): number => x * factor;
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Create a decorator
function logExecution(fn: (x: number) => number): (x: number) => number {
  return (x: number): number => {
    console.log(`Calling with ${x}`);
    const result = fn(x);
    console.log(`Result: ${result}`);
    return result;
  };
}

const loggedDouble = logExecution(double);
loggedDouble(5);  // Logs: "Calling with 5", "Result: 10"
```

### Method on Objects

Functions that operate on object context:

```typescript
const calculator = {
  value: 0,
  
  add(n: number): void {
    this.value += n;
  },
  
  multiply(n: number): void {
    this.value *= n;
  },
  
  getValue(): number {
    return this.value;
  }
};

calculator.add(5);        // value: 5
calculator.multiply(2);   // value: 10
console.log(calculator.getValue());  // 10
```

---

## 🎯 Understanding `this` Binding

The `this` keyword behaves differently depending on how a function is called. This is a common source of confusion!

### Traditional Functions: Dynamic `this`

In traditional functions, `this` depends on **how the function is called**:

```typescript
class User {
  name: string = "Alice";
  
  // Traditional function - this depends on caller
  greetTraditional() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

const user = new User();
user.greetTraditional();  // ✅ "Hello, I'm Alice" (this = user)

// But if you pass the method around:
const method = user.greetTraditional;
method();  // ❌ "Hello, I'm undefined" (this = undefined/global)

// This is why arrow functions are often better!
```

### Arrow Functions: Lexical `this`

Arrow functions capture `this` from their surrounding scope (lexical binding):

```typescript
class User {
  name: string = "Alice";
  
  // Arrow function - this never changes
  greetArrow = () => {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const user = new User();
user.greetArrow();  // ✅ "Hello, I'm Alice"

// Even if passed around:
const method = user.greetArrow;
method();  // ✅ Still "Hello, I'm Alice"! (this is captured)
```

### Practical Impact: Event Handlers

This difference matters in React and event handling:

```typescript
class Button {
  state: string = "Click me";
  
  // ❌ PROBLEM - this is lost in event handler
  onClickTraditional() {
    this.state = "Clicked";  // this might be undefined!
  }
  
  // ✅ SOLUTION - arrow function preserves this
  onClickArrow = () => {
    this.state = "Clicked";  // this is always the Button instance
  };
}

// In React:
<button onClick={button.onClickTraditional}>Wrong</button>
<button onClick={button.onClickArrow}>Correct</button>
```

### Summary

| Aspect | Traditional Function | Arrow Function |
|--------|---------------------|-----------------|
| **`this` binding** | Dynamic (call-site dependent) | Lexical (captured from scope) |
| **Use as method** | Requires binding | Perfect |
| **Use as callback** | Risky without binding | Safe |
| **Conciseness** | More verbose | More concise |
| **Use in classes** | Need `.bind()` or workarounds | Preferred |

---

## 🏷️ Function Types

Functions themselves have types! You can assign function types to variables:

### Function Type Syntax

```typescript
// Type for a function that takes two numbers and returns a number
type Add = (a: number, b: number) => number;

const add: Add = (x, y) => x + y;
const subtract: Add = function(x, y) {
  return x - y;
};

add(5, 3);          // 8
subtract(10, 4);    // 6
```

### Function Types with Different Signatures

```typescript
// Function that returns nothing
type Logger = (message: string) => void;

const consolelog: Logger = (msg) => console.log(msg);
const fileLog: Logger = (msg) => writeToFile(msg);

// Function that takes no parameters
type Generator = () => string;

const greet: Generator = () => "Hello";

// Function with complex parameters
type Transform = (data: string[], options: { uppercase?: boolean }) => string[];

const transform: Transform = (data, options) => {
  return options.uppercase ? data.map(d => d.toUpperCase()) : data;
};

// Function that returns a function
type Multiplier = (factor: number) => (x: number) => number;

const makeMultiplier: Multiplier = (factor) => (x) => x * factor;
const double = makeMultiplier(2);
double(5);  // 10
```

### Function Types in Collections

```typescript
// Array of functions
const handlers: Array<(event: string) => void> = [
  (event) => console.log(event),
  (event) => sendToServer(event),
  (event) => updateUI(event)
];

// Run all handlers
handlers.forEach(handler => handler("user clicked"));

// Dictionary of functions
type Operators = {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
  multiply: (a: number, b: number) => number;
};

const calculator: Operators = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b
};

calculator.add(5, 3);  // 8
```

---

## 🎯 Real-World Examples

### E-Commerce: Calculate Discount

```typescript
function applyDiscount(
  price: number,
  discountPercent: number = 10
): number {
  const discountAmount = (price * discountPercent) / 100;
  return price - discountAmount;
}

applyDiscount(100);        // 90 (10% off - default)
applyDiscount(100, 20);    // 80 (20% off)
applyDiscount(50, 0);      // 50 (no discount)
```

### Validation: Check Inputs

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email.includes("@")) {
    errors.push("Email must contain @");
  }
  
  if (email.split("@")[0].length < 1) {
    errors.push("Email must have a local part");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

const result = validateEmail("invalid");
if (!result.isValid) {
  console.log("Validation errors:", result.errors);
}
```

### API: Fetch with Retry

```typescript
async function fetchWithRetry(
  url: string,
  maxRetries: number = 3
): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed after retries");
}

const response = await fetchWithRetry("https://api.example.com/data");
```

### React: Component Props Handler

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

function Button({
  label,
  onClick,
  disabled = false,
  variant = "primary"
}: ButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Not Annotating Parameters

```typescript
// ❌ BAD - TypeScript can't help, type is 'any'
function add(a, b) {
  return a + b;
}

add("5", 10);  // Returns "510" - probably not intended!

// ✅ GOOD - TypeScript catches error
function add(a: number, b: number): number {
  return a + b;
}

add("5", 10);  // ❌ ERROR: "5" is not assignable to number
```

### Pitfall 2: Implicit Return Type

```typescript
// ❌ RISKY - Return type not explicit
function processData(x: number) {
  const result = x * 2;
  return result;  // Inferred as number, but easy to change accidentally
}

// ✅ SAFE - Return type explicit
function processData(x: number): number {
  const result = x * 2;
  return result;
}
```

### Pitfall 3: Confusing Optional with Default

```typescript
// ❌ CONFUSING
function greet(name?: string = "Guest"): string {
  return `Hello, ${name}`;
}

// ✅ CLEAR - Use default only
function greet(name: string = "Guest"): string {
  return `Hello, ${name}`;
}
```

### Pitfall 4: Forgetting Rest Parameter is an Array

```typescript
// ❌ WRONG - Rest param is an array
function sum(...numbers: number): number {
  return numbers.reduce((a, b) => a + b, 0);  // ❌ ERROR
}

// ✅ CORRECT
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
```

---

## 🏆 Best Practices

1. **Always annotate parameters** - no ambiguity
2. **Always specify return types** - documents intent
3. **Use arrow functions** - modern standard
4. **Parameters before return type** - left-to-right reading
5. **Document complex functions** - JSDoc comments
6. **Keep functions focused** - one responsibility
7. **Use defaults wisely** - simpler than optional parameters
8. **Destructure object parameters** - cleaner code
9. **Use arrow functions in classes** - preserves `this` binding
10. **Prefer function types for callbacks** - clear contracts

---

## 📚 Function Composition Patterns

**Function composition** means combining functions to create new functionality:

### Simple Composition

```typescript
// Individual functions
function double(x: number): number {
  return x * 2;
}

function addTen(x: number): number {
  return x + 10;
}

// Manual composition
function compose(x: number): number {
  return addTen(double(x));
}

console.log(compose(5));  // addTen(double(5)) = addTen(10) = 20

// Reusable composer
function composeTwo<T>(
  f: (x: T) => T,
  g: (x: T) => T
): (x: T) => T {
  return (x: T) => g(f(x));
}

const doubleAndAddTen = composeTwo(double, addTen);
console.log(doubleAndAddTen(5));  // 20
```

### Pipeline Pattern

```typescript
// Process data through a series of functions
type Pipeline<T> = (value: T) => T;

function createPipeline<T>(functions: Pipeline<T>[]): Pipeline<T> {
  return (value: T): T => {
    return functions.reduce((acc, fn) => fn(acc), value);
  };
}

// Usage
interface User {
  name: string;
  email: string;
  age: number;
}

const validateUser: Pipeline<User | null> = (user) => {
  if (!user || !user.email) return null;
  return user;
};

const normalizeEmail: Pipeline<User | null> = (user) => {
  if (!user) return null;
  return { ...user, email: user.email.toLowerCase() };
};

const filterMinors: Pipeline<User | null> = (user) => {
  if (!user || user.age < 18) return null;
  return user;
};

const userPipeline = createPipeline([
  validateUser,
  normalizeEmail,
  filterMinors
]);

const result = userPipeline({ name: "Alice", email: "ALICE@EXAMPLE.COM", age: 25 });
// Returns valid user with lowercase email
```

---

## ✅ Checklist

- [ ] Understand function syntax
- [ ] Know how to annotate parameters
- [ ] Can specify return types
- [ ] Understand optional vs default
- [ ] Know rest parameter syntax
- [ ] Can use arrow functions
- [ ] Understand callback functions
- [ ] Comfortable with real-world patterns
- [ ] Aware of common pitfalls

