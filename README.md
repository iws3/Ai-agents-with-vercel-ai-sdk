# AI ENGINEERING FOR DEVELOPERS - TypeScript Course & Resources

A comprehensive, production-ready TypeScript learning platform with AI engineering and frontend development focus.

---

## 📚 Overview

This repository contains:

1. **TypeScript Full Course** (`src/0.0_typescript_full_course/`) - Professional-grade TypeScript curriculum
2. **LLM Basics** (`src/1.0_llm_basics/`) - Foundations of large language model integration
3. **Output Formatting** (`src/2.0_output_formatting/`) - Structured outputs with Zod and type safety
4. **RAG Systems** (`src/2.1_rags/`) - Retrieval-Augmented Generation implementations
5. **Tool Calling** (`src/3.0_tool_calling/`) - LLM function calling patterns
6. **AI Agents** (`src/4.0_ai_agents/`) - Building autonomous AI agents
7. **Open Source LLMs** (`src/4.1_opensource_llms/`) - Using local/open models
8. **MCP Integration** (`src/5.0_mcp/`) - Model Context Protocol implementations
9. **LLM Security** (`src/6.0_llm_security/`) - Secure AI system design

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- VS Code (recommended)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd vercel_ai_sdk

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run TypeScript compiler check
npm run type-check
```

### First Steps

1. **New to TypeScript?** Start with the course:
   ```bash
   cd src/0.0_typescript_full_course
   ```
   Read [QUICK_START.md](src/0.0_typescript_full_course/QUICK_START.md) for a 30-minute introduction.

2. **Learning the Course?** Follow the structured path:
   - [Course Index](src/0.0_typescript_full_course/COURSE_INDEX.md) - Navigation guide
   - [Learning Paths](src/0.0_typescript_full_course/LEARNING_PATHS.md) - Choose your journey
   - [Learners Setup](src/0.0_typescript_full_course/LEARNERS_SETUP_GUIDE.md) - Environment setup

3. **Exploring AI Integration?** Check out:
   - [LLM Basics](src/1.0_llm_basics/) - Start here
   - [Output Formatting](src/2.0_output_formatting/) - Structured outputs
   - [AI Agents](src/4.0_ai_agents/) - Advanced patterns

---

## 📂 Directory Structure

```
vercel_ai_sdk/
├── README.md (you are here)
├── package.json
├── tsconfig.json
│
└── src/
    ├── 0.0_typescript_full_course/     # Complete TypeScript curriculum
    │   ├── Chapter_1_Foundations/      # TypeScript fundamentals
    │   ├── Chapter_2_Basics/           # Core language features
    │   ├── Chapter_3_Intermediate/     # Advanced patterns
    │   ├── Chapter_4_Advanced/         # Expert-level concepts
    │   ├── Learners/                   # Development environment for learners
    │   └── [20+ guide files]           # Specialized documentation
    │
    ├── 1.0_llm_basics/                 # LLM integration fundamentals
    │   ├── 1_parameter.ts              # Parameter handling
    │   ├── 2_streaming.ts              # Streaming responses
    │   ├── 3_chat.ts                   # Chat interfaces
    │   └── 4_systemPrompt.ts           # System prompts
    │
    ├── 2.0_output_formatting/          # Structured output patterns
    │   ├── 2.1-zod/                    # Zod validation
    │   └── 2.2-basic_structured_output/ # Basic structures
    │
    ├── 2.1_rags/                       # RAG implementations
    │   ├── 1_embeddings/               # Embedding generation
    │   └── 2_chunking/                 # Text chunking strategies
    │
    ├── 3.0_tool_calling/               # Function calling patterns
    ├── 4.0_ai_agents/                  # Autonomous agent systems
    ├── 4.1_opensource_llms/            # Local LLM models
    ├── 5.0_mcp/                        # Model Context Protocol
    └── 6.0_llm_security/               # Security best practices
```

---

## 📖 TypeScript Course Content

### Chapter 1: Foundations (Complete)
**4 parts** covering TypeScript basics with AI/Frontend examples:

- **Part 1**: Why TypeScript - History, benefits, real-world impact
- **Part 2**: Setup Development Environment - Node.js, npm, configuration
- **Part 3**: How TypeScript Compiles - Compilation pipeline, type erasure
- **Part 4**: Your First TypeScript Program - Practical examples
- **Part 5**: Understanding The Compiler - tsconfig.json deep dive

**+20 supplementary guides** including:
- AI Engineering Guide & Practices
- Frontend Development Guide & Practices
- Glossary, FAQ, Quick Reference
- Debugging, Testing, Performance
- Security, Migration, Patterns
- Interview Preparation
- And more...

### Chapter 2-4: Basics → Advanced
Structured similarly with progressive complexity.

---

## 🎯 Learning Paths

Choose your personalized learning journey:

### Path 1: Frontend Developer (React)
Start with TypeScript fundamentals → React patterns → Advanced concepts
~4 weeks

### Path 2: Backend Developer (Node.js)
Start with TypeScript fundamentals → Express patterns → Advanced concepts
~4 weeks

### Path 3: Data Engineer
Start with TypeScript fundamentals → Data structures → Optimization
~4 weeks

### Path 4: AI/ML Engineer
Start with TypeScript fundamentals → LLM integration → Advanced AI patterns
~5 weeks

See [LEARNING_PATHS.md](src/0.0_typescript_full_course/LEARNING_PATHS.md) for detailed paths.

---

## 🛠️ Development Setup

### Project Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

### Available Scripts

```bash
# TypeScript compilation
npm run build

# Type checking only
npm run type-check

# Watch mode (continuous compilation)
npm run watch

# Format code with Prettier
npm run format

# Run linter
npm run lint

# Run tests (if configured)
npm test
```

---

## 📚 Key Resources

### Course Documents
- [Course Index](src/0.0_typescript_full_course/COURSE_INDEX.md) - Complete navigation
- [Quick Start](src/0.0_typescript_full_course/QUICK_START.md) - 30-minute setup
- [Learning Resources](src/0.0_typescript_full_course/RESOURCES.md) - External links
- [Troubleshooting](src/0.0_typescript_full_course/TROUBLESHOOTING.md) - Common issues

### Specialized Guides
- [Security Best Practices](src/0.0_typescript_full_course/Chapter_1_Foundations/SECURITY_GUIDE.md)
- [Common Patterns](src/0.0_typescript_full_course/COMMON_PATTERNS.md)
- [Performance Optimization](src/0.0_typescript_full_course/Chapter_1_Foundations/PERFORMANCE_PROFILING.md)
- [Migration Guide](src/0.0_typescript_full_course/MIGRATION_GUIDE.md)
- [Style Guide](src/0.0_typescript_full_course/STYLE_GUIDE.md)

### Example Projects
- **AI ChatBot** - LLM integration patterns
- **React Todo App** - React component type safety
- Both in: `src/0.0_typescript_full_course/Learners/examples/`

---

## 🎓 For Course Learners

### Getting Started

1. **Read** [Learners Setup Guide](src/0.0_typescript_full_course/LEARNERS_SETUP_GUIDE.md)
2. **Choose** your [Learning Path](src/0.0_typescript_full_course/LEARNING_PATHS.md)
3. **Work through** Chapter 1 materials
4. **Complete** exercises in `Learners/` folder
5. **Build** example projects

### Project Structure

```
Learners/
├── src/
│   ├── index.ts              # Entry point
│   ├── chapter1-fundamentals/ # Chapter 1 exercises
│   └── utils/                # Helper functions
├── examples/
│   ├── ai-chat-bot/          # AI integration example
│   └── react-todo-app/       # React patterns example
├── package.json
└── tsconfig.json
```

### Contribution Guidelines

Want to contribute? See [CONTRIBUTING.md](src/0.0_typescript_full_course/CONTRIBUTING.md) for:
- How to contribute content
- Learners folder workflow
- Avoiding conflicts
- Pull request process

---

## 🔧 AI/LLM Integration

This project includes comprehensive resources for AI integration:

### Getting Started with LLM APIs

```typescript
// Example: Type-safe API call
import { ChatRequest, ChatResponse } from './types';

async function chat(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_KEY}` },
    body: JSON.stringify(request)
  });
  
  return response.json();
}
```

### Resources
- [LLM Basics](src/1.0_llm_basics/) - Fundamentals
- [AI Engineering Guide](src/0.0_typescript_full_course/Chapter_1_Foundations/CHAPTER_1_AI_ENGINEERING_GUIDE.md)
- [AI Practices](src/0.0_typescript_full_course/Chapter_1_Foundations/CHAPTER_1_AI_ENGINEERING_PRACTICES.md)
- [Security Considerations](src/6.0_llm_security/)

---

## 🔐 Security

Security is built-in throughout the course:

- **Type Safety**: Catch errors at compile-time
- **Input Validation**: Structured validation with Zod
- **Authentication**: Type-safe auth patterns
- **Environment Variables**: Secure secret management
- **CORS & CSRF**: Protection patterns included

Details in [Security Guide](src/0.0_typescript_full_course/Chapter_1_Foundations/SECURITY_GUIDE.md).

---

## 📊 Project Stats

- **121+ Git Commits** - Comprehensive development history
- **50,000+ Words** - Chapter 1 content alone
- **30+ Guide Documents** - Specialized documentation
- **5+ Example Projects** - Real-world implementations
- **4 Chapters** - Foundations to Advanced
- **100+ Exercises** - Hands-on learning

---

## 🤝 Contributing

We welcome contributions! Please:

1. Read [CONTRIBUTING.md](src/0.0_typescript_full_course/CONTRIBUTING.md)
2. Check [CONTRIBUTION_TRACKER.md](src/0.0_typescript_full_course/CONTRIBUTION_TRACKER.md)
3. Fork the repository
4. Create a feature branch: `feature/your-feature`
5. Submit a pull request

**Recognition**: Contributors are featured in the tracker and acknowledged in documentation.

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## ❓ FAQ

### How long does it take to learn TypeScript?

**Foundations**: 2-4 weeks  
**Core concepts**: 4-8 weeks  
**Advanced patterns**: 8-12 weeks  
**Production ready**: 3-6 months of practice

See [QUICK_START.md](src/0.0_typescript_full_course/QUICK_START.md) for a first-day overview.

### Do I need JavaScript knowledge?

Helpful but not required. We include JS→TS migration guides. See [Migration Guide](src/0.0_typescript_full_course/MIGRATION_GUIDE.md).

### Can I use this for interviews?

Yes! See [Interview Preparation](src/0.0_typescript_full_course/INTERVIEW_PREPARATION.md) for 10 common questions with detailed answers.

### Where do I get help?

1. Check [Troubleshooting](src/0.0_typescript_full_course/TROUBLESHOOTING.md)
2. Review [FAQ](src/0.0_typescript_full_course/Chapter_1_Foundations/CHAPTER_1_FAQ.md)
3. Search [Learning Resources](src/0.0_typescript_full_course/RESOURCES.md)

---

## 🔗 External Resources

- [TypeScript Official Handbook](https://www.typescriptlang.org/)
- [TypeScript Playground](https://www.typescriptlang.org/play/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Total TypeScript](https://www.totaltypescript.com/)

---

## 📞 Support

- **Course Questions**: Check [COURSE_INDEX.md](src/0.0_typescript_full_course/COURSE_INDEX.md)
- **Debugging Issues**: See [Debugging Guide](src/0.0_typescript_full_course/Chapter_1_Foundations/CHAPTER_1_DEBUGGING_GUIDE.md)
- **Setup Problems**: Check [Setup Guide](src/0.0_typescript_full_course/LEARNERS_SETUP_GUIDE.md)
- **Contribute/Report**: See [Contributing](src/0.0_typescript_full_course/CONTRIBUTING.md)

---

## 🎉 Getting Started Today

### Right Now (5 minutes)
1. Run `npm install`
2. Read [Quick Start](src/0.0_typescript_full_course/QUICK_START.md)

### This Week (1-2 hours)
1. Choose a [Learning Path](src/0.0_typescript_full_course/LEARNING_PATHS.md)
2. Complete Chapter 1 exercises
3. Build your first TypeScript app

### Next Steps
1. Progress through Chapters 2-4
2. Build real projects
3. Contribute back to the community

---

## 📈 Progress Tracking

Track your learning journey:

- [ ] Install TypeScript and tools
- [ ] Complete Chapter 1
- [ ] Build first TypeScript project
- [ ] Complete Chapter 2
- [ ] Build intermediate project
- [ ] Complete Chapter 3
- [ ] Complete Chapter 4
- [ ] Build production application
- [ ] Master advanced patterns
- [ ] Contribute to projects

---

**Happy learning! 🚀**

For detailed course content, navigate to [src/0.0_typescript_full_course/README.md](src/0.0_typescript_full_course/README.md).
