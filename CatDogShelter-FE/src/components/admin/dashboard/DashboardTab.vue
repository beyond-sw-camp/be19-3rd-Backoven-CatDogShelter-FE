<template>
    <div class="tab-content">
        <StatCards :stats="topStats" />
        
        <div v-if="isLoading" class="loading">데이터를 불러오는 중...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="content-grid">
            <div class="grid-section">
                <h2 class="section-title">일반회원</h2>
                <div class="content-cards">
                    <div class="content-card" v-for="item in normalUserContent" :key="item.name">
                        <div class="card-header">
                            <span>{{ item.name }}</span>
                            <span class="card-icon">💛</span>
                        </div>
                        <div class="card-value">{{ item.value }}</div>
                        <div class="card-change">{{ item.change }}</div>
                    </div>
                </div>
            </div>

            <div class="grid-section">
                <h2 class="section-title">보호소장</h2>
                <div class="content-cards">
                    <div class="content-card" v-for="item in shelterContent" :key="item.name">
                        <div class="card-header">
                            <span>{{ item.name }}</span>
                            <span class="card-icon">💛</span>
                        </div>
                        <div class="card-value">{{ item.value }}</div>
                        <div class="card-change">{{ item.change }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- <div class="stats-summary">
            <div class="summary-card" v-for="summary in summaryStats" :key="summary.label">
                <div class="summary-header">
                    <span>{{ summary.label }}</span>
                    <span class="summary-icon">{{ summary.icon }}</span>
                </div>
                <div class="summary-value">{{ summary.value }}</div>
                <div :class="['summary-change', summary.changeType]">{{ summary.change }}</div>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import StatCards from '@/components/admin/StatCards.vue'

const isLoading = ref(true)
const error = ref(null)

const postMeta = ref({
    adoption: [],
    donation: [],
    missing: [],
    post: [],
    sighting: [],
    volunteer: [],
    association: [], // 봉사모집 게시판
})

// 통계 데이터 캐시 (재계산 방지)
const statsCache = ref({
    byType: { '일반회원': {}, '보호소': {} },
    byMonth: { current: {}, previous: {} }
})

const API_ENDPOINTS = {
    adoption: "http://localhost:8000/post-service/adoption-post/board",
    donation: "http://localhost:8000/post-service/donation-posts/query/posts",
    missing: "http://localhost:8000/post-service/missing-posts/query/posts",
    post: "http://localhost:8000/post-service/post/posts",
    sighting: "http://localhost:8000/post-service/sighting-post/summary?writer=&title=&content=&animalType=&breed=&color=&sigunguCode=&order=&page=1&size=9999",
    volunteer: "http://localhost:8000/post-service/volunteer-posts/search/created",
    association: "http://localhost:8000/post-service/association-posts/"
}

const BOARD_NAMES = {
    volunteer: '봉사후기 게시판',
    association: '봉사모집 게시판',
    adoption: '입양 게시판',
    post: '자유 게시판',
    sighting: '목격제보 게시판',
    missing: '실종신고 게시판'
}

// 날짜 유틸리티 함수
const getMonthInfo = () => {
    const now = new Date()
    const currentDay = now.getDate() // 오늘 일자 (1~31)
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear
    
    return { currentDay, currentMonth, currentYear, prevMonth, prevYear }
}

const isInMonth = (dateStr, year, month) => {
    const d = new Date(dateStr)
    return d.getFullYear() === year && d.getMonth() + 1 === month
}

// 특정 월의 특정 일자까지의 범위인지 확인
const isInMonthUpToDay = (dateStr, year, month, upToDay) => {
    const d = new Date(dateStr)
    return d.getFullYear() === year && 
           d.getMonth() + 1 === month && 
           d.getDate() <= upToDay
}

// 통계 계산 함수
const calculateStats = () => {
    const { currentDay, currentMonth, currentYear, prevMonth, prevYear } = getMonthInfo()
    
    const stats = {
        byType: { '일반회원': {}, '보호소': {} },
        byMonth: { current: {}, previous: {} }
    }
    
    Object.entries(postMeta.value).forEach(([boardType, posts]) => {
        stats.byType['일반회원'][boardType] = { total: 0, thisMonth: 0 }
        stats.byType['보호소'][boardType] = { total: 0, thisMonth: 0 }
        
        posts.forEach(post => {
            const writerType = post.writerType
            if (!stats.byType[writerType]) return
            
            stats.byType[writerType][boardType].total++
            
            // 이번 달 1일 ~ 오늘까지
            if (isInMonthUpToDay(post.createdAt, currentYear, currentMonth, currentDay)) {
                stats.byType[writerType][boardType].thisMonth++
                stats.byMonth.current[writerType] = (stats.byMonth.current[writerType] || 0) + 1
            }
            
            // 지난달 1일 ~ 오늘 일자까지 (예: 오늘이 10월 28일이면 9월 1일~28일)
            if (isInMonthUpToDay(post.createdAt, prevYear, prevMonth, currentDay)) {
                stats.byMonth.previous[writerType] = (stats.byMonth.previous[writerType] || 0) + 1
            }
        })
    })
    
    statsCache.value = stats
}

const fetchPostMeta = async () => {
    try {
        isLoading.value = true
        error.value = null
        
        const responses = await Promise.all(
            Object.values(API_ENDPOINTS).map(url => 
                fetch(url).then(res => {
                    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
                    return res.json()
                })
            )
        )
        
        const [adoptionData, donationData, missingData, postData, sightingData, volunteerData, associationData] = responses
        
        // 데이터 변환
        postMeta.value.adoption = adoptionData.content.map(item => ({
            writerType: item.userRating == null ? "보호소" : "일반회원",
            createdAt: item.displayDate
        }))
        
        postMeta.value.donation = donationData.map(item => ({
            writerType: "보호소",
            createdAt: item.createdAt
        }))
        
        postMeta.value.missing = missingData.map(item => ({
            writerType: item.userRating == null ? "보호소" : "일반회원",
            createdAt: item.createdAt
        }))
        
        postMeta.value.post = postData.map(item => ({
            writerType: item.writeType !== "일반 회원" ? "보호소" : "일반회원",
            createdAt: item.created_at  // updated_at 대신 created_at만 사용
        }))
        
        postMeta.value.sighting = sightingData.content.map(item => ({
            writerType: item.writer.ratingName == null ? "보호소" : "일반회원",
            createdAt: item.createdAt  // updatedAt 대신 createdAt만 사용
        }))
        
        postMeta.value.volunteer = volunteerData.items.map(item => ({
            writerType: "일반회원",
            createdAt: item.createdAt
        }))
        
        postMeta.value.association = associationData.map(item => ({
            writerType: "보호소",
            createdAt: item.createdAt
        }))
        
        calculateStats()
    } catch (err) {
        console.error("게시글 메타데이터 불러오기 실패:", err)
        error.value = "데이터를 불러오는 데 실패했습니다. 다시 시도해주세요."
    } finally {
        isLoading.value = false
    }
}

// Computed 속성들
const topStats = computed(() => {
    const current = statsCache.value.byMonth.current
    const previous = statsCache.value.byMonth.previous
    
    const totalCurrent = (current['일반회원'] || 0) + (current['보호소'] || 0)
    const totalPrev = (previous['일반회원'] || 0) + (previous['보호소'] || 0)
    const totalDiff = totalCurrent - totalPrev
    
    const normalCurrent = current['일반회원'] || 0
    const normalPrev = previous['일반회원'] || 0
    const normalDiff = normalCurrent - normalPrev
    
    const shelterCurrent = current['보호소'] || 0
    const shelterPrev = previous['보호소'] || 0
    const shelterDiff = shelterCurrent - shelterPrev
    
    const formatChange = (diff) => `직전 월과 비교: ${diff >= 0 ? '+' : ''}${diff}`
    const getType = (diff) => {
        if (diff === 0) return 'warning'
        return diff > 0 ? 'positive' : 'negative'
    }
    
    return [
        { 
            label: '전체 게시글', 
            icon: '📄', 
            value: totalCurrent, 
            change: formatChange(totalDiff), 
            changeType: getType(totalDiff) 
        },
        { 
            label: '이번 달 게시글(일반)', 
            icon: '😊', 
            value: normalCurrent, 
            change: formatChange(normalDiff), 
            changeType: getType(normalDiff) 
        },
        { 
            label: '이번 달 게시글(보호소)', 
            icon: '😊', 
            value: shelterCurrent, 
            change: formatChange(shelterDiff), 
            changeType: getType(shelterDiff) 
        }
    ]
})

const createContentData = (writerType) => {
    const stats = statsCache.value.byType[writerType]
    
    return Object.entries(BOARD_NAMES).map(([key, name]) => ({
        name,
        value: stats[key]?.total || 0,
        change: `이번 달: ${stats[key]?.thisMonth || 0}개`
    }))
}

const normalUserContent = computed(() => createContentData('일반회원').filter(item => 
    item.name !== '봉사모집 게시판'
))

const shelterContent = computed(() => createContentData('보호소').filter(item => 
    item.name !== '봉사후기 게시판'
))

const summaryStats = ref([
    { 
        label: '전체 회원', 
        icon: '👥', 
        value: '2,847', 
        change: '전월 대비 +8.2%', 
        changeType: 'positive' 
    },
    { 
        label: '보호소장 회원', 
        icon: '👥', 
        value: '2,847', 
        change: '전월 대비 +8.2%', 
        changeType: 'positive' 
    },
    { 
        label: '이번 신규', 
        icon: '👤', 
        value: '156', 
        change: '+23% 증가', 
        changeType: 'positive' 
    }
])

onMounted(async () => {
    await fetchPostMeta()
})
</script>

<style scoped>
.tab-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.loading, .error {
    text-align: center;
    padding: 40px;
    font-size: 16px;
}

.error {
    color: #dc3545;
    background: #f8d7da;
    border-radius: 8px;
}

.content-grid {
    display: grid;
    gap: 24px;
}

.grid-section {
    background: #FEFDFB;
    border-radius: 12px;
    padding: 24px;
}

.section-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 16px 0;
}

.content-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.content-card {
    background: #fff;
    border: 1px solid #E8DCC8;
    border-radius: 10px;
    padding: 16px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
}

.card-icon {
    font-size: 20px;
}

.card-value {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 6px;
}

.card-change {
    font-size: 12px;
    color: #51CF66;
}

.stats-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.summary-card {
    background: #F8F9FA;
    border-radius: 12px;
    padding: 20px;
}

.summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
}

.summary-icon {
    font-size: 24px;
}

.summary-value {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
}

.summary-change {
    font-size: 13px;
    font-weight: 600;
}

.summary-change.positive {
    color: #51CF66;
}

.summary-change.negative {
    color: #dc3545;
}

.summary-change.warning {
    color: #ffc107;
}

@media (max-width: 1200px) {
    .content-cards {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .content-cards {
        grid-template-columns: 1fr;
    }

    .stats-summary {
        grid-template-columns: 1fr;
    }
}
</style>