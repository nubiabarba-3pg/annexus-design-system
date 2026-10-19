```yaml
version: 1.0
platform: Web
tech_stack: [React 18, TypeScript strict, SASS/SCSS, Vite 6 library mode, Storybook 8.x]

design_tokens:
  colors:
    brand:
      primary: "#11175E"
      hover: "#1B3E80"
      cta: "#0167AC"
      "700": "#044638"
    semantic:
      success: "#079455"
      error: "#B73B3B"
      control-off: "#CED6DB"
    neutral:
      white: "#FFFFFF"
      black: "#222222"
    gray:
      "50": "#FAFAFA"
      "100": "#F5F5F5"
      "200": "#E9EAEB"
      "300": "#D5D7DA"
      "400": "#A4A7AE"
      "500": "#717680"
      "700": "#404042"
      "900": "#181D27"
  breakpoints: {sm: 640px, md: 768px, lg: 1024px, xl: 1280px}
  spacing:
    base: 4px
    scale: {lg: [4,8,12,16,20,24,32,48], sm: [4,8,12,16,20,24,32,48]}
  typography:
    font_family: "'Assistant', sans-serif"
    weights: [400, 600, 700]
    scale:
      xs: {size: 12px, line_height: 18px}
      sm: {size: 14px, line_height: 20px}
      md: {size: 16px, line_height: 24px}
  elevation:
    shadow-xs: "0 1px 2px rgba(10,13,18,0.05)"
    shadow-xs-skeuomorphic: "0 1px 2px rgba(16,24,40,0.05), inset 0 -2px 0 rgba(10,13,18,0.05), inset 0 0 0 1px rgba(10,13,18,0.18)"
    shadow-lg: "0 2px 2px -1px rgba(10,13,18,0.04), 0 4px 6px -2px rgba(10,13,18,0.03), 0 12px 16px -4px rgba(10,13,18,0.08)"
  border_radius:
    sm: 3px
    md: 4px
    full: 9999px
  touch_targets: {control_height: 44px, wcag_min: 24px, touch_min: 44px, comfortable: 48px, spacing: 8px}
  icons: {set: custom-svg, source: "Figma DjPqMQEOe6khkoqIVQ8a9u", names: [check-circle, chevron-down, winLose], style: mixed}

responsive_behavior:
  layout:
    navigation: {lg: fixed-top-bar, sm: collapsed}
    grid: {xl: 12_columns, lg: 12_columns, md: 8_columns, sm: 4_columns}
    content: {xl: max-width-1280-centered, sm: full-bleed}
  components:
    modal: {lg: centered_overlay, sm: full_screen_sheet}
    slider: {lg: "drag+keyboard", sm: "touch+keyboard"}
    chart: {lg: full_interactive, sm: simplified_readonly}
    rows: {lg: standard_row, sm: card_stack}
    footer: {lg: multi_column, sm: single_column_stacked}

ux_logic:
  validation: prop-driven
  error_display: inline_below_field
  success_feedback: n/a
  loading_states: n/a
  navigation: fixed_top_bar_1280px
  data_density: high

component_map:
  atoms: [Button, Input, Toggle, Badge, Icons, Logo, AgeTag, ControlHandle, NumberStrip]
  molecules: [Slider, Tooltip, ButtonGroup, FrequencySelector, HelpIcon, AddonRow, Row]
  organisms:
    - Dropdown/Nav
    - Modal
    - Legend
    - GroupItem
    - HeaderSection
    - Footer
    - AdjustInflationRate
    - GraphContainer
    - Chart/Bar
    - TopSummary
    - BottomSummary
    - Premium
    - AnimatedValues

user_journey:
  primary_path: "Engineer installs @annexus/ui → imports component → renders in Athene calculator app"
  critical_flows:
    - "Browse Storybook → discover component variants → copy usage snippet"
    - "Import Button/Input/Toggle → compose calculator form"
    - "Import Chart/Bar + GraphContainer → render income projection visualization"

a11y:
  level: WCAG 2.2 AA
  focus_states: ":focus-visible 2px outline (2.4.11)"
  keyboard_nav: true
  aria_labels: required_on_all_interactive
  color_contrast: "4.5:1 text / 3:1 UI components"
  dragging_alternative: "2.5.7 — Slider: arrow-key + click-on-track"
  motion: "prefers-reduced-motion disables AnimatedValues animation"
  screen_reader: semantic_html + ARIA_roles_per_component

patterns:
  error_display: inline_below_field
  success_feedback: n/a
  bulk_actions: n/a
  search_filter: n/a
```
