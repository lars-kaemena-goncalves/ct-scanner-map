// scripts/check-sources.js
// Checks airport security pages for CT scanner keywords.
// Modul 2: fetches whole pages. Modul 5 will apply the selectors via Cheerio.

const fs = require("node:fs");
const path = require("node:path");

const SCRIPT_VERSION = "0.2.0";

const sources = [
  {
    iata: "STR",
    name: "Stuttgart",
    url: "https://www.stuttgart-airport.com/de/reisende-besucher/fliegen/rund-ums-fliegen/sicherheitskontrolle",
    selector: "#main .text-media__copy",
  },
  {
    iata: "FRA",
    name: "Frankfurt",
    url: "https://www.frankfurt-airport.com/de/reisevorbereitung/check-in-gepaeck-und-kontrollen/sicherheitskontrolle.html",
    selector: "#main-content",
  },
  {
    iata: "MUC",
    name: "Munich",
    url: "https://www.munich-airport.de/sicherheits-und-passkontrolle-3897036",
    selector: "#main .cms-content-rows",
  },
];

// Strong signals: presence implies the page actually discusses CT scanners.
const KEYWORDS_CT = ["CT-Scanner", "CT Scanner", "Computertomograph", "Röntgen"];

// Weak signals: presence only implies the page is topically relevant.
const KEYWORDS_CONTEXT = ["100 ml", "100ml", "Handgepäck", "Flüssigkeit"];

const DELAY_MS = 3000;
const TIMEOUT_MS = 15000;
const USER_AGENT = "ct-scanner-map/0.2 (learning project)";
const OUTPUT_FILE = path.join(__dirname, "..", "data", "check-results.json");

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.text();
}

// Counts occurrences, not just presence. Ten mentions is a stronger
// signal than one, and one may well be a false positive.
function countKeywords(html, keywords) {
  const lower = html.toLowerCase();
  const found = {};
  for (const word of keywords) {
    const count = lower.split(word.toLowerCase()).length - 1;
    if (count > 0) {
      found[word] = count;
    }
  }
  return found;
}

// Sanity check: confirms we landed on the page we meant to fetch.
function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : "(no title)";
}

function formatHits(hits) {
  const entries = Object.entries(hits);
  if (entries.length === 0) {
    return "none";
  }
  return entries.map(([word, count]) => `${word} (${count})`).join(", ");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkSource(source) {
  const html = await fetchPage(source.url);
  const ct = countKeywords(html, KEYWORDS_CT);
  const context = countKeywords(html, KEYWORDS_CONTEXT);

  return {
    iata: source.iata,
    name: source.name,
    url: source.url,
    ok: true,
    title: extractTitle(html),
    length: html.length,
    ct,
    context,
    // WARN, not OK: absence of CT keywords is not a confirmed "no".
    status: Object.keys(ct).length > 0 ? "OK" : "WARN",
  };
}

function printResult(result) {
  if (!result.ok) {
    console.log(`FAIL ${result.iata}  ${result.error}`);
    return;
  }
  console.log(`${result.status.padEnd(4)} ${result.iata}  ${result.length} chars`);
  console.log(`     title:   ${result.title}`);
  console.log(`     ct:      ${formatHits(result.ct)}`);
  console.log(`     context: ${formatHits(result.context)}`);
}

function saveResults(results) {
  const payload = {
    scriptVersion: SCRIPT_VERSION,
    runAt: new Date().toISOString(),
    results,
  };
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), "utf8");
  console.log(`\nSaved to ${OUTPUT_FILE}`);
}

async function main() {
  console.log(`check-sources v${SCRIPT_VERSION}`);
  console.log(`Checking ${sources.length} sources\n`);

  const results = [];

  for (const source of sources) {
    try {
      const result = await checkSource(source);
      results.push(result);
      printResult(result);
    } catch (error) {
      const result = { iata: source.iata, url: source.url, ok: false, error: error.message };
      results.push(result);
      printResult(result);
    }
    await sleep(DELAY_MS);
  }

  const ok = results.filter((r) => r.status === "OK").length;
  const warn = results.filter((r) => r.status === "WARN").length;
  const fail = results.filter((r) => !r.ok).length;
  console.log(`\nSummary: ${ok} ok, ${warn} warn, ${fail} failed`);

  saveResults(results);
}

main();