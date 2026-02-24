# Chapter 1: Complete Glossary of Terms

## Core Concepts

### TypeScript
The primary language this course teaches. A superset of JavaScript that adds static typing, allowing type checking before code runs. Created by Microsoft in 2012.

### Compilation
The process of converting TypeScript code into JavaScript. The TypeScript compiler (tsc) reads .ts files and outputs .js files with all type information removed.

### Type Safety / Static Typing
The ability to verify that operations are valid for their operand types BEFORE code runs. For example, you can't add a string to a number - TypeScript catches this during compilation.

### Type Annotation
An explicit statement of what type a variable, parameter, or return value should have. Example: `const age: number = 25;`

### Type Inference
TypeScript's ability to automatically determine types without explicit annotations. Example: `const age = 25;` - TypeScript knows age is a number.

### Superset
A set that contains all elements of another set plus additional elements. TypeScript is a superset of JavaScript because it includes all JavaScript plus additional features like type annotations.

### Runtime vs Compile-time
- **Compile-time**: When TypeScript compiler checks your code (before execution)
- **Runtime**: When JavaScript code actually runs in browser or Node.js

### Type Erasure
The process of removing all type information during compilation. At runtime, JavaScript has no knowledge of TypeScript types - they exist only during development.

### Interface
A TypeScript construct defining the shape of an object. Specifies what properties and methods an object must have.

## Development Tools

### Node.js
JavaScript runtime that allows you to run JavaScript outside browsers. Essential for development and server-side code.

### npm (Node Package Manager)
Package manager for JavaScript/Node.js. Used to install dependencies, run scripts, and manage project metadata.

### TypeScript Compiler (tsc)
Command-line tool that compiles TypeScript to JavaScript. Run with: `npx tsc`

### tsconfig.json
Configuration file telling TypeScript compiler how to compile your project. Specifies target JavaScript version, strict checking level, output directory, etc.

### IDE (Integrated Development Environment)
Code editor like VS Code. With TypeScript, IDEs provide autocomplete, error checking, and navigation features.

## JavaScript Concepts

### Function
Reusable block of code that performs a task. In TypeScript, functions can have explicit parameter and return types.

### Variable
Named container for a value. In TypeScript, variables can have explicit types: `let name: string;`

### Object
Container for related data and functionality. In TypeScript, objects can have interfaces defining their structure.

### Array
Ordered list of values. TypeScript allows specifying element type: `let numbers: number[] = [1, 2, 3];`

### Class
Blueprint for creating objects. Can have properties, methods, and inheritance.

## Advanced Concepts

### Generic / Generic Type
Placeholder for a type to be specified later. Allows writing reusable code that works with multiple types. Example: `function identity<T>(value: T): T { return value; }`

### Type Variable
Placeholder in a generic representing a type. Usually written as `<T>`, `<U>`, `<K>`. The actual type is determined when the generic is used.

### Union Type
A type that can be one of several types. Example: `let id: number | string;` - id can be number OR string.

### Intersection Type
A type combining multiple types. Example: `type Combined = User & Admin;` - must have properties of both User and Admin.

### Literal Type
A type representing a specific value rather than a category of values. Example: `type Status = "pending" | "approved" | "rejected";`

### Constraint
A limitation on what types a generic can accept. Example: `<T extends { length: number }>` - T must have a length property.

### Type Guard
Code that checks a value's type at runtime. Example: `if (typeof value === "string") { ... }`

### Any
A type representing absolutely any value. Bypasses all type checking. Using `any` defeats purpose of TypeScript - avoid it!

## Common Errors

### Type Error
When a value is used in a way that doesn't match its declared type. Example: `const x: number = "hello";` - string not assignable to number.

### Implicit Any
When TypeScript can't infer a type and treats it as `any`. Usually an error. Enable `noImplicitAny` in tsconfig.json to prevent.

### Null/Undefined Error
In strict mode, accessing properties on null or undefined values is caught. Example: `const name = null; console.log(name.length);` - error.

### Missing Property
When code tries to access a property that doesn't exist on a type. Example: `const user: User = {...}; console.log(user.email);` - if User doesn't have email property, error.

## Best Practices Terminology

### DRY Principle
"Don't Repeat Yourself" - avoid duplicating code. Generics and types help by letting you write reusable code.

### SOLID Principles
Set of design principles for maintainable code. TypeScript's type system helps enforce these.

### Type-Driven Development
Designing programs by thinking about types first, then implementing logic. Opposite of dynamic typing approach.

### Strict Mode
Configuration option enabling all strict type checking. Recommended for new projects as it catches more errors.
- `strict: true` enables all strict options
- `noImplicitAny`: error on implicit any
- `strictNullChecks`: must explicitly handle null/undefined
- `strictFunctionTypes`: strict function type checking
- And others...

