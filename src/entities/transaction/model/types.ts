import { z } from "zod";

export const transactionFilterOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const transactionFilterTypeSchema = z.enum(["control", "options", "date_range"]);

export const transactionFilterDefinitionSchema = z.object({
  key: z.string(),
  name: z.string().optional(),
  type: transactionFilterTypeSchema,
  options: z.array(transactionFilterOptionSchema),
  /** Example pipe-separated datetime format from API (documentation / hints). */
  format: z.string().optional(),
});

export const transactionsFiltersSchema = z.record(z.array(transactionFilterOptionSchema));

export const transactionSchema = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  externalId: z.string().optional(),
  transactionType: z.string().optional(),
  serviceCode: z.string().optional(),
  country: z.string().optional(),
  sender: z.string().optional(),
  senderPhone: z.string().optional(),
  amount: z.string().optional(),
  receiver: z.string().optional(),
  receiverPhone: z.string().optional(),
  createdAt: z.string().optional(),
});

export const transactionsResponseSchema = z.object({
  data: z.array(transactionSchema),
  total: z.number(),
  filters: transactionsFiltersSchema.optional(),
  filterDefinitions: z.array(transactionFilterDefinitionSchema).optional(),
});

export const transactionDetailSchema = z
  .object({
    id: z.string().optional(),
    externalId: z.string().optional(),
    transactionType: z.string().optional(),
    status: z.string().optional(),
    country: z.string().optional(),
    reversalStatus: z.string().optional(),
    reason: z.string().optional(),
    amount: z.string().optional(),
    totalPaid: z.string().optional(),
    totalReceived: z.string().optional(),
    totalFee: z.string().optional(),
    totalVoucherDiscount: z.string().optional(),
    yourpoinCashback: z.string().optional(),
    hasVoucher: z.string().optional(),
    sender: z.string().optional(),
    receiver: z.string().optional(),
    initiator: z.string().optional(),
    tradeNumber: z.string().optional(),
    paymentNumber: z.string().optional(),
    serviceId: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionsResponse = z.infer<typeof transactionsResponseSchema>;
export type TransactionDetail = z.infer<typeof transactionDetailSchema>;
export type TransactionFilterOption = z.infer<typeof transactionFilterOptionSchema>;
export type TransactionFilterType = z.infer<typeof transactionFilterTypeSchema>;
export type TransactionFilterDefinition = z.infer<typeof transactionFilterDefinitionSchema>;
export type TransactionsFilters = z.infer<typeof transactionsFiltersSchema>;
