### Story 4.2: HeaderSection Component

**File**: `docs/plans/stories/epic-4-story-4.2-header-section.md`

**BUILDID**: CYCLE-3 | **AzureDevOps**: #23683 | **Epic**: 4 - P1 COMPOSITION | **ID**: 4.2 | **Date**: 2026-10-13
**Wave**: 6
**Requires**: [3.1, 3.2, 3.3, 3.4, 3.5]
**Enables**: []
**Files Touched**:
  - src/components/HeaderSection/HeaderSection.tsx
  - src/components/HeaderSection/HeaderSection.types.ts
  - src/components/HeaderSection/HeaderSection.module.scss
  - src/components/HeaderSection/HeaderSection.stories.tsx
  - src/components/HeaderSection/HeaderSection.test.tsx
  - src/components/HeaderSection/index.ts
  - src/index.ts
**Roles Ref**: docs/requirements.md#roles--permissions-matrix — single-actor — no role variation
**QA Candidate**: Yes — **Observable:** `pnpm storybook` shows a HeaderSection story with a page title, optional subtitle, and optional action slot; `pnpm test src/components/HeaderSection` exits 0 with ≥ 90% coverage; `pnpm typecheck` exits 0. **Mechanism:** HeaderSection is a presentational composition — renders `<header>` with a text block (title + optional subtitle) and an optional trailing action slot. No state or event handlers. **Authz & preconditions:** requires CYCLE-1 fully merged.

---

#### 👤 User Reference

**Description**:
HeaderSection renders a page section header: a required `title` string displayed as an `<h2>`, an optional `subtitle` string, and an optional `action` render slot (right-aligned) for buttons or controls. Used at the top of dashboard panels and form sections to provide consistent heading hierarchy and layout across the application.

**Acceptance Criteria** (plain-English):
- Renders `<header>` with the section title as `<h2>`
- Optional subtitle renders as `<p>` beneath the title
- Optional action slot renders right-aligned
- `className` prop merges with base class
- `pnpm test` exits 0; ≥ 90% coverage
- `pnpm typecheck` exits 0

**User Journey** (no role variation — single actor: DEV):
- `<HeaderSection title="Coverage Summary" subtitle="Q3 2026" action={<Button label="Export" />} />`
- Renders heading hierarchy correctly; action button aligned to trailing edge.

**Flow Diagram**:

```mermaid
flowchart TD
  A[title, subtitle?, action?] --> B[header element]
  B --> C[flex row: text block left | action right]
  C --> D[h2 title + optional p subtitle]
```

---

#### 🤖 AI Agent Reference

**Must Read**:
- `docs/architecture/design/01-patterns-and-standards-greenfield.md` — BEM, SCSS modules
- `docs/ui-ux/ui-ux-spec.md` — HeaderSection visual spec

**Design Tokens**:
- `--annexus-font-size-xl` — title font size
- `--annexus-font-weight-semibold` — title weight
- `--annexus-font-size-sm` — subtitle font size
- `--annexus-color-gray-600` — subtitle color
- `--annexus-spacing-4` — bottom margin
- `--annexus-color-neutral-black` — title color

**Description**:
`HeaderSection.tsx` renders `<header className="annexus-header-section">` with an inner flex row. Left cell: `.annexus-header-section__text` containing `<h2 className="annexus-header-section__title">{title}</h2>` and (if subtitle) `<p className="annexus-header-section__subtitle">{subtitle}</p>`. Right cell (if action): `.annexus-header-section__action`. Props: `title: string` (required), `subtitle?: string`, `action?: React.ReactNode`, plus `BaseProps`.

**Acceptance Criteria** (comprehensive):
- `HeaderSectionProps`: `title: string; subtitle?: string; action?: React.ReactNode` + `BaseProps`
- Renders `<header>` with class `annexus-header-section`
- `<h2>` with class `annexus-header-section__title` always renders with `title` text
- `<p>` with class `annexus-header-section__subtitle` only renders when `subtitle` provided
- Action div only renders when `action` provided
- `className` merged via `classNames`
- `pnpm typecheck` exits 0

**RBAC Enforcement**: No role-differentiated access — single actor.

**System responses + error cases**:

| Trigger | Response | Side-effect |
|---------|----------|-------------|
| `subtitle` omitted | No `<p>` element rendered | none |
| `action` omitted | No action div rendered | none |
| `title` empty string | `<h2>` renders but empty | Consumer responsibility |

**QA-observable behaviour**:
- `screen.getByRole('heading', { level: 2 })` — resolves to title h2.
- `screen.queryByText(subtitle)` — null when not provided.

**Prerequisites**:
- Stories 3.1–3.5 merged

**Steps**:

1. **Create `src/components/HeaderSection/HeaderSection.types.ts`**:
   ```typescript
   import type { BaseProps } from '../../types/common.types';

   export interface HeaderSectionProps extends BaseProps {
     title: string;
     subtitle?: string;
     action?: React.ReactNode;
   }
   ```

2. **Create `src/components/HeaderSection/HeaderSection.module.scss`**:
   ```scss
   .annexus-header-section {
     display: flex;
     justify-content: space-between;
     align-items: flex-start;
     margin-bottom: var(--annexus-spacing-4);

     &__text {
       display: flex;
       flex-direction: column;
       gap: var(--annexus-spacing-1);
     }

     &__title {
       margin: 0;
       font-size: var(--annexus-font-size-xl);
       font-weight: var(--annexus-font-weight-semibold);
       color: var(--annexus-color-neutral-black);
     }

     &__subtitle {
       margin: 0;
       font-size: var(--annexus-font-size-sm);
       color: var(--annexus-color-gray-600);
     }

     &__action {
       flex-shrink: 0;
     }
   }
   ```

3. **Create `src/components/HeaderSection/HeaderSection.tsx`**:
   ```tsx
   import React from 'react';
   import { classNames } from '../../utils/classNames';
   import styles from './HeaderSection.module.scss';
   import type { HeaderSectionProps } from './HeaderSection.types';

   export function HeaderSection({ title, subtitle, action, className, style, 'data-testid': testId }: HeaderSectionProps) {
     return (
       <header
         className={classNames(styles['annexus-header-section'], className)}
         style={style}
         data-testid={testId}
       >
         <div className={styles['annexus-header-section__text']}>
           <h2 className={styles['annexus-header-section__title']}>{title}</h2>
           {subtitle && <p className={styles['annexus-header-section__subtitle']}>{subtitle}</p>}
         </div>
         {action && <div className={styles['annexus-header-section__action']}>{action}</div>}
       </header>
     );
   }
   ```

4. **Create `src/components/HeaderSection/index.ts`**:
   ```typescript
   export { HeaderSection } from './HeaderSection';
   export type { HeaderSectionProps } from './HeaderSection.types';
   ```

5. **Create `src/components/HeaderSection/HeaderSection.stories.tsx`**:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { HeaderSection } from './HeaderSection';

   const meta: Meta<typeof HeaderSection> = {
     title: 'Components/HeaderSection',
     component: HeaderSection,
     tags: ['autodocs'],
   };
   export default meta;

   type Story = StoryObj<typeof HeaderSection>;

   export const Default: Story = {
     args: { title: 'Coverage Summary' },
   };

   export const WithSubtitle: Story = {
     args: { title: 'Coverage Summary', subtitle: 'Q3 2026' },
   };

   export const WithAction: Story = {
     args: {
       title: 'Coverage Summary',
       subtitle: 'Q3 2026',
       action: <button type="button">Export</button>,
     },
   };
   ```

6. **Create `src/components/HeaderSection/HeaderSection.test.tsx`**:
   ```tsx
   import { render, screen } from '@testing-library/react';
   import { HeaderSection } from './HeaderSection';

   describe('HeaderSection', () => {
     it('renders title as h2', () => {
       render(<HeaderSection title="My Title" />);
       expect(screen.getByRole('heading', { level: 2, name: 'My Title' })).toBeInTheDocument();
     });
     it('renders subtitle when provided', () => {
       render(<HeaderSection title="T" subtitle="Sub" />);
       expect(screen.getByText('Sub')).toBeInTheDocument();
     });
     it('does not render subtitle when omitted', () => {
       render(<HeaderSection title="T" />);
       expect(screen.queryByRole('paragraph')).toBeNull();
     });
     it('renders action slot', () => {
       render(<HeaderSection title="T" action={<button>Act</button>} />);
       expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument();
     });
     it('does not render action div when omitted', () => {
       const { container } = render(<HeaderSection title="T" />);
       expect(container.querySelector('.annexus-header-section__action')).toBeNull();
     });
     it('applies custom className', () => {
       const { container } = render(<HeaderSection title="T" className="custom" />);
       expect(container.firstChild).toHaveClass('custom');
     });
     it('forwards data-testid', () => {
       render(<HeaderSection title="T" data-testid="hs" />);
       expect(screen.getByTestId('hs')).toBeInTheDocument();
     });
   });
   ```

7. **Update `src/index.ts`**:
   ```typescript
   export { HeaderSection } from './components/HeaderSection';
   export type { HeaderSectionProps } from './components/HeaderSection';
   ```

8. **Run verification**:
   ```bash
   pnpm typecheck
   pnpm test src/components/HeaderSection
   ```

**Tests**: 7 unit tests; `pnpm typecheck` exits 0

**Quality**: ≥ 90% coverage; `pnpm typecheck` exits 0

**OUT**:
- ❌ No sticky header behavior
- ❌ No navigation links (HeaderSection is a section header, not the app header)

**Evidence**:
- Terminal output of `pnpm test src/components/HeaderSection` (7 tests pass)
- Terminal output of `pnpm typecheck` (exit 0)
