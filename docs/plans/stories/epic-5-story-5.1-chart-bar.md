### Story 5.1: ChartBar Component

**File**: `docs/plans/stories/epic-5-story-5.1-chart-bar.md`

**BUILDID**: CYCLE-4 | **AzureDevOps**: #23695 | **Epic**: 5 - P2 COMPLEX + v1.0 | **ID**: 5.1 | **Date**: 2026-10-13
**Wave**: 7
**Requires**: [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11]
**Enables**: [5.2]
**Files Touched**:
  - src/components/ChartBar/ChartBar.tsx
  - src/components/ChartBar/ChartBar.types.ts
  - src/components/ChartBar/ChartBar.module.scss
  - src/components/ChartBar/ChartBar.stories.tsx
  - src/components/ChartBar/ChartBar.test.tsx
  - src/components/ChartBar/index.ts
  - src/index.ts
**Roles Ref**: docs/requirements.md#roles--permissions-matrix — single-actor — no role variation
**QA Candidate**: Yes — **Observable:** `pnpm storybook` shows a ChartBar story with vertical bars proportional to their data values, with axis labels, accessible bar descriptions, and hover tooltips; `pnpm test src/components/ChartBar` exits 0 with ≥ 90% coverage; `pnpm typecheck` exits 0. **Mechanism:** ChartBar renders an SVG-based vertical bar chart. No third-party charting library — pure SVG + CSS custom properties. Bars are `<rect>` elements sized proportionally to the max value. Accessible via `role="img"` on the SVG with a descriptive `aria-label`. **Authz & preconditions:** requires CYCLE-1 fully merged; used by GraphContainer (5.2).

> **Styling (CR-001, 2026-10-20)**: wherever this story says `var(--annexus-*)`, `src/tokens/` or a hex value, implement it as a **design variable** instead. Add `$<section><Element><State><Property>` (camelCase, section-prefixed, never repeated) to `src/styles/design.variables.scss`, pointing to a color in `src/styles/pallete.color.scss`, and `@use '../../styles/design.variables' as *;` in the component SCSS. Component SCSS never uses hex values or palette variables. Every new design variable is also added to `src/styles/design.variables.module.scss` so it is exported to JS (`designVariables`). Fonts use `$fontFamilyBase` and section-named size/line-height/weight variables. Reference implementation: `src/components/Input/Input.scss`. Spec: Story 3.2.

---

#### 👤 User Reference

**Description**:
ChartBar renders a vertical bar chart using inline SVG. Each bar in the `data` array is rendered as a proportionally sized `<rect>` within the SVG viewport. The chart includes X-axis labels beneath each bar and an optional Y-axis. The color of each bar is configurable per data point. The chart is read-only, non-interactive — no click handlers on bars. Accessible via `aria-label` describing the chart content.

**Acceptance Criteria** (plain-English):
- Renders an SVG with one vertical bar per data point
- Bar height is proportional to the data value relative to the maximum value
- Each bar uses its `color` property for fill
- X-axis labels render beneath each bar
- `aria-label` on the SVG describes the chart for screen readers
- `width` and `height` props control SVG dimensions (default 300×200)
- `className` prop merges with base class
- `pnpm test` exits 0; ≥ 90% coverage

**User Journey** (no role variation — single actor: DEV):
- ```tsx
  <ChartBar
    data={[
      { label: 'Jan', value: 120, color: '#11175E' },
      { label: 'Feb', value: 180, color: '#0167AC' },
      { label: 'Mar', value: 90, color: '#11175E' },
    ]}
    aria-label="Monthly premium comparison"
    width={300}
    height={200}
  />
  ```

**Flow Diagram**:

```mermaid
flowchart TD
  A[data: ChartBarDataPoint[], width, height] --> B[svg role=img aria-label]
  B --> C[rect × N — height proportional to value / maxValue]
  B --> D[text labels — x-axis beneath each bar]
  B --> E[title element — for browser tooltip]
```

---

#### 🤖 AI Agent Reference

**Must Read**:
- `docs/architecture/design/01-patterns-and-standards-greenfield.md` — SVG chart pattern, accessibility for data viz
- `docs/ui-ux/ui-ux-spec.md` — ChartBar visual spec, bar colors, axis labels

**Design Tokens**:
- `--annexus-font-size-xs` — axis label font size (via CSS on SVG text)
- `--annexus-color-gray-300` — axis line color
- `--annexus-color-gray-600` — label text color
- `--annexus-spacing-2` — bar gap (calculated in SVG coordinates)
- Bar colors come from data points (dynamic) — not tokens

**Description**:
`ChartBarDataPoint`: `{ label: string; value: number; color: string }`. `ChartBarProps`: `data: ChartBarDataPoint[]`, `'aria-label': string` (required for a11y), `width?: number` (default `300`), `height?: number` (default `200`), plus `BaseProps`. SVG layout: bars occupy the upper 80% of height; bottom 20% reserved for x-axis labels. Bar width = `(width - padding) / data.length - gap`. Bar height = `(value / maxValue) * barAreaHeight`. Each bar gets a `<title>` child for browser-native tooltip. `maxValue = Math.max(...data.map(d => d.value))`.

**Acceptance Criteria** (comprehensive):
- `ChartBarDataPoint`: `{ label: string; value: number; color: string }`
- `ChartBarProps`: `data, 'aria-label', width=300, height=200` + `BaseProps`
- SVG: `role="img"`, `aria-label={aria-label}`, `width={width}`, `height={height}`
- One `<rect>` per data point with `fill={color}` and proportional height
- Tallest bar fills bar area height; others proportional
- `<text>` below each bar for the label
- Empty `data` array: renders SVG with no bars (no error)
- `className` merged on SVG element

**RBAC Enforcement**: No role-differentiated access — single actor.

**System responses + error cases**:

| Trigger | Response | Side-effect |
|---------|----------|-------------|
| All values equal | All bars same height | none |
| Single data point | One bar fills available width | none |
| `data=[]` | Empty SVG renders | none |
| `value=0` | Bar renders with 0 height (invisible) | none |

**QA-observable behaviour**:
- `screen.getByRole('img', { name: 'Monthly premium comparison' })` — resolves.
- Number of `<rect>` elements === `data.length`.
- Tallest data point's rect has the maximum bar height.

**Prerequisites**:
- Stories 3.1–3.5 merged

**Steps**:

1. **Create `src/components/ChartBar/ChartBar.types.ts`**:
   ```typescript
   import type { BaseProps } from '../../types/common.types';

   export interface ChartBarDataPoint {
     label: string;
     value: number;
     color: string;
   }

   export interface ChartBarProps extends BaseProps {
     data: ChartBarDataPoint[];
     'aria-label': string;
     width?: number;
     height?: number;
   }
   ```

2. **Create `src/components/ChartBar/ChartBar.module.scss`**:
   ```scss
   .annexus-chart-bar {
     display: block;
     overflow: visible;

     &__label {
       font-size: 11px;
       fill: var(--annexus-color-gray-600, #535862);
       text-anchor: middle;
     }

     &__axis-line {
       stroke: var(--annexus-color-gray-300, #D5D7DA);
       stroke-width: 1;
     }
   }
   ```

3. **Create `src/components/ChartBar/ChartBar.tsx`**:
   ```tsx
   import React from 'react';
   import { classNames } from '../../utils/classNames';
   import styles from './ChartBar.module.scss';
   import type { ChartBarProps } from './ChartBar.types';

   const PADDING = 16;
   const LABEL_HEIGHT = 24;
   const GAP = 4;

   export function ChartBar({
     data,
     'aria-label': ariaLabel,
     width = 300,
     height = 200,
     className,
     style,
     'data-testid': testId,
   }: ChartBarProps) {
     const barAreaHeight = height - LABEL_HEIGHT - PADDING;
     const totalBars = data.length;
     const barWidth = totalBars > 0
       ? (width - PADDING * 2 - GAP * (totalBars - 1)) / totalBars
       : 0;
     const maxValue = totalBars > 0 ? Math.max(...data.map((d) => d.value)) : 0;

     return (
       <svg
         role="img"
         aria-label={ariaLabel}
         width={width}
         height={height}
         className={classNames(styles['annexus-chart-bar'], className)}
         style={style}
         data-testid={testId}
       >
         <title>{ariaLabel}</title>
         {/* Axis line */}
         <line
           className={styles['annexus-chart-bar__axis-line']}
           x1={PADDING}
           y1={height - LABEL_HEIGHT}
           x2={width - PADDING}
           y2={height - LABEL_HEIGHT}
         />
         {data.map((point, index) => {
           const barHeight = maxValue > 0 ? (point.value / maxValue) * barAreaHeight : 0;
           const x = PADDING + index * (barWidth + GAP);
           const y = height - LABEL_HEIGHT - barHeight;
           const labelX = x + barWidth / 2;
           const labelY = height - 4;

           return (
             <g key={index} role="presentation">
               <title>{`${point.label}: ${point.value}`}</title>
               <rect
                 x={x}
                 y={y}
                 width={barWidth}
                 height={barHeight}
                 fill={point.color}
                 rx={2}
               />
               <text
                 className={styles['annexus-chart-bar__label']}
                 x={labelX}
                 y={labelY}
               >
                 {point.label}
               </text>
             </g>
           );
         })}
       </svg>
     );
   }
   ```

4. **Create `src/components/ChartBar/index.ts`**:
   ```typescript
   export { ChartBar } from './ChartBar';
   export type { ChartBarProps, ChartBarDataPoint } from './ChartBar.types';
   ```

5. **Create `src/components/ChartBar/ChartBar.stories.tsx`**:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { ChartBar } from './ChartBar';

   const meta: Meta<typeof ChartBar> = {
     title: 'Components/ChartBar',
     component: ChartBar,
     tags: ['autodocs'],
   };
   export default meta;

   type Story = StoryObj<typeof ChartBar>;

   const sampleData = [
     { label: 'Jan', value: 120, color: '#11175E' },
     { label: 'Feb', value: 180, color: '#11175E' },
     { label: 'Mar', value: 90, color: '#11175E' },
     { label: 'Apr', value: 210, color: '#0167AC' },
     { label: 'May', value: 150, color: '#11175E' },
   ];

   export const Default: Story = {
     args: {
       data: sampleData,
       'aria-label': 'Monthly premium comparison Jan–May',
       width: 320,
       height: 200,
     },
   };

   export const Empty: Story = {
     args: {
       data: [],
       'aria-label': 'Empty chart',
       width: 320,
       height: 200,
     },
   };
   ```

6. **Create `src/components/ChartBar/ChartBar.test.tsx`**:
   ```tsx
   import { render, screen } from '@testing-library/react';
   import { ChartBar } from './ChartBar';

   const data = [
     { label: 'Jan', value: 100, color: '#11175E' },
     { label: 'Feb', value: 200, color: '#0167AC' },
   ];

   describe('ChartBar', () => {
     it('renders SVG with role img', () => {
       render(<ChartBar data={data} aria-label="Chart" />);
       expect(screen.getByRole('img', { name: 'Chart' })).toBeInTheDocument();
     });
     it('renders correct number of rects', () => {
       const { container } = render(<ChartBar data={data} aria-label="Chart" />);
       expect(container.querySelectorAll('rect')).toHaveLength(2);
     });
     it('renders correct bar colors', () => {
       const { container } = render(<ChartBar data={data} aria-label="Chart" />);
       const rects = container.querySelectorAll('rect');
       expect(rects[0].getAttribute('fill')).toBe('#11175E');
       expect(rects[1].getAttribute('fill')).toBe('#0167AC');
     });
     it('max value bar has greater height', () => {
       const { container } = render(<ChartBar data={data} aria-label="Chart" />);
       const rects = container.querySelectorAll('rect');
       const h1 = parseFloat(rects[0].getAttribute('height') || '0');
       const h2 = parseFloat(rects[1].getAttribute('height') || '0');
       expect(h2).toBeGreaterThan(h1);
     });
     it('renders empty SVG for empty data', () => {
       const { container } = render(<ChartBar data={[]} aria-label="Empty chart" />);
       expect(container.querySelectorAll('rect')).toHaveLength(0);
     });
     it('applies custom className', () => {
       const { container } = render(<ChartBar data={[]} aria-label="C" className="custom" />);
       expect(container.querySelector('svg')?.className.baseVal).toContain('custom');
     });
     it('forwards data-testid', () => {
       render(<ChartBar data={[]} aria-label="C" data-testid="cb" />);
       expect(screen.getByTestId('cb')).toBeInTheDocument();
     });
   });
   ```

7. **Update `src/index.ts`**:
   ```typescript
   export { ChartBar } from './components/ChartBar';
   export type { ChartBarProps, ChartBarDataPoint } from './components/ChartBar';
   ```

8. **Run verification**:
   ```bash
   pnpm typecheck
   pnpm test src/components/ChartBar
   ```

**Tests**: 7 unit tests; `pnpm typecheck` exits 0

**Quality**: ≥ 90% coverage; `pnpm typecheck` exits 0

**OUT**:
- ❌ No click/hover interaction on bars (read-only visualization)
- ❌ No Y-axis labels (Y-axis added if required by future spec)
- ❌ No animation on first render (AnimatedValues story handles value animation separately)
- ❌ No third-party charting library (pure SVG per architecture ADR)

**Evidence**:
- Terminal output of `pnpm test src/components/ChartBar` (7 tests pass)
- Terminal output of `pnpm typecheck` (exit 0)
