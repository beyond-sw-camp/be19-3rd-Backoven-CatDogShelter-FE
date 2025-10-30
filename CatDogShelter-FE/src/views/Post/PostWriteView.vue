<template>
  <section class="wrap">
    <RouterLink class="back" :to="{ name:'post' }">← 목록으로</RouterLink>
    <h1 class="title">자유게시글 작성</h1>

    <form ref="formEl" class="form" @submit.prevent="submit">
      <!-- 제목 -->
      <label class="field">
        <span class="label">제목 <b class="req">*</b></span>
        <input v-model.trim="form.title" type="text" placeholder="제목을 입력하세요" required />
      </label>

      <!-- 카테고리 -->
      <div class="field">
        <span class="label">카테고리 <b class="req">*</b></span>
        <div class="seg">
          <label class="seg-opt">
            <input type="radio" name="cat" value="강아지" v-model="form.category" />
            <span>강아지</span>
          </label>
          <label class="seg-opt">
            <input type="radio" name="cat" value="고양이" v-model="form.category" />
            <span>고양이</span>
          </label>
        </div>
      </div>

      <!-- 내용 -->
      <label class="field">
        <span class="label">내용 <b class="req">*</b></span>
        <textarea v-model.trim="form.body" rows="12" placeholder="내용을 입력하세요" required />
      </label>

      <!-- 파일 업로드 -->
      <div class="field">
        <span class="label">사진 업로드</span>
        <div
          class="dropzone"
          @dragover.prevent
          @drop.prevent="onDrop"
          @click="fileEl.click()"
        >
          <input
            ref="fileEl"
            type="file"
            accept="image/*"
            multiple
            hidden
            @change="onPick"
          />
          <p class="dz-guide">클릭 또는 드래그하여 이미지를 추가하세요 (최대 5장)</p>
        </div>

        <ul v-if="images.length" class="preview">
          <li v-for="(img,i) in images" :key="i">
            <img :src="img" alt="" />
            <button type="button" class="rm" @click="remove(i)">×</button>
          </li>
        </ul>
      </div>

      <!-- 액션 -->
      <div class="actions">
        <button type="button" class="btn ghost" @click="cancel">취소</button>
        <button type="submit" class="btn primary">게시글 등록</button>
      </div>
    </form>

    <!-- 안내 박스 (선택) -->
    <aside class="notice">
      <h3>자유게시판 글쓰기 안내</h3>
      <ul>
        <li>예의와 배려를 지켜주세요.</li>
        <li>사진 업로드 시 민감정보가 노출되지 않도록 확인해주세요.</li>
        <li>운영원칙에 위배되는 글은 사전 통보 없이 삭제될 수 있습니다.</li>
      </ul>
    </aside>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formEl = ref(null)
const fileEl = ref(null)
const images = ref([]) // dataURL 배열
const form = ref({
  title: '',
  body: '',
  author: '이지윤',
  category:'',
})

// 간단한 카테고리 추론(목록과 동일 로직)
function inferCategory(title) {
  const t = title.toLowerCase()
  const dog = ['강아지','댕댕','멍','반려견','dog','리드줄','배변','훈련','산책','하네스','슬개골'].some(w => t.includes(w))
  const cat = ['고양','냥','야옹','반려묘','cat','캣','모래','스크래처','캣타워','캣닢','브러싱'].some(w => t.includes(w))
  if (dog && !cat) return '강아지'
  if (cat && !dog) return '고양이'
  return '강아지'
}

// 파일 -> dataURL
function filesToDataUrls(files) {
  const limit = 5 - images.value.length
  const slice = Array.from(files).slice(0, Math.max(0, limit))
  return Promise.all(slice.map(f => new Promise(res => {
    const fr = new FileReader()
    fr.onload = e => res(e.target.result)
    fr.readAsDataURL(f)
  })))
}

async function onPick(e) {
  const urls = await filesToDataUrls(e.target.files)
  images.value.push(...urls)
  e.target.value = ''
}
async function onDrop(e) {
  const urls = await filesToDataUrls(e.dataTransfer.files)
  images.value.push(...urls)
}
function remove(i){ images.value.splice(i,1) }

function nextId() {
  const seqKey = 'post:seq'
  const cur = Number(localStorage.getItem(seqKey) || '33') // 더미가 1~33
  const nxt = cur + 1
  localStorage.setItem(seqKey, String(nxt))
  return nxt
}

function saveListItem(item){
  const key = 'post:items'
  const arr = JSON.parse(localStorage.getItem(key) || '[]')
  arr.unshift(item) // 최신이 위로
  localStorage.setItem(key, JSON.stringify(arr))
}

function saveDetail(detail){
  localStorage.setItem(`post:detail:${detail.id}`, JSON.stringify(detail))
}

function today() {
  const d = new Date()
  const pad = n => String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

function cancel(){ router.push({ name:'post' }) }

function submit () {
  // 기존 사용자 글 목록
  const listKey = 'post:items'
  const userList = JSON.parse(localStorage.getItem(listKey) || '[]')

  // 새 ID: (사용자 글 최대 id vs 더미 최댓값 33) 중 큰 값 + 1
  const seqKey = 'post:seq'
  const deletedIds = (JSON.parse(localStorage.getItem('post:deleted') || '[]') || [])
                      .map(n => Number(n) || 0)
  const maxUserId = userList.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0)
  const lastSeq   = Number(localStorage.getItem(seqKey) || '33')
  const base      = Math.max(33, maxUserId, lastSeq, ...deletedIds)
  const id        = base + 1
  localStorage.setItem(seqKey, String(id))

  const now = Date.now()
  const d = new Date(now)
  const pad = n => String(n).padStart(2, '0')
  const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`

  // 목록용 아이템
  const listItem = {
    id,
    title: form.value.title.trim(),
    author: form.value.author.trim(),
    category: form.value.category || inferCategory(form.value.title),
    createdAt: now,
    date,
    views: 0,
    likes: 0,
    comments: 0,
    thumb: images.value[0] || ''
  }

  // 상세용 데이터
  const detail = {
    id,
    board: 'free',
    title: listItem.title,
    category: listItem.category,
    author: { name: listItem.author },
    date,
    stats: { views: 0, likes: 0, comments: 0 },
    images: images.value.map((src, i) => ({ src, alt: `${listItem.title} ${i+1}` })),
    content: form.value.body.split('\n').filter(Boolean),
    prev: null,
    next: null,
    comments: [],
    attachments: [],
    tags: []
  }

  // 저장
  localStorage.setItem(listKey, JSON.stringify([listItem, ...userList]))
  localStorage.setItem(`post:detail:${id}`, JSON.stringify(detail))

  // 완료 → 목록
  router.push({ name: 'post', query: { page: 1 } })
}
</script>

<style scoped>
.wrap{max-width:880px;margin:24px auto;padding:20px;background:#fff;border-radius:14px;box-shadow:0 12px 22px rgba(0,0,0,.06)}
.back{color:#6b5b4a}
.title{margin:8px 0 18px;font-size:22px;font-weight:800}
.form{display:grid;gap:14px}

.field{display:grid;gap:8px}
.label{font-weight:700;color:#4a3b2a}
.req{color:#c95555}

input[type="text"],
textarea,
.dropzone {
  width:100%; padding:12px; border:1px solid #eadfcd; border-radius:12px; background:#f7f6f3;
  box-sizing: border-box;   
  width: 100%;
}
textarea{resize:vertical; min-height:220px}

.dropzone{
  border:2px dashed #eadfcd;border-radius:14px; padding:18px; text-align:center; background:#fbfaf7; cursor:pointer
}
.dz-guide{margin:0;color:#8a7a66}

.preview{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;padding:0;list-style:none}
.preview li{position:relative}
.preview img{width:120px;height:120px;object-fit:cover;border-radius:10px;border:1px solid #eadfcd}
.rm{position:absolute;top:4px;right:4px;border:0;background:#0008;color:#fff;border-radius:50%;width:22px;height:22px;cursor:pointer}

.actions{display:flex;justify-content:flex-end;gap:10px;margin-top:6px}
.btn{padding:10px 16px;border-radius:10px;font-weight:700;cursor:pointer}
.btn.ghost{background:#fff;border:1px solid #eadfcd;color:#5a4a38}
.btn.primary{background:#e7c07d;border:0;color:#3c3425}

.notice{margin-top:18px;padding:14px;border:1px solid #eadfcd;background:#fbf6ea;border-radius:12px}
.notice h3{margin:0 0 8px;font-size:14px}
.notice ul{margin:0;padding-left:16px;color:#6b5b4a}
</style>
