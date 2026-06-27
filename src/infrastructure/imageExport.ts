export type ExportImageResult =
  | { ok: true; filename: string }
  | { ok: false; error: "missing-element" | "unknown" };

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function sanitizeTypeName(value: string): string {
  return value.replace(/[^가-힣a-zA-Z0-9_-]/g, "");
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportSummaryCard(
  element: HTMLElement | null,
  typeName: string,
): Promise<ExportImageResult> {
  if (!element) return { ok: false, error: "missing-element" };

  try {
    await document.fonts.ready;
    const { toPng } = await import("html-to-image");
    const width = Math.ceil(element.getBoundingClientRect().width || element.offsetWidth);
    const height = Math.ceil(element.getBoundingClientRect().height || element.offsetHeight);
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#fffefc",
      width,
      height,
      canvasWidth: width,
      canvasHeight: height,
      style: {
        position: "relative",
        left: "0",
        top: "0",
        right: "auto",
        bottom: "auto",
        margin: "0",
        transform: "none",
        opacity: "1",
        visibility: "visible",
      },
    });
    const filename = `학습성향_${sanitizeTypeName(typeName)}_${formatDate(
      new Date(),
    )}.png`;
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { ok: true, filename };
  } catch {
    return { ok: false, error: "unknown" };
  }
}
