<template>
  <div class="review-insert-page">
    <div class="insert-container">
      <!-- 뒤로가기 버튼 -->
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
        목록으로
      </button>

      <h1 class="page-title">봉사후기 작성</h1>

      <form @submit.prevent="submitForm" class="insert-form">
        <!-- 제목 -->
        <div class="form-group">
          <label class="form-label required">제목</label>
          <input 
            type="text" 
            v-model="formData.title"
            class="form-input"
            placeholder="예: 우리집 애 너무 귀여워요"
            required
          />
        </div>

        <!-- 내용 -->
        <div class="form-group">
          <label class="form-label required">내용</label>
          <textarea 
            v-model="formData.content"
            class="form-textarea"
            placeholder="예: 오늘 주말로 쓰는 단기를 넘겨왔는데 이어"
            rows="15"
            required
          ></textarea>
        </div>

        <!-- 사진 업로드 -->
        <div class="form-group">
          <label class="form-label">사진 업로드</label>
          <p class="upload-description">최대 5장까지 업로드 가능합니다</p>
          
          <div class="upload-area" @click="triggerFileInput">
            <input 
              type="file" 
              ref="fileInput"
              @change="handleFileUpload"
              accept="image/*"
              multiple
              style="display: none"
            />
            <div class="upload-placeholder">
              <span class="upload-icon">📤</span>
              <p class="upload-text">클릭하여 사진 업로드</p>
            </div>
          </div>

          <!-- 업로드된 이미지 미리보기 -->
          <div v-if="uploadedImages.length > 0" class="image-preview-container">
            <div 
              v-for="(image, index) in uploadedImages" 
              :key="index"
              class="image-preview-item"
            >
              <img :src="image.url" :alt="`미리보기 ${index + 1}`" class="preview-image" />
              <button 
                type="button"
                class="remove-image-btn" 
                @click="removeImage(index)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- 버튼 그룹 -->
        <div class="button-group">
          <button type="button" class="cancel-btn" @click="goBack">
            취소
          </button>
          <button type="submit" class="submit-btn">
            봉사후기게시글 등록
          </button>
        </div>
      </form>

      <!-- 안내 박스 -->
      <div class="info-box">
        <h3 class="info-box-title">봉사후기 작성 안내</h3>
        <ul class="info-list">
          <li>모든 정보는 정확하게 작성해주세요</li>
          <li>아이의 성격과 특징을 자세히 적어주시면 입양 확률이 높아집니다</li>
          <li>선명한 사진을 여러 장 올려주시면 좋습니다</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  title: '',
  content: ''
})

const uploadedImages = ref([])
const fileInput = ref(null)

function goBack() {
  router.push('/volunteer')
}

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileUpload(event) {
  const files = Array.from(event.target.files)
  
  // 최대 5장 제한
  if (uploadedImages.value.length + files.length > 5) {
    alert('최대 5장까지만 업로드할 수 있습니다.')
    return
  }

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadedImages.value.push({
          file: file,
          url: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })

  // input 초기화
  event.target.value = ''
}

function removeImage(index) {
  uploadedImages.value.splice(index, 1)
}

function submitForm() {
  // 유효성 검사
  if (!formData.value.title.trim()) {
    alert('제목을 입력해주세요.')
    return
  }
  
  if (!formData.value.content.trim()) {
    alert('내용을 입력해주세요.')
    return
  }

  // 폼 데이터 전송 로직
  const submitData = {
    ...formData.value,
    images: uploadedImages.value.map(img => img.file)
  }

  console.log('제출 데이터:', submitData)
  
  // API 호출 예시
  // await api.createVolunteerReview(submitData)
  
  alert('봉사후기 게시글이 등록되었습니다!')
  router.push('/volunteer')
}
</script>

<style scoped>
.review-insert-page {
  background: #faf8f5;
  min-height: 100vh;
  padding: 40px 20px;
}

.insert-container {
  max-width: 800px;
  margin: 0 auto;
}

/* 뒤로가기 버튼 */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  color: #6b5744;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 24px;
}

.back-btn:hover {
  background: #f5f0e8;
  border-color: #d4c4b0;
}

.back-icon {
  font-size: 1.2rem;
}

/* 페이지 타이틀 */
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #3d2f1f;
  text-align: center;
  margin: 0 0 40px 0;
}

/* 폼 */
.insert-form {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 32px;
}

.form-group:last-of-type {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #3d2f1f;
  margin-bottom: 12px;
}

.form-label.required::after {
  content: '*';
  color: #ff6b6b;
  margin-left: 4px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #3d2f1f;
  background: #f8f6f2;
  transition: all 0.3s;
  outline: none;
}

.form-input::placeholder {
  color: #b8a596;
}

.form-input:focus {
  border-color: #f0b762;
  background: white;
  box-shadow: 0 0 0 3px rgba(240, 183, 98, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #3d2f1f;
  background: #f8f6f2;
  transition: all 0.3s;
  outline: none;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
}

.form-textarea::placeholder {
  color: #b8a596;
}

.form-textarea:focus {
  border-color: #f0b762;
  background: white;
  box-shadow: 0 0 0 3px rgba(240, 183, 98, 0.1);
}

/* 업로드 영역 */
.upload-description {
  font-size: 0.85rem;
  color: #8b7355;
  margin: 0 0 12px 0;
}

.upload-area {
  border: 2px dashed #d4c4b0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  background: #fafaf8;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #f0b762;
  background: #f8f6f2;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  font-size: 3rem;
  color: #d4c4b0;
}

.upload-text {
  font-size: 0.95rem;
  color: #8b7355;
  margin: 0;
}

/* 이미지 미리보기 */
.image-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.image-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e8e0d5;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.remove-image-btn:hover {
  background: rgba(255, 107, 107, 0.9);
  transform: scale(1.1);
}

/* 버튼 그룹 */
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background: white;
  border: 2px solid #e8e0d5;
  color: #6b5744;
}

.cancel-btn:hover {
  background: #f5f0e8;
  border-color: #d4c4b0;
}

.submit-btn {
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(240, 183, 98, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 183, 98, 0.4);
}

/* 안내 박스 */
.info-box {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #f0b762;
}

.info-box-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 16px 0;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #6b5744;
  line-height: 1.6;
}

.info-list li:last-child {
  margin-bottom: 0;
}

.info-list li::before {
  content: '•';
  position: absolute;
  left: 8px;
  color: #f0b762;
  font-weight: 700;
}

/* 반응형 */
@media (max-width: 768px) {
  .review-insert-page {
    padding: 20px 16px;
  }

  .insert-form {
    padding: 24px;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }

  .button-group {
    flex-direction: column;
  }

  .image-preview-container {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>