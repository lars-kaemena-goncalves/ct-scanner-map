const sources = [
  { iata: "STR", url: "https://www.stuttgart-airport.com/de/reisende-besucher/fliegen/rund-ums-fliegen/sicherheitskontrolle", selector: "#main .text-media__copy" },
  { iata: "FRA", url: "https://www.frankfurt-airport.com/de/reisevorbereitung/check-in-gepaeck-und-kontrollen/sicherheitskontrolle.html", selector: "#main-content" },
  { iata: "MUC", url: "https://www.munich-airport.de/sicherheits-und-passkontrolle-3897036", selector: "#main .cms-content-rows" },
];

const KEYWORDS = ["CT-Scanner", "CT Scanner", "Computertomograph", "100 ml", "100ml"];

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "ct-scanner-map/0.1 (learning project)" },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.text();
}

function findKeywords(html) {
  const lower = html.toLowerCase();
  return KEYWORDS.filter((word) => lower.includes(word.toLowerCase()));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  for (const source of sources) {
    try {
      const html = await fetchPage(source.url);
      const hits = findKeywords(html);
      console.log(`${source.iata}  ${html.length} chars  hits: ${hits.length > 0 ? hits.join(", ") : "none"}`);
    } catch (error) {
      console.log(`${source.iata}  FAILED: ${error.message}`);
    }
    await sleep(3000);
  }
}

main();