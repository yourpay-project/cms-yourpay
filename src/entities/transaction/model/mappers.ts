import { transactionsResponseSchema, transactionDetailSchema, type TransactionFilterOption } from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function toDisplayValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function normalizeFilterOptions(raw: unknown): TransactionFilterOption[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === "string") {
        return { label: entry, value: entry };
      }
      const record = asRecord(entry);
      if (!record) return null;
      const hasExplicitValue = Object.prototype.hasOwnProperty.call(record, "value");
      const value = hasExplicitValue
        ? record.value === null || record.value === undefined
          ? ""
          : String(record.value)
        : toDisplayValue(record.key ?? record.id ?? record.code);
      const label = toDisplayValue(
        record.label ?? record.text ?? record.name ?? (value === "" ? "All" : value)
      );
      if (!label && value === "") {
        return { label: "All", value: "" };
      }
      if (!label && !value) return null;
      return { label: label || value || "—", value };
    })
    .filter((v): v is TransactionFilterOption => v !== null);
}

function collectRawFilters(payload: unknown): unknown[] {
  const root = asRecord(payload) ?? {};
  const data = asRecord(root.data) ?? {};
  const candidates: unknown[] = [
    data.filters,
    data.filter,
    data.available_filters,
    root.filters,
    root.filter,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate;
    }
  }
  return [];
}

export function mapTransactionsResponse(payload: unknown) {
  const root = asRecord(payload) ?? {};
  const data = asRecord(root.data) ?? {};
  const items = Array.isArray(data.items) ? data.items : [];
  const mappedItems = items.map((entry) => {
    const row = asRecord(entry) ?? {};
    return {
      id: toDisplayValue(row.id),
      status: toDisplayValue(row.status),
      externalId: toDisplayValue(row.external_id),
      transactionType: toDisplayValue(row.service_name || row.transaction_type),
      serviceCode: toDisplayValue(row.service_code),
      country: toDisplayValue(row.country),
      sender: toDisplayValue(row.sender),
      senderPhone: toDisplayValue(row.sender_phone),
      amount: toDisplayValue(row.amount),
      receiver: toDisplayValue(row.receiver),
      receiverPhone: toDisplayValue(row.receiver_phone),
      createdAt: toDisplayValue(row.created_at),
    };
  });

  const rawFilters = collectRawFilters(payload);
  const filters: Record<string, TransactionFilterOption[]> = {};
  const filterDefinitions: Array<{
    key: string;
    name: string;
    type: "control" | "options" | "date_range";
    options: TransactionFilterOption[];
    format?: string;
  }> = [];

  for (const entry of rawFilters) {
    const filter = asRecord(entry);
    if (!filter || typeof filter.key !== "string" || !filter.key) continue;
    const key = filter.key;
    const type =
      filter.type === "control" || filter.type === "date_range" ? filter.type : "options";
    const options = normalizeFilterOptions(filter.options ?? filter.list);
    if (type !== "date_range" && options.length > 0) {
      filters[key] = options;
    }
    filterDefinitions.push({
      key,
      name: toDisplayValue(filter.name) || key,
      type,
      options,
      format: typeof filter.format === "string" ? filter.format : undefined,
    });
  }

  return transactionsResponseSchema.parse({
    data: mappedItems,
    total: Number(data.total_items ?? 0),
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    filterDefinitions: filterDefinitions.length > 0 ? filterDefinitions : undefined,
  });
}

export function mapTransactionDetail(payload: unknown) {
  const root = asRecord(payload) ?? {};
  const data = root.data;
  const target = Array.isArray(data) ? asRecord(data[0]) : asRecord(data);
  const detail = target ?? {};

  const fxRate = asRecord(detail.fx_rate_object ?? detail.fx_rate);
  const tradeData = asRecord(detail.trade_data);

  return transactionDetailSchema.parse({
    id: toDisplayValue(detail.id),
    externalId: toDisplayValue(detail.external_id),
    transactionType: toDisplayValue(detail.service_name || detail.transaction_type),
    status: toDisplayValue(detail.status),
    country: toDisplayValue(detail.country),
    reversalStatus: toDisplayValue(detail.reversal_status),
    reason: toDisplayValue(detail.reason),
    amount: toDisplayValue(detail.amount),
    totalPaid: toDisplayValue(detail.total_paid),
    totalReceived: toDisplayValue(detail.total_received),
    totalFee: toDisplayValue(detail.total_fee),
    totalVoucherDiscount: toDisplayValue(detail.total_voucher_discount),
    yourpoinCashback: toDisplayValue(detail.yourpoin_cashback),
    hasVoucher: toDisplayValue(detail.has_voucher),
    sender: toDisplayValue(detail.sender),
    receiver: toDisplayValue(detail.receiver),
    initiator: toDisplayValue(detail.initiator),
    tradeNumber: toDisplayValue(detail.trade_number || tradeData?.trade_number),
    paymentNumber: toDisplayValue(detail.payment_number || tradeData?.payment_number),
    serviceId: toDisplayValue(detail.service_id),
    createdAt: toDisplayValue(detail.created_at),
    updatedAt: toDisplayValue(detail.updated_at),
    fxRate: toDisplayValue(detail.fx_rate || fxRate?.exchange_rate),
  });
}
