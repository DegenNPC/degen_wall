import baseConfig from "@degen_wall/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["target/**", "run_tests.js", "scripts/**"],
  },
  ...baseConfig,
  {
    rules: {
      "turbo/no-undeclared-env-vars": "off",
    },
  },
];
