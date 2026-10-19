### Story 4.7: FrequencySelector Component

**File**: `docs/plans/stories/epic-4-story-4.7-frequency-selector.md`

**BUILDID**: CYCLE-3 | **AzureDevOps**: #23690 | **Epic**: 4 - P1 COMPOSITION | **ID**: 4.7 | **Date**: 2026-10-13
**Wave**: 6
**Requires**: [3.1, 3.2, 3.3, 3.4, 3.5]
**Enables**: []
**Files Touched**:
  - src/components/FrequencySelector/FrequencySelector.tsx
  - src/components/FrequencySelector/FrequencySelector.types.ts
  - src/components/FrequencySelector/FrequencySelector.module.scss
  - src/components/FrequencySelector/FrequencySelector.stories.tsx
  - src/components/FrequencySelector/FrequencySelector.test.tsx
  - src/components/FrequencySelector/index.ts
  - src/index.ts
**Roles Ref**: docs/requirements.md#roles--permissions-matrix — single-actor — no role variation
**QA Candidate**: Yes — **Observable:** `pnpm storybook` shows a FrequencySelector with Monthly/Quarterly/Annual options; clicking a segment activates it visually; `pnpm test src/components/FrequencySelector` exits 0 with ≥ 90% coverage; `pnpm typecheck` exits 0. **Mechanism:** FrequencySelector renders a segmented control (button group) — a horizontal row of pill-shaped buttons where exactly one is active at a time. Stateless: `value` and `onChange` are props. **Authz & preconditions:** requires CYCLE-1 fully merged.

---

#### 👤 User Reference

**Description**:
FrequencySelector renders a segmented button control for selecting a payment frequency (Monthly, Quarterly, Annual — or any set of labeled options). It functions as a radio group visually styled as a connected pill bar. The active segment has a filled brand-color background; inactive segments are outlined. Stateless — `value` (the selected option value) and `onChange` are props.

**Acceptance Criteria** (plain-English):
- Renders one button per option in the `options` array
- The button whose `value` matches the `value` prop is visually active
- Clicking an inactive button calls `onChange(option.value)`
- Accessible: `role="radiogroup"` on the container; each button has `role="radio"` and `aria-checked`
- `className` prop merges with base class
- `pnpm test` exits 0; ≥ 90% coverage

**User Journey** (no role variation — single actor: DEV):
- ```tsx
  const [freq, setFreq] = useState('monthly');
  <FrequencySelector
    options={[
      { label: 'Monthly', value: 'monthly' },
      { label: 'Quarterly', value: 'quarterly' },
      { label: 'Annual', value: 'annual' },
    ]}
    value={freq}
    onChange={setFreq}
  />
  ```

**Flow Diagram**:

```mermaid
flowchart TD
  A[options, value, onChange] --> B[div role=radiogroup .annexus-frequency-selector]
  B --> C[button role=radio × N]
  C --> D[aria-checked = value === option.value]
  D --> E[onClick: onChange(option.value)]
```

---

#### 🤖 AI Agent Reference

**Must Read**:
- `docs/architecture/design/01-patterns-and-standards-greenfield.md` — segmented control pattern, ARIA radiogroup
- `docs/ui-ux/ui-ux-spec.md` — FrequencySelector visual spec

**Design Tokens**:
- `--annexus-color-brand-primary` — active segment background
- `--annexus-color-neutral-white` — active segment text
- `--annexus-color-gray-200` — border between segments
- `--annexus-color-gray-600` — inactive text color
- `--annexus-font-size-sm` — segment label font size
- `--annexus-font-weight-medium` — active label weight
- `--annexus-radius-full` — pill shape for the container
- `--annexus-spacing-2` / `--annexus-spacing-3` — segment padding

**Description**:
`FrequencySelectorOption`: `{ label: string; value: string }`. `FrequencySelectorProps`: `options: FrequencySelectorOption[]`, `value: string`, `onChange: (value: string) => void`, plus `BaseProps`. Container: `<div role="radiogroup" className="annexus-frequency-selector">`. Each option: `<button type="button" role="radio" aria-checked={option.value === value} onClick={() => onChange(option.value)}>`. Active button has modifier class `annexus-frequency-selector__option--active`. First/last buttons get `--first`/`--last` modifiers for border-radius rounding.

**Acceptance Criteria** (comprehensive):
- `FrequencySelectorOption`: `{ label: string; value: string }`
- `FrequencySelectorProps`: `options, value, onChange` + `BaseProps`
- Container: `<div role="radiogroup">`
- Each button: `role="radio"`, `aria-checked={option.value === value}`, `type="button"`
- Click → `onChange(option.value)` called
- Active button has distinct visual state (brand background, white text)
- `className` merged on container via `classNames`

**RBAC Enforcement**: No role-differentiated access — single actor.

**System responses + error cases**:

| Trigger | Response | Side-effect |
|---------|----------|-------------|
| Click inactive option | `onChange(value)` called | Parent updates `value` |
| Click active option | `onChange(value)` called (idempotent) | No visual change |
| Empty `options` | Renders empty container | none |

**QA-observable behaviour**:
- `screen.getByRole('radiogroup')` — resolves.
- Active button: `aria-checked="true"`.
- Inactive buttons: `aria-checked="false"`.
- Click → onChange called with correct value.

**Prerequisites**:
- Stories 3.1–3.5 merged

**Steps**:

1. **Create `src/components/FrequencySelector/FrequencySelector.types.ts`**:
   ```typescript
   import type { BaseProps } from '../../types/common.types';

   export interface FrequencySelectorOption {
     label: string;
     value: string;
   }

   export interface FrequencySelectorProps extends BaseProps {
     options: FrequencySelectorOption[];
     value: string;
     onChange: (value: string) => void;
   }
   ```

2. **Create `src/components/FrequencySelector/FrequencySelector.module.scss`**:
   ```scss
   .annexus-frequency-selector {
     display: inline-flex;
     border: 1px solid var(--annexus-color-gray-200);
     border-radius: var(--annexus-radius-full);
     overflow: hidden;

     &__option {
       flex: 1;
       padding: var(--annexus-spacing-2) var(--annexus-spacing-3);
       border: none;
       background: transparent;
       font-size: var(--annexus-font-size-sm);
       color: var(--annexus-color-gray-600);
       cursor: pointer;
       transition: background-color 150ms ease, color 150ms ease;

       &:not(:last-child) {
         border-right: 1px solid var(--annexus-color-gray-200);
       }

       &--active {
         background-color: var(--annexus-color-brand-primary);
         color: var(--annexus-color-neutral-white);
         font-weight: var(--annexus-font-weight-medium);
       }

       &:focus-visible {
         outline: 2px solid var(--annexus-color-brand-cta);
         outline-offset: -2px;
       }
     }
   }
   ```

3. **Create `src/components/FrequencySelector/FrequencySelector.tsx`**:
   ```tsx
   import React from 'react';
   import { classNames } from '../../utils/classNames';
   import styles from './FrequencySelector.module.scss';
   import type { FrequencySelectorProps } from './FrequencySelector.types';

   export function FrequencySelector({ options, value, onChange, className, style, 'data-testid': testId }: FrequencySelectorProps) {
     return (
       <div
         role="radiogroup"
         className={classNames(styles['annexus-frequency-selector'], className)}
         style={style}
         data-testid={testId}
       >
         {options.map((option) => (
           <button
             key={option.value}
             type="button"
             role="radio"
             aria-checked={option.value === value}
             onClick={() => onChange(option.value)}
             className={classNames(
               styles['annexus-frequency-selector__option'],
               option.value === value && styles['annexus-frequency-selector__option--active'],
             )}
           >
             {option.label}
           </button>
         ))}
       </div>
     );
   }
   ```

4. **Create `src/components/FrequencySelector/index.ts`**:
   ```typescript
   export { FrequencySelector } from './FrequencySelector';
   export type { FrequencySelectorProps, FrequencySelectorOption } from './FrequencySelector.types';
   ```

5. **Create `src/components/FrequencySelector/FrequencySelector.stories.tsx`**:
   ```tsx
   import { useState } from 'react';
   import type { Meta, StoryObj } from '@storybook/react';
   import { FrequencySelector } from './FrequencySelector';

   const options = [
     { label: 'Monthly', value: 'monthly' },
     { label: 'Quarterly', value: 'quarterly' },
     { label: 'Annual', value: 'annual' },
   ];

   const meta: Meta<typeof FrequencySelector> = {
     title: 'Components/FrequencySelector',
     component: FrequencySelector,
     tags: ['autodocs'],
   };
   export default meta;

   export const Interactive = () => {
     const [value, setValue] = useState('monthly');
     return <FrequencySelector options={options} value={value} onChange={setValue} />;
   };

   export const Annual: StoryObj<typeof FrequencySelector> = {
     args: { options, value: 'annual', onChange: () => {} },
   };
   ```

6. **Create `src/components/FrequencySelector/FrequencySelector.test.tsx`**:
   ```tsx
   import { render, screen } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { FrequencySelector } from './FrequencySelector';

   const options = [
     { label: 'Monthly', value: 'monthly' },
     { label: 'Annual', value: 'annual' },
   ];

   describe('FrequencySelector', () => {
     it('renders radiogroup', () => {
       render(<FrequencySelector options={options} value="monthly" onChange={() => {}} />);
       expect(screen.getByRole('radiogroup')).toBeInTheDocument();
     });
     it('renders one radio per option', () => {
       render(<FrequencySelector options={options} value="monthly" onChange={() => {}} />);
       expect(screen.getAllByRole('radio')).toHaveLength(2);
     });
     it('active option has aria-checked true', () => {
       render(<FrequencySelector options={options} value="monthly" onChange={() => {}} />);
       expect(screen.getByRole('radio', { name: 'Monthly' })).toHaveAttribute('aria-checked', 'true');
     });
     it('inactive option has aria-checked false', () => {
       render(<FrequencySelector options={options} value="monthly" onChange={() => {}} />);
       expect(screen.getByRole('radio', { name: 'Annual' })).toHaveAttribute('aria-checked', 'false');
     });
     it('calls onChange with correct value on click', async () => {
       const onChange = vi.fn();
       render(<FrequencySelector options={options} value="monthly" onChange={onChange} />);
       await userEvent.click(screen.getByRole('radio', { name: 'Annual' }));
       expect(onChange).toHaveBeenCalledWith('annual');
     });
     it('renders empty for empty options', () => {
       render(<FrequencySelector options={[]} value="" onChange={() => {}} />);
       expect(screen.queryAllByRole('radio')).toHaveLength(0);
     });
     it('forwards data-testid', () => {
       render(<FrequencySelector options={options} value="monthly" onChange={() => {}} data-testid="fs" />);
       expect(screen.getByTestId('fs')).toBeInTheDocument();
     });
   });
   ```

7. **Update `src/index.ts`**:
   ```typescript
   export { FrequencySelector } from './components/FrequencySelector';
   export type { FrequencySelectorProps, FrequencySelectorOption } from './components/FrequencySelector';
   ```

8. **Run verification**:
   ```bash
   pnpm typecheck
   pnpm test src/components/FrequencySelector
   ```

**Tests**: 7 unit tests; `pnpm typecheck` exits 0

**Quality**: ≥ 90% coverage; `pnpm typecheck` exits 0

**OUT**:
- ❌ No keyboard arrow navigation within the group (arrow navigation added if needed per a11y audit)
- ❌ No disabled per-option state (not required per spec)

**Evidence**:
- Terminal output of `pnpm test src/components/FrequencySelector` (7 tests pass)
- Terminal output of `pnpm typecheck` (exit 0)
