<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  user: { type: Object, default: () => ({ name: '회원' }) },
})
const emit = defineEmits(['update:modelValue'])

const text = ref('')
const max = 500

watch(() => props.modelValue, v => { if (v) text.value = '' })

function close(){ emit('update:modelValue', false) }
function send(){
  // 백엔드 없음: 로컬 알림만
  alert('쪽지를 보냈습니다.')
  close()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="backdrop" @click.self="close">
      <div class="modal" role="dialog" aria-modal="true" aria-label="쪽지 보내기">
        <header class="head">
          <div class="title">
            <img class="ico" src="@/assets/이메일아이콘.svg" alt="" />
            <strong>쪽지 보내기</strong>
          </div>
          <button class="x" @click="close">✕</button>
        </header>

        <section class="body">
          <p class="muted">{{ user?.name }} 님에게 쪽지를 보냅니다.</p>

          <label class="field">
            <span class="label">받는 사람</span>
            <div class="receiver">
              <span class="pill">{{ user?.name }}</span>
            </div>
          </label>

          <label class="field">
            <span class="label">내용 <b class="req">*</b></span>
            <textarea v-model="text" :maxlength="max" rows="6"
                      placeholder="쪽지 내용을 입력하세요..." />
            <div class="count">{{ text.length }} / {{ max }}</div>
          </label>
        </section>

        <footer class="foot">
          <button class="btn ghost" @click="close">취소</button>
          <button class="btn primary" :disabled="!text.trim()" @click="send">쪽지 보내기</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:1000}
.modal{width:520px;max-width:92vw;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.2);overflow:hidden}
.head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #eee}
.title{display:flex;align-items:center;gap:8px}
.ico{width:20px;height:20px;object-fit:contain}
.x{border:0;background:transparent;font-size:18px;cursor:pointer}
.body{padding:16px}
.muted{color:#777;margin:0 0 12px}
.field{display:block;margin-bottom:14px}
.label{display:block;font-size:13px;color:#666;margin-bottom:6px}
.req{color:#e5484d}
.receiver{display:flex;gap:6px}
.pill{background:#f1f1f1;border:1px solid #e8e8e8;border-radius:999px;padding:6px 10px;font-weight:700}
textarea{width:100%;border:1px solid #ddd;border-radius:10px;padding:10px;resize:vertical;font:inherit}
.count{text-align:right;color:#999;font-size:12px;margin-top:6px}
.foot{padding:12px 16px;display:flex;justify-content:flex-end;gap:8px;border-top:1px solid #f2f2f2}
.btn{border:0;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer}
.btn.ghost{background:#f2f2f2}
.btn.primary{background:#222;color:#fff}
.btn:disabled{opacity:.6;cursor:default}
</style>
