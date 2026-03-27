import type * as React from "react";
import type { FieldErrors, UseFormProps, UseFormReturn } from "react-hook-form";
import type { z } from "zod";

/**
 * Inferred form values type from a Zod schema.
 */
export type FormValues<T extends z.ZodTypeAny> = z.infer<T>;

type NativeFormProps = Omit<React.ComponentProps<"form">, "onSubmit" | "children" | "onError">;

/**
 * Generic schema-driven form wrapper props.
 */
export interface FormProps<T extends z.ZodTypeAny> extends NativeFormProps {
  schema: T;
  formConfig?: Omit<UseFormProps<FormValues<T>>, "resolver">;
  onSubmit: (values: FormValues<T>, methods: UseFormReturn<FormValues<T>>) => void | Promise<void>;
  onError?: (errors: FieldErrors<FormValues<T>>, methods: UseFormReturn<FormValues<T>>) => void;
  children: React.ReactNode | ((methods: UseFormReturn<FormValues<T>>) => React.ReactNode);
}
