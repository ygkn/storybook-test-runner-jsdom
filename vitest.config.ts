/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
  },
  // Storybook 7.6 未満または Storybook 7.6 以上で action の定義に `@storybook/test` の `fn()` を使用していない場合は、
  // 以下のコメントアウトを外してください。
  //
  // resolve: {
  //   alias: [
  //     {
  //       find: "@storybook/jest",
  //       replacement: "vitest",
  //     },
  //   ],
  // },
});
