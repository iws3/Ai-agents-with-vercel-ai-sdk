# Part 8: AI Engineering with TypeScript (Advanced Deep Dive)

## Learning Objectives

After this part you'll understand:
- LLM API integration patterns
- Type-safe prompt engineering
- Streaming responses
- RAG (Retrieval-Augmented Generation) patterns
- Agentic workflows in TypeScript

---

## LLM API Integration

```typescript
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface CompletionRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

interface CompletionResponse {
  content: string;
  tokens: {
    prompt: number;
    completion: number;
  };
}

class LLMClient {
  constructor(private apiKey: string) {}

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokens: {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens
      }
    };
  }
}
```

---

## Type-Safe Prompts

```typescript
interface PromptTemplate<T extends Record<string, any>> {
  template: string;
  variables: (keyof T)[];
}

function createPrompt<T extends Record<string, any>>(
  template: PromptTemplate<T>,
  values: T
): string {
  let result = template.template;

  for (const key of template.variables) {
    result = result.replace(
      `{${String(key)}}`,
      String(values[key])
    );
  }

  return result;
}

// Usage
const template: PromptTemplate<{ name: string; task: string }> = {
  template: "Help {name} with {task}",
  variables: ["name", "task"]
};

const prompt = createPrompt(template, { name: "Alice", task: "learning" });
```

---

## Streaming Responses

```typescript
async function* streamCompletion(
  request: CompletionRequest
): AsyncGenerator<string> {
  const response = await fetch("api/completions", {
    method: "POST",
    body: JSON.stringify(request)
  });

  if (!response.ok) throw new Error("Request failed");

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      yield decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

// Usage
for await (const chunk of streamCompletion(request)) {
  process.stdout.write(chunk);
}
```

---

## RAG Pattern

```typescript
interface Document {
  id: string;
  content: string;
  embedding: number[];
}

interface RAGContext {
  query: string;
  documents: Document[];
}

class RAGSystem {
  private documents: Document[] = [];

  addDocument(doc: Document): void {
    this.documents.push(doc);
  }

  private cosineDistance(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitude = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / magnitude;
  }

  async retrieve(query: string, topK: number = 3): Promise<Document[]> {
    const queryEmbedding = await this.embed(query);

    return this.documents
      .map(doc => ({
        doc,
        score: this.cosineDistance(queryEmbedding, doc.embedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(x => x.doc);
  }

  private async embed(text: string): Promise<number[]> {
    // Call embedding API
    const response = await fetch("api/embeddings", {
      method: "POST",
      body: JSON.stringify({ text })
    });
    return response.json();
  }
}
```

---

## Agentic Workflows

```typescript
interface ToolCall {
  tool: string;
  input: Record<string, any>;
}

interface Agent {
  think(context: string): Promise<ToolCall>;
  act(tool: string, input: any): Promise<string>;
}

class ReasoningAgent implements Agent {
  constructor(private llm: LLMClient) {}

  async think(context: string): Promise<ToolCall> {
    const response = await this.llm.complete({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Given this context, decide what to do: ${context}`
      }]
    });

    // Parse response to extract tool call
    return this.parseToolCall(response.content);
  }

  async act(tool: string, input: any): Promise<string> {
    if (tool === "search") {
      return `Results for: ${input.query}`;
    }
    return "Unknown tool";
  }

  private parseToolCall(response: string): ToolCall {
    // Parse LLM response to extract tool call
    return { tool: "search", input: { query: "example" } };
  }
}
```

---

## Function Calling (OpenAI Functions)

```typescript
interface FunctionDef {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

const tools: FunctionDef[] = [
  {
    name: "get_weather",
    description: "Get weather for a location",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string" }
      },
      required: ["location"]
    }
  }
];

const messages: Message[] = [
  {
    role: "user",
    content: "What's the weather in Paris?"
  }
];

// Send with function definitions
const response = await fetch("api/completions", {
  method: "POST",
  body: JSON.stringify({
    messages,
    tools,
    model: "gpt-4"
  })
});
```

---

## Checklist

- [ ] Integrate with LLM APIs
- [ ] Create type-safe prompts
- [ ] Handle streaming responses
- [ ] Implement RAG systems
- [ ] Build agentic workflows
- [ ] Use function calling
