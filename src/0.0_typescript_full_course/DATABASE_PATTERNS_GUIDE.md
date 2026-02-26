# Database Integration Patterns

## Type-Safe ORM Usage

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

class UserRepository {
  async findById(id: string): Promise<User | null> {
    return db.query("SELECT * FROM users WHERE id = ?", [id]);
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const id = generateId();
    await db.query("INSERT INTO users VALUES (?, ?, ?)", [id, user.name, user.email]);
    return { id, ...user };
  }
}
```

## Transaction  Handling

```typescript
async function transferMoney(
  from: string,
  to: string,
  amount: number
): Promise<void> {
  const tx = await db.transaction();
  try {
    await tx.query("UPDATE accounts SET balance = balance - ? WHERE id = ?", [amount, from]);
    await tx.query("UPDATE accounts SET balance = balance + ? WHERE id = ?", [amount, to]);
    await tx.commit();
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}
```

## Checklist

- [ ] Use typed repositories
- [ ] Implement transactions
- [ ] Handle connection pooling
- [ ] Migrate safely
