<template>
  <div class="review-detail-page">
    <div class="detail-container">
      <!-- 뒤로가기 버튼 -->
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
        목록으로 돌아가기
      </button>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">후기를 불러오는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="error-container">
        <p class="error-text">❌ {{ error }}</p>
        <button class="retry-btn" @click="fetchReviewDetail">다시 시도</button>
      </div>

      <!-- 상세 콘텐츠 -->
      <div v-else-if="review" class="detail-content">
        <!-- 카테고리 -->
        <div class="category-badge">{{ review.category }}</div>

        <!-- 제목 -->
        <h1 class="detail-title">{{ review.title }}</h1>

        <!-- 메타 정보 -->
        <div class="meta-info">
          <div class="author-info">
            <span class="author-icon">👤</span>
            <span class="author-name">{{ review.author }}</span>
            <span class="date">{{ review.date }}</span>
          </div>
          <div class="stats-info">
            <span class="stat-item">
              <span class="icon">❤️</span>
              {{ review.likes }}
            </span>
            <span class="stat-item">
              <span class="icon">💬</span>
              {{ review.comments }}
            </span>
            <span class="stat-item">
              <span class="icon">👁️</span>
              {{ review.views }}
            </span>
          </div>
        </div>

        <!-- 이미지 -->
        <div class="content-image" v-if="review.image">
          <img :src="review.image" :alt="review.title" />
        </div>

        <!-- 본문 -->
        <div class="content-body">
          <p style="white-space: pre-line;">{{ review.detailContent || review.content }}</p>
        </div>

        <!-- 상세 이미지들 -->
        <div v-if="review.detailImages && review.detailImages.length > 0" class="detail-images">
          <img 
            v-for="(img, index) in review.detailImages" 
            :key="index"
            :src="img" 
            :alt="`상세 이미지 ${index + 1}`"
            class="detail-image"
          />
        </div>

        <!-- 좋아요 버튼 -->
        <div class="like-section">
          <button 
            class="like-btn" 
            :class="{ liked: isLiked }"
            @click="toggleLike"
          >
            <span class="like-icon">{{ isLiked ? '❤️' : '♡' }}</span>
            좋아요 {{ review.likes }}
          </button>
        </div>

        <!-- 댓글 섹션 -->
        <div class="comment-section">
          <h3 class="comment-title">댓글 <span class="comment-count">{{ comments.length }}</span></h3>

          <!-- 댓글 목록 -->
          <div class="comment-list">
            <div 
              v-for="comment in comments" 
              :key="comment.id"
              class="comment-item"
            >
              <div class="comment-avatar">{{ comment.author.charAt(0) }}</div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-date">{{ comment.date }}</span>
                </div>
                <p class="comment-text">{{ comment.text }}</p>
                <button class="reply-btn" @click="replyToComment(comment.id)">
                  💬 답글쓰기
                </button>
              </div>
            </div>
          </div>

          <!-- 댓글 입력 -->
          <div class="comment-input-section">
            <textarea 
              v-model="newComment"
              class="comment-input"
              placeholder="댓글을 입력하세요"
              rows="3"
            ></textarea>
            <button class="comment-submit-btn" @click="submitComment">
              댓글 작성
            </button>
          </div>
        </div>

        <!-- 이전/다음 글 네비게이션 -->
        <div class="post-navigation">
          <button 
            class="nav-btn prev" 
            @click="goToPrevPost"
            v-if="prevPost"
          >
            <span class="nav-label">이전 글</span>
            <span class="nav-title">{{ prevPost.title }}</span>
          </button>
          <button 
            class="nav-btn next" 
            @click="goToNextPost"
            v-if="nextPost"
          >
            <span class="nav-label">다음 글</span>
            <span class="nav-title">{{ nextPost.title }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 게시글 ID
const reviewId = computed(() => parseInt(route.params.id))

// 좋아요 상태
const isLiked = ref(false)

// 새 댓글
const newComment = ref('')

// 데이터 상태
const review = ref(null)
const loading = ref(true)
const error = ref(null)

// 댓글 목록
const comments = ref([])

// 이전/다음 글
const prevPost = ref(null)
const nextPost = ref(null)

// JSON Server에서 데이터 가져오기
const fetchReviewDetail = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 전체 review 데이터 가져오기
    const response = await fetch('http://localhost:8080/review')
    
    if (!response.ok) {
      throw new Error('데이터를 불러오는데 실패했습니다.')
    }
    
    const data = await response.json()
    
    // 해당 id의 데이터 찾기
    const foundReview = data.find(item => item.id === reviewId.value)
    
    if (foundReview) {
      review.value = foundReview
      
      // 댓글 목록 설정
      comments.value = foundReview.commentList || []
      
      // 이전/다음 글 설정
      const currentIndex = data.findIndex(item => item.id === reviewId.value)
      
      if (currentIndex > 0) {
        prevPost.value = {
          id: data[currentIndex - 1].id,
          title: data[currentIndex - 1].title
        }
      } else {
        prevPost.value = null
      }
      
      if (currentIndex < data.length - 1) {
        nextPost.value = {
          id: data[currentIndex + 1].id,
          title: data[currentIndex + 1].title
        }
      } else {
        nextPost.value = null
      }
      
      console.log('후기 상세 데이터 로드 성공:', review.value)
      console.log('댓글 수:', comments.value.length)
    } else {
      throw new Error('해당 후기를 찾을 수 없습니다.')
    }
  } catch (err) {
    console.error('데이터를 불러오는데 실패했습니다:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(() => {
  fetchReviewDetail()
})

// id가 변경되면 데이터 다시 가져오기
watch(reviewId, () => {
  fetchReviewDetail()
})

function goBack() {
  router.push('/volunteer')
}

function toggleLike() {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    review.value.likes++
  } else {
    review.value.likes--
  }
}

function submitComment() {
  if (!newComment.value.trim()) {
    alert('댓글 내용을 입력해주세요.')
    return
  }

  const comment = {
    id: comments.value.length + 1,
    author: '현재 사용자', // 실제로는 로그인한 사용자 정보
    date: new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    text: newComment.value
  }

  comments.value.push(comment)
  review.value.comments++
  newComment.value = ''
  alert('댓글이 등록되었습니다.')
}

function replyToComment(commentId) {
  console.log('답글 쓰기:', commentId)
  // 답글 기능 구현
}

function goToPrevPost() {
  if (prevPost.value) {
    router.push(`/volunteer/review/${prevPost.value.id}`)
  }
}

function goToNextPost() {
  if (nextPost.value) {
    router.push(`/volunteer/review/${nextPost.value.id}`)
  }
}
</script>

<style scoped>
.review-detail-page {
  background: #faf8f5;
  min-height: 100vh;
  padding: 40px 20px;
}
.detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  color: #6b5744;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 24px;
}

.back-btn:hover {
  background: #f5f0e8;
}

/* 로딩 컨테이너 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f0e8dc;
  border-top: 5px solid #f0b762;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  color: #6b5744;
  font-weight: 600;
}

/* 에러 컨테이너 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 15px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.error-text {
  font-size: 1.2rem;
  color: #d32f2f;
  font-weight: 600;
  margin: 0;
}

.retry-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 183, 98, 0.4);
}

/* 상세 이미지들 */
.detail-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.detail-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
}

/* 뒤로가기 버튼 */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  color: #6b5744;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 24px;
}

.back-btn:hover {
  background: #f5f0e8;
  border-color: #d4c4b0;
}

.back-icon {
  font-size: 1.2rem;
}

/* 상세 콘텐츠 */
.detail-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 카테고리 */
.category-badge {
  display: inline-block;
  padding: 6px 16px;
  background: #f5f0e8;
  color: #6b5744;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 16px;
}

/* 제목 */
.detail-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 20px 0;
  line-height: 1.4;
}

/* 메타 정보 */
.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 2px solid #f5f0e8;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #6b5744;
}

.author-icon {
  font-size: 1rem;
}

.author-name {
  font-weight: 600;
  color: #3d2f1f;
}

.date {
  color: #8b7355;
}

.stats-info {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  color: #6b5744;
}

.stat-item .icon {
  font-size: 1rem;
}

/* 이미지 */
.content-image {
  width: 100%;
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
}

.content-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* 본문 */
.content-body {
  font-size: 1rem;
  line-height: 1.8;
  color: #3d2f1f;
  margin-bottom: 32px;
}

.content-body p {
  margin: 0 0 16px 0;
}

/* 좋아요 섹션 */
.like-section {
  text-align: center;
  padding: 24px 0;
  border-top: 1px solid #f5f0e8;
  border-bottom: 1px solid #f5f0e8;
  margin-bottom: 32px;
}

.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: white;
  border: 2px solid #e8e0d5;
  border-radius: 30px;
  color: #6b5744;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.like-btn:hover {
  border-color: #f0b762;
  background: #fef9f0;
}

.like-btn.liked {
  background: #ffe8e8;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.like-icon {
  font-size: 1.3rem;
}

/* 댓글 섹션 */
.comment-section {
  margin-top: 40px;
}

.comment-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 24px 0;
}

.comment-count {
  color: #f0b762;
  margin-left: 4px;
}

/* 댓글 목록 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0b762;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #3d2f1f;
  font-size: 0.95rem;
}

.comment-date {
  font-size: 0.85rem;
  color: #8b7355;
}

.comment-text {
  font-size: 0.95rem;
  color: #3d2f1f;
  line-height: 1.6;
  margin: 0 0 8px 0;
}

.reply-btn {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  color: #6b5744;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.reply-btn:hover {
  background: #f5f0e8;
  border-color: #d4c4b0;
}

/* 댓글 입력 */
.comment-input-section {
  background: #fafaf8;
  border-radius: 16px;
  padding: 20px;
  margin-top: 32px;
}

.comment-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #3d2f1f;
  background: white;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
  margin-bottom: 12px;
  outline: none;
  transition: all 0.3s;
}

.comment-input::placeholder {
  color: #b8a596;
}

.comment-input:focus {
  border-color: #f0b762;
  box-shadow: 0 0 0 3px rgba(240, 183, 98, 0.1);
}

.comment-submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(240, 183, 98, 0.3);
}

.comment-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 183, 98, 0.4);
}

/* 이전/다음 글 네비게이션 */
.post-navigation {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 2px solid #f5f0e8;
}

.nav-btn {
  padding: 20px;
  background: #fafaf8;
  border: 1px solid #e8e0d5;
  border-radius: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-btn:hover {
  background: #f5f0e8;
  border-color: #d4c4b0;
  transform: translateY(-2px);
}

.nav-btn.next {
  text-align: right;
  align-items: flex-end;
}

.nav-label {
  font-size: 0.85rem;
  color: #8b7355;
  font-weight: 600;
}

.nav-title {
  font-size: 0.95rem;
  color: #3d2f1f;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 반응형 */
@media (max-width: 768px) {
  .review-detail-page {
    padding: 20px 16px;
  }

  .detail-content {
    padding: 24px;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .meta-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .post-navigation {
    grid-template-columns: 1fr;
  }

  .nav-btn.next {
    text-align: left;
    align-items: flex-start;
  }
}
</style>