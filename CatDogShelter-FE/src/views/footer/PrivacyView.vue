<!-- 개인정보 처리방침 -->
<template>
  <main class="policy-page">
    <div class="policy-inner">
      <header class="policy-header">
        <h1 class="policy-title">개인정보 처리방침</h1>
        <p class="policy-intro">
          댕냥쉼터(이하 “서비스”)는 이용자의 개인정보를 소중히 보호하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.<br />
          본 개인정보 처리방침은 당 서비스가 수집하는 개인정보의 항목, 이용 목적, 보유 및 파기, 제3자 제공, 이용자의 권리 및 행사 방법 등에 대해 명확히
          안내하고자 합니다.<br />
          자세한 내용은 아래 각 항목을 참고해주시기 바랍니다.
        </p>

        <!-- 상단 탭 -->
        <nav class="policy-nav">
<button class="pill" @click="goTo('section-scope')">적용 범위</button>
  <button class="pill" @click="goTo('section-collect')">수집 항목 / 수집 방법</button>
  <button class="pill" @click="goTo('section-purpose')">이용 목적</button>
  <button class="pill" @click="goTo('section-retention')">보관 기간</button>
  <button class="pill" @click="goTo('section-thirdparty')">제3자 제공 / 처리위탁</button>
  <button class="pill" @click="goTo('section-rights')">이용자 권리</button>
  <button class="pill" @click="goTo('section-destroy')">파기</button>
  <button class="pill" @click="goTo('section-security')">안전성 확보</button>
  <button class="pill" @click="goTo('section-notice')">고지/공지</button>
  <button class="pill" @click="goTo('section-child')">아동</button>
        </nav>
      </header>

      <!-- 1. 적용 범위 -->
      <section class="policy-section" id="section-scope">
        <h2 class="section-heading">
          <span class="section-index">1.</span>
          적용 범위
        </h2>
        <div class="section-body dotted-box">
          <p>
            이 방침은 댕냥쉼터 웹/앱 및 그와 직접 연결된 공식 채널에서 처리되는 개인정보에 적용됩니다.
          </p>
        </div>
      </section>

      <!-- 2. 수집 항목 및 수집 방법 -->
      <section class="policy-section" id="section-collect">
        <h2 class="section-heading">
          <span class="section-index">2.</span>
          수집 항목 및 수집 방법
        </h2>

        <div class="section-body dotted-box">
          <ul class="bullet-list">
            <li>
              회원가입/로그인: 이름, 닉네임, 비밀번호, 이메일, 연락처(전화번호), 계정식별(ID)
            </li>
            <li>
              게시글/댓글/쪽지 등 커뮤니티 활동: 작성한 게시글, 댓글/답글 내용, 첨부 이미지/파일
            </li>
            <li>
              봉사/후원 관련 기능 이용 시: 봉사 참여 희망 지역, 방문 가능 시간대, 활동 이력(시간/일자), 후원 의사 정보
            </li>
            <li>
              실종/목격 제보 시: 반려동물 관련 정보(품종, 성별, 색상 등), 발견/실종 위치 정보(지역 단위로 한정), 연락받을 방법
            </li>
            <li>
              서비스 이용 과정에서 자동으로 생성/수집되는 정보:
              <br />
              - 접속 IP, 접속 일시, 사용 브라우저/OS, 이용 기록(조회한 게시글 등), 쿠키 정보
            </li>
            <li>
              문의/신고 처리 시: 신고/문의 내용, 스크린샷 등 증빙자료, 상대방 식별에 필요한 최소한의 계정 정보
            </li>
          </ul>

          <p class="collect-method-title">수집 방법</p>
          <ul class="bullet-list">
            <li>회원 가입/로그인, 게시글 작성 등 이용자가 직접 입력</li>
            <li>고객센터/문의하기를 통한 제출</li>
            <li>서비스 이용 과정에서 자동으로 생성 및 수집</li>
          </ul>
        </div>
      </section>

      <!-- 3. 개인정보의 이용 목적 -->
      <section class="policy-section" id="section-purpose">
        <h2 class="section-heading">
          <span class="section-index">3.</span>
          개인정보의 이용 목적
        </h2>
        <div class="section-body dotted-box">
          <ul class="bullet-list">
            <li>
              회원 식별 및 인증, 본인 확인 (로그인, 커뮤니티 운영(게시글/댓글/알림))
            </li>
            <li>
              유기·실종·목격 제보 및 봉사/후원 연결 지원
            </li>
            <li>
              부정 이용(스팸, 도배, 욕설 등) 행위 감지 및 예방
            </li>
            <li>
              서비스 품질 개선 및 통계 분석
            </li>
            <li>
              서비스 중단 통지 등 필수 알림 · 로그 분석(개인 식별 불가 형태)
            </li>
          </ul>
        </div>
      </section>

      <!-- 4. 보관 기간 -->
      <section class="policy-section" id="section-retention">
        <h2 class="section-heading">
          <span class="section-index">4.</span>
          보관 기간
        </h2>
        <div class="section-body dotted-box">
          <ul class="bullet-list">
            <li>
              회원 탈퇴 시 지체 없이 파기
            </li>
            <li>
              단, 법령에 따라 보존이 요구되는 경우 아래 기간 보관
              <ul class="sub-bullet-list">
                <li>계약·참여이력 등: 5년</li>
                <li>대금결제/후원·재정증빙 기록(해당 시): 5년</li>
                <li>분쟁 처리 관련 · 분쟁 조정 기록: 3년</li>
                <li>로그기록/접속 기록 유지: 통신비밀보호법 등 관련 규정에 따름 (일반적으로 3~6개월 단위 이상 보관할 수 있음)</li>
              </ul>
            </li>
          </ul>
          <p class="note">
            위 법정 보관기간이 경과된 정보는 지체 없이 안전한 방법으로 파기됩니다.
          </p>
        </div>
      </section>

      <!-- 5. 제3자 제공 및 처리 업무 위탁 -->
      <section class="policy-section" id="section-thirdparty">
        <h2 class="section-heading">
          <span class="section-index">5.</span>
          제3자 제공 및 처리 업무 위탁
        </h2>
        <div class="section-body dotted-box">
          <ul class="bullet-list">
            <li>
              제3자 제공: 법령상 근거가 있거나 이용자가 동의한 경우에 한해 최소 범위로 제공합니다.
            </li>
            <li>
              처리 위탁: 서비스 운영(예: 이메일 발송, 시스템 유지보수 등)과 관련된 일부 업무를 외부 업체에 위탁할 수 있으며,
              이 경우 계약 등을 통해 개인정보보호 의무와 안전조치를 명확히 합니다.
            </li>
          </ul>
          <p class="note">
            현재 서비스 운영에 참여하는 수탁업체 및 제공 대상이 발생할 경우, 그 명칭·업무 범위·보유 기간 등을 별도 공지/갱신하여 안내합니다.
          </p>
        </div>
      </section>

      <!-- 6. 이용자의 권리 및 행사 방법 -->
      <section class="policy-section" id="section-rights">
        <h2 class="section-heading">
          <span class="section-index">6.</span>
          이용자의 권리 및 행사 방법
        </h2>
        <div class="section-body dotted-box">
          <ul class="bullet-list">
            <li>
              이용자는 언제든지 자신의 개인정보를 열람·정정·삭제·처리정지 요구할 수 있습니다.
            </li>
            <li>
              단, 법령에 따라 보존이 요구되는 정보 또는 게시판 질서 유지를 위해 필요한 최소 정보는 즉시 삭제가 제한될 수 있습니다.
            </li>
            <li>
              계정 탈퇴(회원 탈퇴) 시 지체 없이 개인정보 파기를 요청할 수 있습니다.
            </li>
            <li>
              위 요청은 서비스 내 문의하기/신고하기 기능 또는 운영팀(관리자)에게 접수할 수 있습니다.
            </li>
          </ul>
        </div>
      </section>

      <!-- 7. 개인정보의 파기 절차 및 방법 -->
      <section class="policy-section" id="section-destroy">
        <h2 class="section-heading">
          <span class="section-index">7.</span>
          개인정보의 파기 절차 및 방법
        </h2>
        <div class="section-body dotted-box">
          <ul class="bullet-list">
            <li>
              파기 절차: 이용자 요청 또는 보관 기간 만료 시 해당 정보를 복구/재생이 불가능한 방식으로 파기합니다.
            </li>
            <li>
              파기 방법: 전자적 파일 형태는 복원이 불가능한 기술적 방법으로 영구 삭제하고,
              출력물 등은 분쇄 또는 소각 등의 방식으로 파기합니다.
            </li>
          </ul>
        </div>
      </section>

      <!-- 8. 개인정보의 안전성 확보 조치 -->
      <section class="policy-section" id="section-security">
        <h2 class="section-heading">
          <span class="section-index">8.</span>
          개인정보의 안전성 확보 조치
        </h2>
        <div class="section-body dotted-box">
          <ul class="bullet-list">
            <li>
              접근 권한 관리: 개인정보에 접근 가능한 인원을 최소화하고, 권한을 차등 부여합니다.
            </li>
            <li>
              암호화: 비밀번호 등 중요한 정보는 일방향 암호화(해시화) 등 안전한 방식으로 저장합니다.
            </li>
            <li>
              전송 구간 보호: 개인정보 전송 시 암호화 통신(예: HTTPS 등)을 적용합니다.
            </li>
            <li>
              로그·접근 기록 보관 및 모니터링을 통한 이상 행위 감시
            </li>
            <li>
              외부 위탁사에 대한 보안 서약 및 정기 점검
            </li>
          </ul>
        </div>
      </section>

      <!-- 9. 고지 / 공지 의무 -->
      <section class="policy-section" id="section-notice">
        <h2 class="section-heading">
          <span class="section-index">9.</span>
          고지 및 공지
        </h2>
        <div class="section-body dotted-box">
          <p>
            개인정보 처리방침 내용이 변경되는 경우 서비스 내 공지사항 또는 별도 팝업/알림 등을 통해 이용자에게 공지합니다.
            변경 사항에는 변경 일자 및 적용 일자를 함께 표시합니다.
          </p>
        </div>
      </section>

      <!-- 10. 아동의 개인정보 보호 -->
      <section class="policy-section" id="section-child">
        <h2 class="section-heading">
          <span class="section-index">10.</span>
          아동의 개인정보 보호
        </h2>
        <div class="section-body dotted-box">
          <ul class="bullet-list">
            <li>
              만 14세 미만 아동은 법정대리인의 동의 없이 회원가입 등 개인정보 제공이 제한됩니다.
            </li>
            <li>
              아동의 개인정보가 필요한 경우, 관계 법령에 따른 절차(법정대리인 동의 등)를 준수합니다.
            </li>
          </ul>
          <p class="note">
            서비스는 기본적으로 성인/보호자의 참여를 전제로 하며, 아동의 직접 참여가 필요한 기능은 최소화하고 있습니다.
          </p>
        </div>
      </section>

    
    </div>
  </main>
</template>

<script>
export default {
  name: "PrivacyPolicyView",
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
:root {
  --page-bg: #efe8dd;
  --card-bg: #f8f1e5;
  --pill-bg: #f5d8a4;
  --text-main: #2a1c10;
  --text-body: #2b2219;
  --border-soft: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.2);
  --footer-bg: transparent;
}

.policy-page {
  background-color: var(--page-bg);
  min-height: 100vh;
  padding: 24px 16px 80px;
  color: var(--text-body);
  font-family: "Pretendard", "Noto Sans KR", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue",
    Arial, sans-serif;
  display: flex;
  justify-content: center;
}

/* 가운데 정렬용 */
.policy-inner {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 헤더 영역 */
.policy-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.policy-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
}

.policy-intro {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-body);
}

.policy-nav {
  background: var(--pill-bg);
  border-radius: 6px;
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  border: 1px solid var(--border-soft);
}

.pill {
  background: #fffbe9;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.4;
  border-radius: 4px;
  padding: 6px 10px;
  color: var(--text-main);
  cursor: default;
  white-space: nowrap;
}

/* 섹션 카드 */
.policy-section {
  background-color: var(--card-bg);
  border-radius: 6px;
  border: 1px solid var(--border-soft);
  padding: 16px 20px 20px;
  color: var(--text-body);

}

.section-heading {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  line-height: 1.4;
}

.section-index {
  font-weight: 700;
  margin-right: 6px;
  color: var(--text-main);
}

.section-body {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-body);
}

.dotted-box {
  border: 2px dotted var(--border-strong);
  padding: 12px 16px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.4);
}

.collect-method-title {
  margin-top: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.bullet-list {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
}

.bullet-list > li {
  margin-bottom: 8px;
  word-break: keep-all;
}

.sub-bullet-list {
  list-style: circle;
  padding-left: 20px;
  margin-top: 6px;
}

.sub-bullet-list > li {
  margin-bottom: 4px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-body);
}

.note {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-body);
  margin-top: 12px;
}

/* 반응형 */
@media (min-width: 768px) {
  .policy-title {
    font-size: 22px;
  }

  .policy-intro {
    font-size: 14px;
  }

  .section-heading {
    font-size: 16px;
  }

  .section-body {
    font-size: 14px;
  }
}
</style>