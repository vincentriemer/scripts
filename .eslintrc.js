module.exports = {
  plugins: ["prettier", "import"],
  env: {
    es6: true,
    node: true
  },
  extends: [
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  parserOptions: {
    ecmaVersion: 2017
  },
  rules: {
    "import/no-unresolved": [2, { commonjs: true }],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-console": "off"
  }
};
