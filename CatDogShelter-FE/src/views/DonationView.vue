<template>
  <div class="donation-page">
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

    <!-- ===== 게시판 헤더 (정렬, 등록 버튼) ===== -->
    <section class="board-headbar">
      <div class="board-meta">
        <span>총 {{ posts.length }}개의 게시글</span>
      </div>
      <button class="write-btn" @click="handleWriteClick">게시글 등록</button>
    </section>

    <!-- ===== 게시글 테이블 ===== -->
    <section class="board-table-wrap">
      <table class="board-table">
        <thead>
          <tr>
            <th>보호소</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>좋아요</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
            @click="goDetail(post.id)"
            class="board-row"
          >
            <td>{{ post.shelterName }}</td>
            <td class="text-left">{{ post.title }}</td>
            <td>{{ post.userName }}</td>
            <td>👁 {{ post.view }}</td>
            <td>❤️ {{ post.likeCount }}</td>
            <td>{{ post.createdAt }}</td>
          </tr>

          <tr v-if="posts.length === 0">
            <td colspan="6" class="empty-row">등록된 게시글이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </section>

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
          <button class="role-modal-close-btn" @click="closeRoleModal">닫기</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 보호소장 여부 (JWT decode로 세팅해도 됨)
const isShelterHead = ref(false)

// 게시글 목록
const posts = ref([])

// 통계 (일단 기본값)
const stats = ref({
  totalDonations: 0,
  participatingShelters: 0,
  totalSupporters: 0,
})

const searchField = ref('title')
const keyword = ref('')
const showRoleModal = ref(false)

const searchPlaceholder = computed(() => {
  if (searchField.value === 'shelterName') return '보호소명을 입력하세요'
  if (searchField.value === 'userName') return '작성자를 입력하세요'
  return '검색어를 입력하세요'
})

// 후원게시판 불러오기
async function fetchDonationPosts() {
  try {
    const res = await fetch(
      `http://localhost:8000/post-service/donation-posts/query/posts`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    if (!res.ok) {
      console.error('후원게시판 로드 실패:', res.status)
      return
    }

    const data = await res.json()
    posts.value = Array.isArray(data) ? data : []

    // 간단히 통계 데이터 추정
    stats.value = {
      totalDonations: data.length,
      participatingShelters: new Set(data.map(d => d.shelterName)).size,
      totalSupporters: data.reduce((acc, cur) => acc + (cur.likeCount ?? 0), 0),
    }
  } catch (err) {
    console.error('fetchDonationPosts Error:', err)
  }
}

// 검색
function onSearch() {
  // 현재는 단순 프론트 필터
  const k = keyword.value.trim()
  if (!k) return fetchDonationPosts()
  posts.value = posts.value.filter(p =>
    String(p[searchField.value]).includes(k)
  )
}

// 글쓰기 클릭
function handleWriteClick() {
  if (isShelterHead.value) {
    router.push({ name: 'DonationWrite' })
  } else {
    showRoleModal.value = true
  }
}

function closeRoleModal() {
  showRoleModal.value = false
}

// 상세 페이지 이동
function goDetail(id) {
  router.push({ name: 'DonationDetail', params: { id } })
}

onMounted(() => {
  fetchDonationPosts()
})
</script>

<style scoped>
/* ===== 기본 ===== */
.donation-page {
  background-color: #efe8dd;
  color: #2a1c10;
  min-height: 100vh;
  padding: 24px 100px 100px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
}

/* ===== 헤더 ===== */
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
}

/* ===== 검색 ===== */
.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background: #f8f1e5;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
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

/* ===== 게시판 헤드 ===== */
.board-headbar {
  background: #f8f1e5;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.write-btn {
  background: #8a6237;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
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
}
.board-table th,
.board-table td {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.board-table th {
  background: #ece2d4;
  font-weight: 600;
}
.board-row:hover {
  background: rgba(0, 0, 0, 0.03);
  cursor: pointer;
}
.text-left {
  text-align: left;
}
.empty-row {
  text-align: center;
  padding: 20px;
  color: #8a7a6b;
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
}

/* ===== 모달 ===== */
.role-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.role-modal {
  background: #f8f1e5;
  border-radius: 10px;
  padding: 24px;
  max-width: 340px;
  text-align: center;
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
}
</style>