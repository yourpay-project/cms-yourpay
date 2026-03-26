import type { FC } from "react";
import { Card, CardContent } from "@/shared/ui";
import type { TransactionDetailSectionItem } from "./transaction-detail-view-model";

interface TransactionDetailSectionsCardProps {
  sections: TransactionDetailSectionItem[];
}

interface TransactionDetailFieldProps {
  label: string;
  value: string | undefined;
}

const TransactionDetailField: FC<TransactionDetailFieldProps> = ({ label, value }) => {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">{value || "-"}</div>
    </div>
  );
};

/**
 * Card section that renders all transaction detail sections.
 *
 * @param props - {@link TransactionDetailSectionsCardProps}
 * @returns Transaction detail section card.
 */
export const TransactionDetailSectionsCard: FC<TransactionDetailSectionsCardProps> = ({
  sections,
}) => {
  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-6 p-4">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h3 className="text-sm font-semibold">{section.title}</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {section.fields.map((field) => (
                <TransactionDetailField key={`${section.title}-${field.label}`} label={field.label} value={field.value} />
              ))}
            </div>
            {section.fullWidthFields?.map((field) => (
              <TransactionDetailField key={`${section.title}-${field.label}`} label={field.label} value={field.value} />
            ))}
          </section>
        ))}
      </CardContent>
    </Card>
  );
};

