### Story 4.8: AgeTag Component

**File**: `docs/plans/stories/epic-4-story-4.8-age-tag.md`

**BUILDID**: CYCLE-3 | **AzureDevOps**: #23692 | **Epic**: 4 - P1 COMPOSITION | **ID**: 4.8 | **Date**: 2026-10-13
**Wave**: 6
**Requires**: [3.1, 3.2, 3.3, 3.4, 3.5]
**Enables**: []
**Files Touched**:
  - src/components/AgeTag/AgeTag.tsx
  - src/components/AgeTag/AgeTag.types.ts
  - src/components/AgeTag/AgeTag.module.scss
  - src/components/AgeTag/AgeTag.stories.tsx
  - src/components/AgeTag/AgeTag.test.tsx
  - src/components/AgeTag/index.ts
  - src/index.ts
**Roles Ref**: docs/requirements.md#roles--permissions-matrix — single-actor — no role variation
**QA Candidate**: Yes — **Observable:** `pnpm storybook` shows AgeTag stories with a numeric age and a "yrs" suffix in a styled pill; different semantic tones apply different background colors; `pnpm test src/components/AgeTag` exits 0 with ≥ 90% coverage; `pnpm typecheck` exits 0. **Mechanism:** AgeTag is a specialized Badge-like component displaying an age value with a "yrs" suffix and a semantic tone (neutral/info/warning). Pure presentational, no state. **Authz & preconditions:** requires CYCLE-1 fully merged.

---

#### 👤 User Reference

**Description**:
AgeTag renders an age value (integer) with a "yrs" suffix in a compact pill shape. Used alongside insured person data to display age at entry, current age, or max entry age. The `tone` prop applies semantic color coding: neutral (default), info (within recommended range), warning (approaching limit). AgeTag is distinct from Badge — it has domain-specific semantics and always displays a numeric value with units.

**Acceptance Criteria** (plain-English):
- Renders `{age} yrs` within a pill-shaped element
- `tone` prop applies semantic background/text color (`neutral` | `info` | `warning`)
- Default tone is `neutral`
- `aria-label` defaults to `"{age} years"` for screen reader clarity
- `className` prop merges with base class
- `pnpm test` exits 0; ≥ 90% coverage

**User Journey** (no role variation — single actor: DEV):
- `<AgeTag age={35} />` — neutral gray pill, "35 yrs"
- `<AgeTag age={59} tone="warning" />` — warning-colored pill, "59 yrs"

**Flow Diagram**:

```mermaid
flowchart TD
  A[age: number, tone?: Tone subset] --> B[span.annexus-age-tag]
  B --> C[text: age + ' yrs']
  B --> D[modifier class: --neutral | --info | --warning]
```

---

#### 🤖 AI Agent Reference

**Must Read**:
- `docs/architecture/design/01-patterns-and-standards-greenfield.md` — BEM, SCSS modules, Badge pattern
- `docs/ui-ux/ui-ux-spec.md` — AgeTag visual spec

**Design Tokens**:
- Neutral: `--annexus-color-gray-100` bg, `--annexus-color-gray-700` text
- Info: `--annexus-color-brand-cta` tint bg (e.g., light blue), `--annexus-color-brand-cta` text
- Warning: light amber bg, `--annexus-color-semantic-error` text (or specific warning token)
- `--annexus-font-size-xs` — tag font size
- `--annexus-font-weight-medium` — tag font weight
- `--annexus-radius-full` — pill shape
- `--annexus-spacing-1` / `--annexus-spacing-2` — padding

**Description**:
`AgeTagTone = 'neutral' | 'info' | 'warning'`. `AgeTagProps`: `age: number`, `tone?: AgeTagTone` (default `'neutral'`), plus `BaseProps`. Component renders `<span aria-label={\`${age} years\`} className={classNames('annexus-age-tag', \`annexus-age-tag--${tone}\`)}>{age} yrs</span>`. Note: `Tone` from common.types is a superset; AgeTag defines its own narrower `AgeTagTone` to restrict valid values to the three supported tones.

**Acceptance Criteria** (comprehensive):
- `AgeTagTone = 'neutral' | 'info' | 'warning'`
- `AgeTagProps`: `age: number; tone?: AgeTagTone` + `BaseProps`
- Renders `<span>` with text `"{age} yrs"`
- `aria-label="{age} years"` (full word for screen reader)
- Modifier class `annexus-age-tag--{tone}` applied
- Default tone `'neutral'` when not provided
- `className` merged via `classNames`

**RBAC Enforcement**: No role-differentiated access — single actor.

**System responses + error cases**:

| Trigger | Response | Side-effect |
|---------|----------|-------------|
| `tone="neutral"` (default) | Gray background | none |
| `tone="info"` | Blue tint background | none |
| `tone="warning"` | Amber/warning background | none |
| `age=0` | "0 yrs" rendered | none |

**QA-observable behaviour**:
- `screen.getByText('35 yrs')` — resolves for `age=35`.
- `aria-label="35 years"` on the span.
- Correct modifier class for each tone.

**Prerequisites**:
- Stories 3.1–3.5 merged

**Steps**:

1. **Create `src/components/AgeTag/AgeTag.types.ts`**:
   ```typescript
   import type { BaseProps } from '../../types/common.types';

   export type AgeTagTone = 'neutral' | 'info' | 'warning';

   export interface AgeTagProps extends BaseProps {
     age: number;
     tone?: AgeTagTone;
   }
   ```

2. **Create `src/components/AgeTag/AgeTag.module.scss`**:
   ```scss
   .annexus-age-tag {
     display: inline-flex;
     align-items: center;
     padding: var(--annexus-spacing-1) var(--annexus-spacing-2);
     border-radius: var(--annexus-radius-full);
     font-size: var(--annexus-font-size-xs);
     font-weight: var(--annexus-font-weight-medium);

     &--neutral {
       background-color: var(--annexus-color-gray-100);
       color: var(--annexus-color-gray-700);
     }

     &--info {
       background-color: #EFF8FF;
       color: var(--annexus-color-brand-cta);
     }

     &--warning {
       background-color: #FFFAEB;
       color: #B54708;
     }
   }
   ```

3. **Create `src/components/AgeTag/AgeTag.tsx`**:
   ```tsx
   import React from 'react';
   import { classNames } from '../../utils/classNames';
   import styles from './AgeTag.module.scss';
   import type { AgeTagProps } from './AgeTag.types';

   export function AgeTag({ age, tone = 'neutral', className, style, 'data-testid': testId }: AgeTagProps) {
     return (
       <span
         aria-label={`${age} years`}
         className={classNames(
           styles['annexus-age-tag'],
           styles[`annexus-age-tag--${tone}`],
           className,
         )}
         style={style}
         data-testid={testId}
       >
         {age} yrs
       </span>
     );
   }
   ```

4. **Create `src/components/AgeTag/index.ts`**:
   ```typescript
   export { AgeTag } from './AgeTag';
   export type { AgeTagProps, AgeTagTone } from './AgeTag.types';
   ```

5. **Create `src/components/AgeTag/AgeTag.stories.tsx`**:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { AgeTag } from './AgeTag';

   const meta: Meta<typeof AgeTag> = {
     title: 'Components/AgeTag',
     component: AgeTag,
     tags: ['autodocs'],
   };
   export default meta;

   type Story = StoryObj<typeof AgeTag>;

   export const Neutral: Story = { args: { age: 35 } };
   export const Info: Story = { args: { age: 42, tone: 'info' } };
   export const Warning: Story = { args: { age: 59, tone: 'warning' } };
   ```

6. **Create `src/components/AgeTag/AgeTag.test.tsx`**:
   ```tsx
   import { render, screen } from '@testing-library/react';
   import { AgeTag } from './AgeTag';

   describe('AgeTag', () => {
     it('renders age with yrs suffix', () => {
       render(<AgeTag age={35} />);
       expect(screen.getByText('35 yrs')).toBeInTheDocument();
     });
     it('has aria-label with full word "years"', () => {
       render(<AgeTag age={35} />);
       expect(screen.getByLabelText('35 years')).toBeInTheDocument();
     });
     it('applies neutral class by default', () => {
       const { container } = render(<AgeTag age={35} />);
       expect(container.firstChild?.toString()).toContain('neutral');
     });
     it('applies info class when tone=info', () => {
       const { container } = render(<AgeTag age={42} tone="info" />);
       expect(container.firstChild?.toString()).toContain('info');
     });
     it('applies warning class when tone=warning', () => {
       const { container } = render(<AgeTag age={59} tone="warning" />);
       expect(container.firstChild?.toString()).toContain('warning');
     });
     it('renders age=0 correctly', () => {
       render(<AgeTag age={0} />);
       expect(screen.getByText('0 yrs')).toBeInTheDocument();
     });
     it('applies custom className', () => {
       const { container } = render(<AgeTag age={35} className="custom" />);
       expect(container.firstChild).toHaveClass('custom');
     });
     it('forwards data-testid', () => {
       render(<AgeTag age={35} data-testid="at" />);
       expect(screen.getByTestId('at')).toBeInTheDocument();
     });
   });
   ```

7. **Update `src/index.ts`**:
   ```typescript
   export { AgeTag } from './components/AgeTag';
   export type { AgeTagProps, AgeTagTone } from './components/AgeTag';
   ```

8. **Run verification**:
   ```bash
   pnpm typecheck
   pnpm test src/components/AgeTag
   ```

**Tests**: 8 unit tests; `pnpm typecheck` exits 0

**Quality**: ≥ 90% coverage; `pnpm typecheck` exits 0

**OUT**:
- ❌ No success/danger tones for AgeTag (only neutral/info/warning are domain-valid)
- ❌ No interactive state (display-only)

**Evidence**:
- Terminal output of `pnpm test src/components/AgeTag` (8 tests pass)
- Terminal output of `pnpm typecheck` (exit 0)
