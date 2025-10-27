<template>
  <div class="page">
    <div class="form-box">
      <h2>입양 공고 작성</h2>

      <form @submit.prevent="submitPost">

        <!-- 제목 -->
        <div class="form-row">
          <label>제목 *</label>
          <input v-model="form.title" required placeholder="제목을 입력하세요" />
        </div>

        <!-- 기본 정보 -->
        <h3 class="section-title">동물 기본 정보</h3>

        <div class="grid">
          <div>
            <label>종류 *</label>
            <select v-model="form.animalType" required>
              <option value="">선택하세요</option>
              <option value="DOG">개</option>
              <option value="CAT">고양이</option>
            </select>
          </div>

          <div>
            <label>품종 *</label>
            <input v-model="form.breed" required placeholder="예: 비숑" />
          </div>

          <div>
            <label>나이 *</label>
            <input v-model="form.age" type="number" required placeholder="예: 3" />
          </div>

          <div>
            <label>성별 *</label>
            <select v-model="form.gender" required>
              <option value="">선택하세요</option>
              <option value="MALE">수컷</option>
              <option value="FEMALE">암컷</option>
            </select>
          </div>

          <div>
            <label>색상</label>
            <input v-model="form.color" placeholder="검정, 회색 등" />
          </div>

          <div>
            <label>체중(kg) *</label>
            <input v-model="form.weight" type="number" step="0.1" required />
          </div>
        </div>

        <!-- 건강정보 -->
        <h3 class="section-title">건강 정보</h3>

        <div class="grid">
          <div>
            <label>예방접종 여부 *</label>
            <select v-model="form.vaccination" required>
              <option value="Y">예</option>
              <option value="N">아니오</option>
            </select>
          </div>

          <div>
            <label>중성화 여부 *</label>
            <select v-model="form.neutering" required>
              <option value="Y">예</option>
              <option value="N">아니오</option>
            </select>
          </div>
        </div>

        <!-- 상세 내용 -->
        <div class="form-row">
          <label>내용 *</label>
          <textarea v-model="form.content" required placeholder="아이에 대한 설명을 적어주세요"></textarea>
        </div>

        <!-- 연락처 -->
        <div class="form-row">
          <label>연락처 *</label>
          <input v-model="form.userPhone" required placeholder="010-0000-0000" />
        </div>

<!-- 파일 업로드 -->
<div class="form-row">
  <label>사진 업로드 (최대 5장)</label>
  <input 
    type="file" 
    @change="handleFileUpload"
    multiple 
    accept="image/*"
  />

  <!-- 이미지 미리보기 -->
  <div class="preview-container" v-if="previews.length > 0">
    <div 
      v-for="(src, idx) in previews" 
      :key="idx" 
      class="preview-image"
    >
      <img :src="src" />
    </div>
  </div>
</div>

        <button type="submit" class="submit-btn">입양 게시글 등록</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"


const router = useRouter()

const form = reactive({
  title: "",
  animalType: "",
  breed: "",
  age: "",
  gender: "",
  color: "",
  weight: "",
  vaccination: "Y",
  neutering: "Y",
  content: "",
  userPhone: "",
  sigunguId: 1,
  userId: 1, // 로그인 후 store로 대체
  headId: null, // 로그인 사용자 타입에 따라 변경
})
const files = ref([])
const previews = ref([])

function handleFileUpload(e) {
  const selectedFiles = Array.from(e.target.files).slice(0,5)
  files.value = selectedFiles

  previews.value = []
  selectedFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previews.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

async function submitPost() {
  const formData = new FormData()

  for (const key in form) {
    formData.append(key, form[key])
  }

  files.value.forEach(file => {
    formData.append("files", file)
  })

  try {
    const res = await fetch("http://localhost:8000/post-service/adoption-post/regist", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) throw new Error("등록 실패")

    alert("게시글이 등록되었습니다!")
    router.push("/adoption")
  } catch (error) {
    alert("등록 실패: " + error.message)
  }
}
</script>

<style scoped>
.page {
  background: #f0ebe5;
  padding: 40px 16px;
  display: flex;
  justify-content: center;
}
.form-box {
  background: #fff;
  max-width: 760px;
  width: 100%;
  border-radius: 14px;
  padding: 32px;
}
.section-title {
  margin: 28px 0 12px;
  font-size: 17px;
  font-weight: bold;
  color: #b8860b;
}
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2,1fr);
}
.form-row {
  margin: 14px 0;
}
input, select, textarea {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
}
textarea { min-height: 120px; }
.submit-btn {
  margin-top: 24px;
  width: 100%;
  padding: 14px;
  background: #e6cf9c;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 48% 48%; /* 여백 남기는 고정 비율 */
}

.grid > div {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0; /* 넘침 방지 핵심 */
}

input, select, textarea {
  box-sizing: border-box;
  width: 100%;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr; /* 모바일은 한 줄 */
  }
}
.preview-container {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.preview-image {
  width: 120px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>??