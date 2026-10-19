# Step 03 Checkpoint — Design Decisions

**Date**: 2026-10-12
**Agent**: UI_UX_DESIGNER
**Status**: Approved at Step 05

---

## Confirmed Decisions

| Question | Answer | Source |
|----------|--------|--------|
| Target emotion | Professional & Trustworthy (finance/healthcare) | Figma — Dark Blue #11175E brand primary |
| Responsive target | All viewports (Desktop + Tablet + Mobile) | User answer: C |
| Error display | Inline — below the field | Figma — Input/currentMonthlyNeed State=Error variant |
| Loading states | None — components display-only; consuming app owns loading | User answer: A (skeleton); no loading in Figma source |
| Data density | High — compact (44px controls, 8–14px padding) | Figma component dimensions |
| Colors | Extracted from Figma variables (see below) | Figma file DjPqMQEOe6khkoqIVQ8a9u |
| Typography | Assistant (Google Fonts) — xs/sm/md scale | Figma text styles |
| Accessibility | WCAG 2.2 AA | Architecture ADR (confirmed) |

## Extracted Color Tokens

| Figma Variable | Value | SCSS Token |
|----------------|-------|------------|
| Dark Blue / baseColor | #11175E | --annexus-color-brand-primary |
| Med Blue / Hover | #1B3E80 | --annexus-color-brand-hover |
| CTA | #0167AC | --annexus-color-brand-cta |
| Brand/700 | #044638 | --annexus-color-brand-700 |
| Success/600 | #079455 | --annexus-color-success |
| Need (error) | #B73B3B | --annexus-color-error |
| Control-off (Toggle track) | #CED6DB | --annexus-color-control-off |
| Base/White | #FFFFFF | --annexus-color-white |
| Black | #222222 | --annexus-color-black |
| Gray/50 | #FAFAFA | --annexus-color-gray-50 |
| Gray/100 | #F5F5F5 | --annexus-color-gray-100 |
| Gray/200 | #E9EAEB | --annexus-color-gray-200 |
| Gray/300 | #D5D7DA | --annexus-color-gray-300 |
| Gray/400 | #A4A7AE | --annexus-color-gray-400 |
| Gray/500 | #717680 | --annexus-color-gray-500 |
| Gray/700 | #404042 | --annexus-color-gray-700 |
| Gray/900 | #181D27 | --annexus-color-gray-900 |

## Extracted Typography Tokens

| Figma Style | Size | Weight | Line Height | SCSS Token |
|-------------|------|--------|-------------|------------|
| Text xs/Regular | 12px | 400 | 18px | --annexus-text-xs-* |
| Text xs/Semibold | 12px | 600 | 18px | --annexus-text-xs-* |
| Text sm/Regular | 14px | 400 | 20px | --annexus-text-sm-* |
| Text sm/Semibold | 14px | 600 | 20px | --annexus-text-sm-* |
| Text sm/Bold | 14px | 700 | 20px | --annexus-text-sm-* |
| Text md/Regular | 16px | 400 | 24px | --annexus-text-md-* |
| Text md/Semibold | 16px | 600 | 24px | --annexus-text-md-* |

## Extracted Shadow Tokens

| Figma Variable | Value |
|----------------|-------|
| shadow-xs | 0px 1px 2px 0px rgba(10,13,18,0.05) |
| shadow-xs-skeuomorphic | 0px 1px 2px 0px rgba(16,24,40,0.05), inset 0px -2px 0px rgba(10,13,18,0.05), inset 0px 0px 0px 1px rgba(10,13,18,0.18) |
| shadow-lg | 0px 2px 2px -1px rgba(10,13,18,0.04), 0px 4px 6px -2px rgba(10,13,18,0.03), 0px 12px 16px -4px rgba(10,13,18,0.08) |

## Component Dimensions (from Figma)

| Property | Value | Source |
|----------|-------|--------|
| Control height | 44px | Input, Button, Group Item, Toggle |
| Button border-radius | 3px | Button component |
| Input border-radius | 4px | Input component |
| Toggle size | 51×28px track, 23px thumb | Toggle component |
| Container max-width | 1280px | Dropdown header navigation |
| Standard padding-x | 12–14px | Button/Input |
| Standard padding-y | 8px | Button/Input |
