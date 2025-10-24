<template>

  <div class="layout">
    <Header/>
    <main class="main"><router-view /></main>
    <Footer @open-contact="isContactOpen = true" />

    <!-- 문의하기 모달 -->
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const isContactOpen = ref(false)
const form = ref({ email: '', message: '' })

const submit = () => {
  // TODO: 실제 전송 로직 연결 (API 호출 or mailto:)
  console.log('문의전송', form.value)
  isContactOpen.value = false
}
</script>

<style>

.layout{min-height:100dvh;display:flex;flex-direction:column}
.main{flex:1}

/* 아주 심플한 모달 스타일 */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4);display:grid;place-items:center;z-index:1000}
.modal{background:#fff;border-radius:12px;max-width:520px;width:92vw;padding:20px}
.modal h3{margin:0 0 12px}
.modal input,.modal textarea{width:100%;margin-bottom:10px;padding:10px;border:1px solid #ddd;border-radius:8px}
.actions{display:flex;gap:10px;justify-content:flex-end}
</style>