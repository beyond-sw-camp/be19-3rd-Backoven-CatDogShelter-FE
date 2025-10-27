<template>
  <main class="missing-page">
    <div class="missing-inner">
      <!-- ===== 타이틀 영역 ===== -->
      <header class="page-head">
        <h1 class="page-title">실종 신고</h1>
        <p class="page-desc">실종된 반려동물을 찾는데 도움을 드립니다</p>
      </header>

      <!-- ===== 상단 검색바: 검색 기준 드롭다운 + 인풋 ===== -->
      <section class="top-search-bar">
        <div class="top-search-row">
          <label class="top-search-label" for="searchKeyword">제목</label>

          <!-- 검색 기준 드롭다운 -->
          <select
            v-model="searchField"
            class="search-field-select"
          >
            <option value="title">제목</option>
            <option value="comment">댓글</option>
            <option value="writer">작성자</option>
          </select>

          <!-- 검색 인풋 -->
          <div class="top-search-input-wrap">
            <span class="search-icon">🔍</span>
            <input
              id="searchKeyword"
              v-model.trim="filters.keyword"
              type="text"
              class="top-search-input"
              :placeholder="placeholderByField"
              @keyup.enter="fetchPosts(1)"
            />
          </div>
        </div>
      </section>

      <!-- ===== 필터 영역 (동물종류 / 실종상태 / 성별 / 장소 / 품종 / 색상 / 검색버튼) ===== -->
      <section class="filter-shell">
        <div class="filter-bar">
          <div class="filter-head">
            <button
              class="filter-toggle"
              type="button"
              @click="filterOpen = !filterOpen"
            >
              <span>필터</span>
              <span class="arrow" :class="{ open: filterOpen }">⌄</span>
            </button>

            <button class="report-btn" @click="onReportMissing">
              <span class="report-icon">📝</span>
              <span>실종 신고하기</span>
            </button>
          </div>

          <transition name="fade">
            <div v-if="filterOpen" class="filter-body">
              <!-- 1줄 필터 라인 -->
              <div class="filter-row">
                <select v-model="filters.animalType" class="filter-select short">
                  <option value="">동물 종류</option>
                  <option value="CAT">고양이</option>
                  <option value="DOG">강아지</option>
                  <option value="ETC">기타</option>
                </select>

                <select v-model="filters.isFound" class="filter-select short">
                  <option value="">실종 상태</option>
                  <option value="MISSING">실종</option>
                  <option value="FOUND">발견</option>
                </select>

                <select v-model="filters.sex" class="filter-select short">
                  <option value="">성별</option>
                  <option value="MALE">남아</option>
                  <option value="FEMALE">여아</option>
                  <option value="UNKNOWN">모름</option>
                </select>

                <input
                  v-model="filters.location"
                  class="filter-input long"
                  type="text"
                  placeholder="실종 장소를 입력해주세요"
                />

                <input
                  v-model="filters.breed"
                  class="filter-input long"
                  type="text"
                  placeholder="품종을 입력해주세요"
                />

                <input
                  v-model="filters.color"
                  class="filter-input long"
                  type="text"
                  placeholder="색상을 입력해주세요"
                />
              </div>

              <!-- 검색 버튼 라인 -->
              <div class="filter-search-row">
                <button class="filter-search-btn" @click="fetchPosts(1)">
                  검색
                </button>
              </div>
            </div>
          </transition>
        </div>
      </section>

      <!-- ===== 리스트 상단 요약 ===== -->
      <section class="list-head-row">
        <div class="list-left">
          <span class="count-text">총 {{ totalCount }}개의 게시글</span>
          <span class="divider">|</span>
          <label class="order-label">
            정렬 조건
            <select
              v-model="filters.sort"
              class="order-select"
              @change="fetchPosts(page)"
            >
              <option value="LATEST">최신순</option>
              <option value="VIEW">조회순</option>
              <option value="LIKE">공감순</option>
            </select>
          </label>
        </div>
      </section>

      <!-- ===== 게시글 리스트 ===== -->
      <section class="post-list">
        <article
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          @click="goDetail(post.id)"
        >
          <!-- 왼쪽: 썸네일 (지금은 이미지 없으니까 더미) -->
          <div class="thumb-wrap">
            <img
              class="thumb-img"
              :src="post.thumbnailUrl || defaultThumb"
              alt=""
            />
          </div>

          <!-- 가운데: 본문 -->
          <div class="post-main">
            <!-- 뱃지들 -->
            <div class="badge-row">
              <span
                class="state-badge"
                :class="post.status === false ? 'state-missing' : 'state-found'"
              >
                {{ post.status === false ? '실종중' : '발견' }}
              </span>
              <span class="type-badge">
                {{ post.animalTypeLabel || '고양이' }}
              </span>
            </div>

            <!-- 제목 -->
            <h2 class="post-title">{{ post.title }}</h2>

            <!-- 상세정보 (현재 백엔드에서 안 주는 필드는 임시 placeholder) -->
            <ul class="info-grid">
              <li>
                <span class="info-label">품종 :</span>
                <span class="info-value">{{ post.breed || '-' }}</span>
              </li>
              <li>
                <span class="info-label">색상 :</span>
                <span class="info-value">{{ post.color || '-' }}</span>
              </li>
              <li>
                <span class="info-label">나이 :</span>
                <span class="info-value">{{ post.age || '-' }}</span>
              </li>
              <li>
                <span class="info-label">성별 :</span>
                <span class="info-value">{{ post.sexText || '-' }}</span>
              </li>
              <li class="info-wide">
                <span class="info-label">특징 :</span>
                <span class="info-value">
                  {{ post.featureDesc || '상세 내용은 게시글에서 확인해주세요.' }}
                </span>
              </li>
              <li class="info-wide">
                <span class="info-label">실종 장소 :</span>
                <span class="info-value">{{ post.missingLocation || '-' }}</span>
              </li>
              <li>
                <span class="info-label">연락처 :</span>
                <span class="info-value">{{ post.contact || '-' }}</span>
              </li>
              <li>
                <span class="info-label">실종 일시 :</span>
                <span class="info-value">{{ post.missingDate || '-' }}</span>
              </li>
            </ul>
          </div>

          <!-- 오른쪽: 메타 -->
          <aside class="post-meta">
            <div class="meta-top">
              <div class="meta-row">
                <span class="meta-label">작성일 :</span>
                <span class="meta-value">{{ post.createdAt }}</span>
              </div>

              <div class="meta-stats">
                <span class="stat-item">
                  <span class="dot">●</span>
                  <span class="stat-num">{{ post.view }}</span>
                </span>
                <span class="stat-item">
                  <span class="heart">♡</span>
                  <span class="stat-num">{{ post.likeCount }}</span>
                </span>
              </div>
            </div>

            <div class="meta-writer">
              <div class="writer-role-badge">
                {{ post.userRating }}
              </div>
              <div class="writer-name">작성자 : {{ post.userName }}</div>
            </div>
          </aside>
        </article>

        <div v-if="posts.length === 0" class="empty">
          게시글이 없습니다.
        </div>
      </section>

      <!-- ===== 페이지네이션 ===== -->
      <nav class="pagination-wrap" aria-label="페이지네이션">
        <button
          class="page-btn"
          :disabled="page === 1"
          @click="fetchPosts(page - 1)"
        >
          이전
        </button>

        <button
          v-for="p in pageNumbers"
          :key="p"
          class="page-num"
          :class="{ active: p === page }"
          @click="fetchPosts(p)"
        >
          {{ p }}
        </button>

        <button
          class="page-btn"
          :disabled="page === totalPages"
          @click="fetchPosts(page + 1)"
        >
          다음
        </button>
      </nav>
    </div>
  </main>
</template>

<script>
export default {
  name: 'MissingListView',

  data() {
    return {
      filterOpen: true,

      // 목록
      posts: [],
      totalCount: 0,

      // 페이지 정보 (지금 API엔 totalCount / totalPages 안받았으니까 기본값으로 둠)
      page: 1,
      pageSize: 10,
      totalPages: 1,

      // 검색 기준 (제목 / 댓글 / 작성자)
      searchField: 'title',

      // 기본 썸네일 (임시)
      defaultThumb:
        'https://placekitten.com/200/200',

      // 필터 값
      filters: {
        keyword: '',
        animalType: '',
        isFound: '',
        sex: '',
        location: '',
        breed: '',
        color: '',
        sort: 'LATEST',
      },
    }
  },

  computed: {
    placeholderByField() {
      if (this.searchField === 'title') return '검색어를 입력해주세요'
      if (this.searchField === 'comment') return '댓글 내용을 입력해주세요'
      if (this.searchField === 'writer') return '작성자를 입력해주세요'
      return '검색어를 입력해주세요'
    },

    pageNumbers() {
      const nums = []
      for (let i = 1; i <= this.totalPages; i++) {
        nums.push(i)
      }
      return nums
    },
  },

  mounted() {
    this.fetchPosts(1)
  },

  methods: {
    async fetchPosts(targetPage) {
      const pageToLoad = targetPage || this.page

      // 현재 백엔드 응답 구조: 배열만 내려옴
      // GET localhost:8000/post-service/missing-posts/query/posts
      // querystring은 지금 설계 주도권 너한테 있으니까
      // 일단 page랑 keyword 정도만 붙여서 호출해줄게.
      const params = new URLSearchParams({
        page: pageToLoad,
        size: this.pageSize,
        keyword: this.filters.keyword,
        searchField: this.searchField,
        sort: this.filters.sort,
        animalType: this.filters.animalType,
        isFound: this.filters.isFound,
        sex: this.filters.sex,
        location: this.filters.location,
        breed: this.filters.breed,
        color: this.filters.color,
      })

      try {
        const res = await fetch(
          `http://localhost:8000/post-service/missing-posts/query/posts?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Authorization: `Bearer ${token}` 필요하면 넣어
            },
          }
        )

        if (!res.ok) {
          throw new Error('게시글 로드 실패')
        }

        const data = await res.json()

        // data = [ {id, status, title, createdAt, view, userName, likeCount, userRating}, ... ]
        // 아직 totalCount, totalPages가 없으니까
        // 일단 length로 대체
        this.posts = Array.isArray(data) ? data : []
        this.totalCount = this.posts.length

        this.page = pageToLoad
        // 페이징은 아직 없다고 가정: 그냥 1페이지 고정
        this.totalPages = 1
      } catch (err) {
        console.error('실종 게시글 조회 실패:', err)
        this.posts = []
        this.totalCount = 0
      }
    },

    goDetail(postId) {
      // 상세로 라우팅 (라우터에 /missing/:id 이런식으로 맞춰줘)
      this.$router.push(`/missing/${postId}`)
    },

    onReportMissing() {
      // 글쓰기 이동
      this.$router.push('/missing/new')
    },
  },
}
</script>

<style scoped>
/* ================= 공통 색상 토큰 ================= */
:root {
  --bg-page: #f5efe6;          /* 전체 배경 톤 */
  --bg-header-bar: #efe3cc;    /* 페이지 맨 위 얇은 라인 영역이라면 여기에 사용 가능 */
  --panel-bg: #ffffff;
  --panel-soft-bg: #fffdf8;    /* 카드 안배경 톤온톤 */
  --line-soft: rgba(0, 0, 0, 0.08);
  --line-card: #d8b4a4;
  --brown-text: #2a1c10;
  --brown-soft: #4a3728;
  --meta-text: #6b5b4a;
  --chip-bg: #f9f4ef;
  --chip-border: rgba(0, 0, 0, 0.08);
  --accent-btn-bg: #b4442a;
  --accent-btn-text: #fff;
  --input-bg: #ffffff;
  --input-border: rgba(0, 0, 0, 0.3);
  --input-placeholder: #9a8e80;
  --badge-missing-bg: #d53016;
  --badge-missing-text: #fff;
  --badge-found-bg: #4caf50;
  --badge-found-text: #fff;
  --pagination-bg: #f5f0e8;
  --pagination-active-bg: #c9b097;
  --pagination-active-text: #fff;
}

/* 페이지 전체 */
.missing-page {
  background-color: var(--bg-page);
  min-height: 100vh;
  padding: 24px 0 80px;
  color: var(--brown-text);
  font-family: "Pretendard", system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
}

.missing-inner {
  max-width: 900px;
  margin: 0 auto;
}

/* 타이틀 */
.page-head {
  margin-bottom: 20px;
}
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--brown-text);
  line-height: 1.4;
}
.page-desc {
  font-size: 13px;
  color: var(--meta-text);
  margin-top: 4px;
  line-height: 1.4;
}

/* ===== 상단 검색바 ===== */
.top-search-bar {
  background: var(--panel-bg);
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 10px;
  font-size: 13px;
}
.top-search-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 12px;
  row-gap: 8px;
}
.top-search-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--brown-text);
  white-space: nowrap;
}

/* 검색 기준 셀렉트 */
.search-field-select {
  background: var(--panel-bg);
  border: 1px solid var(--input-border);
  border-radius: 4px;
  font-size: 13px;
  padding: 8px 10px;
  color: var(--brown-text);
  outline: none;
  min-width: 90px;
}

/* 검색 인풋 */
.top-search-input-wrap {
  position: relative;
  flex: 1;
  max-width: 400px;
  display: flex;
  align-items: center;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 4px;
  padding-left: 28px;
}
.search-icon {
  position: absolute;
  left: 8px;
  font-size: 13px;
  color: var(--input-placeholder);
}
.top-search-input {
  width: 100%;
  border: 0;
  font-size: 13px;
  padding: 8px 10px;
  color: var(--brown-text);
  background-color: transparent;
  outline: none;
}
.top-search-input::placeholder {
  color: var(--input-placeholder);
}

/* ===== 필터 바 ===== */
.filter-shell {
  margin-bottom: 12px;
}
.filter-bar {
  background: var(--panel-bg);
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  overflow: hidden;
}
.filter-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f1e5;
  border-bottom: 1px solid var(--line-soft);
  padding: 10px 16px;
  font-size: 13px;
}
.filter-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 0;
  font-size: 13px;
  color: var(--brown-text);
  cursor: pointer;
  font-weight: 500;
}
.filter-toggle .arrow {
  font-size: 11px;
  transition: transform 0.2s ease;
  line-height: 1;
}
.filter-toggle .arrow.open {
  transform: rotate(180deg);
}

/* 실종 신고하기 버튼 */
.report-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--accent-btn-bg);
  color: var(--accent-btn-text);
  font-size: 12px;
  font-weight: 500;
  padding: 7px 10px;
  border-radius: 4px;
  border: 0;
  cursor: pointer;
}
.report-btn .report-icon {
  font-size: 12px;
  line-height: 1;
}

/* 필터 body */
.filter-body {
  padding: 12px 16px;
  background: var(--panel-bg);
  font-size: 13px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.filter-select.short {
  flex: 0 0 160px;
}
.filter-input.long {
  flex: 1;
  min-width: 180px;
}

.filter-select,
.filter-input {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 12px;
  color: var(--brown-text);
  outline: none;
}
.filter-select::placeholder,
.filter-input::placeholder {
  color: var(--input-placeholder);
}

/* 검색 버튼 */
.filter-search-row {
  text-align: right;
}
.filter-search-btn {
  background: var(--brown-text);
  color: #fff;
  border: 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  padding: 7px 12px;
  cursor: pointer;
}

/* 필터 열고닫기 트랜지션 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ===== 리스트 헤더 ===== */
.list-head-row {
  font-size: 12px;
  color: var(--meta-text);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.list-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.count-text {
  font-size: 12px;
  color: var(--brown-text);
}
.divider {
  color: var(--meta-text);
  font-size: 12px;
}
.order-label {
  font-size: 12px;
  color: var(--meta-text);
  display: flex;
  align-items: center;
  gap: 4px;
}
.order-select {
  background: var(--panel-bg);
  border: 1px solid var(--input-border);
  border-radius: 4px;
  font-size: 12px;
  padding: 4px 6px;
  color: var(--brown-text);
  outline: none;
}

/* ===== 게시글 카드 ===== */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.post-card {
  cursor: pointer;
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 16px;
  background: var(--panel-soft-bg);
  border: 1px solid var(--line-card);
  border-radius: 6px;
  padding: 16px;
  font-size: 13px;
  line-height: 1.4;
  box-shadow: 0 2px 3px rgba(0,0,0,0.03);
}

/* 썸네일 */
.thumb-wrap {
  width: 100%;
  height: 120px;
  border: 1px solid var(--line-soft);
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 가운데 본문 */
.post-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}
.state-badge {
  font-size: 11px;
  line-height: 1;
  font-weight: 600;
  border-radius: 4px;
  padding: 5px 6px;
  color: var(--badge-missing-text);
  background-color: var(--badge-missing-bg);
}
.state-found {
  background-color: var(--badge-found-bg);
  color: var(--badge-found-text);
}
.type-badge {
  background-color: #fff;
  color: var(--brown-text);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  border-radius: 4px;
  padding: 5px 6px;
  border: 1px solid var(--chip-border);
}
.post-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--brown-text);
  line-height: 1.4;
  margin-bottom: 10px;
  word-break: keep-all;
}

/* 상세 정보 그리드 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 4px;
  font-size: 12px;
  color: var(--brown-text);
}
.info-wide {
  grid-column: 1 / -1;
}
.info-label {
  font-weight: 500;
  margin-right: 4px;
  color: var(--brown-soft);
}
.info-value {
  color: var(--brown-text);
  word-break: keep-all;
}

/* 오른쪽 메타 영역 */
.post-meta {
  font-size: 12px;
  color: var(--meta-text);
  min-width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.meta-top {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  text-align: right;
}
.meta-row {
  white-space: nowrap;
}
.meta-label {
  color: var(--meta-text);
}
.meta-value {
  color: var(--brown-text);
  font-weight: 500;
  margin-left: 4px;
}
.meta-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: var(--meta-text);
}
.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.dot {
  font-size: 10px;
  line-height: 1;
}
.heart {
  font-size: 11px;
  line-height: 1;
  transform: translateY(-1px);
}
.stat-num {
  min-width: 16px;
  text-align: right;
}

.meta-writer {
  text-align: right;
}
.writer-role-badge {
  display: inline-block;
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
  border-radius: 4px;
  font-size: 11px;
  padding: 3px 5px;
  font-weight: 500;
  color: var(--brown-text);
  margin-bottom: 4px;
}
.writer-name {
  font-size: 12px;
  color: var(--brown-text);
  font-weight: 500;
  line-height: 1.4;
}

/* 빈 상태 */
.empty {
  background: var(--panel-soft-bg);
  border: 1px solid var(--line-card);
  border-radius: 6px;
  padding: 40px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--meta-text);
}

/* 페이지네이션 */
.pagination-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
}
.page-btn,
.page-num {
  background: var(--pagination-bg);
  border: 1px solid var(--line-card);
  border-radius: 4px;
  font-size: 12px;
  padding: 6px 10px;
  cursor: pointer;
  min-width: 36px;
  text-align: center;
  color: var(--brown-text);
}
.page-btn[disabled] {
  opacity: 0.4;
  cursor: default;
}
.page-num.active {
  background: var(--pagination-active-bg);
  border-color: var(--pagination-active-bg);
  color: var(--pagination-active-text);
  font-weight: 600;
}

/* 반응형 */
@media (max-width: 700px) {
  .post-card {
    grid-template-columns: 100px 1fr;
  }

  .post-meta {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 12px;
  }

  .meta-top {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .meta-writer {
    text-align: right;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>