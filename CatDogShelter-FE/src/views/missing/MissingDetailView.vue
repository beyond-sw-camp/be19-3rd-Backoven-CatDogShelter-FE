<template>
  <main class="missing-detail-page">
    <section class="detail-container">
      <!-- ===== 상단 헤더영역 (뒤로가기 / 제목 / 메타정보 / 신고버튼) ===== -->
      <header class="post-head">
        <button class="back-btn" @click="goBack">
          ← 목록으로 돌아가기
        </button>

        <div class="post-head-top">
          <div class="tag-row">
            <span class="tag">강아지</span>
            <span class="tag">익스컬</span>
          </div>

          <h1 class="post-title">{{ post.title }}</h1>

          <div class="meta-row">
            <span class="meta-writer">👤 {{ post.userName }}</span>
            <span class="meta-date">{{ post.createdAt }}</span>
          </div>
        </div>

        <div class="post-head-right">
          <button class="report-btn">🚩 게시글 신고</button>
          <div class="stats-row">
            <span class="stat-item">❤ {{ post.likeCount }}</span>
            <span class="stat-item">💬 {{ comments.length }}</span>
            <span class="stat-item">
              <!-- 조회수 아이콘 (svg) -->
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
                class="eye-icon"
              >
                <path
                  d="M12 5c4.5 0 8.3 2.7 10 6.5C20.3 15.3 16.5 18 12 18S3.7 15.3 2 11.5C3.7 7.7 7.5 5 12 5Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
                <circle
                  cx="12"
                  cy="11.5"
                  r="3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
              </svg>
              {{ post.view }}
            </span>
          </div>
        </div>
      </header>

      <!-- ===== 본문 컨텐츠 영역 ===== -->
      <section class="content-section">
        <!-- 메인 이미지 + 썸네일 슬라이더 -->
        <div class="image-area">
          <div class="main-image-wrap">
            <img
              v-if="activeImage"
              :src="activeImage"
              alt="동물 사진"
              class="main-image"
            />
            <div v-else class="main-image placeholder">이미지 없음</div>
          </div>

          <div class="thumb-row">
            <button class="thumb-nav" @click="prevThumb">〈</button>

            <div
              v-for="(img, idx) in post.images"
              :key="idx"
              class="thumb-item"
              :class="{ active: idx === activeIndex }"
              @click="setActive(idx)"
            >
              <img :src="img" alt="thumbnail" />
            </div>

            <button class="thumb-nav" @click="nextThumb">〉</button>
          </div>
        </div>

        <!-- 동물 정보 + 상세 설명 -->
        <div class="info-and-desc">
          <!-- 동물 정보 카드 -->
          <section class="animal-info-card">
            <h2 class="info-title">동물 정보</h2>
            <ul class="info-list">
              <li>
                <span class="info-label">종:</span>
                <span class="info-value">{{ post.animalType }}</span>
              </li>
              <li>
                <span class="info-label">품종:</span>
                <span class="info-value">{{ post.breed }}</span>
              </li>
              <li>
                <span class="info-label">성별:</span>
                <span class="info-value">{{ post.gender }}</span>
              </li>
              <li>
                <span class="info-label">색상:</span>
                <span class="info-value">{{ post.color }}</span>
              </li>
              <li>
                <span class="info-label">나이:</span>
                <span class="info-value">{{ post.age }}</span>
              </li>
              <li>
                <span class="info-label">체중:</span>
                <span class="info-value">{{ post.weight }}</span>
              </li>
              <li>
                <span class="info-label">목격시각:</span>
                <span class="info-value">{{ post.spottedAt }}</span>
              </li>
              <li>
                <span class="info-label">위치:</span>
                <span class="info-value">{{ post.location }}</span>
              </li>
              <li>
                <span class="info-label">특징:</span>
                <span class="info-value">{{ post.feature }}</span>
              </li>
            </ul>
          </section>

          <!-- 본문 설명 -->
          <section class="desc-block">
            <p class="desc-text" v-html="post.description"></p>
          </section>

          <!-- 액션 버튼들 (좋아요 / 공유하기) -->
          <div class="action-row">
            <button class="like-btn" @click="onLike">
              🤍 좋아요 {{ post.likeCount }}
            </button>
            <button class="share-btn" @click="onShare">
              🔗 공유하기
            </button>
          </div>
        </div>
      </section>

      <!-- ===== 댓글 영역 ===== -->
      <section class="comment-section">
        <h2 class="comment-head">
          댓글 <span class="comment-count">{{ comments.length }}</span>
        </h2>

        <!-- 댓글 리스트 -->
        <ul class="comment-list">
          <li
            class="comment-item"
            v-for="(cmt, index) in comments"
            :key="index"
          >
            <div class="comment-user-icon">🐾</div>

            <div class="comment-body">
              <div class="comment-meta">
                <span class="comment-writer">{{ cmt.userName }}</span>
                <span class="comment-date">{{ cmt.createdAt }}</span>
              </div>

              <p class="comment-text">
                {{ cmt.content }}
              </p>

              <button class="comment-report-btn">🚩 신고하기</button>
            </div>
          </li>
        </ul>

        <!-- 댓글 작성 폼 -->
        <form class="comment-write" @submit.prevent="submitComment">
          <textarea
            class="comment-input"
            placeholder="댓글을 입력하세요"
            v-model="newComment"
          />
          <button class="comment-submit-btn">댓글 작성</button>
        </form>
      </section>

      <!-- ===== 이전/다음 글 ===== -->
      <section class="post-nav-section">
        <div class="post-nav-row">
          <span class="post-nav-label">다음 게시글 ›</span>
          <RouterLink
            class="post-nav-title"
            :to="`/missing/${nextPost.id}`"
            v-if="nextPost"
          >
            {{ nextPost.title }}
          </RouterLink>
          <span v-else class="post-nav-none">다음 글이 없습니다</span>
        </div>
      </section>
    </section>
  </main>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'MissingDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const postId = route.params.postId

    // ===== 서버에서 받아올 데이터 상태 =====
    const post = ref({
      title: '',
      createdAt: '',
      userName: '',
      view: 0,
      likeCount: 0,
      description: '',
      animalType: '',
      breed: '',
      gender: '',
      color: '',
      age: '',
      weight: '',
      spottedAt: '',
      location: '',
      feature: '',
      images: [], // ['url1', 'url2', ...]
    })

    const comments = ref([])

    // 다음 글 (옵션)
    const nextPost = ref(null)

    // 댓글 작성 상태
    const newComment = ref('')

    // 이미지 슬라이더 상태
    const activeIndex = ref(0)
    const activeImage = computed(() => post.value.images[activeIndex.value])

    function setActive(idx) {
      activeIndex.value = idx
    }
    function prevThumb() {
      if (post.value.images.length === 0) return
      activeIndex.value =
        (activeIndex.value - 1 + post.value.images.length) %
        post.value.images.length
    }
    function nextThumb() {
      if (post.value.images.length === 0) return
      activeIndex.value =
        (activeIndex.value + 1) % post.value.images.length
    }

    // 뒤로가기
    function goBack() {
      router.back()
    }

    // 좋아요 클릭
    function onLike() {
      console.log('like!')
      // TODO: 좋아요 POST 호출
    }

    // 공유하기 클릭
    function onShare() {
      console.log('share!')
      // TODO: 공유 로직 (navigator.share 등)
    }

    // 댓글 작성 submit
    function submitComment() {
      if (!newComment.value.trim()) return
      console.log('댓글 등록:', newComment.value)
      // TODO: POST /missing-posts/query/posts/{postId}/comments
      newComment.value = ''
    }

    // ===== 데이터 로딩 =====
    async function fetchPostDetail() {
      try {
        const res = await fetch(
          `/post-service/missing-posts/query/posts/${postId}`
        )
        if (!res.ok) throw new Error('게시글 불러오기 실패')
        const data = await res.json()

        // 백엔드 DTO 필드명에 맞춰서 매핑 필요
        post.value = {
          title: data.title,
          createdAt: data.createdAt,
          userName: data.userName,
          view: data.view,
          likeCount: data.likeCount,
          description: data.content, // 본문
          animalType: data.animalType,
          breed: data.breed,
          gender: data.gender,
          color: data.color,
          age: data.ageText,
          weight: data.weightText,
          spottedAt: data.spottedAt,
          location: data.locationText,
          feature: data.featureText,
          images: data.images || [], // ['imgUrl1', 'imgUrl2'...]
        }
      } catch (err) {
        console.error(err)
      }
    }

    async function fetchComments() {
      try {
        const res = await fetch(
          `/post-service/missing-posts/query/posts/${postId}/comments`
        )
        if (!res.ok) throw new Error('댓글 불러오기 실패')
        const list = await res.json()

        comments.value = list.map((c) => ({
          userName: c.userName,
          createdAt: c.createdAt,
          content: c.content,
        }))
      } catch (err) {
        console.error(err)
      }
    }

    // (옵션) 다음글 가져오기 예시
    async function fetchNextPost() {
      try {
        // TODO: 실제 API에 맞게 수정
        // 예: /missing-posts/query/posts/{postId}/next
        const res = await fetch(
          `/post-service/missing-posts/query/posts/${postId}/next`
        )
        if (!res.ok) return
        const data = await res.json()
        nextPost.value = data
      } catch (err) {
        console.warn('다음 게시글 없음')
      }
    }

    onMounted(() => {
      fetchPostDetail()
      fetchComments()
      fetchNextPost()
    })

    return {
      post,
      comments,
      nextPost,
      newComment,
      submitComment,
      goBack,
      activeImage,
      activeIndex,
      setActive,
      prevThumb,
      nextThumb,
      onLike,
      onShare,
    }
  },
}
</script>

<style scoped>
/* 전체 배경 약간 베이지 느낌 */
.missing-detail-page {
  background-color: #f5efe3;
  min-height: 100vh;
  padding: 24px 0 80px;
}

.detail-container {
  background-color: #ffffff;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5decf;
  padding: 24px 24px 48px;
  display: flex;
  flex-direction: column;
  row-gap: 24px;
}

/* ===== 상단 헤더 ===== */
.post-head {
  display: grid;
  grid-template-columns: 1fr auto;
  row-gap: 16px;
  column-gap: 16px;
}

.back-btn {
  grid-column: 1 / span 2;
  font-size: 14px;
  color: #6b5b44;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
}

.post-head-top {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.tag-row {
  display: flex;
  column-gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  line-height: 1;
  padding: 4px 6px;
  background-color: #fff9e6;
  color: #8a6a00;
  border: 1px solid #f5e3a1;
  border-radius: 4px;
  font-weight: 500;
}

.post-title {
  font-size: 20px;
  line-height: 1.4;
  font-weight: 600;
  color: #3a2f1b;
}

.meta-row {
  font-size: 13px;
  color: #7a6a52;
  display: flex;
  column-gap: 10px;
  flex-wrap: wrap;
}

.post-head-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  row-gap: 8px;
  font-size: 13px;
  color: #7a6a52;
}

.report-btn {
  font-size: 12px;
  line-height: 1;
  background-color: #f7f7f7;
  border: 1px solid #d9d9d9;
  color: #666;
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
}

.stats-row {
  display: flex;
  align-items: center;
  column-gap: 12px;
  color: #7a6a52;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.eye-icon {
  position: relative;
  top: 1px;
}

/* ===== 본문 레이아웃 ===== */
.content-section {
  display: flex;
  flex-direction: column;
  row-gap: 24px;
}

@media (min-width: 900px) {
  .content-section {
    flex-direction: row;
    align-items: flex-start;
    column-gap: 24px;
  }
}

/* 이미지 영역 */
.image-area {
  flex: 1 1 55%;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
}

.main-image-wrap {
  border: 1px solid #d7d0c2;
  border-radius: 4px;
  overflow: hidden;
  background-color: #00000008;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main-image {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
}
.main-image.placeholder {
  color: #999;
  font-size: 14px;
  padding: 40px 0;
}

.thumb-row {
  display: flex;
  align-items: center;
  column-gap: 8px;
}
.thumb-nav {
  border: 1px solid #d7d0c2;
  background-color: #fff;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1;
  padding: 8px;
  min-width: 32px;
  cursor: pointer;
  color: #5e5034;
}
.thumb-item {
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  width: 72px;
  height: 72px;
  background-color: #f9f7f2;
  cursor: pointer;
  flex-shrink: 0;
}
.thumb-item.active {
  border-color: #c5a96a;
  background-color: #fffdf4;
}
.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 동물 정보 + 설명 */
.info-and-desc {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}

.animal-info-card {
  border: 1px solid #e8e1cf;
  background-color: #fffdf9;
  border-radius: 4px;
  padding: 16px;
}
.info-title {
  font-size: 14px;
  font-weight: 600;
  color: #6b5b44;
  margin-bottom: 12px;
}
.info-list {
  display: grid;
  row-gap: 6px;
  font-size: 13px;
  color: #3a2f1b;
}
.info-list li {
  display: flex;
  flex-wrap: wrap;
  column-gap: 6px;
}
.info-label {
  min-width: 64px;
  color: #7a6a52;
}
.info-value {
  color: #3a2f1b;
  font-weight: 500;
  word-break: break-word;
}

.desc-block {
  font-size: 14px;
  line-height: 1.6;
  color: #3a2f1b;
  white-space: pre-line;
  border-radius: 4px;
}
.desc-text {
  margin: 0;
  font-size: 14px;
  color: #3a2f1b;
  line-height: 1.6;
  white-space: pre-line;
}

.action-row {
  display: flex;
  column-gap: 8px;
}
.like-btn,
.share-btn {
  flex: 0 0 auto;
  background-color: #fffdf4;
  border: 1px solid #d9c9a3;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.2;
  color: #665633;
  cursor: pointer;
}

/* ===== 댓글 영역 ===== */
.comment-section {
  border-top: 1px solid #eee7da;
  padding-top: 24px;
}

.comment-head {
  font-size: 14px;
  font-weight: 600;
  color: #3a2f1b;
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 16px;
}
.comment-count {
  font-size: 12px;
  font-weight: 400;
  color: #7a6a52;
}

.comment-list {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-bottom: 24px;
}
.comment-item {
  display: flex;
  align-items: flex-start;
  column-gap: 12px;
  font-size: 13px;
  line-height: 1.4;
  color: #3a2f1b;
  background-color: #fffdf9;
  border: 1px solid #eee7da;
  border-radius: 6px;
  padding: 12px;
}
.comment-user-icon {
  width: 32px;
  height: 32px;
  background-color: #f5efe3;
  border-radius: 50%;
  font-size: 14px;
  line-height: 32px;
  text-align: center;
}
.comment-body {
  flex: 1;
}
.comment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #7a6a52;
  margin-bottom: 6px;
}
.comment-writer {
  font-weight: 600;
  color: #3a2f1b;
}
.comment-text {
  color: #3a2f1b;
  margin-bottom: 8px;
}
.comment-report-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  cursor: pointer;
  color: #9a624b;
  line-height: 1;
}

.comment-write {
  background-color: #faf8f3;
  border: 1px solid #e5decf;
  border-radius: 6px;
  padding: 16px;
  display: grid;
  row-gap: 12px;
}
.comment-input {
  width: 100%;
  min-height: 64px;
  border: 1px solid #d0c4a6;
  background-color: #fff;
  border-radius: 4px;
  padding: 12px;
  font-size: 13px;
  resize: vertical;
  color: #3a2f1b;
}
.comment-input::placeholder {
  color: #b5aa91;
}
.comment-submit-btn {
  background-color: #c5a96a;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  padding: 10px 12px;
  cursor: pointer;
  justify-self: end;
}

/* ===== 다음글 영역 ===== */
.post-nav-section {
  border-top: 1px solid #eee7da;
  padding-top: 24px;
}
.post-nav-row {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 12px;
  font-size: 13px;
  color: #3a2f1b;
  align-items: baseline;
}
.post-nav-label {
  font-weight: 500;
  color: #7a6a52;
  min-width: 90px;
}
.post-nav-title {
  text-decoration: none;
  color: #3a2f1b;
}
.post-nav-title:hover {
  text-decoration: underline;
}
.post-nav-none {
  color: #b5aa91;
}
</style>