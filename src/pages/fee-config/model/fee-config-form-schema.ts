import { z } from "zod";

export const feeConfigFormSchema = z.object({
  configurationName: z.string().min(1, "Configuration name is required"),
  service: z.string().min(1, "Service is required"),
  provider: z.literal("Yourpay"),
  currency: z.string().min(1, "Currency is required"),
  feeType: z.enum(["fixed", "percentage"], {
    required_error: "Fee type is required",
  }),
  feeMode: z.enum(["exclusive", "inclusive"], {
    required_error: "Fee mode is required",
  }),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (v) => {
        const parsed = Number(v.replace(/,/g, ""));
        return Number.isFinite(parsed) && parsed >= 0;
      },
      { message: "Amount must be a non-negative number" },
    ),
  isActive: z.boolean().default(true),
});

export type FeeConfigFormValues = z.infer<typeof feeConfigFormSchema>;

