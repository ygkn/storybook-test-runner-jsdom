import { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";

const meta = {
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};
