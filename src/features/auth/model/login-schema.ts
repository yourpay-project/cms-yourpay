import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((value) => value.toLowerCase().endsWith("@yourpay.co.id"), {
      message: "Email must use @yourpay.co.id domain",
    }),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

