<!-- FAQ 자주 묻는 질문 -->
<template>
  <main class="faq-main">
    <section class="faq-header">
      <h1 class="faq-title">FAQ</h1>
      <p class="faq-desc">
        서비스 이용 중 자주 묻는 질문을 모아두었어요.<br />
        더 궁금한 점이 있다면
        <button class="inline-link" @click="openInquiry">문의하기</button>
        로 알려주세요.
      </p>

      <nav class="faq-nav">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="faq-pill"
          @click="scrollToSection(cat.id)"
        >
          {{ cat.label }}
        </button>
      </nav>
    </section>

    <section class="faq-section" id="account">
      <header class="faq-section-head">
        <h2 class="faq-section-title">계정 / 로그인</h2>
      </header>

      <ul class="faq-list">
        <li
          v-for="(item, idx) in faqItems.account"
          :key="'account-'+idx"
          class="faq-item"
        >
          <button
            class="faq-q"
            @click="toggleQA('account', idx)"
            :aria-expanded="isQAOpen('account', idx)"
          >
            <span class="faq-q-label">Q.</span>
            <span class="faq-q-text">{{ item.q }}</span>
            <span class="faq-arrow" :class="{ active: isQAOpen('account', idx) }">⌄</span>
          </button>

          <div v-show="isQAOpen('account', idx)" class="faq-a">
            <span class="faq-a-label">A.</span>
            <p class="faq-a-text" v-html="item.a"></p>
          </div>
        </li>
      </ul>
    </section>

    <section class="faq-section" id="community">
      <header class="faq-section-head">
        <h2 class="faq-section-title">게시글 / 커뮤니티</h2>
      </header>

      <ul class="faq-list">
        <li
          v-for="(item, idx) in faqItems.community"
          :key="'community-'+idx"
          class="faq-item"
        >
          <button
            class="faq-q"
            @click="toggleQA('community', idx)"
            :aria-expanded="isQAOpen('community', idx)"
          >
            <span class="faq-q-label">Q.</span>
            <span class="faq-q-text">{{ item.q }}</span>
            <span class="faq-arrow" :class="{ active: isQAOpen('community', idx) }">⌄</span>
          </button>

          <div v-show="isQAOpen('community', idx)" class="faq-a">
            <span class="faq-a-label">A.</span>
            <p class="faq-a-text" v-html="item.a"></p>
          </div>
        </li>
      </ul>
    </section>

    <section class="faq-section" id="adoption">
      <header class="faq-section-head">
        <h2 class="faq-section-title">입양 / 후원</h2>
      </header>

      <ul class="faq-list">
        <li
          v-for="(item, idx) in faqItems.adoption"
          :key="'adoption-'+idx"
          class="faq-item"
        >
          <button
            class="faq-q"
            @click="toggleQA('adoption', idx)"
            :aria-expanded="isQAOpen('adoption', idx)"
          >
            <span class="faq-q-label">Q.</span>
            <span class="faq-q-text">{{ item.q }}</span>
            <span class="faq-arrow" :class="{ active: isQAOpen('adoption', idx) }">⌄</span>
          </button>

          <div v-show="isQAOpen('adoption', idx)" class="faq-a">
            <span class="faq-a-label">A.</span>
            <p class="faq-a-text" v-html="item.a"></p>
          </div>
        </li>
      </ul>
    </section>

    <section class="faq-section" id="report">
      <header class="faq-section-head">
        <h2 class="faq-section-title">신고 / 제재</h2>
      </header>

      <ul class="faq-list">
        <li
          v-for="(item, idx) in faqItems.report"
          :key="'report-'+idx"
          class="faq-item"
        >
          <button
            class="faq-q"
            @click="toggleQA('report', idx)"
            :aria-expanded="isQAOpen('report', idx)"
          >
            <span class="faq-q-label">Q.</span>
            <span class="faq-q-text">{{ item.q }}</span>
            <span class="faq-arrow" :class="{ active: isQAOpen('report', idx) }">⌄</span>
          </button>

          <div v-show="isQAOpen('report', idx)" class="faq-a">
            <span class="faq-a-label">A.</span>
            <p class="faq-a-text" v-html="item.a"></p>
          </div>
        </li>
      </ul>
    </section>

    <section class="faq-section" id="etc">
      <header class="faq-section-head">
        <h2 class="faq-section-title">기술 / 기타</h2>
      </header>

      <ul class="faq-list">
        <li
          v-for="(item, idx) in faqItems.etc"
          :key="'etc-'+idx"
          class="faq-item"
        >
          <button
            class="faq-q"
            @click="toggleQA('etc', idx)"
            :aria-expanded="isQAOpen('etc', idx)"
          >
            <span class="faq-q-label">Q.</span>
            <span class="faq-q-text">{{ item.q }}</span>
            <span class="faq-arrow" :class="{ active: isQAOpen('etc', idx) }">⌄</span>
          </button>

          <div v-show="isQAOpen('etc', idx)" class="faq-a">
            <span class="faq-a-label">A.</span>
            <p class="faq-a-text" v-html="item.a"></p>
          </div>
        </li>
      </ul>

     
    </section>

    <InquiryModal
      :open="inquiryOpen"
      @close="inquiryOpen = false"
      @submitted="handleInquirySubmitted"
    />
  </main>
</template>

<script>
import InquiryModal from '@/components/InquiryModal.vue'

export default {
  name: 'FaqView',
  components: {
    InquiryModal,
  },
  data() {
    return {
      inquiryOpen: false,

      openState: {
        account: [],
        community: [],
        adoption: [],
        report: [],
        etc: [],
      },

      categories: [
        { id: 'account', label: '계정/로그인' },
        { id: 'community', label: '게시글/커뮤니티' },
        { id: 'adoption', label: '입양/후원' },
        { id: 'report', label: '신고·제재' },
        { id: 'etc', label: '기술/기타' },
      ],

      faqItems: {
        account: [
          {
            q: '회원가입은 필수인가요?',
            a: '게시글 작성·수정, 입양/후원 등 대부분 기능은 회원가입 후 이용 가능합니다.<br />단, 게시글 열람 자체는 비회원도 가능합니다.',
          },
          {
            q: '회원정보(연락처 등)는 다른 사람에게 공개되나요?',
            a: '닉네임과 일부 프로필 정보만 노출되며, 이메일/연락처 등 민감 정보는 공개되지 않습니다. 다만 법적 사유로 요청되는 경우 관련 법령에 따라 제공될 수 있습니다.',
          },
          {
            q: '비밀번호를 잊어버렸어요.',
            a: '로그인 화면의 <b>비밀번호 재설정</b> 기능에서 이메일 인증 후 새로운 비밀번호로 변경할 수 있습니다.',
          },
          {
            q: '회원 탈퇴는 어떻게 하나요?',
            a: '마이페이지 &gt; 계정설정 &gt; 회원 탈퇴에서 진행할 수 있습니다. 단, 서비스 악용 방지를 위해 일정 기간 재가입이 제한될 수 있습니다.',
          },
        ],

        community: [
          {
            q: '신고는 어떻게 하나요?',
            a: '게시글/댓글 우측 상단 더보기 메뉴 → <b>신고하기</b> 를 선택해 주세요. 관리자가 확인 후 필요한 경우 조치합니다.',
          },
          {
            q: '어떤 글이 금지되나요?',
            a: '폭력·혐오·허위 사실 유포, 상업 광고/스팸 링크, 선정적/폭력적 이미지 등은 금지됩니다. 심각한 경우 게시물 삭제 또는 활동 제한이 적용될 수 있습니다.',
          },
          {
            q: '내가 쓴 글은 어디서 관리해요?',
            a: '마이페이지 &gt; 활동내역에서 내가 작성한 게시글, 받은 좋아요 수, 댓글 등을 한 번에 확인하고 수정/삭제할 수 있습니다.',
          },
          {
            q: '실종 / 목격 제보는 어떤 형식으로 써야 하나요?',
            a: '실종·목격 게시판에는 반려동물의 사진, 위치(시/군/구 단위 이상), 시간대, 특징(털색/목걸이 유무 등)을 상세히 적어주세요. 정보가 정확할수록 구조 가능성이 높아집니다.',
          },
        ],

        adoption: [
          {
            q: '입양은 어떤 절차로 진행되나요?',
            a: '1) 보호소 정보 확인 → 2) 상담 신청 → 3) 입양 확정 순으로 진행됩니다. 실제 절차는 보호소마다 다를 수 있으므로 각 게시글의 안내를 꼭 확인해주세요.',
          },
          {
            q: '후원은 어떻게 하나요?',
            a: '후원 게시판에 게시된 계좌/링크/물품 후원 안내를 참고해 주세요. 플랫폼은 후원 중개를 돕지만, 직접적인 금전 거래는 보호소 또는 단체와 진행됩니다.',
          },
          {
            q: '후원/입양 관련해서 사기가 걱정돼요.',
            a: '의심스러운 게시물은 즉시 신고해 주세요. 금전 거래 전에는 반드시 보호소/단체의 공식 연락처와 계좌 명의를 확인하시길 권장합니다.',
          },
        ],

        report: [
          {
            q: '부적절한 이용자는 어떻게 제재하나요?',
            a: '신고가 접수되면 운영자가 사실 여부를 검토합니다. 반복적 스팸, 사칭, 금전 사기 시에는 게시글 삭제, 활동 제한, 계정 정지 등의 조치가 진행될 수 있습니다.',
          },
          {
            q: '신고했는데 결과를 알 수 있나요?',
            a: '개별 이용자에 대한 구체적인 제재 내역은 개인정보 보호 사유로 상세 안내가 어렵지만, 명백한 위반사항은 신속히 처리합니다.',
          },
          {
            q: '허위 신고하면 어떻게 되나요?',
            a: '고의적인 허위 신고 또는 악의적인 신고 남발은 오히려 신고자의 이용 제한 사유가 될 수 있습니다.',
          },
        ],

        etc: [
          {
            q: '서비스가 잘 안 열리거나 오류가 나요.',
            a: '먼저 새로고침 또는 브라우저 재접속을 시도해 주세요. 그래도 해결되지 않으면 오류가 발생한 화면 캡처와 함께 문의해 주시면 빠르게 확인하겠습니다.',
          },
          {
            q: '내 개인정보는 안전하게 보관되나요?',
            a: '가입 시 수집되는 최소한의 정보는 암호화되어 저장되며, 비밀번호 등 민감 정보는 평문으로 보관하지 않습니다. 관련 내용은 개인정보 처리방침에서 자세히 확인하실 수 있습니다.',
          },
          {
            q: '운영 시간 외에는 문의가 안 되나요?',
            a: '운영 시간(평일 10:00~18:00) 외 접수된 문의도 저장되며, 다음 근무일에 순차적으로 답변드립니다. 긴급한 구조/실종 상황은 게시판에 먼저 올려주세요.',
          },
        ],
      },
    }
  },
  methods: {
    scrollToSection(sectionId) {
      const el = document.getElementById(sectionId)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 16
        window.scrollTo({
          top: y,
          behavior: 'smooth',
        })
      }
    },

    toggleQA(sectionKey, idx) {
      const arr = this.openState[sectionKey]
      const pos = arr.indexOf(idx)
      if (pos === -1) {
        arr.push(idx)
      } else {
        arr.splice(pos, 1)
      }
      this.openState[sectionKey] = [...arr]
    },

    isQAOpen(sectionKey, idx) {
      return this.openState[sectionKey].includes(idx)
    },

    openInquiry() {
      this.inquiryOpen = true
    },

    handleInquirySubmitted(payload) {
      console.log('문의 접수됨:', payload)
      // 여기서 토스트/알림 처리 가능
    },
  },
}
</script>

<style scoped>
:root {
  --faq-bg-page: #efe4d2;
  --faq-card-bg: #fffdfb;
  --faq-card-line: rgba(0,0,0,0.08);
  --faq-text-main: #2a1c10;
  --faq-text-body: #3a2c1e;
  --faq-pill-bg: #f5d8a4;
  --faq-pill-text: #2a1c10;
  --faq-note-bg: #fff9e8;
  --faq-radius-lg: 8px;
  --faq-shadow-soft: 0 2px 4px rgba(0,0,0,0.04);
}

.faq-main {
  max-width: 1080px;
  width: 100%;
  margin: 24px auto 80px;
  padding: 0 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: transparent;
  color: var(--faq-text-body);
}

.faq-header {
  padding: 8px 0 0;
}

.faq-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--faq-text-main);
  margin-bottom: 12px;
}

.faq-desc {
  font-size: 14px;
  line-height: 1.5;
  color: var(--faq-text-body);
  margin-bottom: 16px;
}

.inline-link {
  background: none;
  border: 0;
  color: #8b5e2f;
  font-weight: 600;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.faq-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.faq-pill {
  border: 0;
  border-radius: var(--faq-radius-lg);
  background-color: var(--faq-pill-bg);
  color: var(--faq-pill-text);
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  padding: 8px 12px;
  box-shadow: var(--faq-shadow-soft);
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.07);
}

.faq-section {
  background-color: var(--faq-card-bg);
  border-radius: var(--faq-radius-lg);
  box-shadow: var(--faq-shadow-soft);
  border: 1px solid rgba(0,0,0,0.05);
  overflow: hidden;
}

.faq-section-head {
  padding: 20px 24px 8px;
}

.faq-section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--faq-text-main);
}

.faq-list {
  list-style: none;
  margin: 0;
  padding: 0 24px 8px;
    font-family: "Pretendard", "Noto Sans KR", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue",
    Arial, sans-serif;
  border-top: 1px solid var(--faq-card-line);
}

.faq-item + .faq-item {
  border-top: 1px solid var(--faq-card-line);
}

.faq-q {
  width: 100%;
  background: transparent;
  border: 0;
  text-align: left;
  padding: 16px 0;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--faq-text-main);
  font-weight: 600;
}

.faq-q-label {
  flex-shrink: 0;
  font-weight: 700;
  color: var(--faq-text-main);
}

.faq-q-text {
  flex: 1;
  line-height: 1.5;
}

.faq-arrow {
  flex-shrink: 0;
  font-size: 14px;
  line-height: 1;
  transform: rotate(0deg);
  transition: transform 0.18s ease;
  color: #6a563f;
}
.faq-arrow.active {
  transform: rotate(180deg);
}

.faq-a {
  padding: 0 0 16px 24px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--faq-text-body);
  display: flex;
  gap: 8px;
}

.faq-a-label {
  flex-shrink: 0;
  font-weight: 700;
  color: var(--faq-text-main);
}

.faq-a-text {
  flex: 1;
}

.faq-extra-note {
  border-top: 1px solid var(--faq-card-line);
  margin-top: 8px;
  padding: 20px 24px 24px;
  background-color: var(--faq-note-bg);
  font-size: 13px;
  line-height: 1.5;
  color: var(--faq-text-body);
}

.note-title {
  font-weight: 700;
  font-size: 14px;
  color: var(--faq-text-main);
  margin-bottom: 4px;
}

.note-desc {
  margin-bottom: 8px;
}

.note-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.note-list li + li {
  margin-top: 4px;
}

@media (max-width: 600px) {
  .faq-main {
    margin-top: 16px;
    padding-bottom: 64px;
  }

  .faq-title {
    font-size: 20px;
  }

  .faq-section-title {
    font-size: 14px;
  }

  .faq-q,
  .faq-a {
    font-size: 13px;
  }
}
</style>