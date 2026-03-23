import { useCallback, useMemo, useState } from "react";

import type { DocKey } from "./document-images-card-utils";
import { applyScaleDelta } from "./document-images-card-utils";

export interface DocumentImagesCardCompareItem {
  docKey: DocKey;
  title: string;
  imageUrl?: string;
  scale: number;
  rotation: number;
}

export interface UseDocumentImageTransformsResult {
  idScale: number;
  idRotation: number;
  selfieScale: number;
  selfieRotation: number;
  changeScale: (docKey: DocKey, delta: number) => void;
  rotate: (docKey: DocKey) => void;
  reset: (docKey: DocKey) => void;
}

/**
 * Manages per-document transform state (scale + rotation) for ID and selfie previews.
 */
export function useDocumentImageTransforms(): UseDocumentImageTransformsResult {
  const [idScale, setIdScale] = useState(1);
  const [idRotation, setIdRotation] = useState(0);
  const [selfieScale, setSelfieScale] = useState(1);
  const [selfieRotation, setSelfieRotation] = useState(0);

  const changeScale = useCallback((docKey: DocKey, delta: number) => {
    if (docKey === "id") {
      setIdScale((prev) => applyScaleDelta(prev, delta));
      return;
    }
    setSelfieScale((prev) => applyScaleDelta(prev, delta));
  }, []);

  const rotate = useCallback((docKey: DocKey) => {
    if (docKey === "id") {
      setIdRotation((prev) => prev + 90);
      return;
    }
    setSelfieRotation((prev) => prev + 90);
  }, []);

  const reset = useCallback((docKey: DocKey) => {
    if (docKey === "id") {
      setIdScale(1);
      setIdRotation(0);
      return;
    }
    setSelfieScale(1);
    setSelfieRotation(0);
  }, []);

  return {
    idScale,
    idRotation,
    selfieScale,
    selfieRotation,
    changeScale,
    rotate,
    reset,
  };
}

export interface UseDocumentImagesCardCompareItemsParams {
  idDocument?: { imageUrl?: string };
  selfieDocument?: { imageUrl?: string };
  idScale: number;
  idRotation: number;
  selfieScale: number;
  selfieRotation: number;
}

/**
 * Builds compare preview items for ID + selfie documents.
 */
export function useDocumentImagesCardCompareItems(
  params: UseDocumentImagesCardCompareItemsParams,
): DocumentImagesCardCompareItem[] {
  const { idDocument, selfieDocument, idScale, idRotation, selfieScale, selfieRotation } = params;

  return useMemo(
    () => [
      {
        docKey: "id",
        title: "ID Document",
        imageUrl: idDocument?.imageUrl,
        scale: idScale,
        rotation: idRotation,
      },
      {
        docKey: "selfie",
        title: "Selfie Photo",
        imageUrl: selfieDocument?.imageUrl,
        scale: selfieScale,
        rotation: selfieRotation,
      },
    ],
    [idDocument?.imageUrl, idRotation, idScale, selfieDocument?.imageUrl, selfieRotation, selfieScale],
  );
}

