# Chapter 1: AI Engineering - TypeScript Best Practices

## Why TypeScript Matters in AI/ML

Modern AI systems (LLMs, embeddings, etc.) require precise type safety:
- **API Responses**: What does the AI API actually return?
- **Data Pipelines**: What format does the model expect?
- **Error Handling**: What can go wrong and how do we recover?
- **Performance**: Are we sending the right data types?

---

## 1. Type-Safe LLM API Integration

### The Problem (without TypeScript)

```javascript
// Plain JavaScript - No guarantee this works
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${apiKey}` },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello' }]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);  // What if structure is different?
```

**Risks**:
- API response structure might change
- Misspelled field names silently fail
- Type coercion causes weird bugs

### The Solution (with TypeScript)

```typescript
// Define API request shape
interface OpenAIRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
}

// Define API response shape (from docs)
interface OpenAIResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
}

// Type-safe function
async function callOpenAI(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const request: OpenAIRequest = {
    model: 'gpt-4',
    messages
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify(request)
  });

  const data = (await response.json()) as OpenAIResponse;
  
  // TypeScript knows data structure - no guessing!
  return data.choices[0].message.content;
}

// Usage - fully type-checked
const result = await callOpenAI([
  { role: 'user', content: 'Write a poem' }
]);
console.log(result);  // Guaranteed to be string
```

**Benefits**:
- API response structure is enforced
- IDE autocomplete shows available fields
- Wrong field names caught at compile-time
- Team members know what to expect

---

## 2. Embedding Data Type Safety

### Vector/Embedding Types

```typescript
// Define embedding dimensions and type
type Embedding = number[];  // Vector of numbers

interface EmbeddedDocument {
  id: string;
  content: string;
  embedding: Embedding;  // The vector representation
  metadata: {
    source: 'api' | 'file' | 'user';
    timestamp: number;
  };
}

// Function to embed and store
async function embedAndStore(
  documents: Array<{ id: string; content: string }>
): Promise<EmbeddedDocument[]> {
  return Promise.all(
    documents.map(async (doc) => {
      const embedding = await getEmbedding(doc.content);
      
      return {
        id: doc.id,
        content: doc.content,
        embedding,  // Type-checked: must be Embedding
        metadata: {
          source: 'api',
          timestamp: Date.now()
        }
      };
    })
  );
}

// Usage
const docs = await embedAndStore([
  { id: '1', content: 'What is TypeScript?' }
]);

// Type-safe access
docs.forEach((doc) => {
  console.log(doc.embedding[0]);  // First dimension
  console.log(doc.metadata.source);  // 'api' | 'file' | 'user'
});
```

---

## 3. Data Pipeline Type Safety

### Batch Processing Pipeline

```typescript
// Define each stage of pipeline

// Stage 1: Raw Input
interface RawInput {
  text: string;
  sourceUrl?: string;
}

// Stage 2: Preprocessed
interface Preprocessed extends RawInput {
  tokens: string[];
  wordCount: number;
}

// Stage 3: Embedded
interface Embedded extends Preprocessed {
  embedding: number[];
  embeddingModel: string;
}

// Stage 4: Ready for ML
interface ReadyForML extends Embedded {
  normalizedEmbedding: number[];  // 0-1 range
  validated: true;
}

// Ensure pipeline stages are type-safe
class DataPipeline {
  private raw: RawInput[];
  private preprocessed: Preprocessed[] = [];
  private embedded: Embedded[] = [];
  private final: ReadyForML[] = [];

  load(inputs: RawInput[]): void {
    this.raw = inputs;
  }

  preprocess(): void {
    this.preprocessed = this.raw.map((item) => ({
      ...item,
      tokens: item.text.split(/\s+/),
      wordCount: item.text.split(/\s+/).length
    }));
  }

  embed(): void {
    this.embedded = this.preprocessed.map((item) => ({
      ...item,
      embedding: getEmbedding(item.text),
      embeddingModel: 'text-embedding-3-small'
    }));
  }

  normalize(): void {
    this.final = this.embedded.map((item) => ({
      ...item,
      normalizedEmbedding: normalizeVector(item.embedding),
      validated: true as const
    }));
  }

  getResults(): ReadyForML[] {
    return this.final;
  }
}

// Usage - each stage produces type-safe output
const pipeline = new DataPipeline();
pipeline.load([{ text: 'Sample text' }]);
pipeline.preprocess();  // Produces Preprocessed[]
pipeline.embed();       // Produces Embedded[]
pipeline.normalize();   // Produces ReadyForML[]

const results = pipeline.getResults();  // Type: ReadyForML[]
```

**Benefits**:
- Pipeline stages are enforced
- Can't use stage 2 output as stage 4
- Type-safe data transformation
- Clear data flow visualization

---

## 4. Error Handling in AI Systems

### Type-Safe Error Responses

```typescript
// Define possible error types from AI APIs
interface AIError {
  type: 'rate_limit' | 'auth' | 'model_not_found' | 'api_error' | 'timeout';
  message: string;
  code: string;
  retryable: boolean;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface FailureResponse {
  success: false;
  error: AIError;
}

// Union type for response
type AIResponse<T> = SuccessResponse<T> | FailureResponse;

// Type-safe function with error handling
async function callAIWithErrorHandling(
  prompt: string
): Promise<AIResponse<string>> {
  try {
    const response = await fetch(/* ... */);
    
    if (!response.ok) {
      const errorData = await response.json();
      
      // Map HTTP error to AIError
      const aiError: AIError = {
        type: response.status === 429 ? 'rate_limit' : 'api_error',
        message: errorData.error?.message || 'Unknown error',
        code: errorData.error?.code || 'UNKNOWN',
        retryable: response.status === 429
      };

      return {
        success: false,
        error: aiError
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.choices[0].message.content
    };
  } catch (err) {
    return {
      success: false,
      error: {
        type: 'timeout',
        message: err instanceof Error ? err.message : 'Unknown error',
        code: 'TIMEOUT',
        retryable: true
      }
    };
  }
}

// Usage - type-safe error handling
const response = await callAIWithErrorHandling('Hello');

if (response.success) {
  console.log(response.data);  // Type: string
} else {
  console.error(response.error.message);
  if (response.error.retryable) {
    // Retry logic
  }
}
```

---

## 5. Type-Safe Model Configuration

```typescript
// Define model capabilities
type ModelSize = 'small' | 'medium' | 'large' | 'xlarge';
type ModelType = 'completion' | 'chat' | 'embedding' | 'classification';

interface ModelConfig {
  name: string;
  type: ModelType;
  size: ModelSize;
  maxTokens: number;
  costPerMillion: number;  // USD
  contextWindow: number;
}

// Catalog of available models
const MODELS = {
  'gpt-4': {
    name: 'gpt-4',
    type: 'chat',
    size: 'xlarge',
    maxTokens: 8192,
    costPerMillion: 0.03,
    contextWindow: 8192
  },
  'gpt-3.5-turbo': {
    name: 'gpt-3.5-turbo',
    type: 'chat',
    size: 'medium',
    maxTokens: 4096,
    costPerMillion: 0.0015,
    contextWindow: 4096
  }
} as const;

type ModelKey = keyof typeof MODELS;

// Type-safe model selection
function selectModel(type: ModelType, budget: number): ModelConfig | null {
  for (const model of Object.values(MODELS)) {
    if (model.type === type && model.costPerMillion <= budget) {
      return model;
    }
  }
  return null;
}

// Usage
const chatModel = selectModel('chat', 0.05);  // Type: ModelConfig | null
if (chatModel) {
  console.log(`Using ${chatModel.name} with max ${chatModel.maxTokens} tokens`);
}
```

---

## 6. Context Window Type Safety

```typescript
// Define message types with token counting
interface TokenizedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokenCount: number;
}

interface ConversationContext {
  messages: TokenizedMessage[];
  totalTokens: number;
  maxTokens: number;
}

// Enforce context window limits
class ContextManager {
  private context: ConversationContext;

  constructor(maxTokens: number) {
    this.context = {
      messages: [],
      totalTokens: 0,
      maxTokens
    };
  }

  addMessage(role: 'user' | 'assistant', content: string): boolean {
    const tokenCount = estimateTokens(content);
    
    // Check if fits in context window
    if (this.context.totalTokens + tokenCount > this.context.maxTokens) {
      // Remove oldest message to make room (optional)
      return false;
    }

    this.context.messages.push({
      role,
      content,
      tokenCount
    });

    this.context.totalTokens += tokenCount;
    return true;
  }

  getMessages(): TokenizedMessage[] {
    return this.context.messages;
  }

  getRemainingTokens(): number {
    return this.context.maxTokens - this.context.totalTokens;
  }
}

// Usage
const manager = new ContextManager(4096);  // GPT-3.5 context
manager.addMessage('user', 'What is TypeScript?');
manager.addMessage('assistant', 'TypeScript is...');

console.log(`Used: ${manager.getMessages().length} messages`);
console.log(`Remaining: ${manager.getRemainingTokens()} tokens`);
```

---

## Best Practices Summary

1. **Always type API responses** from ML services
2. **Use discriminated unions** for success/error handling
3. **Define pipeline stages** explicitly with types
4. **Track token usage** with types to prevent overages
5. **Use const assertions** for model catalogs
6. **Validate inputs** before sending to AI APIs
7. **Document rate limits** using types
8. **Version your types** as APIs change

These practices result in:
- ✅ Fewer runtime errors
- ✅ Better IDE support
- ✅ Self-documenting code
- ✅ Easier team collaboration
- ✅ Safer AI system integration

