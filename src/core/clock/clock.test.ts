import {
  formatClock,
  readClock,
  setClock,
  setPeriod,
  startClock,
  stopClock,
  type ClockState,
} from './clock';

function stoppedClock(remainingMs: number): ClockState {
  return {
    period: 1,
    running: false,
    anchorAt: 1_000,
    remainingAtAnchorMs: remainingMs,
    version: 0,
  };
}

describe('readClock', () => {
  it('returns the stored remaining while stopped', () => {
    expect(readClock(stoppedClock(30_000), 999_999)).toBe(30_000);
  });

  it('subtracts elapsed time while running', () => {
    const running = startClock(stoppedClock(30_000), 1_000);
    expect(readClock(running, 6_000)).toBe(25_000);
  });

  it('clamps at zero and never goes negative', () => {
    const running = startClock(stoppedClock(5_000), 1_000);
    expect(readClock(running, 100_000)).toBe(0);
  });
});

describe('transitions', () => {
  it('start marks running and bumps version', () => {
    const started = startClock(stoppedClock(30_000), 2_000);
    expect(started.running).toBe(true);
    expect(started.anchorAt).toBe(2_000);
    expect(started.version).toBe(1);
  });

  it('start is a no-op when already running', () => {
    const started = startClock(stoppedClock(30_000), 2_000);
    expect(startClock(started, 5_000)).toBe(started);
  });

  it('stop snaps the exact remaining value', () => {
    const started = startClock(stoppedClock(30_000), 1_000);
    const stopped = stopClock(started, 11_000);
    expect(stopped.running).toBe(false);
    expect(stopped.remainingAtAnchorMs).toBe(20_000);
    expect(stopped.version).toBe(2);
    expect(readClock(stopped, 999_999)).toBe(20_000);
  });

  it('setClock overrides remaining and clamps negatives to zero', () => {
    const set = setClock(stoppedClock(30_000), -500, 3_000);
    expect(set.remainingAtAnchorMs).toBe(0);
    expect(set.version).toBe(1);
  });

  it('setPeriod resets to a stopped clock at the new period', () => {
    const next = setPeriod(startClock(stoppedClock(0), 1_000), 2, 600_000, 4_000);
    expect(next.period).toBe(2);
    expect(next.running).toBe(false);
    expect(next.remainingAtAnchorMs).toBe(600_000);
  });
});

describe('formatClock', () => {
  it('shows MM:SS at a minute or more', () => {
    expect(formatClock(90_000)).toBe('01:30');
    expect(formatClock(600_000)).toBe('10:00');
  });

  it('shows seconds and tenths under a minute', () => {
    expect(formatClock(5_300)).toBe('05.3');
  });
});
