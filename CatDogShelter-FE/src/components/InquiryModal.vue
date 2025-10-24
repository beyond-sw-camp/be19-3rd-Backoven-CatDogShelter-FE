<template>
  <teleport to="body">
    <div
      class="inquiry-backdrop"
      @click.self="onClose"
      @keydown.esc.prevent="onClose"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'inquiry-title'"
      ref="backdrop"
    >
      <div class="inquiry-modal" ref="sheet" tabindex="-1">
        <header class="inquiry-header">
          <h3 id="inquiry-title" class="inquiry-title">문의하기</h3>
          <button class="inquiry-close" aria-label="닫기" @click="onClose">✕</button>
        </header>

        <form class="inquiry-body" @submit.prevent="onSubmit">
          <div class="form-group">
            <label for="inq-subject">제목 <span class="req">*</span></label>
            <input
              id="inq-subject"
              type="text"
              class="input"
              v-model.trim="form.subject"
              placeholder="문의 제목을 입력해주세요"
              required
              :aria-invalid="!!errors.subject"
              :aria-errormessage="errors.subject ? 'err-subject' : undefined"
            />
            <p v-if="errors.subject" id="err-subject" class="err-text">{{ errors.subject }}</p>
          </div>

          <div class="form-group">
            <label for="inq-content">문의 내용 <span class="req">*</span></label>
            <textarea
              id="inq-content"
              class="textarea"
              v-model.trim="form.content"
              placeholder="문의하실 내용을 자세히 작성해주세요"
              required
              :aria-invalid="!!errors.content"
              :aria-errormessage="errors.content ? 'err-content' : undefined"
            ></textarea>
            <p v-if="errors.content" id="err-content" class="err-text">{{ errors.content }}</p>
          </div>

          <div class="notice-pill">
            📮 접수된 문의는 영업일 기준 1–2일 내에 답변드립니다.
          </div>

          <div class="inquiry-actions">
            <button class="btn btn-primary" type="submit" :disabled="submitting">
              {{ submitting ? '접수 중...' : '문의 접수' }}
            </button>
            <button class="btn btn-ghost" type="button" @click="onClose">취소</button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue'

const emit = defineEmits(['close', 'submitted'])

const backdrop = ref(null)
const sheet = ref(null)

const form = reactive({
  subject: '',
  content: ''
})

const errors = reactive({
  subject: '',
  content: ''
})

const submitting = ref(false)

/** body 스크롤 잠금 */
const lockScroll = () => {
  const prev = document.body.style.overflow
  document.body.dataset.prevOverflow = prev || ''
  document.body.style.overflow = 'hidden'
}
const unlockScroll = () => {
  document.body.style.overflow = document.body.dataset.prevOverflow || ''
  delete document.body.dataset.prevOverflow
}

/** 포커스 트랩: 모달 열릴 때 첫 입력에 포커스 */
onMounted(() => {
  lockScroll()
  // 약간의 지연 후 포커스
  requestAnimationFrame(() => sheet.value?.focus())
})
onBeforeUnmount(() => {
  unlockScroll()
})

/** 간단 검증 */
function validate() {
  errors.subject = form.subject ? '' : '제목을 입력해주세요.'
  errors.content = form.content && form.content.length >= 5 ? '' : '내용은 5자 이상 입력해주세요.'
  return !errors.subject && !errors.content
}



async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    // await inquiryApi.create({ subject: form.subject, content: form.content })
    await new Promise(r => setTimeout(r, 600)) // 데모용 지연
    emit('submitted', { ...form })
    onClose()
  } finally {
    submitting.value = false
  }
}

function onClose() {
  emit('close')
}


</script>

<style>
/* ===== Tokens ===== */
:root {
  --brand-brown: #6b4a2b;
  --brand-brown-600: #5d3f24;
  --beige: #f3e7d6;
  --beige-line: #c9b7a7;
  --white: #ffffff;
  --line: #e7e7e7;
  --focus: #3b82f6;
  --danger: #e65252;
}

/* 배경 및 컨테이너 */
.inquiry-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  padding: 18px;
  z-index: 1000;
}

.inquiry-modal {
  width: 90%;
  max-width: 480px;
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
  padding: 0; /* 내부 여백은 body에서 처리 */
  overflow: hidden;
}

/* 헤더 */
.inquiry-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 28px 10px 28px; /* 좌우 넉넉히 */
  border-bottom: 1px solid var(--line);
}

.inquiry-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--brand-brown);
}

.inquiry-close {
  border: none;
  background: transparent;
  font-size: 22px;
  color: #b5b5b5;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
}
.inquiry-close:hover {
  background: #f7f7f7;
}

/* 본문 */
.inquiry-body {
  padding: 20px 28px 16px 28px; /* 우측 패딩 추가 */
  background: var(--white);
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px; /* 간격 줄임 */
  font-weight: 800;
  color: #222;
  font-size: 15px;
}

.req {
  color: var(--danger);
  margin-left: 4px;
}

/* ===== 입력영역 교정 핵심 ===== */
.input,
.textarea {
  width: 100%; /* 93% → 100% */
  border: 1px solid #ddd;
  background: #fff;
  color: #222;
  border-radius: 14px;
  padding: 10px 16px; /* 좌우 모두 충분한 여백 */
  font-size: 15px;
  outline: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  box-sizing: border-box; /* 패딩 포함 계산 */
}

.input::placeholder,
.textarea::placeholder {
  color: #c3c3c3;
}

.input {
  height: 46px; /* 제목 칸 높이 축소 */
}

.textarea {
  min-height: 220px;
  resize: vertical;
}

.input:focus,
.textarea:focus {
  border-color: var(--focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

/* 안내 배지 */
.notice-pill {
  margin-top: 10px;
  font-family: "Pretendard Variable", "Noto Sans KR", sans-serif;
  background: var(--beige);
  color: #6a4a2d;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 14px;
}

/* 버튼 */
.inquiry-actions {
  display: flex;
  gap: 22px;
  padding: 10px 28px 24px 28px; /* 좌우 패딩 통일 */
  background: var(--white);
  flex-wrap: wrap;
}

.btn {
  flex: 1 1 0;
  height: 52px;
  border-radius: 16px;
  font-weight: 800;
  font-size: 15.5px;
  cursor: pointer;
  transition: transform 0.02s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.btn:active {
  transform: translateY(1px);
}

/* 브라운 채움 버튼 */
.btn-primary {
  background: var(--brand-brown);
  color: var(--white);
  border: 1px solid var(--brand-brown);
}
.btn-primary:hover {
  background: var(--brand-brown-600);
}

/* 투명 외곽선 버튼 */
.btn-ghost {
  background: transparent;
  color: var(--brand-brown);
  border: 2px solid var(--beige-line);
}
.btn-ghost:hover {
  border-color: var(--brand-brown);
  color: var(--brand-brown-600);
}

/* 반응형 */
@media (max-width: 560px) {
  .inquiry-body {
    padding: 18px 20px 12px 20px;
  }
  .inquiry-actions {
    gap: 12px;
    padding: 8px 20px 20px 20px;
  }
  .btn {
    height: 50px;
    font-size: 15px;
  }
  .textarea {
    min-height: 200px;
  }
}
</style>