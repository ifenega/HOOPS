import type { TextStyle } from 'react-native';

import { formatClock } from '../../core/clock/clock';
import { COLORS } from '../theme/colors';
import { TYPE } from '../theme/typography';
import { SevenSegmentDisplay } from './SevenSegmentDisplay';

type Props = {
  remainingMs: number;
  type?: TextStyle;
  color?: string;
};

/** Padded to a stable five-character frame so the ghost `88:88` never jumps. */
export function ClockDisplay({
  remainingMs,
  type = TYPE.clockLarge,
  color = COLORS.ledAmber,
}: Props): React.JSX.Element {
  const value = formatClock(remainingMs).padStart(5, ' ');
  return <SevenSegmentDisplay value={value} type={type} color={color} />;
}
