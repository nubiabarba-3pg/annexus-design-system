# Patterns & Standards - Annexus Design System

**Date**: 2026-10-12
**Author**: ARCHITECT
**Status**: Approved
**Version**: 1.0
**References**: `docs/requirements.md`, `docs/architecture/design/00-system-architecture-greenfield.md`

---

## 1. Project Structure

### Folder Layout

```
annexus-design-system/
├── src/
│   ├── tokens/                          # Design tokens — innermost layer
│   │   ├── _colors.scss
│   │   ├── _typography.scss
│   │   ├── _spacing.scss
│   │   ├── _radius.scss
│   │   ├── _shadows.scss
│   │   └── index.scss                   # Barrel: @forward all token files
│   ├── components/                      # One folder per component
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.types.ts
│   │       ├── Button.scss
│   │       ├── Button.stories.tsx
│   │       ├── Button.test.tsx
│   │       └── index.ts
│   ├── hooks/                           # Shared hooks (no component-specific logic)
│   │   └── useFocusTrap.ts
│   ├── utils/                           # Pure utility functions
│   │   └── classNames.ts
│   ├── types/                           # Shared TypeScript types (Size, Variant, etc.)
│   │   └── common.types.ts
│   └── index.ts                         # Public barrel — all exports
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── docs/                                # AIRE artifacts (never imported by src/)
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

### File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React component | PascalCase `.tsx` | `Button.tsx` |
| Component types | PascalCase `.types.ts` | `Button.types.ts` |
| Component styles | PascalCase `.scss` | `Button.scss` |
| Component stories | PascalCase `.stories.tsx` | `Button.stories.tsx` |
| Component tests | PascalCase `.test.tsx` | `Button.test.tsx` |
| Component barrel | lowercase | `index.ts` |
| Hooks | camelCase `use` prefix | `useFocusTrap.ts` |
| Utilities | camelCase | `classNames.ts` |
| SCSS partials | `_` prefix | `_colors.scss` |
| Config files | kebab-case | `vite.config.ts` |

### Import Ordering

Enforce via ESLint `import/order`. Order:

```typescript
// 1. React
import React, { useState, useRef } from 'react';

// 2. External libraries (alphabetical)
import clsx from 'clsx';

// 3. Internal tokens
import '@annexus/ui/style.css'; // consumer side — not used inside library

// 4. Internal shared types / utils / hooks
import type { Size } from '../../types/common.types';
import { classNames } from '../../utils/classNames';

// 5. Internal components (sibling imports)
import { Icon } from '../Icon';

// 6. Local styles (always last)
import './Button.scss';
```

---

## 2. UI Primitive Catalogue

### Definition of a Primitive

A component is a **primitive** if it meets **both** criteria:
1. Contains **no business logic** (no annuity calculations, no financial rules, no API calls)
2. Is **reusable across two or more contexts** within the design system

**Rule**: If a component meets the primitive definition, it **must** be created in `src/components/` — creating it inside a feature folder of a consuming app is a violation. Every primitive lives in `@annexus/ui`.

### Complete Primitive Catalogue (27 components)

All 27 components in this design system are primitives by definition — they are the entire catalogue.

| Priority | Component | Location | Description |
|----------|-----------|----------|-------------|
| P0 | `Button` | `src/components/Button/` | 7 hierarchies × sizes × states |
| P0 | `Input` | `src/components/Input/` | Text input — 4 types, Default/Selected/Error |
| P0 | `Toggle` | `src/components/Toggle/` | Boolean switch — Pressed × State |
| P0 | `Slider` | `src/components/Slider/` | Range slider + ControlHandle + NumberStrip |
| P0 | `Dropdown` | `src/components/Dropdown/` | Header navigation dropdown |
| P0 | `Modal` | `src/components/Modal/` | Dialog — Input, Add Benefits states |
| P0 | `Tooltip` | `src/components/Tooltip/` | Contextual overlay |
| P0 | `Badge` | `src/components/Badge/` | Status indicator |
| P0 | `Icon` | `src/components/Icon/` | check-circle, chevron-down, winLose |
| P0 | `Logo` | `src/components/Logo/` | Athene logo |
| P1 | `Footer` | `src/components/Footer/` | Page footer |
| P1 | `HeaderSection` | `src/components/HeaderSection/` | Page header section |
| P1 | `Legend` | `src/components/Legend/` | Chart legend — Default, Monthly Income Only |
| P1 | `AddonRow` | `src/components/AddonRow/` | Bundle/Pharmacy × Default/Added |
| P1 | `HelpIcon` | `src/components/HelpIcon/` | Contextual help — Default/Hover |
| P1 | `GroupItem` | `src/components/GroupItem/` | Navigation group item — Default/Hover/Active |
| P1 | `FrequencySelector` | `src/components/FrequencySelector/` | Monthly/Annually toggle |
| P1 | `AgeTag` | `src/components/AgeTag/` | Age label — Target/Default |
| P1 | `ButtonGroup` | `src/components/ButtonGroup/` | Grouped buttons — Default/Hover/Active |
| P1 | `Row` | `src/components/Row/` | Add-on row — Line 2/3 × Default/Added |
| P1 | `AdjustInflationRate` | `src/components/AdjustInflationRate/` | Inflation rate control — Default/Active |
| P2 | `Chart` | `src/components/Chart/` | Bar chart — Target × Variant A/B |
| P2 | `GraphContainer` | `src/components/GraphContainer/` | Graph wrapper — 5%/6%/7% states |
| P2 | `TopSummary` | `src/components/TopSummary/` | Results summary — multiple modes |
| P2 | `BottomSummary` | `src/components/BottomSummary/` | Results summary — 5 states |
| P2 | `Premium` | `src/components/Premium/` | Premium display — Amount/Edit |
| P2 | `AnimatedValues` | `src/components/AnimatedValues/` | Animated income/projection display |

### What belongs in the consuming app (NOT in `@annexus/ui`)

- Page-level layouts composed from primitives
- Business logic wrappers (e.g. `CalculatorInputGroup` that knows about annuity rules)
- App-level routing, state management, API calls

---

## 3. Component Patterns

### 3.1 Component Declaration

**✅ DO: Function declaration with explicit return type**
```typescript
// Button.tsx
import React from 'react';
import type { ButtonProps } from './Button.types';
import './Button.scss';

export function Button({
  hierarchy = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  ...rest
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={`annexus-button annexus-button--${hierarchy} annexus-button--${size}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
```

**❌ DON'T: `React.FC`, inline prop type, or anonymous arrow export**
```typescript
// ❌ Avoid
const Button: React.FC<{ hierarchy: string }> = ({ hierarchy }) => <button />;
export default Button; // default exports complicate tree-shaking and re-exports
```

---

### 3.2 Props Interface

**✅ DO: Dedicated `.types.ts` file, `ComponentNameProps` naming, discriminated unions for variant types**
```typescript
// Button.types.ts
export type ButtonHierarchy =
  | 'primary'
  | 'secondary-color'
  | 'secondary-gray'
  | 'tertiary-color'
  | 'tertiary-gray'
  | 'link-color'
  | 'link-gray';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonState = 'default' | 'hover' | 'disabled' | 'focus';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hierarchy?: ButtonHierarchy;
  size?: ButtonSize;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
  /** Full-width block button */
  block?: boolean;
}
```

**❌ DON'T: Inline types, `IButtonProps` prefix, `any`**
```typescript
// ❌ Avoid
interface IButtonProps { type: any; size: string; } // `any` + I-prefix + loose string
```

---

### 3.3 Variant Mapping (className strategy)

**✅ DO: Derive classNames from typed props using a utility**
```typescript
// utils/classNames.ts
export function classNames(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Button.tsx — using classNames util
const buttonClass = classNames(
  'annexus-button',
  `annexus-button--${hierarchy}`,
  `annexus-button--${size}`,
  disabled && 'annexus-button--disabled',
  block && 'annexus-button--block',
);
```

**❌ DON'T: String concatenation or ternary chains inline**
```typescript
// ❌ Avoid
className={`annexus-button ${hierarchy === 'primary' ? 'annexus-button--primary' : hierarchy === 'secondary-color' ? 'annexus-button--secondary-color' : ''}`}
```

---

### 3.4 Ref Forwarding (for all interactive elements)

**✅ DO: forwardRef on all components that render a native element**
```typescript
// Input.tsx
import React from 'react';
import type { InputProps } from './Input.types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ state = 'default', label, errorMessage, ...rest }, ref) {
    return (
      <div className={`annexus-input annexus-input--${state}`}>
        <input ref={ref} aria-invalid={state === 'error'} {...rest} />
        {state === 'error' && errorMessage && (
          <span className="annexus-input__error" role="alert">{errorMessage}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
```

**❌ DON'T: Omit ref forwarding on interactive components**
```typescript
// ❌ Consuming app cannot focus this input programmatically
export function Input(props: InputProps) {
  return <input {...props} />;
}
```

---

### 3.5 Controlled vs Uncontrolled

**Rule**: Components are **uncontrolled by default**; accept `value`/`onChange` for controlled mode. Never hold state that should belong to the consumer.

**✅ DO: Accept both modes**
```typescript
// Toggle.tsx
export function Toggle({
  pressed,           // controlled: consumer owns state
  defaultPressed,    // uncontrolled: internal state
  onPressedChange,
  disabled = false,
}: ToggleProps): React.ReactElement {
  const [internalPressed, setInternalPressed] = React.useState(defaultPressed ?? false);
  const isControlled = pressed !== undefined;
  const isPressed = isControlled ? pressed : internalPressed;

  const handleClick = () => {
    if (disabled) return;
    const next = !isPressed;
    if (!isControlled) setInternalPressed(next);
    onPressedChange?.(next);
  };

  return (
    <button
      role="switch"
      aria-checked={isPressed}
      aria-disabled={disabled}
      onClick={handleClick}
      className={classNames('annexus-toggle', isPressed && 'annexus-toggle--pressed')}
    />
  );
}
```

---

### 3.6 No Business Logic in Components

**✅ DO: Accept computed values as props**
```typescript
// BottomSummary.tsx — receives already-computed values
export function BottomSummary({
  initialIncome,
  projectedIncome,
  premium,
  state,
}: BottomSummaryProps): React.ReactElement { /* renders only */ }
```

**❌ DON'T: Perform calculations inside components**
```typescript
// ❌ Annuity math does NOT belong in the design system
export function BottomSummary({ premium, inflationRate, years }: ...) {
  const projectedIncome = premium * Math.pow(1 + inflationRate, years); // ❌
}
```

---

## 4. SASS/SCSS Patterns

### 4.1 Token Consumption

**✅ DO: `@use` tokens, never hardcode values**
```scss
// Button.scss
@use '../../tokens/colors' as *;
@use '../../tokens/spacing' as *;
@use '../../tokens/typography' as *;

.annexus-button {
  padding: $spacing-2 $spacing-4;
  font-size: $font-size-body-md;
  border-radius: $radius-md;
  background-color: var(--annexus-color-primary-500);

  &--primary {
    background-color: var(--annexus-color-primary-500);
    color: var(--annexus-color-white);

    &:hover { background-color: var(--annexus-color-primary-600); }
    &:focus-visible {
      outline: 2px solid var(--annexus-color-primary-500);
      outline-offset: 2px; // WCAG 2.2 AA: 2.4.11 Focus Appearance
    }
    &:disabled { opacity: 0.4; pointer-events: none; }
  }
}
```

**❌ DON'T: Hardcode hex values, px values, or use `@import`**
```scss
// ❌ Avoid
.annexus-button { background-color: #0057ff; font-size: 14px; } // hardcoded
@import '../../tokens/colors'; // @import is deprecated — use @use
```

### 4.2 BEM Naming Convention

```
.annexus-{component}                       Block
.annexus-{component}__{element}            Element
.annexus-{component}--{modifier}           Modifier
```

```scss
// ✅ Correct BEM
.annexus-input { }                         // Block
.annexus-input__label { }                  // Element
.annexus-input__field { }                  // Element
.annexus-input__error { }                  // Element
.annexus-input--error { }                  // Modifier
.annexus-input--selected { }               // Modifier
```

### 4.3 WCAG 2.2 AA Focus Pattern (mandatory on all interactive components)

```scss
// _focus.scss — shared mixin
@mixin focus-visible-ring($color: var(--annexus-color-primary-500)) {
  &:focus-visible {
    outline: 2px solid $color;           // WCAG 2.4.11: ≥2px
    outline-offset: 2px;
    // Ensure 3:1 contrast ratio against adjacent background
  }
  &:focus:not(:focus-visible) {
    outline: none;                       // Remove for mouse users
  }
}

// Usage in component SCSS
.annexus-button { @include focus-visible-ring(); }
.annexus-toggle { @include focus-visible-ring(); }
.annexus-input__field { @include focus-visible-ring(); }
```

### 4.4 Target Size (WCAG 2.5.8 — minimum 24×24px)

```scss
// _sizing.scss — shared mixin
@mixin min-touch-target {
  min-width: $target-size-min;   // $target-size-min: 24px
  min-height: $target-size-min;
}

// Applied to all interactive components
.annexus-button { @include min-touch-target(); }
.annexus-toggle { @include min-touch-target(); }
.annexus-age-tag { @include min-touch-target(); }
```

---

## 5. Storybook Patterns

### 5.1 Story File Structure (CSF3)

**✅ DO: One `Meta` default export, named exports for each story**
```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],                    // enables auto-generated Docs page
  argTypes: {
    hierarchy: {
      control: 'select',
      options: ['primary', 'secondary-color', 'secondary-gray',
                'tertiary-color', 'tertiary-gray', 'link-color', 'link-gray'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// One named export per variant/state — these become the visual regression baselines
export const Primary: Story = {
  args: { hierarchy: 'primary', children: 'Get Started' },
};

export const PrimaryDisabled: Story = {
  args: { hierarchy: 'primary', disabled: true, children: 'Get Started' },
};

export const SecondaryColor: Story = {
  args: { hierarchy: 'secondary-color', children: 'Learn More' },
};

export const LinkColor: Story = {
  args: { hierarchy: 'link-color', children: 'View Details' },
};
```

**❌ DON'T: Template cloning, inline JSX in stories, missing `tags: ['autodocs']`**
```typescript
// ❌ CSF2 template pattern — do not use
const Template = (args) => <Button {...args} />;
export const Primary = Template.bind({});
Primary.args = { hierarchy: 'primary' };
```

### 5.2 Story Naming Convention

| Pattern | Example |
|---------|---------|
| Default state | `Default` |
| Variant | `Primary`, `SecondaryColor`, `LinkGray` |
| State | `Disabled`, `Hover`, `Focus` |
| Variant + State | `PrimaryDisabled`, `SecondaryColorHover` |
| Contextual | `WithIcon`, `FullWidth`, `InForm` |

### 5.3 Storybook Accessibility Addon

All stories automatically run axe-core via `@storybook/addon-a11y`. No extra configuration per story needed — failures appear in the Accessibility panel.

---

## 6. Testing Patterns

### 6.1 Unit Test Structure (AAA)

**✅ DO: Arrange-Act-Assert, describe/it naming, user-centric queries**
```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  it('renders with the correct text', () => {
    // Arrange
    render(<Button hierarchy="primary">Submit</Button>);

    // Act + Assert
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    // Act
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    // Assert
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Submit</Button>);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Submit</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**❌ DON'T: Query by class/id, snapshot tests for structure, test implementation details**
```typescript
// ❌ Avoid
const { container } = render(<Button />);
expect(container.querySelector('.annexus-button--primary')).toBeTruthy(); // class query
expect(container).toMatchSnapshot(); // snapshot = fragile, replaced by Chromatic
```

### 6.2 What to Test per Component

| Category | Test | Required |
|----------|------|----------|
| Rendering | Default render, each meaningful prop combination | Yes |
| Interaction | Click, keyboard (Enter/Space/Arrow), focus/blur | Yes (interactive only) |
| Accessibility | `axe(container)` passes | Yes — every component |
| Controlled mode | Value + onChange round-trip | Yes (controlled components) |
| Disabled state | No events fired, aria-disabled set | Yes (interactive only) |
| Error state | Error message rendered, aria-invalid set | Yes (Input) |
| Ref forwarding | ref.current points to DOM element | Yes (interactive elements) |
| Visual output | NOT tested here — covered by Chromatic | No |

### 6.3 Coverage Requirements

- **Minimum**: ≥ 90% lines, branches, functions, statements per component
- **Enforced**: Vitest coverage threshold in `vitest.config.ts` — CI fails below threshold
- **Excluded from coverage**: `*.stories.tsx`, `*.types.ts`, `index.ts` barrel files

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: { lines: 90, branches: 90, functions: 90, statements: 90 },
      exclude: ['**/*.stories.tsx', '**/*.types.ts', '**/index.ts', 'src/index.ts'],
    },
  },
});
```

### 6.4 Mocking Strategy

Components are pure render functions — minimal mocking needed.

| Scenario | Strategy |
|----------|----------|
| External libraries (e.g. animation) | `vi.mock('framer-motion')` at file level |
| Browser APIs (e.g. `ResizeObserver`) | `vi.stubGlobal` in `vitest.setup.ts` |
| Timers (e.g. Tooltip delay) | `vi.useFakeTimers()` + `vi.runAllTimers()` |
| No database, no API mocks | N/A — library has no data layer |

---

## 7. Library Public API Pattern

### 7.1 Barrel Export Rules

**✅ DO: Named exports only — one line per component in `src/index.ts`**
```typescript
// src/index.ts
export { Button } from './components/Button';
export type { ButtonProps, ButtonHierarchy, ButtonSize } from './components/Button';

export { Input } from './components/Input';
export type { InputProps, InputState } from './components/Input';

export { Toggle } from './components/Toggle';
export type { ToggleProps } from './components/Toggle';
// ... 24 more
```

**❌ DON'T: Default exports, star-exports, or re-exporting internal utilities**
```typescript
// ❌ Avoid
export * from './components/Button';   // exposes internals
export default Button;                 // breaks named import convention
export { classNames } from './utils';  // internal utility — not part of public API
```

### 7.2 Component Index Barrel

```typescript
// src/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps, ButtonHierarchy, ButtonSize } from './Button.types';
```

### 7.3 Versioning & Breaking Change Policy

| Change type | Version bump |
|-------------|-------------|
| New component added | Minor (`1.1.0`) |
| New optional prop added | Minor (`1.1.0`) |
| Bug fix, style fix | Patch (`1.0.1`) |
| Required prop added, prop renamed, component removed | Major (`2.0.0`) |

---

## 8. Error Handling Pattern

No runtime exceptions for consumers. Errors are caught at **compile time** (TypeScript strict) or surfaced as **development warnings**.

**✅ DO: Validate in development only, fail silently in production**
```typescript
// utils/devWarning.ts
export function devWarning(condition: boolean, message: string): void {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    console.warn(`[Annexus UI] ${message}`);
  }
}

// Slider.tsx — warn when value is out of range
export function Slider({ min = 0, max = 100, value, ...rest }: SliderProps) {
  devWarning(
    value === undefined || (value >= min && value <= max),
    `Slider: value (${value}) is outside the range [${min}, ${max}].`,
  );
  // ...
}
```

**❌ DON'T: Throw errors for prop violations — it breaks the consumer's app**
```typescript
// ❌ Avoid
if (value < min) throw new Error('value out of range'); // crashes the consuming app
```

---

## 9. Configuration Pattern

### 9.1 No Runtime Configuration

The library has no runtime config — all configuration is **build-time**.

| Config concern | Location |
|---------------|----------|
| Build output | `vite.config.ts` |
| TypeScript strict rules | `tsconfig.json` |
| Test thresholds | `vitest.config.ts` |
| Storybook addons | `.storybook/main.ts` |
| ESLint rules | `eslint.config.js` |
| npm registry | `.npmrc` |
| CI/CD | `.github/workflows/` |

### 9.2 `.npmrc` for GitHub Packages

```ini
# .npmrc (committed — no secrets)
@annexus:registry=https://npm.pkg.github.com
```

`NODE_AUTH_TOKEN` is set only in CI secrets and in consumer app environments — never committed.

---

## 10. Documentation Standards

### 10.1 TSDoc on Public Props

```typescript
export interface SliderProps {
  /** Current value. When provided, component is controlled. */
  value?: number;
  /** Minimum selectable value. @defaultValue 0 */
  min?: number;
  /** Maximum selectable value. @defaultValue 100 */
  max?: number;
  /**
   * Callback fired when value changes.
   * Provides the new value as the only argument.
   */
  onChange?: (value: number) => void;
}
```

**Rule**: Document every public prop with a TSDoc comment. Storybook auto-generates the Docs table from these comments.

### 10.2 No Code Comments for Obvious Code

```typescript
// ❌ Obvious — don't add
// Returns the button class name
const buttonClass = classNames('annexus-button', `annexus-button--${hierarchy}`);

// ✅ Document non-obvious reasoning only
// WCAG 2.5.7: pointer-down is intentional — native drag must start on pointerdown, not click
slider.addEventListener('pointerdown', startDrag);
```

### 10.3 Story Docs (via `tags: ['autodocs']`)

Storybook auto-generates a Docs page per component from:
- TSDoc on props → prop table
- Story `args` → live preview defaults
- Story names → variant index

No separate README per component — Storybook IS the documentation.

---

## 11. File / Module Boundary Map

This map is the authoritative input for story `files_touched` and `shared_files` in the dependency graph.

### Concern → Owning Files

| Concern | Owning Globs | Notes |
|---------|-------------|-------|
| Design tokens | `src/tokens/**` | Changed only by ARCHITECT or when Figma tokens update |
| Button component | `src/components/Button/**` | Self-contained; no cross-component imports |
| Input component | `src/components/Input/**` | Self-contained |
| Toggle component | `src/components/Toggle/**` | Self-contained |
| Slider component | `src/components/Slider/**` | Imports `ControlHandle`, `NumberStrip` as sub-components |
| Modal component | `src/components/Modal/**` | Imports `Button`, `Icon` |
| Tooltip component | `src/components/Tooltip/**` | Self-contained |
| Badge component | `src/components/Badge/**` | Self-contained |
| Icon component | `src/components/Icon/**` | Imported by Button, Modal, HelpIcon, AddonRow |
| [All P1/P2 components] | `src/components/{Name}/**` | Each self-contained unless noted |
| Shared hooks | `src/hooks/**` | Used by Modal (focus trap), Slider (drag) |
| Shared utilities | `src/utils/**` | `classNames` used by all components |
| Shared types | `src/types/**` | `Size`, `State` enums used by multiple components |
| Storybook config | `.storybook/**` | Shared — changes affect all stories |
| Build config | `vite.config.ts` | Shared — changes affect the entire build |
| Test config | `vitest.config.ts` | Shared — changes affect all tests |

### Shared Files (touched by multiple work streams)

These files are modified by more than one component story — coordinate to avoid merge conflicts:

| File | Touched by | Reason |
|------|-----------|--------|
| `src/index.ts` | Every component story | Each new component adds its export line |
| `src/tokens/index.scss` | Any story that introduces a new token | Token barrel |
| `src/types/common.types.ts` | Any story that needs a shared type | Shared type definitions |
| `package.json` | Infra/devops stories only | Dependency additions |
| `.storybook/main.ts` | Infra/devops stories only | Addon additions |

### Cross-Concern Rule

Components may import from:
- `src/tokens/` (all components)
- `src/utils/` (all components)
- `src/types/` (all components)
- `src/hooks/` (only when a hook is genuinely shared — not component-specific)
- Other components in `src/components/` **only when composing** (e.g. Modal uses Button; avoid circular imports)

Components must **never** import from:
- `.storybook/`
- `docs/`
- `vite.config.ts`
- Test utilities (only in `.test.tsx` files)

---

## 12. Quality Checklist

Before any component is considered complete:

```
Component Implementation
  [ ] Function declaration (not React.FC or arrow)
  [ ] Props interface in dedicated .types.ts file
  [ ] No `any` types
  [ ] ref forwarding (forwardRef) on interactive elements
  [ ] displayName set (for forwardRef components)
  [ ] No hardcoded values — all from tokens
  [ ] BEM class naming (annexus-{component}[__{element}][--{modifier}])
  [ ] devWarning() for invalid prop combinations (dev only)

Accessibility (WCAG 2.2 AA)
  [ ] :focus-visible outline ≥ 2px, 3:1 contrast
  [ ] min-width/height ≥ 24px on interactive targets
  [ ] Keyboard navigation (Tab, Enter/Space, Arrow keys as appropriate)
  [ ] ARIA roles, labels, aria-checked/aria-invalid/aria-disabled
  [ ] Slider: click-on-track + arrow key (WCAG 2.5.7 dragging alternative)
  [ ] axe() passes in unit test

Storybook
  [ ] Story file uses CSF3 (Meta + StoryObj<typeof Component>)
  [ ] tags: ['autodocs'] on meta
  [ ] One named story per variant/state
  [ ] All stories render without console errors

Tests
  [ ] test file covers: render, interaction, a11y, controlled mode, disabled
  [ ] Coverage ≥ 90% (lines, branches, functions, statements)
  [ ] No snapshot tests

Figma
  [ ] Page created in AnnexusEX file
  [ ] Left frame: 'ComponentName Description' with description, variants, usage notes
  [ ] Right frame: 'ComponentName' with all variants using Figma variables/tokens

Package export
  [ ] Component exported from src/components/{Name}/index.ts
  [ ] Component + types added to src/index.ts
```

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Stakeholder | Nubia Barba | 2026-10-12 | Approved |
| Architect | AIRE_ARCHITECT | 2026-10-12 | Approved |
