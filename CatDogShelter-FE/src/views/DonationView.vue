<template>
  <div class="donation-page">
    <div class="donation-inner">
      <!-- ===== 헤더 영역 ===== -->
      <header class="page-top">
        <div class="page-top-head">
          <div class="page-title-row">
            <span class="page-icon">🎁</span>
            <h1 class="page-title">후원 게시판</h1>
          </div>
          <p class="page-desc">
            보호소에 필요한 물품을 후원해주세요. 여러분의 작은 나눔이 큰 변화를 만듭니다.
          </p>
        </div>

        <!-- 검색 영역 -->
        <div class="search-row">
          <select v-model="searchField">
            <option value="title">제목</option>
            <option value="shelterName">보호소명</option>
            <option value="userName">작성자</option>
          </select>

          <input
            v-model.trim="keyword"
            :placeholder="searchPlaceholder"
            class="search-input"
            @keydown.enter="onSearch"
          />
          <button class="search-btn" @click="onSearch">검색</button>
        </div>
      </header>

      <!-- ===== 통계 카드 ===== -->
      <section class="stats-row">
        <div class="stat-card">
          <div class="stat-label">총 후원 건수</div>
          <div class="stat-value">{{ stats.totalDonations }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">참여 보호소</div>
          <div class="stat-value">{{ stats.participatingShelters }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">후원자 수</div>
          <div class="stat-value">{{ stats.totalSupporters }}</div>
        </div>
      </section>

      <!-- ===== 게시판 헤더 (게시글 수 / 정렬 / 작성 버튼) ===== -->
      <section class="board-headbar">
        <div class="board-left">
          <span class="board-count">총 {{ allPosts.length }}개의 게시글</span>

          <div class="sort-row">
            <label for="sortSelect" class="sort-label">정렬 조건</label>
            <select
              id="sortSelect"
              class="sort-select"
              v-model="sortOption"
              @change="applySortAndResetPage"
            >
              <option value="latest">최신순</option>
              <option value="view">조회순</option>
              <option value="like">좋아요순</option>
            </select>
          </div>
        </div>

        <button class="write-btn" @click="handleWriteClick">
          게시글 등록
        </button>
      </section>

      <!-- ===== 게시글 테이블 ===== -->
      <section class="board-table-wrap">
        <table class="board-table">
          <thead>
            <tr>
              <th>보호소</th>
              <th class="text-left">제목</th>
              <th>작성자</th>
              <th>조회수</th>
              <th>좋아요</th>
              <th>작성일</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="post in pagedPosts"
              :key="post.id"
              class="board-row"
              @click="goDetail(post.id)"
            >
              <td>{{ post.shelterName }}</td>

              <td class="text-left title-cell">
                <span class="title-text">{{ post.title }}</span>
              </td>

              <td>{{ post.userName }}</td>

              <!-- 조회수 (아이콘 + 숫자) -->
              <td class="view-cell">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  aria-hidden="true"
                  class="view-icon"
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
                <span class="view-num">{{ post.view }}</span>
              </td>

              <td>❤️ {{ post.likeCount }}</td>
              <td>{{ post.createdAt }}</td>
            </tr>

            <tr v-if="pagedPosts.length === 0">
              <td colspan="6" class="empty-row">
                등록된 게시글이 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- ===== 페이지네이션 ===== -->
     <nav class="pagination-wrap" v-if="pagedPosts.length > 0">
  <button
    class="page-btn"
    :disabled="currentPage === 1"
    @click="goPrevPage"
  >
    이전
  </button>

  <button
    v-for="p in pageNumbersToShow"
    :key="p"
    class="page-btn"
    :class="{ active: p === currentPage }"
    @click="goPage(p)"
  >
    {{ p }}
  </button>

  <button
    class="page-btn"
    :disabled="currentPage === totalPages"
    @click="goNextPage"
  >
    다음
  </button>
</nav>

      <!-- ===== 보호소 후원 안내 ===== -->
      <section class="donation-guide-box">
        <header class="guide-head">
          <span class="guide-icon">🎁</span>
          <h2 class="guide-title">보호소에 후원하는 방법</h2>
        </header>
        <p class="guide-desc">
          후원하고 싶은 보호소에 직접 연락하거나, 온라인으로 후원 신청을 하실 수 있어요.<br />
          사료, 간식, 생활용품, 의료용품 등 다양한 물품 후원이 가능합니다.
        </p>
        <p class="guide-desc">
          게시글에 명시된 안내 외의 개인 계좌 요구는 사기일 수 있으니 주의해주세요.
        </p>
      </section>
    </div>

    <!-- ===== 보호소장 전용 모달 ===== -->
    <teleport to="body">
      <div
        v-if="showRoleModal"
        class="role-modal-backdrop"
        @click.self="closeRoleModal"
      >
        <div class="role-modal">
          <div class="role-modal-icon">🐶</div>
          <h3 class="role-modal-title">보호소장 전용 기능이에요</h3>
          <p class="role-modal-desc">
            게시글 작성은 보호소장 계정만 이용할 수 있어요.<br />
            함께 참여하실 보호소라면 지금 인증하고 시작해보세요.
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

const router = useRouter()

// 보호소장 여부 (role 체크로 세팅 예정)
// const isShelterHead = ref(false)

// 전체 원본 목록 (검색/정렬 전 데이터)
const allPosts = ref([])

// 검색/정렬까지 반영된 현재 결과 (페이지 나누기 전)
const posts = ref([])

// 페이지네이션 상태
const currentPage = ref(1)
const pageSize = ref(10) // 한 페이지에 보여줄 게시글 수

// 상단 통계 데이터
const stats = ref({
  totalDonations: 0,
  participatingShelters: 0,
  totalSupporters: 0
})

// 검색 상태
const searchField = ref('title')
const keyword = ref('')

// 정렬 상태 (latest | view | like)
const sortOption = ref('latest')

// 모달
const showRoleModal = ref(false)

const searchPlaceholder = computed(() => {
  if (searchField.value === 'shelterName') return '보호소명을 입력하세요'
  if (searchField.value === 'userName') return '작성자를 입력하세요'
  return '검색어를 입력하세요'
})

/* ===== 페이지네이션 계산 ===== */
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(posts.value.length / pageSize.value))
})

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return posts.value.slice(start, start + pageSize.value)
})

// 페이지 번호 (간단히 1 ~ totalPages 전부 보여주기)
const pageNumbersToShow = computed(() => {
  const pages = []
  for (let p = 1; p <= totalPages.value; p++) {
    pages.push(p)
  }
  return pages
})

function goPage(p) {
  currentPage.value = p
}

function goPrevPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

function goNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

/* ===== 정렬 로직 ===== */
function sortArray(arr) {
  const copy = [...arr]

  if (sortOption.value === 'latest') {
    // createdAt 문자열을 Date로 변환 후 최신순 정렬
    copy.sort((a, b) => {
      const da = new Date(a.createdAt?.replace(' ', 'T'))
      const db = new Date(b.createdAt?.replace(' ', 'T'))
      return db - da
    })
  } else if (sortOption.value === 'view') {
    copy.sort((a, b) => {
      const va = Number(a.view ?? 0)
      const vb = Number(b.view ?? 0)
      return vb - va
    })
  } else if (sortOption.value === 'like') {
    copy.sort((a, b) => {
      const la = Number(a.likeCount ?? 0)
      const lb = Number(b.likeCount ?? 0)
      return lb - la
    })
  }

  return copy
}

function applySortAndResetPage() {
  posts.value = sortArray(posts.value)
  currentPage.value = 1
}

/* ===== 목록 불러오기 =====
 * GET http://localhost:8000/post-service/donation-posts/query/posts
 */
async function fetchDonationPosts() {
  try {
    const res = await fetch(
      'http://localhost:8000/post-service/donation-posts/query/posts',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`
        }
      }
    )

    if (!res.ok) {
      console.error('[ 로드 실패]', res.status)
      return
    }

    const data = await res.json()

    const mapped = Array.isArray(data)
      ? data.map(item => ({
          id: item.id,
          shelterName: item.shelterName,
          title: item.title,
          userName: item.userName,
          view: item.view,
          likeCount: item.likeCount,
          createdAt: item.createdAt
        }))
      : []

    allPosts.value = mapped

    // 검색/정렬 전 전체 -> 현재 posts에도 반영
    posts.value = sortArray(mapped)

    // 통계 갱신
    stats.value = {
      totalDonations: mapped.length,
      participatingShelters: new Set(mapped.map(p => p.shelterName)).size,
      totalSupporters: mapped.reduce(
        (sum, p) => sum + (p.likeCount ?? 0),
        0
      )
    }

    currentPage.value = 1
  } catch (err) {
    console.error('fetchDonationPosts Error:', err)
  }
}

/* ===== 검색 ===== */
function onSearch() {
  const k = keyword.value.trim()

  if (!k) {
    // 검색어 없으면 전체로 복구
    posts.value = sortArray(allPosts.value)
  } else {
    const filtered = allPosts.value.filter(p => {
      const field = searchField.value
      const target = p[field]
      if (target == null) return false
      return String(target).includes(k)
    })

    posts.value = sortArray(filtered)
  }

  currentPage.value = 1
}

// 보호소장 여부 (나중에 JWT에서 role 꺼내서 true/false 주면 됨)
const isShelterHead = ref(true) // 데모용. 보호소장이라고 가정해서 글쓰기 가능하게.

// 글쓰기 버튼
function handleWriteClick() {
  if (isShelterHead.value) {
    router.push({ name: 'donation.write' })
  } else {
    showRoleModal.value = true
  }
}

function closeRoleModal() {
  showRoleModal.value = false
}

/* ===== 상세 페이지 이동 ===== */
function goDetail(id) {
  router.push({ name: 'donation-detail', params: { id } })
}

onMounted(() => {
  fetchDonationPosts()
})
</script>

<style scoped>
/* ===== 페이지 기본 ===== */
.donation-page {
  background-color: #efe8dd;
  color: #2a1c10;
  min-height: 100vh;
  padding: 40px 20px 100px;
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
}

.donation-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== 헤더 영역 ===== */
.page-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}
.page-desc {
  font-size: 14px;
  color: #4a3a2a;
  margin-top: 6px;
  line-height: 1.4;
  word-break: keep-all;
}

/* ===== 검색 영역 ===== */
.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background: #f8f1e5;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
}
.search-row select {
  border: 1px solid #cbb9a2;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  padding: 8px 10px;
}
.search-input {
  flex: 1;
  border: 1px solid #cbb9a2;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 14px;
  background: #fff;
}
.search-btn {
  background: #8a6237;
  border: none;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.3;
}
.search-btn:hover {
  background: #6f4f2a;
}

/* ===== 통계 카드 ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.stat-card {
  background: #f8f1e5;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.stat-label {
  font-size: 14px;
  color: #4a3a2a;
}
.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #8a6237;
}

/* ===== 게시판 상단 ===== */
.board-headbar {
  background: #f8f1e5;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  row-gap: 12px;
}
.board-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  font-size: 14px;
  color: #4a3a2a;
}
.board-count {
  font-size: 14px;
  color: #4a3a2a;
  line-height: 1.4;
  white-space: nowrap;
}
.sort-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
  white-space: nowrap;
}
.sort-label {
  font-size: 14px;
  color: #4a3a2a;
  line-height: 1.4;
}
.sort-select {
  appearance: none;
  background-color: #fff;
  border: 1px solid #cbb9a2;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.3;
  padding: 8px 28px 8px 10px;
  color: #2a1c10;
  min-width: 90px;
  cursor: pointer;
  background-image:
    linear-gradient(45deg, transparent 50%, #6f4f2a 50%),
    linear-gradient(135deg, #6f4f2a 50%, transparent 50%);
  background-position:
    calc(100% - 16px) calc(50% - 3px),
    calc(100% - 11px) calc(50% + 2px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
}
.write-btn {
  background: #8a6237;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.3;
  white-space: nowrap;
}
.write-btn:hover {
  background: #6f4f2a;
}

/* ===== 테이블 ===== */
.board-table-wrap {
  background: #f8f1e5;
  border-radius: 8px;
  overflow-x: auto;
}
.board-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}
.board-table th,
.board-table td {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 14px;
  line-height: 1.4;
  color: #2a1c10;
}
.board-table th {
  background: #ece2d4;
  font-weight: 600;
  white-space: nowrap;
  color: #2a1c10;
}
.board-row {
  cursor: pointer;
}
.board-row:hover {
  background: rgba(0, 0, 0, 0.03);
}
.text-left {
  text-align: left;
}
.title-cell .title-text {
  display: inline-block;
  max-width: 100%;
  color: #2a1c10;
  font-weight: 500;
  line-height: 1.4;
  word-break: keep-all;
}
.empty-row {
  text-align: center;
  padding: 20px;
  color: #8a7a6b;
  font-size: 14px;
}

/* ===== 페이지네이션 ===== */
.pagination-wrap {
  background: #f3eee6;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.04);
  padding: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.page-btn {
  min-width: 44px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #d4c7ad;
  background: #fff;
  font-size: 14px;
  line-height: 1.3;
  color: #2a1c10;
  cursor: pointer;
  font-weight: 500;
}
.page-btn[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-btn.active {
  background: #d9c488;
  color: #2a1c10;
  border-color: #d9c488;
  font-weight: 600;
}

/* ===== 후원 안내 ===== */
.donation-guide-box {
  background: #f8f1e5;
  border-radius: 8px;
  padding: 16px;
}
.guide-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.guide-title {
  font-size: 16px;
  font-weight: 600;
}
.guide-desc {
  font-size: 14px;
  color: #4a3a2a;
  margin: 4px 0;
  line-height: 1.5;
  word-break: keep-all;
}

/* ===== 모달 ===== */
.role-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.role-modal {
  background: #f8f1e5;
  border-radius: 10px;
  padding: 24px;
  max-width: 340px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0,0,0,0.2);
  border: 1px solid rgba(0,0,0,0.07);
}
.role-modal-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.role-modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #6f4f2a;
}
.role-modal-desc {
  font-size: 14px;
  margin: 10px 0 20px;
  color: #2a1c10;
  line-height: 1.5;
  word-break: keep-all;
}
.role-modal-close-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #6f4f2a;
  color: #6f4f2a;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.3;
}

/* ===== 조회수 셀 정렬 ===== */
.view-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  font-weight: 500;
  font-size: 14px;
  color: #2b1a0f;
  line-height: 1.4;
  text-align: center;
  white-space: nowrap;
}
.view-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: block;
}
.view-num {
  line-height: 1.4;
  font-size: 14px;
  font-weight: 500;
}

/* 반응형 */
@media (max-width: 768px) {
  .donation-inner {
    padding: 0 16px;
    max-width: 100%;
  }
}
</style>
