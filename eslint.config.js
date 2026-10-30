/**
 * ESLint Flat Configuration for EventSphere.ai
 * Enforces clean code standards, prevents common bugs, and ensures maintainable code.
 */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'scratch/**', 'coverage/**', '*.log']
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'off',
      'no-console': ['off'],
      'no-debugger': 'error',
      'prefer-const': 'warn',
      'no-var': 'error'
    }
  }
];
