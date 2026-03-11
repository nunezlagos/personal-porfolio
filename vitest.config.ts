import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**/*.ts'],
      exclude: ['**/*.d.ts', '**/env.d.ts'],
    },
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  },
});
