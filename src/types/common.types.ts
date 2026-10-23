import type { CSSProperties } from 'react';

export type Size = 'sm' | 'md' | 'lg';

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
}
