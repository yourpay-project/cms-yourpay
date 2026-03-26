import type { FC } from "react";
import { Settings2 } from "lucide-react";
import { getIdentityAccessBadgeClass, getIdentityAccessBadgeClassMap } from "../lib";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

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
    <div className="flex flex-wrap justify-end gap-2">
      {items.map((item, index) => {
        const badgeClassName = getIdentityAccessBadgeClass(badgeClassMap, item.code);
        const badgeNode = (
          <span className="truncate">{item.code}</span>
        );

        const contentNode = (
          <>
            {badgeNode}
            {item.isDefault ? <Settings2 className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
          </>
        );

        return item.isDefault ? (
          <Tooltip key={`${item.code}-${index}`}>
            <TooltipTrigger asChild>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${badgeClassName}`}
              >
                {contentNode}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">DEFAULT</TooltipContent>
          </Tooltip>
        ) : (
          <span
            key={`${item.code}-${index}`}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${badgeClassName}`}
          >
            {contentNode}
          </span>
        );
      })}
    </div>
  );
};
