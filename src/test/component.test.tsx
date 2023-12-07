import { glob } from "glob";
import { ReactRenderer, composeStories } from "@storybook/react";
import { render } from "@testing-library/react";
import { describe, test } from "vitest";
import type { ComposedStoryFn } from "@storybook/types";

const stories = await Promise.all(
  (
    await glob("../**/*.stories.tsx", {
      cwd: __dirname,
    })
  ).map(async (path) => {
    const exports = await import(path);
    const composedStories = composeStories(exports);

    return {
      path: path.replace(/^\.\.\//, "src/"),
      stories: Object.entries(composedStories).map(([name, composedStory]) => {
        const Component = composedStory as ComposedStoryFn<
          ReactRenderer,
          unknown
        >;

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

          const screen = render(<Component />);

          await Component.play?.({ canvasElement: screen.container });
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
