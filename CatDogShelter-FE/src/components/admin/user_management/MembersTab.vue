<template>
    <div class="tab-content">
        <StatCards :stats="stats" />

        <div class="chart-section">
            <h3 class="chart-title">월별 유형별 분포</h3>
            <p class="chart-subtitle">최근 30일 기준</p>
            
            <div class="chart-container">
                <svg viewBox="0 0 200 200" class="pie-chart">
                    <circle cx="100" cy="100" r="80" fill="none" 
                        stroke="#FF6B6B" stroke-width="40"
                        stroke-dasharray="126 314" stroke-dashoffset="0" />
                    <circle cx="100" cy="100" r="80" fill="none"
                        stroke="#FFA94D" stroke-width="40"
                        stroke-dasharray="94 314" stroke-dashoffset="-126" />
                    <circle cx="100" cy="100" r="80" fill="none"
                        stroke="#A78BFA" stroke-width="40"
                        stroke-dasharray="38 314" stroke-dashoffset="-220" />
                    <circle cx="100" cy="100" r="80" fill="none"
                        stroke="#51CF66" stroke-width="40"
                        stroke-dasharray="56 314" stroke-dashoffset="-258" />
                    <text x="100" y="95" text-anchor="middle" class="chart-center-label">총 신규</text>
                    <text x="100" y="115" text-anchor="middle" class="chart-center-value">2,847건</text>
                </svg>
        
                <div class="chart-legend">
                    <div class="legend-item" v-for="item in chartData" :key="item.label">
                        <span class="legend-dot" :style="{ background: item.color }"></span>
                        <div class="legend-info">
                            <div class="legend-label">{{ item.label }}</div>
                            <div class="legend-value">{{ item.value }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <MembersTable
            title="회원 목록"
            :userColumns="userColumns"
            :shelterColumns="shelterColumns"
            :users="filteredUsers"
            :userPage="userPage"
            :shelter="filteredShelters"
            :shelterPage="shelterPage"

            :searchQuery="searchQuery"
            :statusFilter="statusFilter"
            :roleFilter="roleFilter"
            :showStats="true"
            @update:searchQuery="searchQuery = $event"
            @update:statusFilter="statusFilter = $event"
            @update:roleFilter="roleFilter = $event"
            @view="handleView"
            @edit="handleEdit"
            @prevPage="onPrevPage()"
            @nextPage="onNextPage()"
            @movePage="onMovePage"
        />
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, computed } from 'vue'
    import StatCards from '@/components/admin/StatCards.vue'
    import MembersTable from '@/components/admin/user_management/MembersTable.vue'

    const stats = ref([
        { label: '전체 플랫폼도를 회원', icon: '🚩', value: '147', change: '이번달 +23', changeType: 'negative' },
        { label: '권도 대기', icon: '⏰', value: '38', change: '처리 필요', changeType: 'warning' },
        { label: '전체 활성화된 회원', icon: '✅', value: '119', change: '74% 처리율', changeType: 'success' }
    ])

    const chartData = ref([
        { label: '3월 정지', value: '1,424건 (50.0%)', color: '#FF6B6B' },
        { label: '7월 정지', value: '852건 (30.0%)', color: '#FFA94D' },
        { label: '15일 정지', value: '341건 (12.0%)', color: '#A78BFA' },
        { label: '블랙리스트 회원', value: '230건 (8.0%)', color: '#51CF66' }
    ])

    // const columns = ref(['회원정보', '가입일', '최근접속', '권한', '상태', '플랫폼도 및 게시글/댓글', '관리'])

    const userColumns 
        = ref(['회원 정보', '최근접속', '정지 해제일','상태', '작성 게시글/댓글 수', '관리자 임명']);
    const shelterColumns 
        = ref(['회원 정보', '최근접속', '전화번호', '상태','작성 게시글/댓글 수', '주소']);

    const users = reactive([]);
    const userPage = reactive({
        totalCount: 0,     // 전체 데이터 개수
        totalPage: 0,      // 전체 페이지 수
        startPage: 0,      // 현재 구간의 시작 페이지
        endPage: 0,        // 현재 구간의 끝 페이지
        currentPage: 1,    // 현재 선택된 페이지
        size: 5,           // 한 페이지당 데이터 수
        blockSize: 5,      // 한 번에 보여줄 페이지 번호 개수 (1~5, 6~10 등)

        // ✅ 전체 페이지 및 구간 계산
        pagination() {
            this.totalPage = Math.ceil(this.totalCount / this.size)

            const blockIndex = Math.floor((this.currentPage - 1) / this.blockSize)
            this.startPage = blockIndex * this.blockSize + 1
            this.endPage = Math.min(this.startPage + this.blockSize - 1, this.totalPage)
        },

        // ✅ 페이지 이동
        movePage(page) {
            if (page < 1 || page > this.totalPage) return
            this.currentPage = page
            this.pagination()

            console.log(page);
        },

        // ✅ 이전 페이지
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--
                this.pagination()
            }
        },

        // ✅ 다음 페이지
        nextPage() {
            if (this.currentPage < this.totalPage) {
                this.currentPage++
                this.pagination()
            }
        },

        // ✅ 총 개수 세팅
        setTotal(count) {
            this.totalCount = count
            this.pagination()
        }
    })
    const shelter = reactive([]);
    const shelterPage = reactive({
        totalCount: 0,     // 전체 데이터 개수
        totalPage: 0,      // 전체 페이지 수
        startPage: 0,      // 현재 구간의 시작 페이지
        endPage: 0,        // 현재 구간의 끝 페이지
        currentPage: 1,    // 현재 선택된 페이지
        size: 5,           // 한 페이지당 데이터 수
        blockSize: 5,      // 한 번에 보여줄 페이지 번호 개수 (1~5, 6~10 등)

        // ✅ 전체 페이지 및 구간 계산
        pagination() {
            this.totalPage = Math.ceil(this.totalCount / this.size)

            const blockIndex = Math.floor((this.currentPage - 1) / this.blockSize)
            this.startPage = blockIndex * this.blockSize + 1
            this.endPage = Math.min(this.startPage + this.blockSize - 1, this.totalPage)
        },

        // ✅ 페이지 이동
        movePage(page) {
            if (page < 1 || page > this.totalPage) return
            this.currentPage = page
            this.pagination()
        },

        // ✅ 이전 페이지
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--
                this.pagination()
            }
        },

        // ✅ 다음 페이지
        nextPage() {
            if (this.currentPage < this.totalPage) {
                this.currentPage++
                this.pagination()
            }
        },

        // ✅ 총 개수 세팅
        setTotal(count) {
            this.totalCount = count
            this.pagination()
        }
    })
    const fetchUser = async () => {
        const res = await fetch(`http://localhost:8000/user-service/user/admin/user?type=ALL`);
        const data = await res.json();

        users.length = 0;
        users.push(...data);
        userPage.setTotal(users.length)

        // console.log(users);
    }

    const fetchShelter = async () => {
        const res = await fetch(`http://localhost:8000/user-service/user/admin/head`);
        const data = await res.json();

        shelter.length = 0;
        shelter.push(...data);
        shelterPage.setTotal(shelter.length)
    }

    onMounted(async () => {
        await fetchUser();
        await fetchShelter();
    })

    const searchQuery = ref('')         // 검색
    const statusFilter = ref('')        // 일반, 정지, 탈퇴
    const roleFilter = ref('user')          // 일반 : 보호소


    const filteredUsers = computed(() => {
        let list = [...users];

        // 상태 필터
        if (statusFilter.value === 'general') {
            list = list.filter(u => u.userStatus.toLowerCase() === 'general');
        } else if (statusFilter.value === 'black') {
            list = list.filter(u => u.userStatus.toLowerCase() === 'black');
        } else if (statusFilter.value === 'cancel') {
            list = list.filter(u => u.userStatus.toLowerCase() === 'cancel');
        }
        
        // 검색 필터
        if (searchQuery.value.trim() !== '') {
            const q = searchQuery.value.toLowerCase();
            list = list.filter(u =>
                u.userName.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
        }

        userPage.setTotal(list.length);

        const start = (userPage.currentPage - 1) * userPage.size;
        const end = start + userPage.size;
        return list.slice(start, end);
    }) 

    const filteredShelters = computed(() => {
        let list = shelter.map(u => ({
            ...u,
            userStatus: u.closeDate ? 'CANCEL' : 'GENERAL'
        }));

        // 상태 필터
        if (statusFilter.value === 'general') {
            list = list.filter(u => u.userStatus.toLowerCase() === 'general');
        } else if (statusFilter.value === 'cancel') {
            list = list.filter(u => u.userStatus.toLowerCase() === 'cancel');
        }

        // 검색 필터
        if (searchQuery.value.trim() !== '') {
            const q = searchQuery.value.toLowerCase();
            list = list.filter(u =>
                u.companyName.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
        }
    
        shelterPage.setTotal(list.length);
    
        const start = (shelterPage.currentPage - 1) * shelterPage.size;
        const end = start + shelterPage.size;
        return list.slice(start, end);
    });

    const onMovePage = (p) => {
        if (roleFilter === 'user') {
            userPage.currentPage = p;
            userPage.pagination();
        } else {
            shelterPage.currentPage = p;
            shelterPage.pagination();
        }
    }

    const onPrevPage = () => {
        if (roleFilter === 'user') {
            userPage.currentPage--;
            userPage.pagination();
        } else {
            shelterPage.currentPage--;
            shelterPage.pagination();
        }
    }
    const onNextPage = () => {
        if (roleFilter === 'user') {
            userPage.currentPage++;
            userPage.pagination();
        } else {
            shelterPage.currentPage++;
            shelterPage.pagination();
        }
    }

    const handleView = (member) => {
        console.log('View member:', member)
        // TODO: 회원 상세 모달 열기
    }

    const handleEdit = (member) => {
        console.log('Edit member:', member)
        // TODO: 회원 수정 모달 열기
    }
</script>

<style scoped>
    .tab-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .chart-section {
        background: #FEFDFB;
        border: 1px solid #E8DCC8;
        border-radius: 12px;
        padding: 24px;
    }

    .chart-title {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 4px 0;
    }

    .chart-subtitle {
        font-size: 13px;
        color: #999;
        margin: 0 0 24px 0;
    }

    .chart-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 60px;
        padding: 20px 0;
    }

    .pie-chart {
        width: 280px;
        height: 280px;
        transform: rotate(-90deg);
    }

    .chart-center-label {
        font-size: 12px;
        fill: #999;
        transform: rotate(90deg);
        transform-origin: 100px 95px; 
    }

    .chart-center-value {
        font-size: 18px;
        font-weight: 700;
        fill: #000;
        transform: rotate(90deg);
        transform-origin: 100px 115px;
    }

    .chart-legend {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .legend-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .legend-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .legend-label {
        font-size: 13px;
        color: #666;
    }

    .legend-value {
        font-size: 14px;
        font-weight: 600;
        color: #000;
    }

    @media (max-width: 768px) {
        .chart-container {
            flex-direction: column;
            gap: 30px;
        }
    }
</style>