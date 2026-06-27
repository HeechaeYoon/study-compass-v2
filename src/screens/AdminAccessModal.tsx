import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { ClipboardCopy, Download, KeyRound, Link as LinkIcon, QrCode, X } from "lucide-react";
import {
  createAccessSessionToken,
  deriveAccessCodeSeed,
  generateAccessCode,
  getAccessExpiry,
  verifyMasterCode,
} from "../domain/accessCode";

type AdminAccessModalProps = {
  open: boolean;
  verifierDigest: string;
  baseCodeSeedDigest: string;
  onCreateSessionLink: (sessionId: string) => string;
  onClose: () => void;
  onCopyCode: (code: string) => Promise<boolean>;
  onCopyLink: (link: string) => Promise<boolean>;
  onCopyBundle: (text: string) => Promise<boolean>;
  onCopyQrImage: (blob: Blob, fallbackLink: string) => Promise<boolean>;
  onDownloadQrImage: (blob: Blob) => void;
};

type GeneratedAccessSession = {
  code: string;
  codeSeedDigest: string;
  issuedAt: Date;
  link: string;
  sessionId: string;
};

type QrRenderStatus = "idle" | "rendering" | "ready" | "error";

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
  baseCodeSeedDigest,
  onCreateSessionLink,
  onClose,
  onCopyCode,
  onCopyLink,
  onCopyBundle,
  onCopyQrImage,
  onDownloadQrImage,
}: AdminAccessModalProps) {
  const [masterCode, setMasterCode] = useState("");
  const [validDays, setValidDays] = useState("1");
  const [generatedSession, setGeneratedSession] = useState<GeneratedAccessSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrStatus, setQrStatus] = useState<QrRenderStatus>("idle");
  const dialogRef = useRef<HTMLElement | null>(null);
  const masterInputRef = useRef<HTMLInputElement | null>(null);
  const generatedCodeRef = useRef<HTMLParagraphElement | null>(null);
  const generatedLinkRef = useRef<HTMLParagraphElement | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const expiry = useMemo(
    () =>
      generatedSession
        ? getAccessExpiry(
            generatedSession.code,
            generatedSession.issuedAt,
            generatedSession.codeSeedDigest,
          )
        : null,
    [generatedSession],
  );

  const bundleText = useMemo(() => {
    if (!generatedSession) return "";
    return [
      `수업 링크: ${generatedSession.link}`,
      `접속 코드: ${generatedSession.code}`,
      expiry ? `유효 기간: ${formatDateTime(expiry)}까지` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [expiry, generatedSession]);

  useEffect(() => {
    if (!open) return;
    setMasterCode("");
    setValidDays("1");
    setGeneratedSession(null);
    setError(null);
    setQrError(null);
    setQrStatus("idle");
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

  useEffect(() => {
    if (!generatedSession || !qrCanvasRef.current) return;
    let cancelled = false;
    const canvas = qrCanvasRef.current;
    canvas.width = 0;
    canvas.height = 0;
    setQrError(null);
    setQrStatus("rendering");
    void QRCode.toCanvas(canvas, generatedSession.link, {
      color: {
        dark: "#20263A",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
      margin: 2,
      width: 168,
    }).then(() => {
      if (!cancelled) setQrStatus("ready");
    }).catch(() => {
      if (cancelled) return;
      setQrStatus("error");
      setQrError("QR 코드를 그리기 어려워요. 링크 복사를 이용해주세요.");
    });
    return () => {
      cancelled = true;
    };
  }, [generatedSession]);

  if (!open) return null;

  function handleGenerate(): void {
    const days = Number(validDays);
    if (!Number.isInteger(days) || days < 1 || days > 90) {
      setError("유효 기간은 1일부터 90일까지 입력할 수 있어요.");
      setGeneratedSession(null);
      return;
    }

    if (!verifyMasterCode(masterCode, verifierDigest)) {
      setError("마스터코드가 맞지 않아요.");
      setGeneratedSession(null);
      setMasterCode("");
      return;
    }

    const issuedAt = new Date();
    const sessionId = createAccessSessionToken();
    const codeSeedDigest = deriveAccessCodeSeed(baseCodeSeedDigest, sessionId);
    const code = generateAccessCode({
      issuedAt,
      validDays: days,
      codeSeedDigest,
    });
    setGeneratedSession({
      code,
      codeSeedDigest,
      issuedAt,
      link: onCreateSessionLink(sessionId),
      sessionId,
    });
    setQrStatus("rendering");
    setMasterCode("");
    setError(null);
    setQrError(null);
  }

  function selectElementContents(element: HTMLElement | null): void {
    const selection = window.getSelection();
    if (!selection || !element) return;
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  async function getQrBlob(): Promise<Blob | null> {
    const canvas = qrCanvasRef.current;
    if (!canvas) return null;
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  async function handleCopyQrImage(): Promise<void> {
    if (!generatedSession) return;
    if (qrStatus !== "ready") return;
    const blob = await getQrBlob();
    if (!blob) {
      await onCopyLink(generatedSession.link);
      return;
    }
    await onCopyQrImage(blob, generatedSession.link);
  }

  async function handleDownloadQrImage(): Promise<void> {
    if (qrStatus !== "ready") return;
    const blob = await getQrBlob();
    if (!blob) {
      setQrError("QR 이미지를 저장하기 어려워요. 링크 복사를 이용해주세요.");
      return;
    }
    onDownloadQrImage(blob);
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
          마스터코드를 확인한 뒤 새 수업 세션 링크와 6자리 접속 코드를 만듭니다.
          새 링크에서는 이전 코드와 저장된 접속 상태가 통하지 않아요.
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
            <span className="label">유효 기간 (일 단위)</span>
            <input
              className="input"
              aria-label="유효 기간 (일 단위)"
              value={validDays}
              onChange={(event) => setValidDays(event.target.value)}
              type="number"
              min={1}
              max={90}
              inputMode="numeric"
            />
            <small className="fieldHint">1~90일 사이로 입력하세요. 기본값은 1일입니다.</small>
          </label>
          {error ? (
            <p className="accessError" role="alert">
              {error}
            </p>
          ) : null}
          <button className="buttonPrimary" type="submit">
            새 수업 세션 만들기
          </button>
        </form>
        {generatedSession ? (
          <section className="generatedAccessCode" aria-label="생성된 수업 세션">
            <span className="label">수업 링크</span>
            <p
              id="generated-access-link"
              ref={generatedLinkRef}
              className="generatedAccessLink"
              tabIndex={0}
              onFocus={() => selectElementContents(generatedLinkRef.current)}
            >
              {generatedSession.link}
            </p>
            <span className="label">접속 코드</span>
            <p
              id="generated-access-code"
              ref={generatedCodeRef}
              tabIndex={0}
              onFocus={() => selectElementContents(generatedCodeRef.current)}
            >
              {generatedSession.code}
            </p>
            {expiry ? <small>{formatDateTime(expiry)}까지 유효</small> : null}
            <div className="accessQrPanel">
              <canvas
                ref={qrCanvasRef}
                className="accessQrCanvas"
                role="img"
                aria-label="세션 수업 링크 QR 코드"
              />
              <span>QR에는 수업 링크만 들어 있어요. 접속 코드는 따로 안내해주세요.</span>
            </div>
            {qrError ? (
              <p className="accessError" role="alert">
                {qrError}
              </p>
            ) : null}
            <div className="modalActions adminSessionActions">
              <button
                className="buttonSecondary"
                type="button"
                onClick={() => void onCopyLink(generatedSession.link)}
              >
                <LinkIcon aria-hidden="true" size={16} />
                링크 복사
              </button>
              <button
                className="buttonSecondary"
                type="button"
                onClick={() => selectElementContents(generatedCodeRef.current)}
              >
                전체 선택
              </button>
              <button
                className="buttonSecondary"
                type="button"
                onClick={() => void onCopyCode(generatedSession.code)}
              >
                <ClipboardCopy aria-hidden="true" size={16} />
                코드 복사
              </button>
              <button
                className="buttonSecondary"
                type="button"
                onClick={() => void onCopyBundle(bundleText)}
              >
                <ClipboardCopy aria-hidden="true" size={16} />
                링크+코드 복사
              </button>
              <button
                className="buttonPrimary"
                type="button"
                disabled={qrStatus !== "ready"}
                onClick={() => void handleCopyQrImage()}
              >
                <QrCode aria-hidden="true" size={16} />
                QR 이미지 복사
              </button>
              <button
                className="buttonSecondary"
                type="button"
                disabled={qrStatus !== "ready"}
                onClick={() => void handleDownloadQrImage()}
              >
                <Download aria-hidden="true" size={16} />
                QR PNG 저장
              </button>
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}
