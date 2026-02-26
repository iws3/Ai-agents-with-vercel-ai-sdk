# Caching Strategies

## In-Memory Cache

```typescript
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class Cache<T> {
  private entries = new Map<string, CacheEntry<T>>();

  set(key: string, value: T, ttl: number = Infinity): void {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + ttl
    });
  }

  get(key: string): T | null {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.entries.delete(key);
      return null;
    }
    return entry.value;
  }

  clear(): void {
    this.entries.clear();
  }
}
```

## Checklist

- [ ] Implement caching
- [ ] Handle TTL
- [ ] Invalidate caches
- [ ] Measure cache hit rate
