<template>
  <nav class="pagination">
    <button
      class="nav"
      :disabled="currentPage <= 1"
      @click="go(currentPage - 1)"
    >
      이전
    </button>

    <button
      v-for="p in pages"
      :key="p"
      class="page"
      :class="{ active: p === currentPage }"
      @click="go(p)"
    >
      {{ p }}
    </button>

    <button
      class="nav"
      :disabled="currentPage >= totalPages"
      @click="go(currentPage + 1)"
    >
      다음
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true }, // 1-based
  totalPages:  { type: Number, required: true }
})
const emit = defineEmits(['page-change'])

function go(p) {
  // 가드: 범위 밖 클릭 방지
  if (p < 1 || p > props.totalPages || p === props.currentPage) return
  emit('page-change', p)
}

// 페이지 버튼 배열 (1..totalPages)
const pages = computed(() => {
  // 페이지 수가 많아질 경우 간단한 window (예: 1 ... 3 4 5 ... N)로 바꾸고 싶으면 여기서 로직 확장
  return Array.from({ length: props.totalPages }, (_, i) => i + 1)
})
</script>

<style scoped>
.pagination { display:flex; gap:8px; justify-content:center; align-items:center; }
.page, .nav {
  padding: 6px 10px; border:1px solid #ddd; background:#fff; border-radius:8px; cursor:pointer;
}
.page.active { background:#4a3b2a; color:white; border-color:#4a3b2a; }
.nav:disabled { opacity:.4; cursor:not-allowed; }
</style>
