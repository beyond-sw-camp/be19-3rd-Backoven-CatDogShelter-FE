<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <!-- 모달 헤더 -->
          <div class="modal-header">
            <img src="@/assets/logo.svg" alt="강아지집 아이콘" class="modal-icon" />
            <h2 class="modal-title">신청확인</h2>
          </div>

          <!-- 모달 본문 -->
          <div class="modal-body">
            <p class="modal-message">해당 봉사모집에 신청하시겠습니까?</p>
          </div>

          <!-- 모달 버튼 -->
          <div class="modal-buttons">
            <button class="modal-btn modal-btn-yes" @click="handleConfirm">예</button>
            <button class="modal-btn modal-btn-no" @click="closeModal">아니오</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

function closeModal() {
  emit('close')
}

function handleConfirm() {
  emit('confirm')
  closeModal()
}
</script>

<style scoped>
/* 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* 모달 컨테이너 */
.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 모달 헤더 */
.modal-header {
  background: linear-gradient(135deg, #f9e9c8 0%, #f4d9a6 100%);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0;
}

/* 모달 본문 */
.modal-body {
  padding: 40px 32px;
  text-align: center;
}

.modal-message {
  font-size: 1.1rem;
  color: #3d2f1f;
  margin: 0;
  line-height: 1.6;
}

/* 모달 버튼 */
.modal-buttons {
  display: flex;
  gap: 12px;
  padding: 24px 32px 32px;
}

.modal-btn {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-btn-yes {
  background: white;
  color: #6b5744;
  border: 2px solid #e8e0d5;
}

.modal-btn-yes:hover {
  background: #f5f0e8;
  border-color: #d4c4b0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-btn-no {
  background: white;
  color: #6b5744;
  border: 2px solid #e8e0d5;
}

.modal-btn-no:hover {
  background: #f5f0e8;
  border-color: #d4c4b0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 트랜지션 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* 반응형 */
@media (max-width: 480px) {
  .modal-container {
    max-width: 100%;
    margin: 0 16px;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-icon {
    width: 40px;
    height: 40px;
  }

  .modal-title {
    font-size: 1.2rem;
  }

  .modal-body {
    padding: 32px 24px;
  }

  .modal-message {
    font-size: 1rem;
  }

  .modal-buttons {
    padding: 20px 24px 24px;
    flex-direction: row;
  }

  .modal-btn {
    padding: 12px 20px;
  }
}
</style>