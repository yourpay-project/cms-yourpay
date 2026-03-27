import * as React from "react";
import { FormProvider } from "react-hook-form";
import type { z } from "zod";

import { useZodForm } from "@/shared/lib/hooks/use-zod-form";
import type { FormProps, FormValues } from "./Form.type";

/**
 * Generic schema-aware form wrapper that provides RHF context and submit orchestration.
 *
 * @param props - Form schema, submit handlers, native form props, and children content.
 * @returns A provider-backed form element ready for composed field wrappers.
 */
export const Form = <T extends z.ZodTypeAny>({
  schema,
  onSubmit,
  onError,
  formConfig,
  children,
  ref,
  ...nativeProps
}: FormProps<T>): React.ReactElement => {
  const form = useZodForm({
    schema,
    ...formConfig,
  });

  const handleValidSubmit = (values: FormValues<T>) => onSubmit(values, form);
  const handleInvalidSubmit = onError
    ? (errors: Parameters<NonNullable<FormProps<T>["onError"]>>[0]) => onError(errors, form)
    : undefined;
  const renderedChildren = typeof children === "function" ? children(form) : children;

  return (
    <FormProvider {...form}>
      <form
        ref={ref}
        noValidate
        onSubmit={form.handleSubmit(handleValidSubmit, handleInvalidSubmit)}
        {...nativeProps}
      >
        {renderedChildren}
      </form>
    </FormProvider>
  );
};
