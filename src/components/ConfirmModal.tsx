import { useEffect, useRef, type ReactNode } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  onEscape?: () => void;
  children?: ReactNode;
};

const focusableSelector = [
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "a[href]",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  );
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onCancel,
  onConfirm,
  onEscape,
  children,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const inertTargets = Array.from(
      document.querySelectorAll<HTMLElement>(".wideApp, .wideOnlyNotice"),
    );

    inertTargets.forEach((target) => {
      target.setAttribute("inert", "");
      target.setAttribute("aria-hidden", "true");
    });
    confirmRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        (onEscape ?? onCancel)();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = getFocusableElements(dialogRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      inertTargets.forEach((target) => {
        target.removeAttribute("inert");
        target.removeAttribute("aria-hidden");
      });
      if (previousActiveElement?.isConnected) {
        previousActiveElement.focus({ preventScroll: true });
      }
    };
  }, [onCancel, onEscape, open]);

  if (!open) return null;

  return (
    <div className="modalBackdrop" role="presentation">
      <section
        ref={dialogRef}
        className="modalDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <h2 id="modal-title">{title}</h2>
        <p id="modal-description">{description}</p>
        {children}
        <div className="modalActions">
          <button className="buttonSecondary" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            className="buttonPrimary"
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
