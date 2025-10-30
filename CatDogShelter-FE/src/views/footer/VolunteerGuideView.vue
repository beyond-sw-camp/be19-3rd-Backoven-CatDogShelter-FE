<!-- 자원봉사 안내 -->
<template>
  <section class="volunteer-guide-page">
    <div class="guide-inner">

      <header class="guide-header">
        <h1 class="page-title">봉사 도메인 안내</h1>
        <p class="page-desc">
          봉사 영역(모집글 · 신청 · 봉사시간 누적/공개 · 신고/제재)을 사용하는 방법과 정책을 정리한 안내입니다.
          서비스 이용 전 반드시 확인해주세요.
        </p>

        <nav class="pill-nav" aria-label="봉사안내 섹션 바로가기">
          <button class="pill" @click="scrollToSection('overview')">개요</button>
          <button class="pill" @click="scrollToSection('roles')">역할 · 권한</button>
          <button class="pill" @click="scrollToSection('recruit')">모집글</button>
          <button class="pill" @click="scrollToSection('apply')">신청</button>
          <button class="pill" @click="scrollToSection('time')">봉사시간</button>
          <button class="pill" @click="scrollToSection('report')">신고 · 제재</button>
          <button class="pill" @click="scrollToSection('data')">데이터 · 보관</button>
          <button class="pill" @click="scrollToSection('faq')">자주 묻는 질문</button>
        </nav>
      </header>

      <!-- ===== 1. 개요 ===== -->
      <section class="guide-block" id="overview">
        <h2 class="block-title">
          <span class="block-index">1.</span> 개요
        </h2>
        <div class="block-body">
          <p class="text-row">
            봉사 도메인은 보호소/단체가 필요한 봉사자를 모집하고,
            <strong>신청 · 참가 · 봉사시간 누적</strong>까지 한 흐름으로 관리하는 공간입니다.
          </p>
          <p class="text-row">
            봉사 활동은 단순 참여나 사진 인증만으로는 인정되지 않으며,
            <strong>사전에 등록된 모집글</strong>과 <strong>확정된 일정</strong>을 기준으로만 기록됩니다.
          </p>
          <p class="text-row">
            모든 활동 내역은 ‘댕냥히어로즈’ 랭킹(시간/누적횟수)으로 일부 공개될 수 있습니다.
            <!-- 공개를 원치 않는 경우, 마이페이지 &gt; 봉사 공개 설정에서 비공개로 전환할 수 있습니다. -->
          </p>
        </div>
      </section>

      <!-- ===== 2. 역할 · 권한 ===== -->
      <section class="guide-block" id="roles">
        <h2 class="block-title">
          <span class="block-index">2.</span> 역할 · 권한
        </h2>

        <div class="roles-table-wrapper">
          <table class="roles-table">
            <thead>
              <tr>
                <th scope="col" class="col-action">행동</th>
                <th scope="col">일반회원</th>
                <th scope="col">보호소 관리자</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" class="row-head">모집글 보기</th>
                <td class="cell-radio">○</td>
                <td class="cell-radio">○</td>
              </tr>
              <tr>
                <th scope="row" class="row-head">모집글 작성 / 수정 / 마감</th>
                <td class="cell-radio">-</td>
                <td class="cell-radio">○</td>
              </tr>
              <tr>
                <th scope="row" class="row-head">봉사 신청</th>
                <td class="cell-radio">○</td>
                <td class="cell-radio">-</td>
              </tr>
              <tr>
                <th scope="row" class="row-head">신청자 승인 / 거절</th>
                <td class="cell-radio">-</td>
                <td class="cell-radio">○</td>
              </tr>
              <tr>
                <th scope="row" class="row-head">봉사시간 확정 입력</th>
                <td class="cell-radio">-</td>
                <td class="cell-radio">○</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul class="note-list">
          <li>
            <strong>보호소 관리자</strong>는 실제 보호소(또는 단체) 운영 주체로 확인된 계정만 부여됩니다.
            허위 단체나 사칭은 서비스 이용이 제한됩니다.
          </li>
          <li>
            <strong>일반회원</strong>은 승인 후 봉사에 참여할 수 있으며, 연락 두절/무단 불참이 반복될 경우
            추후 신청이 제한될 수 있습니다.
          </li>
        </ul>
      </section>

      <!-- ===== 3. 모집글 (작성 · 수정 · 마감) ===== -->
      <section class="guide-block" id="recruit">
        <h2 class="block-title">
          <span class="block-index">3.</span> 모집글 (작성 · 수정 · 마감)
        </h2>

        <div class="two-col">
          <div class="col">
            <h3 class="subhead">작성 · 수정</h3>
            <ul class="bullet-list">
              <li>봉사 종류 (청소, 케어, 산책보조 등)</li>
              <li>날짜 / 시간</li>
              <li>장소 (보호소 위치, 집결 위치 등)</li>
              <li>준비물 / 복장 안내</li>
              <li>담당자 연락 방법</li>
              <li>활동 내용(어떤 동물을 어떻게 도울지 등)</li>
              <li>모집 인원수</li>
            </ul>
          </div>

          <div class="col">
            <h3 class="subhead">상태</h3>
            <ul class="bullet-list">
              <li>
                <strong>모집중</strong> : 아직 신청 가능 / 승인 대기 중인 인원이 존재
              </li>
              <li>
                <strong>마감</strong> : 인원 충원 또는 일정 종료. 더 이상 신청 불가
              </li>
              <li>
                <strong>취소</strong> : 보호소 측 사정 등으로 활동 자체가 취소됨
              </li>
            </ul>
          </div>
        </div>

        <p class="info-line">
          ※ 모집글은 보호소 관리자만 작성할 수 있으며, 작성자는 언제든 내용을 수정하거나
          일정이 완료되면 ‘마감’ 처리해야 합니다.
        </p>
      </section>

      <!-- ===== 4. 신청 ===== -->
      <section class="guide-block" id="apply">
        <h2 class="block-title">
          <span class="block-index">4.</span> 신청
        </h2>

        <div class="apply-steps">
          <ol class="step-list">
            <li>
              <strong>로그인</strong> 후 원하는 모집글 상세 페이지에서
              ‘신청하기’를 누릅니다.
            </li>
            <!-- <li>
              필수 정보(이름, 연락처, 가능 시간 등)를 제출합니다.
            </li> -->
            <!-- <li>
              보호소 관리자가 승인하면 ‘참여 확정’ 상태가 됩니다.
            </li> -->
          </ol>
        </div>

        <div class="caution-box">
          <p class="caution-title">무단 불참 / 당일 취소</p>
          <p class="caution-desc">
            승인 후 사전 연락 없이 불참하거나 반복적으로 당일 취소할 경우
            봉사 신청 제한, 랭킹 제외, 서비스 이용 제한 등의 조치가 적용될 수 있습니다.
            보호소 입장에서는 실제 동물 케어 인력이 부족해질 수 있으므로 꼭 지켜주세요.
          </p>
        </div>
      </section>

      <!-- ===== 5. 봉사시간 ===== -->
      <section class="guide-block" id="time">
        <h2 class="block-title">
          <span class="block-index">5.</span> 봉사시간
        </h2>

        <ul class="bullet-list">
          <li>
            봉사시간은 <strong>보호소 관리자가 활동 종료 후 직접 입력/확정</strong>합니다.
          </li>
          <li>
            확정된 시간은 ‘내 봉사 기록’ 및 ‘댕냥히어로즈’ 랭킹에 누적됩니다.
          </li>
          <li>
            시간 / 누적 포인트 / 활동 횟수 등은
            기본적으로 공개됩니다.<br>
            <!-- 사용자는 마이페이지에서
            <strong>비공개 전환</strong>할 수 있습니다. -->
          </li>
        </ul>

        <p class="info-line">
          ※ 허위로 시간을 부풀리거나 허위로 인증한 활동이 확인될 경우, 기록은 무효 처리되며
          계정 제재 대상이 됩니다.
        </p>
      </section>

      <!-- ===== 6. 신고 · 제재 ===== -->
      <section class="guide-block" id="report">
        <h2 class="block-title">
          <span class="block-index">6.</span> 신고 · 제재
        </h2>

        <h3 class="subhead">신고 대상</h3>
        <ul class="bullet-list">
          <li>부적절한 게시글 (허위 모집, 상업 광고, 명예훼손 등)</li>
          <li>위험하거나 불법적인 활동 강요</li>
          <li>개인 연락처를 빌미로 한 사적 요구 / 금전 요구</li>
          <li>반려동물에 대한 학대/위험 요소</li>
        </ul>

        <p class="info-line">
          ※ 신고는 ‘신고하기’ 버튼 또는 고객지원 문의를 통해 접수됩니다.
          악의적인 허위신고는 본인 계정 제재로 이어질 수 있습니다.
        </p>

        <!-- <div class="caution-box">
          <p class="caution-title">제재 기준 (예시)</p>
          <p class="caution-desc">
            반복적인 무단 불참, 허위모집, 금전 갈취 등은
            최대 서비스 이용 정지, 계정 삭제까지 이어질 수 있습니다.
          </p>
        </div> -->
      </section>

      <!-- ===== 7. 데이터 · 보관 ===== -->
      <section class="guide-block" id="data">
        <h2 class="block-title">
          <span class="block-index">7.</span> 데이터 · 보관
        </h2>

        <ul class="bullet-list">
          <li>
            신청 시 입력된 개인정보(연락처 등)는
            해당 봉사 일정 관리를 위한 용도로만 사용됩니다.
          </li>
          <li>
            일정이 종료된 뒤에도
            <strong>법적 의무(분쟁 대응, 안전사고 확인 등)</strong>를 위해
            일정 기간 보관될 수 있습니다.
          </li>
          <li>
            사용자는 본인의 봉사 기록 열람/정정을 요청할 수 있습니다.
            단, 이미 공공기관 제출 등에 사용된 공식 봉사확인 내역은
            소급 변경이 제한될 수 있습니다.
          </li>
        </ul>
      </section>

      <!-- ===== 8. 자주 묻는 질문 ===== -->
      <section class="guide-block" id="faq">
        <h2 class="block-title">
          <span class="block-index">8.</span> 자주 묻는 질문(FAQ)
        </h2>

        <div class="faq-item">
          <h3 class="faq-q">Q. 처음 봉사인데, 신청해도 되나요?</h3>
          <p class="faq-a">
             가능합니다.<!-- 다만 일부 일정은 경험자 우선일 수 있어요. -->
            <!-- 모집글에 ‘초보 가능’, ‘경험자 우선’ 여부가 표시됩니다. -->
          </p>
        </div>

        <div class="faq-item">
          <h3 class="faq-q">Q. 친구랑 같이 가도 되나요?</h3>
          <p class="faq-a">
            보호소별로 다릅니다. 동반 가능 여부가 모집글에 명시되며,
            별도 동반자 정보가 필요할 수도 있어요.
          </p>
        </div>

        <div class="faq-item">
          <h3 class="faq-q">Q. 봉사시간은 어느 기준으로 인정돼요?</h3>
          <p class="faq-a">
            실제로 활동한 시간만 인정됩니다. 단순 방문, 사진만 찍고
            바로 떠난 경우 등은 시간으로 계산되지 않습니다.
          </p>
        </div>

        <!-- <div class="faq-item">
          <h3 class="faq-q">Q. 랭킹에 얼굴/닉네임이 뜨는 게 싫어요.</h3>
          <p class="faq-a">
            마이페이지 &gt; 공개 설정에서 비공개로 전환하면
            본인 기록은 랭킹/프로필 영역에 노출되지 않습니다.
          </p>
        </div> -->
      </section>

    </div>
  </section>
</template>

<script>
export default {
  name: "VolunteerGuideView",
  methods: {
    scrollToSection(id) {
      const targetEl = document.getElementById(id);
      if (!targetEl) return;

      const rect = targetEl.getBoundingClientRect();

      const absoluteY = window.scrollY + rect.top;

      const offsetY = 80;

      window.scrollTo({
        top: absoluteY - offsetY,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style scoped>
.volunteer-guide-page {
  background-color: #f2eadf; 
  color: #2a1c10;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Noto Sans KR",
    system-ui, sans-serif;
  padding: 24px 16px 64px;
}

.guide-inner {
  max-width: 960px;
  margin: 0 auto;
}

/* ================== Header ================== */
.guide-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #2a1c10;
  margin-bottom: 8px;
}

.page-desc {
  font-size: 14px;
  line-height: 1.5;
  color: #4a3a2c;
  margin-bottom: 16px;
}

/* pill nav */
.pill-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.pill {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  color: #2a1c10;
  font-size: 13px;
  line-height: 1.2;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 500;
}

.guide-block {
  background-color: #fff7eb; /* 연한 카드 */
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  padding: 20px 20px 16px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
  margin-bottom: 16px;
}

.block-title {
  font-size: 16px;
  font-weight: 600;
  color: #2a1c10;
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
}

.block-index {
  font-weight: 700;
  margin-right: 4px;
  color: #2a1c10;
}

.block-body .text-row {
  font-size: 14px;
  line-height: 1.5;
  color: #2a1c10;
  margin-bottom: 8px;
}

strong {
  font-weight: 600;
  color: #2a1c10;
}

/* ================== roles table ================== */
.roles-table-wrapper {
  overflow-x: auto;
  margin-bottom: 12px;
}

.roles-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 480px;
}

.roles-table thead th {
  background-color: #f3e7d6;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  font-weight: 600;
  text-align: center;
  padding: 10px;
  color: #2a1c10;
  white-space: nowrap;
}

.roles-table thead th.col-action {
  text-align: left;
}

.roles-table tbody th.row-head {
  font-weight: 500;
  text-align: left;
  background-color: rgba(0, 0, 0, 0.02);
  color: #2a1c10;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.roles-table tbody td {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  color: #2a1c10;
}

.cell-radio {
  font-size: 14px;
  line-height: 1;
}

/* note list under table */
.note-list {
  font-size: 13px;
  line-height: 1.5;
  color: #4a3a2c;
  padding-left: 18px;
  list-style: disc;
  margin-bottom: 0;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 16px;
}

@media (max-width: 640px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}

.subhead {
  font-size: 14px;
  font-weight: 600;
  color: #2a1c10;
  margin-bottom: 8px;
}

.bullet-list {
  list-style: disc;
  padding-left: 18px;
  font-size: 14px;
  line-height: 1.5;
  color: #2a1c10;
  margin: 0;
}

.info-line {
  font-size: 13px;
  line-height: 1.5;
  color: #4a3a2c;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* ================== 신청 steps ================== */
.apply-steps {
  margin-bottom: 16px;
}

.step-list {
  counter-reset: step;
  list-style: none;
  padding-left: 0;
  margin: 0;
  font-size: 14px;
  color: #2a1c10;
}

.step-list li {
  position: relative;
  padding-left: 28px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.step-list li::before {
  counter-increment: step;
  content: counter(step) ".";
  position: absolute;
  left: 0;
  top: 0;
  font-weight: 600;
  color: #2a1c10;
}

.caution-box {
  background-color: #fff2e0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  padding: 12px 14px;
}

.caution-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #2a1c10;
}

.caution-desc {
  font-size: 13px;
  line-height: 1.5;
  color: #4a3a2c;
  margin: 0;
}

.faq-item {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 12px 14px;
  margin-bottom: 8px;
}

.faq-q {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #2a1c10;
}

.faq-a {
  font-size: 13px;
  line-height: 1.5;
  color: #4a3a2c;
  margin: 0;
}
</style>