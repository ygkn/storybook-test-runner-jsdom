/// <reference types="vite/client" />

import { Meta, StoryFn, composeStories } from "@storybook/react";
import { render } from "@testing-library/react";
import { describe, test } from "vitest";

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
          // Storybook 7.6 未満または Storybook 7.6 以上で action の定義に `@storybook/test` の `fn()` を使用していない場合は、
          // `argTypes` か `actions` を定義し、以下のコードを使用してください。
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
          // const screen = render(<Component {...args} />);
          // await Component.play?.({ canvasElement: screen.container, args });

          const screen = render(<Component />);

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
