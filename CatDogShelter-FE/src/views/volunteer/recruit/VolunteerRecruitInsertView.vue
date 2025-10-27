<template>
  <section class="insert-section">
    <div class="insert-container">
      <h2 class="insert-title">🐾 봉사 모집글 등록</h2>

      <form class="insert-form" @submit.prevent="submitRecruit">
        <div class="form-group">
          <label for="companyName">보호소 이름</label>
          <input
            id="companyName"
            v-model="recruit.companyName"
            type="text"
            placeholder="보호소 이름을 입력하세요"
            required
          />
        </div>

        <div class="form-group">
          <label for="title">모집 제목</label>
          <input
            id="title"
            v-model="recruit.title"
            type="text"
            placeholder="모집 제목을 입력하세요"
            required
          />
        </div>

        <div class="form-group">
          <label for="content">모집 내용</label>
          <textarea
            id="content"
            v-model="recruit.content"
            rows="6"
            placeholder="모집 내용을 입력하세요"
            required
          ></textarea>
        </div>

        <div class="form-group-row">
          <div class="form-group half">
            <label for="sido">시/도</label>
            <input id="sido" v-model="recruit.sido" type="text" placeholder="예: 서울특별시" />
          </div>
          <div class="form-group half">
            <label for="sigungu">시/군/구</label>
            <input id="sigungu" v-model="recruit.sigungu" type="text" placeholder="예: 마포구" />
          </div>
        </div>

        <div class="form-group-row">
          <div class="form-group half">
            <label for="time">활동 시간</label>
            <input id="time" v-model="recruit.time" type="text" placeholder="예: 3시간" />
          </div>
          <div class="form-group half">
            <label for="startcreatedAt">활동일</label>
            <input id="startcreatedAt" v-model="recruit.startcreatedAt" type="date" />
          </div>
        </div>

        <div class="form-group">
          <label for="numberOfPeople">모집 인원</label>
          <input
            id="numberOfPeople"
            v-model="recruit.numberOfPeople"
            type="text"
            placeholder="예: 5명"
          />
        </div>

        <div class="form-group">
          <label for="file">대표 이미지</label>
          <input id="file" type="file" @change="handleFileUpload" />
        </div>

        <div class="button-group">
          <button type="submit" class="submit-btn">등록하기</button>
          <button type="button" class="cancel-btn" @click="goBack">취소</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const recruit = ref({
  companyName: '',
  title: '',
  content: '',
  sido: '',
  sigungu: '',
  time: '',
  startcreatedAt: '',
  numberOfPeople: '',
  file: null
})

const handleFileUpload = (e) => {
  recruit.value.file = e.target.files[0]?.name || null
}

const submitRecruit = async () => {
  const newRecruit = {
    ...recruit.value,
    deadline: '모집중',
    deadlineClass: 'recruiting',
    createdAt: new Date().toISOString().split('T')[0],
    file: recruit.value.file ? `@/assets/volunteer/${recruit.value.file}` : null
  }

  try {
    const response = await fetch('http://localhost:8080/volunteer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecruit)
    })
    if (!response.ok) throw new Error('서버 응답 오류')

    alert('봉사 모집글이 등록되었습니다!')
    router.push('/volunteer')
  } catch (error) {
    console.error(error)
    alert('등록 중 오류가 발생했습니다.')
  }
}

const goBack = () => router.back()
</script>

<style scoped>
/* 🎨 VolunteerReviewInsertView의 CSS 그대로 적용 */
.insert-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 60px 20px;
}

.insert-container {
  width: 680px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 50px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.insert-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 40px;
  text-align: center;
}

.insert-form {
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.form-group-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.form-group.half {
  flex: 1;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #444;
  font-size: 15px;
}

input,
textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 15px;
  background-color: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
textarea:focus {
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.25);
  outline: none;
}

textarea {
  resize: none;
  line-height: 1.6;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 35px;
}

.submit-btn,
.cancel-btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.submit-btn {
  background-color: #4caf50;
  color: #fff;
  box-shadow: 0 3px 6px rgba(76, 175, 80, 0.3);
}

.submit-btn:hover {
  background-color: #43a047;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.35);
}

.cancel-btn {
  background-color: #f1f1f1;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}
</style>
