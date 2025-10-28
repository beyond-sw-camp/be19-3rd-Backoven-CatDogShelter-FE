<template>
  <div class="filter-wrap">
    <!-- ── 상단 검색 바: [제목] [검색 인풋] ── -->
    <div class="search-bar">
      <div class="search-select">
        <span>제목</span>
        <i class="caret">▾</i>
      </div>
      <div class="search-input">
        <img class="icon" :src="searchIcon" alt="검색 아이콘" />
        <input
          v-model.trim="keyword"
          @keyup.enter="applyFilter"
          placeholder="제목으로 검색..."
        />
      </div>
    </div>

    <!-- ── 하단 필터 바: 3 셀렉트 + 오른쪽 검색 버튼 ── -->
    <div class="filter-bar">
      <div class="filter-head">
        <img class="emoji" :src="searchIcon" alt="검색 아이콘" />
        <span class="title">필터</span>
        <span class="help">동물의 상태를 빠르게 선택해서 조회가 가능해요</span>
      </div>

      <div class="controls">
        <!-- 동물종류 -->
        <div class="control">
          <label>동물종류</label>
          <select v-model="animalType" @change="applyFilter">
            <option value="">전체</option>
            <option value="DOG">강아지</option>
            <option value="CAT">고양이</option>
          </select>
        </div>

        <!-- 예방접종 여부 -->
        <div class="control">
          <label>예방접종 여부</label>
          <select v-model="vaccinated" @change="applyFilter">
            <option value="">전체</option>
            <option value="Y">예</option>
            <option value="N">아니오</option>
          </select>
        </div>

        <!-- 중성화 여부 -->
        <div class="control">
          <label>중성화 여부</label>
          <select v-model="neutered" @change="applyFilter">
            <option value="">전체</option>
            <option value="Y">예</option>
            <option value="N">아니오</option>
          </select>
        </div>

        <!-- 오른쪽 고정 검색 버튼 -->
        <div class="control btn-cell">
          <button class="btn-search" @click="applyFilter">검색</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import searchIcon from '@/assets/돋보기아이콘.svg'
const emit = defineEmits(['update'])

/* 부모 v-model 연동 */
const keyword    = defineModel('keyword',    { type: String, default: '' })
const animalType = defineModel('animalType', { type: String, default: '' })
const vaccinated = defineModel('vaccinated', { type: String, default: '' }) // 'Y' | 'N' | ''
const neutered   = defineModel('neutered',   { type: String, default: '' }) // 'Y' | 'N' | ''

function applyFilter() { emit('update') }
</script>

<style scoped>
.filter-wrap {
  display: grid;
  gap: 12px;
  margin: 16px 0 24px 0;
}

/* ── 상단 검색 바 ── */
.search-bar {
  display: grid;
  grid-template-columns: 120px 1fr;  /* [제목] [인풋] */
  gap: 10px;
  background: #f6f3ee;
  border: 1px solid #ebe4da;
  border-radius: 12px;
  padding: 10px;
}

.search-select {
  display: flex; align-items: center; justify-content: space-between;
  background: #fff;
  border: 1px solid #e9e2d7;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px; color: #645a4f;
  height: 38px;
}
.search-select .caret { opacity: .6; }

.search-input {
  display: flex; align-items: center; gap: 8px;
  background: #f4f4f7;
  border: 1px solid #e9e2d7;
  border-radius: 10px;
  padding: 0 12px;
  height: 38px;
}
.search-input input {
  width: 100%; height: 100%;
  border: none; outline: none; background: transparent;
  font-size: 14px;
}
.icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.75;
  pointer-events: none;
}

.emoji {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  pointer-events: none;
}

/* ── 하단 필터 바 ── */
.filter-bar {
  background: #fff;
  border: 1px solid #eee4d6;
  border-radius: 12px;
  padding: 12px;
}
.filter-head {
  display: flex; align-items: center; gap: 8px;
  color: #8a8276; margin-bottom: 10px;
}
.filter-head .title { font-weight: 700; color: #6f665a; }
.filter-head .help { font-size: 12px; color: #a39a8d; }

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 140px; /* 3셀렉트 + 검색버튼 */
  gap: 12px;
}
.control { display: grid; gap: 6px; }
.control label { font-size: 12px; color: #867b6f; }

.control select {
  height: 42px; border-radius: 12px;
  border: 1px solid #e9e2d7; background: #faf8f5;
  padding: 0 12px; font-size: 14px; color: #453e35;
}

.btn-cell { display: flex; align-items: end; }
.btn-search {
  width: 100%; height: 42px;
  border-radius: 12px; border: none;
  background: #ecebed;
  font-weight: 700; color: #333; cursor: pointer;
  transition: .16s ease;
}
.btn-search:hover { background: #dedde1; }

@media (max-width: 900px) {
  .controls { grid-template-columns: 1fr 1fr; }
  .btn-cell { grid-column: span 2; }
}
</style>
