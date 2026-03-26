# Modal

Lightweight enterprise modal component built on top of Radix UI Dialog,
Tailwind CSS, and `framer-motion`.

## Public API

The slice is exposed via:

```ts
import { Modal } from "@/shared/ui/modal";
```

### `<Modal />` props

- **open** `boolean` – Controls visibility of the modal (controlled component).
- **onCancel?** `() => void` – Called when user attempts to close the modal
  (mask click, ESC, close icon, or Cancel button in default footer).
- **onOk?** `() => void` – Called when user clicks the primary OK button in the
  default footer.
- **confirmLoading?** `boolean` – Shows a loading spinner in the OK button and
  disables it.
- **title?** `ReactNode` – Header title content.
- **footer?** `ReactNode | null` – Custom footer content. Use `null` to hide
  the footer entirely. When `undefined`, a default Cancel / OK footer is
  rendered.
- **okText? / cancelText?** `string` – Labels for default footer buttons.
- **width?** `string | number` – Explicit width of the dialog (e.g. `"520px"`
  or `520`). For Tailwind width utilities, prefer using `className`.
- **centered?** `boolean` – Vertically centers the modal in the viewport.
- **className?** `string` – Extra Tailwind classes for the content container.

## Usage example

```tsx
const [open, setOpen] = useState(false);

<Modal
  open={open}
  onCancel={() => setOpen(false)}
  onOk={handleSubmit}
  confirmLoading={isSubmitting}
  title="Edit Country"
  centered
>
  {/* Body content */}
</Modal>;
```

## Implementation notes

- Uses Radix `Dialog.Root` for accessibility and focus trapping.
- `framer-motion` (`AnimatePresence` + `motion.div`) drives scale/opacity animations for the overlay and
  content — both GPU-composited and 60fps-safe in webview environments.
- Layout and spacing:
  - Header padding: `pt-5 px-6 pb-4`
  - Body padding: `px-6 py-2`
  - Footer padding: `pt-4 px-6 pb-5`
- The default footer (`ModalFooter`) lives in `ui/ModalFooter.tsx` and should
  remain UI‑only; any additional logic should be moved to hooks in this slice.

