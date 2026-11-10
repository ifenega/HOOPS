# Fonts

The LED scoreboard uses **DSEG** by Keshikan (SIL Open Font License).

Download the release and place these two files here before running `expo prebuild`:

- `DSEG7Classic-Bold.ttf`
- `DSEG7ClassicMini-Bold.ttf`

Source: https://github.com/keshikan/DSEG/releases

They are registered in `app.config.ts` via the `expo-font` config plugin and
embedded natively — no JavaScript `require` of the `.ttf` is needed. The family
names live once in `src/ui/theme/typography.ts` (`FONTS`).
