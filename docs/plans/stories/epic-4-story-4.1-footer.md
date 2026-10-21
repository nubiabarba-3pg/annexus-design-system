### Story 4.1: Footer Component

**File**: `docs/plans/stories/epic-4-story-4.1-footer.md`

**BUILDID**: CYCLE-3 | **AzureDevOps**: #23686 | **Epic**: 4 - P1 COMPOSITION | **ID**: 4.1 | **Date**: 2026-10-13
**Wave**: 6
**Requires**: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4]
**Enables**: []
**Files Touched**:
  - src/components/Footer/Footer.tsx
  - src/components/Footer/Footer.types.ts
  - src/components/Footer/Footer.module.scss
  - src/components/Footer/Footer.stories.tsx
  - src/components/Footer/Footer.test.tsx
  - src/components/Footer/index.ts
  - src/index.ts
**Roles Ref**: docs/requirements.md#roles--permissions-matrix — single-actor — no role variation
**QA Candidate**: Yes — **Observable:** `pnpm storybook` shows a Footer story with left-aligned branding text and right-aligned links; `pnpm test src/components/Footer` exits 0 with ≥ 90% coverage; `pnpm typecheck` exits 0; footer renders at bottom of its container with correct token-based spacing and typography. **Mechanism:** Footer is a purely presentational composition — no state, no hooks — rendering a `<footer>` with flex layout: brand slot on the left, nav links slot on the right. All spacing and typography via `--annexus-*` custom properties. **Authz & preconditions:** requires CYCLE-1 fully merged (shared utils, tokens, test setup). **Regression:** used as page footer in the full-page layout stories.

> **Styling (CR-001, 2026-10-20)**: wherever this story says `var(--annexus-*)`, `src/tokens/` or a hex value, implement it as a **design variable** instead. Add `$<section><Element><State><Property>` (camelCase, section-prefixed, never repeated) to `src/styles/design.variables.scss`, pointing to a color in `src/styles/pallete.color.scss`, and `@use '../../styles/design.variables' as *;` in the component SCSS. Component SCSS never uses hex values or palette variables. Every new design variable is also added to `src/styles/design.variables.module.scss` so it is exported to JS (`designVariables`). Fonts use `$fontFamilyBase` and section-named size/line-height/weight variables. Reference implementation: `src/components/Input/Input.scss`. Spec: Story 3.2.

---

#### 👤 User Reference

**Description**:
The Footer component renders a page footer with a left-aligned brand/copyright slot and a right-aligned navigation links slot. It is a pure presentational component — no state, no event handlers beyond those passed via props. Styling uses design tokens for spacing, typography, and color. Children are passed via `leftContent` and `rightContent` props (render slots), giving consumers full control over what appears in each zone.

**Acceptance Criteria** (plain-English):
- Footer renders a `<footer>` element with `role="contentinfo"`
- Left and right content slots accept `React.ReactNode`
- Flex layout: left slot left-aligned, right slot right-aligned
- Background, text color, padding from design tokens
- `className` prop merges with base class
- `pnpm test` exits 0; ≥ 90% coverage
- `pnpm typecheck` exits 0

**User Journey** (no role variation — single actor: DEV):
- Import: `import { Footer } from '@annexus/ui'`
- Render: `<Footer leftContent={<span>© 2026 Annexus</span>} rightContent={<nav>...</nav>} />`
- Styling: import `@annexus/ui/style.css` — tokens resolve.

**Flow Diagram**:

```mermaid
flowchart TD
  A[Footer props: leftContent, rightContent, className] --> B[footer element role=contentinfo]
  B --> C[flex row: left slot | right slot]
  C --> D[design tokens: spacing-4, font-size-sm, color-gray-600]
```

---

#### 🤖 AI Agent Reference

**Must Read**:
- `docs/architecture/design/01-patterns-and-standards-greenfield.md` — BEM naming, SCSS module pattern, forwardRef pattern
- `docs/ui-ux/ui-ux-spec.md` — Footer visual spec

**Design Tokens**:
- `--annexus-spacing-4` (16px) — vertical padding
- `--annexus-spacing-6` (24px) — horizontal padding
- `--annexus-font-size-sm` — footer text size
- `--annexus-color-gray-100` — footer background
- `--annexus-color-gray-600` — footer text color

**Description**:
`Footer.tsx` renders `<footer role="contentinfo">` with a single inner div using flex `justify-content: space-between`. Props: `leftContent?: React.ReactNode`, `rightContent?: React.ReactNode`, `className?: string`, `style?: CSSProperties`, `data-testid?: string` (extends `BaseProps`). No forwardRef needed — this is a simple wrapper. SCSS module: `.annexus-footer` (root), `.annexus-footer__content` (inner flex row), `.annexus-footer__left`, `.annexus-footer__right`.

**Acceptance Criteria** (comprehensive):
- `FooterProps` extends `BaseProps` + `leftContent?: React.ReactNode` + `rightContent?: React.ReactNode`
- Renders `<footer role="contentinfo" data-testid={data-testid}>` with CSS module class `annexus-footer`
- Inner div `.annexus-footer__content` — `display: flex; justify-content: space-between; align-items: center`
- Left child div `.annexus-footer__left`; right child div `.annexus-footer__right`
- `className` merged via `classNames('annexus-footer', className)`
- `pnpm typecheck` exits 0
- Unit tests: renders with left content, renders with right content, renders with both, renders without content (empty), applies custom className, renders data-testid

**RBAC Enforcement**: No role-differentiated access — single actor.

**System responses + error cases**:

| Trigger | Response | Side-effect |
|---------|----------|-------------|
| `leftContent` omitted | Left div renders empty | none |
| `rightContent` omitted | Right div renders empty | none |
| `className` provided | Merged with base class | none |

**QA-observable behaviour**:
- `screen.getByRole('contentinfo')` — resolves to footer element.
- `screen.getByTestId('footer')` — resolves when `data-testid="footer"` passed.

**Prerequisites**:
- Stories 3.1–3.5 merged

**Steps**:

1. **Create `src/components/Footer/Footer.types.ts`**:
   ```typescript
   import type { BaseProps } from '../../types/common.types';

   export interface FooterProps extends BaseProps {
     leftContent?: React.ReactNode;
     rightContent?: React.ReactNode;
   }
   ```

2. **Create `src/components/Footer/Footer.module.scss`**:
   ```scss
   .annexus-footer {
     background-color: var(--annexus-color-gray-100);
     color: var(--annexus-color-gray-600);
     font-size: var(--annexus-font-size-sm);
     padding: var(--annexus-spacing-4) var(--annexus-spacing-6);

     &__content {
       display: flex;
       justify-content: space-between;
       align-items: center;
     }
   }
   ```

3. **Create `src/components/Footer/Footer.tsx`**:
   ```tsx
   import React from 'react';
   import { classNames } from '../../utils/classNames';
   import styles from './Footer.module.scss';
   import type { FooterProps } from './Footer.types';

   export function Footer({ leftContent, rightContent, className, style, 'data-testid': testId }: FooterProps) {
     return (
       <footer
         role="contentinfo"
         className={classNames(styles['annexus-footer'], className)}
         style={style}
         data-testid={testId}
       >
         <div className={styles['annexus-footer__content']}>
           <div className={styles['annexus-footer__left']}>{leftContent}</div>
           <div className={styles['annexus-footer__right']}>{rightContent}</div>
         </div>
       </footer>
     );
   }
   ```

4. **Create `src/components/Footer/index.ts`**:
   ```typescript
   export { Footer } from './Footer';
   export type { FooterProps } from './Footer.types';
   ```

5. **Create `src/components/Footer/Footer.stories.tsx`**:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { Footer } from './Footer';

   const meta: Meta<typeof Footer> = {
     title: 'Components/Footer',
     component: Footer,
     tags: ['autodocs'],
   };
   export default meta;

   type Story = StoryObj<typeof Footer>;

   export const Default: Story = {
     args: {
       leftContent: <span>© 2026 Annexus. All rights reserved.</span>,
       rightContent: (
         <nav>
           <a href="#">Privacy</a> · <a href="#">Terms</a>
         </nav>
       ),
     },
   };

   export const LeftOnly: Story = {
     args: { leftContent: <span>© 2026 Annexus</span> },
   };

   export const Empty: Story = { args: {} };
   ```

6. **Create `src/components/Footer/Footer.test.tsx`**:
   ```tsx
   import { render, screen } from '@testing-library/react';
   import { Footer } from './Footer';

   describe('Footer', () => {
     it('renders contentinfo landmark', () => {
       render(<Footer />);
       expect(screen.getByRole('contentinfo')).toBeInTheDocument();
     });
     it('renders left content', () => {
       render(<Footer leftContent={<span>Left</span>} />);
       expect(screen.getByText('Left')).toBeInTheDocument();
     });
     it('renders right content', () => {
       render(<Footer rightContent={<span>Right</span>} />);
       expect(screen.getByText('Right')).toBeInTheDocument();
     });
     it('renders both slots', () => {
       render(<Footer leftContent={<span>L</span>} rightContent={<span>R</span>} />);
       expect(screen.getByText('L')).toBeInTheDocument();
       expect(screen.getByText('R')).toBeInTheDocument();
     });
     it('applies custom className', () => {
       render(<Footer className="custom" />);
       expect(screen.getByRole('contentinfo').className).toContain('custom');
     });
     it('forwards data-testid', () => {
       render(<Footer data-testid="footer" />);
       expect(screen.getByTestId('footer')).toBeInTheDocument();
     });
   });
   ```

7. **Update `src/index.ts`** — add export:
   ```typescript
   export { Footer } from './components/Footer';
   export type { FooterProps } from './components/Footer';
   ```

8. **Run verification**:
   ```bash
   pnpm typecheck
   pnpm test src/components/Footer
   ```

**Tests**: 6 unit tests; `pnpm typecheck` exits 0; `pnpm test` exits 0

**Quality**: `pnpm typecheck` exits 0; ≥ 90% coverage

**OUT**:
- ❌ No sticky/fixed positioning (layout responsibility of the consuming app)
- ❌ No dark mode variant (no dark mode per architecture ADR)

**Evidence**:
- Terminal output of `pnpm test src/components/Footer` (6 tests pass)
- Terminal output of `pnpm typecheck` (exit 0)
