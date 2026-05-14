import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...js.configs.recommended,
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...reactRefresh.configs.vite,
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
  },
])