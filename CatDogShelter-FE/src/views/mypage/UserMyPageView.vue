<template>
  <div class="user-mypage">
    <div class="page-header">
      <h1 class="page-title">마이페이지</h1>
      <p class="page-subtitle">내 정보와 활동 내역을 확인하세요</p>
    </div>

    <div v-if="loading" class="state-card">
      <div class="spinner"></div>
      <p class="state-text">마이페이지 정보를 불러오는 중이에요...</p>
    </div>

    <div v-else class="mypage-container">
      <section class="left-section" v-if="user">
        <article class="profile-card">
          <div class="profile-headline">
            <div class="profile-image">{{ user.profileEmoji || '🐾' }}</div>
            <div class="profile-text">
              <h2 class="user-name">{{ user.userName }}</h2>
              <span class="profile-badge">댕냥발자국</span>
            </div>
          </div>

          <ul class="profile-info">
            <li class="info-item">
              <img class="info-icon" :src="emailIconUrl" alt="이메일 아이콘" />
              <span>{{ user.userAccount }}</span>
            </li>
            <li class="info-item">
              <img class="info-icon" :src="phoneIconUrl" alt="전화 아이콘" />
              <span>{{ user.phone }}</span>
            </li>
            <li class="info-item">
              <img class="info-icon" :src="locationIconUrl" alt="위치 아이콘" />
              <span>{{ user.address }}</span>
            </li>
            <li class="info-item">
              <img class="info-icon" :src="calendarIconUrl" alt="달력 아이콘" />
              <span>가입일: {{ user.createdAt }}</span>
            </li>
          </ul>

          <div class="profile-actions">
            <button class="btn edit-btn" @click="editProfile">내 정보 수정</button>
            <button class="btn message-btn" @click="goToMessages">내 쪽지</button>
            <button class="btn logout-btn" @click="logout">로그아웃</button>
          </div>
        </article>

        <article class="hero-card">
          <div class="hero-content">
            <p class="hero-title">⋆｡ﾟ{{ heroInfo.label || '이달의댕냥 히어로즈' }}｡⋆</p>
            <div class="hero-rank">#{{ heroInfo.rank }}</div>
          </div>
          <div class="card-footer">
            <button class="hero-btn" @click="goToHeroes">댕냥히어로즈 랭킹 보기</button>
          </div>
        </article>
      </section>

      <section class="right-section" v-if="user">
        <div class="stats-cards">
          <article class="stat-card">
            <img class="stat-icon" :src="postIconUrl" alt="글 아이콘" />
            <p class="stat-number">{{ postCountLabel }}</p>
            <p class="stat-label">내가 작성한 글</p>
          </article>
          <article class="stat-card">
            <img class="stat-icon" :src="heartIconUrl" alt="하트 아이콘" />
            <p class="stat-number">{{ likeCountLabel }}</p>
            <p class="stat-label">받은 좋아요</p>
          </article>
        </div>

        <section class="posts-section">
          <h3 class="section-title">내가 작성한 게시글 보기</h3>

          <div v-if="displayedPosts.length" class="posts-list">
            <article
              v-for="post in displayedPosts"
              :key="post.id"
              class="post-item"
              @click="goToPost(post.id)"
            >
              <div class="post-wrapper">
                <div class="post-top">
                  <span class="post-category">{{ post.category }}</span>
                  <div class="post-metrics">
                    <span class="metric"><span class="metric-text">👁</span>{{ post.views }}</span>
                    <span class="metric">
                      <img class="metric-icon" :src="heartIconUrl" alt="하트 아이콘" />
                      {{ post.likes }}
                    </span>
                  </div>
                </div>
                <h4 class="post-title">{{ post.title }}</h4>
                <div class="post-footer">
                  <span class="post-date">{{ post.date }}</span>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="no-posts">아직 작성한 게시글이 없어요.</div>

          <div class="card-footer">
            <div class="pagination">
              <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">〈 이전</button>
              <span class="page-number">{{ currentPage }}</span>
              <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">다음 〉</button>
            </div>
          </div>
        </section>

        <p v-if="error" class="helper-text">* JSON 서버 연결에 실패하여 로컬 데이터를 표시하고 있어요.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import localDb from '@/assets/data/db.json'
import emailIconUrl from '@/assets/이메일아이콘.svg'
import phoneIconUrl from '@/assets/전화아이콘.svg'
import locationIconUrl from '@/assets/위치아이콘.svg'
import calendarIconUrl from '@/assets/달력아이콘.svg'
import heartIconUrl from '@/assets/하트 아이콘.svg'
import postIconUrl from '@/assets/글아이콘.svg'

const router = useRouter()

const loading = ref(true)
const error = ref(false)
const user = ref(null)
const stats = ref({ posts: 0, likes: 0 })
const heroInfo = ref({ rank: 0, label: '' })
const myPosts = ref([])

const POSTS_PER_PAGE = 5
const currentPage = ref(1)

const applyData = data => {
  if (!data) return
  user.value = {
    profileEmoji: '',
    badgeLabel: '',
    userName: '',
    userAccount: '',
    phone: '',
    address: '',
    createdAt: '',
    ...(data.user || {})
  }
  stats.value = {
    posts: 0,
    likes: 0,
    ...(data.stats || {})
  }
  heroInfo.value = {
    rank: 0,
    label: '',
    ...(data.heroInfo || {})
  }
  myPosts.value = Array.isArray(data.myPosts) ? data.myPosts : []
  currentPage.value = 1
}

const fetchUserMypage = async () => {
  loading.value = true
  error.value = false
  try {
    const response = await fetch('http://localhost:8080/userMypage')
    if (!response.ok) throw new Error('userMypage 요청이 실패했습니다.')
    const data = await response.json()
    applyData(data)
  } catch (err) {
    console.warn('[UserMyPageView] JSON 서버에서 데이터를 가져오지 못했습니다.', err)
    error.value = true
    applyData(localDb.userMypage)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUserMypage)

const totalPages = computed(() => Math.max(1, Math.ceil(myPosts.value.length / POSTS_PER_PAGE)))
const displayedPosts = computed(() => {
  const start = (currentPage.value - 1) * POSTS_PER_PAGE
  return myPosts.value.slice(start, start + POSTS_PER_PAGE)
})

watch(totalPages, value => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})

const postCountLabel = computed(() => `${stats.value.posts}개`)
const likeCountLabel = computed(() => `${stats.value.likes.toString().padStart(2, '0')}개`)

function editProfile() {
  router.push('/mypage/edit')
}

function goToMessages() {
  router.push('/mypage/messages')
}

function goToHeroes() {
  router.push('/heroes')
}

function goToPost(id) {
  router.push(`/adoption/${id}`)
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function logout() {
  alert('로그아웃 되었습니다!')
  router.push('/')
}
</script>

<style scoped>
.user-mypage {
  max-width: 1180px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  background: #f6f1ea;
  min-height: 100vh;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 6px;
}

.page-subtitle {
  font-size: 1rem;
  color: #8b7355;
  margin: 0;
}

.state-card {
  background: #fffdf9;
  border-radius: 20px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #6b5744;
  box-shadow: 0 10px 30px rgba(61, 47, 31, 0.08);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f2d6a2;
  border-top-color: #cb8b45;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.state-text {
  margin: 0;
  font-weight: 600;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.mypage-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.left-section {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  background: #fffdfa;
  border-radius: 22px;
  padding: 32px 28px;
  box-shadow: 0 12px 26px rgba(61, 47, 31, 0.08);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-headline {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.profile-image {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  font-size: 2rem;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b5744;
  align-self: center;
  white-space: nowrap;
  line-height: 1;
}

.profile-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  text-align: left;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3dcb7;
  color: #6b4f2c;
  padding: 6px 18px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.user-name {
  font-size: 1.6rem;
  color: #3d2f1f;
  margin: 0;
  font-weight: 700;
}

.profile-info {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: #5a4735;
}

.info-icon {
  width: 20px;
  height: 20px;
}

.profile-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 47, 31, 0.12);
}

.edit-btn {
  background: linear-gradient(135deg, #f0b762, #e8a54d);
  color: #fff;
}

.message-btn {
  background: #fff;
  border: 1px solid #eadccd;
  color: #6b5744;
}

.logout-btn {
  background: #fdf0eb;
  border: 1px solid #f5d5ca;
  color: #c45a5a;
}

.hero-card {
  background: #fffdfa;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 10px 24px rgba(61, 47, 31, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.hero-title {
  margin: 0;
  font-size: 0.95rem;
  color: #8b7355;
}

.hero-rank {
  font-size: 2.4rem;
  font-weight: 700;
  color: #c58c4a;
}

.card-footer {
  width: 100%;
  border-top: 1px solid #f1e4d5;
  padding-top: 20px;
  display: flex;
  justify-content: center;
}

.hero-btn {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px;
  background: #f7e9d4;
  color: #6b5744;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.hero-btn:hover {
  background: #f2dfc3;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(61, 47, 31, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #5b4634;
}

.stat-icon {
  width: 42px;
  height: 42px;
}

.stat-number {
  font-size: 1.9rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0;
}

.stat-label {
  font-size: 0.95rem;
  color: #8b7355;
  margin: 0;
}

.posts-section {
  background: #ffffff;
  border-radius: 24px;
  padding: 28px 30px;
  box-shadow: 0 12px 28px rgba(61, 47, 31, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #3d2f1f;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-item {
  background: #fdf7ec;
  border: 1px solid #f2e4cf;
  border-radius: 18px;
  padding: 18px 22px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(61, 47, 31, 0.08);
  background: #f8f0df;
}

.post-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.post-category {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #c17a30;
  background: rgba(240, 183, 98, 0.18);
  border-radius: 999px;
}

.post-metrics {
  display: inline-flex;
  gap: 12px;
  color: #8b7355;
  font-size: 0.85rem;
}

.metric {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.metric-icon {
  width: 16px;
  height: 16px;
}

.metric-text {
  font-size: 1rem;
}

.post-title {
  margin: 0;
  font-size: 1.05rem;
  color: #3f2d1c;
  font-weight: 700;
}

.post-footer {
  display: flex;
  justify-content: flex-start;
  font-size: 0.85rem;
  color: #9c8369;
}

.post-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.no-posts {
  text-align: center;
  padding: 42px 20px;
  background: #f9f3eb;
  border-radius: 16px;
  border: 1px dashed #eadccd;
  color: #8b7355;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.page-btn {
  border: 1px solid #eadccd;
  background: #f8f1e6;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 0.9rem;
  color: #6b5744;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.page-btn:hover:enabled {
  background: #f0e0cc;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.page-number {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #f0b762;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.helper-text {
  margin: -6px 0 0;
  font-size: 0.82rem;
  color: #b58a54;
  text-align: right;
}

@media (max-width: 1024px) {
  .mypage-container {
    flex-direction: column;
  }

  .left-section {
    width: 100%;
    flex-direction: row;
    align-items: stretch;
  }

  .left-section > * {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .left-section {
    flex-direction: column;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .posts-section {
    padding: 22px 20px;
  }
}
</style>
