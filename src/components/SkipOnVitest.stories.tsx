import { Meta } from "@storybook/react";

const Component = () => {
  return <div>Vitestではスキップされるコンポーネント</div>;
};

export default {
  title: "Components/SkipOnVitest",
  parameters: {
    vitest: {
      testLevel: "none",
    },
  },
  component: Component,
} as const satisfies Meta;

export const Default = {};

export const SmokeOnly = {
  parameters: {
    vitest: {
      testLevel: "smoke-only",
    },
  },
};
