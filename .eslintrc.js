module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: './',
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
  ],
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/prefer-interface': 'off',
  },
};
