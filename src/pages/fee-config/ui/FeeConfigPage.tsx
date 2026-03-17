import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ApiClientError } from "@/shared/api";
import { postV1OperatorsFee, type NewFeeConfigRequest } from "@/shared/api/generated";
import { deleteFeeConfigById, updateFeeConfigById } from "@/shared/api/fee-config";
import { Button, Input, PageSkeleton, SearchInput } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal";
import { FeeConfigTable } from "@/widgets/fee-config-table";
import type { FeeConfig } from "@/entities/fee-config";
import { feeConfigFormSchema, type FeeConfigFormValues, useFeeConfigFilters } from "..";
import { FeeConfigFiltersCard } from "./FeeConfigFiltersCard";
import { cn } from "@/shared/lib";

const CURRENCY_OPTIONS: Array<{ label: string; value: "ALL" | "IDR" | "SGD" | "HKD" | "NTD" }> = [
  { label: "All", value: "ALL" },
  { label: "IDR", value: "IDR" },
  { label: "SGD", value: "SGD" },
  { label: "HKD", value: "HKD" },
  { label: "NTD", value: "NTD" },
];

const FeeConfigPage: FC = () => {
  const filters = useFeeConfigFilters();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const canCreateFeeConfig = true;
  const statusSelectRef = useRef<HTMLSelectElement | null>(null);
  const feeTypeSelectRef = useRef<HTMLSelectElement | null>(null);
  const serviceSelectRef = useRef<HTMLSelectElement | null>(null);

  // todo: Please update this stuff by API
  const serviceOptions = useMemo(
    () =>
      Array.from(new Set(filters.items.map((item) => item.service)))
        .filter(Boolean)
        .sort()
        .map((service) => ({
          value: service,
          label: service,
        })),
    [filters.items],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FeeConfigFormValues>({
    resolver: zodResolver(feeConfigFormSchema),
    defaultValues: {
      configurationName: "",
      service: "",
      provider: "Yourpay",
      currency: "",
      feeType: "fixed",
      feeMode: "exclusive",
      amount: "",
      isActive: true,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: FeeConfigFormValues) => {
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

    if (editingId) {
      await updateFeeConfigById(editingId, basePayload);
    } else {
      await postV1OperatorsFee(basePayload as NewFeeConfigRequest);
    }

    setEditingId(null);
    await filters.refetch();
  };

  const handleCreateNew = () => {
    reset({
      configurationName: "",
      service: "",
      provider: "Yourpay",
      currency: "",
      feeType: "fixed",
      feeMode: "exclusive",
      amount: "",
      isActive: true,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const currencyButtons = CURRENCY_OPTIONS.map((option) => (
    <Button
      key={option.value}
      type="button"
      size="sm"
      variant={filters.currency === option.value ? "default" : "outline"}
      onClick={() => {
        filters.setCurrency(option.value);
        filters.resetPageIndex();
      }}
    >
      {option.label}
    </Button>
  ));

  const activeStatus = watch("isActive");

  if (filters.isLoading) {
    return <PageSkeleton />;
  }

  if (filters.isError) {
    const apiError = filters.error instanceof ApiClientError ? filters.error : null;
    const message =
      apiError?.status === 403
        ? "You do not have permission to view fee configurations."
        : "Failed to load fee configurations. Please try again.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  const handleEdit = (row: FeeConfig) => {
    setEditingId(row.id);
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
    setIsModalOpen(true);
  };

  const handleDelete = async (row: FeeConfig) => {
    await deleteFeeConfigById(row.id);
    await filters.refetch();
  };

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div>
        <h2 className="text-xl font-semibold">Fee Config</h2>
      </div>

      <FeeConfigFiltersCard
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        status={filters.status}
        setStatus={filters.setStatus}
        feeType={filters.feeType}
        setFeeType={filters.setFeeType}
        service={filters.service}
        setService={filters.setService}
        statusSelectRef={statusSelectRef}
        feeTypeSelectRef={feeTypeSelectRef}
        serviceSelectRef={serviceSelectRef}
        serviceOptions={serviceOptions}
        resetPageIndex={filters.resetPageIndex}
      />

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-wrap items-center justify-center gap-1 md:w-auto md:justify-start">
          {currencyButtons}
        </div>
        <div
          className={cn(
            "flex w-full items-center gap-3 justify-between md:w-auto md:justify-end",
            !canCreateFeeConfig && "justify-end",
          )}
        >
          <SearchInput
            placeholder="Search by name, service, currency..."
            value={filters.search}
            onChange={(e) => {
              filters.setSearch(e.target.value);
              filters.resetPageIndex();
            }}
            containerClassName="w-full max-w-xs"
          />
          {canCreateFeeConfig && (
            <Button size="sm" type="button" onClick={handleCreateNew}>
              New Fee Config
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-none">
        <FeeConfigTable
          data={filters.items}
          total={filters.total}
          pageIndex={filters.pageIndex}
          pageSize={filters.pageSize}
          isRefetching={filters.isFetching && !filters.isLoading}
          onPageChange={(nextPageIndex, nextPageSize) => {
            filters.setPageIndex(nextPageIndex);
            filters.setPageSize(nextPageSize);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
        onOk={handleSubmit(async (values) => {
          await onSubmit(values);
          setIsModalOpen(false);
        })}
        okText={editingId ? "Update" : "Create"}
        cancelText="Cancel"
        title="Create Fee Config"
        description="Configure fee settings for a specific service."
        centered
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          // Prevent default HTML validation bubble
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Configuration Name"
              placeholder="Service Charge"
              status={errors.configurationName ? "error" : undefined}
              helperText={errors.configurationName?.message}
              {...register("configurationName")}
            />
            <Input
              label="Service"
              placeholder="Select a service"
              status={errors.service ? "error" : undefined}
              helperText={errors.service?.message}
              {...register("service")}
            />
            <Input
              label="Provider"
              value="Yourpay"
              disabled
              {...register("provider")}
            />
            <Input
              label="Currency"
              placeholder="Select currency"
              status={errors.currency ? "error" : undefined}
              helperText={errors.currency?.message}
              {...register("currency")}
            />
            <Input
              label="Fee type"
              placeholder="fixed / percentage"
              status={errors.feeType ? "error" : undefined}
              helperText={errors.feeType?.message}
              {...register("feeType")}
            />
            <Input
              label="Fee mode"
              placeholder="exclusive / inclusive"
              status={errors.feeMode ? "error" : undefined}
              helperText={errors.feeMode?.message}
              {...register("feeMode")}
            />
            <Input
              label="Amount"
              placeholder="0.00"
              status={errors.amount ? "error" : undefined}
              helperText={errors.amount?.message}
              {...register("amount")}
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                checked={activeStatus}
                onChange={(event) => {
                  const field = register("isActive");
                  field.onChange?.({
                    target: { value: event.target.checked, name: "isActive" },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
              />
              <span className="text-sm text-foreground">Active Status</span>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeeConfigPage;

