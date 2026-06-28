import { Doodle } from "./Doodle";

export function AppHeader() {
  return (
    <header className="appHeader">
      <div className="appHeaderInner">
        <div className="brandCluster">
          <div className="brandTitleWrap">
            <h1 className="brandTitle">나의 공부 스타일을 탐색하는 시간</h1>
            <Doodle kind="underline-yellow" className="brandUnderline" />
          </div>
          <div className="brandDivider" aria-hidden="true" />
          <p className="brandSubtitle">자기주도학습 전략 탐색</p>
        </div>
        <div className="headerMeta" aria-label="활동 정보">
          <Doodle kind="star" className="headerStar" />
          <span>총 16문항</span>
          <span className="metaDivider" aria-hidden="true" />
          <span>약 5~7분 소요</span>
        </div>
      </div>
    </header>
  );
}
