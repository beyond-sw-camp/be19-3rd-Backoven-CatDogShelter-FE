<template>
  <div class="user-messages-page">
    <div class="messages-container">
      <h1 class="page-title">내 쪽지</h1>
      
      <div class="messages-box">
        <div class="messages-tabs">
          <button 
            class="tab" 
            :class="{ active: activeTab === 'received' }"
            @click="activeTab = 'received'"
          >
            받은 쪽지 ({{ receivedMessages.length }})
          </button>
          <button 
            class="tab" 
            :class="{ active: activeTab === 'sent' }"
            @click="activeTab = 'sent'"
          >
            보낸 쪽지 ({{ sentMessages.length }})
          </button>
        </div>

        <div class="messages-list">
          <div 
            v-for="message in currentMessages" 
            :key="message.id"
            class="message-item"
            @click="openMessage(message)"
          >
            <div class="message-header">
              <span class="message-from">{{ message.from }}</span>
              <span class="message-date">{{ message.date }}</span>
            </div>
            <h4 class="message-subject">{{ message.subject }}</h4>
            <p class="message-preview">{{ message.preview }}</p>
            <span v-if="!message.read && activeTab === 'received'" class="unread-badge">새 쪽지</span>
          </div>

          <div v-if="currentMessages.length === 0" class="no-messages">
            {{ activeTab === 'received' ? '받은 쪽지가 없습니다' : '보낸 쪽지가 없습니다' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('received')

const receivedMessages = ref([
  {
    id: 1,
    from: '관리자',
    subject: '댕냥쉼터에 오신 것을 환영합니다!',
    preview: '안녕하세요! 댕냥쉼터 가입을 진심으로 환영합니다. 유기동물 보호에...',
    date: '2025-10-20',
    read: false
  }
])

const sentMessages = ref([])

const currentMessages = computed(() => {
  return activeTab.value === 'received' ? receivedMessages.value : sentMessages.value
})

function openMessage(message) {
  alert(`쪽지 내용:\n\n${message.subject}\n\n준비 중입니다...`)
  message.read = true
}
</script>

<style scoped>
.user-messages-page {
  min-height: 100vh;
  background: #faf8f5;
  padding: 40px 20px;
}

.messages-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #3d2f1f;
  margin-bottom: 32px;
}

.messages-box {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.messages-tabs {
  display: flex;
  border-bottom: 1px solid #e8e0d5;
}

.tab {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #8b7355;
  cursor: pointer;
  transition: all 0.3s;
}

.tab.active {
  color: #f0b762;
  border-bottom: 3px solid #f0b762;
}

.tab:hover {
  background: #f9f9f9;
}

.messages-list {
  padding: 20px;
}

.message-item {
  padding: 20px;
  border-radius: 12px;
  background: #fafaf8;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #f5f0e8;
  position: relative;
}

.message-item:hover {
  background: #f5f0e8;
  transform: translateX(4px);
  border-color: #e8e0d5;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.message-from {
  font-weight: 600;
  color: #3d2f1f;
  font-size: 0.95rem;
}

.message-date {
  font-size: 0.85rem;
  color: #999;
}

.message-subject {
  font-size: 1rem;
  font-weight: 600;
  color: #3d2f1f;
  margin: 0 0 8px 0;
}

.message-preview {
  font-size: 0.9rem;
  color: #6b5744;
  margin: 0;
  line-height: 1.5;
}

.unread-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 10px;
  background: #f0b762;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.no-messages {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .user-messages-page {
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .messages-list {
    padding: 16px;
  }

  .tab {
    font-size: 0.9rem;
  }
}
</style>