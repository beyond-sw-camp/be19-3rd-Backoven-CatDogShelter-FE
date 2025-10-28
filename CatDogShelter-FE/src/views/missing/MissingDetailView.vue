<template>
  <main class="detail-page">
    <div class="detail-inner">
      <!-- 상단 돌아가기 -->
      <button class="back-line" @click="goList">← 목록으로 돌아가기</button>

      <section class="post-card">
        <!-- 카드 헤더 영역 -->
        <header class="post-head">
          <div class="head-left">
            <!-- 뱃지들 -->
            <div class="badge-row">
              <span class="type-badge">{{ animalTypeLabel }}</span>
              <span class="breed-badge">{{ post.breed || '정보 없음' }}</span>
            </div>

            <h1 class="post-title">{{ post.title || '(제목 없음)' }}</h1>

            <div class="meta-line">
              <span class="author">👤 {{ post.userName || '-' }}</span>
              <span class="dot">·</span>
              <span class="date">{{ post.createdAt || '-' }}</span>
            </div>
          </div>

          <div class="head-right">
            <button class="report-btn">🚨 게시글 신고</button>
          </div>
        </header>

        <!-- 상단 하단 경계선 -->
        <div class="divider-line"></div>

        <!-- 대표 이미지 + 썸네일들 + 동물 정보 박스 -->
        <section class="media-and-info">
          <!-- 대표 이미지 영역 -->
          <div class="main-image-wrap">
            <img
              class="main-image"
              :src="currentImageUrl"
              alt="animal main"
            />
          </div>

          <!-- 썸네일 슬라이더 -->
          <div class="thumb-row">
            <button class="thumb-nav" @click="prevImage">‹</button>

            <div
              v-for="(img, idx) in imageUrls"
              :key="idx"
              class="thumb-box"
              :class="{ active: idx === currentImageIndex }"
              @click="setImage(idx)"
            >
              <img :src="img" alt="thumb" />
            </div>

            <button class="thumb-nav" @click="nextImage">›</button>
          </div>

          <!-- 동물 정보 카드 -->
          <aside class="pet-info-card">
            <h2 class="info-head">동물 정보</h2>

            <ul class="info-list">
              <li>
                <span class="info-key">종류</span>
                <span class="info-val">{{ animalTypeLabel }}</span>
              </li>
              <li>
                <span class="info-key">품종</span>
                <span class="info-val">{{ post.breed || '-' }}</span>
              </li>
              <li>
                <span class="info-key">색상</span>
                <span class="info-val">{{ post.color || '-' }}</span>
              </li>
              <li>
                <span class="info-key">성별</span>
                <span class="info-val">{{ sexLabel }}</span>
              </li>
              <li>
                <span class="info-key">나이</span>
                <span class="info-val">{{ post.age || '-' }}</span>
              </li>
              <li>
                <span class="info-key">목격시각</span>
                <span class="info-val">{{ post.lostDateTime || '-' }}</span>
              </li>
              <li>
                <span class="info-key">위치</span>
                <span class="info-val">{{ post.location || '-' }}</span>
              </li>
            </ul>
          </aside>
        </section>

        <!-- 본문 설명 -->
        <section class="content-block">
          <p class="content-text">
            {{ post.content || '내용이 없습니다.' }}
          </p>
        </section>

        <!-- 좋아요 / 공유 -->
        <section class="action-row">
          <button class="like-btn">💗 좋아요 {{ post.likeCount ?? 0 }}</button>
          <button class="share-btn">🔗 공유하기</button>

          <div class="stats-right">
            <span class="stat-chip">💬 {{ post.commentCount ?? comments.length }}</span>
            <span class="stat-chip">👁 {{ post.view ?? 0 }}</span>
          </div>
        </section>
      </section>

      <!-- 댓글 영역 -->
      <section class="comment-card">
        <header class="comment-head">
          <h2 class="comment-title">
            댓글 <span class="count">{{ comments.length }}</span>
          </h2>
        </header>

        <!-- 댓글 리스트 -->
        <ul class="comment-list">
          <li
            v-for="c in comments"
            :key="c.id"
            class="comment-item"
          >
            <div class="comment-meta">
              <span class="comment-writer">{{ c.userName || '익명' }}</span>
              <span class="comment-date">{{ c.createdAt || '' }}</span>
            </div>
            <p class="comment-text">{{ c.text || '' }}</p>
          </li>

          <li v-if="comments.length === 0" class="comment-empty">
            아직 댓글이 없습니다.
          </li>
        </ul>

        <!-- 댓글 입력창 (아직 POST 안 붙혔지만 UI만) -->
        <div class="comment-write">
          <textarea
            v-model="newComment"
            class="comment-input"
            placeholder="댓글을 남겨주세요."
          />
          <button class="comment-send-btn" @click="sendComment">등록</button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 라우터 /missing/:id
const route = useRoute()
const router = useRouter()
const postId = route.params.id

// 상세 게시글 데이터
const post = reactive({
  title: '',
  animalType: '',
  breed: '',
  color: '',
  age: '',
  sex: '',
  lostDateTime: '',
  location: '',
  content: '',
  userName: '',
  createdAt: '',
  view: 0,
  likeCount: 0,
  commentCount: 0,
  files: [],
})

// 댓글 리스트
const comments = ref([])

// 새 댓글
const newComment = ref('')

// === 이미지 관련 상태 ===
const imageUrls = ref([]) // string[]
const currentImageIndex = ref(0)

const currentImageUrl = computed(() => {
  if (imageUrls.value.length === 0) {
    return fallbackImage.value
  }
  return imageUrls.value[currentImageIndex.value] || fallbackImage.value
})

// fallback 이미지 (프로젝트 내부 기본 이미지)
import fallbackImageSrc from '@/assets/dogcat/lostcat1.jpeg'
const fallbackImage = ref(fallbackImageSrc)

// 동물타입 사람이 읽을 라벨
const animalTypeLabel = computed(() => {
  if (post.animalType === 'DOG') return '강아지'
  if (post.animalType === 'CAT') return '고양이'
  return '기타'
})

// 성별 라벨
const sexLabel = computed(() => {
  if (post.sex === 'MALE') return '수컷'
  if (post.sex === 'FEMALE') return '암컷'
  if (post.sex === 'UNKNOWN') return '모름'
  return post.sex || '-'
})

// 이미지 인덱스 조작
function setImage(idx) {
  currentImageIndex.value = idx
}
function prevImage() {
  if (imageUrls.value.length === 0) return
  currentImageIndex.value =
    (currentImageIndex.value - 1 + imageUrls.value.length) %
    imageUrls.value.length
}
function nextImage() {
  if (imageUrls.value.length === 0) return
  currentImageIndex.value =
    (currentImageIndex.value + 1) % imageUrls.value.length
}

// 목록으로
function goList() {
  router.push({ name: 'missing' })
}

// 댓글 전송 (임시 - 실제 API 연동은 나중에)
function sendComment() {
  if (!newComment.value.trim()) return
  // 나중에 POST /missing-posts/{id}/comments 같은 곳에 보내면 됨
  alert('아직 댓글 등록 API 안 붙였어. 나중에 연결하면 돼!')
  newComment.value = ''
}

// 상세랑 댓글 데이터 가져오기
async function fetchDetail() {
  try {
    const res = await fetch(
      `http://localhost:8000/post-service/missing-posts/query/posts/${postId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    if (!res.ok) {
      console.error('상세 조회 실패', res.status)
      return
    }

    const data = await res.json()

    // post reactive에 주입
    post.title = data.title
    post.animalType = data.animalType
    post.breed = data.breed
    post.color = data.color
    post.age = data.age
    post.sex = data.sex
    post.lostDateTime = data.lostDateTime || data.missingDate || ''
    post.location = data.location || data.missingLocation || ''
    post.content = data.content
    post.userName = data.userName
    post.createdAt = data.createdAt
    post.view = data.view
    post.likeCount = data.likeCount
    post.commentCount = data.commentCount
    post.files = Array.isArray(data.files) ? data.files : []

    // 이미지 URL 생성
    // 백엔드가 파일을 서빙하는 실제 URL 패턴에 맞춰서 바꿔줘.
    // 지금은 임시로 /files/{fileRename} 로 구성.
    imageUrls.value =
      post.files.length > 0
        ? post.files.map(f => `/files/${f.fileRename}`)
        : [fallbackImage.value]

    currentImageIndex.value = 0
  } catch (err) {
    console.error('상세 조회 에러:', err)
  }
}

async function fetchComments() {
  try {
    const res = await fetch(
      `http://localhost:8000/post-service/missing-posts/query/posts/${postId}/comments`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    if (!res.ok) {
      console.error('댓글 조회 실패', res.status)
      comments.value = []
      return
    }

    const list = await res.json()
    comments.value = Array.isArray(list) ? list : []
  } catch (err) {
    console.error('댓글 조회 에러:', err)
    comments.value = []
  }
}

onMounted(() => {
  fetchDetail()
  fetchComments()
})
</script>

<style scoped>
.detail-page {
  background-color: #efe8dd;
  min-height: 100vh;
  padding: 24px 16px 80px;
  font-family: "Pretendard", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2a1c10;
  display: flex;
  justify-content: center;
}

.detail-inner {
  width: 100%;
  max-width: 1100px;
}

/* 돌아가기 */
.back-line {
  background: none;
  border: none;
  font-size: 13px;
  line-height: 1.4;
  color: #2a1c10;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

/* 메인 카드 */
.post-card {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow: 0 16px 32px rgba(0,0,0,0.06);
  padding: 16px 20px 24px;
  margin-bottom: 24px;
}

/* 헤더 영역 */
.post-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: nowrap;
  row-gap: 12px;
}
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.type-badge,
.breed-badge {
  background-color: #f5f0e8;
  border: 1px solid rgba(0,0,0,0.07);
  color: #6e5336;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  border-radius: 4px;
  padding: 4px 6px;
}
.post-title {
  font-size: 18px;
  font-weight: 600;
  color: #2a1c10;
  line-height: 1.4;
  margin: 0 0 8px;
  word-break: keep-all;
}
.meta-line {
  font-size: 12px;
  color: rgba(0,0,0,0.6);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  line-height: 1.4;
}
.dot {
  color: rgba(0,0,0,0.3);
}
.head-right {
  flex-shrink: 0;
}
.report-btn {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.3;
  padding: 6px 8px;
  color: #2a1c10;
  cursor: pointer;
}

/* 구분선 */
.divider-line {
  border-top: 1px solid rgba(0,0,0,0.07);
  margin: 16px 0 20px;
}

/* 미디어 + 정보 */
.media-and-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 대표 이미지 */
.main-image-wrap {
  width: 100%;
  max-width: 480px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.1);
  background: #fff;
  margin: 0 auto 16px;
}
.main-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  background: #fdfdfd;
}

/* 썸네일 줄 */
.thumb-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto 20px;
  flex-wrap: nowrap;
}
.thumb-nav {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 4px;
  font-size: 16px;
  line-height: 1;
  padding: 6px 8px;
  cursor: pointer;
  height: 48px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2a1c10;
}
.thumb-box {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  border: 2px solid transparent;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;
  cursor: pointer;
}
.thumb-box.active {
  border-color: #8a6a48;
}
.thumb-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 동물 정보 카드 */
.pet-info-card {
  width: 100%;
  max-width: 480px;
  background-color: #fffdf8;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 6px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.03);
  padding: 16px;
  margin: 0 auto 28px;
  color: #2a1c10;
}
.info-head {
  font-size: 14px;
  font-weight: 600;
  color: #6e5336;
  line-height: 1.4;
  margin-bottom: 12px;
}
.info-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}
.info-list li {
  display: grid;
  grid-template-columns: 70px 1fr;
  row-gap: 4px;
  column-gap: 8px;
  margin-bottom: 6px;
}
.info-key {
  color: rgba(0,0,0,0.6);
}
.info-val {
  color: #2a1c10;
  word-break: keep-all;
}

/* 본문 */
.content-block {
  max-width: 680px;
  margin: 0 auto 24px;
  font-size: 14px;
  line-height: 1.6;
  color: #2a1c10;
  white-space: pre-line;
  text-align: center;
}
.content-text {
  word-break: keep-all;
}

/* 좋아요/공유 */
.action-row {
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;
  column-gap: 8px;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border-top: 1px solid rgba(0,0,0,0.07);
  padding-top: 16px;
}
.like-btn,
.share-btn {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 6px;
  padding: 8px 12px;
  line-height: 1.3;
  font-size: 13px;
  cursor: pointer;
  color: #2a1c10;
}
.stats-right {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(0,0,0,0.6);
  font-size: 12px;
}
.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 댓글 카드 */
.comment-card {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow: 0 16px 32px rgba(0,0,0,0.06);
  padding: 16px 20px 24px;
}
.comment-head {
  margin-bottom: 16px;
}
.comment-title {
  font-size: 14px;
  font-weight: 600;
  color: #2a1c10;
  line-height: 1.4;
}
.count {
  color: #8a6a48;
  margin-left: 4px;
}

/* 댓글 리스트 */
.comment-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}
.comment-item {
  border-top: 1px solid rgba(0,0,0,0.05);
  padding: 12px 0;
  font-size: 13px;
  line-height: 1.5;
  color: #2a1c10;
}
.comment-item:first-child {
  border-top: 0;
}
.comment-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 4px;
}
.comment-writer {
  font-weight: 600;
  color: #2a1c10;
}
.comment-date {
  color: rgba(0,0,0,0.5);
}
.comment-text {
  white-space: pre-line;
  word-break: keep-all;
}

/* 빈 댓글 */
.comment-empty {
  font-size: 13px;
  color: rgba(0,0,0,0.5);
  padding: 16px 0;
  text-align: center;
  border-top: 1px solid rgba(0,0,0,0.05);
}

/* 댓글 입력 */
.comment-write {
  border-top: 1px solid rgba(0,0,0,0.07);
  padding-top: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: flex-start;
}
.comment-input {
  width: 100%;
  min-height: 60px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.15);
  background: #fffdf8;
  font-size: 13px;
  line-height: 1.4;
  padding: 10px;
  outline: none;
  resize: vertical;
  color: #2a1c10;
}
.comment-send-btn {
  background: #f5f0e8;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.3;
  cursor: pointer;
  min-width: 64px;
  font-weight: 500;
  color: #2a1c10;
}

/* 반응형 */
@media (max-width: 768px) {
  .post-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .media-and-info {
    align-items: stretch;
  }

  .main-image-wrap {
    max-width: 100%;
  }

  .pet-info-card {
    max-width: 100%;
  }

  .content-block {
    text-align: left;
  }

  .thumb-row {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
}
</style>