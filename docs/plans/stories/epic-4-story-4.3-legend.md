### Story 4.3: Legend Component

**File**: `docs/plans/stories/epic-4-story-4.3-legend.md`

**BUILDID**: CYCLE-3 | **AzureDevOps**: #23687 | **Epic**: 4 - P1 COMPOSITION | **ID**: 4.3 | **Date**: 2026-10-13
**Wave**: 6
**Requires**: [3.1, 3.2, 3.3, 3.4, 3.5]
**Enables**: []
**Files Touched**:
  - src/components/Legend/Legend.tsx
  - src/components/Legend/Legend.types.ts
  - src/components/Legend/Legend.module.scss
  - src/components/Legend/Legend.stories.tsx
  - src/components/Legend/Legend.test.tsx
  - src/components/Legend/index.ts
  - src/index.ts
**Roles Ref**: docs/requirements.md#roles--permissions-matrix — single-actor — no role variation
**QA Candidate**: Yes — **Observable:** `pnpm storybook` shows a Legend story rendering a horizontal list of colored dot + label pairs; `pnpm test src/components/Legend` exits 0 with ≥ 90% coverage; `pnpm typecheck` exits 0. **Mechanism:** Legend maps a `LegendItem[]` array to colored swatch + label pairs in a horizontal flex list. Pure presentational, no state. **Authz & preconditions:** requires CYCLE-1 fully merged.

---

#### 👤 User Reference

**Description**:
The Legend component renders a horizontal list of chart legend entries. Each entry consists of a colored circular swatch and a text label. Used beneath charts (ChartBar, GraphContainer) to identify data series. The color for each swatch is passed as a CSS color string; the label is a plain string. The component accepts a `LegendItem[]` array prop.

**Acceptance Criteria** (plain-English):
- Renders one swatch + label pair per `LegendItem` in the `items` array
- Each swatch is a colored circle using the `color` property of the item
- Labels use the `label` property of the item
- Horizontal flex layout with consistent gap between items
- `className` prop merges with base class
- `pnpm test` exits 0; ≥ 90% coverage

**User Journey** (no role variation — single actor: DEV):
- `<Legend items={[{ color: '#11175E', label: 'Premium' }, { color: '#0167AC', label: 'Base' }]} />`
- Two colored dots with labels render horizontally beneath a chart.

**Flow Diagram**:

```mermaid
flowchart TD
  A[items: LegendItem[]] --> B[ul.annexus-legend]
  B --> C[li.annexus-legend__item × N]
  C --> D[span.annexus-legend__swatch — color from item.color]
  C --> E[span.annexus-legend__label — item.label]
```

---

#### 🤖 AI Agent Reference

**Must Read**:
- `docs/architecture/design/01-patterns-and-standards-greenfield.md` — BEM, SCSS modules
- `docs/ui-ux/ui-ux-spec.md` — Legend visual spec, chart colors

**Design Tokens**:
- `--annexus-spacing-2` (8px) — gap between items
- `--annexus-spacing-1` (4px) — gap between swatch and label within item
- `--annexus-font-size-sm` — label font size
- `--annexus-color-gray-600` — label text color
- Swatch size: 10px × 10px circle (hardcoded, not token-driven — chart series colors are dynamic)

**Description**:
`LegendItem` type: `{ color: string; label: string }`. `LegendProps`: `items: LegendItem[]` + `BaseProps`. Component renders `<ul role="list" className="annexus-legend">` with one `<li>` per item, each containing `<span className="annexus-legend__swatch" style={{ backgroundColor: item.color }}>` (10×10px circle) and `<span className="annexus-legend__label">{item.label}</span>`. Inline style on swatch is the correct pattern here — colors are dynamic data values, not design tokens.

**Acceptance Criteria** (comprehensive):
- `LegendItem`: `{ color: string; label: string }`
- `LegendProps`: `items: LegendItem[]` + `BaseProps`
- Renders `<ul role="list">` with class `annexus-legend`
- One `<li>` per item with class `annexus-legend__item`
- Swatch span: `style={{ backgroundColor: item.color }}`, `aria-hidden="true"`, class `annexus-legend__swatch`
- Label span: `{item.label}`, class `annexus-legend__label`
- Empty `items` array: renders `<ul>` with no children (no error)
- `className` merged via `classNames`

**RBAC Enforcement**: No role-differentiated access — single actor.

**System responses + error cases**:

| Trigger | Response | Side-effect |
|---------|----------|-------------|
| `items=[]` | Renders empty `<ul>` | none |
| Single item | One swatch+label pair | none |
| `color` is invalid CSS | Swatch renders without background (browser handles) | none |

**QA-observable behaviour**:
- `screen.getAllByRole('listitem').length` === `items.length`.
- Each label text is in the document.
- Swatch element has `aria-hidden="true"` (decorative).

**Prerequisites**:
- Stories 3.1–3.5 merged

**Steps**:

1. **Create `src/components/Legend/Legend.types.ts`**:
   ```typescript
   import type { BaseProps } from '../../types/common.types';

   export interface LegendItem {
     color: string;
     label: string;
   }

   export interface LegendProps extends BaseProps {
     items: LegendItem[];
   }
   ```

2. **Create `src/components/Legend/Legend.module.scss`**:
   ```scss
   .annexus-legend {
     list-style: none;
     margin: 0;
     padding: 0;
     display: flex;
     flex-wrap: wrap;
     gap: var(--annexus-spacing-2);

     &__item {
       display: flex;
       align-items: center;
       gap: var(--annexus-spacing-1);
     }

     &__swatch {
       display: inline-block;
       width: 10px;
       height: 10px;
       border-radius: var(--annexus-radius-full);
       flex-shrink: 0;
     }

     &__label {
       font-size: var(--annexus-font-size-sm);
       color: var(--annexus-color-gray-600);
     }
   }
   ```

3. **Create `src/components/Legend/Legend.tsx`**:
   ```tsx
   import React from 'react';
   import { classNames } from '../../utils/classNames';
   import styles from './Legend.module.scss';
   import type { LegendProps } from './Legend.types';

   export function Legend({ items, className, style, 'data-testid': testId }: LegendProps) {
     return (
       <ul
         role="list"
         className={classNames(styles['annexus-legend'], className)}
         style={style}
         data-testid={testId}
       >
         {items.map((item, index) => (
           <li key={index} className={styles['annexus-legend__item']}>
             <span
               className={styles['annexus-legend__swatch']}
               style={{ backgroundColor: item.color }}
               aria-hidden="true"
             />
             <span className={styles['annexus-legend__label']}>{item.label}</span>
           </li>
         ))}
       </ul>
     );
   }
   ```

4. **Create `src/components/Legend/index.ts`**:
   ```typescript
   export { Legend } from './Legend';
   export type { LegendProps, LegendItem } from './Legend.types';
   ```

5. **Create `src/components/Legend/Legend.stories.tsx`**:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { Legend } from './Legend';

   const meta: Meta<typeof Legend> = {
     title: 'Components/Legend',
     component: Legend,
     tags: ['autodocs'],
   };
   export default meta;

   type Story = StoryObj<typeof Legend>;

   export const Default: Story = {
     args: {
       items: [
         { color: '#11175E', label: 'Premium' },
         { color: '#0167AC', label: 'Base' },
         { color: '#079455', label: 'Rider' },
       ],
     },
   };

   export const SingleItem: Story = {
     args: { items: [{ color: '#B73B3B', label: 'Risk' }] },
   };

   export const Empty: Story = { args: { items: [] } };
   ```

6. **Create `src/components/Legend/Legend.test.tsx`**:
   ```tsx
   import { render, screen } from '@testing-library/react';
   import { Legend } from './Legend';

   const items = [
     { color: '#11175E', label: 'Premium' },
     { color: '#0167AC', label: 'Base' },
   ];

   describe('Legend', () => {
     it('renders correct number of items', () => {
       render(<Legend items={items} />);
       expect(screen.getAllByRole('listitem')).toHaveLength(2);
     });
     it('renders label text', () => {
       render(<Legend items={items} />);
       expect(screen.getByText('Premium')).toBeInTheDocument();
       expect(screen.getByText('Base')).toBeInTheDocument();
     });
     it('renders empty list for empty items', () => {
       render(<Legend items={[]} />);
       expect(screen.queryAllByRole('listitem')).toHaveLength(0);
     });
     it('applies backgroundColor to swatch', () => {
       const { container } = render(<Legend items={[{ color: '#11175E', label: 'A' }]} />);
       const swatch = container.querySelector('.annexus-legend__swatch') as HTMLElement;
       expect(swatch.style.backgroundColor).toBeTruthy();
     });
     it('swatch has aria-hidden', () => {
       const { container } = render(<Legend items={[{ color: '#11175E', label: 'A' }]} />);
       const swatch = container.querySelector('.annexus-legend__swatch');
       expect(swatch?.getAttribute('aria-hidden')).toBe('true');
     });
     it('applies custom className', () => {
       const { container } = render(<Legend items={[]} className="custom" />);
       expect(container.firstChild).toHaveClass('custom');
     });
     it('forwards data-testid', () => {
       render(<Legend items={[]} data-testid="legend" />);
       expect(screen.getByTestId('legend')).toBeInTheDocument();
     });
   });
   ```

7. **Update `src/index.ts`**:
   ```typescript
   export { Legend } from './components/Legend';
   export type { LegendProps, LegendItem } from './components/Legend';
   ```

8. **Run verification**:
   ```bash
   pnpm typecheck
   pnpm test src/components/Legend
   ```

**Tests**: 7 unit tests; `pnpm typecheck` exits 0

**Quality**: ≥ 90% coverage; `pnpm typecheck` exits 0

**OUT**:
- ❌ No interactive toggling of series visibility (read-only legend)
- ❌ No custom swatch shapes (circles only)

**Evidence**:
- Terminal output of `pnpm test src/components/Legend` (7 tests pass)
- Terminal output of `pnpm typecheck` (exit 0)
