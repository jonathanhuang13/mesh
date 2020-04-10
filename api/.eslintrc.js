module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', '@typescript-eslint/tslint', 'eslint-plugin-unicorn'],
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    'no-redeclare': 'error',
    'no-return-await': 'error',
    'no-duplicate-case': 'error',
  }
}
