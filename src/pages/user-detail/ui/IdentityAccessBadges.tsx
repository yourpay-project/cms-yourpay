import type { FC } from "react";
import { getIdentityAccessBadgeClass, getIdentityAccessBadgeClassMap } from "../lib";

/**
 * Single identity access badge item.
 */
export interface IdentityAccessBadgeItem {
  code: string;
  isDefault: boolean;
}

interface IdentityAccessBadgesProps {
  items: IdentityAccessBadgeItem[];
}

/**
 * Renders identity access values as color-varied badges.
 *
 * @param props - Component props.
 * @returns Badge list or "-" when empty.
 */
export const IdentityAccessBadges: FC<IdentityAccessBadgesProps> = ({ items }) => {
  if (items.length === 0) {
    return <span>-</span>;
  }

  const badgeClassMap = getIdentityAccessBadgeClassMap(items.map((item) => item.code));

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => {
        const badgeClassName = getIdentityAccessBadgeClass(badgeClassMap, item.code);
        return (
          <span
            key={`${item.code}-${index}`}
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClassName}`}
          >
            {item.code}
            {item.isDefault ? " (Default)" : ""}
          </span>
        );
      })}
    </div>
  );
};
