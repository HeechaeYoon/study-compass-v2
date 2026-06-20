export type CopyResult =
  | { ok: true; method: "clipboard" | "execCommand" }
  | { ok: false; manualText: string };

function copyWithExecCommand(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

export async function copyText(text: string): Promise<CopyResult> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return { ok: true, method: "clipboard" };
    }
  } catch {
    // Fall through to execCommand fallback.
  }

  try {
    if (copyWithExecCommand(text)) {
      return { ok: true, method: "execCommand" };
    }
  } catch {
    // Manual fallback below.
  }

  return { ok: false, manualText: text };
}
