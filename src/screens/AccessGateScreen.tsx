import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { Doodle } from "../components/Doodle";

type AccessGateScreenProps = {
  code: string;
  error: string | null;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
};

export function AccessGateScreen({
  code,
  error,
  onCodeChange,
  onSubmit,
}: AccessGateScreenProps) {
  return (
    <main className="screenSurface accessSurface" data-testid="screen-surface">
      <section className="accessCard">
        <div className="accessIcon" aria-hidden="true">
          <LockKeyhole size={30} />
        </div>
        <p className="resultEyebrow">Daisy 선생님 수업 입장</p>
        <h2 id="access-heading" className="displayTitle" data-screen-heading tabIndex={-1}>
          수업 접속 코드
        </h2>
        <Doodle kind="underline-blue" className="accessUnderline" />
        <p className="accessIntro">
          선생님이 안내한 접속 코드를 입력하면 자기주도학습 진단을 시작할 수
          있어요.
        </p>
        <form
          className="accessForm"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label className="field accessCodeField">
            <span className="label">수업 접속 코드</span>
            <span className="inputWithIcon">
              <input
                className="input"
                value={code}
                onChange={(event) => onCodeChange(event.target.value)}
                placeholder="예) QLTY9F"
                autoComplete="off"
                inputMode="text"
              />
              <KeyRound aria-hidden="true" size={18} />
            </span>
          </label>
          {error ? (
            <p className="accessError" role="alert">
              {error}
            </p>
          ) : null}
          <button className="buttonPrimary accessSubmit" type="submit">
            입장하기
          </button>
        </form>
        <div className="accessPrivacyNote">
          <ShieldCheck aria-hidden="true" size={18} />
          <span>
            접속 확인은 이 브라우저 안에서만 처리돼요. 답변과 결과는 서버로
            전송하지 않습니다.
          </span>
        </div>
      </section>
    </main>
  );
}
