/// <reference types="vite/client" />

import { Meta, StoryFn, composeStories } from "@storybook/react";
import { render } from "@testing-library/react";
import { describe, test } from "vitest";

declare module "@storybook/types" {
  interface Parameters {
    vitest?: {
      /**
       * テストレベルを指定します。
       * - `none`: Story をスキップします。（Storybook でのみ実行されます）
       * - `smoke-only`: Story のレンダリングのみをテストします。
       * - `interaction`: Story のレンダリングとインタラクションをテストします。
       *
       * @default "interaction"
       */
      testLevel?: "none" | "smoke-only" | "interaction" | undefined;
    };
  }
}

const stories = await Promise.all(
  Object.entries(
    import.meta.glob<{
      default: Meta;
      [name: string]: StoryFn | Meta;
    }>("../**/*.(stories|story).@(js|jsx|mjs|ts|tsx)", {
      eager: true,
    }),
  ).map(async ([path, exports]) => {
    const composedStories = composeStories(exports);
    return {
      path: path.replace(/^\.\.\//, "src/"),
      stories: Object.entries(composedStories).map(([name, Component]) => {
        const runStory = async () => {
          const testLevel =
            Component.parameters.vitest?.testLevel ?? "interaction";

          // Storybook 7.6 未満または Storybook 7.6 以上で action の定義に `@storybook/test` の `fn()` を使用していない場合は、
          // `argTypes` か `actions` を定義し、以下のコードを使用してください。
          //
          // if (testLevel === "none") {
          //   return;
          // }
          //
          // const args = Object.fromEntries(
          //   Object.entries(Component.argTypes ?? {})
          //     .filter(
          //       ([name, type]) =>
          //         // action が定義されているか、
          //         type.action !== undefined ||
          //         // prop名が argTypesRegex にマッチする（= `on` で始まる）
          //         (typeof Component.parameters["actions"]?.argTypesRegex ===
          //           "string" &&
          //           new RegExp(
          //             Component.parameters["actions"].argTypesRegex,
          //           ).test(name)),
          //     )
          //     .map(([name]) => [name, vitest.fn()]),
          // );
          //
          // const screen = render(<Component {...args} />);
          //
          // if (testLevel === "smoke-only") {
          //   return;
          // }
          //
          // await Component.play?.({ canvasElement: screen.container, args });

          if (testLevel === "none") {
            return;
          }

          const screen = render(<Component />);

          if (testLevel === "smoke-only") {
            return;
          }

          await Component.play({ canvasElement: screen.container });
        };

        return {
          name,
          runStory,
        };
      }),
    };
  }),
);

describe.each(stories)("$path", ({ stories }) => {
  test.each(stories)("$name", async ({ runStory }) => {
    runStory();
  });
});
