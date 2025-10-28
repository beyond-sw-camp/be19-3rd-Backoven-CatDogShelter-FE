<template>

  <div class="page">
    <div class="form-box">
      <h2>입양 공고 작성</h2>

      <!-- JSON Server 상태 표시 -->
      <div v-if="!serverChecked" class="info-message">
        서버 연결 확인 중...
      </div>
      <div v-else-if="!isServerRunning" class="warning-message">
        ⚠️ JSON Server가 실행되지 않았습니다.<br>
        터미널에서 다음 명령어를 실행하세요:<br>
        <code>json-server --watch db.json --port 3001</code>
      </div>
      <div v-else class="success-message-small">
        ✓ JSON Server 연결됨 (포트: {{ serverPort }})
      </div>

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
              v-for="(preview, idx) in previews" 
              :key="idx" 
              class="preview-image"
            >
              <img :src="preview" />
              <button type="button" class="remove-btn" @click="removeImage(idx)">×</button>
            </div>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting || !isServerRunning">
          {{ isSubmitting ? '등록 중...' : '입양 게시글 등록' }}
        </button>
      </form>

      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>

    <!-- 성공 모달 -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-icon">✓</div>
          <h3>입양 게시글 등록</h3>
          <p>게시글이 성공적으로 등록되었습니다!</p>
          <button class="modal-btn" @click="goToList">입양 게시판으로 이동</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"
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
  userName: "박지수",
  location: "서울특별시 종로구",
  sigunguId: 1,
  userId: 1,
})

const files = ref([])
const previews = ref([])
const isSubmitting = ref(false)
const errorMessage = ref("")
const showSuccessModal = ref(false)
const isServerRunning = ref(false)
const serverChecked = ref(false)
const serverPort = ref(null)

// 여러 포트를 시도해서 JSON Server 찾기
async function checkServer() {
  const portsToTry = [3001, 3002, 3003, 3000, 4000]
  
  for (const port of portsToTry) {
    try {
      const res = await fetch(`http://localhost:${port}/adoptionPosts`, {
        method: "GET"
      })
      
      if (res.ok) {
        isServerRunning.value = true
        serverPort.value = port
        console.log(`✓ JSON Server 연결 성공 (포트: ${port})`)
        serverChecked.value = true
        return
      }
    } catch (error) {
      continue
    }
  }
  
  isServerRunning.value = false
  serverChecked.value = true
  console.error("JSON Server를 찾을 수 없습니다")
}

onMounted(() => {
  checkServer()
})

function handleFileUpload(e) {
  const selectedFiles = Array.from(e.target.files).slice(0, 5)
  files.value = selectedFiles

  previews.value = []
  selectedFiles.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previews.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

function removeImage(index) {
  previews.value.splice(index, 1)
  files.value.splice(index, 1)
}

async function submitPost() {
  if (isSubmitting.value) return
  
  if (!isServerRunning.value) {
    errorMessage.value = "JSON Server가 실행되지 않았습니다. 서버를 먼저 실행해주세요."
    return
  }
  
  isSubmitting.value = true
  errorMessage.value = ""

  const postData = {
    title: form.title,
    animalType: form.animalType,
    breed: form.breed,
    age: parseInt(form.age),
    gender: form.gender,
    color: form.color,
    weight: parseFloat(form.weight),
    vaccination: form.vaccination,
    neutering: form.neutering,
    content: form.content,
    userPhone: form.userPhone,
    userName: form.userName,
    location: form.location,
    sigunguId: parseInt(form.sigunguId),
    userId: parseInt(form.userId),
    images: previews.value,
    createdAt: new Date().toISOString(),
    viewCount: 0,
    likeCount: 0,
    status: "ACTIVE"
  }

  try {
    console.log("전송할 데이터:", postData)
    
    const res = await fetch(`http://localhost:${serverPort.value}/adoptionPosts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`등록 실패 (${res.status}): ${errorText}`)
    }

    const result = await res.json()
    console.log("등록 성공:", result)

    // 성공 모달 표시
    showSuccessModal.value = true
    
  } catch (error) {
    console.error("등록 오류:", error)
    
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      errorMessage.value = "서버에 연결할 수 없습니다. JSON Server가 실행 중인지 확인해주세요.\n\n터미널에서 실행: json-server --watch db.json --port 3001"
      isServerRunning.value = false
    } else {
      errorMessage.value = `등록 실패: ${error.message}`
    }
  } finally {
    isSubmitting.value = false
  }
}

function closeModal() {
  showSuccessModal.value = false
  goToList()
}

function goToList() {
  showSuccessModal.value = false
  router.push("/adoption")
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

h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.section-title {
  margin: 28px 0 12px;
  font-size: 17px;
  font-weight: bold;
  color: #b8860b;
}

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 48% 48%;
}

.grid > div {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
}

.form-row {
  margin: 14px 0;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

input, select, textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  font-family: inherit;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #b8860b;
}

textarea { 
  min-height: 120px;
  resize: vertical;
}

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
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #d4bc85;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #ccc;
}

.preview-container {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.preview-image {
  position: relative;
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

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(0,0,0,0.8);
}

.info-message {
  margin-bottom: 16px;
  padding: 12px;
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 8px;
  color: #1565c0;
  font-size: 14px;
}

.success-message-small {
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  color: #155724;
  font-size: 13px;
  font-weight: 500;
}

.warning-message {
  margin-bottom: 16px;
  padding: 12px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  font-size: 14px;
  line-height: 1.6;
}

.warning-message code {
  display: block;
  margin-top: 8px;
  padding: 8px;
  background: #333;
  color: #fff;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  font-size: 14px;
  white-space: pre-line;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 40px 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-icon {
  width: 70px;
  height: 70px;
  background: #d4edda;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #28a745;
  margin: 0 auto 20px;
  font-weight: bold;
}

.modal-content h3 {
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.modal-content p {
  margin: 0 0 30px 0;
  font-size: 15px;
  color: #666;
  line-height: 1.5;
}

.modal-btn {
  width: 100%;
  padding: 14px;
  background: #e6cf9c;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-btn:hover {
  background: #d4bc85;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .page {
    padding: 20px 12px;
  }
  
  .form-box {
    padding: 20px;
  }
  
  .modal-content {
    padding: 30px 24px;
  }
}
</style>
