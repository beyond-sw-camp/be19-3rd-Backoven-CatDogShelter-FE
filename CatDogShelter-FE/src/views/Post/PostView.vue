<!-- src/views/post/PostView.vue -->
<template>
  <section class="board-wrap">
    <h1 class="board-title">자유 게시판</h1>
    <p class="board-sub">"°˖✧ 자유롭게 의견을 나눠보세요 ᵔᴗᵔ ✿"</p>

    <!-- 검색 라인 -->
    <div class="toolbar">
      <div class="search-group" ref="keyWrapRef">
        <!-- 검색 키 드롭다운(제목/작성자) -->
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

        <!-- 검색 인풋 + 돋보기 -->
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

        <!-- 정렬 드롭다운 -->
        <div class="sort-wrap" ref="sortWrapRef">
          <button class="sort-select" type="button" @click="openSort = !openSort" :aria-expanded="openSort">
            {{ sortLabel }}
            <svg class="chev" viewBox="0 0 20 20" width="16" height="16">
              <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <ul v-if="openSort" class="sort-menu">
            <li :class="{active: sort==='latest'}" @click="selectSort('latest')">최신순</li>
            <li :class="{active: sort==='oldest'}" @click="selectSort('oldest')">날짜순</li>
            <li :class="{active: sort==='views'}"  @click="selectSort('views')">조회순</li>
          </ul>
        </div>
      </div>

      <button class="write-btn" type="button" @click="onWrite">게시글 등록</button>
    </div>

    <div class="divider"></div>

    <!-- 목록 테이블(필터+정렬+페이지 반영) -->
    <PostTable :rows="pageRows" :offset="numberOffset" />

    <!-- 페이지네이션 -->
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

const route = useRoute()
const router = useRouter()
const keyWrapRef = ref(null)
const sortWrapRef = ref(null)


const perPage = 10

// --- 검색/정렬 상태 ---
const q = ref(route.query.q?.toString() || '')
const searchKey = ref(route.query.key === 'author' ? 'author' : 'title')
const openKey = ref(false)
const searchKeyLabel = computed(() => (searchKey.value === 'title' ? '제목' : '작성자'))

const sort = ref(['latest','oldest','views'].includes(route.query.sort) ? route.query.sort : 'latest')
const openSort = ref(false)
const sortLabel = computed(() => ({ latest:'최신순', oldest:'날짜순', views:'조회순' }[sort.value]))

function selectKey(key){ searchKey.value = key; openKey.value = false }
function selectSort(k){
  sort.value = k; openSort.value = false
  router.replace({ path: route.path, query: { ...route.query, page: 1, sort: k } })
}

// --- 더미 데이터(생략 없이 그대로) ---
const titles = [
  '우리집 강아지 산책 코스 추천','강아지 리드줄 추천 부탁해요','강아지 배변패드 뭐가 좋아요?',
  '강아지 사회화 팁 모음','겨울 산책 복장 추천','첫 목욕 생존기 공유',
  '사료 바꾸고 설사 멈췄어요','하네스 vs 목줄 뭐 쓰세요?','강아지 치석 관리 어떻게?',
  '고양이 간식 추천 받아요','고양이 모래 뭐써요?','냥이 캣타워 조립 후기',
  '고양이 스크래처 교체했어요','캣닢 반응 모아봤어요','고양이 자동급식기 써보신 분?',
  '냥이 장난감 TOP5','고양이 브러싱 팁','고양이 분리불안 경험담',
  '새로 온 친구 적응 일지','야외 촬영 팁 공유','이사 후 적응기','초보 집사 질문 모음',
  '슬개골 관리 어떻게 하세요?','손님 올 때 대처법','장마철 냄새 해결법',
]
const authors = [
  '박지수','김민준','이서연','정다훈','최수빈','오슬기','류하늘','윤태호','고예린',
  '한지훈','임가현','문채원','배도윤','서우진','이도연','정해빈','차유진','노지훈'
]
function inferSpeciesFromTitle(title, idx) {
  const t = title.toLowerCase()
  const dogWords = ['강아지','댕댕','멍','반려견','dog','리드줄','배변','훈련','산책','하네스','슬개골']
  const catWords = ['고양','냥','야옹','반려묘','cat','캣','모래','스크래처','캣타워','캣닢','브러싱']
  const hasDog = dogWords.some(w => t.includes(w))
  const hasCat = catWords.some(w => t.includes(w))
  if (hasDog && !hasCat) return '강아지'
  if (hasCat && !hasDog) return '고양이'
  return idx % 2 === 0 ? '강아지' : '고양이'
}
function pad2(n){ return String(n).padStart(2,'0') }
function genDummy(n=33){
  const arr=[]
  for(let i=0;i<n;i++){
    const title = titles[i % titles.length]
    const no = n - i
    const d  = new Date(2025, 9, 1 + (i%25))
    arr.push({
      id: no,
      title,
      author: authors[i % authors.length],
      date: `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`,
      views: 10 + (i*7)%120,
      likes: 1 + (i*3)%30,
      comments: (i*2)%6,
      category: inferSpeciesFromTitle(title, i),
      thumb: ''
    })
  }
  return arr
}
 const dummyPosts = ref(genDummy(33))
 const userPosts = ref(JSON.parse(localStorage.getItem('post:items') || '[]'))
 const allPosts = computed(() => [...userPosts.value, ...dummyPosts.value])

function getSavedState(id){
  try { return JSON.parse(localStorage.getItem(`post:detail:${id}`) || 'null') }
  catch { return null }
}

// ✅ 모든 글에 저장값을 덮어쓴 "확장 목록"
 const enrichedPosts = computed(() =>
   allPosts.value.map(p => {
    const s = getSavedState(p.id)
    if (!s) return p
    return {
      ...p,
      likes: typeof s.likes === 'number' ? s.likes : p.likes,
      comments: Array.isArray(s.comments) ? s.comments.length : p.comments
    }
  })
)

// --- 필터링 + 정렬 + 페이지네이션 ---
 const filteredPosts = computed(() => {
   const src = enrichedPosts.value
   const keyword = q.value.trim().toLowerCase()
   if (!keyword) return src
   return src.filter(p => {
     const field = searchKey.value === 'author' ? p.author : p.title
     return field.toLowerCase().includes(keyword)
   })
 })

const sortedPosts = computed(() => {
  const arr = [...filteredPosts.value]
  // 조회순
  if (sort.value === 'views') return arr.sort((a,b) => b.views - a.views)
  // 날짜순(오래된 → 최신) = id 오름차순
  if (sort.value === 'oldest') return arr.sort((a,b) => a.id - b.id)
  // 최신순(최신 → 오래된) = id 내림차순
    return arr.sort((a,b) => b.id - a.id)
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

// 주소 쿼리 -> UI 동기화
watch(() => route.query, (qr) => {
  q.value = (qr.q ?? '').toString()
  searchKey.value = qr.key === 'author' ? 'author' : 'title'
  sort.value = ['latest','oldest','views'].includes(qr.sort) ? qr.sort : 'latest'
})
// 검색/정렬 후 현재 페이지 보정
watch([page, totalPages], ([p, tp]) => { if (p > tp) goPage(tp) })
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
