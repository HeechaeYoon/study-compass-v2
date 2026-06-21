import { RotateCcw } from "lucide-react";

export function WideOnlyNotice() {
  return (
    <main className="wideOnlyNotice">
      <section className="wideOnlyCard">
        <RotateCcw aria-hidden="true" />
        <h1>이 활동은 가로 화면에 맞춰져 있어요.</h1>
        <p>스마트폰이나 태블릿을 가로로 돌리거나 PC에서 다시 열어주세요.</p>
      </section>
    </main>
  );
}
