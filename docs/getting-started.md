# Getting Started with AvaLangGraph

The AvaLangGraph provides a powerful set of tools to orchestrate LLM agents grounded in narrative intelligence and indigenous relational paradigms. This guide will help you get started quickly.

## Installation

Our libraries are available as npm packages. You can install individual packages using your preferred package manager:

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

## Quick Example

Here's a conceptual example demonstrating how to use some of the AvaLangGraph components. Full LangGraph integration would involve defining StateGraph nodes and edges.

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

## Core Packages

Explore each of our core packages to understand their unique contributions to the AvaLangGraph ecosystem.
