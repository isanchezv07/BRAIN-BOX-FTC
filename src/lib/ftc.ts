// src/lib/ftc.ts

async function safeFetch(url: string, options: any = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    console.error("Fetch error:", url, err);
    return null;
  } finally {
    clearTimeout(id);
  }
}

export async function getFullTeamIntelligence(teamNumber: string) {

  const SEASONS = ["2025", "2024", "2023", "2022"];

  const USERNAME = import.meta.env.FIRST_USERNAME;
  const AUTH_TOKEN = import.meta.env.FIRST_AUTH_TOKEN;

  const auth = Buffer.from(`${USERNAME}:${AUTH_TOKEN}`).toString("base64");

  const headers = {
    Authorization: `Basic ${auth}`,
    Accept: "application/json",
    "User-Agent": "Astro-FTC-Intel-v4"
  };

  const fetchSeasonData = async (season: string) => {

    try {

      const baseUrl = `https://ftc-api.firstinspires.org/v2.0/${season}`;

      // --------------------------------
      // 1. EVENTOS DEL EQUIPO
      // --------------------------------

      const evRes = await safeFetch(
        `${baseUrl}/events?teamNumber=${teamNumber}`,
        { headers }
      );

      const eventsData = evRes?.ok ? await evRes.json() : { events: [] };
      const events = eventsData.events || [];

      // --------------------------------
      // 2. MATCHES Y AWARDS POR EVENTO
      // --------------------------------

      const eventDetailsPromises = events.map(async (event: any) => {

        const [mRes, aRes] = await Promise.all([
          safeFetch(`${baseUrl}/matches/${event.code}?teamNumber=${teamNumber}`, { headers }),
          safeFetch(`${baseUrl}/awards/${event.code}/${teamNumber}`, { headers })
        ]);

        const mData = mRes?.ok ? await mRes.json() : { matches: [] };
        const aData = aRes?.ok ? await aRes.json() : { awards: [] };
        
        const matchesWithEvent = (mData.matches || []).map((m: any) => ({
          ...m,
          eventCode: event.code
        }));

        return {
          matches: matchesWithEvent,
          awards: aData.awards || []
        };

      });

      const results = await Promise.allSettled(eventDetailsPromises);

      const details = results
        .filter(r => r.status === "fulfilled")
        .map((r: any) => r.value);

      const allMatches = details.flatMap(d => d.matches);
      const allAwards = details.flatMap(d => d.awards);

      // --------------------------------
      // 3. PROCESAR MATCHES
      // --------------------------------

      let wins = 0;
      let losses = 0;
      let ties = 0;
      let highestScore = 0;

      const processedMatches = allMatches.map((m: any) => {

        const teamInMatch = m.teams?.find((t: any) => t.teamNumber == teamNumber);
        const isRed = teamInMatch?.station?.includes("Red");

        const myScore = isRed ? m.scoreRedFinal : m.scoreBlueFinal;
        const oppScore = isRed ? m.scoreBlueFinal : m.scoreRedFinal;

        if (myScore > highestScore) highestScore = myScore;

        let result = "LOSS";

        if (myScore > oppScore) {
          result = "WIN";
          wins++;
        } else if (myScore === oppScore) {
          result = "TIE";
          ties++;
        } else {
          losses++;
        }

        return {
          ...m,
          teamSide: isRed ? "RED" : "BLUE",
          result
        };

      });

      return {
        season,
        events,
        matches: processedMatches,
        awards: allAwards,
        stats: {
          wins,
          losses,
          ties,
          highestScore
        }
      };

    } catch (e) {

      console.error(`Error en ${season}:`, e);

      return {
        season,
        events: [],
        matches: [],
        awards: [],
        stats: {
          wins: 0,
          losses: 0,
          ties: 0,
          highestScore: 0
        }
      };

    }

  };

  // --------------------------------
  // HISTORIAL DE TEMPORADAS
  // --------------------------------

  const history = await Promise.all(
    SEASONS.map(season => fetchSeasonData(season))
  );

  // --------------------------------
  // PERFIL DEL EQUIPO
  // --------------------------------

  let profile = null;

  for (const s of SEASONS) {

    const res = await safeFetch(
      `https://ftc-api.firstinspires.org/v2.0/${s}/teams?teamNumber=${teamNumber}`,
      { headers }
    );

    if (res?.ok) {

      const data = await res.json();

      if (data.teams?.[0]) {
        profile = data.teams[0];
        break;
      }

    }

  }

  // --------------------------------
  // SUMMARY
  // --------------------------------

  const totalWins = history.reduce((acc, s) => acc + s.stats.wins, 0);
  const totalLosses = history.reduce((acc, s) => acc + s.stats.losses, 0);
  const totalAwards = history.reduce((acc, s) => acc + s.awards.length, 0);

  const peakScore = Math.max(
    0,
    ...history.map(s => s.stats.highestScore)
  );

  return {

    profile,

    history,

    summary: {
      totalWins,
      totalLosses,
      totalAwards,
      peakScore,
      bestRank: "N/A",

      winRate:
        (totalWins + totalLosses) > 0
          ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
          : "0"

    }

  };

}

export async function compareTeams(teamNumbers: string[]) {
  const teamsData = await Promise.all(
    teamNumbers.map(team => getFullTeamIntelligence(team))
  );
  return teamsData;
}