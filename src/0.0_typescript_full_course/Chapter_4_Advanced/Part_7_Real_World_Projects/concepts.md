# Part 7: Real-World Projects (Advanced Deep Dive)

## Learning Objectives

After this part you'll understand:
- Full-stack TypeScript projects
- Project architecture
- Deployment strategies
- Error handling at scale
- Logging and monitoring

---

## Full-Stack Architecture

```
project/
├── apps/
│   ├── api/           # Express server
│   ├── web/           # React frontend
│   └── mobile/        # React Native
├── packages/
│   ├── types/         # Shared type definitions
│   ├── utils/         # Utilities
│   └── validation/    # Input validation
└── shared/            # Shared config
```

---

## Express API Server

```typescript
import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

// Request validation
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

app.post("/users", async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await db.users.create(data);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Type-safe response
interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

function sendResponse<T>(res: express.Response, data: T): void {
  res.json({ data } as ApiResponse<T>);
}
```

---

## Frontend Integration

```typescript
// api client
interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, data: any): Promise<T>;
}

class HttpClient implements ApiClient {
  async get<T>(path: string): Promise<T> {
    const res = await fetch(path);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  async post<T>(path: string, data: any): Promise<T> {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }
}
```

---

## Error Handling at Scale

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string = "INTERNAL_ERROR"
  ) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, "VALIDATION_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, "NOT_FOUND");
  }
}

// Middleware
app.use((error: Error, req: express.Request, res: express.Response) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }

  logger.error("Unhandled error", error);
  res.status(500).json({
    error: "Internal Server Error",
    code: "INTERNAL_ERROR"
  });
});
```

---

## Logging and Monitoring

```typescript
class Logger {
  info(message: string, data?: any): void {
    console.log(JSON.stringify({
      level: "INFO",
      timestamp: new Date().toISOString(),
      message,
      data
    }));
  }

  error(message: string, error?: Error): void {
    console.error(JSON.stringify({
      level: "ERROR",
      timestamp: new Date().toISOString(),
      message,
      error: error?.message,
      stack: error?.stack
    }));
  }
}

const logger = new Logger();

// Usage
logger.info("Server starting", { port: 3000 });
logger.error("Database connection failed", err);
```

---

## Environment Configuration

```typescript
interface Config {
  port: number;
  database: {
    host: string;
    port: number;
    password: string;
  };
  apiKey: string;
}

function loadConfig(): Config {
  const port = parseInt(process.env.PORT ?? "3000");
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY environment variable required");
  }

  return {
    port,
    database: {
      host: process.env.DB_HOST ?? "localhost",
      port: parseInt(process.env.DB_PORT ?? "5432"),
      password: process.env.DB_PASSWORD || ""
    },
    apiKey
  };
}

const config = loadConfig();
```

---

## Checklist

- [ ] Architect layered project structure
- [ ] Implement type-safe API clients
- [ ] Handle errors comprehensively
- [ ] Set up logging
- [ ] Configure environment variables
- [ ] Deploy to production safely
