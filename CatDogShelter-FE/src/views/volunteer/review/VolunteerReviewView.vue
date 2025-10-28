<template>
  <section class="review-section">
    <div class="review-container">
      <!-- 좌측: 후기 게시판 -->
      <div class="review-left">
        <div class="review-box">
          <div class="review-header">
            <h3 class="review-title">봉사후기게시판</h3>
            <button class="write-btn" @click="goToInsert">후기 작성</button>
          </div>

          <div class="search-filter">
            <select class="sort-select" v-model="searchFilter">
              <option value="">검색 조건</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="writer">작성자</option>
            </select>
            <input 
              type="text" 
              class="search-input" 
              placeholder="검색어를 입력하세요..." 
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">검색</button>
          </div>

          <div class="category-tabs">
            <button class="category-tab active">
              총 {{ filteredReviews.length }} 개의 게시글
            </button>
            <select class="category-select" v-model="sortType" @change="applySorting">
              <option value="all">전체</option>
              <option value="views">조회순</option>
              <option value="latest">최신순</option>
            </select>
          </div>

          <!-- 로딩 상태 -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">후기를 불러오는 중...</p>
          </div>

          <!-- 에러 상태 -->
          <div v-else-if="error" class="error-container">
            <p class="error-text">❌ {{ error }}</p>
            <button class="retry-btn" @click="fetchReviews">다시 시도</button>
          </div>

          <!-- 검색 결과 없음 -->
          <div v-else-if="filteredReviews.length === 0" class="empty-container">
            <p class="empty-text">검색 결과가 없습니다.</p>
          </div>

          <!-- 데이터 표시 -->
          <ul v-else class="review-list">
            <li 
              v-for="review in paginatedReviews" 
              :key="review.id" 
              class="review-item"
              @click="goToDetail(review.id)"
            >
              <div class="review-item-header">
                <img :src="getImageUrl(review.files && review.files[0])" class="review-thumb" alt="후기 이미지" />
                <div class="review-item-content">
                  <div class="review-item-top">
                    <span class="review-category">{{ review.companyName }}</span>
                    <h4 class="review-item-title">{{ review.title }}</h4>
                  </div>
                  <p class="review-item-desc">{{ review.content }}</p>
                  <div class="review-item-meta">
                    <span class="review-author">{{ review.writer }}</span>
                    <span class="review-date">{{ review.createdAt }}</span>
                  </div>
                  <div class="review-item-stats">
                    <span class="stat-item">
                      <span class="stat-icon">♡</span> {{ review.likes }}
                    </span>
                    <span class="stat-item">
                      <span class="stat-icon">💬</span> {{ review.comments }}
                    </span>
                    <span class="stat-item">
                      <span class="stat-icon">👁</span> {{ review.views }}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div class="pagination" v-if="totalPages > 0">
            <button 
              class="page-nav" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >
              이전
            </button>
            <button 
              v-for="page in displayedPages" 
              :key="page"
              class="page-num"
              :class="{ active: page === currentPage }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            <button 
              class="page-nav" 
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      <!-- 우측: 인기 후기 & 최근 댓글 -->
      <div class="review-right">
        <div class="side-box popular-box">
          <h4 class="side-title">인기 후기</h4>
          <ol class="popular-list">
            <li 
              v-for="(item, index) in popularReviews" 
              :key="index" 
              class="popular-item"
              @click="goToDetail(item.id)"
            >
              <span class="popular-rank">{{ index + 1 }}</span>
              <div class="popular-content">
                <p class="popular-title">{{ item.title }}</p>
                <div class="popular-meta">
                  <span class="popular-views">👁 {{ item.views }}</span>
                  <span class="popular-likes">♡ {{ item.likes }}</span>
                </div>
              </div>
            </li>
          </ol>
        </div>

        <div class="side-box comments-box">
          <h4 class="side-title">최근 댓글</h4>
          <ul class="comments-list">
            <li 
              v-for="(comment, index) in recentComments" 
              :key="index" 
              class="comment-item"
              @click="goToCommentPost(comment.postId)"
            >
              <p class="comment-text">{{ comment.text }}</p>
              <div class="comment-meta">
                <span class="comment-post">{{ comment.post }}</span>
                <span class="comment-date">{{ comment.date }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 이미지 경로를 실제 이미지 URL로 변환하는 함수
const getImageUrl = (filePath) => {
  if (!filePath) return '/placeholder-image.jpg'
  const fileName = filePath.split('/').pop()
  return `/volunteer/${fileName}`
}

const searchQuery = ref('')
const searchFilter = ref('') // '', 'title', 'content', 'writer'
const sortType = ref('all')
const loading = ref(true)
const error = ref(null)
const hasSearched = ref(false)

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = 5

// 데이터 (빈 배열로 시작)
const reviews = ref([])
const popularReviews = ref([])
const recentComments = ref([])

// 검색 및 필터링된 리뷰
const filteredReviews = computed(() => {
  let result = [...reviews.value]
  
  // 검색 버튼을 눌렀을 때
  if (hasSearched.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    
    // 검색 조건이 선택되지 않았을 때
    if (!searchFilter.value) {
      return [] // 아무것도 안나오게
    }
    
    // 검색 조건에 따라 필터링
    result = result.filter(review => {
      if (searchFilter.value === 'title') {
        return review.title.toLowerCase().includes(query)
      } else if (searchFilter.value === 'content') {
        return review.content.toLowerCase().includes(query)
      } else if (searchFilter.value === 'writer') {
        return review.writer.toLowerCase().includes(query)
      }
      return false
    })
  } else if (hasSearched.value && !searchQuery.value.trim() && searchFilter.value) {
    // 검색 조건만 선택하고 검색어가 없으면
    return [] // 아무것도 안나오게
  } else if (!hasSearched.value || (!searchQuery.value.trim() && !searchFilter.value)) {
    // 아무 검색조건이 없을 때는 전체 표시
    result = [...reviews.value]
  }
  
  return result
})

// 정렬 적용
const sortedReviews = computed(() => {
  let result = [...filteredReviews.value]
  
  if (sortType.value === 'views') {
    result.sort((a, b) => b.views - a.views)
  } else if (sortType.value === 'latest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// 페이지네이션 적용
const totalPages = computed(() => {
  return Math.ceil(sortedReviews.value.length / itemsPerPage)
})

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedReviews.value.slice(start, end)
})

// 표시할 페이지 번호들
const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxDisplayed / 2))
  let endPage = Math.min(totalPages.value, startPage + maxDisplayed - 1)
  
  if (endPage - startPage < maxDisplayed - 1) {
    startPage = Math.max(1, endPage - maxDisplayed + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

// JSON Server에서 데이터 가져오기
const fetchReviews = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('http://localhost:8080/review')
    
    if (!response.ok) {
      throw new Error('데이터를 불러오는데 실패했습니다.')
    }
    
    const data = await response.json()
    
    reviews.value = data || []
    
    // 인기 후기 생성 (조회수 높은 순)
    popularReviews.value = [...data]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(review => ({
        id: review.id,
        title: review.title,
        views: review.views,
        likes: review.likes
      }))
    
    // 최근 댓글 생성 (모든 게시글의 댓글을 날짜순으로 정렬)
    const allComments = []
    data.forEach(review => {
      if (review.commentList && review.commentList.length > 0) {
        review.commentList.forEach(comment => {
          allComments.push({
            ...comment,
            postId: review.id,
            post: review.title,
            postTitle: review.title
          })
        })
      }
    })
    
    // 날짜순으로 정렬하고 최근 5개만
    recentComments.value = allComments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(comment => ({
        text: comment.content,
        post: comment.post.length > 20 ? comment.post.substring(0, 20) + '...' : comment.post,
        date: getRelativeTime(comment.createdAt),
        postId: comment.postId
      }))
    
    console.log('후기 데이터 로드 성공:', reviews.value.length)
    console.log('최근 댓글:', recentComments.value.length)
  } catch (err) {
    console.error('데이터를 불러오는데 실패했습니다:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 검색 처리
const handleSearch = () => {
  hasSearched.value = true
  currentPage.value = 1 // 검색 시 첫 페이지로
}

// 정렬 적용
const applySorting = () => {
  currentPage.value = 1 // 정렬 변경 시 첫 페이지로
}

// 페이지 변경
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 상대 시간 계산 함수
function getRelativeTime(dateString) {
  const commentDate = new Date(dateString)
  const now = new Date()
  const diffMs = now - commentDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  return dateString.split(' ')[0]
}

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(() => {
  fetchReviews()
})

function goToInsert() {
  router.push('/volunteer/review/insert')
}

function goToDetail(id) {
  router.push(`/volunteer/review/${id}`)
}

function goToCommentPost(postId) {
  router.push(`/volunteer/review/${postId}`)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.review-section {
  background: transparent;
  padding: 0;
}

.review-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* ===== 좌측 영역 ===== */
.review-left {
  flex: 2;
}

.review-box {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.review-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #5c4a35;
  margin: 0;
}

.write-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.write-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(240, 183, 98, 0.4);
}

/* 로딩 컨테이너 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 20px;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0e8dc;
  border-top: 4px solid #f0b762;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1rem;
  color: #6b5744;
  font-weight: 600;
}

/* 에러 컨테이너 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 15px;
  padding: 40px;
}

.error-text {
  font-size: 1.1rem;
  color: #e74c3c;
  font-weight: 600;
  margin: 0;
}

.retry-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(240, 183, 98, 0.4);
}

/* 빈 결과 */
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px;
}

.empty-text {
  font-size: 1.1rem;
  color: #8b7355;
  font-weight: 600;
}

/* 검색 필터 */
.search-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.sort-select,
.category-select {
  padding: 10px 16px;
  border: 1px solid #e8e0d5;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #6b5744;
  background: white;
  cursor: pointer;
  outline: none;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e8e0d5;
  border-radius: 10px;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #f0b762;
  box-shadow: 0 0 0 3px rgba(240, 183, 98, 0.1);
}

.search-btn {
  padding: 10px 20px;
  background: #8b7355;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover {
  background: #6b5744;
}

/* 카테고리 탭 */
.category-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0e8dc;
}

.category-tab {
  padding: 8px 16px;
  background: transparent;
  border: none;
  font-size: 0.9rem;
  color: #6b5744;
  cursor: default;
  font-weight: 600;
}

.category-tab.active {
  color: #f0b762;
}

/* 후기 리스트 */
.review-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.review-item {
  padding: 20px 0;
  border-bottom: 1px solid #f0e8dc;
  cursor: pointer;
  transition: all 0.3s;
}

.review-item:hover {
  background: #fafaf8;
  padding-left: 12px;
  padding-right: 12px;
  margin-left: -12px;
  margin-right: -12px;
  border-radius: 12px;
}

.review-item:last-child {
  border-bottom: none;
}

.review-item-header {
  display: flex;
  gap: 16px;
}

.review-thumb {
  width: 120px;
  height: 90px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.review-item-content {
  flex: 1;
}

.review-item-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.review-category {
  padding: 4px 10px;
  background: #f5f0e8;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #6b5744;
  font-weight: 600;
}

.review-item-title {
  font-size: 1rem;
  font-weight: 600;
  color: #3d2f1f;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-item-desc {
  font-size: 0.85rem;
  color: #8b7355;
  line-height: 1.5;
  margin: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.review-item-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.review-author,
.review-date {
  font-size: 0.8rem;
  color: #999;
}

.review-item-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #8b7355;
}

.stat-icon {
  font-size: 0.9rem;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}

.page-nav,
.page-num {
  padding: 8px 12px;
  background: white;
  border: 1px solid #e8e0d5;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #6b5744;
  cursor: pointer;
  transition: all 0.3s;
}

.page-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-num.active {
  background: #f0b762;
  border-color: #f0b762;
  color: white;
  font-weight: 600;
}

.page-nav:hover:not(:disabled),
.page-num:hover {
  border-color: #f0b762;
}

/* ===== 우측 영역 ===== */
.review-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.side-box {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.side-title {
  font-size: 1rem;
  font-weight: 700;
  color: #5c4a35;
  margin: 0 0 16px 0;
}

/* 인기 후기 */
.popular-list {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: popular-counter;
}

.popular-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f0e8;
  cursor: pointer;
  transition: all 0.2s;
}

.popular-item:hover {
  background: #faf8f5;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 8px;
}

.popular-item:hover .popular-title {
  color: #f0b762;
}

.popular-item:last-child {
  border-bottom: none;
}

.popular-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #f0b762;
  color: white;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.popular-content {
  flex: 1;
}

.popular-title {
  font-size: 0.85rem;
  color: #3d2f1f;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.popular-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #999;
}

/* 최근 댓글 */
.comments-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f0e8;
  cursor: pointer;
  transition: all 0.2s;
}

.comment-item:hover {
  background: #faf8f5;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 8px;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-text {
  font-size: 0.85rem;
  color: #3d2f1f;
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.comment-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #999;
}

/* 반응형 */
@media (max-width: 1024px) {
  .review-container {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .search-filter {
    flex-wrap: wrap;
  }

  .search-input {
    flex: 1 1 100%;
  }

  .review-item-header {
    flex-direction: column;
  }

  .review-thumb {
    width: 100%;
    height: 200px;
  }
}
</style>