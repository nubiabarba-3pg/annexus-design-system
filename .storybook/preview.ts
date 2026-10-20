import type { Preview } from '@storybook/react';
import '../src/tokens/index.scss';
// Same global stylesheet consumers get via `@annexus/ui/style.css` (box-sizing reset)
import '../src/styles.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // axe-core configuration — runs on every story
      config: {},
    },
  },
};

export default preview;
