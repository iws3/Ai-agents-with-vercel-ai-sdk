# Testing Strategies and Test Patterns

Comprehensive guide to testing TypeScript applications.

## Unit Testing Patterns

```typescript
describe("UserService", () => {
  let service: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = createMockRepository();
    service = new UserService(mockRepo);
  });

  describe("getUser", () => {
    it("returns user by id", async () => {
      expect(await service.getUser("123")).toEqual({ id: "123", name: "Alice" });
    });

    it("throws on not found", async () => {
      await expect(service.getUser("invalid")).rejects.toThrow();
    });
  });
});
```

## Integration Testing

```typescript
describe("User API integration", () => {
  let app: Application;
  let db: Database;

  beforeAll(async () => {
    db = await Database.create();
    app = createApp(db);
  });

  afterAll(async () => {
    await db.close();
  });

  it("creates user via API", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Alice", email: "alice@ex.com" });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });
});
```

## Property-Based Testing

```typescript
import { test, fc } from "@fast-check/jest";

test.prop([fc.integer(), fc.integer()])("addition is commutative", (a, b) => {
  expect(add(a, b)).toBe(add(b, a));
});

test.prop([fc.array(fc.integer())])("sort is stable", (arr) => {
  const sorted = arr.sort();
  const copy = arr.sort();
  expect(sorted).toEqual(copy);
});
```

## Checklist

- [ ] Write unit tests
- [ ] Test integration
- [ ] Use mocks
- [ ] Achieve 80%+ coverage
