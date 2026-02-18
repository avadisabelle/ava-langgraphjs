/**
 * Decomposition Graph
 *
 * A state-based graph that orchestrates the full PDE pipeline:
 * 1. EAST node: Intent extraction (what is being asked?)
 * 2. SOUTH node: Dependency analysis (what needs to be learned?)
 * 3. WEST node: Ceremony gate (what needs reflection?)
 * 4. NORTH node: Action stack building (what executes?)
 *
 * This graph processes prompts through the Four Directions
 * and produces a dependency-ordered execution plan.
 *
 * Designed to be consumed as a subgraph in larger LangGraph workflows.
 */

import { v4 as uuid } from "uuid";
import {
  DirectionalDecomposer,
  IntentExtractor,
  DependencyMapper,
  ActionStackBuilder,
  MedicineWheelBridge,
  type DirectionalAnalysis,
  type IntentExtractionResult,
  type ExecutionOrder,
  type DecompositionResult,
  type WheelEnrichedAnalysis,
  type DependencyGraph,
} from "ava-langchain-prompt-decomposition";

// =============================================================================
// State
// =============================================================================

export interface DecompositionState {
  /** The original prompt to decompose */
  prompt: string;

  /** Session ID for tracking */
  sessionId: string;

  /** EAST: Directional analysis result */
  directionalAnalysis: DirectionalAnalysis | null;

  /** EAST: Intent extraction result */
  intentResult: IntentExtractionResult | null;

  /** SOUTH: Dependency graph */
  dependencyGraph: DependencyGraph | null;

  /** SOUTH: Execution order */
  executionOrder: ExecutionOrder | null;

  /** WEST: Wheel-enriched analysis */
  wheelEnriched: WheelEnrichedAnalysis | null;

  /** WEST: Whether ceremony is required before proceeding */
  ceremonyRequired: boolean;

  /** WEST: Relational guidance messages */
  relationalGuidance: string[];

  /** NORTH: Final decomposition result */
  decomposition: DecompositionResult | null;

  /** Processing status */
  status: "pending" | "east_complete" | "south_complete" | "west_complete" | "complete" | "ceremony_hold";

  /** Errors encountered */
  errors: string[];
}

export function createInitialState(prompt: string, sessionId?: string): DecompositionState {
  return {
    prompt,
    sessionId: sessionId ?? uuid(),
    directionalAnalysis: null,
    intentResult: null,
    dependencyGraph: null,
    executionOrder: null,
    wheelEnriched: null,
    ceremonyRequired: false,
    relationalGuidance: [],
    decomposition: null,
    status: "pending",
    errors: [],
  };
}

// =============================================================================
// Node Functions
// =============================================================================

/**
 * EAST node: Vision — Extract intents and directional analysis.
 * "What is being asked?"
 */
export function eastNode(state: DecompositionState): Partial<DecompositionState> {
  try {
    const decomposer = new DirectionalDecomposer();
    const extractor = new IntentExtractor();

    const directionalAnalysis = decomposer.decompose(state.prompt);
    const intentResult = extractor.extract(state.prompt);

    return {
      directionalAnalysis,
      intentResult,
      status: "east_complete",
    };
  } catch (e) {
    return {
      errors: [...state.errors, `EAST: ${(e as Error).message}`],
      status: "east_complete",
    };
  }
}

/**
 * SOUTH node: Analysis — Map dependencies and compute execution order.
 * "What needs to be learned?"
 */
export function southNode(state: DecompositionState): Partial<DecompositionState> {
  if (!state.intentResult) {
    return {
      errors: [...state.errors, "SOUTH: No intent result from EAST"],
      status: "south_complete",
    };
  }

  try {
    const mapper = new DependencyMapper();
    const dependencyGraph = mapper.buildGraph(state.intentResult.secondary);
    const executionOrder = mapper.computeExecutionOrder(dependencyGraph);

    return {
      dependencyGraph,
      executionOrder,
      status: "south_complete",
    };
  } catch (e) {
    return {
      errors: [...state.errors, `SOUTH: ${(e as Error).message}`],
      status: "south_complete",
    };
  }
}

/**
 * WEST node: Validation — Check ceremony requirements and relational balance.
 * "What needs reflection?"
 */
export function westNode(state: DecompositionState): Partial<DecompositionState> {
  if (!state.directionalAnalysis) {
    return {
      errors: [...state.errors, "WEST: No directional analysis from EAST"],
      status: "west_complete",
    };
  }

  try {
    const bridge = new MedicineWheelBridge();
    const wheelEnriched = bridge.enrich(state.directionalAnalysis);
    const relationalGuidance = bridge.getRelationalGuidance(state.directionalAnalysis);
    const ceremonyRequired = wheelEnriched.ceremonyRequired;

    return {
      wheelEnriched,
      ceremonyRequired,
      relationalGuidance,
      status: ceremonyRequired ? "ceremony_hold" : "west_complete",
    };
  } catch (e) {
    return {
      errors: [...state.errors, `WEST: ${(e as Error).message}`],
      status: "west_complete",
    };
  }
}

/**
 * NORTH node: Action — Build the final action stack.
 * "What executes?"
 */
export function northNode(state: DecompositionState): Partial<DecompositionState> {
  if (!state.directionalAnalysis || !state.intentResult) {
    return {
      errors: [...state.errors, "NORTH: Missing EAST results"],
      status: "complete",
    };
  }

  try {
    const builder = new ActionStackBuilder();
    const decomposition = builder.build(
      state.directionalAnalysis,
      state.intentResult,
      state.executionOrder ?? undefined
    );

    return {
      decomposition,
      status: "complete",
    };
  } catch (e) {
    return {
      errors: [...state.errors, `NORTH: ${(e as Error).message}`],
      status: "complete",
    };
  }
}

// =============================================================================
// DecompositionGraph (orchestrator)
// =============================================================================

export interface DecompositionGraphOptions {
  /** If true, halt at ceremony_hold instead of continuing (default false) */
  enforeCeremony?: boolean;
}

/**
 * DecompositionGraph orchestrates the four directional nodes
 * in sequence: EAST → SOUTH → WEST → NORTH.
 *
 * This is a pure-function graph that doesn't require LangGraph runtime,
 * making it usable standalone or as a subgraph.
 */
export class DecompositionGraph {
  private readonly enforceCeremony: boolean;

  constructor(options?: DecompositionGraphOptions) {
    this.enforceCeremony = options?.enforeCeremony ?? false;
  }

  /**
   * Run the full decomposition pipeline.
   */
  async invoke(prompt: string, sessionId?: string): Promise<DecompositionState> {
    let state = createInitialState(prompt, sessionId);

    // EAST: Vision
    state = this.mergeState(state, eastNode(state));

    // SOUTH: Analysis
    state = this.mergeState(state, southNode(state));

    // WEST: Validation
    state = this.mergeState(state, westNode(state));

    // Check ceremony hold
    if (state.status === "ceremony_hold" && this.enforceCeremony) {
      return state;
    }

    // NORTH: Action
    state = this.mergeState(state, northNode(state));

    return state;
  }

  /**
   * Run individual directions.
   */
  async invokeEast(state: DecompositionState): Promise<DecompositionState> {
    return this.mergeState(state, eastNode(state));
  }

  async invokeSouth(state: DecompositionState): Promise<DecompositionState> {
    return this.mergeState(state, southNode(state));
  }

  async invokeWest(state: DecompositionState): Promise<DecompositionState> {
    return this.mergeState(state, westNode(state));
  }

  async invokeNorth(state: DecompositionState): Promise<DecompositionState> {
    return this.mergeState(state, northNode(state));
  }

  private mergeState(
    current: DecompositionState,
    updates: Partial<DecompositionState>
  ): DecompositionState {
    return { ...current, ...updates };
  }
}
