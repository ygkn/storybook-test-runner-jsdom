import { zodResolver } from "@hookform/resolvers/zod";
import { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const ExampleForm: FC<{
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}> = ({ onSubmit }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

const meta = {
  component: ExampleForm,
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof ExampleForm>;

export default meta;

type Story = StoryObj<typeof ExampleForm>;

export const Default: Story = {};

export const EmptySubmit: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("submit", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    });

    await step("assert", async () => {
      await waitFor(async () => {
        await expect(
          canvas.getByRole("textbox", {
            name: "Username",
          }),
        ).toBeInvalid();
      });
    });
  },
};

export const FullfilledSubmit: Story = {
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("input", async () => {
      await userEvent.type(
        canvas.getByRole("textbox", { name: "Username" }),
        "name",
      );
    });

    await step("submit", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    });

    await step("assert", async () => {
      await waitFor(async () => {
        await expect(args.onSubmit).toBeCalledWith(
          {
            username: "name",
          },
          expect.anything(),
        );
      });
    });
  },
};
