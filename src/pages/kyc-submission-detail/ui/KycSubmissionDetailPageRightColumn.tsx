import type { FC } from "react";

import { DocumentImagesCard } from "./DocumentImagesCardImpl";

import type { KycSubmissionDetailPageRightColumnProps } from "./KycSubmissionDetailPageRightColumn.type";

/**
 * Right column for `/kyc-submission/$id`.
 */
export const KycSubmissionDetailPageRightColumn: FC<KycSubmissionDetailPageRightColumnProps> = (props) => {
  return (
    <div className="w-full min-w-0 max-w-full shrink-0 overflow-x-hidden md:w-96 md:min-h-0 md:shrink-0 md:pl-1">
      <div className="flex flex-col gap-4">
        <DocumentImagesCard
          idDocument={props.idDocumentPreview}
          selfieDocument={props.selfieDocumentPreview}
          canCheckProgress={props.canCheckProgress}
          idDocumentUploadLabel={props.idDocumentUploadLabel}
          onIdDocumentFilesSelected={props.onIdDocumentFilesSelected}
          onSelfieFilesSelected={props.onSelfieFilesSelected}
        />
      </div>
    </div>
  );
};

