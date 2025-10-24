<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="modal-overlay"
      @click.self="close"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="inquiry-success-title"
      aria-describedby="inquiry-success-desc"
    >

      <div class="modal-sheet" ref="sheet" tabindex="-1" @keydown.esc.prevent="close">
        <!-- 헤더 -->
        <div class="modal-header">
          <h3 id="inquiry-success-title">접수완료</h3>
          <button class="modal-close" @click="close" aria-label="닫기">×</button>
        </div>

        <hr class="modal-divider" />

        <!-- 본문 -->
        <div class="modal-body">
          <div class="modal-icon" aria-hidden="true">
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M45 0C20.16 0 0 20.16 0 45C0 69.84 20.16 90 45 90C69.84 90 90 69.84 90 45C90 20.16 69.84 0 45 0ZM36 67.5L13.5 45L19.845 38.655L36 54.765L70.155 20.61L76.5 27L36 67.5Z" fill="#78A55A"/>
            </svg>
          </div>

          <p class="modal-title">문의가 접수되었습니다</p>
          <p id="inquiry-success-desc" class="modal-desc">
            담당자가 내용을 확인한 후, <strong>영업일 기준 1–2일</strong> 내 답변드릴게요.
          </p>
        </div>

        <!-- 푸터 -->
        <div class="modal-footer">
          <button class="btn-primary" @click="close">확인</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])

const sheet = ref(null)
const close = () => emit('update:modelValue', false)

/** 열릴 때: 포커스 + 스크롤 잠금 */
watch(() => props.modelValue, (open) => {
  if (open) {
    requestAnimationFrame(() => sheet.value?.focus())
    lockScroll()
  } else {
    unlockScroll()
  }
})

onMounted(() => {
  if (props.modelValue) lockScroll()
})
onBeforeUnmount(() => unlockScroll())

function lockScroll() {
  const prev = document.body.style.overflow
  document.body.dataset.prevOverflow = prev || ''
  document.body.style.overflow = 'hidden'
}
function unlockScroll() {
  document.body.style.overflow = document.body.dataset.prevOverflow || ''
  delete document.body.dataset.prevOverflow
}
</script>

<style scoped>
:root {
  --brand-brown: #7A5A3A;
  --brand-beige: #EFE6DA;
  --sheet-bg: #ffffff;
  --overlay: rgba(0, 0, 0, 0.45);
  --divider: #eee3d6;
}

/* 오버레이 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  display: grid;
  place-items: center;
  z-index: 1000;
}

/* 모달 시트 */
.modal-sheet {
  width: min(640px, 92vw);
  background: var(--sheet-bg);
  border-radius: 14px;
  outline: none;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.06);
  overflow: hidden;
}

/* 헤더 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
}
.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--brand-brown);
  letter-spacing: 0.2px;
}
.modal-close {
  all: unset;
  cursor: pointer;
  font-size: 26px;
  line-height: 1;
  color: #b1b1b1;
  padding: 6px;
  border-radius: 8px;
}
.modal-close:hover { background: #f3f3f3; }

/* 구분선 */
.modal-divider {
  border: none;
  border-top: 1px solid var(--divider);
  margin: 0;
}

/* 본문 */
.modal-body {
  text-align: center;
  padding: 44px 28px 28px;
}
.modal-icon {
  display: grid;
  place-items: center;
  margin-bottom: 18px;
}
.modal-title {
  margin: 14px 0 10px;
  font-weight: 800;
  font-size: 26px;
  color: var(--brand-brown);
}
.modal-desc {
  margin: 8px 0 6px;
  color: #7a6959;
  font-size: 16px;
  line-height: 1.6;
}

/* 푸터 */
.modal-footer {
  background: var(--brand-beige);
  padding: 20px 22px;
  display: flex;
  justify-content: center;
}
.btn-primary {
  min-width: 120px;
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  color: #fff;
  background: var(--brand-brown);
  box-shadow: 0 2px 0 rgba(0,0,0,0.06), inset 0 -2px 0 rgba(0,0,0,0.12);
}
.btn-primary:hover { filter: brightness(0.96); }
.btn-primary:active { transform: translateY(1px); }

/* 모션 선호도 */
@media (prefers-reduced-motion: reduce) {
  .btn-primary { transition: none; }
}
</style>