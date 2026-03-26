import type { FC } from "react";
import { UserDetailCollapsibleCard, UserDetailFieldGrid } from "@/entities/user";
import type { UserDetailCardSection } from "./user-detail-page-view-model";

interface UserDetailCardsSectionProps {
  sections: UserDetailCardSection[];
}

/**
 * Renders grouped detail cards for customer detail page.
 *
 * @param props - {@link UserDetailCardsSectionProps}
 * @returns Stacked collapsible cards section.
 */
export const UserDetailCardsSection: FC<UserDetailCardsSectionProps> = ({ sections }) => {
  return (
    <div className="space-y-4 pt-2">
      {sections.map((section) => (
        <UserDetailCollapsibleCard
          key={section.title}
          title={section.title}
          className={section.className}
          headerClassName={section.headerClassName}
          contentClassName={section.contentClassName}
        >
          <UserDetailFieldGrid items={section.items} />
        </UserDetailCollapsibleCard>
      ))}
    </div>
  );
};

