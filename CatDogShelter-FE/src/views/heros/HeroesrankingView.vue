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
        <img src="@/assets/heros_banner.png" alt="이달의 댕냥 히어로즈" class="title-image" />
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

          <!-- 1등 -->
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
        <div class="section-head">
          <h2 class="section-title">이달의 봉사 활동 랭킹 TOP 50</h2>
          <button class="download-btn" @click="downloadTop50">TOP 50 다운로드</button>
        </div>
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
                  <span class="rank-number-pill" :class="getRankClass(user.rank)">
                    {{ user.rank }}
                  </span>
                  <span v-if="user.rank <= 3" class="crown-icon"></span>
                </td>
                <td class="name-cell">
                  <span class="user-name name-text">{{ user.name }}</span>
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

      <!-- ✅ 안내 정보: 푸터 바로 위로 이동 -->
      <div class="info-box">
        <h3>
          <img src="@/assets/wings.png" class="wing-icon" alt="wing" />
          댕냥히어로즈 선정 기준
        </h3>
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

const top3 = computed(() =>
  rankings.value.filter(r => r.isTop3).slice(0, 3)
);

const displayedRankings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return rankings.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(rankings.value.length / itemsPerPage)
);

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) pages.push(i);
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
    const res = await fetch(url);
    const data = await res.json();

    rankings.value = Array.isArray(data) ? data : (data.rankings || []);
    updateDate.value = data.updateDate || updateDate.value;
    heroesInfo.value = [
      '매월 1일부터 말일까지의 봉사 활동 시간을 기준으로 선정됩니다.',
      '등급은 봉사활동 누적시간에 따라 부여되며 매년 등급이 초기화됩니다.',
      '댕냥 히어로즈분들께 다시 한번 감사드립니다.'
    ];
  } catch (e) {
    console.error(e);
    error.value = '랭킹 데이터를 불러올 수 없습니다.';
  } finally {
    loading.value = false;
  }
}

function toCSV(rows) {
  const header = ['순위', '이름', '등급', '이달의 봉사시간', '누적 봉사활동'];
  const escape = v => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = rows.map(r =>
    [r.rank, r.name, r.badge, r.adoptionTime, `${r.adoptionCount}회`]
      .map(escape)
      .join(',')
  );
  return [header.join(','), ...body].join('\r\n');
}

function downloadTop50() {
  const top50 = rankings.value.slice(0, 50);
  if (!top50.length) {
    alert('다운로드할 랭킹 데이터가 없습니다.');
    return;
  }
  const csv = toCSV(top50);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `댕냥히어로즈_TOP50_${updateDate.value || 'unknown'}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

onMounted(loadRankings);
</script>

<style scoped>
* { box-sizing: border-box; }

.heroes-container {
  width: 100vw;
  min-height: 100vh;
  margin-left: calc(50% - 50vw);
  background: #F5EFE7;
  padding: 40px 20px;
  position: relative;
}

/* 로딩 & 에러 */
.loading, .error { text-align: center; padding: 80px 20px; }
.spinner {
  width: 40px; height: 40px; margin: 0 auto 16px;
  border: 4px solid #f3f3f3; border-top: 4px solid #d0c9b8;
  border-radius: 50%; animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error p { color: #dc2626; font-size: 16px; margin-bottom: 16px; }
.retry-btn {
  padding: 10px 24px; background: #d8bd89; color: #fff;
  border: none; border-radius: 8px; cursor: pointer; font-weight: 700;
}
.retry-btn:hover { background: #c7a670; }

/* 타이틀 */
.title-section { text-align: center; margin-bottom: 50px; }
.title-image {
  margin-left: 20px; width: 400px; max-width: 90%; height: auto; display: inline-block;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,.12));
}

/* 포디움 */
.podium-section { margin: 50px 0; }
.podium-container {
  display: flex; justify-content: center; align-items: flex-end; gap: 16px;
  max-width: 900px; margin: 0 auto;
}
.podium-card {
  background: #fff; border-radius: 16px; padding: 24px 20px; text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,.08); position: relative;
  transition: transform .3s ease; flex: 1; max-width: 260px;
}
.podium-card:hover { transform: translateY(-4px); }
.rank-1 {
  background: #FFF5F9; border: 2px solid #f0d4da; margin-bottom: 30px; padding-top: 80px;
}
.rank-2, .rank-3 { background: #FFF5EE; border: 1.8px solid #e8dcc8; }

.dog-image {
  position: absolute; top: -70px; left: 50%; transform: translateX(-50%);
  width: 140px; height: 120px; display: flex; align-items: center; justify-content: center;
}
.dog-image img { width: 120%; height: auto; object-fit: contain; margin-top: -36px; }

.rank-number { font-size: 28px; font-weight: 800; color: #333; margin-bottom: 8px; }
.user-name { font-size: 18px; font-weight: 700; color: #333; margin-bottom: 10px; }
.badge {
  display: inline-block; padding: 5px 14px; background: #f0e6d2; color: #8b6914;
  border-radius: 16px; font-size: 12px; font-weight: 600; margin-bottom: 16px; border: 1px solid #e0d4be;
}
.stats {
  display: flex; justify-content: space-around; gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0;
}
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.time, .count { font-size: 18px; font-weight: 700; color: #8B4513; }
.label { font-size: 11px; color: #999; }

/* 랭킹 섹션 */
.ranking-section {
  background: #fff; border-radius: 16px; padding: 24px 18px; box-shadow: 0 2px 12px rgba(0,0,0,.06);
  margin: 40px auto 0; width: 60%;
}
.section-head{
  position: relative;
  display: flex;
  align-items: center;
}
.section-title{
  position: absolute;
  left: 50%;
  transform: translateX(-50%); /* 가로 중앙 */
  margin: 0;
  white-space: nowrap;         /* 줄바꿈 방지(선택) */
}
.download-btn{
  margin-left: auto;           /* 오른쪽 끝으로 */
}
.download-btn{
  padding:10px 14px; border:none; border-radius:8px; background:#d8bd89; color:#fff;
  font-weight:700; font-size:13px; cursor:pointer; transition:transform .06s ease, background .2s ease;
}
.download-btn:hover{ background:#c7a670; }
.download-btn:active{ transform:translateY(1px); }

.update-date { text-align: center; color: #999; font-size: 13px; margin: 12px 0 24px; }
.calendar-icon { width: 120px; margin-right: 6px; }

.table-wrapper { overflow-x: auto; margin-bottom: 24px; }
.ranking-table { width: 100%; border-collapse: collapse; }
.ranking-table thead { background: #fafafa; border-bottom: 2px solid #e8e8e8; }
.ranking-table th {
  padding: 14px 16px; text-align: center; font-weight: 600; color: #666; font-size: 13px;
}
.rank-header{ width:10%; } .name-header{ width:20%; text-align:left; padding-left:24px; }
.badge-header{ width:20%; } .time-header{ width:25%; } .count-header{ width:25%; }

.ranking-table td {
  padding: 16px; text-align: center; border-bottom: 1px solid #f5f5f5; font-size: 15px;
}
.ranking-table tbody tr:hover { background: #fffbf5; }
.top-three { background: #fffcf5; }

.rank-cell { text-align: center; }
.rank-number-pill {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 32px; height: 28px; padding: 0 10px; border-radius: 14px; font-weight: 700; font-size: 14px;
  color: #666; margin-right: 4px;
}
.rank-number-pill.gold { background: #fff9e6; color: #d97706; }
.rank-number-pill.silver { background: #f5f5f5; color: #666; }
.rank-number-pill.bronze { background: #fff5eb; color: #d97706; }

.name-cell { text-align: left; padding-left: 24px !important; }
.name-text { font-weight: 600; color: #333; font-size: 14px; margin-right: 6px; }
.user-badge {
  display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600;
  background: #f0e6d2; color: #8b6914; border: 1px solid #e0d4be;
}
.time-cell, .count-cell { color: #666; }
.icon-img { width: 16px; height: 16px; margin-right: 6px; vertical-align: -2px; }
.crown-icon, .fire-icon { font-size: 16px; vertical-align: middle; }

/* 페이지네이션 */
.pagination {
  display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 24px;
}
.page-btn, .page-number {
  padding: 8px 14px; border: 1px solid #e8e8e8; background: #fff; border-radius: 6px;
  cursor: pointer; font-size: 13px; font-weight: 500; color: #666; transition: all .2s;
}
.page-btn:hover:not(:disabled), .page-number:hover { background: #f9f9f9; border-color: #d8d8d8; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-number.active { background: #d8bd89; border-color: #d8bd89; color: #fff; font-weight: 700; }

/* ✅ 안내 박스: 푸터 위 자리 */
.info-box {
  background-color: #FFFBEB; width: 100%; max-width: 1000px;
  margin: 60px auto 20px; border: 1px solid #e8dcc8; border-radius: 16px;
  padding: 16px 18px; box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.wing-icon { width: 50px; height: 50px; margin-right: 6px; vertical-align: middle; }
.info-box h3 { font-size: 14px; font-weight: 700; color: #4a3b2a; margin-bottom: 12px; }
.info-box ul { list-style: none; padding: 0; margin: 0; }
.info-box li {
  font-size: 14px; color: #666; padding: 6px 0 6px 20px; position: relative; line-height: 1.6;
}
.info-box li::before { content: '•'; position: absolute; left: 6px; color: #d8bd89; font-weight: 700; }

/* 반응형 */
@media (max-width: 768px) {
  .heroes-container { padding: 24px 16px; }
  .podium-container { flex-direction: column; align-items: center; gap: 16px; }
  .rank-1, .rank-2, .rank-3 { max-width: 100%; width: 100%; margin-bottom: 0; }
  .ranking-section { width: 95%; }
  .ranking-table th, .ranking-table td { padding: 12px 8px; font-size: 13px; }
  .pagination { flex-wrap: wrap; }
  .page-btn, .page-number { padding: 6px 10px; font-size: 12px; }
}
</style>