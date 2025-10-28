<template>
  <section class="wrap">
    <RouterLink class="back" :to="{ name:'donation' }">← 목록으로</RouterLink>
    
    <h1 class="title">게시글 작성</h1>

    <form class="form" @submit.prevent="submit">
      <!-- 요청 제목 -->
      <label class="field">
        <span class="label">제목 <b class="req">*</b></span>
        <input
          v-model.trim="form.title"
          type="text"
          placeholder="제목을 입력해주세요."
          required
        />
      </label>

      <!-- 상세 설명 -->
      <label class="field">
        <span class="label">상세 설명 <b class="req">*</b></span>
        <textarea
          v-model.trim="form.description"
          rows="10"
          placeholder="내용을 입력해주세요."
          required
        />
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
          <p class="dz-guide">
            클릭 또는 드래그하여 이미지를 추가하세요 (최대 5장)<br />
          </p>
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

    <!-- 안내 박스 -->
    <aside class="notice">
      <h3>후원게시글 작성 안내</h3>
      <ul>
        <li>금전 직접 송금을 유도하는 경우 후원자가 불안해할 수 있으니, 가능하면 실제 물품 후원을 권장해주세요.</li>
        <li>민감한 개인 정보(집 주소 등)는 공개 글에 바로 적지 않는 것을 추천드립니다.</li>
      </ul>
    </aside>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 업로드 미리보기용 dataURL 배열
const fileEl = ref(null)
const images = ref([])

// 폼 데이터
const form = ref({
  title: '',
  shelterName: '',
  items: '',
  contact: '',
  description: '',
  // 작성자 정보 (로그인 붙으면 토큰에서 가져오도록 변경)
  author: '보호소 담당자',
})

// 최대 5장 제한하면서 FileList -> dataURL 변환
function filesToDataUrls(files) {
  const limit = 5 - images.value.length
  const slice = Array.from(files).slice(0, Math.max(0, limit))
  return Promise.all(
    slice.map(
      (f) =>
        new Promise((res) => {
          const fr = new FileReader()
          fr.onload = (e) => res(e.target.result)
          fr.readAsDataURL(f)
        })
    )
  )
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

function remove(i) {
  images.value.splice(i, 1)
}

// 로컬 스토리지에 저장할 키들
const LIST_KEY = 'donation:items'            // 목록용
const DETAIL_KEY_PREFIX = 'donation:detail:' // 상세용

// 새 ID 생성 (donation 게시판용 전용 시퀀스)
function nextDonationId() {
  const seqKey = 'donation:seq'
  const cur = Number(localStorage.getItem(seqKey) || '1000') // 시작번호 1000부터
  const nxt = cur + 1
  localStorage.setItem(seqKey, String(nxt))
  return nxt
}

// YYYY-MM-DD 형식 날짜
function today() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function cancel() {
  router.push({ name: 'donation' })
}

// const headId = sessionStorage.getItem('headId') || 1
// formData.append('headId', headId)

async function submit() {
  if (!form.value.title.trim()) {
    alert('제목을 입력해주세요.')
    return
  }
  if (!form.value.description.trim()) {
    alert('내용을 입력해주세요.')
    return
  }

  try {
    // ====== FormData 생성 ======
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('content', form.value.description)
    formData.append('headId', 1) // ⚠️ 보호소장 ID (임시 하드코딩)

    const fileInput = fileEl.value
    if (fileInput && fileInput.files.length > 0) {
      for (let i = 0; i < fileInput.files.length; i++) {
        formData.append('files', fileInput.files[i])
      }
    }

    // ====== 요청 전송 ======
    const res = await fetch('http://localhost:8000/post-service/donation-posts', {
      method: 'POST',
      // JWT 나중에 활성화 가능
      // headers: {
      //   Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
      // },
      body: formData,
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(`등록 실패 (${res.status}): ${msg}`)
    }

    alert('✅ 후원 게시글이 성공적으로 등록되었습니다!')
    router.push({ name: 'donation' })
  } catch (err) {
    console.error('[후원글 등록 실패]', err)
    alert('❌ 등록 중 오류가 발생했습니다.')
  }


  // 새 ID 발급
  const id = nextDonationId()

  // 현재 시간 정보: 목록 정렬용으로 timestamp도 같이 저장
  const now = Date.now()
  const dateText = today()

  // ----- 목록에서 쓸 요약 데이터 -----
  // 후원 목록 페이지에서 카드/리스트로 뿌릴 값
  const listItem = {
    id,
    title: form.value.title.trim(),
    shelterName: form.value.shelterName.trim(),
    items: form.value.items.trim(),        // 예: "사료 5kg x4"
    contact: form.value.contact.trim(),
    createdAt: now,                        // 정렬 기준 (최신 먼저)
    date: dateText,                        // 사람이 읽는 날짜
    views: 0,
    likes: 0,
    comments: 0,
    thumb: images.value[0] || '',
  }

  // ----- 상세 페이지용 데이터 -----
  // 상세 화면에서 쓸 전체 정보
  const detail = {
    id,
    title: listItem.title,
    shelterName: listItem.shelterName,
    items: listItem.items,
    contact: listItem.contact,
    date: dateText,
    author: {
      name: form.value.author || '보호소 담당자',
    },
    stats: {
      views: 0,
      likes: 0,
      comments: 0,
    },
    // 업로드한 모든 이미지 미리보기
    images: images.value.map((src, i) => ({
      src,
      alt: `${listItem.title} ${i + 1}`,
    })),
    // 상세 본문
    description: form.value.description
      .split('\n')
      .filter(Boolean), // 줄 단위로 잘라 배열로
    comments: [],
    prev: null,
    next: null,
  }

  // ----- 저장 (localStorage) -----
  // 기존 후원글 리스트 불러오기
  const rawList = localStorage.getItem(LIST_KEY)
  const donationList = rawList ? JSON.parse(rawList) : []

  // 새 글을 맨 앞에 추가
  const newList = [listItem, ...donationList]
  localStorage.setItem(LIST_KEY, JSON.stringify(newList))

  // 상세 데이터 저장
  localStorage.setItem(`${DETAIL_KEY_PREFIX}${id}`, JSON.stringify(detail))

  // 완료 후 목록으로 이동
  router.push({ name: 'donation' })
}

</script>

<style scoped>
.wrap {
  max-width: 880px;
  margin: 24px auto;
  padding: 20px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 22px rgba(0,0,0,.06);
}
.back {
  color: #6b5b4a;
}
.title {
  padding:20px 0px;
  margin: 8px 0 18px;
  font-size: 22px;
  font-weight: 800;
}
.form {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 8px;
}
.label {
  font-weight: 700;
  color: #4a3b2a;
  padding: 10px 0px;
}
.req {
  color: #c95555;
}

input[type="text"],
textarea,
.dropzone {
  width: 100%;
  padding: 12px;
  border: 1px solid #eadfcd;
  border-radius: 12px;
  background: #f7f6f3;
  box-sizing: border-box;
}
textarea {
  resize: vertical;
  min-height: 160px;
}

.dropzone {
  border: 2px dashed #eadfcd;
  border-radius: 14px;
  padding: 18px;
  text-align: center;
  background: #fbfaf7;
  cursor: pointer;
}
.dz-guide {
  margin: 0;
  color: #8a7a66;
  font-size: 13px;
  line-height: 1.5;
}

.preview {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
  padding: 0;
  list-style: none;
}
.preview li {
  position: relative;
}
.preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #eadfcd;
}
.rm {
  position: absolute;
  top: 4px;
  right: 4px;
  border: 0;
  background: #0008;
  color: #fff;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  cursor: pointer;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}
.btn {
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}
.btn.ghost {
  background: #fff;
  border: 1px solid #eadfcd;
  color: #5a4a38;
}
.btn.primary {
  background: #e7c07d;
  border: 0;
  color: #3c3425;
}

.notice {
  margin-top: 18px;
  padding: 14px;
  border: 1px solid #eadfcd;
  background: #fbf6ea;
  border-radius: 12px;
}
.notice h3 {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
  color: #4a3b2a;
}
.notice ul {
  margin: 0;
  padding-left: 16px;
  color: #6b5b4a;
  font-size: 13px;
  line-height: 1.5;
}
</style>