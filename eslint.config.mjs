import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,  // Add Node.js globals here
      },
    },
  },
  pluginJs.configs.recommended,
];
