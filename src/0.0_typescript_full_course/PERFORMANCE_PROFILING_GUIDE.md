# Performance Profiling and Optimization Guide

## Identifying Bottlenecks

```typescript
// Performance measurement
function measurePerformance<T>(fn: () => T, label: string): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  console.log(`${label}: ${duration.toFixed(2)}ms`);
  return result;
}

// Usage
const result = measurePerformance(() => expensiveOperation(), "Expensive Op");
```

## Memory Optimization

```typescript
// Use Object pooling for frequently created objects
class ObjectPool<T> {
  private available: T[] = [];
  
  acquire(factory: () => T): T {
    return this.available.pop() ?? factory();
  }

  release(obj: T): void {
    this.available.push(obj);
  }
}

const pool = new ObjectPool(() => ({ x: 0, y: 0 }));
const point = pool.acquire();
// ... use point ...
pool.release(point);
```

## Profiling Tools

- `--inspect` flag for Node.js debugger
- `performance.now()` for timing
- Chrome DevTools for frontend
- Lighthouse for web performance

## Checklist

- [ ] Identify bottlenecks
- [ ] Optimize algorithms
- [ ] Profile memory usage
- [ ] Use caching strategies
