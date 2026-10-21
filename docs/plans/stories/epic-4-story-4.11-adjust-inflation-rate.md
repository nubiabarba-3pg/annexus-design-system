### Story 4.11: AdjustInflationRate Component

**File**: `docs/plans/stories/epic-4-story-4.11-adjust-inflation-rate.md`

**BUILDID**: CYCLE-3 | **AzureDevOps**: #23688 | **Epic**: 4 - P1 COMPOSITION | **ID**: 4.11 | **Date**: 2026-10-13
**Wave**: 6
**Requires**: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4]
**Enables**: []
**Files Touched**:
  - src/components/AdjustInflationRate/AdjustInflationRate.tsx
  - src/components/AdjustInflationRate/AdjustInflationRate.types.ts
  - src/components/AdjustInflationRate/AdjustInflationRate.module.scss
  - src/components/AdjustInflationRate/AdjustInflationRate.stories.tsx
  - src/components/AdjustInflationRate/AdjustInflationRate.test.tsx
  - src/components/AdjustInflationRate/index.ts
  - src/index.ts
**Roles Ref**: docs/requirements.md#roles--permissions-matrix — single-actor — no role variation
**QA Candidate**: Yes — **Observable:** `pnpm storybook` shows AdjustInflationRate with a numeric input and +/- stepper buttons; the input accepts values within a min/max range; `pnpm test src/components/AdjustInflationRate` exits 0 with ≥ 90% coverage; `pnpm typecheck` exits 0. **Mechanism:** AdjustInflationRate composes a label + numeric input + increment/decrement buttons. Stateless: `value` and `onChange` are props. Enforces min/max boundaries. **Authz & preconditions:** requires CYCLE-1 fully merged.

> **Styling (CR-001, 2026-10-20)**: wherever this story says `var(--annexus-*)`, `src/tokens/` or a hex value, implement it as a **design variable** instead. Add `$<section><Element><State><Property>` (camelCase, section-prefixed, never repeated) to `src/styles/design.variables.scss`, pointing to a color in `src/styles/pallete.color.scss`, and `@use '../../styles/design.variables' as *;` in the component SCSS. Component SCSS never uses hex values or palette variables. Every new design variable is also added to `src/styles/design.variables.module.scss` so it is exported to JS (`designVariables`). Fonts use `$fontFamilyBase` and section-named size/line-height/weight variables. Reference implementation: `src/components/Input/Input.scss`. Spec: Story 3.2.

---

#### 👤 User Reference

**Description**:
AdjustInflationRate renders a labeled numeric stepper control for setting an inflation rate percentage. It displays a `+` and `−` button flanking a numeric input field. The `value` is clamped to `[min, max]` boundaries. The component is stateless — `value` and `onChange` are props. A `label` prop provides the field label and an `aria-label` for the input. The step size defaults to 0.5 (half a percentage point).

**Acceptance Criteria** (plain-English):
- Renders a labeled numeric stepper with `−` and `+` buttons
- `−` decrements value by `step`; clamped at `min`
- `+` increments value by `step`; clamped at `max`
- Direct input is accepted; out-of-range values are clamped on blur
- `onChange(newValue)` called with the new numeric value
- `disabled` prop disables both buttons and the input
- `className` prop merges with base class
- `pnpm test` exits 0; ≥ 90% coverage

**User Journey** (no role variation — single actor: DEV):
- ```tsx
  const [rate, setRate] = useState(3.0);
  <AdjustInflationRate
    label="Inflation Rate"
    value={rate}
    onChange={setRate}
    min={0}
    max={10}
    step={0.5}
  />
  ```
- User clicks `+` → rate increments by 0.5.
- User clicks `−` at 0 → no change (clamped).

**Flow Diagram**:

```mermaid
flowchart TD
  A[value, onChange, min, max, step, label] --> B[div.annexus-adjust-inflation-rate]
  B --> C[label element]
  B --> D[div.annexus-adjust-inflation-rate__control]
  D --> E[button − : onClick: onChange(clamp(value - step, min, max))]
  D --> F[input type=number — value display]
  D --> G[button + : onClick: onChange(clamp(value + step, min, max))]
```

---

#### 🤖 AI Agent Reference

**Must Read**:
- `docs/architecture/design/01-patterns-and-standards-greenfield.md` — stepper pattern, input pattern, ARIA
- `docs/ui-ux/ui-ux-spec.md` — AdjustInflationRate visual spec

**Design Tokens**:
- `--annexus-color-brand-primary` — stepper button color
- `--annexus-color-gray-200` — input border
- `--annexus-color-gray-100` — button background (or transparent)
- `--annexus-font-size-md` — input and label font size
- `--annexus-font-weight-medium` — label weight
- `--annexus-spacing-2` — gap between elements
- `--annexus-radius-md` — border radius on input and buttons
- `--annexus-shadow-xs-skeuomorphic` — button shadow

**Description**:
`AdjustInflationRateProps`: `label: string`, `value: number`, `onChange: (value: number) => void`, `min?: number` (default `0`), `max?: number` (default `10`), `step?: number` (default `0.5`), `disabled?: boolean`, plus `BaseProps`. The `inputId` is generated via `useId()` to associate the `<label>` and `<input>`. The `<input type="number">` shows the current value; `onBlur` clamps any directly typed value to `[min, max]`. The `−` button is disabled when `value <= min`; the `+` button is disabled when `value >= max`.

**Acceptance Criteria** (comprehensive):
- Props: `label, value, onChange, min=0, max=10, step=0.5, disabled?` + `BaseProps`
- `<label>` associated with `<input>` via `htmlFor` / `id` (useId)
- `<input type="number" step={step} min={min} max={max}>`
- Decrement button: `disabled` when `value <= min` or `disabled` prop true
- Increment button: `disabled` when `value >= max` or `disabled` prop true
- Click decrement → `onChange(Math.max(min, value - step))`
- Click increment → `onChange(Math.min(max, value + step))`
- Input blur → `onChange(clamp(parseFloat(inputValue), min, max))`
- `className` merged via `classNames`

**RBAC Enforcement**: No role-differentiated access — single actor.

**System responses + error cases**:

| Trigger | Response | Side-effect |
|---------|----------|-------------|
| Click `+` at max | No-op (button disabled) | none |
| Click `−` at min | No-op (button disabled) | none |
| Type `15` in input (max=10) | Clamped to 10 on blur | onChange(10) |
| `disabled=true` | Both buttons and input disabled | none |

**QA-observable behaviour**:
- `screen.getByRole('spinbutton', { name: label })` — resolves (input type=number).
- Decrement button: `aria-label="Decrease inflation rate"`.
- Increment button: `aria-label="Increase inflation rate"`.
- Click increment → `onChange` called with incremented value.

**Prerequisites**:
- Stories 3.1–3.5 merged

**Steps**:

1. **Create `src/components/AdjustInflationRate/AdjustInflationRate.types.ts`**:
   ```typescript
   import type { BaseProps } from '../../types/common.types';

   export interface AdjustInflationRateProps extends BaseProps {
     label: string;
     value: number;
     onChange: (value: number) => void;
     min?: number;
     max?: number;
     step?: number;
     disabled?: boolean;
   }
   ```

2. **Create `src/components/AdjustInflationRate/AdjustInflationRate.module.scss`**:
   ```scss
   .annexus-adjust-inflation-rate {
     display: flex;
     flex-direction: column;
     gap: var(--annexus-spacing-2);

     &__label {
       font-size: var(--annexus-font-size-md);
       font-weight: var(--annexus-font-weight-medium);
       color: var(--annexus-color-neutral-black);
     }

     &__control {
       display: flex;
       align-items: center;
       gap: var(--annexus-spacing-2);
     }

     &__input {
       width: 64px;
       text-align: center;
       border: 1px solid var(--annexus-color-gray-200);
       border-radius: var(--annexus-radius-md);
       padding: var(--annexus-spacing-2);
       font-size: var(--annexus-font-size-md);
       color: var(--annexus-color-neutral-black);

       &::-webkit-inner-spin-button,
       &::-webkit-outer-spin-button {
         appearance: none;
       }

       &:focus-visible {
         outline: 2px solid var(--annexus-color-brand-cta);
         outline-offset: 1px;
       }

       &:disabled {
         opacity: 0.5;
         cursor: not-allowed;
       }
     }

     &__btn {
       display: inline-flex;
       align-items: center;
       justify-content: center;
       width: 32px;
       height: 32px;
       border: 1px solid var(--annexus-color-gray-200);
       border-radius: var(--annexus-radius-md);
       background: var(--annexus-color-neutral-white);
       color: var(--annexus-color-brand-primary);
       font-size: var(--annexus-font-size-lg);
       cursor: pointer;
       box-shadow: var(--annexus-shadow-xs-skeuomorphic);
       transition: opacity 150ms ease;

       &:disabled {
         opacity: 0.4;
         cursor: not-allowed;
       }

       &:focus-visible {
         outline: 2px solid var(--annexus-color-brand-cta);
         outline-offset: 2px;
       }
     }
   }
   ```

3. **Create `src/components/AdjustInflationRate/AdjustInflationRate.tsx`**:
   ```tsx
   import React, { useId, useState } from 'react';
   import { classNames } from '../../utils/classNames';
   import styles from './AdjustInflationRate.module.scss';
   import type { AdjustInflationRateProps } from './AdjustInflationRate.types';

   function clamp(value: number, min: number, max: number): number {
     return Math.min(max, Math.max(min, value));
   }

   export function AdjustInflationRate({
     label, value, onChange,
     min = 0, max = 10, step = 0.5, disabled = false,
     className, style, 'data-testid': testId,
   }: AdjustInflationRateProps) {
     const inputId = `annexus-air-${useId().replace(/:/g, '')}`;
     const [inputValue, setInputValue] = useState(String(value));

     const handleDecrement = () => onChange(clamp(value - step, min, max));
     const handleIncrement = () => onChange(clamp(value + step, min, max));

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setInputValue(e.target.value);
     };

     const handleBlur = () => {
       const parsed = parseFloat(inputValue);
       const clamped = isNaN(parsed) ? value : clamp(parsed, min, max);
       setInputValue(String(clamped));
       onChange(clamped);
     };

     // Sync inputValue when value prop changes from outside
     React.useEffect(() => {
       setInputValue(String(value));
     }, [value]);

     return (
       <div
         className={classNames(styles['annexus-adjust-inflation-rate'], className)}
         style={style}
         data-testid={testId}
       >
         <label htmlFor={inputId} className={styles['annexus-adjust-inflation-rate__label']}>
           {label}
         </label>
         <div className={styles['annexus-adjust-inflation-rate__control']}>
           <button
             type="button"
             aria-label="Decrease inflation rate"
             onClick={handleDecrement}
             disabled={disabled || value <= min}
             className={styles['annexus-adjust-inflation-rate__btn']}
           >
             −
           </button>
           <input
             id={inputId}
             type="number"
             step={step}
             min={min}
             max={max}
             value={inputValue}
             onChange={handleInputChange}
             onBlur={handleBlur}
             disabled={disabled}
             className={styles['annexus-adjust-inflation-rate__input']}
             aria-label={label}
           />
           <button
             type="button"
             aria-label="Increase inflation rate"
             onClick={handleIncrement}
             disabled={disabled || value >= max}
             className={styles['annexus-adjust-inflation-rate__btn']}
           >
             +
           </button>
         </div>
       </div>
     );
   }
   ```

4. **Create `src/components/AdjustInflationRate/index.ts`**:
   ```typescript
   export { AdjustInflationRate } from './AdjustInflationRate';
   export type { AdjustInflationRateProps } from './AdjustInflationRate.types';
   ```

5. **Create `src/components/AdjustInflationRate/AdjustInflationRate.stories.tsx`**:
   ```tsx
   import { useState } from 'react';
   import type { Meta } from '@storybook/react';
   import { AdjustInflationRate } from './AdjustInflationRate';

   const meta: Meta<typeof AdjustInflationRate> = {
     title: 'Components/AdjustInflationRate',
     component: AdjustInflationRate,
     tags: ['autodocs'],
   };
   export default meta;

   export const Interactive = () => {
     const [rate, setRate] = useState(3.0);
     return (
       <AdjustInflationRate
         label="Inflation Rate"
         value={rate}
         onChange={setRate}
         min={0}
         max={10}
         step={0.5}
       />
     );
   };

   export const AtMinimum = () => (
     <AdjustInflationRate label="Inflation Rate" value={0} onChange={() => {}} min={0} max={10} />
   );

   export const Disabled = () => (
     <AdjustInflationRate label="Inflation Rate" value={3} onChange={() => {}} disabled />
   );
   ```

6. **Create `src/components/AdjustInflationRate/AdjustInflationRate.test.tsx`**:
   ```tsx
   import { render, screen } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { AdjustInflationRate } from './AdjustInflationRate';

   const baseProps = { label: 'Rate', value: 3, onChange: vi.fn(), min: 0, max: 10, step: 0.5 };

   describe('AdjustInflationRate', () => {
     it('renders label', () => {
       render(<AdjustInflationRate {...baseProps} />);
       expect(screen.getByText('Rate')).toBeInTheDocument();
     });
     it('renders input with current value', () => {
       render(<AdjustInflationRate {...baseProps} />);
       expect(screen.getByRole('spinbutton')).toHaveValue(3);
     });
     it('calls onChange with incremented value on + click', async () => {
       const onChange = vi.fn();
       render(<AdjustInflationRate {...baseProps} onChange={onChange} />);
       await userEvent.click(screen.getByRole('button', { name: 'Increase inflation rate' }));
       expect(onChange).toHaveBeenCalledWith(3.5);
     });
     it('calls onChange with decremented value on − click', async () => {
       const onChange = vi.fn();
       render(<AdjustInflationRate {...baseProps} onChange={onChange} />);
       await userEvent.click(screen.getByRole('button', { name: 'Decrease inflation rate' }));
       expect(onChange).toHaveBeenCalledWith(2.5);
     });
     it('decrement button disabled at min', () => {
       render(<AdjustInflationRate {...baseProps} value={0} />);
       expect(screen.getByRole('button', { name: 'Decrease inflation rate' })).toBeDisabled();
     });
     it('increment button disabled at max', () => {
       render(<AdjustInflationRate {...baseProps} value={10} />);
       expect(screen.getByRole('button', { name: 'Increase inflation rate' })).toBeDisabled();
     });
     it('both buttons disabled when disabled=true', () => {
       render(<AdjustInflationRate {...baseProps} disabled />);
       expect(screen.getByRole('button', { name: 'Decrease inflation rate' })).toBeDisabled();
       expect(screen.getByRole('button', { name: 'Increase inflation rate' })).toBeDisabled();
     });
     it('forwards data-testid', () => {
       render(<AdjustInflationRate {...baseProps} data-testid="air" />);
       expect(screen.getByTestId('air')).toBeInTheDocument();
     });
   });
   ```

7. **Update `src/index.ts`**:
   ```typescript
   export { AdjustInflationRate } from './components/AdjustInflationRate';
   export type { AdjustInflationRateProps } from './components/AdjustInflationRate';
   ```

8. **Run verification**:
   ```bash
   pnpm typecheck
   pnpm test src/components/AdjustInflationRate
   ```

**Tests**: 8 unit tests; `pnpm typecheck` exits 0

**Quality**: ≥ 90% coverage; `pnpm typecheck` exits 0

**OUT**:
- ❌ No floating-point precision formatting (consumer rounds display if needed)
- ❌ No percentage sign suffix (label conveys unit context)

**Evidence**:
- Terminal output of `pnpm test src/components/AdjustInflationRate` (8 tests pass)
- Terminal output of `pnpm typecheck` (exit 0)
