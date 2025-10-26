<template>
  <article v-if="post" class="post-detail">
    <!-- 상단 바: 좌측 '목록으로', 우측 '게시글 삭제' -->
    <div class="topbar">
      <RouterLink class="back" :to="{ name: 'post', query: { page: 1 } }">← 목록으로</RouterLink>
      <button class="delete-post" type="button" @click="confirmDelete">게시글 삭제</button>
    </div>

    <h1 class="title">{{ post.title }}</h1>

    <div class="meta">
      <span class="badge">{{ post.category }}</span>
      <span class="author">{{ post.author.name }}</span>
      <span class="dot">·</span>
      <span class="date">{{ post.date }}</span>
      <span class="dot">·</span>
      <span class="views">조회 {{ post.stats.views }}</span>
    </div>

    <div class="body">
      <div v-if="post.images && post.images.length" class="gallery">
        <img v-for="(img,i) in post.images" :key="i" :src="img.src" :alt="img.alt" />
      </div>
      <p v-for="(p,i) in post.content" :key="i">{{ p }}</p>
    </div>

    <div class="actions">
      <button class="chip" :class="{ on: isLiked }" @click="toggleLike">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M12 21s-7-4.35-9.5-8A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 7c-2.5 3.65-9.5 8-9.5 8z"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        좋아요 {{ post.stats.likes }}
      </button>
      <button class="chip" @click="share">공유하기</button>
    </div>

    <nav class="post-nav">
      <!-- 왼쪽: -1 (이전글) -->
      <RouterLink
        v-if="post.prev"
        :to="{ name:'post.detail', params:{ id: post.prev.id } }"
      >← {{ post.prev.title }}</RouterLink>

      <!-- 오른쪽: +1 (다음글) -->
      <RouterLink
        v-if="post.next"
        :to="{ name:'post.detail', params:{ id: post.next.id } }"
      >{{ post.next.title }} →</RouterLink>
    </nav>

    <!-- 댓글 -->
    <section class="comments">
      <h2 class="c-title">댓글 <span class="num">{{ post.stats.comments }}</span></h2>

      <ul v-if="post.comments?.length" class="c-list">
        <li v-for="c in post.comments" :key="c.id" class="c-item">
          <div class="avatar" aria-hidden="true">{{ c.author?.[0] ?? '익' }}</div>
          <div class="c-box">
            <div class="c-head">
              <strong class="c-author">{{ c.author }}</strong>
              <span class="c-time">{{ c.createdAt }}</span>
            </div>
            <p class="c-text">{{ c.text }}</p>

            <!-- 우하단 삭제 버튼 -->
            <div class="c-row-actions">
              <button class="c-del" type="button" @click="removeComment(c.id)">삭제</button>
            </div>
          </div>
        </li>
      </ul>

      <form class="c-form" @submit.prevent="addComment">
        <div class="row">
          <input v-model="nickname" type="text" class="nick" placeholder="닉네임 (선택)" maxlength="20" />
        </div>
        <textarea v-model="newComment" class="input" placeholder="댓글을 입력하세요" rows="3" required />
        <div class="c-actions">
          <button type="submit" class="submit">댓글 작성</button>
        </div>
      </form>
    </section>
  </article>

  <article v-else class="post-detail">
    <p>존재하지 않는 게시글입니다.</p>
    <RouterLink class="back" :to="{ name: 'post' }">목록으로</RouterLink>
  </article>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDummyDetail } from './detail/dummies.js'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))


const state = reactive({ post: null, isLiked: false })
const newComment = ref('')
const nickname = ref('')
const storageKey = computed(() => `post:detail:${id.value}`)

function load(){
  // 1) 사용자 저장 상세 우선
  const savedDetail = JSON.parse(localStorage.getItem(`post:detail:${id.value}`) || 'null')
  let base = null
  if (savedDetail && savedDetail.title) {
    base = savedDetail
  } else {
    const d = getDummyDetail(id.value)   
    if (d) base = structuredClone ? structuredClone(d) : JSON.parse(JSON.stringify(d))
  }
  if (!base) { state.post = null; return }

  // 2) 좋아요/댓글 최신 반영
  const saved = JSON.parse(localStorage.getItem(storageKey.value) || 'null')
  if (saved) {
    if (typeof saved.likes === 'number') base.stats.likes = saved.likes
    if (Array.isArray(saved.comments))   base.comments    = saved.comments
    if (typeof saved.isLiked === 'boolean') state.isLiked = saved.isLiked
    base.stats.comments = base.comments.length
  }
  state.post = base
}
function persist(){
  if (!state.post) return
  localStorage.setItem(storageKey.value, JSON.stringify({
    likes: state.post.stats.likes,
    isLiked: state.isLiked,
    comments: state.post.comments
  }))
}
function toggleLike(){
  if (!state.post) return
  state.isLiked ? state.post.stats.likes-- : state.post.stats.likes++
  state.isLiked = !state.isLiked
  persist()
}
function addComment(){
  const text = newComment.value.trim()
  if (!text || !state.post) return
  const name = nickname.value.trim() || '익명'
  const d = new Date()
  const ts = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  state.post.comments.push({ id: Date.now(), author: name, text, createdAt: ts })
  state.post.stats.comments = state.post.comments.length
  newComment.value = ''
  persist()
}

// 댓글 삭제
function removeComment(cid) {
  if (!state.post) return
  if (!confirm('댓글을 삭제하시겠습니까?')) return
  state.post.comments = state.post.comments.filter(c => c.id !== cid)
  state.post.stats.comments = state.post.comments.length
  persist()
}

// 게시글 삭제
function confirmDelete() {
  if (!state.post) return
  if (!confirm('게시글을 삭제하시겠습니까?')) return
  const pid = state.post.id

  // 삭제 목록에 기록해 목록에서 숨김
  const delKey = 'post:deleted'
  const delArr = JSON.parse(localStorage.getItem(delKey) || '[]')
  if (!delArr.includes(pid)) {
    delArr.push(pid)
    localStorage.setItem(delKey, JSON.stringify(delArr))
  }

  // 사용자 작성 글이면 목록 저장소에서 제거
  const listKey = 'post:items'
  const list = JSON.parse(localStorage.getItem(listKey) || '[]')
  const next = list.filter(p => p.id !== pid)
  if (next.length !== list.length) localStorage.setItem(listKey, JSON.stringify(next))

  // 상세/상태 저장 제거
  localStorage.removeItem(`post:detail:${pid}`)

  alert('삭제되었습니다.')
  router.push({ name: 'post' })
}

onMounted(load)
watch(id, load)

const post   = computed(() => state.post)
const isLiked = computed(() => state.isLiked)
</script>

<style scoped>
.post-detail{max-width:880px;margin:24px auto;padding:22px 24px;background:#fff;border-radius:14px;box-shadow:0 12px 22px rgba(0,0,0,.06)}
/* 상단 바: 좌우 배치로 확실히 우측 정렬 */
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.back{color:#6b5b4a}
.delete-post{
  padding:6px 10px;border-radius:999px;border:1px solid #e6b6a8;
  background:#fff5f3;color:#a23b2a;font-weight:700;cursor:pointer
}
.delete-post:hover{background:#ffe9e6}

.title{margin:8px 0 4px;font-size:24px;font-weight:800}
.meta{display:flex;gap:8px;color:#6b7280;font-size:14px;align-items:center}
.dot{opacity:.6}
.badge{padding:2px 8px;border-radius:999px;background:#f6efe6;border:1px solid #eadfcd;color:#8a6a3f}
.body{margin-top:18px;line-height:1.7}
.gallery{display:grid;gap:12px;justify-items:center;margin-bottom:12px}

.actions{display:flex;gap:10px;margin:14px 0 8px}
.chip{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 12px;border-radius:999px;border:1px solid #eadfcd;background:#fff;color:#5a4a38;
  box-shadow:0 2px 6px rgba(0,0,0,.05); font-weight:700;
}
.chip.on{background:#b87445;color:#fff;border-color:#b87445}

.post-nav{display:flex;justify-content:space-between;margin-top:18px}

/* 댓글 */
.comments{margin-top:22px;background:#faf7f1;border:1px solid #eee;border-radius:12px;padding:16px}
.c-title{margin:0 0 12px;font-size:15px}
.c-title .num{color:#8a6a3f}
.c-list{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.c-item{display:flex;gap:10px;align-items:flex-start}
.avatar{width:28px;height:28px;border-radius:50%;background:#f0e7d8;border:1px solid #eadfcd;display:grid;place-items:center;font-size:12px;color:#6b5b4a}
.c-box{flex:1;background:#fff;border:1px solid #eee;border-radius:10px;padding:10px}
.c-head{display:flex;gap:8px;align-items:center;color:#6b7280;font-size:12px;margin-bottom:4px}
.c-author{color:#3c3425;font-weight:700}
.c-text{margin:0}
.c-row-actions{display:flex;justify-content:flex-end;margin-top:6px}
.c-del{padding:6px 10px;border-radius:999px;border:1px solid #eadfcd;background:#fff;color:#6b5b4a;cursor:pointer}
.c-del:hover{background:#f9f3ea}

.c-form{margin-top:12px;display:grid;gap:8px}
.row{display:flex;gap:10px}
.nick{width:220px;max-width:50%;padding:10px;border:1px solid #ddd;border-radius:8px;background:#fff}
.input{width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;background:#fff;resize:vertical}
.c-actions{display:flex;justify-content:flex-end}
.submit{padding:8px 14px;border-radius:10px;border:0;background:#e7c07d;color:#3c3425;font-weight:800}
</style>
