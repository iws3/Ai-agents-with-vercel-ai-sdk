# Part 9: Decorators (Intermediate Deep Dive)

## Learning Objectives

After this part you'll understand:
- Decorator syntax and @decorator notation
- Class, method, property, accessor, and parameter decorators
- Decorator factories for configuration
- Real-world patterns: logging, validation, memoization
- Metadata reflection with reflect-metadata

---

## Key Terms

- **Decorator**: Function that modifies class/method/property behavior
- **Factory Pattern**: Function returning a decorator for configuration
- **Target**: Class or prototype being decorated
- **Descriptor**: Property descriptor (value, writable, configurable)
- **Metadata**: Additional information attached to symbols

---

## Decorator Syntax

Decorators are functions that modify behavior. Enable with `"experimentalDecorators": true` in tsconfig.json:

```typescript
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

## Class Decorators

Modify the entire class:

```typescript
// GOOD: Logging decorator
function logged<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      console.log(`Creating instance of ${constructor.name}`);
    }
  };
}

@logged
class User {
  constructor(public name: string) {}
}

const user = new User("Alice");
// Output: "Creating instance of User"
```

---

## Method Decorators

Modify methods:

```typescript
// GOOD: Timing decorator
function timer(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = original.apply(this, args);
    const elapsed = performance.now() - start;
    console.log(`${key} took ${elapsed}ms`);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @timer
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);
// Output: "add took 0.05ms"
```

---

## Property Decorators

Modify properties:

```typescript
// GOOD: Validation decorator
function required(target: any, key: string) {
  let value: string;
  
  const getter = () => value;
  const setter = (val: string) => {
    if (!val) throw new Error(`${key} is required`);
    value = val;
  };
  
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}

class Form {
  @required
  email: string = "";
}

const form = new Form();
form.email = "";  // Error: "email is required"
```

---

## Decorator Factories

Parameterize decorators:

```typescript
// GOOD: Configurable logging
function log(prefix: string) {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      console.log(`${prefix}: Calling ${key} with`, args);
      return original.apply(this, args);
    };
    
    return descriptor;
  };
}

class Service {
  @log("API")
  fetch(url: string): Promise<any> {
    return Promise.resolve({});
  }
}

const service = new Service();
service.fetch("/api/users");
// Output: "API: Calling fetch with ['/api/users']"
```

---

## Real-World Patterns

### Memoization Decorator

```typescript
function memoize(target: any, key: string, descriptor: PropertyDescriptor) {
  const cache = new Map();
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const cacheKey = JSON.stringify(args);
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    const result = original.apply(this, args);
    cache.set(cacheKey, result);
    return result;
  };
  
  return descriptor;
}

class Math {
  @memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}
```

### Authentication Decorator

```typescript
function requireAuth(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  
  descriptor.value = async function(this: any, ...args: any[]) {
    if (!this.isAuthenticated) {
      throw new Error("Not authenticated");
    }
    return original.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  isAuthenticated = false;
  
  @requireAuth
  async deleteUser(id: string): Promise<void> {
    console.log(`Deleted user ${id}`);
  }
}

const service = new UserService();
await service.deleteUser("123");  // Error: "Not authenticated"
```

---

## Common Pitfalls

BAD: Forgetting experimentalDecorators flag
```typescript
// Error if not enabled in tsconfig.json
@logged
class User {}
```

GOOD: Enable in configuration
```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

BAD: Not preserving `this` context
```typescript
descriptor.value = function(...args: any[]) {
  // Wrong: arrow functions don't preserve this
  const process = () => console.log(this);
};
```

GOOD: Use regular functions for methods
```typescript
descriptor.value = function(...args: any[]) {
  // Correct: regular function preserves this
  original.apply(this, args);
};
```

---

## Best Practices

- **Use sparingly**: Decorators add behavioral magic, reducing code clarity
- **Name descriptively**: `@logged`, `@timer`, `@required` convey intent
- **Document side effects**: Decorators modify behavior, so document what they do
- **Test thoroughly**: Decorated code can have subtle timing issues
- **Consider alternatives**: Plain functions or composition often clearer

---

## Resources

- [TypeScript Handbook: Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [reflect-metadata library](https://github.com/rbuckton/reflect-metadata)

---

## Checklist

- [ ] Understand decorator syntax and @ notation
- [ ] Know class, method, and property decorators
- [ ] Can write decorator factories with parameters
- [ ] Understand real-world patterns (logging, memoization, validation)
- [ ] Know when to use decorators vs alternatives
