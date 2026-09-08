import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Resolve the `@/…` path alias (mirrors tsconfig) so tests import modules exactly as the app does.
export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: fileURLToPath(new URL("./", import.meta.url)) }],
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
