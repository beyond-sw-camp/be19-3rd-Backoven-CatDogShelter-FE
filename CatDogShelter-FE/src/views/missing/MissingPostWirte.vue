<template>
  <div class="missing-write-page">
    <section class="missing-write-card">
      <!-- 헤더 영역 -->
      <header class="card-head">
        <div class="head-top">
          <button class="back-btn" @click="goList">← 목록으로</button>
        </div>

        <h1 class="page-title">실종 신고 작성</h1>
        <p class="page-desc">
          실종된 반려동물이 무사히 돌아올 수 있도록 정확한 정보를 남겨주세요.
        </p>
      </header>

      <form class="form-area" @submit.prevent="submitPost">
        <!-- 제목 -->
        <div class="form-block">
          <label class="form-label">
            제목 <span class="req">*</span>
          </label>
          <input
            v-model.trim="form.title"
            class="input"
            required
            placeholder="예) 춘천에서 고양이를 잃어버렸습니다"
          />
        </div>

        <!-- 동물 정보 섹션 -->
        <fieldset class="fieldset">
          <legend class="fieldset-title">동물 정보</legend>

          <div class="two-col">
            <div class="col">
              <label class="form-label">반려동물 종류 <span class="req">*</span></label>
              <select v-model="form.animalType" class="input" required>
                <option value="">선택하세요</option>
                <option value="DOG">강아지</option>
                <option value="CAT">고양이</option>
                <option value="OTHER">기타</option>
              </select>
            </div>

            <div class="col">
              <label class="form-label">품종</label>
              <input
                v-model.trim="form.breed"
                class="input"
                placeholder="예: 말티즈 / 코숏 / 믹스 등"
              />
            </div>
          </div>

          <div class="two-col">
            <div class="col">
              <label class="form-label">반려동물 성별 <span class="req">*</span></label>
              <select v-model="form.gender" class="input" required>
                <option value="">선택하세요</option>
                <option value="MALE">수컷</option>
                <option value="FEMALE">암컷</option>
                <option value="UNKNOWN">모름</option>
              </select>
            </div>

            <div class="col">
              <label class="form-label">나이</label>
              <input
                v-model.trim="form.age"
                class="input"
                placeholder="예: 3살 / 2~3살 추정"
              />
            </div>
          </div>

          <div class="two-col">
            <div class="col">
              <label class="form-label">색상</label>
              <input
                v-model.trim="form.color"
                class="input"
                placeholder="예: 크림색, 검정+흰색 등"
              />
            </div>

            <div class="col">
              <label class="form-label">체중</label>
              <input
                v-model.trim="form.weight"
                class="input"
                placeholder="예: 약 4kg / 작고 마름"
              />
            </div>
          </div>

          <div class="two-col">
            <div class="col">
              <label class="form-label">등록 번호</label>
              <input
                v-model.trim="form.registerNo"
                class="input"
                placeholder="반려동물 등록번호 (있는 경우)"
              />
            </div>

            <div class="col">
              <label class="form-label">연락처 <span class="req">*</span></label>
              <input
                v-model.trim="form.contact"
                class="input"
                placeholder="010-0000-0000"
                required
              />
            </div>
          </div>

          <div class="two-col">
            <div class="col">
              <label class="form-label">실종된 시/도 <span class="req">*</span></label>
              <input
                v-model.trim="form.lostSido"
                class="input"
                placeholder="예: 강원도 / 서울특별시"
                required
              />
            </div>

            <div class="col">
              <label class="form-label">실종된 시/군/구 <span class="req">*</span></label>
              <input
                v-model.trim="form.lostSigungu"
                class="input"
                placeholder="예: 춘천시 / 강남구"
                required
              />
            </div>
          </div>

          <div class="form-block">
            <label class="form-label">실종 상세 위치</label>
            <input
              v-model.trim="form.lostDetailLocation"
              class="input"
              placeholder="예: 집 근처 공원, ○○아파트 103동 주변 등"
            />
          </div>

          <div class="form-block">
            <label class="form-label">반려동물 특징</label>
            <input
              v-model.trim="form.features"
              class="input"
              placeholder="예: 오른쪽 귀 끝이 접혀 있음 / 빨간 목줄 착용"
            />
          </div>
        </fieldset>

        <!-- 실종 일자 -->
        <fieldset class="fieldset">
          <legend class="fieldset-title">실종 일자</legend>

          <div class="date-grid">
            <div class="date-cell">
              <label class="form-label">년도 <span class="req">*</span></label>
              <input
                v-model.trim="form.lostYear"
                class="input"
                placeholder="2025"
                required
              />
            </div>

            <div class="date-cell">
              <label class="form-label">월 <span class="req">*</span></label>
              <input
                v-model.trim="form.lostMonth"
                class="input"
                placeholder="09"
                required
              />
            </div>

            <div class="date-cell">
              <label class="form-label">일 <span class="req">*</span></label>
              <input
                v-model.trim="form.lostDay"
                class="input"
                placeholder="10"
                required
              />
            </div>

            <div class="date-cell">
              <label class="form-label">시 <span class="req">*</span></label>
              <input
                v-model.trim="form.lostHour"
                class="input"
                placeholder="19"
                required
              />
            </div>

            <div class="date-cell">
              <label class="form-label">분 <span class="req">*</span></label>
              <input
                v-model.trim="form.lostMinute"
                class="input"
                placeholder="30"
                required
              />
            </div>

            <div class="date-cell">
              <label class="form-label">초</label>
              <input
                v-model.trim="form.lostSecond"
                class="input"
                placeholder="00"
              />
            </div>
          </div>
        </fieldset>

        <!-- 사진 업로드 -->
        <fieldset class="fieldset">
          <legend class="fieldset-title">사진 업로드</legend>

          <p class="hint">최대 5장까지 업로드 가능합니다.</p>

          <input
            type="file"
            class="input-file"
            @change="handleFileUpload"
            multiple
            accept="image/*"
          />

          <div class="preview-wrap" v-if="previews.length">
            <div
              v-for="(src, idx) in previews"
              :key="idx"
              class="preview-box"
            >
              <img :src="src" alt="preview" />
            </div>
          </div>
        </fieldset>

        <!-- 제출 버튼 -->
        <div class="submit-wrap">
          <button type="submit" class="submit-btn">
            실종 신고 등록
          </button>
        </div>
      </form>
    </section>

    <!-- 안내 영역 -->
    <section class="notice-card">
      <h2 class="notice-title">실종 신고 작성 안내</h2>
      <ul class="notice-list">
        <li>실종된 동물에 대한 정보는 최대한 정확하게 적어주세요.</li>
        <li>마지막으로 목격된 위치와 시간, 주변 환경을 구체적으로 적어주세요.</li>
        <li>
          특징(털 색, 목줄, 옷, 상처 등)은 찾는 데 정말 큰 도움이 됩니다. 가능한 자세하게
          기억해주세요.
        </li>
        <li>
          최근 촬영한 생활 사진을 여러 장 첨부하면 발견 시 동일 개체 여부를 확인하는 데 큰
          도움 됩니다.
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

// 폼 데이터 상태
const form = reactive({
  title: "",
  animalType: "",
  breed: "",
  gender: "",
  age: "",
  color: "",
  weight: "",
  registerNo: "",
  contact: "",
  lostSido: "",
  lostSigungu: "",
  lostDetailLocation: "",
  features: "",

  lostYear: "",
  lostMonth: "",
  lostDay: "",
  lostHour: "",
  lostMinute: "",
  lostSecond: "",

  // 서버에 보낼 메타
  userId: 1,
  sigunguId: 1,
})

const files = ref([])
const previews = ref([])

function goList() {
  router.push("/missing")
}

function handleFileUpload(e) {
  const selected = Array.from(e.target.files).slice(0, 5)
  files.value = selected

  previews.value = []
  selected.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      previews.value.push(ev.target.result)
    }
    reader.readAsDataURL(file)
  })
}

async function submitPost() {
  // 날짜 조합 (백엔드 형식 맞춰서 바꿔)
  const lostDateTime = `${form.lostYear}-${form.lostMonth}-${form.lostDay} ${form.lostHour}:${form.lostMinute}:${form.lostSecond || "00"}`

  const formData = new FormData()
  formData.append("title", form.title)
  formData.append("animalType", form.animalType)
  formData.append("breed", form.breed)
  formData.append("gender", form.gender)
  formData.append("age", form.age)
  formData.append("color", form.color)
  formData.append("weight", form.weight)
  formData.append("registerNo", form.registerNo)
  formData.append("contact", form.contact)
  formData.append("lostSido", form.lostSido)
  formData.append("lostSigungu", form.lostSigungu)
  formData.append("lostDetailLocation", form.lostDetailLocation)
  formData.append("features", form.features)
  formData.append("lostDateTime", lostDateTime)
  formData.append("userId", form.userId)
  formData.append("sigunguId", form.sigunguId)

  files.value.forEach((file) => {
    formData.append("files", file)
  })

  try {
    const res = await fetch("http://localhost:8000/post-service/missing-posts/regist", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) throw new Error("등록 실패")

    alert("실종 신고가 등록되었습니다.")
    router.push("/missing")
  } catch (err) {
    alert("등록 실패: " + err.message)
  }
}
</script>

<style scoped>
:root {
  --bg-page: #efe8dd;              /* 페이지 배경 (베이지) */
  --card-bg: #ffffff;              /* 카드 배경 (화이트) */
  --line-soft: rgba(0, 0, 0, 0.06); /* 연한 테두리 */
  --text-main: #2a1c10;            /* 메인 텍스트 (다크 브라운) */
  --text-dim: rgba(0, 0, 0, 0.55); /* 보조 텍스트 */
  --accent-brown: #8a6a48;         /* 포인트 브라운 */
  --accent-soft: #e8dcc7;          /* 연한 브라운 */
  --wave-soft-1: rgba(248, 241, 229, 0.8); /* 웨이브 효과 1 */
  --wave-soft-2: rgba(248, 241, 229, 0.4); /* 웨이브 효과 2 */
}

/* ==========================================
   전체 페이지 레이아웃
   ========================================== */
.missing-write-page {
  background-color: var(--bg-page);
  padding: 32px 16px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-main);
  gap: 24px;
  min-height: 100vh;
}

/* ==========================================
   메인 카드 (폼 영역)
   ========================================== */
.missing-write-card {
  width: 100%;
  max-width: 760px;
  background-color: #FFF;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--line-soft);
  padding: 24px 24px 32px;
}

/* ==========================================
   헤더 영역
   ========================================== */
.card-head {
  text-align: left;
  margin-bottom: 24px;
}

.head-top {
  margin-bottom: 12px;
}

.back-btn {
  font-size: 13px;
  background: #fff;
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  padding: 6px 10px;
  color: var(--text-main);
  line-height: 1.2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #f9f9f9;
  border-color: var(--accent-brown);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
}

.page-desc {
  font-size: 13px;
  color: var(--text-dim);
  line-height: 1.4;
}

/* ==========================================
   폼 영역
   ========================================== */
.form-area {
  width: 100%;
}

/* 필드셋 */
.fieldset {
  border: 0;
  padding: 20px 0 0;
  margin: 0 0 24px;
  border-top: 1px solid var(--line-soft);
  font-size:16px;
}

.fieldset-title {
  font-size: 17px;
  font-weight: 600;
  color: #6e5336;
  margin-bottom: 12px;
  line-height: 1.3;
}

/* ==========================================
   폼 요소 (Input, Select 등)
   ========================================== */

/* 라벨 */
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 6px;
  line-height: 1.3;
}

/* 필수 표시 */
.req {
  color: #c33;
  font-weight: 600;
  margin-left: 2px;
  font-size: 13px;
}

/* Input/Select 공통 스타일 */
.input {
  width: 100%;
  background-color: #fafafa;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
  padding: 11px 12px;
  color: var(--text-main);
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.input::placeholder {
  color: rgba(0, 0, 0, 0.35);
}

.input:focus {
  outline: 0;
  border-color: var(--accent-brown);
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(138, 106, 72, 0.12);
}

/* Select 화살표 커스텀 */
select.input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232a1c10' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

/* ==========================================
   레이아웃 - 폼 블록
   ========================================== */

/* 1열 블록 */
.form-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

/* 2열 그리드 */
.two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.col {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* 날짜 입력 그리드 (6칸) */
.date-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.date-cell {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ==========================================
   파일 업로드 & 이미지 미리보기
   ========================================== */
.hint {
  font-size: 13px;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.input-file {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-main);
  cursor: pointer;
}

/* 이미지 미리보기 영역 */
.preview-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.preview-box {
  width: 110px;
  height: 110px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background-color: #fff;
  overflow: hidden;
}

.preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ==========================================
   제출 버튼
   ========================================== */
.submit-wrap {
  padding-top: 0;
  border-top: 1px solid var(--line-soft);
  margin-top: 24px;
  background-color: #F1D099;
}

.submit-btn {
  width: 100%;
  background-color: var(--accent-soft);
  color: var(--text-main);
  font-weight: 600;
  padding: 14px 16px;
  font-size: 15px;
  line-height: 1.4;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.submit-btn:hover {
  background-color: #e1d2b7;
}

.submit-btn:active {
  transform: scale(0.98);
}

/* ==========================================
   안내 카드 (하단 베이지 영역)
   ========================================== */
.notice-card {
  width: 100%;
  max-width: 760px;
  background-color: #f5eddc;
  border-radius: 12px;
  border: 1px solid var(--line-soft);
  padding: 20px 24px 24px;
  color: var(--text-main);
  font-size: 14px;
  line-height: 1.5;
}

.notice-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--accent-brown);
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  position: relative;
  padding-left: 16px;
}

.notice-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--accent-brown);
}

.notice-list li + li {
  margin-top: 6px;
}

/* ==========================================
   웨이브 효과 (선택사항)
   ========================================== */
.wave-back {
  position: absolute;
  width: 100%;
  background-image: radial-gradient(
    circle at 50% 10%,
    var(--wave-soft-2) 0%,
    rgba(248, 241, 229, 0) 70%
  );
  height: 90px;
  bottom: 20px;
  animation: waveBackMove 12s linear infinite;
  pointer-events: none;
}

.wave-front {
  position: absolute;
  width: 100%;
  height: 60px;
  bottom: 10px;
  background-image: radial-gradient(
    circle at 50% 0%,
    var(--wave-soft-1) 0%,
    rgba(248, 241, 229, 0) 75%
  );
  animation: waveFrontMove 6s linear infinite;
  mix-blend-mode: normal;
  opacity: 0.9;
  pointer-events: none;
}

@keyframes waveBackMove {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes waveFrontMove {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* ==========================================
   반응형 디자인
   ========================================== */
@media (max-width: 640px) {
  .missing-write-page {
    padding: 20px 12px 48px;
  }

  .missing-write-card,
  .notice-card {
    padding: 20px 16px 24px;
    border-radius: 10px;
  }

  .page-title {
    font-size: 18px;
  }

  .page-desc {
    font-size: 12px;
  }

  /* 2열을 1열로 변경 */
  .two-col {
    grid-template-columns: 1fr;
  }

  /* 날짜 그리드를 3열로 변경 */
  .date-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .fieldset-title {
    font-size: 16px;
    color:#8a6a48;
  }

  .submit-btn {
    font-size: 14px;
    padding: 12px 16px;
  }
}

@media (max-width: 480px) {
  .missing-write-page {
    padding: 16px 8px 40px;
  }

  .missing-write-card,
  .notice-card {
    padding: 16px 12px 20px;
  }

  .page-title {
    font-size: 17px;
  }

  .date-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .preview-box {
    width: 90px;
    height: 90px;
  }
}

/* ==========================================
   다크모드 지원 (선택사항)
   ========================================== */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-page: #1a1510;
    --card-bg: #2a2520;
    --line-soft: rgba(255, 255, 255, 0.1);
    --text-main: #e8dcc7;
    --text-dim: rgba(255, 255, 255, 0.55);
    --accent-brown: #b8956f;
    --accent-soft: #3a3025;
  }

  .input {
    background-color: #F3F3F5;
  }

  .input:focus {
    background-color: rgb(203, 188, 172);
  }

  .notice-card {
    background-color: #FFF8ED;
  }
}
</style>