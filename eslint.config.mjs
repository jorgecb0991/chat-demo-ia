import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Configuraciones base
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  
  // Configuración de ignores (reemplaza .eslintignore)
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "dist/",
      "*.min.js",
      "*.config.js",
      "*.config.ts",
      "next-env.d.ts"
    ]
  },
  
  // Configuración de plugins y reglas
  {
    plugins: {
      import: importPlugin,
      react: reactPlugin,
    },
    rules: {
      // Reglas de importación (moderadas)
      "import/no-cycle": ["warn", { maxDepth: 1 }],
      "import/no-relative-packages": "warn",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal"
            }
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          }
        }
      ],
      
      // Reglas de React
      "react/no-multi-comp": ["warn", { ignoreStateless: true }],
      
      // Reglas personalizadas
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            "../app/*/*",
            "../app/**",
            "src/*/../*"
          ]
        }
      ]
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json"
        }
      },
      react: {
        version: "detect"
      }
    }
  }
];

export default eslintConfig;