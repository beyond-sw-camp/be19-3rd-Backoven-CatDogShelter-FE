<script setup>
const props = defineProps({
  user: { type: Object, default: () => ({ name: '회원' }) }
})
const emit = defineEmits(['close','view-profile','send-message'])

function openProfile(){ emit('view-profile', props.user) }
function openMessage(){ emit('send-message', props.user) }
</script>

<template>
  <div class="menu" @mouseleave="$emit('close')">
    <button class="item" @click="openProfile">
      <img class="ico" src="@/assets/인원아이콘.svg" alt="" /> 회원정보 보기
    </button>
    <button class="item" @click="openMessage">
      <img class="ico" src="@/assets/이메일아이콘.svg" alt="" /> 쪽지 보내기
    </button>
  </div>
</template>

<style scoped>
.menu{position:absolute;top:28px;left:0;background:#fff;border:1px solid #e8e8e8;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,.12);padding:6px 0;min-width:180px;z-index:50}
.item{width:100%;display:flex;align-items:center;gap:8px;padding:10px 14px;border:0;background:#fff;text-align:left;cursor:pointer}
.item:hover{background:#f7f7f7}
.ico{width:18px;height:18px;object-fit:contain}
</style>
