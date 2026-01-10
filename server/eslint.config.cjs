const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'unused-imports': require('eslint-plugin-unused-imports'),
      import: require('eslint-plugin-import'),
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',

      'unused-imports/no-unused-imports': 'error',
    },
  },
];
