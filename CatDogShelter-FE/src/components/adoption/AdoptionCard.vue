<template>
  <div class="card" @click="moveToDetail">
    <img
  :src="imageUrl"
  alt="thumbnail"
/>

    
    <div class="tag-box">
      <span class="tag">
        {{ post.animalType === 'DOG' ? '강아지' : '고양이' }}
      </span>
      <span class="tag sub-tag">{{ post.breed }}</span>
    </div>

    <div class="text-box">
      <p class="title">{{ post.title }}</p>
      <p class="writer">작성자: {{ post.writerName }}</p>

      <div class="info-row">
        <span>{{ post.sidoName }} {{ post.sigunguName }}</span>
        <span>{{ post.displayDate }}</span>
      </div>

      <div class="status-row">
        <span>👁 {{ post.view }}</span>
        <span>💛 {{ post.recommendCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  post: { type: Object, required: true }
})

const PLACEHOLDER = '/noImg.png'

// 목록 응답의 storageFileName이
// 1) 그냥 파일명인 경우: "cat.png"
// 2) 전체 경로인 경우: "/post-service/adoption-post/image/cat.png"
// 둘 다 처리하도록 정규화
const imageUrl = computed(() => {
  // If backend provided files array, prefer its first file's URL
  if (props.post && Array.isArray(props.post.files) && props.post.files.length > 0) {
    const f = props.post.files[0]
    if (f.fileUrl) {
      if (f.fileUrl.startsWith('http')) return f.fileUrl
      const path = f.fileUrl.startsWith('/') ? f.fileUrl : `/${f.fileUrl}`
      return `http://localhost:8000${path}`
    }
    if (f.fileRename && props.post.id) {
      return `http://localhost:8000/post-service/adoption-post/${props.post.id}/files/${f.fileRename}`
    }
  }

  // Fallback to storageFileName field if present
  const v = props.post.storageFileName
  if (!v) return PLACEHOLDER
  if (v.startsWith('http')) return v
  if (props.post && props.post.id) {
    return `http://localhost:8000/post-service/adoption-post/${props.post.id}/files/${v}`
  }
  return `http://localhost:8000/files/adoption/${v}`
})

function onImgError(e) {
  e.target.src = PLACEHOLDER   // 파일이 실제로 없을 때 폴백
}

const router = useRouter()
function moveToDetail() {
  router.push(`/adoption-post/${props.post.id}`)
}
</script>

<style scoped>
.card {
  width: 265px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #dedede;
  cursor: pointer;
  overflow: hidden;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.tag-box {
  padding: 9px 12px 0 12px;
}

.tag {
  background: #e8e3d2;
  color: #4a3b2a;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 6px;
  margin-right: 4px;
}

.sub-tag {
  background: #f0f0f0;
}

.text-box {
  padding: 12px;
}

.title {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 4px;
}

.writer {
  font-size: 13px;
  color: #666;
}

.info-row,
.status-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #7a7a7a;
  margin-top: 6px;
}
</style>
