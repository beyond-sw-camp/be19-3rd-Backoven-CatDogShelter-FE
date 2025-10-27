<template>
  <div class="filter-box">

    <select v-model="animalType" @change="applyFilter">
      <option value="">동물종류</option>
      <option value="DOG">강아지</option>
      <option value="CAT">고양이</option>
    </select>

    <select v-model="sortType" @change="applyFilter">
      <option value="">최신순</option>
      <option value="view">조회순</option>
      <option value="liked">추천순</option>
    </select>

    <input
      v-model="keyword"
      @keyup.enter="applyFilter"
      placeholder="검색어 입력..."
    />

    <button @click="applyFilter" class="search-btn">검색</button>

    <button class="post-btn">게시글 등록</button>

  </div>
</template>

<script setup>
const emit = defineEmits(["update"]);

const animalType = defineModel("animalType");
const sortType = defineModel("sortType");
const keyword = defineModel("keyword");

function applyFilter() {
  emit("update");
}
</script>

<style scoped>
.filter-box {
  display: flex;
  gap: 10px;
  margin: 16px 0 24px 0;
}

.filter-box select,
.filter-box input {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.search-btn,
.post-btn {
  border-radius: 8px;
  padding: 10px 18px;
  border: none;
  cursor: pointer;
}

.search-btn {
  background: #6c5ce7;
  color: white;
}

.post-btn {
  background: #ddb98c;
  margin-left: auto;
}
</style>
