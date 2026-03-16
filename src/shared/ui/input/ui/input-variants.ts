import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  "relative flex min-w-0 flex-1 items-center gap-2 border bg-background px-3 transition-all duration-200",
  {
    variants: {
      size: {
        sm: "h-10 rounded-md",
        md: "h-12 rounded-md",
        lg: "h-14 rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type InputSizeProps = VariantProps<typeof inputVariants>;

