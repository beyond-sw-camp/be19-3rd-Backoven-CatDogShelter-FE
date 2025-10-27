<template>
  <div class="heroes-container">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>랭킹 데이터를 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error">
      <p>에러가 발생: {{ error }}</p>
      <button @click="loadRankings" class="retry-btn">다시 시도</button>
    </div>

    <!-- 정상 표시 -->
    <template v-else>
      <!-- 타이틀 섹션 -->
      <section class="title-section">
        <h1 class="title">.°♔°.이달의댕냥 히어로즈⋆˚✧˖°</h1>
      </section>

      <!-- TOP 3 포디움 -->
      <div class="podium-section" v-if="top3.length >= 3">
        <div class="podium-container">
          <!-- 2등 -->
          <div class="podium-card rank-2">
            <div class="rank-number">#2</div>
            <div class="user-name">{{ top3[1].name }}</div>
            <span class="badge">{{ top3[1].badge }}</span>
            <div class="stats">
              <div class="stat-item">
                <span class="time">{{ top3[1].adoptionTime }}</span>
                <span class="label">이달의 봉사시간</span>
              </div>
              <div class="stat-item">
                <span class="count">{{ top3[1].adoptionCount }}회</span>
                <span class="label">누적 봉사활동</span>
              </div>
            </div>
          </div>

          <!-- 1등 (중앙, 높게) -->
          <div class="podium-card rank-1">
            <div class="dog-image">
              <img src="@/assets/podium-dogs.png" alt="강아지들" />
            </div>
            <div class="rank-number">#1</div>
            <div class="user-name">{{ top3[0].name }}</div>
            <span class="badge">{{ top3[0].badge }}</span>
            <div class="stats">
              <div class="stat-item">
                <span class="time">{{ top3[0].adoptionTime }}</span>
                <span class="label">이달의 봉사시간</span>
              </div>
              <div class="stat-item">
                <span class="count">{{ top3[0].adoptionCount }}회</span>
                <span class="label">누적 봉사활동</span>
              </div>
            </div>
          </div>

          <!-- 3등 -->
          <div class="podium-card rank-3">
            <div class="rank-number">#3</div>
            <div class="user-name">{{ top3[2].name }}</div>
            <span class="badge">{{ top3[2].badge }}</span>
            <div class="stats">
              <div class="stat-item">
                <span class="time">{{ top3[2].adoptionTime }}</span>
                <span class="label">이달의 봉사시간</span>
              </div>
              <div class="stat-item">
                <span class="count">{{ top3[2].adoptionCount }}회</span>
                <span class="label">누적 봉사활동</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 랭킹 테이블 -->
      <section class="ranking-section" v-if="rankings.length > 0">
        <h2 class="section-title">이달의 봉사 활동 랭킹 TOP 50</h2>
        <p class="update-date">
        <img src="@/assets/calendar.png" class="calendar-icon" alt="update date" />
        {{ updateDate }}
        </p>

        <div class="table-wrapper">
          <table class="ranking-table">
            <thead>
              <tr>
                <th class="rank-header">순위</th>
                <th class="name-header">이름</th>
                <th class="badge-header">등급</th>
                <th class="time-header">이달의 봉사시간</th>
                <th class="count-header">누적 봉사활동</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in displayedRankings" 
                :key="user.rank"
                :class="{ 'top-three': user.rank <= 3 }"
              >
                <td class="rank-cell">
                  <span class="rank-number" :class="getRankClass(user.rank)">
                    {{ user.rank }}
                  </span>
                  <span v-if="user.rank <= 3" class="crown-icon"></span>
                </td>
                <td class="name-cell">
                  <span class="user-name">{{ user.name }}</span>
                  <span v-if="user.rank <= 3" class="fire-icon"></span>
                </td>
                <td class="badge-cell">
                  <span class="user-badge" :class="getBadgeClass(user.badge)">
                    {{ user.badge }}
                  </span>
                </td>
                        <td class="time-cell">
                <img src="@/assets/time.png" class="icon-img" alt="time" />
                {{ user.adoptionTime }}
                </td>

    <td class="count-cell">
  <img src="@/assets/bagge.png" class="icon-img" alt="badge" />
  {{ user.adoptionCount }}회
</td>


              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
        <div class="pagination">
          <button 
            class="page-btn" 
            @click="currentPage--"
            :disabled="currentPage === 1"
          >
            이전
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-number"
            :class="{ active: currentPage === page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button 
            class="page-btn"
            @click="currentPage++"
            :disabled="currentPage === totalPages"
          >
            다음
          </button>
        </div>
      </section>

      <!-- 안내 정보 -->
      <div class="info-box" v-if="heroesInfo.length > 0">
        <h3>💡 댕냥히어로즈 선정 기준</h3>
        <ul>
          <li v-for="(info, index) in heroesInfo" :key="index">
            {{ info }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const rankings = ref([]);
const updateDate = ref('');
const heroesInfo = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const loading = ref(false);
const error = ref('');

const top3 = computed(() => rankings.value.filter(r => r.isTop3).slice(0, 3));

const displayedRankings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return rankings.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(rankings.value.length / itemsPerPage));

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

function getRankClass(rank) {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return '';
}

function getBadgeClass(badge) {
  if (badge.includes('보호천사')) return 'angel';
  if (badge.includes('지킴이')) return 'advisor';
  if (badge.includes('천구')) return 'friend';
  if (badge.includes('발자국')) return 'beginner';
  return '';
}

async function loadRankings() {
  loading.value = true;
  error.value = '';
  
  try {
    const url = 'http://localhost:3000/rankings';
    console.log(`시도 중: ${url}`);
    
    const res = await fetch(url);
    const data = await res.json();

    console.log("성공:", url, data);

    rankings.value = Array.isArray(data) ? data : (data.rankings || []);
    heroesInfo.value = [
      "월별 1위부터 월간랭킹만 적용 활동 시간과 기록으로 산정됩니다.",
      "봉사 활동 누적 실적을 기반으로 배지등급이 부여됩니다.",
      "데이터 검증을통해 비정상적 활동은 다시 검토 후 제외됩니다."
    ];

    console.log('로드된 랭킹:', rankings.value.length);

  } catch (err) {
    console.error('랭킹 데이터 로드 실패:', err);
    error.value = '랭킹 데이터를 불러올 수 없습니다.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadRankings();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.heroes-container {
  width: 100vw; /* 화면 가로 전체 */
  min-height: 100vh; /* 화면 세로 전체 */
  margin-left: calc(50% - 50vw); /* 부모 패딩 강제 무시! */
  background: #f5e6d3; /* 네가 쓰는 메인 배경색 */
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}


/* 로딩 & 에러 */
.loading, .error {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d0c9b8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error p {
  color: #dc2626;
  font-size: 16px;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 24px;
  background: #d8bd89;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.retry-btn:hover {
  background: #c7a670;
}

/* 타이틀 */
.title-section {
  text-align: center;
  margin-bottom: 50px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #4a3b2a;
  background: white;
  display: inline-block;
  padding: 14px 36px;
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 포디움 섹션 */
.podium-section {
  margin: 50px 0;
}

.podium-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.podium-card {
  background: white;
  border-radius: 16px;
  padding: 24px 20px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: transform 0.3s ease;
  flex: 1;
  max-width: 260px;
}

.podium-card:hover {
  transform: translateY(-4px);
}

.rank-1 {
  background: #fef5e7;
  border: 2px solid #f0e6d2;
  margin-bottom: 30px;
  padding-top: 80px;
}

.rank-2, .rank-3 {
  background: white;
  border: 2px solid #e8dcc8;
}

.dog-image {
  position: absolute;
  top: -70px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.dog-image img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.rank-number {
  font-size: 28px;
  font-weight: 800;
  color: #333;
  margin-bottom: 8px;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.badge {
  display: inline-block;
  padding: 5px 14px;
  background: #f0e6d2;
  color: #8b6914;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  border: 1px solid #e0d4be;
}

.stats {
  display: flex;
  justify-content: space-around;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.time, .count {
  font-size: 16px;
  font-weight: 700;
  color: #d97706;
}

.label {
  font-size: 11px;
  color: #999;
}

/* 랭킹 섹션 */
.ranking-section {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-top: 40px;
}
.ranking-section {
  width: 60%;
  margin: 0 auto;  /* 중앙 정렬 */
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 4px;
}

.update-date {
  text-align: center;
  color: #999;
  font-size: 13px;
  margin-bottom: 24px;
}

/* 테이블 */
.table-wrapper {
  overflow-x: auto;
  margin-bottom: 24px;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
}

.ranking-table thead {
  background: #fafafa;
  border-bottom: 2px solid #e8e8e8;
}

.ranking-table th {
  padding: 14px 16px;
  text-align: center;
  font-weight: 600;
  color: #666;
  font-size: 13px;
}

.rank-header {
  width: 10%;
  text-align: center;
}

.name-header {
  width: 20%;
  text-align: left;
  padding-left: 24px;
}

.badge-header {
  width: 20%;
  text-align: center;
}

.time-header {
  width: 25%;
  text-align: center;
}

.count-header {
  width: 25%;
  text-align: center;
}

.ranking-table td {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
  font-size: 13px;
}

.ranking-table tbody tr:hover {
  background: #fffbf5;
}

.top-three {
  background: #fffcf5;
}

.rank-cell {
  text-align: center;
}

.rank-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 28px;
  padding: 0 10px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;

  color: #666;
  margin-right: 4px;
}

.rank-number.gold {
  background: #fff9e6;
  color: #d97706;
}

.rank-number.silver {
  background: #f5f5f5;
  color: #666;
}

.rank-number.bronze {
  background: #fff5eb;
  color: #d97706;
}

.crown-icon {
  font-size: 16px;
  vertical-align: middle;
}

.name-cell {
  text-align: left;
  padding-left: 24px !important;
}

.user-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  margin-right: 6px;
}

.fire-icon {
  font-size: 16px;
  vertical-align: middle;
}

.user-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: #f0e6d2;
  color: #8b6914;
  border: 1px solid #e0d4be;
}

.time-cell, .count-cell {
  color: #666;
}

.icon {
  margin-right: 4px;
  font-size: 12px;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
}

.page-btn, .page-number {
  padding: 8px 14px;
  border: 1px solid #e8e8e8;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled), .page-number:hover {
  background: #f9f9f9;
  border-color: #d8d8d8;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-number.active {
  background: #d8bd89;
  border-color: #d8bd89;
  color: white;
  font-weight: 700;
}

/* 안내 박스 */
.info-box {
  width: 100%; /* ranking-section 안에서 전체 활용 */
  max-width: 1000px; 
  margin: 32px auto 0; /* 중앙 정렬 */
  background: #fff;
  border: 1px solid #e8dcc8;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}


.info-box h3 {
  font-size: 14px;
  font-weight: 700;
  color: #4a3b2a;
  margin-bottom: 12px;
}

.info-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-box li {
  font-size: 13px;
  color: #666;
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
  line-height: 1.6;
}

.info-box li::before {
  content: '•';
  position: absolute;
  left: 6px;
  color: #d8bd89;
  font-weight: 700;
}

/* 반응형 */
@media (max-width: 768px) {
  .heroes-container {
    padding: 24px 16px;
  }

  .podium-container {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .rank-1, .rank-2, .rank-3 {
    max-width: 100%;
    width: 100%;
  }

  .rank-1 {
    margin-bottom: 0;
    order: 1;
  }

  .rank-2 {
    order: 2;
  }

  .rank-3 {
    order: 3;
  }

  .ranking-table {
    font-size: 12px;
  }

  .ranking-table th,
  .ranking-table td {
    padding: 12px 8px;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .page-btn, .page-number {
    padding: 6px 10px;
    font-size: 12px;
  }
}
/* 글씨 크게 & 섹션 얇게 개선 */

.heroes-container {
  padding: 24px 16px; /* ↓ 바깥 여백 줄임 */
}

.title {
  font-size: 28px; /* ↑ 제목 크게 */
  padding: 12px 28px;
}

.user-name {
  font-size: 18px; /* ↑ 포디움 이름 더 강조 */
}

.rank-number {
  font-size: 24px;
}

.time, .count {
  font-size: 18px; /* ↑ 주요 수치 강조 */
}

.section-title {
  font-size: 20px; /* 랭킹 섹션 제목 강조 */
}

.ranking-section {
  padding: 24px 18px; /* ↓ 내부 여백 얇게 */
}

.ranking-table th,
.ranking-table td {
  font-size: 15px; /* ↑ 표 글씨 크게 */
  padding: 12px 10px; /* ↓ 표 높이 간결 */
}

.info-box {
  padding: 16px 18px; /* ↓ 안내박스 얇게 */
}

.info-box li {
  font-size: 14px;
}



</style>
