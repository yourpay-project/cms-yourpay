import { useModalStore as useGlobalModalStore } from "@/shared/lib/modal";
import { MODAL_DATA_ASSERTION_MAP } from "./modal-contract";
import type { ModalDataByKey, ModalKey } from "./modal-contract";

export function useModalStore() {
  const openUntyped = useGlobalModalStore.getState().open;
  const close = useGlobalModalStore.getState().close;
  const closeAll = useGlobalModalStore.getState().closeAll;

  function open<K extends ModalKey>(key: K): void;
  function open<K extends ModalKey>(key: K, data: ModalDataByKey<K>): void;
  function open<K extends ModalKey>(args: { key: K; data?: ModalDataByKey<K> }): void;
  function open<K extends ModalKey>(
    keyOrArgs: K | { key: K; data?: ModalDataByKey<K> },
    data?: ModalDataByKey<K>,
  ): void {
    const key = typeof keyOrArgs === "object" && keyOrArgs != null && "key" in keyOrArgs ? keyOrArgs.key : keyOrArgs;
    const resolvedData =
      typeof keyOrArgs === "object" && keyOrArgs != null && "key" in keyOrArgs ? keyOrArgs.data : data;

    if (resolvedData !== undefined) {
      const validate = MODAL_DATA_ASSERTION_MAP[key] as (d: unknown) => asserts d is ModalDataByKey<K>;
      validate(resolvedData as unknown);
      openUntyped({ key, data: resolvedData });
      return;
    }

    openUntyped(key);
  }

  return { open, close, closeAll };
}

