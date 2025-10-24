<template>
    <footer class="footer">
    <div class="footer-inner">
      <ul class="footer-menu">
        <li><RouterLink to="/about">댕냥쉼터 소개</RouterLink></li>
        <li><RouterLink to="/terms">이용약관</RouterLink></li>
        <li><RouterLink to="/privacy">개인정보 처리방침</RouterLink></li>
        <li><RouterLink to="/community-guide">커뮤니티 가이드</RouterLink></li>
        <li><RouterLink to="/adoption-process">입양 절차 안내</RouterLink></li>
        <li><RouterLink to="/volunteer">자원봉사 안내</RouterLink></li>
        <li><RouterLink to="/faq">FAQ</RouterLink></li>
        <li><button class="link-button" @click="showModal = true">문의하기</button></li>
      </ul>
      <p class="footer-copy">© 2025 댕냥쉼터 | All Rights Reserved</p>
    </div>
<!-- 문의 모달 -->
    <InquiryModal v-if="showModal" @close="showModal = false" @submitted="handleSubmit"/>
        <!-- 성공 모달 -->
    <InquirySuccessModal v-model="showSuccess" />
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router' // (script setup에선 import 안 해도 되지만 명시해둠)
import InquiryModal from '@/components/InquiryModal.vue'
import InquirySuccessModal from '@/components/InquirySuccessModal.vue'

const showModal = ref(false)
const showSuccess = ref(false)

const handleSubmit = () => {
  showModal.value = false     // 문의하기 모달 닫기
  showSuccess.value = true    // 성공 모달 열기
}
</script>

<style scoped>
.footer {
  width: 100%;
  background-color: #BFB5A8;
  border-top: 1px solid var(--footer-sep);
  color: #fff;
  padding: 18px 0 10px; /* 상하 여백 줄임 */
  margin-top: auto;
  display: flex;
  justify-content: center;
}

.footer-inner {
  width: 100%;
  max-width: 1400px;
  padding: 0 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.footer-menu {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px; /* 항목 간 간격 살짝 축소 */
  margin: 0;
  padding: 0;
}

/* 링크 스타일 */
.footer-menu a {
  text-decoration: none;
  color: #ffffff;
  font-size: 14.5px; /* 폰트 살짝 줄여 균형 */
  transition: opacity 0.2s ease;
}

.footer-menu a:hover {
  opacity: 0.7;
}

.footer-menu .router-link-active {
  opacity: 0.9;
  text-decoration: underline dotted 1px;
  text-underline-offset: 3px;
}

/* 문의하기 버튼 */
.footer-menu .link-button {
  all: unset;
  cursor: pointer;
  color: #ffffff;
  font-size: 14.5px;
  transition: opacity 0.2s ease;
}

.footer-menu .link-button:hover {
  opacity: 0.7;
}

.footer-copy {
  font-size: 13.5px; /* 글자 크기 살짝 줄임 */
  color: #ffffff;
  opacity: 0.85;
  font-weight: 500;
  text-align: center;
  margin-top: 10px; /* 메뉴와 저작권 간격 축소 */
}
</style>