// Checks airport security pages for CT scanner keywords.
// Modul 2: fetches whole pages. Modul 5 will apply the selectors via Cheerio.

const sources = [
  {
    iata: "STR",
    url: "https://www.stuttgart-airport.com/de/reisende-besucher/fliegen/rund-ums-fliegen/sicherheitskontrolle",
    selector: "#main .text-media__copy",
  },
  {
    iata: "FRA",
    url: "https://www.frankfurt-airport.com/de/reisevorbereitung/check-in-gepaeck-und-kontrollen/sicherheitskontrolle.html",
    selector: "#main-content",
  },
  {
    iata: "MUC",
    url: "https://www.munich-airport.de/sicherheits-und-passkontrolle-3897036",
    selector: "#main .cms-content-rows",
  },
];

// Strong signals: presence implies the page actually discusses CT scanners.
const KEYWORDS_CT = ["CT-Scanner", "CT Scanner", "Computertomograph", "Röntgen"];

// Weak signals: presence only implies the page is topically relevant.
const KEYWORDS_CONTEXT = ["100 ml", "100ml", "Handgepäck", "Flüssigkeit"];

const DELAY_MS = 3000;
const USER_AGENT = "ct-scanner-map/0.1 (learning project)";

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.text();
}

function findKeywords(html, keywords) {
  const lower = html.toLowerCase();
  return keywords.filter((word) => lower.includes(word.toLowerCase()));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatList(items) {
  return items.length > 0 ? items.join(", ") : "none";
}

async function checkSource(source) {
  const html = await fetchPage(source.url);
  const ctHits = findKeywords(html, KEYWORDS_CT);
  const contextHits = findKeywords(html, KEYWORDS_CONTEXT);

  // WARN, not OK: an absence of CT keywords is not a confirmed "no".
  const status = ctHits.length > 0 ? "OK  " : "WARN";

  console.log(`${status} ${source.iata}  ${html.length} chars`);
  console.log(`       ct:      ${formatList(ctHits)}`);
  console.log(`       context: ${formatList(contextHits)}`);
}

async function main() {
  console.log(`Checking ${sources.length} sources\n`);

  for (const source of sources) {
    try {
      await checkSource(source);
    } catch (error) {
      console.log(`FAIL ${source.iata}  ${error.message}`);
    }
    await sleep(DELAY_MS);
  }

  console.log("\nDone");
}

main();