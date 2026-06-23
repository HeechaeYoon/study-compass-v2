import { RotateCcw } from "lucide-react";

export function WideOnlyNotice() {
  return (
    <main className="wideOnlyNotice">
      <section className="wideOnlyCard">
        <RotateCcw aria-hidden="true" />
        <h1>화면이 너무 좁아요.</h1>
        <p>조금 더 넓은 화면이나 가로 모드에서 다시 열어주세요.</p>
      </section>
    </main>
  );
}
