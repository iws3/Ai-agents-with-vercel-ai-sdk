# TypeScript Security Patterns & Type Safety for Security

Comprehensive guide to using TypeScript's type system for secure code.

## Learning Objectives

- Prevent injection attacks with types
- Validate inputs safely
- Handle secrets securely
- Implement role-based access control
- Use types for security enforcement

---

## Part 1: Input Validation with Types

### Branded Types for Safety

```typescript
// Create types that represent validated data
type ValidatedEmail = string & { readonly __brand: "ValidatedEmail" };
type PositiveNumber = number & { readonly __brand: "PositiveNumber" };

function validateEmail(email: string): ValidatedEmail {
  if (!/^.+@.+\..+$/.test(email)) {
    throw new Error("Invalid email");
  }
  return email as ValidatedEmail;
}

function validatePositive(num: number): PositiveNumber {
  if (num <= 0) {
    throw new Error("Must be positive");
  }
  return num as PositiveNumber;
}

// Usage forces validation
function sendEmail(to: ValidatedEmail, count: PositiveNumber): void {
  // Guaranteed safe at compile time
}

const email = validateEmail("user@example.com");
const positive = validatePositive(42);

sendEmail(email, positive);  // OK
// sendEmail("raw@input.com", 10);  // Error!
```

### Zod for Runtime Validation

```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().min(0).max(150),
  role: z.enum(["admin", "user", "guest"])
});

type User = z.infer<typeof UserSchema>;

function processUser(data: unknown): User {
  return UserSchema.parse(data);
}

// Throws if invalid
try {
  processUser({ id: "invalid", email: "test", age: 999 });
} catch (e) {
  console.error("Validation failed");
}
```

---

## Part 2: Role-Based Access Control

```typescript
// Admin role can do more than User role
type AdminRole = "admin";
type UserRole = "user";
type GuestRole = "guest";

type Role = AdminRole | UserRole | GuestRole;

// Permissions tied to roles at type level
type AdminPermissions = "read" | "write" | "delete" | "admin";
type UserPermissions = "read" | "write";
type GuestPermissions = "read";

interface User {
  id: string;
  role: Role;
}

interface PermissionContext {
  user: User;
}

function requireAdmin(ctx: PermissionContext): ctx is PermissionContext & { user: { role: "admin" } } {
  return ctx.user.role === "admin";
}

function deleteResource(ctx: PermissionContext, resourceId: string): void {
  if (!requireAdmin(ctx)) {
    throw new Error("Unauthorized");
  }
  // Safe: admins only
  console.log(`Deleted ${resourceId}`);
}

const user: User = { id: "123", role: "user" };
const admin: User = { id: "456", role: "admin" };

deleteResource({ user }, "resource-1");   // Runtime error
deleteResource({ user: admin }, "resource-1");  // OK
```

---

## Part 3: Secure State Management

```typescript
// Secrets never leaked in types
class SecretValue<T> {
  private value: T;
  private accessed: boolean = false;

  constructor(value: T) {
    this.value = value;
  }

  // Only allows one read
  getValue(): T {
    if (this.accessed) {
      throw new Error("Secret already accessed");
    }
    this.accessed = true;
    return this.value;
  }

  // Never logs or stringifies the secret
  toString(): string {
    return "[SECRET]";
  }
}

const apiKey = new SecretValue("sk_live_abcd1234");

const key = apiKey.getValue();  // OK
// const key2 = apiKey.getValue();  // Error: already accessed

console.log(apiKey);  // [SECRET] - safe
```

---

## Part 4: SQL Injection Prevention

```typescript
// Create types for SQL queries
type SafeSQL = string & { readonly __safe: true };

function sql(strings: TemplateStringsArray, ...values: any[]): SafeSQL {
  let result = strings[0];
  
  for (let i = 0; i < values.length; i++) {
    const param = Array.isArray(values[i])
      ? values[i].map(() => "?").join(",")
      : "?";
    
    result += param + strings[i + 1];
  }
  
  return result as SafeSQL;
}

// Safe: parameterized queries
const query = sql`SELECT * FROM users WHERE id = ${"123"} AND active = ${true}`;

// Unsafe: string concatenation
// const unsafeQuery = `SELECT * FROM users WHERE id = '123'`;
// Connection to DB that only accepts SafeSQL
function execute(q: SafeSQL): void {
  console.log(`Executing: ${q}`);
}

execute(query);  // OK
// execute(`SELECT * FROM users`);  // Error: not SafeSQL
```

---

## Part 5: Cryptographic Operations

```typescript
// Type-safe wrapper for crypto
interface CryptoKey {
  algorithm: "AES" | "RSA";
  keySize: number;
}

async function encrypt(key: CryptoKey, data: string): Promise<string> {
  if (key.keySize < 256) {
    throw new Error("Key too weak");
  }
  // Implementation
  return Buffer.from(data).toString("base64");
}

async function decrypt(key: CryptoKey, encrypted: string): Promise<string> {
  if (key.keySize < 256) {
    throw new Error("Key too weak");
  }
  return Buffer.from(encrypted, "base64").toString();
}

// At type level, key requirements are obvious
const weakKey: CryptoKey = { algorithm: "AES", keySize: 128 };
const strongKey: CryptoKey = { algorithm: "AES", keySize: 256 };

await encrypt(strongKey, "secret");  // OK
// await encrypt(weakKey, "secret");  // Still runs but type doc shows issue
```

---

## Part 6: Audit Logging

```typescript
// Record what security operations occurred
interface AuditLog {
  timestamp: Date;
  action: "login" | "logout" | "delete" | "modify";
  userId: string;
  resourceId?: string;
  success: boolean;
  reason?: string;
}

class AuditLogger {
  private logs: AuditLog[] = [];

  log(entry: AuditLog): void {
    this.logs.push(entry);
    // Send to secure logging system
  }

  getLoginAttempts(userId: string): AuditLog[] {
    return this.logs.filter(l => l.userId === userId && l.action === "login");
  }
}

const logger = new AuditLogger();

logger.log({
  timestamp: new Date(),
  action: "delete",
  userId: "user-123",
  resourceId: "resource-456",
  success: true
});
```

---

## Checklist

- [ ] Use branded types for validated data
- [ ] Implement input validation
- [ ] Create role-based access controls
- [ ] Use parameterized queries
- [ ] Handle secrets securely
- [ ] Audit important operations
- [ ] Never log sensitive data
