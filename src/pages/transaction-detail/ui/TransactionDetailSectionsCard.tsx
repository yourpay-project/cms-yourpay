import type { FC } from "react";
import { DetailSectionsCard } from "@/shared/ui";
import type { TransactionDetailSectionItem } from "./transaction-detail-view-model";

interface TransactionDetailSectionsCardProps {
  sections: TransactionDetailSectionItem[];
}

/**
 * Card section that renders all transaction detail sections.
 *
 * @param props - {@link TransactionDetailSectionsCardProps}
 * @returns Transaction detail section card.
 */
export const TransactionDetailSectionsCard: FC<TransactionDetailSectionsCardProps> = ({
  sections,
}) => {
  return <DetailSectionsCard sections={sections} />;
};

