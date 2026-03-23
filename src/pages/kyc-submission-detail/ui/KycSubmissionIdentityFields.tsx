import type { FC } from "react";
import { useMemo, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar as CalendarIcon, MessageCircle, X } from "lucide-react";

import {
  Button,
  Calendar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
  LabeledSelectField,
} from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

import { KYC_GENDER_OPTIONS, KYC_RELIGION_OPTIONS } from "../lib/kyc-verification-form-options";
import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

export interface KycSubmissionIdentityFieldsProps {
  draft: KycLeftEditDraft;
  setDraft: (next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft)) => void;
  isEditable: boolean;
  whatsappHref?: string;
}

function parseStoredDate(iso?: string): Date | undefined {
  if (!iso?.trim()) return undefined;
  const d = parseISO(iso.trim().slice(0, 10));
  return isValid(d) ? d : undefined;
}

/**
 * Birth date using `Calendar` + `DropdownMenu` (same stack as KYC date range in README), Lucide calendar icon with `text-muted-foreground` to match other trailing icons.
 */
const BirthDateField: FC<{
  value?: string;
  onChange: (next: string | undefined) => void;
  locked: boolean;
  isEditable: boolean;
}> = ({ value, onChange, locked, isEditable }) => {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => parseStoredDate(value), [value]);
  const display = useMemo(() => {
    if (!selected) return "";
    return format(selected, "dd/MM/yyyy");
  }, [selected]);
  const hasValue = Boolean(display);

  if (locked) {
    return (
      <Input
        id="kyc-identity-birth-date"
        size="md"
        type="text"
        label="Birth Date"
        readOnly
        allowClear={false}
        value={display || "—"}
      />
    );
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">Birth Date</span>
      <div
        className={cn(
          "flex w-full min-w-0 max-w-full overflow-hidden rounded-md border border-input bg-background",
          !isEditable && "opacity-60",
        )}
      >
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              id="kyc-identity-birth-date"
              type="button"
              disabled={!isEditable}
              className="flex h-12 min-w-0 flex-1 items-center gap-2 px-3 text-left text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed"
              aria-expanded={open}
              aria-haspopup="dialog"
            >
              <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className={cn("truncate", !display && "text-muted-foreground")}>
                {display || "Select date"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-auto p-2" onCloseAutoFocus={(e) => e.preventDefault()}>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(d) => {
                if (d) {
                  onChange(format(d, "yyyy-MM-dd"));
                } else {
                  onChange(undefined);
                }
                setOpen(false);
              }}
              defaultMonth={selected ?? new Date()}
              captionLayout="dropdown"
              className="w-full [--cell-size:1.75rem] text-sm"
            />
          </DropdownMenuContent>
        </DropdownMenu>
        {isEditable && hasValue ? (
          <button
            type="button"
            className="flex h-12 w-11 shrink-0 items-center justify-center border-l border-input bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            onClick={() => onChange(undefined)}
            aria-label="Clear birth date"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Primary identity fields in the outer verification card — standard {@link Input} / {@link SelectDropdown} / README Calendar pattern.
 */
export const KycSubmissionIdentityFields: FC<KycSubmissionIdentityFieldsProps> = ({
  draft,
  setDraft,
  isEditable,
  whatsappHref,
}) => {
  const locked = !isEditable;

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-4 pt-1">
      <Input
        id="kyc-identity-fullname"
        size="md"
        type="text"
        label="Name"
        allowClear={isEditable}
        readOnly={locked}
        value={draft.fullname ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, fullname: e.target.value }))}
      />
      <BirthDateField
        value={draft.birthDate}
        onChange={(next) => setDraft((prev) => ({ ...prev, birthDate: next }))}
        locked={locked}
        isEditable={isEditable}
      />

      <div className="flex flex-col gap-2 md:flex-row md:items-end">
        <div className="min-w-0 flex-1">
          <Input
            id="kyc-identity-mobile"
            size="md"
            type="text"
            label="Mobile Number"
            allowClear={isEditable}
            readOnly={locked}
            value={draft.mobile ?? ""}
            onChange={(e) => setDraft((prev) => ({ ...prev, mobile: e.target.value }))}
          />
        </div>
        {whatsappHref ? (
          <Button asChild type="button" variant="outline" className="h-12 shrink-0 gap-2 sm:w-auto sm:min-w-[8.5rem]">
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4 text-success" aria-hidden />
              WhatsApp
            </a>
          </Button>
        ) : null}
      </div>

      <LabeledSelectField
        id="kyc-identity-gender"
        label="Gender"
        value={draft.gender ?? ""}
        onChange={(value) => setDraft((prev) => ({ ...prev, gender: value || undefined }))}
        options={KYC_GENDER_OPTIONS}
        placeholder="Select an option"
        disabled={locked}
        allowClear={isEditable}
      />

      <LabeledSelectField
        id="kyc-identity-religion"
        label="Religion"
        value={draft.religion ?? ""}
        onChange={(value) => setDraft((prev) => ({ ...prev, religion: value || undefined }))}
        options={KYC_RELIGION_OPTIONS}
        placeholder="Select an option"
        disabled={locked}
        searchable
        allowClear={isEditable}
      />
    </div>
  );
};
