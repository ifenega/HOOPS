# Hoops

A basketball scoreboard and stats app for phones and tablets, built with Expo and React Native.

> 🚧 **Still a work in progress.** Some features below are planned and not built yet. See [Status](#status) for what works today.

## Why I built it

I play in an evening league at our local basketball court. We have no proper scoreboard. The score lives in someone's head or on a phone calculator, and the clock is whoever remembers to check their watch. Stats are kept on paper: one person with a pen, trying to follow rebounds, assists and fouls for ten players at once. Sheets get smudged, totals get added up wrong, and some games never get recorded.

I wanted something anyone at the court could pull out of their pocket. It had to work with the patchy signal we get there, show a score you can read from the bench, and let a few people share the stat-keeping instead of putting it all on one person with a clipboard. Hoops is that app.

## What it does

It is designed to:

- work with **no internet at all**,
- let several phones on the same wifi share the stat-keeping (one keeps the clock and score, another keeps rebounds, another keeps fouls),
- run as a plain scoreboard for pickup games with no setup.

The full design is in [HOOPS_SPEC.md](HOOPS_SPEC.md).

## Game modes

| Mode | Roster | Clock | For |
|---|---|---|---|
| Quick Score | none | countdown | casual games, two taps from launch |
| Run | none | none or count-up | pickup games played to a target score |
| Full Game | required | countdown, FIBA rules | real games with stats |

## How phones connect

Several phones can keep one game together over local wifi or a phone hotspot. No internet is needed. This is planned and not built yet (see Status).

- **One phone hosts.** The host runs the clock and score, and shows a QR code plus a four-letter game code. Others join by scanning the QR or typing the code.
- **Each stat has one owner.** Each phone claims stat groups such as fouls, rebounds or assists, and only that phone can record them. The host rejects anything else, so two phones never record the same thing and nothing needs merging.
- **Every phone keeps the whole game.** Each action is saved on the phone that made it, sent to the host, numbered by the host, and passed to every other phone.
- **The clock isn't streamed.** The host sends a message only when the clock starts or stops. Each phone counts down by itself, after correcting for the difference between its own clock and the host's.
- **Dropped connections recover.** A phone that loses wifi keeps recording and sends its stats when it reconnects. It finds the host again by game code, even if the host's address has changed, and gets its stat groups back automatically. If the host disappears, another phone can take over, because every phone already has the full game.

The full protocol is in sections 7 and 8 of the spec.

## Status

The single-device scoreboard is in progress: clock, score, periods, team fouls, possession, timeouts and the LED-style display. Rosters, player stats, the multi-device wifi mode and export are planned. The build phases are listed in section 10 of the spec.

## Running it

The app uses native modules, so it runs in a development build, **not Expo Go**.

```bash
npm install
npx expo prebuild     # generates the ios/ and android/ folders from app.config.ts
npm run ios           # or: npm run android
npm start             # starts the dev server for an installed development build
```

`ios/` and `android/` are generated, so they are not committed. Change native settings in `app.config.ts`, then run `npx expo prebuild --clean`.

## Checks

```bash
npm run typecheck
npm run lint
npm test              # unit tests for the game logic in src/core
```

## Project layout

```
app/          Expo Router routes (thin: each renders a screen from src/ui/screens)
src/
  core/       game logic in plain TypeScript: events, clock, rules, scoreboard and box score
  state/      Zustand store
  storage/    saving games on the device (MMKV)
  ui/         screens, components and theme
  config/     tunable constants and feature flags
assets/fonts/ DSEG seven-segment fonts for the LED display
```

`src/core` never imports from React Native, Expo, or the `ui`/`storage` folders, so the game logic can be tested in plain Node and reused elsewhere. ESLint enforces this rule.

## Credits

The LED digits use [DSEG](https://github.com/keshikan/DSEG) by Keshikan, under the SIL Open Font License.
