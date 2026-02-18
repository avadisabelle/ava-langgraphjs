import { describe, it, expect } from "vitest";
import {
  DecompositionGraph,
  createInitialState,
  eastNode,
  southNode,
  westNode,
  northNode,
} from "../../graphs/decomposition_graph.js";

describe("DecompositionGraph", () => {
  describe("individual nodes", () => {
    it("eastNode should extract intents and directions", async () => {
      const state = createInitialState("Research the codebase and build a new module.");
      const result = await eastNode(state);

      expect(result.directionalAnalysis).toBeDefined();
      expect(result.intentResult).toBeDefined();
      expect(result.status).toBe("east_complete");
    });

    it("southNode should build dependency graph", async () => {
      let state = createInitialState("Investigate patterns. Create implementation. Test results.");
      state = { ...state, ...await eastNode(state) };
      const result = southNode(state);

      expect(result.dependencyGraph).toBeDefined();
      expect(result.executionOrder).toBeDefined();
      expect(result.status).toBe("south_complete");
    });

    it("southNode should handle missing EAST gracefully", () => {
      const state = createInitialState("test");
      const result = southNode(state);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it("westNode should assess ceremony requirements", async () => {
      let state = createInitialState("Build code and deploy immediately.");
      state = { ...state, ...await eastNode(state) };
      const result = westNode(state);

      expect(result.wheelEnriched).toBeDefined();
      expect(result.relationalGuidance).toBeDefined();
      expect(typeof result.ceremonyRequired).toBe("boolean");
    });

    it("northNode should build action stack", async () => {
      let state = createInitialState("Research. Build. Test.");
      state = { ...state, ...await eastNode(state) };
      state = { ...state, ...southNode(state) };
      const result = northNode(state);

      expect(result.decomposition).toBeDefined();
      expect(result.status).toBe("complete");
    });
  });

  describe("full pipeline", () => {
    it("should run the complete pipeline", async () => {
      const graph = new DecompositionGraph();
      const state = await graph.invoke(
        "Investigate the existing codebase. Design the architecture. Build the implementation. Test everything."
      );

      expect(state.status).toBe("complete");
      expect(state.directionalAnalysis).toBeDefined();
      expect(state.intentResult).toBeDefined();
      expect(state.decomposition).toBeDefined();
      expect(state.decomposition!.actionStack.length).toBeGreaterThan(0);
    });

    it("should detect ceremony requirements", async () => {
      const graph = new DecompositionGraph();
      const state = await graph.invoke(
        "Build code. Deploy code. Ship it. Execute now."
      );

      // Should have relational guidance
      expect(state.relationalGuidance).toBeDefined();
    });

    it("should halt at ceremony when enforced", async () => {
      const graph = new DecompositionGraph({ enforeCeremony: true });
      const state = await graph.invoke(
        "Build code. Ship immediately. Deploy now. Execute."
      );

      // If ceremony is required, should be in ceremony_hold
      if (state.ceremonyRequired) {
        expect(state.status).toBe("ceremony_hold");
        expect(state.decomposition).toBeNull();
      }
    });

    it("should produce results with session ID", async () => {
      const graph = new DecompositionGraph();
      const state = await graph.invoke("Research and build.", "session-123");
      expect(state.sessionId).toBe("session-123");
    });
  });
});
