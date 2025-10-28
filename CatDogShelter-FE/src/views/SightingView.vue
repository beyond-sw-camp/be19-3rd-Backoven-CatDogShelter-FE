<template>
  <div>
    <h1>목격 제보</h1>
    <h4>길 잃은 반려동물을 목격하셨나요? 제보해주세요.</h4>
  </div>
  <div>
    <h3>목격 제보 안내</h3>
    <h4>길 잃은 반려동물을 발견하셨다면 사진과 위치를 함께 올려주세요. 보호자가 찾을 수 있도록 도와주세요.</h4>
  </div>

  <template v-if = "loading"></template>
  <!-- 필터링 영역 -->
  <template v-else>
    <!-- 제목, 내용, 작성자 검색란 -->
    <div>
      <select v-model = "searchOption">
        <option v-for="item in items" :key="item" :value = "item">{{ item }}</option>
      </select>
      <input type = "text" v-model = "input">
      <button @click = "searchButton">검색</button>
    </div>

    <!-- 필터링 영역 -->
    <div>
      <p @click = "filter = !filter;">필터</p>
      <template v-if="filter">
        <hr>
        <template v-if="true" id = "animalCategoryFilter">
          <label>동물 종류</label>
          <select v-model="search.animalType">
            <option v-for="animal in animalCategory" :key="animal" :value = "animal">{{ animal }}</option>
          </select>
        </template>
        <br>
        <template v-if="true" id = "breedFilter">
          <label>품종</label>
          <input type = "text" v-model = "search.breed">
        </template>
        <br>
        <template v-if="true" id = "colorFilter">
          <label>색상</label>
          <input type = "text" v-model = "search.color">
        </template>
        <br>
        <template v-if="true" id = "sigunguFilter">
          <label>발견 장소</label>
          <select v-model = "search.sigunguCode">
            <option v-for = "(name, index) in sigunguNames" :key = "name" :value = "index + 1">{{ name }}</option>
          </select>
        </template>
        <br>
        <button @click = "searchButton">검색</button>
      </template>
      <label>총 {{ totalCount }}개의 게시글</label>
      <select v-model = "search.order">
        <option v-for= "(orderName, index) in orders" :key = "orderName" :value = "index">{{ orderName }}</option>
      </select>
    </div>

    <div id = "summary">
      
    </div>
  </template>


</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'

  const loading = ref(true);
  const filter = ref(false);
  const items = ref(['title', 'content', 'writer']);
  const searchOption = ref("title");
  const input = ref("");

  const sigunguNames = [
    '',
    '종로구',
    '중구',
    '용산구',
    '성동구',
    '광진구',
    '동대문구',
    '중랑구',
    '성북구',
    '강북구',
    '도봉구',
    '중구',
    '서구',
    '동구',
    '영도구',
    '부산진구',
    '중구',
    '동구',
    '서구',
    '중구',
    '동구',
    '남구',
    '동구',
    '동구',
    '중구',
    '수원시',
    '수원시 장안구',
    '수원시 권선구',
    '춘천시',
    '청주시',
  ]
  const orders = [
    "최신순",
    "오래된 순",
    "조회순",
    "조회 낮은순",
    "좋아요순",
    "좋아요 낮은순"
  ]


  const posts = reactive([]);
  const totalCount = ref(0);
  const totalPages = ref(1);
  const currentPage = ref(1);


  const animalCategory = ['', "CAT", "DOG"];
  const search = reactive({
    writer: '',
    title: '',
    content: '',
    animalType: '',
    breed: '',
    color: '',
    sigunguCode: 0,
    order: 0
  });

  const initSearch = () => {
    search.writer = '';
    search.title = '';
    search.content = '';
  }

  const searchButton = () => {
    initSearch();

    const key = searchOption.value.toLowerCase(); // 예: '제목' → 'title', '내용' → 'content'
    search[key] = input.value;
    // console.log(search);
    // console.log(posts);

    currentPage.value = 1;
    fetchSightingPost(currentPage.value);
  }

  // 이미지 파일을 호출하기 위한 함수
  const getFileURL = (file) => {
    if(!file) return ''
    return `http://localhost:8000/post-service/file/${file.filePath}${file.fileRename}`
  }

  const getPostURL = (page = 1) => {
    let url = `http://localhost:8000/post-service/sighting-post/summary?page=${page}&size=10`;
    
    if(search.writer != '') url += `&writer=${search.writer}`;
    if(search.title != '') url += `&title=${search.title}`;
    if(search.content != '') url += `&content=${search.content}`;
    if(search.animalType != '') url += `&animalType=${search.animalType}`;
    if(search.breed != '') url += `&breed=${search.breed}`;
    if(search.color != '') url += `&color=${search.color}`;
    if(search.sigunguCode != 0) url += `&sigunguCode=${search.sigunguCode}`;
    if(search.order >= 0) url += `&order=${search.order}`;

    return url;
  }

  const fetchSightingPost = async (page = 1) => {
    try {
      const res = await fetch(getPostURL(page));
      const data = await res.json();
      posts.value = data.content;
      totalCount.value = data.totalCount;
      totalPages.value = data.totalPages;
      currentPage.value = data.currentPage;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  } ;

  onMounted(() => {
    fetchSightingPost();
  })

</script>

<style scoped>

</style>