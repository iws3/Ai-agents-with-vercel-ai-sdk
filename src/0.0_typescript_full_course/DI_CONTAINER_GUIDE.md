# Dependency Injection Container

## Service Container

```typescript
class Container {
  private services = new Map<string, any>();
  private singletons = new Map<string, any>();

  register<T>(name: string, factory: () => T, singleton: boolean = false): void {
    this.services.set(name, { factory, singleton });
  }

  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) throw new Error(`Service not found: ${name}`);

    if (service.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory());
      }
      return this.singletons.get(name);
    }

    return service.factory();
  }
}

// Usage
const container = new Container();
container.register("UserService", () => new UserService(), true);
const userService = container.get<UserService>("UserService");
```

## Checklist

- [ ] Implement service container
- [ ] Use singleton pattern
- [ ] Manage dependencies
- [ ] Test with dependency injection
