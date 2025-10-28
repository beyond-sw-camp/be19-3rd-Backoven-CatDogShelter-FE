<template>
  <div class="messages-page">
    <div class="page-header">
      <div class="page-header__title">
        <p class="page-breadcrumb">마이페이지 · 커뮤니티</p>
        <h1>쪽지</h1>
        <p class="page-subtitle">내 쪽지를 확인하고 답장을 보낼 수 있어요.</p>
      </div>
      <div class="page-header__actions">
        <div class="page-chip">
          새로운 쪽지 <strong>{{ unreadCount }}</strong>개
        </div>
        <button class="header-write-btn" @click="openComposeModal">
          <span>✏️</span>
          새 쪽지 작성
        </button>
      </div>
    </div>

    <div class="jjokji-container">
      <!-- Left Sidebar -->
      <aside class="sidebar">
        <div class="profile-section">
          <div class="ascii-art">
            <pre>
    +  ⌒
  (  ^_^  ♡ )
    i-/  つつ
            </pre>
          </div>
          <h3 class="username">이다인</h3>
          <span class="badge">1일차 쪽집게</span>

          <button class="write-btn" @click="openComposeModal">
            <span class="icon">✏️</span>
            새 쪽지 작성
          </button>
        </div>

        <nav class="menu-section">
          <div
            class="menu-item"
            :class="{ active: currentTab === 'received' }"
            @click="currentTab = 'received'"
          >
            <span class="icon">📨</span>
            <div class="menu-label">
              <span class="menu-title">받은쪽지함</span>
              <span class="menu-sub">새로운 쪽지 {{ unreadCount }}개</span>
            </div>
            <span class="count">{{ receivedMessages.length }}</span>
          </div>
          <div
            class="menu-item"
            :class="{ active: currentTab === 'sent' }"
            @click="currentTab = 'sent'"
          >
            <span class="icon">📤</span>
            <div class="menu-label">
              <span class="menu-title">보낸쪽지함</span>
              <span class="menu-sub">읽음 상태 확인하기</span>
            </div>
            <span class="count">{{ sentMessages.length }}</span>
          </div>
          <div
            class="menu-item"
            :class="{ active: currentTab === 'trash' }"
            @click="currentTab = 'trash'"
          >
            <span class="icon">🗑️</span>
            <div class="menu-label">
              <span class="menu-title">쪽지통</span>
              <span class="menu-sub">삭제된 쪽지 관리</span>
            </div>
            <span class="count">{{ trashedMessages.length }}</span>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- 받은쪽지함 -->
        <div v-if="currentTab === 'received'" class="tab-content">
          <div class="content-header">
            <div>
              <span class="content-label">Inbox</span>
              <h2>받은쪽지함</h2>
              <p class="subtitle">새로운 쪽지 {{ unreadCount }}개가 도착했어요.</p>
            </div>
            <div class="header-stat">
              <span class="dot new"></span>
              <span>읽지 않은 쪽지</span>
            </div>
          </div>

          <div class="toolbar">
            <div class="left-section">
              <label class="checkbox">
                <input type="checkbox" v-model="selectAllReceived" @change="toggleSelectAll('received')" />
                <span class="select-text">받은쪽지 ({{ receivedMessages.length }})</span>
              </label>
            </div>
            <div class="center-section">
              <div class="search-field">
                <span class="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="쪽지 검색..."
                  class="search-input"
                  v-model="searchQuery"
                />
              </div>
            </div>
            <div class="right-section">
              <button class="action-btn" @click="openComposeModal">+ 새 쪽지</button>
            </div>
          </div>

          <div class="message-actions">
            <button class="btn-icon" @click="markSelectedAsRead">
              <span>👁️</span>
              읽음 처리
            </button>
            <button class="btn-icon delete" @click="deleteSelected('received')">
              <span>🗑️</span>
              삭제하기
            </button>
          </div>

          <div v-if="!receivedMessages.length" class="empty-state primary">
            <div class="empty-illustration">📫</div>
            <p class="empty-text">아직 받은 쪽지가 없어요.</p>
            <p class="empty-subtext">새로운 소식을 기다리거나 먼저 쪽지를 보내보세요.</p>
          </div>

          <div v-else-if="filteredReceivedMessages.length" class="message-list">
            <div
              v-for="message in filteredReceivedMessages"
              :key="message.id"
              class="message-item"
              :class="{ unread: !message.isRead }"
              @click="openMessageDetail(message)"
            >
              <input type="checkbox" v-model="message.selected" @click.stop />

              <div class="avatar" :style="{ backgroundColor: message.avatarColor }">
                {{ message.sender.charAt(0) }}
              </div>

              <div class="message-content">
                <div class="message-header">
                  <div class="message-title-group">
                    <span class="message-sender">{{ message.sender }}</span>
                    <h4 class="message-title">{{ message.title }}</h4>
                  </div>
                  <div class="message-meta">
                    <span v-if="!message.isRead" class="status-chip">NEW</span>
                    <span class="message-date">{{ message.date }}</span>
                  </div>
                </div>
                <p class="message-preview">{{ message.preview }}</p>
              </div>

              <div class="message-actions-right">
                <button class="btn-reply" @click.stop="replyToMessage(message)">
                  <span>↩️</span>
                  답장
                </button>
                <button class="btn-more" @click.stop>⋯</button>
              </div>
            </div>
          </div>

          <div v-else class="empty-result">
            <div class="empty-icon">📭</div>
            <p class="empty-text">검색과 일치하는 받은 쪽지가 없어요.</p>
            <p class="empty-subtext">다른 키워드로 다시 검색해보세요.</p>
          </div>

          <div class="pagination">
            <button class="page-btn" :disabled="currentPage === 1">‹ 이전</button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button class="page-btn" :disabled="currentPage === totalPages">다음 ›</button>
          </div>
        </div>

        <!-- 보낸쪽지함 -->
        <div v-if="currentTab === 'sent'" class="tab-content">
          <div class="content-header">
            <div>
              <span class="content-label">Outbox</span>
              <h2>보낸쪽지함</h2>
              <p class="subtitle">총 {{ sentMessages.length }}개의 쪽지를 보냈어요.</p>
            </div>
            <div class="header-stat sent">
              <span class="dot"></span>
              <span>읽음 여부 확인</span>
            </div>
          </div>

          <div class="toolbar">
            <div class="left-section">
              <label class="checkbox">
                <input type="checkbox" v-model="selectAllSent" @change="toggleSelectAll('sent')" />
                <span class="select-text">보낸쪽지 ({{ sentMessages.length }})</span>
              </label>
            </div>
            <div class="center-section">
              <div class="search-field">
                <span class="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="쪽지 검색..."
                  class="search-input"
                  v-model="searchQuery"
                />
              </div>
            </div>
            <div class="right-section">
              <button class="action-btn" @click="openComposeModal">+ 새 쪽지</button>
            </div>
          </div>

          <div class="message-actions">
            <button class="btn-icon delete" @click="deleteSelected('sent')">
              <span>🗑️</span>
              삭제하기
            </button>
          </div>

          <div v-if="!sentMessages.length" class="empty-state">
            <div class="empty-illustration">📤</div>
            <p class="empty-text">아직 보낸 쪽지가 없어요.</p>
            <p class="empty-subtext">새로운 소식을 전달해보세요.</p>
          </div>

          <div v-else-if="filteredSentMessages.length" class="message-list">
            <div
              v-for="message in filteredSentMessages"
              :key="message.id"
              class="message-item"
              :class="{ 'read-by-receiver': message.isReadByReceiver }"
              @click="openSentMessageDetail(message)"
            >
              <input type="checkbox" v-model="message.selected" @click.stop />

              <div class="avatar" :style="{ backgroundColor: message.avatarColor }">
                {{ message.receiver.charAt(0) }}
              </div>

              <div class="message-content">
                <div class="message-header">
                  <div class="message-title-group">
                    <span class="message-sender">받는 사람 {{ message.receiver }}</span>
                    <h4 class="message-title">{{ message.title }}</h4>
                  </div>
                  <div class="message-meta">
                    <span class="message-date">{{ message.date }}</span>
                  </div>
                </div>
                <p class="message-preview">{{ message.preview }}</p>
              </div>

              <div class="message-actions-right">
                <span class="read-status" :class="{ read: message.isReadByReceiver }">
                  {{ message.isReadByReceiver ? '읽음' : '안읽음' }}
                </span>
                <button class="btn-more" @click.stop>⋯</button>
              </div>
            </div>
          </div>

          <div v-else class="empty-result">
            <div class="empty-icon">📭</div>
            <p class="empty-text">검색과 일치하는 보낸 쪽지가 없어요.</p>
            <p class="empty-subtext">다른 키워드로 다시 검색해보세요.</p>
          </div>

          <div class="pagination">
            <button class="page-btn" :disabled="currentPage === 1">‹ 이전</button>
            <button
              v-for="page in 2"
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button class="page-btn" :disabled="currentPage === 2">다음 ›</button>
          </div>
        </div>

        <!-- 휴지통 -->
        <div v-if="currentTab === 'trash'" class="tab-content">
          <div class="content-header">
            <div>
              <span class="content-label">Archive</span>
              <h2>쪽지통</h2>
              <p class="subtitle">삭제된 쪽지는 30일 뒤 자동으로 삭제돼요.</p>
            </div>
            <div class="header-stat trash">
              <span class="dot"></span>
              <span>삭제 보관함</span>
            </div>
          </div>

          <div class="toolbar">
            <div class="left-section">
              <label class="checkbox">
                <input type="checkbox" v-model="selectAllTrash" @change="toggleSelectAll('trash')" />
                <span class="select-text">쪽지통 ({{ trashedMessages.length }})</span>
              </label>
            </div>
            <div class="center-section">
              <div class="search-field">
                <span class="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="쪽지 검색..."
                  class="search-input"
                  v-model="searchQuery"
                />
              </div>
            </div>
            <div class="right-section">
              <button class="action-btn" @click="openComposeModal">+ 새 쪽지</button>
            </div>
          </div>

          <div class="message-actions">
            <button class="btn-icon" @click="restoreSelected">
              <span>↩️</span>
              복구하기
            </button>
            <button class="btn-icon delete" @click="permanentlyDeleteSelected">
              <span>🗑️</span>
              영구 삭제
            </button>
          </div>

          <div v-if="!trashedMessages.length" class="empty-state">
            <div class="empty-illustration">📦</div>
            <p class="empty-text">삭제된 쪽지가 없습니다</p>
            <p class="empty-subtext">쪽지통에는 삭제한 쪽지가 보관됩니다</p>
          </div>

          <div v-else-if="filteredTrashedMessages.length" class="message-list">
            <div
              v-for="message in filteredTrashedMessages"
              :key="message.id"
              class="message-item"
            >
              <input type="checkbox" v-model="message.selected" @click.stop />

              <div class="avatar" :style="{ backgroundColor: message.avatarColor }">
                {{ (message.sender || message.receiver).charAt(0) }}
              </div>

              <div class="message-content">
                <div class="message-header">
                  <div class="message-title-group">
                    <span class="message-sender">{{ message.sender || message.receiver }}</span>
                    <h4 class="message-title">{{ message.title }}</h4>
                  </div>
                  <div class="message-meta">
                    <span class="message-date">{{ message.date }}</span>
                  </div>
                </div>
                <p class="message-preview">{{ message.preview }}</p>
              </div>

              <div class="message-actions-right">
                <span class="trash-label">{{ message.fromBox }}</span>
                <button class="btn-more" @click.stop>⋯</button>
              </div>
            </div>
          </div>

          <div v-else class="empty-result">
            <div class="empty-icon">📭</div>
            <p class="empty-text">검색과 일치하는 쪽지가 없어요.</p>
            <p class="empty-subtext">삭제한 쪽지를 복구하거나 새 쪽지를 작성해보세요.</p>
          </div>

          <div class="pagination">
            <button class="page-btn" :disabled="currentPage === 1">‹ 이전</button>
            <button class="page-btn active">1</button>
            <button class="page-btn" :disabled="trashedMessages.length === 0">다음 ›</button>
          </div>
        </div>
      </main>
    </div>

    <!-- 새 쪽지 작성 모달 -->
    <Teleport to="body">
      <div v-if="showComposeModal" class="modal-overlay" @click="closeComposeModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <span class="icon">✏️</span>
              새 쪽지 작성
            </h3>
            <button class="close-btn" @click="closeComposeModal">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">받는 사람</label>
              <input
                type="text"
                class="form-input"
                placeholder="👤 사용자아이디 또는 이메일 입력"
                v-model="composeForm.recipient"
              />
            </div>

            <div class="form-group">
              <label class="form-label">내용</label>
              <textarea
                class="form-textarea"
                placeholder="메시지 내용을 입력하세요..."
                v-model="composeForm.content"
                rows="10"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeComposeModal">취소</button>
            <button class="btn-send" @click="sendMessage">
              <span>✈️</span>
              보내기
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 받은쪽지 상세보기 모달 -->
    <Teleport to="body">
      <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
        <div class="modal-container detail-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <span class="icon">📧</span>
              받은쪽지
            </h3>
            <button class="close-btn" @click="closeDetailModal">✕</button>
          </div>

          <div class="modal-body">
            <div v-if="selectedMessage" class="detail-hero">
              <span class="hero-label">새로운 쪽지</span>
              <h3 class="hero-title">{{ selectedMessage.title }}</h3>
              <p class="hero-subtitle">{{ selectedMessage.preview }}</p>
            </div>

            <div class="message-detail-header">
              <div class="sender-info">
                <div class="avatar-large" :style="{ backgroundColor: selectedMessage?.avatarColor }">
                  {{ selectedMessage?.sender?.charAt(0) }}
                </div>
                <div class="sender-details">
                  <h4 class="sender-name">{{ selectedMessage?.sender }}</h4>
                  <p class="sender-email">{{ selectedMessage?.senderEmail }}</p>
                </div>
              </div>
              <div class="message-time">{{ selectedMessage?.fullDate }}</div>
            </div>

            <div class="message-recipient">
              받는 사람: <span class="recipient-email">{{ selectedMessage?.recipientEmail }}</span>
            </div>

            <div class="message-detail-content">
              {{ selectedMessage?.fullContent }}
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeDetailModal">확인</button>
            <button class="btn-send" @click="replyToCurrentMessage">
              <span>↩️</span>
              답장하기
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 보낸쪽지 상세보기 모달 -->
    <Teleport to="body">
      <div v-if="showSentDetailModal" class="modal-overlay" @click="closeSentDetailModal">
        <div class="modal-container detail-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <span class="icon">📤</span>
              보낸쪽지
            </h3>
            <button class="close-btn" @click="closeSentDetailModal">✕</button>
          </div>

          <div class="modal-body">
            <div v-if="selectedSentMessage" class="detail-hero sent">
              <span class="hero-label">보낸 쪽지</span>
              <h3 class="hero-title">{{ selectedSentMessage.title }}</h3>
              <p class="hero-subtitle">{{ selectedSentMessage.preview }}</p>
            </div>

            <div class="message-detail-header">
              <div class="sender-info">
                <div class="avatar-large" :style="{ backgroundColor: selectedSentMessage?.avatarColor }">
                  {{ selectedSentMessage?.receiver?.charAt(0) }}
                </div>
                <div class="sender-details">
                  <h4 class="sender-name">{{ selectedSentMessage?.receiver }}</h4>
                  <p class="sender-email">{{ selectedSentMessage?.receiverEmail }}</p>
                </div>
              </div>
              <div class="message-time">{{ selectedSentMessage?.fullDate }}</div>
            </div>

            <div class="message-recipient">
              받는 사람: <span class="recipient-email">{{ selectedSentMessage?.receiverEmail }}</span>
            </div>

            <div class="message-detail-content">
              {{ selectedSentMessage?.fullContent }}
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeSentDetailModal">확인</button>
            <button class="btn-send" @click="resendMessage">
              <span>📤</span>
              다시 보내기
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const currentTab = ref('received')
const searchQuery = ref('')
const selectAllReceived = ref(false)
const selectAllSent = ref(false)
const selectAllTrash = ref(false)
const currentPage = ref(1)
const totalPages = ref(3)

const showComposeModal = ref(false)
const showDetailModal = ref(false)
const showSentDetailModal = ref(false)
const selectedMessage = ref(null)
const selectedSentMessage = ref(null)

const composeForm = ref({
  recipient: '',
  content: ''
})

const receivedMessages = ref([
  {
    id: 1,
    sender: '보소스',
    senderEmail: 'seoulovedog@gmail.com',
    recipientEmail: 'dain0404@company.com',
    title: '서울 유기견 보호소',
    preview: '봉사모임이 마감되어 다시 인원을 받게 됐고 안내드...',
    fullContent: `안녕하세요! 서울 유기견 보호소입니다.

서울 유기견 보호소 이번 유기견 견사 청소모임은 마감되었습니다.
다음 모임도 곧 있을 예정입니다.
다음에 신청해주시길 부탁드립니다!`,
    date: '오전 10:16',
    fullDate: '2025년 10월 21일 오전 10:16',
    isRead: false,
    selected: false,
    avatarColor: '#FFE4B5'
  },
  {
    id: 2,
    sender: '최예원',
    senderEmail: 'yewon.choi@email.com',
    recipientEmail: 'dain0404@company.com',
    title: '최예원',
    preview: '일하는 다른 일정들이랑 같이 본격 준비 중이니 개인적으로 관심있으면 알려...',
    fullContent: `안녕하세요!

일하는 다른 일정들이랑 같이 본격 준비 중이니 개인적으로 관심있으면 알려주세요.
함께 진행하면 좋을 것 같습니다.`,
    date: '오전 10:15',
    fullDate: '2025년 10월 21일 오전 10:15',
    isRead: true,
    selected: false,
    avatarColor: '#FFD700'
  },
  {
    id: 3,
    sender: '관리자',
    senderEmail: 'admin@system.com',
    recipientEmail: 'dain0404@company.com',
    title: '관리자',
    preview: '게시글 삭제 누적 5회가 되었습니다. 이에 따른 조치가 이루어질 수 있습니다.',
    fullContent: `게시글 삭제 누적 5회가 되었습니다. 이에 따른 조치가 이루어질 수 있습니다.

커뮤니티 가이드라인을 준수해주시기 바랍니다.`,
    date: '어제',
    fullDate: '2025년 10월 20일 오후 3:42',
    isRead: true,
    selected: false,
    avatarColor: '#D3D3D3'
  }
])

const sentMessages = ref([
  {
    id: 1,
    receiver: '김철수',
    receiverEmail: 'kimcs@email.com',
    title: '봉사활동 문의',
    preview: '안녕하세요. 다음 주 봉사활동 참여 가능한지 문의드립니다...',
    fullContent: `안녕하세요. 다음 주 봉사활동 참여 가능한지 문의드립니다.

시간이 되신다면 함께 참여하면 좋을 것 같아서 연락드립니다.
답변 부탁드립니다.

감사합니다.`,
    date: '오후 3:20',
    fullDate: '2025년 10월 20일 오후 3:20',
    isReadByReceiver: true,
    selected: false,
    avatarColor: '#B8E6B8'
  },
  {
    id: 2,
    receiver: '이영희',
    receiverEmail: 'leeyh@email.com',
    title: '회의 일정 조율',
    preview: '회의 시간을 조정하고 싶은데 괜찮으실까요?',
    fullContent: `안녕하세요.

회의 시간을 조정하고 싶은데 괜찮으실까요?
다른 일정과 겹쳐서 시간 변경이 필요할 것 같습니다.

가능하신 시간대를 알려주시면 감사하겠습니다.`,
    date: '오전 11:30',
    fullDate: '2025년 10월 20일 오전 11:30',
    isReadByReceiver: false,
    selected: false,
    avatarColor: '#FFB8D1'
  }
])

const trashedMessages = ref([])

const unreadCount = computed(() => {
  return receivedMessages.value.filter((msg) => !msg.isRead).length
})

const matchesQuery = (message) => {
  const keyword = searchQuery.value.trim().toLowerCase()
  if (!keyword) {
    return true
  }

  const fields = [
    message.title,
    message.preview,
    message.fullContent,
    message.sender,
    message.receiver,
    message.senderEmail,
    message.receiverEmail,
    message.fullDate,
    message.recipientEmail
  ]

  return fields.some((value) => value && value.toLowerCase().includes(keyword))
}

const filteredReceivedMessages = computed(() =>
  receivedMessages.value.filter((message) => matchesQuery(message))
)

const filteredSentMessages = computed(() =>
  sentMessages.value.filter((message) => matchesQuery(message))
)

const filteredTrashedMessages = computed(() =>
  trashedMessages.value.filter((message) => matchesQuery(message))
)

watch(searchQuery, () => {
  selectAllReceived.value = false
  selectAllSent.value = false
  selectAllTrash.value = false

  receivedMessages.value.forEach((msg) => {
    msg.selected = false
  })
  sentMessages.value.forEach((msg) => {
    msg.selected = false
  })
  trashedMessages.value.forEach((msg) => {
    msg.selected = false
  })
})

const toggleSelectAll = (type) => {
  if (type === 'received') {
    filteredReceivedMessages.value.forEach((msg) => {
      msg.selected = selectAllReceived.value
    })
  } else if (type === 'sent') {
    filteredSentMessages.value.forEach((msg) => {
      msg.selected = selectAllSent.value
    })
  } else if (type === 'trash') {
    filteredTrashedMessages.value.forEach((msg) => {
      msg.selected = selectAllTrash.value
    })
  }
}

const markSelectedAsRead = () => {
  const selectedMessages = receivedMessages.value.filter((msg) => msg.selected)
  if (selectedMessages.length === 0) {
    alert('읽음 처리할 쪽지를 선택해주세요.')
    return
  }

  selectedMessages.forEach((msg) => {
    msg.isRead = true
    msg.selected = false
  })

  selectAllReceived.value = false
  alert(`${selectedMessages.length}개의 쪽지를 읽음 처리했습니다.`)
}

const deleteSelected = (type) => {
  let messages
  if (type === 'received') {
    messages = receivedMessages.value.filter((msg) => msg.selected)
    if (messages.length === 0) {
      alert('삭제할 쪽지를 선택해주세요.')
      return
    }

    messages.forEach((msg) => {
      msg.fromBox = '받은쪽지함'
      trashedMessages.value.push({ ...msg })
    })

    receivedMessages.value = receivedMessages.value.filter((msg) => !msg.selected)
    selectAllReceived.value = false
  } else if (type === 'sent') {
    messages = sentMessages.value.filter((msg) => msg.selected)
    if (messages.length === 0) {
      alert('삭제할 쪽지를 선택해주세요.')
      return
    }

    messages.forEach((msg) => {
      msg.fromBox = '보낸쪽지함'
      trashedMessages.value.push({ ...msg })
    })

    sentMessages.value = sentMessages.value.filter((msg) => !msg.selected)
    selectAllSent.value = false
  }

  alert(`${messages.length}개의 쪽지를 삭제했습니다.`)
}

const restoreSelected = () => {
  const selectedMessages = trashedMessages.value.filter((msg) => msg.selected)
  if (selectedMessages.length === 0) {
    alert('복구할 쪽지를 선택해주세요.')
    return
  }

  selectedMessages.forEach((msg) => {
    if (msg.fromBox === '받은쪽지함') {
      receivedMessages.value.push({ ...msg, selected: false, fromBox: undefined })
    } else if (msg.fromBox === '보낸쪽지함') {
      sentMessages.value.push({ ...msg, selected: false, fromBox: undefined })
    }
  })

  trashedMessages.value = trashedMessages.value.filter((msg) => !msg.selected)
  selectAllTrash.value = false

  alert(`${selectedMessages.length}개의 쪽지를 복구했습니다.`)
}

const permanentlyDeleteSelected = () => {
  const selectedMessages = trashedMessages.value.filter((msg) => msg.selected)
  if (selectedMessages.length === 0) {
    alert('영구 삭제할 쪽지를 선택해주세요.')
    return
  }

  if (confirm(`${selectedMessages.length}개의 쪽지를 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
    trashedMessages.value = trashedMessages.value.filter((msg) => !msg.selected)
    selectAllTrash.value = false
    alert('선택한 쪽지가 영구 삭제되었습니다.')
  }
}

const openComposeModal = () => {
  showComposeModal.value = true
  composeForm.value = {
    recipient: '',
    content: ''
  }
}

const closeComposeModal = () => {
  showComposeModal.value = false
}

const sendMessage = () => {
  if (!composeForm.value.recipient || !composeForm.value.content) {
    alert('받는 사람과 내용을 모두 입력해주세요.')
    return
  }
  alert('쪽지가 전송되었습니다!')
  closeComposeModal()
}

const openMessageDetail = (message) => {
  selectedMessage.value = message
  showDetailModal.value = true
  message.isRead = true
}

const openSentMessageDetail = (message) => {
  selectedSentMessage.value = message
  showSentDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedMessage.value = null
}

const closeSentDetailModal = () => {
  showSentDetailModal.value = false
  selectedSentMessage.value = null
}

const replyToMessage = (message) => {
  composeForm.value.recipient = message.senderEmail
  openComposeModal()
}

const replyToCurrentMessage = () => {
  if (selectedMessage.value) {
    composeForm.value.recipient = selectedMessage.value.senderEmail
    closeDetailModal()
    openComposeModal()
  }
}

const resendMessage = () => {
  if (selectedSentMessage.value) {
    composeForm.value.recipient = selectedSentMessage.value.receiverEmail
    composeForm.value.content = selectedSentMessage.value.fullContent
    closeSentDetailModal()
    openComposeModal()
  }
}
</script>

<style scoped>
.messages-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fdf6ec 0%, #f8ebd7 100%);
  padding: 48px 0 80px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #3b2b20;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.page-header__title h1 {
  font-size: 36px;
  margin: 6px 0;
  color: #3b2b20;
}

.page-breadcrumb {
  font-size: 14px;
  color: #a4886b;
  margin: 0;
}

.page-subtitle {
  font-size: 16px;
  color: #7e6750;
  margin: 0;
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-chip {
  background: rgba(209, 139, 71, 0.15);
  color: #b06a2b;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.page-chip strong {
  color: #8c4c13;
}

.header-write-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: #c7813e;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(199, 129, 62, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.header-write-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(199, 129, 62, 0.3);
}

.jjokji-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-section {
  background: #fff8ed;
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid rgba(196, 156, 112, 0.2);
  box-shadow: 0 20px 45px rgba(198, 150, 103, 0.12);
}

.ascii-art pre {
  font-size: 15px;
  line-height: 1.3;
  color: #3b2b20;
  margin: 0;
}

.username {
  font-size: 22px;
  font-weight: 700;
  margin: 18px 0 6px;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffd18d;
  color: #7b4b1e;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.write-btn {
  width: 100%;
  margin-top: 24px;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid rgba(196, 156, 112, 0.35);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
  color: #7b4b1e;
}

.write-btn:hover {
  background: rgba(255, 235, 208, 0.6);
}

.menu-section {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(196, 156, 112, 0.18);
  box-shadow: 0 20px 45px rgba(198, 150, 103, 0.08);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  border-bottom: 1px solid rgba(240, 214, 187, 0.7);
  color: #7e6750;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item .icon {
  font-size: 22px;
}

.menu-item.active {
  background: rgba(255, 227, 193, 0.6);
  color: #593d24;
  transform: translateX(4px);
}

.menu-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-title {
  font-weight: 600;
  font-size: 15px;
}

.menu-sub {
  font-size: 12px;
  color: #a4886b;
}

.menu-item .count {
  margin-left: auto;
  background: rgba(197, 138, 79, 0.18);
  color: #9b6024;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.main-content {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(196, 156, 112, 0.18);
  box-shadow: 0 25px 60px rgba(198, 150, 103, 0.18);
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.content-label {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(209, 139, 71, 0.12);
  color: #b06a2b;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}

.content-header h2 {
  font-size: 26px;
  margin: 0;
  color: #3b2b20;
}

.subtitle {
  color: #7e6750;
  font-size: 14px;
  margin: 6px 0 0;
}

.header-stat {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 214, 187, 0.5);
  border-radius: 12px;
  font-size: 13px;
  color: #8c4c13;
  font-weight: 600;
}

.header-stat .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d38a3d;
  display: inline-block;
}

.header-stat.new .dot {
  background: #ff7f50;
}

.header-stat.sent {
  background: rgba(200, 230, 200, 0.6);
  color: #3d6c3a;
}

.header-stat.sent .dot {
  background: #4caf50;
}

.header-stat.trash {
  background: rgba(197, 156, 112, 0.15);
  color: #76502e;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 18px;
  background: rgba(255, 241, 224, 0.8);
  border: 1px solid rgba(196, 156, 112, 0.18);
  gap: 16px;
}

.toolbar .left-section,
.toolbar .center-section,
.toolbar .right-section {
  display: flex;
  align-items: center;
}

.toolbar .center-section {
  flex: 1;
  justify-content: center;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #5b4631;
}

.search-field {
  position: relative;
  width: 100%;
  max-width: 260px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 38px;
  border: 1px solid rgba(196, 156, 112, 0.25);
  border-radius: 999px;
  background: #fff;
  font-size: 14px;
  color: #4a3725;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: rgba(199, 129, 62, 0.7);
  box-shadow: 0 0 0 4px rgba(199, 129, 62, 0.15);
}

.action-btn {
  padding: 10px 16px;
  background: #c7813e;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.action-btn:hover {
  background: #b36d2b;
  transform: translateY(-1px);
}

.message-actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(196, 156, 112, 0.25);
  border-radius: 12px;
  font-size: 13px;
  cursor: pointer;
  color: #5b4631;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-icon span {
  font-size: 16px;
}

.btn-icon:hover {
  background: rgba(255, 227, 193, 0.7);
  border-color: rgba(196, 156, 112, 0.4);
}

.btn-icon.delete {
  color: #c04a4a;
  border-color: rgba(233, 140, 140, 0.5);
}

.btn-icon.delete:hover {
  background: rgba(255, 200, 200, 0.5);
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.message-item {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 18px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 18px;
  border: 1px solid rgba(196, 156, 112, 0.18);
  box-shadow: 0 12px 30px rgba(198, 150, 103, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.message-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(198, 150, 103, 0.18);
}

.message-item.unread {
  background: rgba(255, 243, 224, 0.9);
  border-color: rgba(214, 163, 110, 0.4);
}

.message-item.read-by-receiver {
  opacity: 0.7;
}

.message-item input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: #c7813e;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  color: #3b2b20;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.message-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-sender {
  font-size: 13px;
  font-weight: 600;
  color: #a4886b;
}

.message-title {
  font-size: 17px;
  font-weight: 700;
  margin: 0;
  color: #3b2b20;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-chip {
  background: rgba(255, 149, 89, 0.2);
  color: #d86f1d;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.message-date {
  font-size: 13px;
  color: #8b7156;
}

.message-preview {
  font-size: 14px;
  color: #5b4631;
  margin: 0;
  line-height: 1.6;
}

.message-actions-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-reply {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(196, 156, 112, 0.35);
  background: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 600;
  color: #7b4b1e;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reply:hover {
  background: rgba(255, 227, 193, 0.7);
}

.btn-more {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.btn-more:hover {
  opacity: 0.9;
}

.read-status {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  background: rgba(255, 218, 218, 0.7);
  color: #c04a4a;
}

.read-status.read {
  background: rgba(200, 230, 200, 0.7);
  color: #3d6c3a;
}

.trash-label {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  background: rgba(196, 156, 112, 0.15);
  color: #76502e;
}

.empty-state,
.empty-result {
  text-align: center;
  padding: 70px 20px;
  border-radius: 20px;
  background: rgba(255, 248, 237, 0.8);
  border: 1px solid rgba(196, 156, 112, 0.15);
}

.empty-state.primary {
  background: rgba(255, 235, 208, 0.45);
}

.empty-illustration {
  font-size: 50px;
  margin-bottom: 16px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 18px;
}

.empty-text {
  font-size: 18px;
  font-weight: 700;
  color: #3b2b20;
  margin: 0 0 10px;
}

.empty-subtext {
  font-size: 14px;
  color: #7e6750;
  margin: 0;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.page-btn {
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(196, 156, 112, 0.25);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #7e6750;
}

.page-btn:hover:not(:disabled):not(.active) {
  background: rgba(255, 227, 193, 0.7);
}

.page-btn.active {
  background: #c7813e;
  color: #fff;
  border-color: #c7813e;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: #fffaf2;
  border-radius: 22px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 30px 60px rgba(59, 43, 32, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 28px;
  border-bottom: 1px solid rgba(196, 156, 112, 0.2);
  background: rgba(255, 239, 220, 0.7);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #3b2b20;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #a4886b;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 227, 193, 0.6);
  color: #3b2b20;
}

.modal-body {
  padding: 28px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 22px;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #3b2b20;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(196, 156, 112, 0.35);
  border-radius: 14px;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: rgba(199, 129, 62, 0.7);
  box-shadow: 0 0 0 4px rgba(199, 129, 62, 0.15);
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(196, 156, 112, 0.35);
  border-radius: 14px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: rgba(199, 129, 62, 0.7);
  box-shadow: 0 0 0 4px rgba(199, 129, 62, 0.15);
}

.modal-footer {
  padding: 20px 28px;
  border-top: 1px solid rgba(196, 156, 112, 0.2);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: rgba(255, 239, 220, 0.6);
}

.btn-cancel {
  padding: 10px 20px;
  background: #fff;
  border: 1px solid rgba(196, 156, 112, 0.35);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #7e6750;
}

.btn-cancel:hover {
  background: rgba(255, 227, 193, 0.7);
}

.btn-send {
  padding: 10px 22px;
  background: #c7813e;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-send:hover {
  background: #b36d2b;
  transform: translateY(-1px);
}

.detail-hero {
  background: linear-gradient(135deg, rgba(255, 214, 187, 0.6), rgba(255, 240, 220, 0.9));
  border-radius: 18px;
  padding: 22px 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #5b4631;
}

.detail-hero.sent {
  background: linear-gradient(135deg, rgba(200, 230, 200, 0.6), rgba(240, 255, 240, 0.9));
}

.hero-label {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: #a06a32;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
}

.hero-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #3b2b20;
}

.hero-subtitle {
  margin: 0;
  font-size: 14px;
  color: #7e6750;
}

.message-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(196, 156, 112, 0.2);
}

.sender-info {
  display: flex;
  gap: 16px;
}

.avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
  color: #3b2b20;
}

.sender-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sender-name {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #3b2b20;
}

.sender-email {
  font-size: 14px;
  color: #7e6750;
  margin: 0;
}

.message-time {
  font-size: 13px;
  color: #a4886b;
  white-space: nowrap;
}

.message-recipient {
  padding: 16px 0;
  background: rgba(255, 248, 237, 0.8);
  font-size: 14px;
  color: #7e6750;
  border-bottom: 1px solid rgba(196, 156, 112, 0.2);
  margin: 20px 0;
  padding-left: 16px;
  border-radius: 12px;
}

.recipient-email {
  font-weight: 600;
  color: #3b2b20;
}

.message-detail-content {
  padding: 0 4px;
  font-size: 15px;
  line-height: 1.75;
  color: #3b2b20;
  white-space: pre-wrap;
  min-height: 200px;
}

@media (max-width: 1024px) {
  .jjokji-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: 2;
  }

  .main-content {
    order: 1;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header__actions {
    width: 100%;
    justify-content: space-between;
  }

  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar .center-section {
    width: 100%;
    justify-content: flex-start;
  }

  .message-item {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
  }

  .message-actions-right {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
}
</style>
