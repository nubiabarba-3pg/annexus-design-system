# Step 08 Checkpoint — Visual Foundation

**Date**: 2026-10-12
**Agent**: UI_UX_DESIGNER
**Status**: Approved at Step 08

---

## Component Hierarchy

### Atoms (primitive, standalone)
- Button (7 hierarchies × sizes × states)
- Input (4 types × 3 states)
- Toggle (pressed × 4 states)
- Badge (Type=Count/Status × Tone=Neutral/Info/Success/Warning/Danger)
- Icons (check-circle, chevron-down, winLose — custom SVGs)
- Athene Logo (SVG)
- Age Tag (Target / Default)
- Control Handle (Slider sub-element)
- Number Strip (Slider sub-element)

### Molecules (compose atoms)
- Slider (Control Handle + Number Strip + track)
- Tooltip (wraps icon + popover content)
- Button Group (composes Button)
- Frequency Selector (composes Toggle or Button Group)
- Help Icon (composes Icons + Tooltip)
- Add-on Row (composes Badge + Button atoms)
- Row / Add-on (composes Badge)

### Organisms (compose molecules + atoms)
- Dropdown / Header Navigation
- Modal (Input state + Add Benefits state)
- Legend (Default + Monthly Income Only)
- Group Item
- Header Section (composes Dropdown/Nav + Athene Logo)
- Footer (composes Button)
- Adjust Inflation Rate (composes Slider + Input)
- Graph Container (composes Chart/Bar)
- Chart / Bar (data-viz organism)
- Top Summary
- Bottom Summary
- Premium (composes Button + Input in Edit mode)
- Animated Values

---

## Grid System

| Breakpoint | Columns | Gutter | Margin | Max Width |
|------------|---------|--------|--------|-----------|
| xl (≥1280px) | 12 | 24px | auto | 1280px centered |
| lg (≥1024px) | 12 | 24px | 24px | fluid |
| md (≥768px) | 8 | 16px | 16px | fluid |
| sm (<640px) | 4 | 16px | 16px | full-bleed |

---

## Breakpoints

```scss
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

---

## Responsive Layout Strategy

### Navigation
- xl/lg: Fixed top bar (Dropdown / Header Navigation — 1280px wide)
- md: Fixed top bar, compressed
- sm: Collapsed — hamburger or stacked menu

### Layout per viewport
- xl: max-width 1280px centered, 12-col grid
- lg: fluid, 12-col grid
- md: fluid, 8-col grid
- sm: full-bleed, 4-col grid, single-column forms

### Component Responsive Rules
| Component | lg+ | sm |
|-----------|-----|----|
| Modal | centered overlay | full-screen sheet |
| Slider | full interactive (drag + keyboard) | full interactive (touch + keyboard) |
| Chart/Bar | full interactive | simplified readonly |
| Add-on Row | standard row | card stack |
| Footer | multi-column | single-column stacked |

### Touch Targets
- Desktop non-touch: 32px min (our components: 44px — already exceeds)
- Touch-enabled (md/sm): 44px min, comfortable 48px, spacing 8px
- WCAG 2.5.8: 24×24px absolute minimum on all interactive elements

### Typography Scale per Viewport
| Step | lg size | sm size |
|------|---------|---------|
| xs | 12px / lh 18px | 12px / lh 18px |
| sm | 14px / lh 20px | 14px / lh 20px |
| md | 16px / lh 24px | 16px / lh 24px |

(Assistant renders legibly at these sizes — no scale reduction needed for mobile)

---

## Elevation / Shadow System

| Level | Token | Value | Usage |
|-------|-------|-------|-------|
| 0 | none | no shadow | Flat elements |
| 1 | shadow-xs | 0 1px 2px rgba(10,13,18,0.05) | Input, Badge |
| 2 | shadow-xs-skeuomorphic | drop + inner shadows | Button default state |
| 3 | shadow-lg | 3-layer shadow | Modal, Dropdown |
