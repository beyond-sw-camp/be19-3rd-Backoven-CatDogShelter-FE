<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  user: { type: Object, default: () => ({ name: '회원' }) },
})
const emit = defineEmits(['update:modelValue'])

const handle = computed(() => {
  // 단순 핸들 생성(백엔드 없음): 공백 제거 + 소문자
  const base = (props.user?.name || 'member').replace(/\s+/g, '').toLowerCase()
  return '@' + base
})

function close() { emit('update:modelValue', false) }
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="backdrop" @click.self="close">
      <div class="modal" role="dialog" aria-modal="true" aria-label="회원 정보">
        <header class="head">
          <div class="title">
            <img class="avatar" src="@/assets/인원아이콘.svg" alt="" />
            <div class="name-row">
              <strong class="name">{{ user?.name }}</strong>
              <span class="badge">댕냥 보호천사</span>
              <div class="handle">{{ handle }}</div>
            </div>
          </div>
          <button class="x" @click="close">✕</button>
        </header>

        <section class="grid">
          <div class="card">
            <div class="label">총 봉사시간</div>
            <div class="val">64시간</div>
          </div>
          <div class="card">
            <div class="label">이달의 봉사시간</div>
            <div class="val">32시간</div>
          </div>
          <div class="card">
            <div class="label">봉사횟수</div>
            <div class="val">45회</div>
          </div>
          <div class="card">
            <div class="label">작성글</div>
            <div class="val">11개</div>
          </div>
          <div class="card">
            <div class="label">댓글</div>
            <div class="val">02개</div>
          </div>
        </section>

        <section class="row">
          <span class="muted">가입일</span>
          <span>2025-07-14</span>
        </section>

        <footer class="foot">
          <button class="btn" @click="close">닫기</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:1000}
.modal{width:640px;max-width:92vw;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.2);overflow:hidden}
.head{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid #eee}
.title{display:flex;align-items:center;gap:12px}
.avatar{width:36px;height:36px;object-fit:contain}
.name-row{display:flex;flex-direction:column;gap:2px}
.name{font-size:18px}
.badge{display:inline-block;font-size:12px;background:#f1f1f1;border:1px solid #e8e8e8;border-radius:999px;padding:2px 8px;color:#444;width:max-content}
.handle{font-size:12px;color:#7a7a7a}
.x{border:0;background:transparent;font-size:18px;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:16px 18px}
.card{background:#fff7ed;border:1px solid #fde2c1;border-radius:12px;padding:14px}
.label{color:#a0752b;font-size:12px;margin-bottom:6px}
.val{font-weight:800;font-size:18px}
.row{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-top:1px solid #f2f2f2}
.muted{color:#777}
.foot{padding:12px 18px;display:flex;justify-content:flex-end;border-top:1px solid #f2f2f2}
.btn{border:0;background:#222;color:#fff;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer}
</style>
