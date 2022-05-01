module.exports = {
  env: {
    node: true,
    es6: true
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "prettier"
  ]
};
