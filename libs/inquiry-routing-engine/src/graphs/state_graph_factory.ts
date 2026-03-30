/**
 * LangGraph StateGraph Factory for Inquiry Routing
 *
 * Creates a proper LangGraph StateGraph that can be compiled and used
 * as a subgraph in larger graph workflows.
 *
 * Requires @langchain/langgraph as a peer dependency.
 *
 * @example
 * ```typescript
 * import { createInquiryRoutingStateGraph } from "ava-langgraph-inquiry-routing-engine/graphs";
 *
 * // Create and compile the graph
 * const graph = await createInquiryRoutingStateGraph();
 * const compiled = graph.compile();
 *
 * // Invoke with a DecompositionResult
 * const result = await compiled.invoke({
 *   decomposition: myDecomposition,
 *   pdeId: myDecomposition.id,
 *   sessionId: "session-123",
 * });
 *
 * // Use as a subgraph in a larger pipeline
 * const parentGraph = new StateGraph({ ... })
 *   .addNode("route_inquiries", compiled)
 *   .addEdge("decompose", "route_inquiries");
 * ```
 */

import type { InquiryRoutingState } from "./inquiry_routing_graph.js";
import {
  generateNode,
  routeNode,
  validateNode,
  dispatchNode,
} from "./inquiry_routing_graph.js";

export interface StateGraphFactoryOptions {
  /** If true, halt at ceremony_hold instead of continuing to dispatch */
  enforceCeremony?: boolean;
}

/**
 * Creates a LangGraph StateGraph for the Inquiry Routing pipeline.
 *
 * Returns a configured StateGraph that can be compiled. Requires
 * @langchain/langgraph to be installed.
 *
 * The graph follows EAST(Generate) → SOUTH(Route) → WEST(Validate) → (ceremony check) → NORTH(Dispatch).
 */
export async function createInquiryRoutingStateGraph(options?: StateGraphFactoryOptions) {
  // Dynamic import — use variable to prevent TypeScript DTS from resolving the module.
  // `any` is required here because @langchain/langgraph types are not available at compile time
  // (it's a peer dependency loaded dynamically). The node callbacks below use
  // InquiryRoutingState directly via the imported node functions.
  let StateGraph: any, END: any, START: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const pkgName = "@langchain/langgraph";
    const mod = await import(/* webpackIgnore: true */ pkgName);
    StateGraph = mod.StateGraph;
    END = mod.END;
    START = mod.START;
  } catch {
    throw new Error(
      "createInquiryRoutingStateGraph requires @langchain/langgraph. " +
        "Install it with: npm install @langchain/langgraph",
    );
  }

  const enforceCeremony = options?.enforceCeremony ?? false;

  // State channel defaults. `any` in the Record type is required because
  // LangGraph's channel API accepts heterogeneous default factories.
  const channels: Record<string, { default: () => unknown }> = {
    decomposition: { default: () => null },
    pdeId: { default: () => "" },
    sessionId: { default: () => "" },
    inquiryBatch: { default: () => null },
    routingDecisions: { default: () => null },
    routedBatch: { default: () => null },
    relationalValidation: { default: () => null },
    ceremonyRequired: { default: () => false },
    dispatchedInquiries: { default: () => null },
    dispatchPayloads: { default: () => null },
    status: { default: () => "pending" },
    errors: { default: () => [] as string[] },
  };

  // Node callbacks use `any` for the state parameter because the StateGraph API
  // types the callback argument as its own internal state representation, not our
  // InquiryRoutingState. The actual typing is enforced within the node functions.
  const graph = new StateGraph({ channels })
    .addNode("generate", (state: InquiryRoutingState) => {
      return generateNode(state);
    })
    .addNode("route", (state: InquiryRoutingState) => {
      return routeNode(state);
    })
    .addNode("validate", (state: InquiryRoutingState) => {
      return validateNode(state);
    })
    .addNode("dispatch", (state: InquiryRoutingState) => {
      return dispatchNode(state);
    })
    .addEdge(START, "generate")
    .addEdge("generate", "route")
    .addEdge("route", "validate")
    .addConditionalEdges("validate", (state: InquiryRoutingState) => {
      if (state.status === "ceremony_hold" && enforceCeremony) {
        return END;
      }
      return "dispatch";
    })
    .addEdge("dispatch", END);

  return graph;
}
