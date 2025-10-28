<!-- VolunteerRecruitInsertView.vue -->
<template>
  <div class="recruit-insert-page">
    <div class="insert-container">
      <button class="back-btn" @click="goBack">
        <span class="back-icon">&lt;</span>
        목록으로
      </button>

      <h1 class="page-title">봉사 모집글 등록</h1>

      <form class="insert-form" @submit.prevent="submitRecruit">
        <!-- 1. 제목과 내용 (최상단) -->
        <section class="form-section">
          <h2 class="section-title">모집 제목 및 내용</h2>
          <div class="form-group">
            <label class="form-label required" for="title">제목</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="form-input"
              placeholder="모집 제목을 입력해 주세요 (예: 서울 마포구 유기견 보호소 주말 봉사자 모집)"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label required" for="content">내용</label>
            <textarea
              id="content"
              v-model="formData.content"
              class="form-textarea"
              placeholder="봉사 활동 내용을 상세하게 입력해 주세요&#10;- 활동 내용&#10;- 필요 역할&#10;- 준비물&#10;- 주의사항 등"
              rows="12"
              required
            ></textarea>
          </div>
        </section>

        <!-- 2. 기본 정보 -->
        <section class="form-section">
          <h2 class="section-title">기본 정보</h2>
          <div class="form-grid three-columns">
            <div class="form-group">
              <label class="form-label required" for="numberOfPeople">모집 인원</label>
              <input
                id="numberOfPeople"
                v-model="formData.numberOfPeople"
                type="text"
                class="form-input"
                placeholder="예) 5명"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label required" for="time">활동 시간</label>
              <input
                id="time"
                v-model="formData.time"
                type="text"
                class="form-input"
                placeholder="예) 3시간"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label required" for="startcreatedAt">활동 날짜</label>
              <input
                id="startcreatedAt"
                v-model="formData.startcreatedAt"
                type="date"
                class="form-input"
                required
              />
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2 class="section-title">지역 정보</h2>
          <div class="form-grid two-columns">
            <div class="form-group">
              <label class="form-label required" for="sido">시/도</label>
              <select
                id="sido"
                v-model="formData.sido"
                class="form-input"
                required
              >
                <option value="" disabled>시/도를 선택해 주세요</option>
                <option
                  v-for="region in sidoOptions"
                  :key="region.code"
                  :value="region.code"
                >
                  {{ region.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required" for="sigungu">시/군/구</label>
              <select
                id="sigungu"
                v-model="formData.sigungu"
                class="form-input"
                :disabled="!formData.sido"
                required
              >
                <option value="" disabled>시/군/구를 선택해 주세요</option>
                <option
                  v-for="region in sigunguOptions"
                  :key="region.code"
                  :value="region.code"
                >
                  {{ region.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label required" for="detailAddress">상세 주소</label>
            <input
              id="detailAddress"
              v-model="formData.detailAddress"
              type="text"
              class="form-input"
              placeholder="활동 장소를 입력해 주세요"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label required" for="companyName">보호소 이름</label>
            <input
              id="companyName"
              v-model="formData.companyName"
              type="text"
              class="form-input"
              placeholder="보호소 이름을 입력해 주세요"
              required
            />
          </div>
        </section>

        <section class="form-section">
          <h2 class="section-title">이미지 첨부</h2>
          <p class="upload-description">최대 5장까지만 업로드할 수 있어요.</p>
          <div class="upload-area" @click="triggerFileInput">
            <input
              id="fileInput"
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              style="display: none"
              @change="handleFileUpload"
            />
            <div class="upload-placeholder">
              <span class="upload-icon">+</span>
              <p class="upload-text">이미지를 클릭해서 업로드해 주세요</p>
            </div>
          </div>

          <div v-if="uploadedImages.length" class="image-preview-container">
            <div
              v-for="(image, index) in uploadedImages"
              :key="image.name + '-' + index"
              class="image-preview-item"
            >
              <img :src="image.url" :alt="`첨부 이미지 ${index + 1}`" class="preview-image" />
              <button type="button" class="remove-image-btn" @click="removeImage(index)">×</button>
            </div>
          </div>
        </section>

        <div class="button-group">
          <button type="button" class="cancel-btn" @click="goBack">취소</button>
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? '등록 중...' : '모집글 등록' }}
          </button>
        </div>
      </form>

      <div class="info-box">
        <h3 class="info-box-title">모집글 작성 가이드</h3>
        <ul class="info-list">
          <li>봉사 장소와 시간을 정확하게 입력해 주세요.</li>
          <li>필요한 봉사 역할과 준비물을 구체적으로 안내해 주세요.</li>
          <li>활동 사진을 첨부하면 봉사자 모집에 도움이 돼요.</li>
          <li>모집 인원과 마감일 정보를 꼭 확인해 주세요.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import regionsData from '@/assets/data/regions.json'

const router = useRouter()
const submitting = ref(false)
const fileInput = ref(null)

const formData = ref({
  companyName: '',
  title: '',
  content: '',
  numberOfPeople: '',
  time: '',
  startcreatedAt: '',
  sido: '',
  sigungu: '',
  detailAddress: ''
})

const uploadedImages = ref([])

const regions = regionsData

const sidoOptions = computed(() =>
  regions
    .filter(region => region.parent === null)
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
)

const sigunguOptions = computed(() => {
  if (!formData.value.sido) {
    return []
  }

  return regions
    .filter(region => region.parent === formData.value.sido)
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
})

watch(
  () => formData.value.sido,
  () => {
    formData.value.sigungu = ''
  }
)

const goBack = () => {
  router.back()
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target?.files ?? [])
  if (!files.length) return

  const remainingSlots = Math.max(0, 5 - uploadedImages.value.length)
  const selectable = files.slice(0, remainingSlots)

  selectable.forEach((file) => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      const url = typeof loadEvent.target?.result === 'string' ? loadEvent.target.result : ''
      uploadedImages.value.push({ name: file.name, url })
    }
    reader.readAsDataURL(file)
  })

  if (files.length > remainingSlots) {
    alert('이미지는 최대 5장까지만 업로드할 수 있어요.')
  }

  if (event.target) {
    event.target.value = ''
  }
}

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

const validateForm = () => {
  const requiredFields = [
    { key: 'companyName', message: '보호소 이름을 입력해 주세요.' },
    { key: 'title', message: '모집 제목을 입력해 주세요.' },
    { key: 'content', message: '모집 내용을 입력해 주세요.' },
    { key: 'numberOfPeople', message: '모집 인원을 입력해 주세요.' },
    { key: 'time', message: '활동 시간을 입력해 주세요.' },
    { key: 'startcreatedAt', message: '활동 날짜를 선택해 주세요.' },
    { key: 'sido', message: '시/도를 선택해 주세요.' },
    { key: 'sigungu', message: '시/군/구를 선택해 주세요.' },
    { key: 'detailAddress', message: '상세 주소를 입력해 주세요.' }
  ]

  for (const field of requiredFields) {
    const value = formData.value[field.key]
    if (typeof value === 'string') {
      if (!value.trim()) {
        alert(field.message)
        return false
      }
    } else if (!value) {
      alert(field.message)
      return false
    }
  }

  return true
}

const getRegionName = (code) => {
  if (!code) return ''
  const match = regions.find(region => region.code === code)
  return match ? match.name : ''
}

const submitRecruit = async () => {
  if (submitting.value) return
  if (!validateForm()) return

  submitting.value = true

  const primaryImage = uploadedImages.value[0]?.url ?? null
  const sidoName = getRegionName(formData.value.sido)
  const sigunguName = getRegionName(formData.value.sigungu)
  const detailAddress = formData.value.detailAddress.trim()
  const fullAddress = [sidoName, sigunguName, detailAddress].filter(Boolean).join(' ')

  const newRecruit = {
    companyName: formData.value.companyName.trim(),
    title: formData.value.title.trim(),
    content: formData.value.content.trim(),
    numberOfPeople: formData.value.numberOfPeople.trim(),
    time: formData.value.time.trim(),
    startcreatedAt: formData.value.startcreatedAt,
    sido: sidoName,
    sigungu: sigunguName,
    detailAddress: fullAddress,
    deadline: '모집중',
    deadlineClass: 'recruiting',
    createdAt: new Date().toISOString().split('T')[0],
    file: primaryImage
  }

  try {
    const response = await fetch('http://localhost:8080/volunteer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecruit)
    })

    if (!response.ok) {
      throw new Error('서버 응답 오류')
    }

    alert('봉사 모집글이 등록되었습니다.')
    router.push('/volunteer')
  } catch (error) {
    console.error(error)
    alert('등록 중 오류가 발생했습니다. 다시 시도해 주세요.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.recruit-insert-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff9f0 0%, #ffe8cc 100%);
  padding: 60px 20px;
}

.insert-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.back-btn {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #666666;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.back-btn:hover {
  background: #f8f9fa;
  border-color: #ff9a76;
  color: #ff9a76;
  transform: translateX(-5px);
}

.back-icon {
  font-size: 18px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.insert-form {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.form-section + .form-section {
  margin-top: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 18px;
}

/* 그리드가 없는 섹션도 동일한 너비 보장 */
.form-section {
  width: 100%;
}

.form-grid {
  display: grid;
  gap: 20px;
}

.form-grid.two-columns {
  grid-template-columns: repeat(2, minmax(260px, 1fr));
}

.form-grid.three-columns {
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.form-section > .form-group + .form-group {
  margin-top: 20px;
}

/* 그리드 내부의 form-group은 margin-top 제거 */
.form-grid .form-group {
  margin-top: 0;
}

.form-label {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.form-label.required::after {
  content: ' *';
  color: #ff6b6b;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  color: #3d2f1f;
  background: white;
  transition: all 0.3s;
  outline: none;
  box-sizing: border-box;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #b8a596;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #FF9A76;
  box-shadow: 0 0 0 3px rgba(255, 154, 118, 0.1);
}

select.form-input {
  appearance: none;
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, #ff9a76 50%),
    linear-gradient(135deg, #ff9a76 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(50% - 4px), calc(100% - 13px) calc(50% - 4px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
}

.form-input:disabled {
  background: #f5f5f5;
  color: #a3a3a3;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 220px;
  line-height: 1.6;
}

.upload-description {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #FF9A76;
  background: #FFF9F0;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 48px;
}

.upload-text {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.image-preview-container {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.image-preview-item {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  background: rgba(255, 0, 0, 0.8);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: rgba(255, 0, 0, 1);
  transform: scale(1.1);
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 40px;
}

.cancel-btn,
.submit-btn {
  padding: 15px 40px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.submit-btn {
  background: linear-gradient(135deg, #ff9a76 0%, #ff7b54 100%);
  color: #ffffff;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 123, 84, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-box {
  background: #ffffff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.info-box-title {
  font-size: 20px;
  font-weight: 700;
  color: #ff7b54;
  margin: 0 0 20px 0;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  padding: 12px 0;
  padding-left: 30px;
  color: #666666;
  line-height: 1.6;
  position: relative;
}

.info-list li::before {
  content: '-';
  position: absolute;
  left: 10px;
  color: #ff9a76;
  font-size: 20px;
  font-weight: 700;
}

@media (max-width: 1024px) and (min-width: 769px) {
  .form-grid.three-columns {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-grid.three-columns .form-group:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .insert-form {
    padding: 24px;
  }

  .page-title {
    font-size: 26px;
  }

  .form-grid.two-columns,
  .form-grid.three-columns {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }

  .image-preview-container {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>