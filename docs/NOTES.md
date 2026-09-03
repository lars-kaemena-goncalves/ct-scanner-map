| airport | iata | icao | terminal | area | checkpoint | type | ct_scanner | liquids_lifted | source_type | source | observed_at | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Munich | MUC | EDDM | Terminal 2 | | Zentrale Sicherheitskontrolle | main | yes | no | official-security-page | https://www.munich-airport.de/sicherheits-und-passkontrolle-3897036 | 2026-09-03 | |
| Munich | MUC | EDDM | Terminal 1 | Modul D, Ebene 5 | Sicherheitskontrolle | main | yes | no | official-security-page | https://www.munich-airport.de/sicherheits-und-passkontrolle-3897036 | 2026-09-03 | |
| Munich | MUC | EDDM | Terminal 1 | Pier | Sicherheitskontrolle | main | yes | no | official-security-page | https://www.munich-airport.de/sicherheits-und-passkontrolle-3897036 | 2026-09-03 | |
| Stuttgart | STR | EDDS | Terminal 1 | | Sicherheitskontrolle | main | yes | no | personal-observation | own visit | 2026-08-11 | |
| Stuttgart | STR | EDDS | Terminal 2 | | Sicherheitskontrolle | main | no | no | personal-observation | own visit | 2026-08-11 | |
| Stuttgart | STR | EDDS | Terminal 2 | | Fastlane | fastlane | no | no | personal-observation | own visit | 2026-08-11 | |
Stuttgart | STR | EDDS | Terminal 2 | | Smart Lane | smartlane | no | no | personal-observation | own visit | 2026-08-11 | The STR Smart Lane allows you to book a specific time slot for security screening free of charge, saving you time. Reservations can be made from 72 hours up to 3 hours before departure. The Smart Lane is open daily from 4:00 a.m. to 7:00 p.m. |
| Stuttgart | STR | EDDS | Terminal 3 | | Sicherheitskontrolle | main | yes | no | personal-observation | own visit | 2026-08-11 | |
| Stuttgart | STR | EDDS | Terminal 4 | | Sicherheitskontrolle | main | no | no | personal-observation | own visit | 2026-08-11 | Terminal 4 is physically separated from the other terminals. Therefore, passengers departing from Terminal 4 must pass through this security checkpoint. |
| Porto | OPO | LPPR | Terminal 1 | | Main security | main | no | no | personal-observation | own visit | 2026-08-18 | |
| Porto | OPO | LPPR | Terminal 1 | | Fastlane | fastlane | yes | no | personal-observation | own visit | 2026-08-18 | |
| Wrocław | WRO | EPWR | Main Terminal | | Main security | main | no | no | personal-observation | own visit | 2026-09-02 | |
| Wrocław | WRO | EPWR | Main Terminal | | Fastlane | fastlane | no | no | personal-observation | own visit | 2026-09-02 | |
| Memmingen | FMM | EDJA | Main Terminal | | Main security | main | no | no | official-security-page | https://www.memmingen-airport.de/fliegen/sicherheits-und-passkontrolle/ | 2026-09-03 | |
| Memmingen | FMM | EDJA | Main Terminal | | Fastlane | fastlane | no | no | official-security-page | https://www.memmingen-airport.de/fliegen/sicherheits-und-passkontrolle/ | 2026-09-03 | |

## Legend

Manually researched observations, one row per security checkpoint.
This file is a research log, not a data source for the application.
It seeds the initial database in Modul 4 and serves as a reference set
for validating the scraper in Modul 5.

### Columns

| Column | Meaning |
|---|---|
| `airport` | Common airport name in English. |
| `iata` | 3-letter IATA code. May be empty for airports without one. |
| `icao` | 4-letter ICAO code. Join key against the airportsdata reference set. |
| `terminal` | Terminal as officially named by the airport, e.g. `Terminal 2`. |
| `area` | Optional subdivision within a terminal: module, pier, level. Empty if not applicable. |
| `checkpoint` | Local official name as shown on signage, e.g. `Zentrale Sicherheitskontrolle`. Human-facing. |
| `type` | Machine-readable checkpoint category. See below. |
| `ct_scanner` | Does this checkpoint use CT scanners? `yes` / `no` / `unknown`. |
| `liquids_lifted` | Is the 100 ml liquid limit lifted at this checkpoint? `yes` / `no` / `unknown`. |
| `source_type` | Kind of evidence. See below. |
| `source` | URL, or `own visit` for personal observations. |
| `observed_at` | ISO 8601 date. See the note on semantics below. |
| `notes` | Free text for anything not captured by the other columns. |

### Checkpoint types

| Value | Meaning |
|---|---|
| `main` | Standard security checkpoint open to all passengers. |
| `fastlane` | Priority lane, access via status, fare class or ticket. |
| `smartlane` | Pre-bookable timed-slot lane. |
| `transfer` | Checkpoint used only by transferring passengers. |

Crew-only lanes are deliberately out of scope.

### Source types

Listed from strongest to weakest. Where sources conflict, a more recent
observation can outrank a higher tier, since official pages are often stale.

| Value | Meaning |
|---|---|
| `official-security-page` | The airport's own security information page. |
| `authority` | Bundespolizei, national aviation authority, EU. |
| `press-release` | Official announcement by the airport or operator. |
| `news` | Reputable aviation or general press coverage. |
| `personal-observation` | Verified first-hand on site. |

### Status values

Three values everywhere, never a bare boolean:

- `yes` — confirmed present
- `no` — confirmed absent
- `unknown` — not checked, or the source says nothing about it

`no` and `unknown` are different statements and must not be conflated.
`unknown` is the correct default and is expected to dominate at launch.

### On `observed_at`

The meaning depends on `source_type`:

- `personal-observation` — the date you were physically at the checkpoint.
- everything else — the date the source was read or published.

Format is ISO 8601. Use `YYYY-MM-DD` where the exact day is known and
`YYYY-MM` where only the month is. Never invent precision.

### Two things not to confuse

`ct_scanner` and `liquids_lifted` are independent. A CT scanner means
laptops and liquids can stay in the bag. It does not by itself mean the
100 ml limit is lifted, since that additionally requires EU certification.
Expect `liquids_lifted` to be `no` at nearly every checkpoint.