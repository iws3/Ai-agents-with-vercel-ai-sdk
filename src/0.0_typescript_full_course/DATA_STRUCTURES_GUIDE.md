# Data Structures and Algorithms in TypeScript

Comprehensive guide to implementing common data structures type-safely.

## Learning Objectives

- Implement type-safe data structures
- Use generics for reusable structures
- Understand Big O complexity
- Build balanced trees and heaps
- Implement graph algorithms

---

## Stacks

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  isEmpty(): boolean { return this.items.length === 0; }
  size(): number { return this.items.length; }
}
```

## Queues

```typescript
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
  front(): T | undefined { return this.items[0]; }
  isEmpty(): boolean { return this.items.length === 0; }
}
```

---

## Binary Search Tree

```typescript
class Node<T> {
  left: Node<T> | null = null;
  right: Node<T> | null = null;

  constructor(public value: T) {}
}

class BinarySearchTree<T> {
  root: Node<T> | null = null;

  insert(value: T): void {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) return;
      
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  search(value: T): boolean {
    let current = this.root;
    while (current !== null) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }
}
```

---

## Heap

```typescript
class MinHeap<T> {
  private heap: T[] = [];

  private compare(a: T, b: T): number {
    return (a as any) - (b as any);
  }

  push(value: T): void {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    return min;
  }

  private heapifyUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parent]) < 0) {
        [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
        index = parent;
      } else {
        break;
      }
    }
  }

  private heapifyDown(index: number): void {
    while (2 * index + 1 < this.heap.length) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < this.heap.length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }
}
```

---

## Graphs

```typescript
interface GraphNode<T> {
  value: T;
  edges: GraphNode<T>[];
}

class Graph<T> {
  nodes: Map<T, GraphNode<T>> = new Map();

  addNode(value: T): void {
    if (!this.nodes.has(value)) {
      this.nodes.set(value, { value, edges: [] });
    }
  }

  addEdge(from: T, to: T): void {
    const fromNode = this.nodes.get(from);
    const toNode = this.nodes.get(to);
    if (fromNode && toNode) {
      fromNode.edges.push(toNode);
    }
  }

  bfs(start: T): T[] {
    const visited = new Set<T>();
    const queue: GraphNode<T>[] = [];
    const result: T[] = [];

    const startNode = this.nodes.get(start);
    if (!startNode) return result;

    queue.push(startNode);
    visited.add(start);

    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.value);

      for (const edge of node.edges) {
        if (!visited.has(edge.value)) {
          visited.add(edge.value);
          queue.push(edge);
        }
      }
    }

    return result;
  }
}
```

---

## Trie (Prefix Tree)

```typescript
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
}

class Trie {
  root: TrieNode = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return true;
  }
}
```

---

## Checklist

- [ ] Implement stacks and queues
- [ ] Understand binary search trees
- [ ] Implement heaps
- [ ] Build graph algorithms (BFS, DFS)
- [ ] Implement Trie structures
