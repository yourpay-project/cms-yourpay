import type { FC } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";

import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/ui";
import { Form } from "@/shared/ui/form/Form";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormInputPassword } from "@/shared/ui/form/FormInputPassword";

import type { UserCloseConfirmProps } from "./UserCloseConfirm.type";

const userCloseConfirmSchema = z.object({
  operatorPassword: z.string().min(1, "Operator password is required"),
  reason: z.string().min(10, "Termination reason must be at least 10 characters"),
  confirmChecked: z.literal(true, {
    errorMap: () => ({ message: "You must confirm this irreversible action" }),
  }),
});

type UserCloseConfirmValues = z.infer<typeof userCloseConfirmSchema>;

/**
 * Confirmation modal for terminating a customer account.
 */
export const UserCloseConfirm: FC<UserCloseConfirmProps> = ({
  onClose,
  customerId,
}) => {
  const formId = "user-close-confirm-form";
  const terminationReasonId = "user-close-confirm-termination-reason";

  const handleConfirm = (values: UserCloseConfirmValues) => {
    void values;
    toast.info(`TODO: close user flow for ${customerId}`, {
      description: "Confirm action is not connected to backend yet.",
    });
    onClose();
  };

  return (
    <Form
      id={formId}
      schema={userCloseConfirmSchema}
      onSubmit={handleConfirm}
      formConfig={{
        defaultValues: {
          operatorPassword: "",
          reason: "",
          confirmChecked: false,
        },
      }}
      className="space-y-4 pb-1 pt-2"
    >
      <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Terminate Customer Account</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            This action is IRREVERSIBLE and will permanently delete ALL customer data including
            transactions, devices, and personal information.
          </p>
        </div>

        <div className="space-y-3">
          {/* Hidden username helps browser autofill + avoids accessibility warnings for password-only forms */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
          <FormInputPassword
            name="operatorPassword"
            label="Operator Password*"
            autoComplete="current-password"
            description="Enter your operator password to confirm this action"
          />
          <Controller
            name="reason"
            render={({ field, fieldState: { error } }) => (
              <div className="space-y-1.5">
                <label htmlFor={terminationReasonId} className="text-sm font-medium text-foreground">
                  Termination Reason*
                </label>
                <textarea
                  id={terminationReasonId}
                  name={field.name}
                  value={(field.value as string) ?? ""}
                  onChange={field.onChange}
                  className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
                />
                {error?.message ? (
                  <p className="text-destructive text-sm">{error.message}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Please provide a detailed reason for terminating this customer account
                  </p>
                )}
              </div>
            )}
          />

          <FormCheckbox
            name="confirmChecked"
            label="I understand this action cannot be undone"
          />
        </div>

      <div className="flex items-center justify-end gap-2 pb-5 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="destructive">
          Confirm
        </Button>
      </div>
    </Form>
  );
};

