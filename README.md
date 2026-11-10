# Hoops

A basketball scoreboard and stats app for phones and tablets, built with Expo and React Native.

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
