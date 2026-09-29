import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'exclave-*/vitest.config.ts',
    ],
  },
})
