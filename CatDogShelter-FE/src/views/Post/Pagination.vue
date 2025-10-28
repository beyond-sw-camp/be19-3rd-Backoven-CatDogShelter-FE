<template>
  <nav class="pager" role="navigation" aria-label="페이지네이션">
    <button
      class="pg-btn"
      :disabled="pageNum <= 1"
      @click="$emit('change', pageNum - 1)"
    >이전</button>

    <button
      v-for="p in pages"
      :key="p"
      class="pg-btn"
      :class="{ 'is-active': p === pageNum }"
      @click="$emit('change', p)"
      :aria-current="p === pageNum ? 'page' : null"
    >{{ p }}</button>

    <button
      class="pg-btn"
      :disabled="pageNum >= totalPages"
      @click="$emit('change', pageNum + 1)"
    >다음</button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: [Number, String], default: 1 },
  perPage: { type: Number, default: 10 },
  total: { type: Number, default: 0 } // 총 게시글 수
})

const pageNum = computed(() => Number(props.page) || 1)
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))

// 단순형: 1 ~ totalPages 전부 노출 (페이지 많아지면 windowing 추가하면 됨)
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))
</script>

<style scoped>
.pager {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 18px 0 24px;
}

/* 기본 알약 버튼 */
.pg-btn {
  padding: 10px 18px;
  border-radius: 999px;
  border: 2px solid var(--border);
  background: #fff;
  color: #4a3b2a;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  transition: transform .02s ease;
}
.pg-btn:active { transform: translateY(1px); }

/* 현재 페이지(꽉 찬 알약) */
.pg-btn.is-active {
  background: #b87445;   /* Figma 톤의 브라운 */
  color: #fff;
  border-color: #b87445;
}

/* 비활성 */
.pg-btn[disabled] {
  opacity: .45;
  cursor: not-allowed;
}
</style>
