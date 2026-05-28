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

// StoredDecomposition type defined locally to avoid DTS dependency on upstream build
interface StoredDecomposition {
  id: string;
  timestamp: string;
  prompt: string;
  result: DecompositionResult;
  engine?: string;
  model?: string;
  parent_pde_id?: string;
  child_kind?: ChildKind;
  fallback?: PdeFallbackMetadata;
  folder_name?: string;
  pde_dir?: string;
  markdownPath?: string;
}

type ChildKind =
  | "milestone"
  | "issue"
  | "sub-task"
  | "follow-up"
  | "refinement"
  | "sibling";

type PdeSessionIdSource = "engine" | "manual" | "inherited" | "unknown";

interface EngineFallbackAttempt {
  engine: string;
  model?: string;
  ok: boolean;
  error?: string;
}

interface PdeFallbackMetadata {
  reason: string;
  from_engine: string;
  to_engine: string;
  attempts: EngineFallbackAttempt[];
  triggered_at: string;
}

export interface DecompositionGraphStorageOptions {
  /**
   * "flat" preserves the original .pde/<id>.json layout.
   * "tree" requests miaco-style .pde/<timestamp>--<uuid>/ metadata.
   */
  layout?: "flat" | "tree";
  engine?: string;
  model?: string;
  sessionId?: string;
  sessionIdSource?: PdeSessionIdSource;
  parentPdeId?: string;
  parentPdeFolder?: string;
  childKind?: ChildKind;
  provenance?: Record<string, unknown>;
  addDirs?: string[];
  pvaProvider?: string;
  pvaThinking?: string;
  hermesProvider?: string;
  fallback?: PdeFallbackMetadata;
}

interface PromptDecompositionStorageModule {
  saveDecomposition?: (
    workdir: string,
    decomposition: DecompositionResult,
    options?: DecompositionGraphStorageOptions
  ) => StoredDecomposition;
}

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

  /** Storage: Persisted decomposition (if workdir provided) */
  stored: StoredDecomposition | null;

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
    stored: null,
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
export async function eastNode(state: DecompositionState): Promise<Partial<DecompositionState>> {
  try {
    const decomposer = new DirectionalDecomposer();
    const extractor = new IntentExtractor();

    const directionalAnalysis = decomposer.decompose(state.prompt);
    const intentResult = await extractor.extract(state.prompt);

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
  enforceCeremony?: boolean;
  /** @deprecated Use enforceCeremony. Kept for existing callers. */
  enforeCeremony?: boolean;
  /** Working directory for .pde/ storage. If set, decompositions are persisted. */
  workdir?: string;
  /** Optional storage lineage metadata passed to ava-langchain-prompt-decomposition. */
  storage?: DecompositionGraphStorageOptions;
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
  private readonly workdir?: string;
  private readonly storage?: DecompositionGraphStorageOptions;

  constructor(options?: DecompositionGraphOptions) {
    this.enforceCeremony = options?.enforceCeremony ?? options?.enforeCeremony ?? false;
    this.workdir = options?.workdir;
    this.storage = options?.storage;
  }

  /**
   * Run the full decomposition pipeline.
   */
  async invoke(prompt: string, sessionId?: string): Promise<DecompositionState> {
    let state = createInitialState(prompt, sessionId);

    // EAST: Vision
    state = this.mergeState(state, await eastNode(state));

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

    // STORAGE: Persist to .pde/ if workdir is configured
    if (this.workdir && state.decomposition) {
      try {
        // Dynamic import keeps older chain package builds usable.
        const pdeModule = (await import(
          "ava-langchain-prompt-decomposition"
        )) as PromptDecompositionStorageModule;
        if (typeof pdeModule.saveDecomposition === "function") {
          const storageOptions: DecompositionGraphStorageOptions = {
            ...this.storage,
            sessionId: this.storage?.sessionId ?? state.sessionId,
            sessionIdSource: this.storage?.sessionIdSource ?? "manual",
          };
          const stored = pdeModule.saveDecomposition(
            this.workdir,
            state.decomposition,
            storageOptions
          );
          state = this.mergeState(state, { stored });
        }
      } catch (e) {
        state = this.mergeState(state, {
          errors: [...state.errors, `STORAGE: ${(e as Error).message}`],
        });
      }
    }

    return state;
  }

  /**
   * Simple alias for invoke that returns the decomposition result directly.
   * Satisfies the consistent engine interface.
   */
  async decompose(prompt: string): Promise<DecompositionResult> {
    const state = await this.invoke(prompt);
    if (!state.decomposition) {
      throw new Error(state.errors.join("; ") || "Decomposition failed");
    }
    return state.decomposition;
  }

  /**
   * Run individual directions.
   */
  async invokeEast(state: DecompositionState): Promise<DecompositionState> {
    return this.mergeState(state, await eastNode(state));
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
