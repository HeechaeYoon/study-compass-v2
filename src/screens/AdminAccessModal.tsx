import { useEffect, useMemo, useRef, useState } from "react";
import { ClipboardCopy, KeyRound, X } from "lucide-react";
import {
  generateAccessCode,
  getAccessExpiry,
  verifyMasterCode,
} from "../domain/accessCode";

type AdminAccessModalProps = {
  open: boolean;
  verifierDigest: string;
  onClose: () => void;
  onCopyCode: (code: string) => Promise<boolean>;
};

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

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

export function AdminAccessModal({
  open,
  verifierDigest,
  onClose,
  onCopyCode,
}: AdminAccessModalProps) {
  const [masterCode, setMasterCode] = useState("");
  const [validDays, setValidDays] = useState("7");
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const masterInputRef = useRef<HTMLInputElement | null>(null);
  const generatedCodeRef = useRef<HTMLParagraphElement | null>(null);

  const expiry = useMemo(
    () => (generatedCode ? getAccessExpiry(generatedCode) : null),
    [generatedCode],
  );

  useEffect(() => {
    if (!open) return;
    setMasterCode("");
    setGeneratedCode("");
    setError(null);
    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const inertTargets = Array.from(
      document.querySelectorAll<HTMLElement>(".wideApp, .wideOnlyNotice"),
    );

    inertTargets.forEach((target) => {
      target.setAttribute("inert", "");
      target.setAttribute("aria-hidden", "true");
    });

    const frame = window.requestAnimationFrame(() => {
      masterInputRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
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
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      inertTargets.forEach((target) => {
        target.removeAttribute("inert");
        target.removeAttribute("aria-hidden");
      });
      if (previousActiveElement?.isConnected) {
        previousActiveElement.focus({ preventScroll: true });
      }
    };
  }, [onClose, open]);

  if (!open) return null;

  function handleGenerate(): void {
    const days = Number(validDays);
    if (!Number.isInteger(days) || days < 1 || days > 90) {
      setError("유효 기간은 1일부터 90일까지 입력할 수 있어요.");
      setGeneratedCode("");
      return;
    }

    if (!verifyMasterCode(masterCode, verifierDigest)) {
      setError("마스터코드가 맞지 않아요.");
      setGeneratedCode("");
      setMasterCode("");
      return;
    }

    const code = generateAccessCode({
      issuedAt: new Date(),
      validDays: days,
      verifierDigest,
    });
    setGeneratedCode(code);
    setMasterCode("");
    setError(null);
  }

  function selectGeneratedCode(): void {
    const selection = window.getSelection();
    if (!selection || !generatedCodeRef.current) return;
    const range = document.createRange();
    range.selectNodeContents(generatedCodeRef.current);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  return (
    <div className="modalBackdrop" role="presentation">
      <section
        ref={dialogRef}
        className="modalDialog adminAccessDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-access-title"
        aria-describedby="admin-access-description"
      >
        <button
          className="adminCloseButton"
          type="button"
          aria-label="닫기"
          onClick={onClose}
        >
          <X aria-hidden="true" size={18} />
        </button>
        <h2 id="admin-access-title">관리자 접속 코드</h2>
        <p id="admin-access-description">
          마스터코드를 확인한 뒤 정해진 기간 동안 사용할 수 있는 수업 접속
          코드를 만듭니다.
        </p>
        <form
          className="adminAccessForm"
          onSubmit={(event) => {
            event.preventDefault();
            handleGenerate();
          }}
        >
          <label className="field">
            <span className="label">마스터코드</span>
            <span className="inputWithIcon">
              <input
                ref={masterInputRef}
                className="input"
                value={masterCode}
                onChange={(event) => setMasterCode(event.target.value)}
                type="password"
                autoComplete="off"
              />
              <KeyRound aria-hidden="true" size={18} />
            </span>
          </label>
          <label className="field">
            <span className="label">유효 기간</span>
            <input
              className="input"
              value={validDays}
              onChange={(event) => setValidDays(event.target.value)}
              type="number"
              min={1}
              max={90}
              inputMode="numeric"
            />
          </label>
          {error ? (
            <p className="accessError" role="alert">
              {error}
            </p>
          ) : null}
          <button className="buttonPrimary" type="submit">
            접속 코드 생성
          </button>
        </form>
        {generatedCode ? (
          <section className="generatedAccessCode" aria-label="생성된 접속 코드">
            <span className="label">생성된 코드</span>
            <p
              id="generated-access-code"
              ref={generatedCodeRef}
              tabIndex={0}
              onFocus={selectGeneratedCode}
            >
              {generatedCode}
            </p>
            {expiry ? <small>{formatDateTime(expiry)}까지 유효</small> : null}
            <div className="modalActions">
              <button
                className="buttonSecondary"
                type="button"
                onClick={selectGeneratedCode}
              >
                전체 선택
              </button>
              <button
                className="buttonPrimary"
                type="button"
                onClick={() => void onCopyCode(generatedCode)}
              >
                <ClipboardCopy aria-hidden="true" size={16} />
                코드 복사
              </button>
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}
