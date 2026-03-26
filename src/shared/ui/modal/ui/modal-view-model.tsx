import type { ReactNode } from "react";
import type { ModalProps } from "./Modal.type";
import { ModalFooter } from "./ModalFooter";

export interface ModalResolvedProps {
  contentWidth: string;
  wrapperAlignClassName: string;
  headerNode: ReactNode;
  footerNode: ReactNode;
}

/**
 * Resolves derived UI state for {@link Modal} to keep the component body small.
 *
 * @param props - {@link ModalProps}
 * @returns Derived layout values and section nodes for rendering.
 */
export function resolveModalProps(props: ModalProps): ModalResolvedProps {
  const {
    title,
    description,
    footer,
    okText,
    cancelText,
    confirmLoading,
    onCancel,
    onOk,
    width,
    centered,
  } = props;

  let contentWidth = "520px";
  if (typeof width === "number") {
    contentWidth = `${width}px`;
  } else if (typeof width === "string" && width) {
    contentWidth = width;
  }

  let wrapperAlignClassName = "items-start";
  if (centered) {
    wrapperAlignClassName = "items-center";
  }

  let headerNode: ReactNode = null;
  if (title != null || description != null) {
    headerNode = (
      <div className="pt-5 px-6 pb-4">
        {title != null ? <h2 className="text-base font-semibold">{title}</h2> : null}
        {description != null ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    );
  }

  let footerNode: ReactNode = (
    <ModalFooter
      okText={okText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={onOk}
    />
  );

  if (footer === null) {
    footerNode = null;
  } else if (footer !== undefined) {
    footerNode = <div className="px-6 pb-5 pt-4">{footer}</div>;
  }

  return { contentWidth, wrapperAlignClassName, headerNode, footerNode };
}

