<!-- 커뮤니티 가이드 -->
<template>

 <div class="guide-page">
    <main class="content-wrap">
      <section class="page-head">
        <h1 class="page-title">댕냥쉼터 커뮤니티 가이드</h1>

        <p class="page-desc">
          댕냥쉼터는 유기동물 보호와 건강한 반려문화를 위한 커뮤니티입니다.
          모든 이용자는 아래 가이드를 존중하고 따르는 것을 전제로 서비스 이용이 가능합니다.
        </p>

        <!-- 상단 탭 (스크롤 이동 전용 버튼들) -->
        <nav class="guide-nav">
          <button class="tab-pill" @click="goTo('section-principle')">기본 원칙</button>
          <button class="tab-pill" @click="goTo('section-board')">게시판 규칙</button>
          <button class="tab-pill" @click="goTo('section-privacy')">명예 · 사생활</button>
          <button class="tab-pill" @click="goTo('section-adopt-volunteer')">입양 · 봉사 유의</button>
          <button class="tab-pill" @click="goTo('section-report')">신고 / 제재</button>
          <button class="tab-pill" @click="goTo('section-inquiry')">문의 · 이의</button>
        </nav>
      </section>

      <section class="guide-section">

        <!-- 1. 기본 이용 원칙 -->
        <article class="guide-card" id="section-principle">
          <div class="guide-card-inner">
            <h2 class="guide-card-title">
              <span class="guide-card-number">1.</span>
              기본 이용 원칙
            </h2>

            <ul class="guide-list">
              <li>
                이 커뮤니티의 최우선 가치는
                <strong>생명 존중과 책임 있는 보호</strong>입니다.
              </li>
              <li>
                커뮤니티의 목적은
                <strong>입양</strong>,
                <strong>실종 동물 찾기</strong>,
                <strong>목격 제보</strong>,
                <strong>봉사 / 후원 참여</strong>,
                <strong>보호소 소식 공유</strong>,
                <strong>정서적 지지</strong>입니다.
              </li>
              <li>
                상업적 이익만을 위한 활동이나,
                동물 학대/방임을 정당화하는 표현은 허용되지 않습니다.
              </li>
              <li>
                이용자 간의 존중을 기반으로 하며,
                특정 보호소·단체·개인에 대한 근거 없는 비난/폄하는 금지됩니다.
              </li>
              <li>
                아래 가이드를 위반할 경우 게시물 수정, 비공개 처리, 이용 제한 등의 조치가
                사전 경고 없이 적용될 수 있습니다.
              </li>
            </ul>
          </div>
        </article>

        <!-- 2. 게시글 및 댓글 작성 규칙 -->
        <article class="guide-card" id="section-board">
          <div class="guide-card-inner grid-2col">
            <div class="guide-col">
              <h2 class="guide-card-title">
                <span class="guide-card-number">2.</span>
                게시글 · 댓글 작성 규칙
              </h2>

              <h3 class="subhead">허용되는 콘텐츠 예시</h3>
              <ul class="guide-list">
                <li>입양 후기, 구조 과정 기록, 입양 스토리 공유</li>
                <li>보호소 요청 사항 (사료/담요 등 물품 후원 안내)</li>
                <li>봉사 모집, 봉사 다녀온 후기, 봉사 수칙 안내</li>
                <li>실종/목격 제보 (시간, 위치, 특징 등 구체 정보 포함)</li>
                <li>책임 있는 반려 문화에 대한 논의, 정보성 조언</li>
              </ul>

              <h3 class="subhead">작성 시 권장 사항</h3>
              <ul class="guide-list">
                <li>
                  사실 여부가 확인된 정보만 올려주세요.
                  “들은 얘기인데…”식 추측성 내용은 분쟁을 유발할 수 있습니다.
                </li>
                <li>
                  상황 설명 시 시간, 장소, 연락 수단 등
                  <strong>확인 가능한 정보</strong>를 포함하면 도움이 됩니다.
                </li>
                <li>
                  사진이나 영상 업로드 시
                  <strong>동물이 스트레스를 받는 장면, 상처 등 과도하게 자극적인 장면은
                  최소화</strong>해주세요.
                </li>
              </ul>
            </div>

            <div class="guide-col">
              <h3 class="subhead bad">금지되는 콘텐츠</h3>
              <ul class="guide-list">
                <li>욕설, 조롱, 모욕, 혐오/차별 표현</li>
                <li>특정인/기관의 실명 공개를 통한 비난 유도 또는 인신 공격</li>
                <li>사실 확인 없이 “학대범이다”, “사기단체다” 등 단정적으로 적시</li>
                <li>불법 분양/판매, 교배 거래(분양비 거래 포함) 유도</li>
                <li>무단 광고, 영리 목적 홍보, 후원 계좌 무단 모집</li>
                <li>반려동물·사람에게 충격을 줄 만한 선정적/폭력적 이미지</li>
                <li>타 서비스, 사이트로 유도하는 외부 모집 링크/홍보성 DM 유도</li>
              </ul>

              <p class="note-text">
                위 금지 항목이 반복되거나 악의성이 명확한 경우,
                해당 계정은 별도 고지 없이 차단될 수 있습니다.
              </p>
            </div>
          </div>
        </article>

        <!-- 3. 명예 · 사생활 보호 -->
        <article class="guide-card" id="section-privacy">
          <div class="guide-card-inner">
            <h2 class="guide-card-title">
              <span class="guide-card-number">3.</span>
              명예 · 사생활 보호
            </h2>

            <ul class="guide-list">
              <li>
                개인(일반 사용자, 보호소 관계자, 목격자 포함)의
                <strong>실명, 전화번호, 집 주소, 얼굴 식별 가능한 사진</strong> 등
                민감 정보는 공개하지 않습니다.
              </li>
              <li>
                “저 사람 때문에 잃어버렸다”, “저 보호소 믿지 마세요” 식의
                비난/불매 유도 글은
                <strong>명예훼손</strong>으로 판단될 수 있습니다.
              </li>
              <li>
                신고, 제보, 목격 내용은
                사실 전달 목적에서 필요한 범위까지만 공개해주세요.
                (예: “00동 ○○공원 근처에서 갈색 믹스견 목격” 정도)
              </li>
              <li>
                타인의 동의 없이 촬영된 CCTV 화면, 집 내부 사진 등은 게시를 금지합니다.
              </li>
              <li>
                요청 시 관리자는 사생활 침해 우려가 있는 게시물/댓글을
                임시 비공개하거나 편집할 수 있습니다.
              </li>
            </ul>

            <p class="note-text">
              ※ 실제 법적 문제(명예훼손, 초상권, 개인정보 무단 수집/공유 등)로 이어질 수
              있다고 판단되면 사전 경고 없이 해당 게시물은 숨김 처리될 수 있습니다.
            </p>
          </div>
        </article>

        <!-- 4. 입양 · 봉사 게시판 유의사항 -->
        <article class="guide-card" id="section-adopt-volunteer">
          <div class="guide-card-inner">
            <h2 class="guide-card-title">
              <span class="guide-card-number">4.</span>
              입양 · 봉사 게시판 유의사항
            </h2>

            <h3 class="subhead">입양 관련</h3>
            <ul class="guide-list">
              <li>
                입양 글은 실제 보호 중인 동물에 한해 등록 가능합니다.
                단순 판매 목적, 교배 목적, 상업 브리딩은 금지됩니다.
              </li>
              <li>
                “무료 분양 / 책임비” 등 금전이 오가는 경우,
                불법 거래 및 사기성 게시물로 판단될 수 있어
                <strong>게시 제한 또는 즉시 삭제</strong>될 수 있습니다.
              </li>
              <li>
                입양 과정에서의 개별 연락(전화, DM 등) 이후 발생하는 금전/책임 문제는
                이용자 본인의 책임입니다. 플랫폼은 중개하지 않습니다.
              </li>
            </ul>

            <h3 class="subhead">봉사 · 후원 관련</h3>
            <ul class="guide-list">
              <li>
                봉사 모집, 방문 안내 등은
                <strong>실제 단체/보호소</strong>가 확인 가능한 정보(위치, 일정 등)를
                포함해야 합니다.
              </li>
              <li>
                개인 계좌로 후원금을 받는 형태의 글은
                사기 방지를 위해 제한될 수 있습니다.
                가능하면 <strong>단체 공개 계좌나 공식 모금 경로</strong>를 사용해주세요.
              </li>
              <li>
                봉사 인증(출석 시간 등)을 통한 “댕냥히어로즈” 누적 활동량은
                커뮤니티 내 명예 시스템으로 활용될 수 있습니다.
                허위 참여 인증은 제재 사유가 됩니다.
              </li>
            </ul>

            <p class="note-text">
              ※ 이 게시판은 실제 생명과 금전이 연결되는 민감 영역입니다.
              관리자는 위험 요소가 있다고 판단되면 임의로 글을 숨길 수 있습니다.
            </p>
          </div>
        </article>

        <!-- 5. 신고 / 제재 -->
        <article class="guide-card" id="section-report">
          <div class="guide-card-inner">
            <h2 class="guide-card-title">
              <span class="guide-card-number">5.</span>
              신고 / 제재
            </h2>

            <h3 class="subhead">신고가 가능한 경우</h3>
            <ul class="guide-list">
              <li>명백한 허위 정보 유포 / 타인 사칭</li>
              <li>욕설, 혐오 발언, 특정인 공격 유도</li>
              <li>사기성 후원 요청 / 금전 요구</li>
              <li>반려동물 학대 조장, 자극적 학대 사진 유포</li>
              <li>개인정보(연락처, 주소 등) 무단 공개</li>
            </ul>

            <h3 class="subhead">제재 방식</h3>
            <ul class="guide-list">
              <li>게시물/댓글 임시 블라인드 처리</li>
              <li>작성 제한(일시적 글쓰기 금지)</li>
              <li>계정 정지 또는 영구 이용 중단</li>
            </ul>

            <p class="note-text">
              커뮤니티의 안전을 위해 명백한 위반 사항은
              별도 안내 없이 즉시 조치될 수 있습니다.
              반복 위반 계정은 재가입이 제한될 수 있습니다.
            </p>
          </div>
        </article>

        <!-- 6. 문의 · 이의 제기 -->
        <article class="guide-card" id="section-inquiry">
          <div class="guide-card-inner">
            <h2 class="guide-card-title">
              <span class="guide-card-number">6.</span>
              문의 · 이의 제기
            </h2>

            <ul class="guide-list">
              <li>
                내 게시물이 숨김/삭제되었을 때 사유가 궁금하다면
                “문의하기”를 통해 관리자에게 확인 요청할 수 있습니다.
              </li>
              <li>
                본인 명예나 개인정보 관련해서 긴급하게 내려야 할 게시물이 있다면
                가능한 한 <strong>구체적 URL / 스크린샷 / 사유</strong>를 함께 보내주세요.
              </li>
              <li>
                제재(댓글 차단, 글쓰기 제한 등)에 대해 이의가 있을 경우
                동일한 계정으로 1회 재검토 요청이 가능합니다.
              </li>
              <li>
                단, 무분별한 반복 항의, 관리자를 향한 욕설/협박성 메시지는
                추가 제재 사유가 됩니다.
              </li>
            </ul>

            <p class="note-text">
              댕냥쉼터는 모든 사용자가 안전하게 경험할 수 있는 커뮤니티를 지향합니다.
              관리자의 개입은 사용자 간 분쟁에서 중립을 지키기 위한 최소한의 조치입니다.
            </p>
          </div>
        </article>

      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "CommunityGuideView",
  methods: {
    goTo(targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
  },
};
</script>
<style scoped>
/* ===== 컬러 토큰 ===== */
:root {
  --bg-page: #efe3cf;
  --bg-card: #fffaf3;
  --text-main: #2a1c10;
  --text-dim: #5c4a36;
  --line-soft: rgba(0, 0, 0, 0.06);
  --badge-bg: #ffffff;
  --badge-border: #c4b29d;
  --radius-card: 8px;
  --radius-pill: 999px;
  --radius-soft: 6px;
  --shadow-card: 0 4px 8px rgba(0,0,0,0.03);
  --accent-bad: #8a2a0d;
  font-family: "Pretendard Variable", "Pretendard", system-ui, -apple-system,
    BlinkMacSystemFont, "Noto Sans KR", sans-serif;
}

/* 페이지 */
.guide-page {
  background-color: var(--bg-page);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: var(--text-main);
}

/* 본문 래퍼 */
.content-wrap {
  max-width: 1280px;
  width: 100%;
  margin: 32px auto 64px;
  padding: 0 16px 40px;
  flex: 1;
}

/* 헤더 영역 */
.page-head {
  margin-bottom: 24px;
  font-family: "Pretendard Variable", "Noto Sans KR", system-ui, sans-serif;
}
.page-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}
.page-desc {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-dim);
  margin-bottom: 16px;
}

/* 탭 */
.guide-tabs {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0;
  margin: 0;
  font-size: 13px;
}
.tab {
  background-color: var(--badge-bg);
  border: 1px solid var(--badge-border);
  border-radius: var(--radius-pill);
  padding: 6px 12px;
  line-height: 1.2;
  color: var(--text-main);
  cursor: default;
  font-weight: 500;
  user-select: none;
}
.tab.active {
  background-color: #fff8e7;
  border-color: #b4904b;
  font-weight: 600;
}

/* 섹션 전체 */
.guide-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: "Pretendard Variable", "Noto Sans KR", system-ui, sans-serif;
}

/* 카드 */
.guide-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-card);
  border: 1px solid var(--line-soft);
  box-shadow: var(--shadow-card);
  padding: 20px 24px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-main);
}
.guide-card-inner {
  width: 100%;
}

/* 2열 그리드 카드 */
.grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 768px) {
  .grid-2col {
    grid-template-columns: 1fr;
  }
}

/* 카드 타이틀 */
.guide-card-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  row-gap: 4px;
  margin-bottom: 12px;
}
.guide-card-number {
  font-weight: 700;
  margin-right: 4px;
  color: var(--text-main);
}

/* 소제목 */
.subhead {
  font-size: 14px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 8px;
  color: var(--text-main);
}
.subhead.bad {
  color: var(--accent-bad);
}

/* 리스트 */
.guide-list {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  color: var(--text-main);
}
.guide-list li + li {
  margin-top: 4px;
}

/* 부가 메모 텍스트 */
.note-text {
  background-color: rgba(255, 255, 255, 0.4);
width:80%;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: var(--radius-soft);
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-main);
  padding: 10px 12px;
  margin-top: 16px;
  word-break: keep-all;
}
.guide-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
  justify-content: center;
}

.tab-pill {
  background-color: #fff;
  border: 1.5px solid #c4b29d;
  border-radius: 30px;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #2b2219;
  cursor: pointer;
  transition: all 0.18s ease;
}

.tab-pill:hover {
  background-color: #f8f1e5;
  border-color: #b89b6b;
}

.guide-card {
  padding: 40px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
</style>
