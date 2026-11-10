# Hoops — Basketball Scoreboard & Stats App

Build specification. Read this fully before writing code.

---

## 1. What we're building

A React Native app for running a basketball game from a phone or tablet. Two things make it different from every other scoreboard app:

1. **Stat collection can be split across multiple devices over LAN.** One person keeps clock and score, another keeps rebounds and assists, another keeps fouls. Or one person keeps everything. The user chooses.
2. **It works with no internet at all.** LAN-only is the primary mode, not a fallback.

It must also work as a plain scoreboard for pickup games, with zero setup.

### The three modes

| Mode | Roster | Clock | Use |
|---|---|---|---|
| Quick Score | none | countdown, configurable | Casual games, two taps from launch |
| Run | none | none or count-up | Pickup sets, play to a target score |
| Full Game | required | countdown, FIBA default | Real games with stats |

---

## 2. Scope

### In scope for v1

- Clock, score, period, team fouls, bonus, possession, timeouts
- Run mode (target score, win-by-two)
- Optional rosters with auto-assigned jersey numbers
- Player stats: fouls, rebounds (off/def), assists, steals, blocks, turnovers, field goals, free throws
- LAN multi-device with exclusive module ownership
- Offline event queue and reconnection
- End-of-game team sheet
- LED scoreboard visual treatment

### Explicitly NOT in v1 — do not build these

- Game metadata: competition name, venue, date, game number
- Referees, commissioners, coaches, table official names
- Linked events (assist attached to a specific made shot, steal attached to a turnover)
- Reconciliation and correction workflows
- Two devices tracking the same stat category
- Shot charts and shot location
- Cloud sync, accounts, login
- Play-by-play view
- Plus/minus, efficiency ratings, advanced stats
- PDF export

If a task seems to require one of these, stop and flag it rather than building it.

---

## 3. Tech stack

- Expo with dev client (`expo prebuild`) — **not** Expo Go, native modules are required
- TypeScript, strict mode
- `react-native-tcp-socket` — LAN transport
- `react-native-udp` — host discovery by game code
- `react-native-mmkv` — persistence, synchronous
- `zustand` — state
- `expo-camera` — QR scanning
- `react-native-qrcode-svg` — QR display
- `expo-font` — DSEG font loading
- `expo-keep-awake`, `expo-haptics`

---

## 4. Folder structure

```
/src
  /core                 Pure TypeScript. Zero React Native imports.
    /events             Event types, factories, validators
    /projections        log -> scoreboard, log -> boxscore
    /rules              RuleSet type and presets
    /clock              ClockState math
    /ownership          Module assignment logic
  /net
    transport.ts        Transport interface
    lan-host.ts         TCP server
    lan-client.ts       TCP client
    discovery.ts        UDP broadcast responder and prober
    protocol.ts         Wire message types
  /storage
    storage.ts          Storage interface
    mmkv-storage.ts     MMKV implementation
  /state                Zustand stores
  /ui
    /components         Reusable presentational components
    /screens            Screen compositions
    /theme              Colors, spacing, typography
  /config
    constants.ts        All tunable values
    flags.ts            Feature flags
```

### The one architectural rule

**`/core` must never import from `react-native`, Expo, or any `/ui`, `/net`, or `/storage` module.**

It is pure TypeScript that could run in Node with no changes. This is what makes the future web PWA a matter of swapping `/net`, `/storage`, and `/ui` while `/core` moves across untouched. If a `/core` file needs `Platform`, `Dimensions`, or `AsyncStorage`, the design is wrong — pass the value in as an argument instead.

Enforce it with an ESLint `no-restricted-imports` rule on `src/core/**`.

---

## 5. Coding rules

### Components

- One component per file. Filename matches the component name.
- Components are presentational by default. They receive data and callbacks as props and hold no business logic.
- Business logic lives in `/core` as pure functions, or in `/state` as store actions. Never inside a component body.
- If a component file passes ~150 lines, split it.
- If a component takes more than 7 props, it is doing too much — split it or group props into an object.
- No inline styles beyond one-off layout adjustments. Use `StyleSheet.create` at the bottom of the file.

### Fonts and theme values

Never hardcode a font family, size, weight, or colour anywhere in a component. Not once. This applies to the LED font as much as to body text.

Every font reference goes through a token in `/src/ui/theme`:

```ts
export const FONTS = {
  segment: 'DSEG7Classic-Bold',
  segmentCompact: 'DSEG7ClassicMini-Bold',
  body: 'System',
} as const;

export const TYPE = {
  clockLarge: { fontFamily: FONTS.segment, fontSize: 64, letterSpacing: 4 },
  clockCompact: { fontFamily: FONTS.segmentCompact, fontSize: 20, letterSpacing: 2 },
  scoreLarge: { fontFamily: FONTS.segment, fontSize: 58 },
  statNumeral: { fontFamily: FONTS.segment, fontSize: 22 },
  playerName: { fontFamily: FONTS.body, fontSize: 15 },
  label: { fontFamily: FONTS.body, fontSize: 11, letterSpacing: 2 },
} as const;
```

Components reference `TYPE.clockLarge`, never the string `'DSEG7Classic-Bold'` or the number `64`.

The reason is concrete, not stylistic. The ghost layer requires the live digits and the ghost digits to share an identical font family, size, and letter spacing — if those values are duplicated as literals in two places, they will eventually diverge and the display will look subtly broken. Swapping to a different segment font, or adjusting for a device with a different pixel density, must be a one-line change in the theme file.

The same rule applies to colours and spacing. If a hex code or a pixel value appears in a component file, it belongs in the theme or in `constants.ts` instead.

### Clarity

- Write for someone reading it cold in six months. Prefer an obvious solution over a clever one.
- Descriptive names. `remainingMs` not `t`. `handleReboundPress` not `onPress2`.
- No abbreviations except widely understood ones (`id`, `ms`, `url`).
- Early returns over nested conditionals.
- Functions do one thing. If you need "and" to describe what a function does, split it.

### Comments

- Do not comment what the code already says. `// increment the score` above `score++` is noise.
- Comment only when the *why* is non-obvious: a workaround for a platform bug, a non-intuitive algorithm, a deliberate tradeoff, a magic number's origin.
- Prefer making code self-explanatory over explaining it. Rename the variable instead of adding a comment.
- No commented-out code. Delete it; git remembers.
- No file header blocks, no author tags, no changelogs in comments.

### TypeScript

- `strict: true`. No `any` — use `unknown` and narrow.
- Discriminated unions for event types and wire messages. Exhaustive `switch` with a `never` check in the default case.
- Types for data shapes, interfaces only for things that get implemented (`Transport`, `Storage`).
- No type assertions (`as`) except when narrowing something genuinely untypeable, and then with a comment explaining why.

### General

- No premature abstraction. Write it twice before extracting it.
- No barrel files (`index.ts` re-exports) — they hurt tree-shaking and obscure where things come from.
- Pure functions in `/core` must have unit tests. Everything else is optional.
- Async work never happens in render. Persist synchronously via MMKV before any network call.

---

## 6. Constants and feature flags

### `/src/config/constants.ts`

Every tunable value lives here. No magic numbers anywhere else in the codebase.

```ts
export const NETWORK = {
  TCP_PORT: 41235,
  UDP_DISCOVERY_PORT: 41234,
  CLOCK_BROADCAST_INTERVAL_MS: 1500,
  TIME_SYNC_INTERVAL_MS: 30_000,
  CONNECT_TIMEOUT_MS: 5_000,
  RECONNECT_BACKOFF_MS: [500, 1_000, 2_000, 4_000, 8_000],
  HOST_SILENCE_BEFORE_HANDOVER_MS: 20_000,
  MODULE_RELEASE_GRACE_MS: 30_000,
} as const;

export const GAME_CODE = {
  LENGTH: 4,
  ALPHABET: '23456789CDFGHJKMNPQRTVWX',
} as const;

export const LAYOUT = {
  MIN_TOUCH_TARGET: 56,
  ROSTER_ROW_HEIGHT: 68,
  COMPACT_BAR_HEIGHT: 44,
  FOOTER_HEIGHT: 60,
} as const;

export const TIMING = {
  UNDO_WINDOW_MS: 8_000,
  HAPTIC_DEBOUNCE_MS: 120,
} as const;
```

`GAME_CODE.ALPHABET` excludes `0/O`, `1/I/L`, `5/S`, `8/B`, `Z`, and all vowels. This prevents both misreads over a noisy court and accidental generation of real words.

### `/src/config/flags.ts`

```ts
export const FLAGS = {
  MULTI_DEVICE: true,
  UDP_DISCOVERY: true,
  MDNS_DISCOVERY: false,
  MANUAL_IP_ENTRY: true,
  HOST_HANDOVER: true,
  RUN_MODE: true,
  SHOT_CLOCK: false,
  FIELD_GOAL_TRACKING: true,
  SUBSTITUTION_TRACKING: false,
  CLOUD_SYNC: false,
  PDF_EXPORT: false,
} as const;
```

Rules for flags:

- A flag gates a whole feature at its entry point — a screen, a module in the picker, a network subsystem. Not scattered `if` statements throughout the code.
- Code behind a `false` flag must still compile and typecheck.
- Flags are compile-time constants. No runtime toggling in v1.
- Delete a flag once its feature has shipped and stabilised. Flags are temporary scaffolding, not permanent configuration.

---

## 7. Domain model

### Events

Everything that happens in a game is an append-only event. Score, fouls, and the box score are derived by replaying the log — never stored as mutable counters.

```ts
export type EventType =
  | 'POINTS_1' | 'POINTS_2' | 'POINTS_3'
  | 'SHOT_MISSED_2' | 'SHOT_MISSED_3' | 'FREE_THROW_MISSED'
  | 'FOUL_PERSONAL' | 'FOUL_TECHNICAL' | 'FOUL_UNSPORTSMANLIKE'
  | 'REBOUND_OFFENSIVE' | 'REBOUND_DEFENSIVE'
  | 'ASSIST' | 'STEAL' | 'BLOCK' | 'TURNOVER'
  | 'TIMEOUT' | 'POSSESSION_SET' | 'PERIOD_END'
  | 'SCORE_ADJUSTMENT' | 'CLOCK_SET';

export type GameEvent = {
  id: string;
  gameId: string;
  seq: number;
  deviceId: string;
  createdAt: number;
  period: number;
  clockMs: number;
  clockEstimated: boolean;
  type: EventType;
  teamId: 'home' | 'away';
  playerId: string | null;
  voided: boolean;
};
```

`seq` is assigned by the host on acceptance and is `0` until then. Ordering is by `seq`; `createdAt` is diagnostic only.

`clockEstimated` is `true` when the event was created while the device was disconnected from the host and could not confirm the clock state. Counts remain correct; only ordering is unreliable. Surface it subtly in the UI, do nothing else with it in v1.

Voiding is a flag, never a deletion. Undo sets `voided: true` and emits that as its own message.

### Clock

The clock is never synchronised tick by tick. Only state transitions are broadcast.

```ts
export type ClockState = {
  period: number;
  running: boolean;
  anchorAt: number;
  remainingAtAnchorMs: number;
  version: number;
};

export function readClock(state: ClockState, now: number): number {
  if (!state.running) return state.remainingAtAnchorMs;
  return Math.max(0, state.remainingAtAnchorMs - (now - state.anchorAt));
}
```

Starting the clock sets `anchorAt = now` and increments `version`. Stopping it writes the exact computed remaining value into `remainingAtAnchorMs`, sets `running: false`, and increments `version`. Every device snapping to that exact value is what eliminates drift.

Clients convert the host's `anchorAt` into their own timebase using a measured offset. On connect and every `TIME_SYNC_INTERVAL_MS`, the client sends `t0`, the host replies with its own `now`, the client records `t1`, and the offset is `hostNow - (t0 + t1) / 2`. Keep the sample with the lowest round-trip time; discard the rest.

The host rebroadcasts the full `ClockState` every `CLOCK_BROADCAST_INTERVAL_MS` regardless of change. Clients ignore any state with a `version` lower than their current one. This makes the system self-healing — no acknowledgements, no retries.

### Rules

```ts
export type RuleSet = {
  id: string;
  name: string;
  clockMode: 'countdown' | 'countup' | 'none';
  periods: number;
  periodMs: number;
  overtimeMs: number;
  targetScore: number | null;
  winBy: number;
  teamFoulBonus: number | null;
  playerFoulLimit: number | null;
  timeoutsFirstHalf: number | null;
  timeoutsSecondHalf: number | null;
  requiresRoster: boolean;
};
```

Three presets ship in v1: `FIBA` (4 x 10min, bonus at 4, foul limit 5, 2/3 timeouts), `QUICK_SCORE` (configurable periods and length, no roster), `RUN` (no clock, target score, win by 2, single period).

The `RuleSet` shape must be settled in Phase 1 even though Run mode arrives in Phase 2. Retrofitting configurability into a hardcoded clock is painful.

### Module ownership

```ts
export type StatModule =
  | 'clockScore' | 'fouls' | 'rebounds' | 'assists'
  | 'stealsTurnovers' | 'blocks' | 'fieldGoals';
```

Each module is owned by exactly one device. The host holds the assignment table and **rejects any event whose type does not belong to the sending device's owned modules.** This is the entire conflict-avoidance strategy — there is no merging, no reconciliation, no last-write-wins.

`clockScore` is always owned by the host device in v1. Host and clock ownership are deliberately coupled to keep the model simple.

When a device disconnects, its modules enter a released state after `MODULE_RELEASE_GRACE_MS` and become claimable by others, including the host absorbing them back. A device that reconnects within the grace period gets its modules returned automatically, with no user interaction.

---

## 8. LAN protocol

### Game code

The host generates a four-character code from `GAME_CODE.ALPHABET`. Before committing to it, the host sends a discovery probe for its own code; if anything answers, it regenerates. This handles two games at one venue.

The code identifies the game. The IP address is only a cached shortcut. Client connection order:

1. Try the last known IP and port.
2. UDP broadcast `WHO_HAS <CODE>` to `255.255.255.255:41234`. The host owning that code replies with its current address.
3. Show a manual IP entry field behind a "Having trouble?" link.

Step 2 is what makes reconnection work after DHCP reassignment or a hotspot toggle. Build it instead of mDNS, not before it — it needs no iOS Bonjour entitlement and no Android multicast lock, and it works on a phone hotspot.

### QR payload

```
hoops://join?v=1&c=H4K9&h=192.168.1.42&p=41235
```

Version first so the scheme can change without breaking old clients. The host also displays the code in large LED digits beneath the QR, so late arrivals can be told it verbally and anyone whose camera fails can type it.

### Transport

Line-delimited JSON over raw TCP via `react-native-tcp-socket`. One JSON object per line, newline terminated. Simpler and more reliable in React Native than attempting a WebSocket server.

### Messages

```ts
export type ClientMessage =
  | { t: 'HELLO'; v: 1; code: string; deviceId: string; name: string; haveSeq: number }
  | { t: 'CLAIM'; modules: StatModule[] }
  | { t: 'EVENT'; event: GameEvent }
  | { t: 'VOID'; eventId: string }
  | { t: 'PING'; t0: number };

export type HostMessage =
  | { t: 'WELCOME'; gameId: string; clock: ClockState; ruleSet: RuleSet;
      roster: Roster; owned: StatModule[]; available: StatModule[]; events: GameEvent[] }
  | { t: 'REJECT'; reason: 'BAD_CODE' | 'VERSION_MISMATCH' | 'GAME_ENDED' }
  | { t: 'CLOCK'; clock: ClockState }
  | { t: 'EVENT_ACCEPTED'; id: string; seq: number }
  | { t: 'EVENT_REJECTED'; id: string; reason: 'NOT_OWNED' | 'INVALID' }
  | { t: 'OWNERSHIP'; owned: StatModule[]; available: StatModule[] }
  | { t: 'PONG'; t0: number; hostNow: number };
```

`HELLO` carries `haveSeq` so the host sends only the delta the client is missing, not the whole log.

`deviceId` is a UUID generated once and persisted. It is what allows automatic module restoration on reconnect.

A socket presenting the wrong code is rejected immediately. That is the access control — it keeps other devices on the venue wifi from injecting events.

### Persistence and recovery

- Every event is written to MMKV **before** it is sent. Synchronously. No exceptions.
- Every device keeps a full replica of the log. A whole game is under 100KB.
- The host persists its game code and resumes listening on the same code after a crash or relaunch. Clients are already retrying, so they reattach on their own.
- If the host is silent for `HOST_SILENCE_BEFORE_HANDOVER_MS`, remaining devices offer host promotion. Because every device holds a replica, nothing is lost.

---

## 9. UI

### Visual direction

The scoreboard is skeuomorphic LED — black background, seven-segment digits, amber clock, red scores, green period, red possession and bonus indicators.

The controls are not. Input surfaces are flat dark UI with large plain buttons. Do not apply the LED treatment to anything the user taps; legibility beats theme when someone is scoring under pressure.

### Font

DSEG by Keshikan, SIL Open Font License. Bundle `DSEG7Classic-Bold.ttf` for numerals and `DSEG7ClassicMini-Bold.ttf` for the compact bar. Load via `expo-font`.

The ghost layer is what sells it. DSEG7 renders `8` with all segments lit, so render `88:88` at roughly 12% opacity and absolutely position the live value on top. Both layers must use identical font size and letter spacing or they drift by a pixel — which is exactly why both pull from the same `TYPE` token rather than repeating literals.

The font family name must never appear as a string literal in a component. It lives once in `FONTS`, and everything else references a `TYPE` token. Assume the font choice will change at least once during the build.

### Screen budget

Phone screens are small. Only the host renders the full-size scoreboard.

Stat devices get a 44pt compact bar at the top showing clock, both scores, and period — nothing else. Everything below belongs to the roster and action buttons.

On a small phone that leaves roughly 500pt for the roster: seven rows at 68pt, enough for the on-court five plus two. Bench players sit behind a collapsed section.

Constraints, all non-negotiable:

- One module per screen. No tabs or carousels during live play.
- No scrolling required to log a stat.
- All primary actions in the bottom third, reachable one-handed.
- Minimum touch target 56pt.
- Portrait for stat devices. Landscape optional for the host.
- Screen stays awake for the whole game.
- Haptic feedback on every logged event.

### Stat display

- Bounded counts (fouls, timeouts) render as pips. Five dots, filled as they accrue. The fill state instantly communicates "one away from fouling out" in a way a numeral does not.
- Unbounded counts (points, rebounds, assists) render as LED numerals.

### Persistent chrome

Every device shows, at all times: the game code, a single connection status dot, and the pending-event count. One glance must answer "am I connected and is my data getting through" — the only question a volunteer will ever have.

An undo bar is always visible and always one tap. Mis-taps are the dominant failure mode in live stat collection; an undo buried in a menu means operators stop correcting and the data rots.

### Destructive actions

End period, end game, and reset require hold-to-confirm. Nothing else does.

---

## 10. Build phases

Ship each phase before starting the next. Each is independently testable at a real court.

**Phase 1 — Quick Score, single device.**
Clock, score, period, team fouls, bonus, possession, timeouts. LED UI with DSEG. No roster, no network, no stats. The `RuleSet` type and `ClockState` math are fully implemented here even though only one preset is exposed.

Done when: a full game can be scored on one phone, the app survives being backgrounded and restored, and the clock never drifts.

**Phase 2 — Run mode and rule presets.**
Target score, win-by-two, count-up stopwatch, single period. Preset picker on the setup screen.

Done when: all three presets work and switching between them requires no code change.

**Phase 3 — Rosters and stats, single device.**
Roster entry with auto-assigned numbers and a no-names option. Saved teams. Per-player tally screens for every stat module. Undo bar. End-of-game team sheet.

Done when: one person can collect a full stat line for a game, and the box score projection matches a hand-kept sheet.

**Phase 4 — LAN.**
Host mode, game code generation and probe, QR display and scan, UDP discovery, module claiming, clock broadcast, time offset calibration, offline outbox, reconnection, host handover.

Done when: three devices split modules across a game with a deliberate mid-game wifi drop, and the resulting box score is identical to the single-device run.

**Phase 5 — Export.**
Team sheet as a shareable image or PDF. Cloud sync scaffolding behind the `CLOUD_SYNC` flag, not enabled.

---

## 11. Open decisions

These are settled for v1 but worth revisiting later:

- Host and clock ownership are coupled. This means the scorer's phone can never be the device that leaves. Decoupling them is possible but adds an authority-transfer protocol.
- Offline devices stamp events with an estimated clock. Counts are correct, ordering may not be. Acceptable until play-by-play becomes a feature.
- Module ownership is exclusive with no overlap. This is what removes the entire reconciliation problem. Revisit only if users ask for redundant collection.

---

## 12. Stage 1 — Settle before writing any code

These block everything downstream. If they are decided ad hoc during implementation, they will be decided inconsistently in two different files.

### Project name

The name `Hoops` is a placeholder. Replace it before the first commit — it appears in the bundle identifier, the URL scheme, and the storage key prefix, and changing it later touches all three.

### Core data types

`Roster` is referenced by the protocol but was never defined. These belong in `/core`:

```ts
export type Player = {
  id: string;
  name: string;
  number: string;
  onCourt: boolean;
};

export type TeamId = 'home' | 'away';

export type Team = {
  id: TeamId;
  name: string;
  players: Player[];
};

export type Roster = {
  home: Team;
  away: Team;
};

export type GameStatus = 'setup' | 'live' | 'ended';

export type Game = {
  id: string;
  code: string;
  ruleSet: RuleSet;
  roster: Roster | null;
  clock: ClockState;
  events: GameEvent[];
  status: GameStatus;
  createdAt: number;
};
```

`Player.number` is a string, not a number. `0` and `00` are both legal jersey numbers and are distinct. Storing them numerically collapses them.

`Game.roster` is nullable because Quick Score and Run modes have no roster at all.

### Navigation

Use `expo-router`. File-based routing, and routes map to URLs — which is directly reusable when the web PWA arrives. Do not use `react-navigation` directly.

### Storage keys

```
<app>:device:id            persisted device UUID
<app>:game:active          active gameId, or null
<app>:game:<gameId>        full Game object
<app>:game:index           array of game summaries for the history list
<app>:teams:saved          reusable team templates
```

### Game lifecycle on relaunch

On launch, read `game:active`. If it is set and that game's status is `live`, resume it directly — no prompt, no confirmation. A crash mid-quarter must not cost the operator a single tap.

Ending a game clears `game:active` and appends a summary to `game:index`. A history list of past games is in scope; editing a finished game is not.

### State store shape

One zustand store holds the `Game`. Projections are recomputed inside the same action that appends an event, and the result is stored alongside:

```ts
type GameStore = {
  game: Game | null;
  derived: DerivedState | null;
  appendEvent: (event: GameEvent) => void;
};
```

`DerivedState` holds the scoreboard totals, team fouls, and per-player box score. Recomputing the full projection from the log on every append is correct and fast enough — a whole game is under a thousand events, and a full replay is well under a millisecond. Do not add incremental updates, caching layers, or memoised selectors. Components subscribe to `derived` and never replay the log themselves.

### Screen inventory

Phase 1: Home, New game, Rule preset picker, Scoreboard, Game settings sheet.
Phase 2: Preset configuration.
Phase 3: Roster entry, Saved teams, Module picker, Stat screen (one generic component parameterised by module), Team sheet.
Phase 4: Host code and QR, Join by scan, Manual IP entry, Module claim, Connection status.

The stat screen is one component, not eight. It takes a `StatModule` and renders the roster with the relevant action buttons.

---

## 13. Stage 2 — Required for Phase 1 to be genuinely usable

Without these the single-device app is a demo, not something you can run a real game on.

### Manual correction

The undo bar handles mis-taps caught immediately. It does not handle the scorer noticing at the next dead ball that the score has been wrong for two minutes. Without a correction path the app is unusable in a real game.

Add two host-only controls in the game settings sheet:

```ts
| 'SCORE_ADJUSTMENT'   // payload: delta (may be negative)
| 'CLOCK_SET'          // payload: remainingMs
```

Both are events, not mutations. The log stays the single source of truth and the correction is visible in the record. `SCORE_ADJUSTMENT` carries a `teamId` and a signed delta; the projection sums it with everything else.

### Undo semantics

`UNDO_WINDOW_MS` exists as a constant with no defined behaviour. Define it:

- The undo bar shows the most recent event created by *this* device. One tap voids it.
- The bar is visible for `UNDO_WINDOW_MS` after each event, then collapses to a small "Recent" affordance.
- Tapping "Recent" opens a list of this device's last twenty events. Any can be voided regardless of age.
- A device may void only its own events. The host may void any event.
- Voiding emits a `VOID` message and sets `voided: true`. Nothing is ever deleted.

### Overtime

When the final period ends and the scores are level, the host is prompted to start overtime. This creates period `n+1` with `ruleSet.overtimeMs` and repeats as long as the scores stay level. Team fouls reset per overtime period; player fouls do not.

In Run mode the game ends when a team reaches `targetScore` **and** leads by at least `winBy`. If the target is reached without the margin, play continues with no upper bound.

### Error handling policy

- Socket errors reconnect with the backoff array in `NETWORK`. Never crash, never drop queued events.
- Malformed JSON on a line is logged and discarded. The socket stays open.
- Unknown event or message types are ignored rather than throwing. This is forward compatibility for a mixed-version session.
- An MMKV write failure is the one error that surfaces a blocking alert, because it means unrecoverable data loss. Everything else degrades quietly.

### Testing

`jest-expo`. Unit tests cover `/core` only — clock math, projections, rule evaluation, and game code generation. No component tests, no e2e in v1. If a bug is found in `/core`, add the failing test before the fix.

---

## 14. Stage 3 — Required before Phase 4 ships

### Native permissions and prebuild config

iOS silently blocks all local network traffic without a usage description. The failure mode is a TCP connect that never completes and never errors — assume a lost day if this is missed.

`app.json`, iOS `infoPlist`:

```
NSLocalNetworkUsageDescription   Explains that the app connects to nearby devices to share game data.
NSCameraUsageDescription         Explains that the camera is used to scan a game QR code.
```

Android permissions: `INTERNET`, `ACCESS_NETWORK_STATE`, `CAMERA`, `CHANGE_WIFI_MULTICAST_STATE`. The last is needed on some devices for UDP broadcast reception.

Both require a rebuild of the dev client. Add them before the Phase 4 branch, not during it.

### Fouls and free throws are one module

Fouls on one device and free throws on another creates a coordination problem the moment a shooting foul happens — the free-throw operator has no signal that attempts are coming, and linked events are out of scope.

Decision: `fouls` and `freeThrows` collapse into a single `fouls` module covering personal fouls, technical fouls, and free-throw made and missed. Remove `freeThrows` from `StatModule` and drop the `FREE_THROW_TRACKING` flag.

### Network-specific error surfaces

Each of these needs a defined UI state, not just a log line: host unreachable, code not found on the network, version mismatch on `HELLO`, module claim rejected because another device already holds it, and the host handover prompt. Silent failure here is worse than elsewhere because the operator has no way to diagnose it mid-game.

---

## 15. Stage 4 — Before release

### Accessibility

The LED palette is red scores, green period, amber clock. That is a poor combination for red-green colour deficiency, which affects roughly one in twelve men — a meaningful share of the people who will use this at a court.

Colour must never be the only carrier of meaning:

- The bonus indicator keeps its text label lit rather than relying on the red glow alone.
- Foul pips show a numeral beside them once a player reaches four.
- A fouled-out player gets a distinct row treatment, not just a colour change.
- Possession uses the arrow shape and position, which it already does.

Also honour the system reduce-motion setting for any animation, and confirm text contrast against the black background meets WCAG AA at the sizes used.

### Outdoor legibility

An outdoor court in daylight is the intended environment. Verify the LED treatment at maximum brightness in direct sun before release; if the ghost layer washes out the live digits, reduce ghost opacity rather than raising live brightness.
