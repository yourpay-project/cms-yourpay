import type { FC } from "react";

import { Card, CardContent } from "./card";

export interface DetailFieldItem {
  label: string;
  value: string | undefined;
}

export interface DetailSectionItem {
  title: string;
  fields: DetailFieldItem[];
  fullWidthFields?: DetailFieldItem[];
}

interface DetailSectionsCardProps {
  sections: DetailSectionItem[];
}

const DetailField: FC<DetailFieldItem> = ({ label, value }) => {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">{value || "-"}</div>
    </div>
  );
};

/**
 * Generic card renderer for detail page sections/fields.
 *
 * @param props Ordered section list with field rows.
 * @returns Card containing all detail sections.
 */
export const DetailSectionsCard: FC<DetailSectionsCardProps> = ({ sections }) => {
  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-6 p-4">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h3 className="text-sm font-semibold">{section.title}</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {section.fields.map((field) => (
                <DetailField key={`${section.title}-${field.label}`} label={field.label} value={field.value} />
              ))}
            </div>
            {section.fullWidthFields?.map((field) => (
              <DetailField key={`${section.title}-${field.label}`} label={field.label} value={field.value} />
            ))}
          </section>
        ))}
      </CardContent>
    </Card>
  );
};
