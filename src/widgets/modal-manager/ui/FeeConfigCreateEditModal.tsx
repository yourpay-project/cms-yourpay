import type { FC } from "react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateFeeConfigById } from "@/shared/api/fee-config";
import { postV1OperatorsFee, type NewFeeConfigRequest } from "@/shared/api/generated";
import { feeConfigFormSchema, type FeeConfigFormValues } from "@/features/fee-config";
import { Button } from "@/shared/ui";

import type { FeeConfigCreateEditModalProps } from "./FeeConfigCreateEditModal.type";
import { FeeConfigCreateEditModalForm } from "./FeeConfigCreateEditModalForm";

const DEFAULT_VALUES: FeeConfigFormValues = {
  configurationName: "",
  service: "",
  provider: "Yourpay",
  currency: "",
  feeType: "fixed",
  feeMode: "exclusive",
  amount: "",
  isActive: true,
};

/**
 * Centralized create/edit modal for fee config.
 */
export const FeeConfigCreateEditModal: FC<FeeConfigCreateEditModalProps> = ({
  open,
  onClose,
  mode,
  row,
  onSubmitted,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FeeConfigFormValues>({
    resolver: zodResolver(feeConfigFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && row) {
      reset({
        configurationName: row.name,
        service: row.service,
        provider: "Yourpay",
        currency: row.currency,
        feeType: row.feeType,
        feeMode: row.feeMode,
        amount: String(row.nominal),
        isActive: row.isActive,
      });
      return;
    }

    reset(DEFAULT_VALUES);
  }, [mode, open, reset, row]);

  const activeStatus = watch("isActive");
  const onActiveChange = (next: boolean): void => {
    setValue("isActive", next, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (values: FeeConfigFormValues): Promise<void> => {
    const parsedAmount = Number(values.amount.replace(/,/g, ""));
    const basePayload = {
      name: values.configurationName,
      provider: values.provider,
      currency: values.currency,
      fee_type: values.feeType,
      fee_mode: values.feeMode,
      fee_value: Number.isFinite(parsedAmount) ? parsedAmount : 0,
      is_active: values.isActive,
      service_id: values.service,
    };

    if (mode === "edit" && row?.id) {
      await updateFeeConfigById(row.id, basePayload);
    } else {
      await postV1OperatorsFee(basePayload as NewFeeConfigRequest);
    }

    onSubmitted?.();
    onClose();
  };

  const title = mode === "edit" ? "Edit Fee Config" : "Create Fee Config";

  return (
    <div className="space-y-4">
      <div className="space-y-1 pb-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">Configure fee settings for a specific service.</p>
      </div>

      <FeeConfigCreateEditModalForm
        register={register}
        errors={errors}
        activeStatus={activeStatus}
        onActiveChange={onActiveChange}
      />

      <div className="flex items-center justify-end gap-2 pb-5 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => {
            void handleSubmit(onSubmit)();
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "edit" ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};

