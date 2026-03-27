import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { UseFormProps, UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface UseZodFormProps<T extends z.ZodTypeAny>
  extends Omit<UseFormProps<z.infer<T>>, "resolver"> {
  schema: T;
}

/**
 * Initializes a typed React Hook Form instance with Zod resolver wired in.
 *
 * @param props - Zod schema and optional RHF form configuration.
 * @returns A fully typed RHF form methods object.
 */
export const useZodForm = <T extends z.ZodTypeAny>({
  schema,
  ...formConfig
}: UseZodFormProps<T>): UseFormReturn<z.infer<T>> => {
  return useForm<z.infer<T>>({
    ...formConfig,
    resolver: zodResolver(schema),
  });
};
