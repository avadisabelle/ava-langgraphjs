/**
 * AvaLangStack — Narrative Intelligence Pipeline Demo
 *
 * This example demonstrates the langgraphjs narrative intelligence
 * components processing development events through the Three Universe
 * lens and analyzing narrative coherence.
 *
 * Scenario: A development team goes through a sprint with three events:
 *   1. A PR is created (Engineer-dominant)
 *   2. A ceremony is held (Ceremony-dominant)
 *   3. A story beat is generated (StoryEngine-dominant)
 *
 * Each event is processed through the ThreeUniverseProcessor, which
 * produces per-universe perspectives and a synthesized analysis.
 * Then the NarrativeCoherenceEngine evaluates the resulting story beats
 * for structural, thematic, and character consistency.
 *
 * All processing is keyword-based — zero LLM dependency.
 *
 * Run with:
 *   npx tsx examples/avalangstack/narrative_pipeline_demo.ts
 */

// ---------------------------------------------------------------------------
// Imports from @ava/narrative-intelligence
// ---------------------------------------------------------------------------

import {
  ThreeUniverseProcessor,
  NarrativeCoherenceEngine,
  EventType,
  createStoryBeat,
  createCharacterState,
  createThematicThread,
  NarrativeFunction,
  NarrativePhase,
  Universe,
  type ThreeUniverseAnalysis,
  type CoherenceResult,
  type StoryBeat,
  type CharacterState,
  type ThematicThread,
} from "ava-langgraph-narrative-intelligence";

// ═══════════════════════════════════════════════════════════════════════════
// 1. Initialize the Three-Universe Processor
// ═══════════════════════════════════════════════════════════════════════════

console.log("═".repeat(72));
console.log("  1. THREE-UNIVERSE PROCESSOR — Initialization");
console.log("═".repeat(72));
console.log();

const processor = new ThreeUniverseProcessor();
console.log("  ThreeUniverseProcessor created (keyword-based, no LLM).");
console.log();

// ═══════════════════════════════════════════════════════════════════════════
// 2. Process Event 1 — PR Created (Engineer-dominant)
//
//    A pull request is opened to extract the user service from the
//    monolith. This should be recognized primarily by the Engineer
//    universe (Mia).
// ═══════════════════════════════════════════════════════════════════════════

console.log("═".repeat(72));
console.log("  2. EVENT 1 — Pull Request Created");
console.log("═".repeat(72));
console.log();

const prEvent = {
  eventId: "pr-001",
  content:
    "feat: Extract user-management service from monolith\n\n" +
    "This PR implements the API boundary for the new user service. " +
    "Includes schema migration, new REST endpoints for authentication, " +
    "and integration tests. Refactors the existing auth module to call " +
    "the new service via HTTP. CI pipeline updated with the new build target.",
  payload: {
    pull_request: {
      title: "feat: Extract user-management service from monolith",
      body:
        "Implements API boundary, schema migration, REST endpoints, " +
        "integration tests, and CI pipeline updates.",
    },
  },
};

const analysis1: ThreeUniverseAnalysis = processor.process(
  prEvent,
  EventType.GITHUB_PR
);

console.log(`  Event: PR #001 — "${prEvent.content.slice(0, 60)}..."`);
console.log(`  Lead Universe: ${analysis1.leadUniverse}`);
console.log(`  Coherence Score: ${(analysis1.coherenceScore * 100).toFixed(1)}%`);
console.log();
console.log("  Engineer (Mia):");
console.log(`    Intent: ${analysis1.engineer.intent}`);
console.log(`    Confidence: ${(analysis1.engineer.confidence * 100).toFixed(0)}%`);
console.log();
console.log("  Ceremony (Ava8):");
console.log(`    Intent: ${analysis1.ceremony.intent}`);
console.log(`    Confidence: ${(analysis1.ceremony.confidence * 100).toFixed(0)}%`);
console.log();
console.log("  Story Engine (Miette):");
console.log(`    Intent: ${analysis1.storyEngine.intent}`);
console.log(`    Confidence: ${(analysis1.storyEngine.confidence * 100).toFixed(0)}%`);
console.log();

// ═══════════════════════════════════════════════════════════════════════════
// 3. Process Event 2 — Ceremony Held (Ceremony-dominant)
//
//    The team holds a retrospective ceremony to witness the first
//    service extraction and express gratitude for the monolith.
// ═══════════════════════════════════════════════════════════════════════════

console.log("═".repeat(72));
console.log("  3. EVENT 2 — Ceremony / Retrospective");
console.log("═".repeat(72));
console.log();

const ceremonyEvent = {
  eventId: "ceremony-001",
  content:
    "The team gathered together for a retrospective ceremony. We paused to " +
    "acknowledge the monolith that carried us to this point. Each person " +
    "expressed gratitude for what we built together as a community. " +
    "Tushell led the circle, asking us to reflect and witness each other's " +
    "contributions. We celebrate the milestone of the first service extraction. " +
    "Consent was renewed for continuing the migration journey.",
};

const analysis2: ThreeUniverseAnalysis = processor.process(
  ceremonyEvent,
  EventType.USER_INPUT
);

console.log(`  Event: Ceremony — "${ceremonyEvent.content.slice(0, 60)}..."`);
console.log(`  Lead Universe: ${analysis2.leadUniverse}`);
console.log(`  Coherence Score: ${(analysis2.coherenceScore * 100).toFixed(1)}%`);
console.log();
console.log("  Engineer (Mia):");
console.log(`    Intent: ${analysis2.engineer.intent}`);
console.log(`    Confidence: ${(analysis2.engineer.confidence * 100).toFixed(0)}%`);
console.log();
console.log("  Ceremony (Ava8):");
console.log(`    Intent: ${analysis2.ceremony.intent}`);
console.log(`    Confidence: ${(analysis2.ceremony.confidence * 100).toFixed(0)}%`);
console.log();
console.log("  Story Engine (Miette):");
console.log(`    Intent: ${analysis2.storyEngine.intent}`);
console.log(`    Confidence: ${(analysis2.storyEngine.confidence * 100).toFixed(0)}%`);
console.log();

// ═══════════════════════════════════════════════════════════════════════════
// 4. Process Event 3 — Story Beat Generated (StoryEngine-dominant)
//
//    Miette generates a narrative beat chronicling the extraction as
//    a character-arc moment.
// ═══════════════════════════════════════════════════════════════════════════

console.log("═".repeat(72));
console.log("  4. EVENT 3 — Story Beat Generation");
console.log("═".repeat(72));
console.log();

const storyEvent = {
  eventId: "beat-001",
  content:
    "Chapter 3: The First Extraction. The monolith, once a towering " +
    "protagonist, ceded its first responsibility to the fledgling user " +
    "service. The arc shifted — from a single character bearing all weight " +
    "to an ensemble sharing the narrative burden. Tension climbed as the " +
    "team questioned whether the new service could stand on its own. " +
    "The story demanded a resolution scene before the next episode could begin.",
};

const analysis3: ThreeUniverseAnalysis = processor.process(
  storyEvent,
  EventType.AGENT_ACTION
);

console.log(`  Event: Story Beat — "${storyEvent.content.slice(0, 60)}..."`);
console.log(`  Lead Universe: ${analysis3.leadUniverse}`);
console.log(`  Coherence Score: ${(analysis3.coherenceScore * 100).toFixed(1)}%`);
console.log();
console.log("  Engineer (Mia):");
console.log(`    Intent: ${analysis3.engineer.intent}`);
console.log(`    Confidence: ${(analysis3.engineer.confidence * 100).toFixed(0)}%`);
console.log();
console.log("  Ceremony (Ava8):");
console.log(`    Intent: ${analysis3.ceremony.intent}`);
console.log(`    Confidence: ${(analysis3.ceremony.confidence * 100).toFixed(0)}%`);
console.log();
console.log("  Story Engine (Miette):");
console.log(`    Intent: ${analysis3.storyEngine.intent}`);
console.log(`    Confidence: ${(analysis3.storyEngine.confidence * 100).toFixed(0)}%`);
console.log();

// ═══════════════════════════════════════════════════════════════════════════
// 5. Narrative Coherence Analysis
//
//    We create story beats, characters, and themes from the three events,
//    then run the NarrativeCoherenceEngine to assess overall coherence.
// ═══════════════════════════════════════════════════════════════════════════

console.log("═".repeat(72));
console.log("  5. NARRATIVE COHERENCE ENGINE");
console.log("═".repeat(72));
console.log();

// Create story beats from our events
const beats: StoryBeat[] = [
  createStoryBeat(
    "beat-setup",
    1,
    "The monolith stands alone, carrying the full weight of the system. " +
    "The team recognizes it can no longer scale.",
    NarrativeFunction.SETUP,
    1,
    {
      emotionalTone: "tense",
      leadUniverse: Universe.ENGINEER,
      thematicTags: ["technical-debt", "migration"],
      characterId: "monolith",
      characterArcImpact: 0.3,
    }
  ),
  createStoryBeat(
    "beat-discovery",
    2,
    "Through ceremony, the team discovers that the migration is not just " +
    "technical — it is relational. Each service represents a transfer of trust.",
    NarrativeFunction.DISCOVERY,
    1,
    {
      emotionalTone: "reflective",
      leadUniverse: Universe.CEREMONY,
      thematicTags: ["ceremony", "trust", "migration"],
      characterId: "team",
      characterArcImpact: 0.5,
    }
  ),
  createStoryBeat(
    "beat-confrontation",
    3,
    "The first service is extracted. Tension peaks as integration tests " +
    "reveal unexpected coupling. The story demands resolution.",
    NarrativeFunction.CONFRONTATION,
    2,
    {
      emotionalTone: "dramatic",
      leadUniverse: Universe.STORY_ENGINE,
      thematicTags: ["extraction", "tension", "coupling"],
      characterId: "user-service",
      characterArcImpact: 0.7,
    }
  ),
];

// Create characters
const characters: CharacterState[] = [
  createCharacterState("monolith", "The Monolith", "guardian", Universe.ENGINEER, {
    initialState: "Carrying all responsibilities alone",
    currentState: "Beginning to delegate to new services",
    arcPosition: 0.4,
    growthPoints: ["accepted delegation", "survived first extraction"],
    relationships: ["parent-of:user-service", "maintained-by:team"],
  }),
  createCharacterState("team", "The Team", "collective-hero", Universe.CEREMONY, {
    initialState: "Siloed, working in isolation",
    currentState: "United through ceremony, sharing trust",
    arcPosition: 0.5,
    growthPoints: ["held first ceremony", "renewed consent"],
    relationships: ["maintains:monolith", "creates:user-service"],
  }),
  createCharacterState("user-service", "User Service", "emerging-hero", Universe.ENGINEER, {
    initialState: "Does not exist",
    currentState: "Extracted, facing integration challenges",
    arcPosition: 0.3,
    growthPoints: ["born from monolith"],
    relationships: ["child-of:monolith", "created-by:team"],
  }),
];

// Create thematic threads
const themes: ThematicThread[] = [
  createThematicThread(
    "theme-migration",
    "Migration as Journey",
    "The migration from monolith to microservices as a narrative journey " +
    "with ceremonies, crises, and resolution.",
    {
      strength: 0.8,
      tensionLevel: 0.7,
      resolutionProgress: 0.2,
      beatIds: ["beat-setup", "beat-discovery", "beat-confrontation"],
    }
  ),
  createThematicThread(
    "theme-trust",
    "Trust Transfer",
    "Trust as a relational resource that must be deliberately transferred " +
    "from the monolith to each new service through ceremony.",
    {
      strength: 0.6,
      tensionLevel: 0.5,
      resolutionProgress: 0.3,
      beatIds: ["beat-discovery"],
    }
  ),
];

console.log(`  Story Beats: ${beats.length}`);
for (const beat of beats) {
  console.log(
    `    [${beat.sequence}] ${beat.narrativeFunction.toUpperCase()} — ` +
    `"${beat.content.slice(0, 60)}..." ` +
    `(tone: ${beat.emotionalTone}, lead: ${beat.leadUniverse})`
  );
}
console.log();

console.log(`  Characters: ${characters.length}`);
for (const char of characters) {
  console.log(
    `    ${char.name} (${char.archetype}) — arc position: ${char.arcPosition}`
  );
}
console.log();

console.log(`  Themes: ${themes.length}`);
for (const theme of themes) {
  console.log(
    `    "${theme.name}" — strength: ${theme.strength}, ` +
    `tension: ${theme.tensionLevel}, resolution: ${theme.resolutionProgress}`
  );
}
console.log();

// Run coherence analysis
const engine = new NarrativeCoherenceEngine();
const result = engine.analyze(beats, characters, themes) as CoherenceResult;

console.log("  Coherence Scores:");
console.log(`    Overall:               ${result.coherenceScore.overall.toFixed(1)}`);
console.log(`    Narrative Flow:        ${result.coherenceScore.narrativeFlow.score.toFixed(1)} (${result.coherenceScore.narrativeFlow.status})`);
console.log(`    Character Consistency: ${result.coherenceScore.characterConsistency.score.toFixed(1)} (${result.coherenceScore.characterConsistency.status})`);
console.log(`    Pacing:                ${result.coherenceScore.pacing.score.toFixed(1)} (${result.coherenceScore.pacing.status})`);
console.log(`    Theme Saturation:      ${result.coherenceScore.themeSaturation.score.toFixed(1)} (${result.coherenceScore.themeSaturation.status})`);
console.log(`    Continuity:            ${result.coherenceScore.continuity.score.toFixed(1)} (${result.coherenceScore.continuity.status})`);
console.log();

// ═══════════════════════════════════════════════════════════════════════════
// 6. Gaps & Trinity Assessment
// ═══════════════════════════════════════════════════════════════════════════

console.log("═".repeat(72));
console.log("  6. GAPS & TRINITY ASSESSMENT");
console.log("═".repeat(72));
console.log();

if (result.gaps.length === 0) {
  console.log("  No narrative gaps identified.");
} else {
  console.log(`  Gaps Found: ${result.gaps.length}`);
  for (const gap of result.gaps) {
    console.log(
      `    [${gap.severity.toUpperCase()}] ${gap.gapType}: ${gap.description}`
    );
    console.log(`      Route to: ${gap.suggestedRoute}`);
  }
}
console.log();

console.log("  Trinity Assessment:");
console.log(`    🧠 Mia (Structure):  ${result.trinityAssessment.mia}`);
console.log(`    🌸 Miette (Emotion): ${result.trinityAssessment.miette}`);
console.log(`    🎨 Ava8 (Sensory):   ${result.trinityAssessment.ava8}`);
console.log();

if (result.trinityAssessment.priorities.length > 0) {
  console.log("  Priorities:");
  for (const priority of result.trinityAssessment.priorities) {
    console.log(`    → ${priority}`);
  }
  console.log();
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. Summary
// ═══════════════════════════════════════════════════════════════════════════

console.log("═".repeat(72));
console.log("  7. SUMMARY");
console.log("═".repeat(72));
console.log();
console.log("  Three events processed through Three Universe lenses:");
console.log(`    Event 1 (PR):       Lead = ${analysis1.leadUniverse}`);
console.log(`    Event 2 (Ceremony): Lead = ${analysis2.leadUniverse}`);
console.log(`    Event 3 (Story):    Lead = ${analysis3.leadUniverse}`);
console.log();
console.log(`  Narrative coherence: ${result.coherenceScore.overall.toFixed(1)}/100`);
console.log(`  Gaps identified: ${result.gaps.length}`);
console.log();
console.log("  Done. All components exercised with zero LLM calls.");
console.log();
