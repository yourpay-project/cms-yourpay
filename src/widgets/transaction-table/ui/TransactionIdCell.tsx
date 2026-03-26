import type { FC } from "react";
import { copyTransactionId, valueOrDash } from "./transaction-table-columns-view-model";

interface TransactionIdCellProps {
  id: string | undefined;
}

/**
 * Transaction ID table cell with copy-on-double-click affordance.
 *
 * @param props - {@link TransactionIdCellProps}
 * @returns Transaction id cell node.
 */
export const TransactionIdCell: FC<TransactionIdCellProps> = ({ id }) => {
  const resolvedId = valueOrDash(id);
  if (resolvedId === "-") {
    return <span className="font-medium">-</span>;
  }

  return (
    <button
      type="button"
      className="max-w-full truncate text-left font-medium hover:underline"
      onDoubleClick={() => copyTransactionId(resolvedId)}
      title="Double click to copy Transaction ID"
      aria-label={`Transaction ID ${resolvedId}. Double click to copy.`}
    >
      {resolvedId}
    </button>
  );
};

