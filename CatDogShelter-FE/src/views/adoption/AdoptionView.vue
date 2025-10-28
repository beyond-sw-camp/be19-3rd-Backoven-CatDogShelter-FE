<template>
  <div class="container">
    <section class="board-wrap">
      <h1 class="board-title">입양 게시판</h1>
      <p class="board-sub">"새로운 가족을 기다리는 반려동물을 만나보세요 ૮  .    .  ა"</p>
    </section>

  <AdoptionFilter
      v-model:animalType="filters.animalType"
      v-model:sortType="filters.sortType"
      v-model:keyword="filters.keyword"
      v-model:vaccinated="filters.vaccinated"
        v-model:neutered="filters.neutered"
      @update="loadPosts"
    />

<!-- 부모 컴포넌트 -->
<div class="controls">
  <div class="controls-left">

    <div class="post-count">
      총 <strong>{{ totalCount }}</strong>개의 게시글
    </div>
        <select
      v-model="filters.sortType"
      @change="loadPosts(1)"
      class="sort-select"
      aria-label="정렬"
    >
      <option value="">최신순</option>
      <option value="view">조회순</option>
      <option value="liked">추천순</option>
    </select>
  </div>

  <button class="write-btn" @click="goWrite">게시글 등록</button>
</div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>게시글을 불러오는 중...</p>
    </div>

    <div v-else-if="posts.length === 0" class="empty">
      <p>현재 게시글이 없습니다.</p>
    </div>

    <div v-else class="card-container">
      <AdoptionCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>

    <Pagination
      v-if="posts.length > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import AdoptionFilter from '@/components/adoption/AdoptionFilter.vue';
import AdoptionCard from '@/components/adoption/AdoptionCard.vue';
import Pagination from '@/components/adoption/Pagination.vue';

const posts = ref([]);
const loading = ref(false);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const filters = reactive({
  keyword: '',
  sortType: '',
  animalType: '',
  vaccinated: '', // ← 추가
  neutered: ''    // ← 추가
})

async function loadPosts(page = currentPage.value) {
  loading.value = true;
  currentPage.value = page;

  try {
    const url = new URL(`http://localhost:8000/post-service/adoption-post/board`);
    url.searchParams.append("page", page - 1);
    url.searchParams.append("size", 8);

    const hasCondition =
  (filters.animalType && filters.animalType !== '') ||
  (filters.sidoName && filters.sidoName !== '') ||
  (filters.sigunguName && filters.sigunguName !== '');
    const hasKeyword = filters.keyword.trim() !== "";

    // 조건 검색 우선 적용
    if (hasCondition) {
      url.pathname = "/post-service/adoption-post/search/condition";
      if (filters.animalType) url.searchParams.append("animalType", filters.animalType);
      if (filters.sidoName) url.searchParams.append("sidoName", filters.sidoName);
      if (filters.sigunguName) url.searchParams.append("sigunguName", filters.sigunguName);
    }
    // 그 다음 키워드 검색
    else if (hasKeyword) {
      url.pathname = "/post-service/adoption-post/search/keyword";
      url.searchParams.append("keyword", filters.keyword);
      url.searchParams.append("searchType", "title");
    }

    // 정렬 조건 항상 포함
    if (filters.sortType) {
      url.searchParams.append("sortType", filters.sortType);
    }

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Fail loadPosts");

    const data = await res.json();

    posts.value = data.content || data;
    totalCount.value = data.totalElements ?? posts.value.length;
    totalPages.value = data.totalPages ?? Math.ceil(posts.value.length / 8);

  } catch (e) {
    console.error(e);
    posts.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

import { useRouter } from "vue-router";
const router = useRouter();

function goWrite() {
  router.push("/adoption/write");
}
// 페이지 변경 이벤트 처리
function handlePageChange(page) {
  loadPosts(page);
}

onMounted(() => loadPosts(1));
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 20px 0;
  width: 100%;
}

.controls-left {
  display: flex;
  align-items: center;
  gap: 12px;           /* 드롭다운과 카운트 사이 간격 */
}

.sort-select {
  height: 38px;
  border-radius: 10px;
  border: 1px solid #e9e2d7;
  background: #fff;
  padding: 0 10px;
  font-size: 14px;
  color: #453e35;
}

.post-count {
  font-size: 14px;
  color: #666;
}

.write-btn {
  margin-left: auto;   /* 등록 버튼을 오른쪽 끝으로 */
  background: #d8bd89;
  color: #3b342c;
  font-weight: 600;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: .2s;
}
.write-btn:hover { background: #c7a670; }

@media (max-width: 768px) {
  .controls { flex-wrap: wrap; }
  .write-btn { margin-left: 0; width: 100%; }
}


.post-count {
  font-size: 14px;
  color: #666;
}

.post-count strong {
  color: #4a3b2a;
  font-weight: 700;
}



.loading {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d0c9b8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty {
  text-align: center;
  padding: 80px 20px;
  font-size: 16px;
  color: #999;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;   /* ✅ 마지막 줄도 가운데 정렬 */
  gap: 24px;                 /* 카드 간격 */
  margin-bottom: 40px;
  padding-inline: 12px;      /* 양옆 살짝 여백 */
}


.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0 20px;
  width: 100%;
}

/* 버튼 오른쪽 붙이기 */
.write-btn {
  background: #d8bd89;
  color: #3b342c;
  font-weight: 600;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

.write-btn:hover {
  background: #c7a670;
}
.board-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 16px 0;
}

.board-title {
  font-size: 26px;
  font-weight: 800;
  color: #333; /* var(--ink-0) 대응 */
  margin: 4px 0 4px;
}

.board-sub {
  font-size: 13px;
  color: #666; /* var(--ink-2) 대응 */
  margin: 0 0 16px;
}


</style>