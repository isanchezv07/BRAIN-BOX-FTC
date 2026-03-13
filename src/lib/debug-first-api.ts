import { getFullTeamIntelligence } from "./ftc.js";

const TEAM = "16818";

function normalizeLevel(level: string) {
  const l = String(level || "").toLowerCase();

  if (l.includes("practice")) return "practice";
  if (l.includes("qual")) return "qual";
  if (l.includes("playoff")) return "playoff";

  return "other";
}

async function run() {

  console.log("Fetching FIRST API...\n");

  const data = await getFullTeamIntelligence(TEAM);

  console.log("PROFILE");
  console.log(data.profile);

  console.log("\nSUMMARY");
  console.log(data.summary);

  console.log("\n==============================");
  console.log("SEASONS + EVENTS");
  console.log("==============================");

  data.history.forEach(season => {

    console.log(`\nSEASON ${season.season}`);

    season.events.forEach(e => {
      console.log(`EVENT: ${e.code} | ${e.name}`);
    });

  });

  console.log("\n==============================");
  console.log("MATCHES BY EVENT");
  console.log("==============================");

  const matches = data.history.flatMap(s => s.matches);

  const events: Record<string, any[]> = {};

  matches.forEach(m => {

    const event = m.eventCode || "UNKNOWN";

    if (!events[event]) {
      events[event] = [];
    }

    events[event].push(m);

  });

  Object.entries(events).forEach(([event, evMatches]) => {

    console.log(`\nEVENT ${event}`);
    console.log(`Total matches: ${evMatches.length}`);

    const practice: number[] = [];
    const quals: number[] = [];
    const playoffs: string[] = [];

    evMatches.forEach(m => {

      const level = normalizeLevel(m.tournamentLevel);

      if (level === "practice") practice.push(m.matchNumber);
      if (level === "qual") quals.push(m.matchNumber);
      if (level === "playoff") playoffs.push(`S${m.series}-M${m.matchNumber}`);

    });

    console.log("Practice:", practice.join(", ") || "none");
    console.log("Quals:", quals.join(", ") || "none");
    console.log("Playoffs:", playoffs.join(", ") || "none");

  });

}

run();