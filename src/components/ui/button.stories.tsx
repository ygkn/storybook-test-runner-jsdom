import { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta = {
  component: Button,
  args: {
    children: "ボタン",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};
