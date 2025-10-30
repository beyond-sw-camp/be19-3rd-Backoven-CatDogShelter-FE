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
        <!-- 상단 우측 게시글 신고 버튼 -->
        <div class="post-actions">
          <button class="report-btn" @click="reportPost">
            <span class="report-icon">🚨</span> 게시글 신고
          </button>
        </div>

        <!-- 카테고리 -->
        <div class="category-badge">{{ review.companyName }}</div>

        <!-- 제목 -->
        <h1 class="detail-title">{{ review.title }}</h1>

        <!-- 메타 정보 -->
        <div class="meta-info">
          <div class="author-info">
            <div class="author-wrapper">
              <span class="author-icon">👤</span>
              <span class="author-name" @click.stop="toggleAuthorMenu">
                {{ review.writer }}
              </span>
              <!-- 작성자 이름 토글 메뉴 -->
              <div v-if="showAuthorMenu" class="author-menu" @click.stop>
                <button class="author-menu-item" @click="viewProfileInfo">
                  <span class="menu-icon">👤</span> 회원정보보기
                </button>
                <button class="author-menu-item" @click="sendMessage">
                  <span class="menu-icon">✉️</span> 쪽지보내기
                </button>
              </div>
            </div>
            <span class="date">{{ review.createdAt }}</span>
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

        <!-- 대표 이미지 (files 배열의 첫 번째 이미지) -->
        <div class="content-image" v-if="review.files && review.files.length > 0">
          <img :src="getImageUrl(review.files[0])" :alt="review.title" />
        </div>

        <!-- 본문 -->
        <div class="content-body">
          <p style="white-space: pre-line;">{{ review.detailContent || review.content }}</p>
        </div>

        <!-- 상세 이미지들 (files 배열의 나머지 이미지들) -->
        <div v-if="review.files && review.files.length > 1" class="detail-images">
          <img 
            v-for="(img, index) in review.files.slice(1)" 
            :key="index"
            :src="getImageUrl(img)" 
            :alt="`상세 이미지 ${index + 2}`"
            class="detail-image"
          />
        </div>

        <!-- 좋아요 & 공유하기 버튼 -->
        <div class="action-section">
          <button 
            class="like-btn" 
            :class="{ liked: isLiked }"
            @click="toggleLike"
          >
            <span class="like-icon">{{ isLiked ? '❤️' : '♡' }}</span>
            좋아요 {{ review.likes }}
          </button>
          <button class="share-btn" @click="openShareModal">
            <span class="share-icon">🔗</span>
            공유하기
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
              <div class="comment-avatar">{{ comment.writer.charAt(0) }}</div>
              <div class="comment-content">
                <div class="comment-header">
                  <div class="comment-author-wrapper">
                    <span class="comment-author" @click.stop="toggleCommentAuthorMenu(comment.id)">
                      {{ comment.writer }}
                    </span>
                    <!-- 댓글 작성자 토글 메뉴 -->
                    <div v-if="activeCommentMenu === comment.id" class="author-menu comment-menu" @click.stop>
                      <button class="author-menu-item" @click="viewCommentProfileInfo(comment)">
                        <span class="menu-icon">👤</span> 회원정보보기
                      </button>
                      <button class="author-menu-item" @click="sendCommentMessage(comment)">
                        <span class="menu-icon">✉️</span> 쪽지보내기
                      </button>
                    </div>
                  </div>
                  <span class="comment-date">{{ comment.createdAt }}</span>
                  <button class="comment-report-btn" @click="reportComment(comment.id)">
                    <span class="report-icon">🚨</span> 신고
                  </button>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
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


    <!-- 공유하기 모달 -->
    <ShareModal v-model="showShareModal" :review-id="reviewId" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ShareModal from '@/components/share/ShareModal.vue'

const router = useRouter()
const route = useRoute()

// 이미지 경로를 실제 이미지 URL로 변환하는 함수
const getImageUrl = (filePath) => {
  if (!filePath) return ''
  const fileName = filePath.split('/').pop()
  return `/volunteer/${fileName}`
}

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

// 작성자 토글 메뉴
const showAuthorMenu = ref(false)
const activeCommentMenu = ref(null)

// 공유하기 모달
const showShareModal = ref(false)

// 외부 클릭 감지를 위한 함수
const handleClickOutside = (event) => {
  const authorMenus = document.querySelectorAll('.author-menu')
  let clickedInside = false
  
  authorMenus.forEach(menu => {
    if (menu.contains(event.target)) {
      clickedInside = true
    }
  })
  
  const authorNames = document.querySelectorAll('.author-name, .comment-author')
  authorNames.forEach(name => {
    if (name.contains(event.target)) {
      clickedInside = true
    }
  })
  
  if (!clickedInside) {
    showAuthorMenu.value = false
    activeCommentMenu.value = null
  }
}

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
    console.log('받아온 데이터:', data)
    console.log('찾으려는 ID:', reviewId.value, '타입:', typeof reviewId.value)
    
    // 해당 id의 데이터 찾기
    const foundReview = data.find(item => item.id == reviewId.value)
    
    if (foundReview) {
      review.value = foundReview
      
      // 댓글 목록 설정
      comments.value = foundReview.commentList || []
      
      // 이전/다음 글 설정
      const currentIndex = data.findIndex(item => item.id == reviewId.value)
      
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
  document.addEventListener('click', handleClickOutside)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

// 댓글 작성 (JSON Server에 실제 등록)
async function submitComment() {
  if (!newComment.value.trim()) {
    alert('댓글 내용을 입력해주세요.')
    return
  }

  try {
    // 새 댓글 객체 생성
    const commentData = {
      id: Date.now(), // 임시 ID (실제로는 서버에서 생성)
      writer: '박정원', // 실제로는 로그인한 사용자 정보
      content: newComment.value,
      createdAt: new Date().toISOString().split('T')[0] + ' ' + 
                 new Date().toTimeString().split(' ')[0].substring(0, 5)
    }

    // 기존 댓글 목록에 새 댓글 추가
    const updatedCommentList = [...comments.value, commentData]
    
    // JSON Server에 PATCH 요청으로 댓글 목록 업데이트
    const response = await fetch(`http://localhost:3000/review/${reviewId.value}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentList: updatedCommentList,
        comments: updatedCommentList.length // 댓글 수도 업데이트
      })
    })

    if (!response.ok) {
      throw new Error('댓글 등록에 실패했습니다.')
    }

    // 로컬 상태 업데이트
    comments.value = updatedCommentList
    review.value.comments = updatedCommentList.length
    newComment.value = ''
    
    alert('댓글이 등록되었습니다.')
  } catch (err) {
    console.error('댓글 등록 실패:', err)
    alert('댓글 등록에 실패했습니다. 다시 시도해주세요.')
  }
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

// 작성자 토글 메뉴
function toggleAuthorMenu() {
  showAuthorMenu.value = !showAuthorMenu.value
  activeCommentMenu.value = null
}

function toggleCommentAuthorMenu(commentId) {
  if (activeCommentMenu.value === commentId) {
    activeCommentMenu.value = null
  } else {
    activeCommentMenu.value = commentId
    showAuthorMenu.value = false
  }
}

function viewProfile() {
  console.log('프로필 보기')
  showAuthorMenu.value = false
}

function viewProfileInfo() {
  console.log('회원정보 보기')
  showAuthorMenu.value = false
}

function sendMessage() {
  console.log('쪽지 보내기')
  showAuthorMenu.value = false
}

function viewCommentProfile(comment) {
  console.log('댓글 작성자 프로필 보기:', comment.writer)
  activeCommentMenu.value = null
}

function viewCommentProfileInfo(comment) {
  console.log('댓글 작성자 회원정보 보기:', comment.writer)
  activeCommentMenu.value = null
}

function sendCommentMessage(comment) {
  console.log('댓글 작성자에게 쪽지 보내기:', comment.writer)
  activeCommentMenu.value = null
}

// 신고 기능
function reportPost() {
  if (confirm('이 게시글을 신고하시겠습니까?')) {
    alert('게시글이 신고되었습니다. 관리자가 확인 후 조치하겠습니다.')
  }
}

function reportComment(commentId) {
  if (confirm('이 댓글을 신고하시겠습니까?')) {
    alert('댓글이 신고되었습니다. 관리자가 확인 후 조치하겠습니다.')
  }
}


// 공유하기 모달 (ShareModal 컴포넌트로 분리)
function openShareModal() {
  showShareModal.value = true
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

.back-icon {
  font-size: 1.2rem;
}

/* 상세 콘텐츠 */
.detail-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
}

/* 게시글 신고 버튼 */
.post-actions {
  position: absolute;
  top: 24px;
  right: 24px;
}

.report-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #e8e0d5;
  border-radius: 8px;
  color: #e74c3c;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.report-btn:hover {
  background: #ffebee;
  border-color: #e74c3c;
}

.report-icon {
  font-size: 0.9rem;
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
  padding-right: 100px;
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

.author-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-icon {
  font-size: 1rem;
}

.author-name {
  font-weight: 600;
  color: #3d2f1f;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.author-name:hover {
  background: #f5f0e8;
}

/* 작성자 토글 메뉴 */
.author-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 160px;
  overflow: hidden;
}

.comment-menu {
  left: auto;
  right: 0;
}

.author-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border: none;
  border-bottom: 1px solid #f5f0e8;
  color: #3d2f1f;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

.author-menu-item:last-child {
  border-bottom: none;
}

.author-menu-item:hover {
  background: #f5f0e8;
}

.menu-icon {
  font-size: 1rem;
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

.detail-images {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.detail-image {
  width: 100%;
  height: auto;
  border-radius: 16px;
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

/* 좋아요 & 공유하기 섹션 */
.action-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 24px 0;
  border-top: 1px solid #f5f0e8;
  border-bottom: 1px solid #f5f0e8;
  margin-bottom: 32px;
}

.like-btn,
.share-btn {
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

.share-btn:hover {
  border-color: #f0b762;
  background: #fef9f0;
}

.like-btn.liked {
  background: #ffe8e8;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.like-icon,
.share-icon {
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

.comment-author-wrapper {
  position: relative;
}

.comment-author {
  font-weight: 600;
  color: #3d2f1f;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.comment-author:hover {
  background: #f5f0e8;
}

.comment-date {
  font-size: 0.85rem;
  color: #8b7355;
}

.comment-report-btn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid #e8e0d5;
  border-radius: 6px;
  color: #e74c3c;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
}

.comment-report-btn:hover {
  background: #ffebee;
  border-color: #e74c3c;
}

.comment-text {
  font-size: 0.95rem;
  color: #3d2f1f;
  line-height: 1.6;
  margin: 0 0 8px 0;
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

@media (max-width: 768px) {
  .review-detail-page {
    padding: 20px 16px;
  }

  .detail-content {
    padding: 24px;
  }

  .detail-title {
    font-size: 1.5rem;
    padding-right: 0;
  }

  .post-actions {
    position: static;
    margin-bottom: 16px;
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

  .action-section {
    flex-direction: column;
  }

  .like-btn,
  .share-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>