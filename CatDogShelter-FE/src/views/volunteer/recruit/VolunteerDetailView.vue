<template>
  <section class="detail-section">
    <div class="detail-container">
      <!-- 뒤로가기 버튼 -->
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span> 목록으로
      </button>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">데이터를 불러오는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="error-container">
        <p class="error-text">❌ {{ error }}</p>
        <button class="retry-btn" @click="fetchVolunteerDetail">다시 시도</button>
      </div>

      <!-- 데이터 표시 -->
      <div v-else-if="volunteer" class="detail-content">
        <!-- 왼쪽: 상세 정보 -->
        <div class="detail-left">
          <div class="detail-box">
            <!-- 헤더 -->
            <div class="detail-header">
              <div class="header-badges">
                <span class="shelter-badge">{{ volunteer.shelter }}</span>
                <span class="status-badge" :class="volunteer.statusClass">{{ volunteer.status }}</span>
              </div>
              <h2 class="detail-title">{{ volunteer.title }}</h2>
              <p class="detail-desc">{{ volunteer.desc }}</p>
            </div>

            <!-- 이미지 -->
            <div class="detail-image-container">
              <img :src="getImageUrl(volunteer.image)" alt="봉사활동 이미지" class="detail-image" />
            </div>

            <!-- 상세 정보 그리드 -->
            <div class="info-section">
              <h3 class="info-section-title">봉사 정보</h3>
              <div class="info-grid-detail">
                <div class="info-item-detail">
                  <img class="info-icon-detail" :src="calendarIcon" alt="Calendar icon" />
                  <div class="info-text-detail">
                    <p class="info-label-detail">활동일</p>
                    <p class="info-value-detail">{{ volunteer.date }}</p>
                  </div>
                </div>
                <div class="info-item-detail">
                  <img class="info-icon-detail" :src="clockIcon" alt="Clock icon" />
                  <div class="info-text-detail">
                    <p class="info-label-detail">봉사시간</p>
                    <p class="info-value-detail">{{ volunteer.time }}</p>
                  </div>
                </div>
                <div class="info-item-detail">
                  <img class="info-icon-detail" :src="locationIcon" alt="Location icon" />
                  <div class="info-text-detail">
                    <p class="info-label-detail">장소</p>
                    <p class="info-value-detail">{{ volunteer.location }}</p>
                  </div>
                </div>
                <div class="info-item-detail">
                  <img class="info-icon-detail" :src="peopleIcon" alt="People icon" />
                  <div class="info-text-detail">
                    <p class="info-label-detail">모집인원</p>
                    <p class="info-value-detail">{{ volunteer.participants }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 상세 설명 -->
            <div class="description-section">
              <h3 class="description-title">상세 설명</h3>
              <div class="description-content">
                <p>{{ volunteer.detailDesc }}</p>
              </div>
            </div>

            <!-- 신청 조건 -->
            <div class="requirements-section">
              <h3 class="requirements-title">신청 조건</h3>
              <ul class="requirements-list">
                <li v-for="(req, index) in volunteer.requirements" :key="index">{{ req }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 신청 박스 -->
        <div class="detail-right">
          <div class="apply-sidebar">
            <div class="apply-info">
              <h3 class="apply-title">봉사 신청</h3>
              <div class="apply-status">
                <span class="apply-status-label">모집 상태</span>
                <span class="apply-status-value" :class="volunteer.statusClass">{{ volunteer.status }}</span>
              </div>
              <div class="apply-date">
                <img class="apply-date-icon" :src="calendarIcon" alt="Calendar icon" />
                <div>
                  <p class="apply-date-label">활동일</p>
                  <p class="apply-date-value">{{ volunteer.date }}</p>
                </div>
              </div>
              <div class="apply-participants">
                <img class="participants-icon" :src="peopleIcon" alt="People icon" />
                <div>
                  <p class="participants-label">모집 현황</p>
                  <p class="participants-value">{{ volunteer.participants }}</p>
                </div>
              </div>
            </div>
            
            <button class="apply-btn-sidebar" @click="openModal">
              <span class="heart-icon">♡</span>
              봉사 신청하기
            </button>
            
            <p class="register-info">등록일: {{ volunteer.registerDate }}</p>
          </div>

          <!-- 관련 봉사활동 -->
          <div class="related-box">
            <h3 class="related-title">관련 봉사활동</h3>
            <ul class="related-list">
              <li v-for="(item, index) in relatedVolunteers" :key="index" class="related-item" @click="goToDetail(item.id)">
                <img :src="getImageUrl(item.image)" alt="관련 봉사" class="related-thumb" />
                <div class="related-info">
                  <p class="related-item-title">{{ item.title }}</p>
                  <p class="related-item-date">{{ item.date }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
    
    <!-- 봉사 신청 모달 -->
    <ApplyModal 
      :isOpen="isModalOpen"
      @close="closeModal"
      @confirm="handleConfirm"
    />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import calendarIcon from '@/assets/달력아이콘.svg'
import ApplyModal from '@/views/volunteer/recruit/ApplyModal.vue'
import clockIcon from '@/assets/시계아이콘.svg'
import locationIcon from '@/assets/위치아이콘.svg'
import peopleIcon from '@/assets/인원아이콘.svg'

const router = useRouter()
const route = useRoute()

// 이미지 경로를 실제 이미지 URL로 변환하는 함수
const getImageUrl = (filePath) => {
  if (!filePath) return ''
  
  // @/assets/volunteer/이미지.jpeg -> /volunteer/이미지.jpeg
  const fileName = filePath.split('/').pop() // 파일명만 추출
  return `/volunteer/${fileName}`
}

// route params에서 id 가져오기
const volunteerId = computed(() => parseInt(route.params.id))

// 데이터 상태
const volunteer = ref(null)
const relatedVolunteers = ref([])
const loading = ref(true)
const error = ref(null)
// 모달 상태
const isModalOpen = ref(false)

// JSON Server에서 데이터 가져오기
const fetchVolunteerDetail = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 전체 volunteer 데이터 가져오기
    const response = await fetch('http://localhost:8080/volunteer')
    
    if (!response.ok) {
      throw new Error('데이터를 불러오는데 실패했습니다.')
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      const volunteerData = data[0]
      const allList = volunteerData.list || []
      
      // 해당 id의 데이터 찾기
      const foundItem = allList.find(item => item.id === volunteerId.value)
      
      if (foundItem) {
        // 상세 페이지용 데이터 구조로 변환
        volunteer.value = {
          id: foundItem.id,
          shelter: foundItem.companyName,
          status: foundItem.deadline,
          statusClass: foundItem.deadlineClass,
          title: foundItem.title,
          desc: foundItem.content || '봉사활동 상세 설명입니다.',
          image: foundItem.file || '@/assets/volunteer/보호소_봉사모집4.jpeg',
          date: foundItem.startDate,
          time: foundItem.time,
          location: foundItem.detailAddress,
          participants: foundItem.numberOfPeople,
          registerDate: foundItem.createdAt || '2025-10-10',
          detailDesc: foundItem.detailDesc || `${foundItem.companyName}에서 봉사자를 모집합니다.

봉사 내용:
- 유기동물 산책 및 놀이 활동
- 보호소 청소 및 정리
- 사료 및 물 급여
- 유기동물 건강 체크 보조

봉사자분들께는 간단한 다과가 제공되며, 봉사 활동 후 1365 자원봉사 포털에 봉사시간이 인증됩니다.

많은 관심과 참여 부탁드립니다!`,
          requirements: foundItem.requirements || [
            '만 18세 이상',
            '동물 알레르기가 없으신 분',
            '책임감 있게 활동 가능하신 분',
            '사전 오리엔테이션 참석 필수'
          ]
        }
        
        // 관련 봉사활동 (현재 항목 제외한 다른 항목들)
        relatedVolunteers.value = allList
          .filter(item => item.id !== volunteerId.value)
          .slice(0, 3)
          .map(item => ({
            id: item.id,
            title: item.title,
            date: item.startDate,
            image: item.file || '@/assets/volunteer/보호소_봉사모집4.jpeg'
          }))
        
        console.log('상세 데이터 로드 성공:', volunteer.value)
      } else {
        throw new Error('해당 봉사활동을 찾을 수 없습니다.')
      }
    }
  } catch (err) {
    console.error('데이터를 불러오는데 실패했습니다:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(() => {
  fetchVolunteerDetail()
})

// id가 변경되면 데이터 다시 가져오기
watch(volunteerId, () => {
  fetchVolunteerDetail()
})

function goBack() {
  router.push('/volunteer')
}

function goToDetail(id) {
  router.push(`/volunteer/detail/${id}`)
}

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function handleConfirm() {
  console.log('봉사 신청 완료!')
  // TODO: 실제 API 호출 로직 추가
  // 예: await applyVolunteer(volunteer.value.id)
  alert('봉사 신청이 완료되었습니다!')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.detail-section {
  background: #f5f0e8;
  min-height: 100vh;
  padding: 40px 20px;
}

.detail-container {
  max-width: 1400px;
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
  font-size: 0.9rem;
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

/* 로딩 컨테이너 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f0e8dc;
  border-top: 5px solid #f0b762;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  color: #6b5744;
  font-weight: 600;
}

/* 에러 컨테이너 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 15px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.error-text {
  font-size: 1.2rem;
  color: #d32f2f;
  font-weight: 600;
  margin: 0;
}

.retry-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 183, 98, 0.4);
}

/* 컨텐츠 레이아웃 */
.detail-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* 왼쪽 영역 */
.detail-left {
  flex: 2;
}

.detail-box {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 헤더 */
.detail-header {
  margin-bottom: 24px;
}

.header-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.shelter-badge {
  padding: 6px 14px;
  background: #f5f0e8;
  color: #6b5744;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.recruiting {
  background: #d4f4dd;
  color: #2d5016;
}

.status-badge.urgent {
  background: #ffebee;
  color: #c62828;
}

.detail-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.detail-desc {
  font-size: 1rem;
  color: #6b5744;
  line-height: 1.6;
  margin: 0;
}

/* 이미지 */
.detail-image-container {
  margin-bottom: 32px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.detail-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

/* 정보 섹션 */
.info-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0e8dc;
}

.info-section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 20px 0;
}

.info-grid-detail {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item-detail {
  background: #f9f7f4;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon-detail,
.apply-date-icon,
.participants-icon {
  display: inline-block;
  flex-shrink: 0;
}

.info-icon-detail {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.info-text-detail {
  flex: 1;
}

.info-label-detail {
  font-size: 0.8rem;
  color: #8b7355;
  margin: 0 0 4px 0;
}

.info-value-detail {
  font-size: 1rem;
  font-weight: 600;
  color: #3d2f1f;
  margin: 0;
}

/* 상세 설명 */
.description-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0e8dc;
}

.description-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 16px 0;
}

.description-content {
  font-size: 1rem;
  color: #6b5744;
  line-height: 1.8;
  white-space: pre-line;
}

/* 신청 조건 */
.requirements-section {
  margin-bottom: 0;
}

.requirements-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 16px 0;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirements-list li {
  padding: 12px 16px;
  background: #f9f7f4;
  border-radius: 8px;
  margin-bottom: 8px;
  color: #6b5744;
  font-size: 0.95rem;
  position: relative;
  padding-left: 36px;
}

.requirements-list li::before {
  content: '✓';
  position: absolute;
  left: 16px;
  color: #90ee90;
  font-weight: 700;
}

/* 오른쪽 영역 */
.detail-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 20px;
}

/* 신청 사이드바 */
.apply-sidebar {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.apply-info {
  margin-bottom: 20px;
}

.apply-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 16px 0;
}

.apply-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9f7f4;
  border-radius: 12px;
  margin-bottom: 12px;
}

.apply-status-label {
  font-size: 0.9rem;
  color: #6b5744;
}

.apply-status-value {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
}

.apply-status-value.recruiting {
  background: #d4f4dd;
  color: #2d5016;
}

.apply-date,
.apply-participants {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f9f7f4;
  border-radius: 12px;
  margin-bottom: 12px;
}

.apply-date-icon,
.participants-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.apply-date-label,
.participants-label {
  font-size: 0.8rem;
  color: #8b7355;
  margin: 0 0 4px 0;
}

.apply-date-value,
.participants-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #3d2f1f;
  margin: 0;
}

.apply-btn-sidebar {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(240, 183, 98, 0.4);
  transition: all 0.3s;
  margin-bottom: 12px;
}

.apply-btn-sidebar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 183, 98, 0.5);
}

.heart-icon {
  font-size: 1.2rem;
}

.register-info {
  text-align: center;
  font-size: 0.85rem;
  color: #8b7355;
  margin: 0;
}

/* 관련 봉사활동 */
.related-box {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.related-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 16px 0;
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.related-item:hover {
  background: #f9f7f4;
}

.related-thumb {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.related-info {
  flex: 1;
}

.related-item-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #3d2f1f;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-item-date {
  font-size: 0.8rem;
  color: #8b7355;
  margin: 0;
}

/* 반응형 */
@media (max-width: 1024px) {
  .detail-content {
    flex-direction: column;
  }

  .detail-right {
    position: static;
  }

  .info-grid-detail {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .detail-box {
    padding: 20px;
  }

  .detail-title {
    font-size: 1.4rem;
  }

  .detail-image {
    height: 250px;
  }
}
</style>