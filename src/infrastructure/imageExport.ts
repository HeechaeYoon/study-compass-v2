export type ExportImageResult =
  | { ok: true; filename: string }
  | { ok: false; error: "missing-element" | "unknown" };

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function sanitizeTypeName(value: string): string {
  return value.replace(/[^가-힣a-zA-Z0-9_-]/g, "");
}

export async function exportSummaryCard(
  element: HTMLElement | null,
  typeName: string,
): Promise<ExportImageResult> {
  if (!element) return { ok: false, error: "missing-element" };

  try {
    await document.fonts.ready;
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#fffefc",
    });
    const filename = `학습성향_${sanitizeTypeName(typeName)}_${formatDate(
      new Date(),
    )}.png`;
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return { ok: true, filename };
  } catch {
    return { ok: false, error: "unknown" };
  }
}
