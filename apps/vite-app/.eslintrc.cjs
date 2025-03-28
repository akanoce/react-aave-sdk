module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["react-refresh", "prettier", "@typescript-eslint"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": "off",
    "react/function-component-definition": "off",
    "react/react-in-jsx-scope": "off",
    "import/extensions": "off",
    "import/export": "off",
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/lines-between-class-members": "off",
    "@typescript-eslint/no-throw-literal": "off",
  },
};
