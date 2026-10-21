import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Only SCSS modules are compiled (they carry the :export of the design variables)
    css: { include: /\.module\.scss$/ },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      thresholds: { lines: 90, branches: 90, functions: 90, statements: 90 },
      exclude: [
        '**/*.test.tsx',
        '**/*.test.ts',
        '**/*.stories.tsx',
        '**/*.types.ts',
        '**/*.d.ts',
        '**/index.ts',
        'src/index.ts',
      ],
    },
  },
});
