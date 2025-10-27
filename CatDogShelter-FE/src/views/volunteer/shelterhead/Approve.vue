<!-- Approve.vue -->
<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-box">
      <h3 class="modal-title">신청 승인</h3>
      <p class="modal-desc">이 신청의 상태를 승인완료로 변경할까요?</p>

      <div class="form-group">
        <label>신청자</label>
        <input type="text" v-model="form.name" readonly />
      </div>

      <div class="form-group">
        <label>신청 번호</label>
        <input type="text" v-model="form.id" readonly />
      </div>

      <div class="form-group">
        <label>승인 상태</label>
        <input type="text" v-model="form.status" readonly />
      </div>

      <div class="button-group">
        <button class="cancel-btn" @click="closeModal">취소</button>
        <button class="approve-btn" @click="approve">승인하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, reactive, watch } from 'vue'

const emit = defineEmits(['close', 'approve'])
const props = defineProps({
  applicant: {
    type: Object,
    required: true
  }
})

const form = reactive({
  name: '',
  id: '',
  status: '승인대기'
})

watch(
  () => props.applicant,
  (value) => {
    if (!value) {
      form.name = ''
      form.id = ''
      form.status = '승인대기'
      return
    }
    form.name = value.name ?? ''
    form.id = value.id ?? ''
    form.status = value.status ?? '승인대기'
  },
  { immediate: true }
)

const closeModal = () => emit('close')

const approve = () => {
  form.status = form.status === '승인완료' ? '승인대기' : '승인완료'
  emit('approve', { ...form })
}
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: #fff8f0;
  border-radius: 12px;
  padding: 30px 40px;
  width: 320px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  text-align: center;
  color: #333;
}

.modal-desc {
  text-align: center;
  color: #666;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  color: #444;
  margin-bottom: 4px;
}

input {
  background: #fff7ec;
  border: 1px solid #e0d3c2;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 14px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-btn, .approve-btn {
  flex: 1;
  margin: 0 4px;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

.cancel-btn {
  background: #f1f1f1;
  color: #333;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.approve-btn {
  background: #d1a55c;
  color: white;
}

.approve-btn:hover {
  background: #c29349;
}
</style>
