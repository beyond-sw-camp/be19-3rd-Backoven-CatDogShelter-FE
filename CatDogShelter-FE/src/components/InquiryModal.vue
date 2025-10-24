<template>
  <!-- 문의하기 모달 전체 구조 -->
  <div class="inquiry-backdrop">
    <div class="inquiry-modal">
      <header class="inquiry-header">
        <h3 class="inquiry-title">문의하기</h3>
        <button class="inquiry-close" aria-label="닫기" @click="$emit('close')">✕</button>
      </header>

      <div class="inquiry-body">
        <div class="form-group">
          <label>제목 <span class="req">*</span></label>
          <input type="text" class="input" placeholder="문의 제목을 입력해주세요" />
        </div>

        <div class="form-group">
          <label>문의 내용 <span class="req">*</span></label>
          <textarea class="textarea" placeholder="문의하실 내용을 자세히 작성해주세요"></textarea>
        </div>

        <div class="notice-pill">
          📮 접수된 문의는 영업일 기준 1-2일 내에 답변드립니다.
        </div>
      </div>

      <div class="inquiry-actions">
        <button class="btn btn-primary">문의 접수</button>
        <button class="btn btn-ghost" @click="$emit('close')">취소</button>
      </div>
    </div>
  </div>
</template>

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
  width: 90%;           /* 전체 화면의 80%까지만 사용 */
  max-width: 480px;     /* 기존 720px → 560px로 줄이기 */
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0,0,0,.18);
  padding :10px;
  overflow: hidden;
}

/* 헤더 */
.inquiry-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 28px;
  border-bottom: 1px solid var(--line);
  background: var(--white);
}

.inquiry-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--brand-brown); /* 제목 색상 브라운 */
}

.inquiry-close {
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
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
  padding: 18px 22px;
  background: var(--white);
}

.form-group {
  margin-bottom: 22px;
}
.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 800;
  color: #222;
  font-size: 15px;
}
.req {
  color: var(--danger);
  margin-left: 4px;
}

.input,
.textarea {
  width:93%;
  border: 1px solid #ddd;
  background: #fff;
  color: #222;
  border-radius: 14px;
  padding: 8px 12px;
  font-size: 15px;
  outline: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.input::placeholder,
.textarea::placeholder {
  color: #c3c3c3;
}

.input {
  height: 56px;
}
.textarea {
  min-height: 280px;
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
  padding: 8px 24px 24px;
  background: var(--white);
  flex-wrap: wrap;
}

.btn {
  flex: 1 1 0;
  height: 58px;
  border-radius: 16px;
  font-weight: 800;
  font-size: 16px;
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
  .inquiry-actions {
    gap: 12px;
  }
  .btn {
    height: 54px;
    font-size: 15px;
  }
  .textarea {
    min-height: 220px;
  }
}
</style>