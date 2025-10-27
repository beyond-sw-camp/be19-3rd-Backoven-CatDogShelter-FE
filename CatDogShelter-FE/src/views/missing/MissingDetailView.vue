<template>
  <main class="missing-write-page">
    <section class="write-container">
      <!-- 상단 이동 -->
      <button class="back-to-list" @click="goList">← 목록으로</button>

      <!-- 타이틀 -->
      <h1 class="page-title">실종 신고 작성</h1>
      <p class="page-desc">
        실종된 반려동물이 무사히 돌아올 수 있도록 정확한 정보를 남겨주세요.
      </p>

      <!-- 폼 시작 -->
      <form class="write-form" @submit.prevent="handleSubmit">
        <!-- ===== 제목 ===== -->
        <div class="form-block">
          <label class="form-label">
            제목 <span class="req">*</span>
          </label>
          <input
            v-model.trim="form.title"
            class="text-input full"
            placeholder="예) 춘천에서 고양이를 잃어버렸습니다"
            required
          />
        </div>

        <!-- ===== 동물 정보 섹션 ===== -->
        <h2 class="section-head">동물 정보</h2>

        <div class="two-col-row">
          <div class="col">
            <label class="form-label">
              반려동물 종류 <span class="req">*</span>
            </label>
            <select v-model="form.animalType" class="select-input" required>
              <option value="" disabled>선택하세요</option>
              <option value="DOG">강아지</option>
              <option value="CAT">고양이</option>
            </select>
          </div>

          <div class="col">
            <label class="form-label">품종</label>
            <input
              v-model.trim="form.breed"
              class="text-input"
              placeholder="예: 말티즈 / 코숏 / 믹스 등"
            />
          </div>
        </div>

        <div class="two-col-row">
          <div class="col">
            <label class="form-label">
              반려동물 성별 <span class="req">*</span>
            </label>
            <select v-model="form.gender" class="select-input" required>
              <option value="" disabled>선택하세요</option>
              <option value="MALE">수컷</option>
              <option value="FEMALE">암컷</option>
              <option value="UNKNOWN">모름</option>
            </select>
          </div>

          <div class="col">
            <label class="form-label">나이</label>
            <input
              v-model.trim="form.age"
              class="text-input"
              placeholder="예: 3살 / 2~3살 추정"
            />
          </div>
        </div>

        <div class="two-col-row">
          <div class="col">
            <label class="form-label">색상</label>
            <input
              v-model.trim="form.color"
              class="text-input"
              placeholder="예: 크림색, 검정+흰색 등"
            />
          </div>

          <div class="col">
            <label class="form-label">체중</label>
            <input
              v-model.trim="form.weight"
              class="text-input"
              placeholder="예: 약 4kg / 작고 마름"
            />
          </div>
        </div>

        <div class="two-col-row">
          <div class="col">
            <label class="form-label">등록 번호</label>
            <input
              v-model.trim="form.registrationNum"
              class="text-input"
              placeholder="반려동물 등록번호 (있는 경우)"
            />
          </div>

          <div class="col">
            <label class="form-label">
              연락처 <span class="req">*</span>
            </label>
            <input
              v-model.trim="form.contact"
              class="text-input"
              placeholder="010-0000-0000"
              required
            />
          </div>
        </div>

        <div class="two-col-row">
          <div class="col">
            <label class="form-label">
              실종된 시/도 <span class="req">*</span>
            </label>
            <input
              v-model.trim="form.sido"
              class="text-input"
              placeholder="예: 강원도 / 서울특별시"
              required
            />
          </div>

          <div class="col">
            <label class="form-label">
              실종된 시/군/구 <span class="req">*</span>
            </label>
            <input
              v-model.trim="form.sigungu"
              class="text-input"
              placeholder="예: 춘천시 / 강남구"
              required
            />
          </div>
        </div>

        <div class="form-block">
          <label class="form-label">실종 상세 위치</label>
          <input
            v-model.trim="form.detailAddress"
            class="text-input full"
            placeholder="예: 집 근처 공원, ○○아파트 103동 주변 등"
          />
        </div>

        <div class="form-block">
          <label class="form-label">반려동물 특징</label>
          <textarea
            v-model.trim="form.feature"
            class="textarea-input"
            placeholder="예: 오른쪽 귀 끝이 접혀 있음 / 빨간 목줄 착용"
          />
        </div>

        <!-- ===== 실종 일자/시간 ===== -->
        <h2 class="section-head">실종 일자</h2>

        <div class="lostdate-row">
          <div class="lostdate-field">
            <label class="form-label">년도 <span class="req">*</span></label>
            <input
              v-model.trim="lostDate.year"
              class="text-input"
              required
            />
          </div>

          <div class="lostdate-field">
            <label class="form-label">월 <span class="req">*</span></label>
            <input
              v-model.trim="lostDate.month"
              class="text-input"
              required
            />
          </div>

          <div class="lostdate-field">
            <label class="form-label">일 <span class="req">*</span></label>
            <input
              v-model.trim="lostDate.day"
              class="text-input"
              required
            />
          </div>

          <div class="lostdate-field">
            <label class="form-label">시 <span class="req">*</span></label>
            <input
              v-model.trim="lostDate.hour"
              class="text-input"
              required
            />
          </div>

          <div class="lostdate-field">
            <label class="form-label">분 <span class="req">*</span></label>
            <input
              v-model.trim="lostDate.minute"
              class="text-input"
              required
            />
          </div>

          <div class="lostdate-field">
            <label class="form-label">초</label>
            <input
              v-model.trim="lostDate.second"
              class="text-input"
              placeholder="00"
            />
          </div>
        </div>

        <!-- ===== 상세 설명 (본문 내용) ===== -->
        <div class="form-block">
          <label class="form-label">상세 상황 설명</label>
          <textarea
            v-model.trim="form.content"
            class="textarea-input"
            placeholder="실종 상황, 마지막 목격 정보 등 자세히 적어주세요."
          />
        </div>

        <!-- ===== 파일 업로드 ===== -->
        <h2 class="section-head">사진 업로드</h2>

        <p class="upload-desc">최대 5장까지 업로드 가능합니다.</p>

        <div class="form-block">
          <input
            type="file"
            multiple
            accept="image/*"
            @change="onFilesChange"
          />
          <div class="file-preview-list" v-if="previewUrls.length">
            <div
              v-for="(url, idx) in previewUrls"
              :key="idx"
              class="file-preview-item"
            >
              <img :src="url" alt="preview" />
            </div>
          </div>
        </div>

        <!-- ===== 버튼 ===== -->
        <button class="submit-btn" type="submit" :disabled="submitting">
          {{ submitting ? '등록 중...' : '실종 신고 등록' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 작성 폼 데이터
const form = reactive({
  title: '',
  animalType: '', // DOG / CAT
  breed: '',
  gender: '', // MALE / FEMALE / UNKNOWN
  age: '',
  color: '',
  weight: '',
  registrationNum: '',
  contact: '',
  sido: '',
  sigungu: '',
  detailAddress: '',
  feature: '',
  content: '' // 상세 상황 설명
})

// 날짜/시간 입력 파츠
const lostDate = reactive({
  year: '2025',
  month: '09',
  day: '10',
  hour: '19',
  minute: '30',
  second: '00'
})

// 업로드 파일들
const files = ref([])           // 실제 File 객체 리스트
const previewUrls = ref([])     // 미리보기용 blob url

const submitting = ref(false)

// 목록으로 돌아가기
function goList() {
  router.push({ name: 'MissingView' })
}

function onFilesChange(e) {
  const selected = Array.from(e.target.files || [])

  // 최대 5장 제한
  const merged = [...files.value, ...selected].slice(0, 5)
  files.value = merged

  // 미리보기 URL 갱신
  previewUrls.value = files.value.map(f => URL.createObjectURL(f))
}

// 날짜 문자열 합치기
function buildLostDateTime() {
  // 예: "2025-09-10 19:30:00"
  const y = lostDate.year || '0000'
  const m = lostDate.month || '00'
  const d = lostDate.day || '00'
  const hh = lostDate.hour || '00'
  const mm = lostDate.minute || '00'
  const ss = lostDate.second || '00'

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

async function handleSubmit() {
  if (submitting.value) return

  // 기본 필수값 체크(프론트 1차)
  if (!form.title || !form.animalType || !form.gender || !form.contact || !form.sido || !form.sigungu) {
    alert('필수 항목을 입력해주세요.')
    return
  }

  submitting.value = true
  try {
    // 서버에 보낼 FormData 구성
    const fd = new FormData()

    // 글 정보
    fd.append('title', form.title)
    fd.append('animalType', form.animalType) // DOG / CAT
    fd.append('breed', form.breed)
    fd.append('gender', form.gender) // MALE / FEMALE / UNKNOWN
    fd.append('age', form.age)
    fd.append('color', form.color)
    fd.append('weight', form.weight)
    fd.append('registrationNum', form.registrationNum)
    fd.append('contact', form.contact)
    fd.append('sido', form.sido)
    fd.append('sigungu', form.sigungu)
    fd.append('detailAddress', form.detailAddress)
    fd.append('feature', form.feature)
    fd.append('content', form.content)

    // 실종 시간
    fd.append('lostDateTime', buildLostDateTime())

    // 파일들
    files.value.forEach((file, idx) => {
      // 백엔드 컨트롤러에서 @RequestPart("files") List<MultipartFile> files 이런 식으로 받는다고 가정
      fd.append('files', file, file.name)
    })

    // JWT 토큰 (세션스토리지에 있다고 했지?)
    const token = sessionStorage.getItem('accessToken')

    // 실제 요청 (엔드포인트는 프로젝트에 맞게 수정)
    const resp = await fetch('http://localhost:8000/post-service/missing-posts', {
      method: 'POST',
      headers: {
        // FormData 쓸 땐 Content-Type 자동 세팅되니까 넣지 말 것
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: fd
    })

    if (!resp.ok) {
      console.error('실종 신고 등록 실패 status=', resp.status)
      const errText = await resp.text().catch(() => '')
      console.error('response text:', errText)
      alert('등록에 실패했습니다. 서버 상태를 확인해주세요.')
      submitting.value = false
      return
    }

    // 성공 후 동작
    alert('등록이 완료되었습니다.')
    router.push({ name: 'MissingView' })
  } catch (err) {
    console.error('실종 신고 등록 중 오류:', err)
    alert('오류가 발생했습니다.')
    submitting.value = false
  }
}
</script>

<style scoped>
.missing-write-page {
  display: flex;
  justify-content: center;
  padding: 24px 16px 80px;
  background-color: #fafafa;
  color: #222;
  font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Inter", system-ui, sans-serif;
}

.write-container {
  width: 100%;
  max-width: 960px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.04);
  padding: 24px;
  border: 1px solid #eee;
}

.back-to-list {
  background: none;
  border: none;
  color: #000;
  font-size: 14px;
  line-height: 1.4;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin: 0 0 8px;
  line-height: 1.4;
}

.page-desc {
  font-size: 14px;
  color: #555;
  margin: 0 0 24px;
  line-height: 1.5;
}

.write-form {
  border: 1px solid #eee;
  background-color: #fcfcfc;
  border-radius: 12px;
  padding: 16px;
}

.section-head {
  font-size: 18px;
  font-weight: 600;
  color: #6b4b2a;
  margin: 24px 0 16px;
  line-height: 1.4;
  border-top: 1px solid #eadfcf;
  padding-top: 16px;
}

.req {
  color: #c62828;
  font-weight: 500;
  margin-left: 2px;
}

.form-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #3d2a12;
  margin-bottom: 8px;
  line-height: 1.4;
}

.text-input,
.select-input,
.textarea-input {
  width: 100%;
  background-color: #f5f5f5;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.4;
  color: #222;
  outline: none;
  font-family: inherit;
}
.text-input:focus,
.select-input:focus,
.textarea-input:focus {
  background-color: #fff;
  border-color: #bfa67a;
  box-shadow: 0 0 0 3px rgba(191,166,122,0.2);
}

.full {
  width: 100%;
}

.textarea-input {
  min-height: 80px;
  resize: vertical;
}

.two-col-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}
.col {
  flex: 1 1 320px;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.lostdate-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.lostdate-field {
  flex: 0 0 90px;
  display: flex;
  flex-direction: column;
}

.upload-desc {
  font-size: 13px;
  color: #444;
  margin: 0 0 8px;
}

.file-preview-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.file-preview-item {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
  background: #fafafa;
  flex-shrink: 0;
}
.file-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.submit-btn {
  width: 100%;
  display: block;
  background-color: #dcbf7d;
  border: 1px solid #c2a564;
  color: #2e1e00;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  text-align: center;
  line-height: 1.4;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>