<!-- src/views/Post/PostTable.vue -->
<template>
  <!-- 큰 메인 영역(카드) -->
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
        <tr v-for="(row, idx) in rows" :key="row.id">
          <td class="col-no">{{ offset - idx }}</td>

          <!-- 제목 셀 -->
          <td class="col-title">
            <div class="title-wrap">
              <span class="badge" :class="row.category === '고양이' ? 'cat' : 'dog'">
                {{ row.category }}
              </span>

              <!-- 썸네일(있을 때만) -->
              <img v-if="row.thumb" :src="row.thumb" alt="" class="mini-thumb" />

              <!-- 제목을 칩(작은 박스) 안에 -->
              <span class="title-chip">
                <RouterLink
                  class="title-link"
                  :to="{ name: 'post.detail', params: { id: row.id } }"
                >
                  {{ row.title }}
                </RouterLink>
                <span v-if="row.comments" class="cmt">[{{ row.comments }}]</span>
              </span>
            </div>
          </td>

          <td class="col-author">{{ row.author }}</td>
          <td class="col-date">{{ row.date }}</td>

          <td class="col-stats">
            <span class="stat">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M12 5c4.5 0 8.3 2.7 10 6.5C20.3 15.3 16.5 18 12 18S3.7 15.3 2 11.5C3.7 7.7 7.5 5 12 5Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
                <circle cx="12" cy="11.5" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/>
              </svg>
              {{ row.views }}
            </span>
            <span class="stat">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"
                      fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
              </svg>
              {{ row.likes }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  rows: { type: Array, default: () => [] },
  offset: { type: Number, default: 0 } // 번호(내림차순) 시작값
})
</script>

<style scoped>
:root{
  --border: #eadfcd;
  --beige: #F1D099;
}

/* 큰 메인 카드(표 전체를 감싸는 영역) */
.table-card{
  background:#fff;
  border:1px solid var(--border);
  border-radius:14px;
  box-shadow:0 8px 18px rgba(0,0,0,.06);
  overflow:hidden;
}

/* 표 */
.post-table{ width:100%; border-collapse:collapse; table-layout:fixed; color:#3c3425; font-size:14px; }

/* 헤더(베이지 바) */
.post-table thead th{
  background: var(--beige);
  color:#3c3425; font-weight:700;
  padding:14px 12px;
  border-bottom:1px solid #e1cfa8;
  text-align:center;
}
.post-table thead th.col-title{ text-align:left; }

/* 바디 */
.post-table tbody td{
  padding:14px 12px;
  border-bottom:1px solid #f1e8d9;
  background:#fff; vertical-align:middle;
}

/* 열 폭/정렬 */
.col-no{ width:72px; text-align:center; }
.col-author{ width:160px; text-align:center; }
.col-date{ width:140px; text-align:center; color:#6b7280; }
.col-stats{ width:170px; text-align:center; color:#6b7280; }

/* 제목 셀 내부 구성 */
.title-wrap{ display:flex; align-items:center; gap:10px; min-width:320px; }

/* 카테고리 뱃지 */
.badge{
  padding:2px 8px; border-radius:999px; font-size:12px; font-weight:700;
  border:1px solid var(--border); background:#f6efe6; color:#8a6a3f;
}
.badge.cat{ background:#f3f0ff; border-color:#e2dcff; color:#6b5bb3; }

/* 썸네일 */
.mini-thumb{
  width:28px; height:28px; object-fit:cover; flex:0 0 28px;
  border-radius:6px; border:1px solid var(--border);
}

/* 제목 칩(작은 박스) */
.title-chip{
  display:inline-flex; align-items:center; gap:6px;
  padding:8px 12px; max-width:100%;
  border:1px solid var(--border); border-radius:10px;
  background:#fff; box-shadow:0 2px 6px rgba(0,0,0,.04);
}
.title-link{
  color:#2b2418; font-weight:600; text-decoration:none;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.title-link:hover{ text-decoration:underline; }
.cmt{ color:#9a8f80; font-size:12px; }

/* 조회/좋아요 */
.stat{ display:inline-flex; align-items:center; gap:6px; padding:0 6px; color:#6b5b4a; }
.stat + .stat{ margin-left:4px; }

/* 행 호버 */
.post-table tbody tr:hover{ background:#fffaf1; }
</style>
