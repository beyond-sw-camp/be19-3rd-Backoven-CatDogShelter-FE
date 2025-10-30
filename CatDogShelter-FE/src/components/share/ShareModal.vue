<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
      <div class="share-modal">
        <div class="modal-header">
          <h3 class="modal-title">댕냥터 게시글 공유하기</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">가족을 기다리는 댕냥이의 이야기를 함께 퍼뜨려주세요 :_)</p>
          <div class="share-url-box">
            <input 
              type="text" 
              class="share-url-input" 
              :value="shareUrl" 
              readonly
              ref="shareUrlInput"
            />
            <button class="copy-btn" @click="copyUrl">
              <span class="copy-icon">📋</span>
            </button>
          </div>
          <button class="link-copy-btn" @click="copyUrl">
            링크 복사
          </button>
          <button class="cancel-btn" @click="closeModal">
            취소
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  reviewId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const shareUrlInput = ref(null)
const route = useRoute()
const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'

const shareUrl = computed(() => {
  if (route?.fullPath) {
    return `${origin}${route.fullPath}`
  }
  if (props.reviewId != null) {
    return `${origin}/volunteer/review/${props.reviewId}`
  }
  return origin
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    alert('링크가 복사되었습니다!')
  } catch (err) {
    // 복사 실패 시 입력 필드를 선택하여 수동 복사 가능하게 함
    if (shareUrlInput.value) {
      shareUrlInput.value.select()
      document.execCommand('copy')
      alert('링크가 복사되었습니다!')
    }
  }
}
</script>

<style scoped>
/* 공유하기 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.share-modal {
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 440px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f5f0e8;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #8b7355;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
}

.modal-close:hover {
  background: #f5f0e8;
}

.modal-body {
  padding: 24px;
}

.modal-description {
  font-size: 0.95rem;
  color: #6b5744;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.share-url-box {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  background: #f5f0e8;
  padding: 12px;
  border-radius: 12px;
}

.share-url-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e8e0d5;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  color: #3d2f1f;
}

.copy-btn {
  padding: 8px 16px;
  background: #f0b762;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn:hover {
  background: #e8a54d;
}

.copy-icon {
  font-size: 1.2rem;
}

.link-copy-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 10px;
}

.link-copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 183, 98, 0.4);
}

.cancel-btn {
  width: 100%;
  padding: 14px;
  background: white;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #6b5744;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #f5f0e8;
}
</style>
