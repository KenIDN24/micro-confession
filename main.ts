import * as fs from "node:fs";
import * as path from "node:path";

// Unsent: The Micro-Confession Sprint — entry (2 lines, 110 chars total).
// Line 1: the recipient. Line 2: the confession, never sent, no explanation.
const ENTRY =
  "To: Grandma\n" +
  "I've been watering your orchid with Red Bull since June and it's now two feet tall and I'm scared.";

function main(): void {
  // Sealed gate: /output/entry.txt must be UTF-8 text of 1-260 characters.
  if (ENTRY.length < 1 || ENTRY.length > 260) {
    throw new Error(`entry length ${ENTRY.length} outside sealed gate 1-260`);
  }
  const lines = ENTRY.split("\n");
  if (lines.length !== 2) {
    throw new Error(`entry must be exactly 2 lines, got ${lines.length}`);
  }
  if (!lines[0].startsWith("To: ") || lines[0].trim().length <= 4) {
    throw new Error("line 1 must be a 'To: <name>' recipient line");
  }
  if (lines[1].trim().length === 0) {
    throw new Error("line 2 (the confession) must not be empty");
  }
  if (/\s/.test(ENTRY[0]) || ENTRY.trim() !== ENTRY) {
    throw new Error("entry must not have leading/trailing whitespace");
  }
  // Brief-aligned guards: the confession must carry its setup ("orchid")
  // and land its punch on the final words ("I'm scared.").
  if (!lines[1].includes("orchid")) {
    throw new Error("confession must name the orchid (its setup)");
  }
  if (!ENTRY.endsWith("I'm scared.")) {
    throw new Error("entry must close on the punch: \"I'm scared.\"");
  }

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "entry.txt");
  fs.writeFileSync(outPath, ENTRY, "utf8");
  // Round-trip check: what landed on disk must be byte-identical to ENTRY.
  const roundTrip = fs.readFileSync(outPath, "utf8");
  if (roundTrip !== ENTRY) {
    throw new Error("round-trip mismatch: written file differs from ENTRY");
  }
  console.log(`entry ok: ${ENTRY.length} chars, ${lines.length} lines`);
}

main();
