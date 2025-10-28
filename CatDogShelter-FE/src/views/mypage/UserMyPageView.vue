<template>
  <div class="user-mypage">
    <div class="page-header">
      <h1 class="page-title">마이페이지</h1>
      <p class="page-subtitle">내 정보와 활동 내역을 확인하세요</p>
    </div>

    <div class="mypage-container">
      <!-- 좌측 영역 -->
      <div class="left-section">
        <!-- 프로필 카드 -->
        <div class="profile-card">
        <div class="profile-image">
  {{ user?.profileEmoji || '👤' }}
</div>

<h2 class="user-name">{{ user?.userName || '' }}</h2>

<div class="info-item">
  <span class="icon">✉️</span>
  <span>{{ user?.userAccount || '' }}</span>
</div>

<div class="info-item">
  <span class="icon">📞</span>
  <span>{{ user?.phone || '' }}</span>
</div>

<div class="info-item">
  <span class="icon">📍</span>
  <span>{{ user?.address || '' }}</span>
</div>

<div class="info-item">
  <span class="icon">📅</span>
  <span>가입일: {{ user?.createdAt || '' }}</span>
</div>


          <button class="edit-btn" @click="editProfile">내 정보 수정</button>
          <button class="message-btn" @click="goToMessages">내 쪽지</button>
          <button class="logout-btn" @click="logout">로그아웃</button>
        </div>

        <!-- 댕냥히어로즈 등급 -->
        <div class="hero-card">
          <div class="hero-header">
            <span class="hero-emoji">⭐</span>
            <span class="hero-label">댕냥히어로즈 레벨</span>
          </div>
          <div class="hero-level">
            <div class="level-number">#{{ heroInfo.rank }}</div>
            <div class="level-text">이번달 나의 랭킹</div>
          </div>
          <button class="hero-btn" @click="goToHeroes">댕냥히어로즈 확인 보기</button>
        </div>
      </div>

      <!-- 우측 영역 -->
      <div class="right-section">
        <!-- 통계 카드 -->
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.posts }}개</div>
              <div class="stat-label">내가 작성한 글</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">❤️</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.likes }}개</div>
              <div class="stat-label">받은 좋아요</div>
            </div>
          </div>
        </div>

        <!-- 내가 작성한 게시글 보기 -->
        <div class="posts-section">
          <h3 class="section-title">내가 작성한 게시글 보기</h3>
          <div class="posts-list">
            <div 
              v-for="post in myPosts" 
              :key="post.id" 
              class="post-item"
              @click="goToPost(post.id)"
            >
              <div class="post-header">
                <span class="post-category">{{ post.category }}</span>
                <h4 class="post-title">{{ post.title }}</h4>
              </div>
              <div class="post-stats">
                <span class="stat-item">📅 {{ post.date }}</span>
                <span class="stat-item">👁️ {{ post.views }}</span>
                <span class="stat-item">❤️ {{ post.likes }}</span>
              </div>
            </div>

            <div v-if="myPosts.length === 0" class="no-posts">
              아직 작성한 게시글이 없습니다.
            </div>
          </div>

          <!-- 페이지네이션 -->
          <div class="pagination" v-if="myPosts.length > 0">
            <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
              ‹ 이전
            </button>
            <span class="page-number">{{ currentPage }}</span>
            <button class="page-btn" @click="nextPage" :disabled="currentPage >= totalPages">
              다음 ›
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ✅ JSON 데이터 (이댕냥으로 변경)
const myPageData = ref({
  user: {
    profileEmoji: '(=ↀωↀ=)✧',  // 이댕냥 느낌나는 이모지로 바꿈 😼
    userName: '이댕냥',
    userAccount: 'catdog@dangnyang.com',
    phone: '010-0000-0000',
    address: '댕냥시 보호센터구',
    createdAt: '2025-01-01'
  },
  heroInfo: {
    rank: 5
  },
  stats: {
    posts: 12,
    likes: 36
  },
  myPosts: [
    {
      id: 1,
      category: '입양게시판',
      title: '댕냥이 친구를 찾아요!',
      date: '2025-10-21',
      views: 241,
      likes: 19
    }
  ]
})

const user = myPageData.value.user
const heroInfo = myPageData.value.heroInfo
const stats = myPageData.value.stats
const myPosts = myPageData.value.myPosts

const currentPage = ref(1)
const totalPages = ref(1)

function editProfile() { router.push('/mypage/edit') }
function goToMessages() { router.push('/mypage/messages') }
function goToHeroes() { router.push('/heroes') }
function goToPost(id) { router.push(`/adoption/${id}`) }
function prevPage() { if (currentPage.value > 1) currentPage.value-- }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }

function logout() {
  alert("로그아웃 되었어요! 🐾")
  router.push('/')
}
</script>


<style scoped>
.user-mypage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #faf8f5;
  min-height: 100vh;
}

/* 페이지 헤더 */
.page-header {
  margin-bottom: 40px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 1rem;
  color: #8b7355;
  margin: 0;
}

/* 메인 컨테이너 */
.mypage-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* 좌측 영역 */
.left-section {
  flex: 0 0 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 프로필 카드 */
.profile-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.profile-image {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f0b762;
  background: #f5f0e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 8px 0;
}

.user-badge {
  display: inline-block;
  padding: 6px 16px;
  background: #f0e8dc;
  color: #8b7355;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 24px;
}

.contact-info {
  text-align: left;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 0.9rem;
  color: #6b5744;
  border-bottom: 1px solid #f5f0e8;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .icon {
  font-size: 1.1rem;
}

.edit-btn,
.message-btn,
.logout-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 8px;
}

.edit-btn {
  background: white;
  border: 2px solid #f0b762;
  color: #f0b762;
}

.edit-btn:hover {
  background: #f0b762;
  color: white;
}

.message-btn {
  background: white;
  border: 2px solid #8b7355;
  color: #8b7355;
}

.message-btn:hover {
  background: #8b7355;
  color: white;
}

.logout-btn {
  background: white;
  border: 2px solid #e8e0d5;
  color: #8b7355;
}

.logout-btn:hover {
  background: #f5f0e8;
}

/* 히어로 카드 */
.hero-card {
  background: linear-gradient(135deg, #fff4e6 0%, #ffe8cc 100%);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.hero-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.hero-emoji {
  font-size: 1.5rem;
}

.hero-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #8b7355;
}

.hero-level {
  margin-bottom: 20px;
}

.level-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #c89446;
  margin-bottom: 4px;
}

.level-text {
  font-size: 0.9rem;
  color: #8b7355;
}

.hero-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(240, 183, 98, 0.3);
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 183, 98, 0.4);
}

/* 우측 영역 */
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 통계 카드 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f6f2;
  border-radius: 16px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #8b7355;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b5744;
}

/* 게시글 섹션 */
.posts-section {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 20px 0;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.post-item {
  padding: 20px;
  background: #fafaf8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #f5f0e8;
}

.post-item:hover {
  background: #f5f0e8;
  transform: translateX(4px);
  border-color: #e8e0d5;
}

.post-header {
  margin-bottom: 12px;
}

.post-category {
  display: inline-block;
  padding: 4px 10px;
  background: #f0e8dc;
  color: #8b7355;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.post-title {
  font-size: 1rem;
  font-weight: 600;
  color: #3d2f1f;
  margin: 8px 0 0 0;
}

.post-stats {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: #8b7355;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.no-posts {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 0.95rem;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #f5f0e8;
}

.page-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e8e0d5;
  border-radius: 8px;
  color: #6b5744;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #f5f0e8;
  border-color: #d4c4b0;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-number {
  padding: 8px 16px;
  background: #f0b762;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

/* 반응형 */
@media (max-width: 1024px) {
  .mypage-container {
    flex-direction: column;
  }

  .left-section {
    flex: 1;
    width: 100%;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .user-mypage {
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .profile-card {
    padding: 24px;
  }

  .profile-image {
    width: 100px;
    height: 100px;
    font-size: 2rem;
  }

  .user-name {
    font-size: 1.3rem;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .hero-card {
    padding: 24px;
  }

  .level-number {
    font-size: 2rem;
  }
}
</style>