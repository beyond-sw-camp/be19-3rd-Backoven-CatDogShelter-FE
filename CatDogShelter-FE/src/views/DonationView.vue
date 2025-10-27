<template>
  <div class="donation-page">
    <!-- ===== 페이지 헤더 영역 ===== -->
    <header class="page-top">
      <div class="page-top-head">
        <div class="page-title-row">
          <span class="page-icon" aria-hidden="true">🎁</span>
          <h1 class="page-title">후원 게시판</h1>
        </div>
        <p class="page-desc">
          보호소에 필요한 물품을 후원해주세요. 여러분의 작은 나눔이 큰 변화를 만듭니다.
        </p>
      </div>

      <!-- 검색 영역 -->
      <div class="search-row">
        <div class="select-wrap">
          <label class="visually-hidden" for="searchField">검색 필드</label>
          <select id="searchField" v-model="searchField">
            <option value="title">제목</option>
            <option value="shelterName">보호소명</option>
            <option value="writer">작성자</option>
          </select>
        </div>

        <div class="search-input-wrap">
          <label class="visually-hidden" for="searchKeyword">검색어 입력</label>
          <input
            id="searchKeyword"
            v-model.trim="keyword"
            type="text"
            class="search-input"
            :placeholder="searchPlaceholder"
            @keydown.enter="onSearch"
          />
          <button class="search-btn" @click="onSearch">검색</button>
        </div>
      </div>
    </header>

    <!-- ===== 통계 카드 영역 ===== -->
    <section class="stats-row">
      <div class="stat-card">
        <div class="stat-label">총 후원 건수</div>
        <div class="stat-value">{{ stats.totalDonations.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">참여 보호소</div>
        <div class="stat-value">{{ stats.participatingShelters.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">후원자 수</div>
        <div class="stat-value">{{ stats.totalSupporters.toLocaleString() }}</div>
      </div>
    </section>

    <!-- ===== 테이블 헤더 영역 (총 n개 / 정렬 / 등록버튼) ===== -->
    <section class="board-headbar">
      <div class="board-meta">
        <span class="total-count">총 {{ totalCount }}개의 게시글</span>

        <div class="sort-wrap">
          <label class="visually-hidden" for="sortSelect">정렬 기준</label>
          <select id="sortSelect" v-model="sort" @change="onChangeSort">
            <option value="latest">최신 순</option>
            <option value="popular">인기 순</option>
            <option value="views">조회수 순</option>
          </select>
        </div>
      </div>

      <div class="board-actions">
        <button class="write-btn" @click="handleWriteClick">게시글 등록</button>
      </div>
    </section>

    <!-- ===== 게시글 리스트 테이블 ===== -->
    <section class="board-table-wrap">
      <table class="board-table">
        <thead>
          <tr>
            <th class="col-shelter">보호소</th>
            <th class="col-title">제목</th>
            <th class="col-writer">작성자</th>
            <th class="col-views">조회수</th>
            <th class="col-likes">좋아요</th>
            <th class="col-date">작성일</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
            class="board-row"
            @click="goDetail(post.id)"
          >
            <td class="col-shelter">{{ post.shelterName }}</td>
            <td class="col-title text-left">
              <span class="title-link">{{ post.title }}</span>
            </td>
            <td class="col-writer">{{ post.writerName }}</td>

            <td class="col-views">
              <span class="views-eye" aria-hidden="true">👁</span>
              <span>{{ post.views }}</span>
            </td>

            <td class="col-likes">
              <span class="likes-heart" aria-hidden="true">❤</span>
              <span>{{ post.likes }}</span>
            </td>

            <td class="col-date">{{ formatDate(post.createdAt) }}</td>
          </tr>

          <tr v-if="posts.length === 0">
            <td colspan="6" class="empty-row">등록된 게시글이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- ===== 페이지네이션 ===== -->
    <nav class="pagination-wrap" aria-label="페이지네이션">
      <button
        class="page-btn"
        :disabled="page === 1"
        @click="changePage(page - 1)"
      >
        이전
      </button>

      <button
        v-for="p in visiblePages"
        :key="p"
        class="page-num-btn"
        :class="{ active: p === page }"
        @click="changePage(p)"
      >
        {{ p }}
      </button>

      <button
        class="page-btn"
        :disabled="page === totalPages"
        @click="changePage(page + 1)"
      >
        다음
      </button>
    </nav>

    <!-- ===== 하단 안내 ===== -->
    <section class="donation-guide-box">
      <header class="guide-head">
        <span class="guide-icon" aria-hidden="true">🎁</span>
        <h2 class="guide-title">보호소에 후원하는 방법</h2>
      </header>

      <p class="guide-desc">
        후원하고 싶은 보호소에 직접 연락하거나, 온라인으로 후원 신청을 하실 수 있어요.
        사료, 간식, 생활용품, 의료용품 등 다양한 물품 후원이 가능합니다.
      </p>
      <p class="guide-desc">
        게시글에 명시된 연락처나 안내 방법 외의 개인 계좌 요구 등은 사기일 수 있으니
        반드시 확인 후 진행해주세요.
      </p>
    </section>

    <!-- ===== 보호소장 전용 기능 모달 ===== -->
    <teleport to="body">
      <div
        v-if="showRoleModal"
        class="role-modal-backdrop"
        @click.self="closeRoleModal"
      >
        <div class="role-modal">
          <div class="role-modal-icon" aria-hidden="true">🐶</div>
          <h3 class="role-modal-title">보호소장 전용 기능이에요</h3>
          <p class="role-modal-desc">
            게시글 작성은 보호소장 계정만 이용할 수 있어요.
            <br />
            함께 참여하실 보호소라면, 지금 인증하고 시작해보세요.
          </p>

          <button class="role-modal-close-btn" @click="closeRoleModal">
            닫기
          </button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 로그인한 유저가 보호소장인지 여부
 * - 실제로는 로그인 후 받아온 프로필/권한 정보에서 설정해줘
 *   예: JWT decode 해서 ROLE_SHELTER_HEAD 포함 여부 확인
 */
const isShelterHead = ref(false)

// 게시글 리스트
const posts = ref([])

// 전체 게시글 수
const totalCount = ref(0)

// 통계 값
const stats = ref({
  totalDonations: 247,
  participatingShelters: 89,
  totalSupporters: 1234,
})

// 검색 & 정렬 & 페이지 상태
const searchField = ref('title')
const keyword = ref('')
const sort = ref('latest')
const page = ref(1)
const size = ref(10) // 한 페이지 게시글 수
const totalPages = ref(5) // 실제 응답 따라 세팅

const showRoleModal = ref(false)

const router = useRouter()

// placeholder 동적
const searchPlaceholder = computed(() => {
  switch (searchField.value) {
    case 'shelterName':
      return '보호소명을 입력해주세요'
    case 'writer':
      return '작성자를 입력해주세요'
    default:
      return '검색어를 입력해주세요'
  }
})

// 페이지네이션 숫자 (간단하게 현재 페이지 기준 ±2)
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, page.value - 2)
  const end = Math.min(totalPages.value, page.value + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 날짜 포맷 (YYYY-MM-DD)
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 글쓰기 버튼 눌렀을 때
function handleWriteClick() {
  if (isShelterHead.value) {
    // 보호소장일 경우 글 등록 페이지로 라우팅
    router.push({ name: 'DonationWrite' }) // 라우트 이름 or path 수정해서 쓰면 돼.
  } else {
    // 일반회원일 경우 모달 오픈
    showRoleModal.value = true
  }
}

function closeRoleModal() {
  showRoleModal.value = false
}

// 상세 이동
function goDetail(postId) {
  router.push({ name: 'DonationDetail', params: { id: postId } })
}

// 검색 실행
function onSearch() {
  page.value = 1
  fetchBoard()
}

// 정렬 바꿀 때
function onChangeSort() {
  page.value = 1
  fetchBoard()
}

// 페이지 변경
function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return
  page.value = newPage
  fetchBoard()
}

// ===== 백엔드 연동(fetch) =====
async function fetchBoard() {
  // 실제 API에 맞게 수정해
  // 예: /post-service/donation-posts?field=title&keyword=사료&sort=latest&page=1&size=10
  const params = new URLSearchParams({
    field: searchField.value,
    keyword: keyword.value,
    sort: sort.value,
    page: page.value,
    size: size.value,
  })

  try {
    const res = await fetch(
      `/post-service/donation-posts?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`  <- 필요하면 추가
        },
      }
    )

    if (!res.ok) {
      console.error('fetchBoard fail', res.status)
      return
    }

    const data = await res.json()

    /**
     * 기대 응답 형태 (예시):
     * {
     *   "content": [
     *      {
     *        "id": 1,
     *        "shelterName": "서울사랑보호소",
     *        "title": "서울사랑보호소 사료 후원 안내",
     *        "writerName": "김영희",
     *        "views": 32,
     *        "likes": 5,
     *        "createdAt": "2025-09-10T12:00:00"
     *      }, ...
     *   ],
     *   "totalCount": 247,
     *   "page": 1,
     *   "totalPages": 5,
     *   "stats": {
     *      "totalDonations": 247,
     *      "participatingShelters": 89,
     *      "totalSupporters": 1234
     *   }
     * }
     */
    posts.value = data.content ?? []
    totalCount.value = data.totalCount ?? 0
    page.value = data.page ?? page.value
    totalPages.value = data.totalPages ?? 1

    if (data.stats) {
      stats.value = {
        totalDonations: data.stats.totalDonations ?? stats.value.totalDonations,
        participatingShelters:
          data.stats.participatingShelters ??
          stats.value.participatingShelters,
        totalSupporters:
          data.stats.totalSupporters ?? stats.value.totalSupporters,
      }
    }
  } catch (err) {
    console.error('fetchBoard error', err)
  }
}

onMounted(() => {
  fetchBoard()
})
</script>

<style scoped>
/* 전체 배경 톤 */
.donation-page {
  background-color: #efe8dd; /* 약간 베이지 페이지 배경 */
  color: #2a1c10;
  min-height: 100vh;
  padding: 24px 16px 120px;
  box-sizing: border-box;
  font-family: 'Pretendard', system-ui, -apple-system, BlinkMacSystemFont,
    'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== 상단 영역 ===== */
.page-top-head {
  margin-bottom: 16px;
}

.page-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2a1c10;
}

.page-icon {
  font-size: 20px;
  line-height: 1;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #2a1c10;
  margin: 0;
}

.page-desc {
  font-size: 14px;
  line-height: 1.5;
  color: #4a3a2a;
  margin-top: 4px;
  margin-bottom: 0;
}

/* 검색 영역 */
.search-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  background: #f8f1e5;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  max-width: 100%;
  box-sizing: border-box;
}

.select-wrap select {
  background: #fff;
  border-radius: 6px;
  border: 1px solid #cbb9a2;
  font-size: 14px;
  line-height: 1.4;
  padding: 8px 10px;
  color: #2a1c10;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #cbb9a2;
  overflow: hidden;
  flex: 1;
  min-width: 200px;
}

.search-input {
  flex: 1;
  padding: 8px 10px;
  font-size: 14px;
  border: 0;
  outline: 0;
  color: #2a1c10;
  background: transparent;
}

.search-btn {
  flex-shrink: 0;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  background: #e0c6a4;
  color: #2a1c10;
  border: 0;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

/* ===== 통계 카드 ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 12px;
}

.stat-card {
  background: #f8f1e5;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px;
  text-align: center;
  color: #2a1c10;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #2a1c10;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #8a6237; /* 살짝 브라운 강조 */
  line-height: 1.1;
}

/* ===== 헤드바 (총 n개, 정렬, 등록버튼) ===== */
.board-headbar {
  background: #f8f1e5;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 12px 16px;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.board-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  color: #2a1c10;
  font-size: 14px;
  line-height: 1.4;
}

.total-count {
  font-weight: 500;
}

.sort-wrap select {
  background: #fff;
  border-radius: 6px;
  border: 1px solid #cbb9a2;
  font-size: 14px;
  line-height: 1.4;
  padding: 8px 10px;
  color: #2a1c10;
}

.board-actions {
  margin-left: auto;
}

.write-btn {
  background: #8a6237;
  border: 1px solid #6f4f2a;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  padding: 9px 14px;
  border-radius: 6px;
  cursor: pointer;
}

/* ===== 게시글 테이블 ===== */
.board-table-wrap {
  background: #f8f1e5;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow-x: auto;
}

.board-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
  font-size: 14px;
  color: #2a1c10;
}

.board-table thead tr {
  background: #ece2d4;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  color: #2a1c10;
}

.board-table th {
  text-align: center;
  font-weight: 600;
  padding: 12px;
  white-space: nowrap;
  font-size: 14px;
  line-height: 1.4;
}

.board-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  text-align: center;
  color: #2a1c10;
  vertical-align: middle;
  font-size: 14px;
  line-height: 1.4;
}

.board-row {
  cursor: pointer;
  transition: background-color 0.12s ease;
}
.board-row:hover {
  background: rgba(0, 0, 0, 0.03);
}

.col-shelter {
  width: 160px;
  font-weight: 500;
  color: #2a1c10;
}
.col-title {
  text-align: left;
  color: #2a1c10;
  font-weight: 500;
}
.col-writer {
  width: 100px;
  color: #2a1c10;
}
.col-views {
  width: 80px;
  color: #2a1c10;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}
.col-likes {
  width: 80px;
  color: #2a1c10;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}
.col-date {
  width: 110px;
  color: #2a1c10;
}

.views-eye {
  font-size: 13px;
  line-height: 1;
}
.likes-heart {
  font-size: 13px;
  line-height: 1;
  color: #8a6237;
}

.title-link {
  color: #2a1c10;
  text-decoration: none;
  display: inline-block;
  line-height: 1.4;
  word-break: keep-all;
}

.empty-row {
  text-align: center;
  padding: 48px 12px;
  color: #8a7a6b;
  font-size: 14px;
}

/* ===== 페이지네이션 ===== */
.pagination-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.page-btn,
.page-num-btn {
  min-width: 36px;
  height: 32px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #cbb9a2;
  background: #fff;
  color: #2a1c10;
  padding: 0 8px;
}

.page-num-btn.active {
  background: #8a6237;
  border-color: #6f4f2a;
  color: #fff;
  font-weight: 600;
}

/* ===== 안내 박스 ===== */
.donation-guide-box {
  background: #f8f1e5;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px;
  color: #2a1c10;
}

.guide-head {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2a1c10;
  margin-bottom: 8px;
}

.guide-icon {
  font-size: 20px;
  line-height: 1;
}

.guide-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.guide-desc {
  font-size: 14px;
  line-height: 1.5;
  color: #4a3a2a;
  margin: 4px 0;
}

/* ===== 모달 ===== */
.role-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.role-modal {
  background: #f8f1e5;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);

  width: 100%;
  max-width: 360px;
  text-align: center;
  padding: 24px 20px;
  color: #2a1c10;
}

.role-modal-icon {
  font-size: 40px;
  line-height: 1;
  margin-bottom: 16px;
}

.role-modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #6f4f2a;
  line-height: 1.3;
  margin: 0 0 16px 0;
}

.role-modal-desc {
  font-size: 14px;
  line-height: 1.5;
  color: #2a1c10;
  margin: 0 0 24px 0;
  white-space: pre-line;
}

.role-modal-close-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 1px solid #6f4f2a;
  background: #fff;
  font-size: 16px;
  font-weight: 500;
  color: #6f4f2a;
  cursor: pointer;
}

/* 접근성 숨김 텍스트 */
.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0 0 0 0) !important;
  border: 0 !important;
}
</style>