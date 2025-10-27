<template>
  <div class="container">
    <header class="page-header">
      <h2 class="title">입양 게시판</h2>
      <p class="subtitle">새로운 가족을 기다리는 반려동물들을 만나보세요 🐶🐱</p>
    </header>

    <AdoptionFilter
      v-model:animalType="filters.animalType"
      v-model:sortType="filters.sortType"
      v-model:keyword="filters.keyword"
      v-model:sidoName="filters.sidoName"
      v-model:sigunguName="filters.sigunguName"
      @update="loadPosts"
    />

    <div class="controls">
      <div class="post-count">
        총 <strong>{{ totalCount }}</strong>개의 게시글
      </div>
      <select v-model="filters.sortType" @change="loadPosts" class="sort-select">
        <option value="">최신순</option>
        <option value="view">조회순</option>
        <option value="liked">좋아요순</option>
      </select>
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
  sidoName: '',
  sigunguName: ''
});

async function loadPosts(page = currentPage.value) {
  loading.value = true;
  currentPage.value = page; // 현재 페이지

  try {
    const url = new URL(`http://localhost:8000/post-service/adoption-post/board`);
    
    // 모든 요청에 공통 파라미터 추가
    url.searchParams.append("page", page - 1);
    url.searchParams.append("size", 8);

    // 정렬 조건
    if (filters.sortType) {
      url.searchParams.append("sortType", filters.sortType);
    }

    // 키워드 검색
    if (filters.keyword.trim()) {
      url.pathname = "/post-service/adoption-post/search/keyword";
      url.searchParams.append("keyword", filters.keyword);
      url.searchParams.append("searchType", "title");
    }

    // 조건 검색
    if (filters.animalType || filters.sidoName || filters.sigunguName) {
      url.pathname = "/post-service/adoption-post/search/condition";

      if (filters.animalType)
        url.searchParams.append("animalType", filters.animalType);

      if (filters.sidoName)
        url.searchParams.append("sidoName", filters.sidoName);

      if (filters.sigunguName)
        url.searchParams.append("sigunguName", filters.sigunguName);
    }

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("게시글 로드 실패");

    const data = await res.json();

    // Pagination 응답 방식에 따라 처리
    if (data.content) {
      posts.value = data.content;
      totalCount.value = data.totalElements;
      totalPages.value = data.totalPages;
    } else {
      posts.value = data;
      totalCount.value = data.length;
      totalPages.value = Math.ceil(data.length / 8);
    }

  } catch (e) {
    console.error("게시글 조회 실패:", e);
    posts.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
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

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0 20px 0;
}

.post-count {
  font-size: 14px;
  color: #666;
}

.post-count strong {
  color: #4a3b2a;
  font-weight: 700;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  background: white;
  cursor: pointer;
  outline: none;
}

.sort-select:focus {
  border-color: #d0c9b8;
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .container {
    padding: 20px 12px;
  }
  
  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
  
  .controls {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>