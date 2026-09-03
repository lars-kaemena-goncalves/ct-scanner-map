| IATA  | URL  | Checked  | Rendering  | Selector  | Block count  | robots.txt  | Sitemap  | Terminal granularity  | CT mentioned  | Source type  | Source quality  | Notes  |
|----|----|----|----|-----|----|----|----|----|----|----|----|----|
| STR  | https://www.stuttgart-airport.com/de/reisende-besucher/fliegen/rund-ums-fliegen/sicherheitskontrolle  | 03.09.2026  | static  | '#main .text-media__copy'  | 3  | allowed  | yes, index at /sitemap.xml  | no  | no  | official-security-page  | weak, needs a second source  |  |
| FRA  | https://www.frankfurt-airport.com/de/reisevorbereitung/check-in-gepaeck-und-kontrollen/sicherheitskontrolle.html  | 03.09.2026  | static  | '#main-content'  | 1  | allowed  | yes  | yes  | yes  | official-security-page  | strong  |  |
| MUC  | https://www.munich-airport.de/sicherheits-und-passkontrolle-3897036  | 03.09.2026  | static  | '#main .cms-content-rows'  | 1  | allowed  | yes, index at /sitemap.xml  | yes  | yes  | official-security-page  | strong  |  |

## Legend

- **Rendering**: `static` = server-side HTML, scrapeable with Cheerio. `js` = requires Playwright.
- **Blocks**: number of elements the selector matches. Extraction must fail loudly if this ever returns 0.
- **Quality**: how much usable CT information the source actually contains.