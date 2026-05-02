// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Register the simple-import-sort plugin
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Base TypeScript & Prettier rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // Enterprise-grade import sorting rules
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Built-in Node.js modules (e.g., node:fs, node:path)
            ['^node:'],

            // 2. External packages (NestJS ecosystem first, then others)
            ['^@nestjs', '^@?\\w'],

            // 3. Internal project files (using # aliases) in strict architectural order
            [
              '^#.*\\.module$', // Modules
              '^#.*\\.service$', // Services
              '^#.*\\.command$', // Commands
              '^#.*\\.handler$', // Handlers
              '^#.*\\.config$', // Configurations
              '^#', // All other internal aliases (Entities, DTOs, etc.)
            ],

            // 4. Relative imports (parent directories first, then current directory)
            ['^\\.\\.', '^\\.'],
          ],
        },
      ],
    },
  },
);
