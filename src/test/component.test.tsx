import { glob } from "glob";
import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";
import { describe, test, vitest } from "vitest";

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
      stories: Object.entries(composedStories).map(([name, Component]) => {
        const runStory = async () => {
          const args = Object.fromEntries(
            Object.entries(Component.argTypes ?? {})
              .filter(
                ([name, type]) =>
                  type.action !== undefined ||
                  (typeof Component.parameters["actions"]?.argTypesRegex ===
                    "string" &&
                    new RegExp(
                      Component.parameters["actions"].argTypesRegex,
                    ).test(name)),
              )
              .map(([name]) => [name, vitest.fn()]),
          );

          const screen = render(<Component {...args} />);

          await Component.play?.({ canvasElement: screen.container, args });
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
