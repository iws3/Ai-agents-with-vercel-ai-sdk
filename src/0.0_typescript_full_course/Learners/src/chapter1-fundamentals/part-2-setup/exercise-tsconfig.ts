/**
 * Chapter 1, Part 2: Understanding tsconfig.json
 * 
 * This exercise shows how different tsconfig.json settings affect compilation
 */

// EXERCISE 1: Strict mode benefits
// Uncomment each line and see what error TypeScript shows

// const user: { name: string; age: number } = { name: "Alice" };
// Error: missing age property when strict: true

// EXERCISE 2: Implicit any detection
// function processData(input) {  // ERROR: noImplicitAny: true
//   return input.toUpperCase();
// }

// EXERCISE 3: Null/undefined handling
// const username: string = null;  // ERROR: strictNullChecks: true
// const email: string | null = null;  // OK

// EXERCISE 4: Function parameter strictness
// function createUser(name: string, email?: string) {
//   console.log(name);  // OK - always string
//   console.log(email.toLowerCase());  // ERROR: email could be undefined
//   console.log(email?.toLowerCase());  // OK - optional chaining
// }

// CHALLENGE: Fix this code to compile without errors
interface User {
  id: number;
  name: string;
  email: string;
}

function validateUser(user: User): boolean {  // TODO: Add proper type
  // TODO: Check that user has id, name, and email
  // TODO: Check that id is a number, name and email are strings
  return true;
}

export {};
