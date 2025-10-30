<template>
  <main class="volunteer-container">
    <div class="content-wrapper">
      <!-- 탭 네비게이션 (detail 페이지일 때는 숨김) -->
      <div class="tabs-navigation" v-if="!isDetailPage">
        <div class="tabs-slider" :style="{ transform: `translateX(${activeTabIndex * 100}%)` }"></div>
        <button 
          class="tab-btn" 
          :class="{ active: activeTabIndex === 0 }"
          @click="changeTab(0)"
        >
          봉사모집
        </button>
        <button 
          class="tab-btn"
          :class="{ active: activeTabIndex === 1 }"
          @click="changeTab(1)"
        >
          봉사후기
        </button>
        <button 
          class="tab-btn"
          :class="{ active: activeTabIndex === 2 }"
          @click="changeTab(2)"
        >
          내 봉사활동
        </button>
      </div>

      <!-- 탭 콘텐츠 또는 라우터 뷰 -->
      <transition name="fade" mode="out-in">
        <router-view v-if="isDetailPage" key="detail" />
        <component v-else :is="currentComponent" :key="activeTabIndex" />
      </transition>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import VolunteerRecruitView from './recruit/VolunteerRecruitView.vue'
import VolunteerReviewView from './review/VolunteerReviewView.vue'
import VolunteerMineView from './VolunteerMineView.vue'

const route = useRoute()
const activeTabIndex = ref(0)

const tabs = [
  VolunteerRecruitView,
  VolunteerReviewView,
  VolunteerMineView
]

const currentComponent = computed(() => tabs[activeTabIndex.value])

// detail 페이지 또는 insert 페이지인지 확인
const isDetailPage = computed(() => {
  const path = route.path
  const isDetail = path.includes('/detail/') || 
                   path.includes('/insert') || 
                   (route.name === 'VolunteerDetail') ||
                   (route.name === 'VolunteerReviewInsert') ||
                   (route.name === 'VolunteerReviewDetail')
  
  console.log('Current path:', path)
  console.log('Route name:', route.name)
  console.log('isDetailPage:', isDetail)
  console.log('activeTabIndex:', activeTabIndex.value)
  
  return isDetail
})

function changeTab(index) {
  activeTabIndex.value = index
}

// 라우트 변경 감지하여 메인 페이지로 돌아올 때 첫 번째 탭으로 리셋
watch(() => route.path, (newPath) => {
  if (newPath === '/volunteer') {
    activeTabIndex.value = 0
  }
})
</script>

<style scoped>
.volunteer-container {
  background: #f5f0e8;
  padding: 40px 20px;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* 탭 네비게이션 */
.tabs-navigation {
  position: relative;
  display: inline-flex;
  background: white;
  border-radius: 30px;
  padding: 6px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs-slider {
  position: absolute;
  top: 6px;
  left: 6px;
  width: calc(33.333% - 4px);
  height: calc(100% - 12px);
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  border-radius: 24px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  box-shadow: 0 2px 6px rgba(240, 183, 98, 0.3);
}

.tab-btn {
  position: relative;
  padding: 12px 28px;
  background: transparent;
  border: none;
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #8b7355;
  cursor: pointer;
  transition: color 0.3s;
  z-index: 2;
  white-space: nowrap;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.tab-btn.active {
  color: white;
}

/* 페이드 전환 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>