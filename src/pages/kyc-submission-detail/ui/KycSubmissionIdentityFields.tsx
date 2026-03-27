import type { FC } from "react";

import { Button, Input, LabeledSelectField } from "@/shared/ui";
import { MessageCircle } from "lucide-react";
import { KYC_GENDER_OPTIONS, KYC_RELIGION_OPTIONS } from "../lib/kyc-verification-form-options";

import type { KycSubmissionIdentityFieldsProps } from "./KycSubmissionIdentityFields.type";
import { KycBirthDateField } from "./KycBirthDateField";

/**
 * Primary identity fields in the outer verification card.
 */
export const KycSubmissionIdentityFields: FC<KycSubmissionIdentityFieldsProps> = ({
  draft,
  setDraft,
  isEditable,
  whatsappHref,
}) => {
  const locked = !isEditable;
  const whatsappButtonNode = whatsappHref ? (
    <Button
      asChild
      type="button"
      variant="outline"
      className="h-12 shrink-0 gap-2 sm:w-auto sm:min-w-[8.5rem]"
    >
      <a href={whatsappHref} target="_blank" rel="noreferrer">
        <MessageCircle className="h-4 w-4 text-success" aria-hidden />
        WhatsApp
      </a>
    </Button>
  ) : null;

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-4 pt-1">
      <Input
        id="kyc-identity-fullname"
        size="sm"
        type="text"
        label="Name"
        allowClear={isEditable}
        readOnly={locked}
        value={draft.fullname ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, fullname: e.target.value }))}
      />

      <KycBirthDateField
        value={draft.birthDate}
        onChange={(next) => setDraft((prev) => ({ ...prev, birthDate: next }))}
        locked={locked}
        isEditable={isEditable}
      />

      <div className="flex flex-col gap-2 md:flex-row md:items-end">
        <div className="min-w-0 flex-1">
          <Input
            id="kyc-identity-mobile"
            size="sm"
            type="text"
            label="Mobile Number"
            allowClear={isEditable}
            readOnly={locked}
            value={draft.mobile ?? ""}
            onChange={(e) => setDraft((prev) => ({ ...prev, mobile: e.target.value }))}
          />
        </div>
        {whatsappButtonNode}
      </div>

      <LabeledSelectField
        id="kyc-identity-gender"
        label="Gender"
        size="sm"
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
        size="sm"
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

