/**
 * ava-langgraph-prompt-decomposition-engine
 *
 * Graph-level orchestration for the Prompt Decomposition Engine (PDE).
 * Built on top of ava-langchain-prompt-decomposition primitives,
 * this package provides:
 *
 * - DecompositionGraph: State-based graph running EAST→SOUTH→WEST→NORTH
 * - PerspectiveAnalyzer: Three-universe analysis (Mia/Ava8/Miette)
 * - CeremonyGate: Relational accountability gating
 *
 * @example
 * ```typescript
 * import {
 *   DecompositionGraph,
 *   PerspectiveAnalyzer,
 *   CeremonyGate,
 * } from "ava-langgraph-prompt-decomposition-engine";
 *
 * const graph = new DecompositionGraph();
 * const analyzer = new PerspectiveAnalyzer();
 * const gate = new CeremonyGate();
 *
 * // Run the full pipeline
 * const state = await graph.invoke("Build a relational intelligence system...");
 *
 * // Analyze through three perspectives
 * if (state.decomposition) {
 *   const perspectives = analyzer.analyze(state.decomposition);
 *   const verdict = gate.evaluate(state.decomposition, perspectives);
 *
 *   if (verdict.decision === "hold") {
 *     console.log("Ceremony needed:", verdict.reasons);
 *   }
 * }
 * ```
 */

export const VERSION = "0.1.0";

// =============================================================================
// Graphs
// =============================================================================

export {
  DecompositionState,
  createInitialState,
  eastNode,
  southNode,
  westNode,
  northNode,
  DecompositionGraphOptions,
  DecompositionGraph,
} from "./graphs/index.js";

// =============================================================================
// Nodes
// =============================================================================

export {
  Universe,
  UNIVERSE_NAMES,
  PerspectiveInsight,
  ThreeUniversePerspective,
  PerspectiveAnalyzer,
  GateDecision,
  CeremonyGateResult,
  CeremonyGateOptions,
  CeremonyGate,
} from "./nodes/index.js";

// =============================================================================
// Re-export core primitives for convenience
// =============================================================================

export {
  Direction,
  DirectionalDecomposer,
  IntentExtractor,
  DependencyMapper,
  ActionStackBuilder,
  MedicineWheelBridge,
  decompose,
  type DecompositionResult,
  type DirectionalAnalysis,
  type IntentExtractionResult,
  type WheelEnrichedAnalysis,
} from "ava-langchain-prompt-decomposition";
