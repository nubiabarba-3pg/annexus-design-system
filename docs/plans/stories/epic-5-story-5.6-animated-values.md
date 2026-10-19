### Story 5.6: AnimatedValues Component

**File**: `docs/plans/stories/epic-5-story-5.6-animated-values.md`

**BUILDID**: CYCLE-4 | **AzureDevOps**: #23697 | **Epic**: 5 - P2 COMPLEX + v1.0 | **ID**: 5.6 | **Date**: 2026-10-13
**Wave**: 7
**Requires**: [3.1, 3.2, 3.3, 3.4, 3.5]
**Enables**: []
**Files Touched**:
  - src/components/AnimatedValues/AnimatedValues.tsx
  - src/components/AnimatedValues/AnimatedValues.types.ts
  - src/components/AnimatedValues/AnimatedValues.module.scss
  - src/components/AnimatedValues/AnimatedValues.stories.tsx
  - src/components/AnimatedValues/AnimatedValues.test.tsx
  - src/components/AnimatedValues/index.ts
  - src/index.ts
**Roles Ref**: docs/requirements.md#roles--permissions-matrix — single-actor — no role variation
**QA Candidate**: Yes — **Observable:** `pnpm storybook` shows AnimatedValues counting up from 0 to the target value on mount; changing the value prop animates the transition; `pnpm test src/components/AnimatedValues` exits 0 with ≥ 90% coverage; `pnpm typecheck` exits 0. **Mechanism:** AnimatedValues uses `requestAnimationFrame` (via `useEffect`) to animate a numeric count-up from 0 (or previous value) to the `value` prop over a configurable `duration`. Uses a linear easing. Renders the current animated value as a formatted string. **Authz & preconditions:** requires CYCLE-1 fully merged; Wave 7.

---

#### 👤 User Reference

**Description**:
AnimatedValues animates a numeric value from 0 (or its previous value) to a target `value` over a configurable `duration`. Used in quote summary panels to draw user attention to the computed premium as it "counts up" to the final amount. The animation uses `requestAnimationFrame` for smooth 60fps updates. A `formatter` function prop controls how the number is displayed (e.g., currency, percentage).

**Acceptance Criteria** (plain-English):
- On mount, animates from 0 to `value` over `duration` ms (default 600ms)
- When `value` prop changes, re-animates from the current displayed value to the new target
- `formatter` prop (default: `(n) => n.toFixed(2)`) controls display format
- Renders the animated value in a `<span>`
- `aria-live="polite"` on the container so screen readers announce the final value
- `className` prop merges with base class
- `pnpm test` exits 0; ≥ 90% coverage

**User Journey** (no role variation — single actor: DEV):
- ```tsx
  <AnimatedValues
    value={245.00}
    duration={800}
    formatter={(n) => `$${n.toFixed(2)}`}
    aria-label="Monthly premium"
  />
  ```
- On mount: counts from "$0.00" → "$245.00" over 800ms.

**Flow Diagram**:

```mermaid
flowchart TD
  A[value, duration, formatter] --> B[useEffect: RAF animation loop]
  B --> C[displayValue state updates each frame]
  C --> D[span aria-live=polite: formatter(displayValue)]
  E[value prop change] --> B
```

---

#### 🤖 AI Agent Reference

**Must Read**:
- `docs/architecture/design/01-patterns-and-standards-greenfield.md` — animation pattern, requestAnimationFrame, hooks
- `docs/ui-ux/ui-ux-spec.md` — AnimatedValues visual spec

**Design Tokens**:
- No specific tokens — AnimatedValues renders text only; typography controlled by parent or className

**Description**:
`AnimatedValuesProps`: `value: number`, `duration?: number` (default `600`), `formatter?: (n: number) => string` (default `(n) => n.toFixed(2)`), `'aria-label'?: string`, plus `BaseProps`. Internal state: `displayValue: number` (starts at 0). `useEffect` on `[value]` starts a `requestAnimationFrame` loop. Each frame: `progress = (elapsed / duration)`, clamped to 1; `displayValue = startValue + (value - startValue) * progress`. When `progress >= 1`, cancels RAF. Cleanup cancels RAF on unmount. Tests use `vi.useFakeTimers()` and `vi.runAllTimers()` to test the final displayed value without waiting for real time.

**Acceptance Criteria** (comprehensive):
- `AnimatedValuesProps`: `value, duration=600, formatter=(n)=>n.toFixed(2), 'aria-label'?` + `BaseProps`
- Renders `<span aria-live="polite" aria-label={aria-label}>`
- On mount: animates 0 → value over duration
- `value` change: animates current → new value
- `formatter` applied to `displayValue` each render
- RAF cancelled on unmount (no memory leak)
- `className` merged on span

**RBAC Enforcement**: No role-differentiated access — single actor.

**System responses + error cases**:

| Trigger | Response | Side-effect |
|---------|----------|-------------|
| `value=0` | Animates 0→0 (instant) | none |
| `duration=0` | Immediately shows final value | none |
| Component unmounts mid-animation | RAF cancelled | No setState after unmount |
| `value` changes before animation ends | Restarts animation from current display value | none |

**QA-observable behaviour**:
- With `vi.useFakeTimers()` and `vi.runAllTimers()`: final value is `formatter(value)` in the DOM.
- `aria-live="polite"` on the span.
- `aria-label` forwarded when provided.

**Prerequisites**:
- Stories 3.1–3.5 merged

**Steps**:

1. **Create `src/components/AnimatedValues/AnimatedValues.types.ts`**:
   ```typescript
   import type { BaseProps } from '../../types/common.types';

   export interface AnimatedValuesProps extends BaseProps {
     value: number;
     duration?: number;
     formatter?: (n: number) => string;
     'aria-label'?: string;
   }
   ```

2. **Create `src/components/AnimatedValues/AnimatedValues.module.scss`**:
   ```scss
   .annexus-animated-values {
     display: inline;
   }
   ```

3. **Create `src/components/AnimatedValues/AnimatedValues.tsx`**:
   ```tsx
   import React, { useEffect, useRef, useState } from 'react';
   import { classNames } from '../../utils/classNames';
   import styles from './AnimatedValues.module.scss';
   import type { AnimatedValuesProps } from './AnimatedValues.types';

   const defaultFormatter = (n: number) => n.toFixed(2);

   export function AnimatedValues({
     value,
     duration = 600,
     formatter = defaultFormatter,
     'aria-label': ariaLabel,
     className,
     style,
     'data-testid': testId,
   }: AnimatedValuesProps) {
     const [displayValue, setDisplayValue] = useState(0);
     const rafRef = useRef<number | null>(null);
     const startRef = useRef<number | null>(null);
     const startValueRef = useRef(0);

     useEffect(() => {
       startValueRef.current = displayValue;
       startRef.current = null;

       if (rafRef.current !== null) {
         cancelAnimationFrame(rafRef.current);
       }

       if (duration === 0) {
         setDisplayValue(value);
         return;
       }

       const animate = (timestamp: number) => {
         if (startRef.current === null) {
           startRef.current = timestamp;
         }
         const elapsed = timestamp - startRef.current;
         const progress = Math.min(elapsed / duration, 1);
         const current = startValueRef.current + (value - startValueRef.current) * progress;
         setDisplayValue(current);

         if (progress < 1) {
           rafRef.current = requestAnimationFrame(animate);
         }
       };

       rafRef.current = requestAnimationFrame(animate);

       return () => {
         if (rafRef.current !== null) {
           cancelAnimationFrame(rafRef.current);
         }
       };
     }, [value, duration]);

     return (
       <span
         aria-live="polite"
         aria-label={ariaLabel}
         className={classNames(styles['annexus-animated-values'], className)}
         style={style}
         data-testid={testId}
       >
         {formatter(displayValue)}
       </span>
     );
   }
   ```

4. **Create `src/components/AnimatedValues/index.ts`**:
   ```typescript
   export { AnimatedValues } from './AnimatedValues';
   export type { AnimatedValuesProps } from './AnimatedValues.types';
   ```

5. **Create `src/components/AnimatedValues/AnimatedValues.stories.tsx`**:
   ```tsx
   import { useState } from 'react';
   import type { Meta } from '@storybook/react';
   import { AnimatedValues } from './AnimatedValues';

   const meta: Meta<typeof AnimatedValues> = {
     title: 'Components/AnimatedValues',
     component: AnimatedValues,
     tags: ['autodocs'],
   };
   export default meta;

   export const CurrencyCountUp = () => (
     <AnimatedValues
       value={245.0}
       duration={800}
       formatter={(n) => `$${n.toFixed(2)}`}
       aria-label="Monthly premium"
       style={{ fontSize: '2rem', fontWeight: 700, color: '#11175E' }}
     />
   );

   export const Interactive = () => {
     const [val, setVal] = useState(100);
     return (
       <div>
         <AnimatedValues value={val} formatter={(n) => `$${n.toFixed(2)}`} />
         <br />
         <button onClick={() => setVal(245)}>Set $245</button>
         <button onClick={() => setVal(180)}>Set $180</button>
       </div>
     );
   };
   ```

6. **Create `src/components/AnimatedValues/AnimatedValues.test.tsx`**:
   ```tsx
   import { render, screen, act } from '@testing-library/react';
   import { AnimatedValues } from './AnimatedValues';

   describe('AnimatedValues', () => {
     it('renders span with aria-live', () => {
       render(<AnimatedValues value={100} />);
       expect(screen.getByRole('status')).toBeInTheDocument();
     });
     it('renders formatted value immediately when duration=0', () => {
       render(<AnimatedValues value={245} duration={0} formatter={(n) => `$${n.toFixed(2)}`} />);
       expect(screen.getByText('$245.00')).toBeInTheDocument();
     });
     it('applies custom formatter', () => {
       render(<AnimatedValues value={50} duration={0} formatter={(n) => `${n.toFixed(0)}%`} />);
       expect(screen.getByText('50%')).toBeInTheDocument();
     });
     it('forwards aria-label', () => {
       render(<AnimatedValues value={100} duration={0} aria-label="Premium" />);
       expect(screen.getByLabelText('Premium')).toBeInTheDocument();
     });
     it('applies custom className', () => {
       render(<AnimatedValues value={0} duration={0} className="custom" />);
       expect(screen.getByRole('status').className).toContain('custom');
     });
     it('forwards data-testid', () => {
       render(<AnimatedValues value={0} duration={0} data-testid="av" />);
       expect(screen.getByTestId('av')).toBeInTheDocument();
     });
     it('renders zero value', () => {
       render(<AnimatedValues value={0} duration={0} formatter={(n) => `$${n.toFixed(2)}`} />);
       expect(screen.getByText('$0.00')).toBeInTheDocument();
     });
   });
   ```

7. **Update `src/index.ts`**:
   ```typescript
   export { AnimatedValues } from './components/AnimatedValues';
   export type { AnimatedValuesProps } from './components/AnimatedValues';
   ```

8. **Run verification**:
   ```bash
   pnpm typecheck
   pnpm test src/components/AnimatedValues
   ```

**Tests**: 7 unit tests; `pnpm typecheck` exits 0

**Quality**: ≥ 90% coverage; `pnpm typecheck` exits 0

**OUT**:
- ❌ No easing curves beyond linear (easing added via enhancement if required)
- ❌ No CSS transition alternative (RAF approach is required for cross-browser consistency)
- ❌ No prefers-reduced-motion respect at component level (consuming app adds CSS `@media (prefers-reduced-motion)` override)

**Evidence**:
- Terminal output of `pnpm test src/components/AnimatedValues` (7 tests pass)
- Terminal output of `pnpm typecheck` (exit 0)
