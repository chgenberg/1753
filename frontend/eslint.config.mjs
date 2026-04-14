import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**"]),
  {
    rules: {
      "react/no-unescaped-entities": "off",
      // localStorage-initialisering i useEffect ar korrekt monster for client-only state
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
