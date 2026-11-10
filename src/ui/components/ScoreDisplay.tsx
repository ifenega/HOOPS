import type { TextStyle } from 'react-native';

import { COLORS } from '../theme/colors';
import { TYPE } from '../theme/typography';
import { SevenSegmentDisplay } from './SevenSegmentDisplay';

type Props = {
  score: number;
  type?: TextStyle;
  color?: string;
};

/** Scores show at least two digits (`07`), growing to three past 99. */
export function ScoreDisplay({
  score,
  type = TYPE.scoreLarge,
  color = COLORS.ledRed,
}: Props): React.JSX.Element {
  const value = String(Math.max(0, score)).padStart(2, '0');
  return <SevenSegmentDisplay value={value} type={type} color={color} />;
}
