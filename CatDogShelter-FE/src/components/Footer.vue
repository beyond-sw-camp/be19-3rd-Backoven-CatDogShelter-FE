<template>
  <footer class="footer">
    <div class="footer-inner">
      <ul class="footer-menu">
        <li><RouterLink to="/about">댕냥쉼터 소개</RouterLink></li>
        <li><RouterLink to="/terms">이용약관</RouterLink></li>
        <li><RouterLink to="/privacy">개인정보 처리방침</RouterLink></li>
        <li><RouterLink to="/community-guide">커뮤니티 가이드</RouterLink></li>
        <li><RouterLink to="/adoption-process">입양 절차 안내</RouterLink></li>
        <li><RouterLink to="/volunteer-guide">자원봉사 안내</RouterLink></li>
        <li><RouterLink to="/faq">FAQ</RouterLink></li>
        <li>
          <button class="link-button" @click="showModal = true">
            문의하기
          </button>
        </li>
      </ul>

      <p class="footer-copy">© 2025 댕냥쉼터 | All Rights Reserved</p>
    </div>

    <!-- 문의 모달 -->
    <InquiryModal
      v-model="showModal"
      @submitted="handleSubmit"
    />

    <!-- 성공 모달 -->
    <InquirySuccessModal v-model="showSuccess" />
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import InquiryModal from '@/components/InquiryModal.vue'
import InquirySuccessModal from '@/components/InquirySuccessModal.vue'

const showModal = ref(false)
const showSuccess = ref(false)

const handleSubmit = () => {
  // 문의 접수 완료 후 성공 모달 보여주기
  showSuccess.value = true
}
</script>

<style scoped>
.footer {
  width: 100%;
  background-color: #BFB5A8;
  border-top: 1px solid var(--footer-sep);
  color: #fff;
  padding: 18px 0 10px;
  font-family: "Pretendard Variable", "Noto Sans KR", sans-serif;
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
  gap: 40px;
  margin: 0;
  padding: 0;
}

.footer-menu a,
.footer-menu .link-button {
  text-decoration: none;
  color: #ffffff;
  font-size: 14.5px;
  transition: opacity 0.2s ease;
  font-family: inherit;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.footer-menu a:hover,
.footer-menu .link-button:hover {
  opacity: 0.7;
}

.footer-menu .router-link-active {
  opacity: 0.9;
  text-decoration: underline dotted 1px;
  text-underline-offset: 3px;
}

.footer-copy {
  font-size: 13.5px;
  color: #ffffff;
  opacity: 0.85;
  font-weight: 500;
  text-align: center;
  margin-top: 10px;
}
</style>