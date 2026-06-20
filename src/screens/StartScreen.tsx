import {
  ArrowRight,
  Lock,
  Pencil,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import type { SavedResult } from "../infrastructure/storage";
import { Doodle } from "../components/Doodle";

type StartScreenProps = {
  nickname: string;
  heroImageSrc: string;
  savedResult: SavedResult | null;
  onNicknameChange: (value: string) => void;
  onStart: () => void;
  onLoadSaved: (value: SavedResult) => void;
  onRequestDelete: () => void;
};

export function StartScreen({
  nickname,
  heroImageSrc,
  savedResult,
  onNicknameChange,
  onStart,
  onLoadSaved,
  onRequestDelete,
}: StartScreenProps) {
  return (
    <main className="screenSurface startSurface" data-testid="screen-surface">
      <section className="startHero" aria-labelledby="start-heading">
        <div className="heroCopy">
          <h2 id="start-heading" className="displayTitle" data-screen-heading tabIndex={-1}>
            나의 공부 스타일을
            <br />
            탐색하는 시간
          </h2>
          <p className="heroBody">
            나에게 맞는 학습 방법을 알고 있으면
            <br />
            <span className="underlinedText">
              공부가 더 효율적이고 즐거워져요.
              <Doodle kind="underline-blue" className="textUnderline" />
            </span>
          </p>
          <p className="startSafetyNote">
            성격·심리 검사가 아니라, 지금의 답변을 바탕으로 학습 전략을 함께
            살펴보는 활동이에요.
          </p>
          <label className="field nicknameField">
            <span className="label">닉네임을 입력해 주세요 <em>(선택)</em></span>
            <span className="inputWithIcon">
              <input
                className="input"
                value={nickname}
                onChange={(event) => onNicknameChange(event.target.value)}
                placeholder="예) 지혜로운 독서가"
              />
              <Pencil aria-hidden="true" size={18} />
            </span>
          </label>
          <button className="buttonPrimary heroButton" type="button" onClick={onStart}>
            시작하기
            <ArrowRight aria-hidden="true" size={21} />
          </button>
          {savedResult ? (
            <div className="savedResultPanel" aria-label="저장된 결과">
              <div className="savedResultMeta">
                <strong>저장된 결과</strong>
                <time dateTime={savedResult.savedAt}>
                  {new Date(savedResult.savedAt).toLocaleDateString("ko-KR")}
                </time>
              </div>
              <div className="savedResultActions">
                <button
                  type="button"
                  className="textButton"
                  onClick={() => onLoadSaved(savedResult)}
                >
                  다시 보기
                </button>
                <button
                  type="button"
                  className="textButton dangerText"
                  onClick={onRequestDelete}
                >
                  삭제
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <figure className="startHeroArtwork">
          <img src={heroImageSrc} alt="" aria-hidden="true" />
          <figcaption className="srOnly">
            계획하고 실행하며 스스로 공부 방향을 찾아가는 학습 지도 이미지
          </figcaption>
        </figure>
      </section>
      <section className="privacyStrip" aria-label="개인정보 보호 안내">
        <span className="privacyLegend">개인정보 보호 안내</span>
        <div className="privacyItem">
          <UserRound aria-hidden="true" size={19} />
          <span>이름 대신 닉네임 사용 가능</span>
        </div>
        <div className="privacyItem">
          <ShieldCheck aria-hidden="true" size={19} />
          <span>응답은 외부로 전송하지 않음</span>
        </div>
        <div className="privacyItem">
          <Lock aria-hidden="true" size={19} />
          <span>결과는 이 기기에서만 확인</span>
        </div>
        <div className="privacyItem">
          <Trash2 aria-hidden="true" size={19} />
          <span>저장 결과는 언제든 삭제 가능</span>
        </div>
      </section>
    </main>
  );
}
