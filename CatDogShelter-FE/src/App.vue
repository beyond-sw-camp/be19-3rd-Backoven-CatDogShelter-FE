<template>
  <div class="layout">
    <Header />

    <!-- 메인 영역이 남은 높이를 먹도록 -->
    <main class="main">
      <router-view />
    </main>

    <Footer @open-contact="isContactOpen = true" />

    <teleport to="body">
      <div
        v-if="isContactOpen"
        class="modal-backdrop"
        @click.self="isContactOpen = false"
        aria-modal="true" role="dialog"
      >
        <div class="modal">
          <h3>문의하기</h3>
          <form @submit.prevent="submit">
            <input v-model="form.email" type="email" placeholder="이메일" required />
            <textarea v-model="form.message" placeholder="문의 내용" required />
            <div class="actions">
              <button type="button" @click="isContactOpen=false">취소</button>
              <button type="submit">보내기</button>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <ReportModal />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { ReportModal } from '@/components/report'

const isContactOpen = ref(false)
const form = ref({ email: '', message: '' })

const submit = () => {
  console.log('문의전송', form.value)
  isContactOpen.value = false
}
</script>

<style>
body {
  font-family: 'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif;
}

/* 핵심: 푸터를 바닥에 고정시키는 레이아웃 */
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main {
  flex: 1;              /* 남은 높이 채움 */
  display: block;
}

/* (선택) 모달 기본 스타일 유지 */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.35);
  display: grid; place-items: center;
  z-index: 1000;
}
.modal {
  width: min(560px, 92vw);
  background: #fff; border-radius: 12px;
  padding: 20px;
}
.actions { display:flex; gap:8px; justify-content:flex-end; margin-top:12px; }
</style>
