<template>
  <div class="table-card">
    <table class="post-table">
      <thead>
        <tr>
          <th class="col-no">번호</th>
          <th class="col-title">제목</th>
          <th class="col-author">작성자</th>
          <th class="col-date">작성일</th>
          <th class="col-stats">조회/좋아요</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(r, i) in rows" :key="r.id">
          <td class="col-no">{{ offset - i }}</td>

          <td class="col-title">
            <div class="title-wrap">
              <div class="thumb" :style="thumbStyle(r.thumb)"></div>
              <span class="badge">{{ r.category }}</span>
               <RouterLink class="title link" :to="{ name:'post.detail', params:{ id: r.id } }">
                                {{ r.title }}
               </RouterLink>
              <span class="comments">[{{ r.comments }}]</span>
            </div>
          </td>

          <td class="col-author">{{ r.author }}</td>
          <td class="col-date">{{ r.date }}</td>

          <td class="col-stats">
            <span class="icon">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </span>
            <span>{{ r.views }}</span>
            <span class="spacer"></span>
            <span class="icon">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 21s-7-4.35-9.5-8A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 7c-2.5 3.65-9.5 8-9.5 8z"
                      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span>{{ r.likes }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  rows: { type: Array, default: () => [] },
  offset: { type: Number, default: 0 } // 번호(내림차순) 시작값
})

function thumbStyle(src) {
  return src
    ? { backgroundImage: `url(${src})` }
    : {}
}
</script>

<style scoped>
.table-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 18px rgba(0,0,0,.06);
  overflow: hidden;
}

/* 테이블 기본 */
.post-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  color: #3c3425;
}

/* 헤더(베이지 띠) */
.post-table thead th {
  background: #F1D099;
  color: #3c3425;
  font-weight: 700;
  padding: 14px 12px;
  border-bottom: 1px solid #eadfcd;
}
.post-table thead th:first-child { border-top-left-radius: 12px; }
.post-table thead th:last-child  { border-top-right-radius: 12px; }

/* 바디 */
.post-table tbody td {
  padding: 14px 12px;
  border-bottom: 1px solid #f1e8d9;
  background: #fff;
  vertical-align: middle;
}

/* 열 폭/정렬 */
.col-no { width: 70px; text-align: center; }
.col-author { width: 160px; text-align: center; }
.col-date { width: 140px; text-align: center; color:#6b7280; }
.col-stats { width: 180px; text-align: center; color:#6b7280; }

/* 제목 셀 내용 */
.title-wrap { display: flex; align-items: center; gap: 10px; }
.thumb {
  width: 36px; height: 36px; border-radius: 8px; flex: 0 0 auto;
  background: #f2f2f2 center/cover no-repeat;
  border: 1px solid #eee;
}
.badge {
  font-size: 12px; padding: 4px 8px; border-radius: 999px;
  background: #f6efe6; color: #8a6a3f; border: 1px solid #eadfcd;
}
.title { font-weight: 600; color: #2b2418; }
.comments { color:#9a8f80; margin-left: 4px; }

.col-stats .icon { display:inline-flex; vertical-align: middle; }
.col-stats .spacer { display:inline-block; width: 10px; }
</style>
