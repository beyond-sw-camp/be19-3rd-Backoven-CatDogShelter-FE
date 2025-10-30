<template>
  <section class="mine-section">
    <div class="mine-container">
      <!-- 좌측: 내 봉사 신청 내역 -->
      <div class="mine-left">
        <div class="mine-box">
          <h3 class="mine-title">내 봉사 신청 내역</h3>

          <ul class="activity-list">
            <li v-for="activity in activities" :key="activity.id" class="activity-item">
              <div class="activity-content">
                <div class="activity-header">
                  <span class="activity-status" :class="activity.statusClass">{{ activity.status }}</span>
                  <button class="cancel-btn">신청 취소</button>
                </div>
                <h4 class="activity-title">{{ activity.title }}</h4>
                <p class="activity-location">{{ activity.location }}</p>
                <div class="activity-details">
                  <span class="activity-date">
                    <span class="activity-icon">📅</span> {{ activity.date }}
                  </span>
                  <span class="activity-time">
                    <span class="activity-icon">⏰</span> {{ activity.time }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 우측: 나의 봉사 통계 & 내가 작성한 후기 -->
      <div class="mine-right">
        <div class="stats-box">
          <h3 class="stats-title">나의 봉사 통계</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <p class="stat-label">누적 봉사시간</p>
              <p class="stat-value">24시간</p>
            </div>
            <div class="stat-card">
              <p class="stat-label">봉사 횟수</p>
              <p class="stat-value">8회</p>
            </div>
            <div class="stat-card">
              <p class="stat-label">이번 달 봉사시간</p>
              <p class="stat-value">6시간</p>
            </div>
            <div class="stat-card">
              <p class="stat-label">작성한 후기</p>
              <p class="stat-value">5개</p>
            </div>
          </div>
        </div>

        <div class="reviews-box">
          <h3 class="reviews-title">내가 작성한 후기</h3>
          <ul class="my-reviews-list">
            <li v-for="review in myReviews" :key="review.id" class="my-review-item">
              <p class="my-review-title">{{ review.title }}</p>
              <div class="my-review-meta">
                <span class="my-review-date">{{ review.date }}</span>
                <span class="my-review-views">👁 {{ review.views }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const activities = ref([
  {
    id: 1,
    status: '승인완료',
    statusClass: 'status-approved',
    title: '서울 마포 유기견 보호소 주말 봉사자 모집',
    location: '마포 사랑 보호소',
    date: '2025-10-20 오후 1시',
    time: '3시간'
  },
  {
    id: 2,
    status: '승인대기',
    statusClass: 'status-pending',
    title: '경기도 성남 유기견 보호소 평일 봉사',
    location: '성남 고양이 쉼터',
    date: '2025-10-25 오전 12시',
    time: '4시간'
  },
  {
    id: 3,
    status: '승인완료',
    statusClass: 'status-approved',
    title: '서울 마포 유기견 보호소 주말 봉사자 모집',
    location: '마포 사랑 보호소',
    date: '2025-10-20 오전 10시',
    time: '3시간'
  },
  {
    id: 4,
    status: '승인완료',
    statusClass: 'status-approved',
    title: '서울 마포 유기견 보호소 주말 봉사자 모집',
    location: '마포 사랑 보호소',
    date: '2025-10-20 오후 1시',
    time: '3시간'
  },
  {
    id: 5,
    status: '승인대기',
    statusClass: 'status-pending',
    title: '경기도 성남 유기견 보호소 평일 봉사',
    location: '성남 고양이 쉼터',
    date: '2025-10-25 오전 12시',
    time: '4시간'
  },
  {
    id: 6,
    status: '승인완료',
    statusClass: 'status-approved',
    title: '서울 마포 유기견 보호소 주말 봉사자 모집',
    location: '마포 사랑 보호소',
    date: '2025-10-20 오전 10시',
    time: '3시간'
  },
  {
    id: 7,
    status: '승인대기',
    statusClass: 'status-pending',
    title: '경기도 성남 유기견 보호소 평일 봉사',
    location: '성남 고양이 쉼터',
    date: '2025-10-25 오후 6시',
    time: '4시간'
  },
  {
    id: 8,
    status: '승인대기',
    statusClass: 'status-pending',
    title: '경기도 성남 유기견 보호소 평일 봉사',
    location: '성남 고양이 쉼터',
    date: '2025-10-25 오후 6시',
    time: '4시간'
  }
])

const myReviews = ref([
  {
    id: 1,
    title: '마포 보호소 첫 봉사 후기 너무 보람찼어요 ❤️',
    date: '2025-10-14',
    views: 928
  },
  {
    id: 2,
    title: '경북구 보호소 봉사 일지',
    date: '2025-10-13',
    views: 509
  },
  {
    id: 3,
    title: '푸푸랑 산책했어요 🐕',
    date: '2025-10-12',
    views: 2010
  },
  {
    id: 4,
    title: '푸푸랑 산책했어요 🐕',
    date: '2025-10-12',
    views: 2010
  },
  {
    id: 5,
    title: '마포 보호소 첫 봉사 후기 너무 보람찼어요 ❤️',
    date: '2025-10-14',
    views: 928
  },
  {
    id: 6,
    title: '경북구 보호소 봉사 일지',
    date: '2025-10-13',
    views: 509
  },
  {
    id: 7,
    title: '푸푸랑 산책했어요 🐕',
    date: '2025-10-12',
    views: 2010
  },
  {
    id: 8,
    title: '푸푸랑 산책했어요 🐕',
    date: '2025-10-12',
    views: 2010
  }
])
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.mine-section {
  background: transparent;
  padding: 0;
}

.mine-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* ===== 좌측 영역 ===== */
.mine-left {
  flex: 1.5;
}

.mine-box {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  max-height: 800px;
}

.mine-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #5c4a35;
  margin: 0 0 20px 0;
}

/* 활동 리스트 */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.activity-list::-webkit-scrollbar {
  width: 8px;
}

.activity-list::-webkit-scrollbar-track {
  background: #f5f0e8;
  border-radius: 4px;
}

.activity-list::-webkit-scrollbar-thumb {
  background: #d4c4b0;
  border-radius: 4px;
}

.activity-list::-webkit-scrollbar-thumb:hover {
  background: #8b7355;
}

.activity-item {
  padding: 20px;
  border: 1px solid #f0e8dc;
  border-radius: 16px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.activity-item:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.activity-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-approved {
  background: #d4f4dd;
  color: #2d5016;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.cancel-btn {
  padding: 6px 14px;
  background: #ffebee;
  color: #c62828;
  border: none;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.cancel-btn:hover {
  background: #ffcdd2;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(198, 40, 40, 0.2);
}

.activity-title {
  font-size: 1rem;
  font-weight: 600;
  color: #3d2f1f;
  margin: 0;
}

.activity-location {
  font-size: 0.85rem;
  color: #8b7355;
  margin: 0;
}

.activity-details {
  display: flex;
  gap: 16px;
}

.activity-date,
.activity-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #8b7355;
}

.activity-icon {
  font-size: 0.9rem;
}

/* ===== 우측 영역 ===== */
.mine-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 통계 박스 */
.stats-box {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stats-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #5c4a35;
  margin: 0 0 20px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background: linear-gradient(135deg, #f9e9c8 0%, #f4d9a6 100%);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
}

.stat-label {
  font-size: 0.85rem;
  color: #6b5744;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0;
}

/* 후기 박스 */
.reviews-box {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  max-height: 400px;
}

.reviews-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #5c4a35;
  margin: 0 0 16px 0;
}

.my-reviews-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.my-reviews-list::-webkit-scrollbar {
  width: 8px;
}

.my-reviews-list::-webkit-scrollbar-track {
  background: #f5f0e8;
  border-radius: 4px;
}

.my-reviews-list::-webkit-scrollbar-thumb {
  background: #d4c4b0;
  border-radius: 4px;
}

.my-reviews-list::-webkit-scrollbar-thumb:hover {
  background: #8b7355;
}

.my-review-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f0e8;
}

.my-review-item:last-child {
  border-bottom: none;
}

.my-review-title {
  font-size: 0.9rem;
  color: #3d2f1f;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.my-review-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #999;
}

/* 반응형 */
@media (max-width: 1024px) {
  .mine-container {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .activity-details {
    flex-direction: column;
    gap: 8px;
  }
}
</style>