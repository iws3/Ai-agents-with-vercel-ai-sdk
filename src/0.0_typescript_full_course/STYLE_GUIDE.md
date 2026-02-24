# TypeScript Style Guide

Consistent code style makes projects maintainable and professional.

---

## Naming Conventions

### Variables & Constants

```typescript
// ✅ camelCase for variables
const userName = "Alice";
const numberOfItems = 42;

// ✅ UPPER_SNAKE_CASE for constants
const MAX_RETRIES = 3;
const API_VERSION = "v1";
const CONFIG = { apiUrl: "..." };

// ❌ Avoid
const user_name = "Alice";  // snake_case
const UserName = "Alice";   // PascalCase
```

### Functions & Methods

```typescript
// ✅ camelCase starting with verb
function getUserById(id: number): User { }
function handleClick(): void { }
function validateEmail(email: string): boolean { }

// ❌ Avoid
function get_user_by_id(id: number): User { }
function GetUserById(id: number): User { }
```

### Classes & Interfaces

```typescript
// ✅ PascalCase for classes
class UserManager { }
class DatabaseConnection { }

// ✅ PascalCase for interfaces
interface User { }
interface ApiResponse<T> { }

// ✅ I or other prefix optional for interfaces (matter of style)
interface IUserService { }  // Or without I

// ❌ Avoid
class user_manager { }
interface user { }
```

### Enums & Types

```typescript
// ✅ PascalCase
enum Status {
  Active = "active",
  Inactive = "inactive"
}

type Direction = "north" | "south" | "east" | "west";

// ❌ Avoid
enum status { }
type direction = "north" | "south";
```

### Booleans

```typescript
// ✅ Start with "is", "has", "can", "should"
const isActive: boolean = true;
const hasPermission: boolean = false;
const canDelete: boolean = true;
const shouldRetry: boolean = true;

// ❌ Avoid
const active: boolean = true;
const permission: boolean = false;
const delete: boolean = true;  // Also avoid - 'delete' is keyword!
```

---

## File Organization

### Arrange Code in This Order

```typescript
// 1. Imports
import { something } from ".";
import external from "external-lib";

// 2. Type definitions
type Status = "active" | "inactive";
interface User { }

// 3. Constants
const DEFAULT_PAGE_SIZE = 20;

// 4. Exported functions/classes
export function getData() { }

// 5. Internal functions
function helper() { }

// 6. Exports
export { helper };
```

### File Naming

```typescript
// ✅ Good
types.ts                 // Type definitions
user.ts                  // Single responsible
user-service.ts          // Kebab-case for files
useUserData.ts           // Hook files
Button.tsx               // React component
```

---

## TypeScript Best Practices

### Type Annotations

```typescript
// ✅ Explicit where it matters
function add(a: number, b: number): number {
  return a + b;
}

// ✅ Let TypeScript infer simple cases
const count = 0;  // Inferred: number
const name = "Alice";  // Inferred: string

// ❌ Avoid unnecessary annotations
const obj: object = {};  // Too vague
const value: number = 5;  // Obvious
```

### Interfaces vs Types

```typescript
// ✅ Interface for object shapes
interface User {
  id: number;
  name: string;
}

// ✅ Type for unions and complex types
type Status = "active" | "inactive";
type Result = { success: true; data: string } | { success: false };

// ❌ Don't overuse 'type' for simple objects
type Point = { x: number; y: number };  // Use interface instead
```

### Null & Undefined

```typescript
// ✅ Be explicit about null/undefined
function getName(user: { name: string } | null | undefined): string {
  return user?.name ?? "Unknown";
}

// ❌ Avoid making everything optional
interface User {
  name?: string;  // Ok for some fields
  email?: string;
}
```

---

## Documentation Comments

### Function Documentation

```typescript
/**
 * Fetches user data from the API
 * @param id - The user ID
 * @returns The user object or null if not found
 * @throws Will throw if API request fails
 * @example
 * const user = await getUser(123);
 */
function getUser(id: number): Promise<User | null> {
  //...
}
```

### Class Documentation

```typescript
/**
 * Manages user sessions with persistence
 * @example
 * const manager = new SessionManager();
 * manager.create("token", data);
 */
class SessionManager {
  /**
   * Creates a new session
   * @param token - Session token
   * @param data - Session data
   */
  create(token: string, data: any): void {  }
}
```

---

## Import Organization

### Order Imports

```typescript
// ✅ Organized
// 1. External dependencies
import express from "express";
import { z } from "zod";

// 2. Internal imports
import { User } from "./types";
import { userService } from "./services";

// 3. Relative imports
import { helper } from "../utils";

// ❌ Random order
import { helper } from "../utils";
import express from "express";
import { User } from "./types";
```

### Destructuring

```typescript
// ✅ Clear destructuring
const { id, name } = user;
const { status, data } = response;

// ✅ Rename if needed
const { startDate: from, endDate: to } = dateRange;

// ❌ Too many destructures
const { a, b, c, d, e, f, g, h } = largeObject;
// Better to use direct access or separate lines
```

---

## Formatting with Prettier

### .prettierrc Configuration

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

###Formatting Guidelines

```typescript
// ✅ Line length limit (100 chars)
const result = getUsersFromDatabase()
  .filter(user => user.isActive)
  .map(user => ({ id: user.id, name: user.name }));

// ✅ Spacing
interface User {
  id: number;
  name: string;
}

// ✅ Function formatting
function processData(
  input: string,
  options?: ProcessOptions
): string {
  return input;
}
```

---

## Code Examples

### Good Style ✅

```typescript
/**
 * Validates and saves a user to the database
 */
async function saveUser(user: User): Promise<SaveResult> {
  // Validate
  const validation = validateUser(user);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  // Save
  try {
    const saved = await database.users.create(user);
    return { success: true, data: saved };
  } catch (error) {
    return { success: false, error: "Database error" };
  }
}

interface User {
  name: string;
  email: string;
}

type SaveResult =
  | { success: true; data: User }
  | { success: false; error: string };
```

### Poor Style ❌

```typescript
async function saveUser(u: any) {  // Vague param, any type
  const v = validateUser(u);
  if (!v) {
    return { s: false, e: v };  // Abbreviated keys
  }
  try {
    const d = await database.users.create(u);
    return { s: true, d };
  } catch (e) {
    return { s: false, e: "error" };
  }
}
```

---

## Linting Rules (ESLint)

### Recommended Configuration

```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/explicit-function-return-types": "warn",
    "@typescript-eslint/explicit-member-accessibility": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": "warn"
  }
}
```

---

## Quick Checklist

- [ ] Variables/functions: camelCase
- [ ] Classes/interfaces: PascalCase
- [ ] Constants: UPPER_SNAKE_CASE
- [ ] Booleans: is/has/can/should prefix
- [ ] Imports organized and ordered
- [ ] No `any` without justification
- [ ] Functions have explicit return types  
- [ ] Comments for complex logic
- [ ] File names kebab-case
- [ ] Code passes linter/Prettier

---

