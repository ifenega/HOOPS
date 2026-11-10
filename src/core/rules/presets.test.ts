import { FIBA, PRESETS, QUICK_SCORE, RUN } from './presets';
import type { RuleSet } from './types';

describe('rule presets', () => {
  it('ships exactly the three v1 presets', () => {
    expect(PRESETS.map((preset) => preset.id).sort()).toEqual(
      ['fiba', 'quick_score', 'run'].sort(),
    );
  });

  it('each preset has consistent invariants', () => {
    for (const preset of PRESETS) {
      expectValidRuleSet(preset);
    }
  });

  it('FIBA is a rostered countdown game', () => {
    expect(FIBA.clockMode).toBe('countdown');
    expect(FIBA.requiresRoster).toBe(true);
    expect(FIBA.teamFoulBonus).toBe(4);
  });

  it('Quick Score needs no roster but keeps a bonus threshold', () => {
    expect(QUICK_SCORE.requiresRoster).toBe(false);
    expect(QUICK_SCORE.teamFoulBonus).not.toBeNull();
  });

  it('Run is a single clockless period with a target', () => {
    expect(RUN.clockMode).toBe('none');
    expect(RUN.periods).toBe(1);
    expect(RUN.targetScore).toBe(21);
    expect(RUN.winBy).toBe(2);
  });
});

function expectValidRuleSet(preset: RuleSet): void {
  expect(preset.periods).toBeGreaterThanOrEqual(1);
  expect(preset.winBy).toBeGreaterThanOrEqual(1);
  if (preset.clockMode === 'countdown') {
    expect(preset.periodMs).toBeGreaterThan(0);
  }
  if (preset.clockMode === 'none') {
    expect(preset.targetScore).not.toBeNull();
  }
}
