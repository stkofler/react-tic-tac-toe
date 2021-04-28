module.exports = {
  plugins: [
    "@typescript-eslint",
    "unicorn",
  ],
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    "plugin:unicorn/recommended",
  ],
  rules: {
    'react/destructuring-assignment': 'off',
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    'unicorn/prefer-query-selector': 'off',
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
    "unicorn/prevent-abbreviations": [ "error", { "allowList": {
      "props": true,
      "Props": true,
      'i': true
    }}]
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: [
    '.eslintrc.js',
  ],
};