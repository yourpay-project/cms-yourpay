import type { FC } from "react";
import { AlertTriangle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { postV1OperatorsCustomersByIdStatus } from "@/shared/api/generated";
import { ApiClientError } from "@/shared/api";
import { Button } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal";

interface BlockUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  isBlocked: boolean;
  onStatusUpdated: () => void;
}

/**
 * Confirmation modal for blocking/unblocking a customer.
 *
 * @param props - Component props.
 * @returns Status confirmation modal.
 */
const BlockUserDialog: FC<BlockUserDialogProps> = ({
  open,
  onOpenChange,
  customerId,
  isBlocked,
  onStatusUpdated,
}) => {
  const nextStatus = isBlocked ? "active" : "blocked";
  const title = isBlocked ? "Unblock Customer" : "Block Customer";
  const description = isBlocked
    ? "Are you sure you want to unblock this customer?"
    : "Are you sure you want to block user this customer?";

  const mutation = useMutation({
    mutationFn: async () =>
      postV1OperatorsCustomersByIdStatus(
        {
          status: nextStatus,
        },
        {
          pathParams: {
            customer_id: customerId,
          },
        }
      ),
    onSuccess: () => {
      toast.success(isBlocked ? "Customer unblocked successfully." : "Customer blocked successfully.");
      onOpenChange(false);
      onStatusUpdated();
    },
    onError: (error) => {
      const apiError = error instanceof ApiClientError ? error : null;
      const fallbackMessage = isBlocked ? "Failed to unblock customer." : "Failed to block customer.";
      toast.error(apiError?.message || fallbackMessage);
    },
  });

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={
        <div className="flex items-center justify-end gap-2 border-t border-border/60 bg-card px-6 pb-5 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Confirm
          </Button>
        </div>
      }
      title={null}
      centered
      width={440}
      className="max-h-[85vh]"
    >
      <div className="flex flex-col items-center gap-3 pb-1 pt-2 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Modal>
  );
};

export default BlockUserDialog;
