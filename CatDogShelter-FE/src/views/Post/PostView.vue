<!-- src/views/post/PostView.vue -->
<template>
  <section class="board-wrap">
    <h1 class="board-title">자유 게시판</h1>
    <p class="board-sub">"°˖✧ 자유롭게 의견을 나눠보세요 ᵔᴗᵔ ✿"</p>

    <!-- 검색 라인 -->
    <div class="toolbar">
      <div class="search-group" ref="keyWrapRef">
        <button
          class="key-select"
          type="button"
          :aria-expanded="openKey"
          @click="openKey = !openKey"
        >
          {{ searchKeyLabel }}
          <svg class="chev" viewBox="0 0 20 20" width="16" height="16">
            <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <ul v-if="openKey" class="key-menu">
          <li :class="{active: searchKey==='title'}" @click="selectKey('title')">제목</li>
          <li :class="{active: searchKey==='author'}" @click="selectKey('author')">작성자</li>
        </ul>

        <label class="search-input" :aria-label="`${searchKeyLabel} 검색 입력`">
          <button class="icon-btn" type="button" @click="onSearch" aria-label="검색">
            <svg viewBox="0 0 20 20" width="18" height="18">
              <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
              <line x1="14" y1="14" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <input
            v-model="q"
            type="text"
            :placeholder="searchKey === 'title' ? '제목으로 검색...' : '작성자로 검색...'"
            @keyup.enter="onSearch"
          />
        </label>
      </div>
    </div>

    <!-- 메타 라인 -->
    <div class="meta-row">
      <div class="meta-left">
        <span class="count">총 {{ totalCount }}개의 게시물</span>

        <div class="sort-wrap" ref="sortWrapRef">
          <button class="sort-select" type="button" @click="openSort = !openSort" :aria-expanded="openSort">
            {{ sortLabel }}
            <svg class="chev" viewBox="0 0 20 20" width="16" height="16">
              <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <ul v-if="openSort" class="sort-menu">
            <li :class="{active: sort==='latest'}" @click="selectSort('latest')">최신순</li>
            <li :class="{active: sort==='views'}"  @click="selectSort('views')">조회순</li>
          </ul>
        </div>
      </div>

      <button class="write-btn" type="button" @click="onWrite">게시글 등록</button>
    </div>

    <div class="divider"></div>

    <PostTable :rows="pageRows" :offset="numberOffset" />

    <Pagination
      :page="page"
      :per-page="perPage"
      :total="totalCount"
      @change="goPage"
    />
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Pagination from './Pagination.vue'
import PostTable from './PostTable.vue'
import { getDummyDetail, getDummyThumb, getAllDummyIds } from './detail/dummies.js'

const route = useRoute()
const router = useRouter()

const keyWrapRef  = ref(null)
const sortWrapRef = ref(null)
const perPage = 10

/* ---------- 삭제 동기화 ---------- */
function toNumSet(json) {
  try { return new Set((JSON.parse(json || '[]') || []).map(n => Number(n) || 0)) }
  catch { return new Set() }
}
const deletedSet = ref(toNumSet(localStorage.getItem('post:deleted')))
window.addEventListener('storage', (e) => {
  if (e.key === 'post:deleted') deletedSet.value = toNumSet(e.newValue)
})

/* ---------- 검색/정렬 상태 ---------- */
const q = ref(route.query.q?.toString() || '')
const searchKey = ref(route.query.key === 'author' ? 'author' : 'title')
const openKey = ref(false)
const searchKeyLabel = computed(() => (searchKey.value === 'title' ? '제목' : '작성자'))

const sort = ref(['latest','views'].includes(route.query.sort) ? route.query.sort : 'latest')
const openSort = ref(false)
const sortLabel = computed(() => ({ latest:'최신순', views:'조회순' }[sort.value]))

function selectKey(key){ searchKey.value = key; openKey.value = false }
function selectSort(k){
  sort.value = k; openSort.value = false
  router.replace({ path: route.path, query: { ...route.query, page: 1, sort: k } })
}

/* ---------- 더미 → 목록 데이터화 ---------- */
/** 첫 페이지 10개: id 24 ~ 33 (오름차순) */
const BASE_IDS = getAllDummyIds(true)

/* createdAt 안전 변환(숫자면 그대로, 문자열이면 Date 파싱) */
const toTime = (x) => {
  if (typeof x === 'number') return x
  const t = new Date(x).getTime()
  return Number.isFinite(t) ? t : 0
}

function buildSeedFromDummies() {
  return BASE_IDS
    .map((id, idx) => {
      const d = getDummyDetail(id)
      if (!d) return null
      return {
        id: d.id,
        title: d.title,
        author: d.author?.name || '',
        date: d.date,
        createdAt: toTime(d.createdAt ?? d.date) + idx,  // ✅ createdAt 채워넣기(유일성 보정)
        category: d.category,
        thumb: d.images?.[0]?.src || getDummyThumb(d.id) || '',
        views: 10 + (idx * 7) % 120,
        likes: d.stats?.likes ?? 0,
        comments: d.stats?.comments ?? (d.comments?.length || 0),
      }
    })
    .filter(Boolean)
}

const dummyPosts = ref(buildSeedFromDummies())

/** 사용자 글: 저장값에 createdAt이 없을 수도 있으니 폴백으로 채움 */
const userPostsRaw = JSON.parse(localStorage.getItem('post:items') || '[]')
const userPosts = ref(
  userPostsRaw.map((p, i) => ({
    ...p,
    createdAt: toTime(p.createdAt ?? p.date) + i,  // ✅ 폴백
  }))
)

/** 목록 원천 */
const allPosts = computed(() => [...userPosts.value, ...dummyPosts.value])

function getSavedState(id){
  try { return JSON.parse(localStorage.getItem(`post:detail:${id}`) || 'null') }
  catch { return null }
}

/* 저장값 & 삭제 반영 */
const enrichedPosts = computed(() =>
  allPosts.value
    .filter(p => !deletedSet.value.has(p.id))
    .map(p => {
      const saved = getSavedState(p.id)
      const thumbFromSaved = saved?.images?.[0]?.src || ''
      const thumbFromDummy = getDummyThumb(p.id) || ''
      if (!saved) {
        return { ...p, thumb: p.thumb || thumbFromDummy }
      }
      return {
        ...p,
        likes: typeof saved.likes === 'number' ? saved.likes : p.likes,
        comments: Array.isArray(saved.comments) ? saved.comments.length : p.comments,
        thumb: thumbFromSaved || thumbFromDummy || p.thumb,
      }
    })
)

/* ---------- 필터 + 정렬 + 페이지 ---------- */
const filteredPosts = computed(() => {
  const src = enrichedPosts.value
  const keyword = q.value.trim().toLowerCase()
  if (!keyword) return src
  return src.filter(p => {
    const field = (searchKey.value === 'author' ? p.author : p.title) || ''
    return field.toLowerCase().includes(keyword)
  })
})

const sortedPosts = computed(() => {
  const arr = [...filteredPosts.value]
  if (sort.value === 'views') return arr.sort((a, b) => b.views - a.views)
  // ✅ 최신순: createdAt 내림차순 (없으면 date 폴백)
  return arr.sort((a, b) => toTime(b.createdAt ?? b.date) - toTime(a.createdAt ?? a.date))
})

const totalCount  = computed(() => sortedPosts.value.length)
const page        = computed(() => Math.max(1, Number(route.query.page) || 1))
const totalPages  = computed(() => Math.max(1, Math.ceil(totalCount.value / perPage)))
const pageRows    = computed(() => {
  const start = (page.value - 1) * perPage
  return sortedPosts.value.slice(start, start + perPage)
})
const numberOffset = computed(() => totalCount.value - (perPage * (page.value - 1)))

function onSearch () {
  router.replace({
    path: route.path,
    query: { ...route.query, page: 1, q: q.value, key: searchKey.value }
  })
}
function onWrite () { router.push({ name: 'post.write' }) }
function goPage (p) {
  router.replace({ path: route.path, query: { ...route.query, page: p } })
}

/* 주소 쿼리 -> UI 동기화 */
watch(() => route.query, (qr) => {
  q.value = (qr.q ?? '').toString()
  searchKey.value = qr.key === 'author' ? 'author' : 'title'
  sort.value = ['latest','views'].includes(qr.sort) ? qr.sort : 'latest'
})

/* 페이지 보정 */
watch([page, totalPages], ([p, tp]) => { if (p > tp) goPage(tp) })

/* 드롭다운 밖 클릭 시 닫기 */
function handleOutside(e) {
  const withinKey  = keyWrapRef.value?.contains(e.target)
  const withinSort = sortWrapRef.value?.contains(e.target)
  if (!withinKey)  openKey.value  = false
  if (!withinSort) openSort.value = false
}
onMounted(() => document.addEventListener('click', handleOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleOutside))
</script>

<style>
:root {
  --bg-cream: #f6efe6;
  --ink-0: #111827;
  --ink-2: #6b7280;
  --chip: #f6f7fb;
  --border: #eadfcd;
  --accent: #e7c07d;
  --accent-press: #d7ac61;
  --radius-lg: 12px;
  --radius-md: 10px;
  --shadow-sm: 0 2px 6px rgba(0,0,0,.06);
}
body { background: var(--bg-cream); }
</style>

<style scoped>
.board-wrap { max-width: 1200px; margin: 0 auto; padding: 12px 16px 0; }
.board-title { font-size: 26px; font-weight: 800; color: var(--ink-0); margin: 4px 0 4px; }
.board-sub { font-size: 13px; color: var(--ink-2); margin: 0 0 16px; }

/* 검색 */
.toolbar { display: grid; grid-template-columns: 1fr; gap: 12px; align-items: center; }
.search-group { position: relative; display: grid; grid-template-columns: auto 1fr; gap: 8px; }

.key-select {
  min-width: 110px; padding: 10px 12px; border-radius: var(--radius-md);
  border: 1px solid var(--border); background: #fff;
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  box-shadow: var(--shadow-sm);
}
.key-select .chev { opacity: .8; }

.key-menu,
.sort-menu {
  position: absolute; top: 44px; left: 0; z-index: 10;
  background: #fff; border: 1px solid var(--border); border-radius: 10px;
  box-shadow: 0 8px 18px rgba(0,0,0,.08); overflow: hidden;
}
.key-menu li,
.sort-menu li {
  padding: 10px 12px; cursor: pointer; white-space: nowrap;
}
.key-menu li:hover,
.sort-menu li:hover { background: #f9f6ef; }
.key-menu li.active,
.sort-menu li.active { font-weight: 700; background: #f3ebdb; }

.search-input {
  display: flex; align-items: center; gap: 8px; padding: 10px 12px;
  background: var(--chip); border: 1px solid #ececec; border-radius: var(--radius-md);
}
.icon-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border:0; background:transparent; cursor:pointer; }
.search-input input { width: 100%; background: transparent; border: 0; outline: none; font-size: 14px; color: var(--ink-0); }

/* 메타 */
.meta-row { margin-top: 12px; display: flex; align-items: center; justify-content: space-between; }
.meta-left { display: flex; align-items: center; gap: 10px; }
.count { color: var(--ink-2); font-size: 14px; }

.sort-wrap { position: relative; }
.sort-select {
  padding: 8px 12px; border: 1px solid var(--border); background: #fff; border-radius: var(--radius-md);
  display: inline-flex; align-items: center; gap: 6px; box-shadow: var(--shadow-sm);
}

/* 버튼 */
.write-btn {
  padding: 10px 16px; border-radius: var(--radius-md); border: 0; background: var(--accent);
  color: #3c3425; font-weight: 600; box-shadow: var(--shadow-sm);
}
.write-btn:active { background: var(--accent-press); transform: translateY(1px); }

/* 구분선 */
.divider { height: 16px; border-bottom: 2px solid var(--border); margin-top: 10px; }
</style>
