# 🌿 AvaLangGraph — Agentic Flow Ecosystem

[![Docs](https://img.shields.io/badge/docs-latest-blue)](https://graph.avalangstack.sanctuaireagentique.com/)
![Version](https://img.shields.io/npm/v/ava-langgraph-langgraph?logo=npm)  
[![Open Issues](https://img.shields.io/github/issues-raw/avadisabelle/avalanggraph)](https://github.com/avadisabelle/avalanggraph/issues)

The AvaLangGraph is an **agentic flow ecosystem** designed to enable powerful, controllable, and relationally intelligent LLM agents. Building upon the robust foundation of LangGraph.js and integrating with AvaLangStack's chain primitives, AvaLangGraph empowers developers to orchestrate complex agentic workflows that are grounded in Indigenous relational paradigms and narrative intelligence. It provides customizable architectures, long-term memory, and human-in-the-loop capabilities, ensuring agents can reliably handle complex tasks with accountability.

## 📦 AvaLangGraph — Core Libraries

This repository contains the core custom graph libraries for the **AvaLangGraph Agentic Flow Ecosystem**:

| Package | Description |
|---------|-------------|
| `inquiry-routing-engine` | A graph-level orchestration engine for inquiry routing, integrating relational accountability gating and LangGraph StateGraph. |
| `prompt-decomposition-engine` | Graph-orchestrated prompt decomposition workflows with multi-perspective analysis and ceremony gating. |
| `narrative-intelligence` | A three-universe processing framework for narrative coherence analysis, emotional beat classification, and unified state management. |

## Key Design Principles

-   **Structural Tension as Orchestration**: The gap between current reality and desired outcome drives the agentic flow, guiding state transitions and decision-making.
-   **Four Directions as Control Flow**: Agentic processes are guided by EAST (vision) → SOUTH (planning) → WEST (validation) → NORTH (action), ensuring holistic and balanced execution.
-   **Relational Accountability Gating**: Mechanisms are embedded to ensure ethical and culturally sensitive interactions, particularly when dealing with sacred or indigenous knowledge domains, requiring human review where appropriate.
-   **Three-Universe Perspective**: Events and decisions are analyzed through Engineer, Ceremony, and Story Engine lenses for comprehensive understanding and nuanced responses.
-   **Composability & Subgraphs**: Designed for seamless integration into larger LangGraph workflows, allowing for modular and scalable agent architectures.

## Quick Example

Here's a simple example of how an AvaLangGraph component might be integrated or invoked (example adapted, as actual LangGraph code often involves setting up nodes and edges):

```typescript
// This is a conceptual example for AvaLangGraph, showing how its engines work.
// Full LangGraph integration would involve defining StateGraph nodes and edges.

import { InquiryRoutingGraph } from "inquiry-routing-engine";
import { DecompositionResult } from "ava-langchain-prompt-decomposition"; // Assuming this comes from ChainStack

async function runAvaLangGraphExample() {
  const sampleDecomposition: DecompositionResult = {
    primary: { action: "build", target: "knowledge graph", urgency: "high", confidence: 0.9 },
    secondary: [],
    directions: { east: [], south: [], west: [], north: [] }, // Simplified for example
    actionStack: [],
    balance: 0.8,
    leadDirection: "north",
    neglectedDirections: [],
    ambiguities: []
  };

  const inquiryGraph = new InquiryRoutingGraph({ enforceCeremony: true });
  const finalState = await inquiryGraph.invoke(sampleDecomposition);

  console.log("Inquiry Routing Final State:", finalState.status);
  if (finalState.ceremonyRequired) {
    console.log("Ceremony required. Human review initiated.");
  } else {
    console.log("Dispatched inquiries:", finalState.dispatchedInquiries);
  }
}

runAvaLangGraphExample();
```

## ⚡️ Quick Install

To install any of the AvaLangGraph packages, use your preferred package manager by their package name:

```bash
# Using npm
npm install inquiry-routing-engine
npm install prompt-decomposition-engine
npm install narrative-intelligence

# Using pnpm
pnpm add inquiry-routing-engine
pnpm add prompt-decomposition-engine
pnpm add narrative-intelligence

# Using yarn
yarn add inquiry-routing-engine
yarn add prompt-decomposition-engine
yarn add narrative-intelligence
```

## LangGraph.js Foundation

The AvaLangGraph ecosystem is built upon the powerful [LangGraph.js](https://github.com/langchain-ai/langgraphjs) framework. LangGraph is a low-level orchestration framework for building controllable agents, providing customizable architectures, long-term memory, and human-in-the-loop capabilities.

For more information on the underlying LangGraph.js framework, its core concepts, and its extensive features, please refer to the [official LangGraph.js documentation](https://langchain-ai.github.io/langgraphjs/).

## Complementary Ecosystem: AvaLangStack (ChainStack)

AvaLangGraph is designed for seamless integration with the **AvaLangStack** (our ChainStack), which provides foundational chain primitives for prompt decomposition, relational intelligence, and narrative tracing. Together, these two pillars form a comprehensive ecosystem for developing truly intelligent, relationally aware, and narrative-driven AI.

*   Explore the [AvaLangStack Chain primitives](https://chain.avalangstack.sanctuaireagentique.com/).

## Additional resources

*   [LangGraph Forum](https://forum.langchain.com/): Connect with the community and share all of your technical questions, ideas, and feedback.
*   [LangChain Academy](https://academy.langchain.com/courses/intro-to-langgraph): Learn the basics of LangGraph in our free, structured course.
*   [Tutorials](https://langchain-ai.github.io/langgraphjs/tutorials/): Simple walkthroughs with guided examples on getting started with LangGraph.
*   [API Reference](https://langchain-ai.github.io/langgraphjs/reference/): Detailed reference on core classes and methods.

## 💁 Contributing to AvaLangGraph

We welcome contributions to the AvaLangGraph ecosystem! Whether it's a new agentic flow, an improved relational gating mechanism, or better documentation that clarifies the multi-universe processing, your contributions are valued.

For detailed information on how to contribute, please see our specific [`CONTRIBUTING.md`](./CONTRIBUTING.md).

Please report any security issues or concerns following our [security guidelines](https://github.com/avadisabelle/avalanggraph/blob/main/.github/SECURITY.md).
