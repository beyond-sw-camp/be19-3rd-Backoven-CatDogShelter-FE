<template>
  <main class="home-page">
    <!-- ================= HERO / 첫 배너 ================= -->
    <section class="hero-section">
      <div class="hero-inner">
        <!-- ===== 왼쪽 카피 영역 ===== -->
        <div class="hero-copy fade-up">
          <div class="hero-emoji">🪜 🏡  °☁︎✧ ♡</div>

          <h1 class="hero-title">
            댕냥이들이 새 가족을<br />
            기다리고 있어요
          </h1>

          <p class="hero-desc">
            사랑이 필요한 반려동물들이 당신을 기다립니다.<br />
            작은 관심이 큰 변화를 만듭니다.
          </p>

          <button class="hero-btn" @click="goAdoption">
            입양하러 가기 →
          </button>
        </div>

        <!-- ===== 오른쪽 비주얼 영역 ===== -->
        <div class="hero-art">
          <!-- 구름들 -->
          <img class="cloud cloud-a float-cloud-slow" src="@/assets/cloud.png" alt="" />
          <img class="cloud cloud-b float-cloud-fast" src="@/assets/cloud.png" alt="" />

          <!-- 강아지+고양이 -->
          <img class="pets fade-up delay-1" src="@/assets/dog-cat.png" alt="댕냥이들" />
        </div>
      </div>

      <!-- 하단 곡선 장식 + 움직이는 물결 -->
      <div class="hero-wave">
        <img src="@/assets/wave-bottom.svg" alt="" class="wave-static-svg" />
      </div>
    </section>

    <!-- ================= MAIN CONTENT ================= -->
    <section class="home-main">
      <div class="home-inner">
        <!-- ========= 좌측 메인 영역 ========= -->
        <div class="main-left">
          <!-- [입양 게시판] 카드 3개 가로 -->
          <div class="board-section">
            <div class="board-header">
              <h2>댕냥이들 입양하러 가기</h2>

              <!-- 더보기: 입양 페이지로 -->
              <router-link class="more-link" to="/adoption">더보기 ></router-link>
            </div>

            <!-- 입양 카드 리스트 -->
            <div class="adoption-card-row">
  <article
    class="adoption-card"
    v-for="pet in adoptionList"
    :key="pet.id"
    @click="goAdoptionDetail(pet.id)"
  >
    <div class="adoption-thumb">
      <template v-if="pet.thumbnailUrl && pet.thumbnailUrl.trim() !== ''">
        <img
          class="adoption-img"
          :src="pet.thumbnailUrl"
          :alt="pet.name"
        />
      </template>
      <template v-else>
        <div class="thumb-fallback">사진</div>
      </template>
    </div>

    <div class="adoption-info">
      <h3 class="pet-name">{{ pet.name }}</h3>
      <p class="pet-meta">
        {{ pet.breed }} / {{ pet.age }}살 / 중성화
        {{ pet.neutered ? "O" : "X" }}
      </p>
    </div>
  </article>
</div>
          </div>

          <!-- [봉사모임 게시판] 리스트 -->
          <div class="board-section">
            <div class="board-header">
              <h2>유기견&유기묘 봉사모임</h2>

              <!-- 더보기: 봉사 게시판 메인으로 -->
              <router-link class="more-link" to="/volunteer">더보기 ></router-link>
            </div>

            <ul class="post-list">
              <li
                v-for="post in volunteerList"
                :key="post.id"
                class="post-row post-row-clickable"
                @click="goVolunteerDetail(post.id)"
              >
                <span class="title">{{ post.title }}</span>
                <span class="meta">
                  👥 모집현황 {{ post.viewCount }}
                </span>
              </li>
            </ul>
          </div>

          <!-- [자유게시판] 리스트 -->
          <div class="board-section">
            <div class="board-header">
              <h2>자유게시판</h2>

              <!-- 더보기: 자유게시판 목록으로 -->
              <router-link class="more-link" to="/post">더보기 ></router-link>
            </div>

            <ul class="post-list">
              <li
                v-for="post in freeList"
                :key="post.id"
                class="post-row post-row-clickable"
                @click="goFreeDetail(post.id)"
              >
                <span class="title">{{ post.title }}</span>
                <span class="meta">
                  💬 {{ post.commentCount }}
                  · 👀 {{ post.viewCount }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- ========= 우측 사이드 영역 ========= -->
        <aside class="main-right">
          <!-- 로그인 카드 -->
          <div class="side-card login-card">
            <!-- ====== 비로그인 상태 ====== -->
            <template v-if="!isLoggedIn">
              <div class="login-top">
                <img
                  class="brand-logo"
                  src="@/assets/logo.svg"
                  alt="댕냥쉼터 로고"
                />
              </div>

              <p class="login-title">댕냥쉼터 로그인하기</p>

              <button class="login-btn" @click="goLogin">
                로그인하러 가기
              </button>

              <small class="login-desc">로그인해야 이용하실 수 있어요!</small>
            </template>

            <!-- ====== 로그인 상태 ====== -->
            <template v-else>
              <div class="login-top logged-top">
                <img
                  class="brand-logo big"
                  src="@/assets/logo.svg"
                  alt="댕냥쉼터 로고"
                />
              </div>

              <p class="welcome-line">
                ♡ ·· <strong>{{ userName }}</strong>님 어서오세요!
              </p>

              <div class="profile-row">
                <span class="user-name">{{ userName }}</span>
                <span class="user-badge">{{ userTitle }}</span>

                <button class="mypage-btn" @click="goMypage">
                  마이페이지 열기
                </button>
              </div>
            </template>
          </div>

          <!-- 댕냥히어로즈 -->
          <div class="side-card hero-card">
            <div class="hero-header">
              <h3>이달의 댕냥 히어로즈 🐾</h3>
              <router-link to="/heroes" class="more-link">더보기 ></router-link>
            </div>

            <ol class="hero-list">
              <li v-for="hero in heroList" :key="hero.rank">
                <span class="hero-rank">{{ hero.rank }}위</span>
                <span class="hero-name">{{ hero.name }}</span>
                <em class="hero-hours">{{ hero.hours }}시간</em>
              </li>
            </ol>
          </div>

          <!-- ===== 실종: 댕냥이들을 찾아주세요 ===== -->
          <div class="side-card photo-board">
            <div class="board-header tight">
              <h3>댕냥이들을 찾아주세요</h3>
              <router-link to="/missing" class="more-link">더보기 ></router-link>
            </div>

            <div class="photo-list">
              <!-- 실제 데이터 -->
              <div
                v-for="post in missingPreview"
                :key="post.id"
                class="photo-item"
                @click="goMissingDetail(post.id)"
              >
                <div class="photo-thumb-wrap">
                  <img
                    v-if="post.thumbnailUrl && post.thumbnailUrl.trim() !== ''"
                    class="photo-thumb"
                    :src="post.thumbnailUrl"
                    :alt="post.title || '실종 동물'"
                  />
                  <div v-else class="photo-fallback">사진</div>
                </div>

                <div class="photo-caption">
                  <div class="caption-title">{{ post.title }}</div>
                  <div class="caption-meta">
                    {{ post.animalTypeLabel || '' }}
                    <span
                      v-if="post.animalTypeLabel && post.missingLocation"
                    >·</span>
                    {{ post.missingLocation || '' }}
                  </div>
                </div>
              </div>

              <!-- 아무 글도 없을 때 -->
              <div
                v-if="missingPreview.length === 0"
                class="photo-empty"
              >
                등록된 실종 제보가 없습니다.
              </div>
            </div>
          </div>

          <!-- ===== 목격: 댕냥이들을 목격했어요 ===== -->
          <div class="side-card photo-board">
            <div class="board-header tight">
              <h3>댕냥이들을 목격했어요</h3>
              <router-link to="/sighting" class="more-link">더보기 ></router-link>
            </div>

            <div class="photo-list">
              <div
                v-for="post in sightingPreview"
                :key="post.id"
                class="photo-item"
                @click="goSightingDetail(post.id)"
              >
                <div class="photo-thumb-wrap">
                  <img
                    v-if="post.thumbnailUrl && post.thumbnailUrl.trim() !== ''"
                    class="photo-thumb"
                    :src="post.thumbnailUrl"
                    :alt="post.title || '목격 제보'"
                  />
                  <div v-else class="photo-fallback">사진</div>
                </div>

                <div class="photo-caption">
                  <div class="caption-title">{{ post.title }}</div>
                  <div class="caption-meta">
                    {{ post.missingLocation || post.location || '' }}
                  </div>
                </div>
              </div>

              <div
                v-if="sightingPreview.length === 0"
                class="photo-empty"
              >
                최근 목격 제보가 없습니다.
              </div>
            </div>
          </div>

          <!-- 공지 -->
          <div class="side-card notice-card">
            <h3>공지사항</h3>
            <ul>
              <li v-for="note in noticeList" :key="note.id">
                {{ note.text }}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const API_BASE = "http://localhost:8080";

// ===== 로그인 상태 관련 상태값 =====
const isLoggedIn = ref(false);
const userName = ref("");
const userTitle = ref("");

// ===== 라우팅 함수들 =====
function goLogin() {
  router.push("/login");
}
function goMypage() {
  router.push("/mypage");
}
function goAdoption() {
  router.push("/adoption");
}

// 디테일 페이지용 (id 넘겨서 이동)
function goVolunteerDetail(id) {
  router.push(`/volunteer/detail/${id}`);
}
function goFreeDetail(id) {
  router.push(`/post/${id}`);
}
function goAdoptionDetail(id) {
  router.push(`/adoption/detail/${id}`);
}
function goMissingDetail(id) {
  router.push({
    name: "missing-detail",
    params: { postId: id },
  });
}
function goSightingDetail(id) {
  router.push(`/sighting/${id}`);
}

// ===== 메인 화면에 뿌릴 데이터들 =====
const adoptionList = ref([]);
const volunteerList = ref([]);
const freeList = ref([]);
const heroList = ref([]);
const noticeList = ref([]);
const missingPreview = ref([]);
const sightingPreview = ref([]);

onMounted(async () => {
  // 1) 로그인 여부/프로필 채우기
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    isLoggedIn.value = true;

    // 로그인 시 로그인 로직에서 저장해뒀다고 가정할 값들
    // (백엔드 연동되면 여기서 실제 /me 같은 API fetch로 바꿔주면 돼)
    userName.value =
      sessionStorage.getItem("userName") || "이다인"; // fallback
    userTitle.value =
      sessionStorage.getItem("userTitle") || "댕냥 보호천사";
  } else {
    isLoggedIn.value = false;
    userName.value = "";
    userTitle.value = "";
  }

  // 2) 홈에 필요한 json-server 데이터 로드
  try {
    const [
      adoptionRes,
      volunteerRes,
      freeRes,
      heroRes,
      noticeRes,
      missingRes,
      sightingRes,
    ] = await Promise.all([
      fetch(`${API_BASE}/adoptionPosts`),
      fetch(`${API_BASE}/volunteerPosts`),
      fetch(`${API_BASE}/freePosts`),
      fetch(`${API_BASE}/heroList`),
      fetch(`${API_BASE}/noticeList`),

      // 최근 실종 제보
      fetch(
        `${API_BASE}/missingPosts?_sort=createdAt&_order=desc&_limit=2`
      ),

      // 최근 목격 제보
      fetch(
        `${API_BASE}/sightingPosts?_sort=createdAt&_order=desc&_limit=2`
      ).catch(() => null),
    ]);

    adoptionList.value = await adoptionRes.json();
    volunteerList.value = await volunteerRes.json();
    freeList.value = await freeRes.json();
    heroList.value = await heroRes.json();
    noticeList.value = await noticeRes.json();

    // 실종 미리보기
    const missingRaw = await missingRes.json();
    missingPreview.value = Array.isArray(missingRaw)
      ? missingRaw.map((item) => ({
          id: item.id,
          title: item.title || "",
          thumbnailUrl: item.thumbnailUrl || "",
          animalTypeLabel: item.animalTypeLabel || "",
          missingLocation: item.missingLocation || "",
        }))
      : [];

    // 목격 미리보기
    if (sightingRes && sightingRes.ok) {
      const sightingRaw = await sightingRes.json();
      sightingPreview.value = Array.isArray(sightingRaw)
        ? sightingRaw.map((item) => ({
            id: item.id,
            title: item.title || "",
            thumbnailUrl: item.thumbnailUrl || "",
            missingLocation: item.missingLocation || item.location || "",
          }))
        : [];
    } else {
      sightingPreview.value = [];
    }

    console.log("✅ 홈 데이터 로드 완료:", {
      adoptionList: adoptionList.value,
      volunteerList: volunteerList.value,
      freeList: freeList.value,
      heroList: heroList.value,
      noticeList: noticeList.value,
      missingPreview: missingPreview.value,
      sightingPreview: sightingPreview.value,
      isLoggedIn: isLoggedIn.value,
      userName: userName.value,
      userTitle: userTitle.value,
    });
  } catch (error) {
    console.error("❌ 홈 데이터 로드 실패:", error);
    missingPreview.value = [];
    sightingPreview.value = [];
  }
});
</script>

<style scoped>
/* ========== 공통 폰트/컬러 ========== */
:root {
  --banner-bg: #eacf9f;
  --banner-text-main: #7a4417;
  --banner-text-sub: #4b3a2a;
  --btn-bg: #7a4417;
  --btn-text: #ffffff;
  --surface-light: #efddc9;
  --radius-lg: 16px;
  --radius-md: 12px;
  --shadow-btn: 0 16px 24px rgba(0, 0, 0, 0.15);
  --shadow-pet: 8px 16px 6px rgba(0, 0, 0, 0.3);
  --shadow-cloud: 0 12px 8px rgba(0, 0, 0, 0.18);
  --wave-front: rgba(255, 255, 255, 0.4);
  --wave-back: rgba(255, 255, 255, 0.2);
}

/* 전체 폰트 */
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #222;
  font-family: "Pretendard", "Noto Sans KR", system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    "Noto Sans", sans-serif;
}

/* ================= HERO 배너 ================= */
.hero-section {
  position: relative;
  background-color: var(--banner-bg);
  overflow: hidden;
  background-color: #eacf9f !important;
}

.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 40px 160px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
  row-gap: 48px;
}

/* ===== 텍스트 영역 ===== */
.hero-copy {
  max-width: 560px;
  color: var(--banner-text-main);
  flex: 1 1 480px;
}

/* ⭐ 텍스트 페이드업 진입 애니메이션 */
.fade-up {
  opacity: 0;
  transform: translateY(24px);
  animation: fadeUp 0.9s ease-out forwards;
}
.delay-1 {
  animation-delay: 0.15s;
}
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-emoji {
  font-size: 40px;
  line-height: 1.2;
  margin-bottom: 24px;
}

.hero-title {
  font-size: clamp(2.4rem, 1.2rem + 2vw, 4rem);
  color: #7a4417 !important;
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin: 0 0 32px;
  word-break: keep-all;
}

.hero-desc {
  font-size: 1.25rem;
  line-height: 1.5;
  color: var(--banner-text-sub);
  margin-bottom: 32px;
  word-break: keep-all;
}

.hero-btn {
  background-color: rgb(68, 11, 11);
  color: rgba(229, 219, 219, 0.989);
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  padding: 16px 24px;
  box-shadow: var(--shadow-btn);
  cursor: pointer;
  line-height: 1.2;
  transition: all 0.15s ease;
  border: none;
}
.hero-btn:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

/* ===== 오른쪽 비주얼 ===== */
.hero-art {
  position: relative;
  padding: 0 30px 0 0;
  flex: 0 1 480px;
  min-width: 360px;
  max-width: 520px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.cloud {
  position: absolute;
  width: 180px;
  max-width: 40vw;
  filter: drop-shadow(var(--shadow-cloud));
  user-select: none;
  pointer-events: none;
}

/* ⭐ 구름 둥실 애니메이션 */
.float-cloud-slow {
  animation: floatSlow 3.5s ease-in-out infinite alternate;
}
.float-cloud-fast {
  animation: floatFast 3.5s ease-in-out infinite alternate;
}
@keyframes floatSlow {
  0% { transform: translate(-30%, 0px); }
  100% { transform: translate(-30%, -12px); }
}
@keyframes floatFast {
  0% { transform: translate(30%, 0px); }
  100% { transform: translate(30%, -16px); }
}

.cloud-a {
  top: -20px;
  left: 0;
}
.cloud-b {
  top: -60px;
  right: 0;
}

.pets {
  position: relative;
  display: block;
  width: 480px;
  max-width: 90%;
  height: auto;
  filter: drop-shadow(var(--shadow-pet));
  border-radius: 12px;
  z-index: 2;
  user-select: none;
}

/* ===== 하단 웨이브 ===== */
.hero-wave {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -40px;
  height: 160px;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  background: radial-gradient(
    200% 100px at 50% 0%,
    var(--surface-light) 0%,
    var(--surface-light) 60%,
    transparent 61%
  );
}

.wave-layer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 200%;
  height: 80px;
  background-repeat: repeat-x;
  background-size: 50% 80px;
  opacity: 1;
  filter: blur(0.3px) drop-shadow(0 -2px 6px rgba(0,0,0,0.08));
}

/* 뒤 웨이브 */
.wave-back {
  background-image: radial-gradient(
    circle at 50% 10%,
    var(--wave-back) 0%,
    rgba(255,255,255,0) 70%
  );
  animation: waveBackMove 12s linear infinite;
  height: 90px;
  bottom: 20px;
}
@keyframes waveBackMove {
  from { transform: translateX(0); }
  to   { transform: translateX(-25%); }
}

/* 앞 웨이브 */
.wave-front {
  background-image: radial-gradient(
    circle at 50% 0%,
    var(--wave-front) 0%,
    rgba(255,255,255,0) 70%
  );
  animation: waveFrontMove 6s linear infinite;
  mix-blend-mode: screen;
}
@keyframes waveFrontMove {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ================= 메인 2컬럼 레이아웃 ================= */
.home-main {
  background-color: #f8f1e5;
  padding: 60px 120px 100px;
}

.home-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 40px;
  padding: 0 24px;
}

/* ===== 좌측 게시판 공통 카드 ===== */
.main-left {
  display: flex;
  flex-direction: column;
  row-gap: 40px;
}

.board-section {
  background: #fffdf9;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.board-header.tight {
  margin-bottom: 12px;
}
.board-header h2,
.board-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #3a2514;
  line-height: 1.3;
  word-break: keep-all;
}
.more-link {
  font-size: 0.875rem;
  color: #7a4417;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

/* ===== 입양 카드 가로 3개 ===== */
.adoption-card-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 24px;
}
.adoption-card {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  cursor: pointer;
}
.adoption-card:hover .pet-name {
  color: #7a4417;
}
.adoption-thumb {
  background-color: #e8d3b5;
  border-radius: var(--radius-md);
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a412a;
  font-weight: 600;
  font-size: 14px;
}
.adoption-info .pet-name {
  font-size: 1rem;
  font-weight: 600;
  color: #3a2514;
  line-height: 1.3;
  transition: color 0.15s;
}
.adoption-info .pet-meta {
  font-size: 0.875rem;
  color: #6b5a4a;
  line-height: 1.4;
}

/* ===== 리스트형 게시판 공통 ===== */
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}
.post-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.post-row:last-child {
  border-bottom: 0;
}
.post-row .title {
  color: #3a2514;
}
.post-row .meta {
  color: #8a7461;
  font-size: 0.875rem;
  white-space: nowrap;
}

/* 클릭 가능한 리스트일 때 */
.post-row-clickable {
  cursor: pointer;
}
.post-row-clickable:hover .title {
  color: #7a4417;
}
.post-row-clickable:hover .meta {
  color: #7a4417;
}

/* ===== 우측 사이드 ===== */
.main-right {
  display: flex;
  flex-direction: column;
  row-gap: 24px;
}

/* 공통 사이드 카드 */
.side-card {
  background: #fffdf9;
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

/* 로그인 카드 */
.login-card {
  text-align: center;
}

/* 로고 영역 */
.login-top {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.login-top.logged-top {
  margin-bottom: 16px;
}

.brand-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.brand-logo.big {
  width: 60px;
  height: 60px;
}

.login-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #3a2514;
  font-size: 1rem;
}
.login-btn {
  background: #7a4417;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.login-btn:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}
.login-desc {
  display: block;
  color: #6b5a4a;
  font-size: 0.875rem;
  line-height: 1.4;
}
/* ===== 로그인 후 상태 ===== */
.welcome-line {
  font-size: 0.9rem;
  color: #3a2514;
  line-height: 1.4;
  margin-bottom: 12px;
  text-align: left;
}
.welcome-line strong {
  font-weight: 600;
  color: #3a2514;
}

/* 아랫줄: 이름 + 뱃지 + 버튼 라인 */
.profile-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 8px;
  column-gap: 8px;
  text-align: left;
  justify-content: flex-start;
}

/* 유저명 */
.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2b1a0b;
  line-height: 1.2;
}

/* 뱃지 (댕냥 보호천사) */
.user-badge {
  background-color: #efefef;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.75rem;
  line-height: 1.2;
  color: #4a4a4a;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid rgba(0,0,0,0.08);
}

/* 마이페이지 버튼 (노란버튼 느낌) */
.mypage-btn {
  margin-left: auto;
  background-color: #e6d19d;
  color: #2b1a0b;
  border: none;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 0.8rem;
  line-height: 1.2;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  white-space: nowrap;
}
.mypage-btn:hover {
  filter: brightness(1.03);
  transform: translateY(-1px);
}

/* 히어로 카드 */
.hero-card .hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.hero-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #3a2514;
  line-height: 1.3;
}
.hero-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.hero-list li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center; 
  column-gap: 8px;
  font-size: 0.9rem;
  color: #5a412a;
  line-height: 1.5;
}
.hero-rank {
  min-width: 1.5em;
  font-weight: 600;
  color: #7a4417;
  text-align: right;
}
.hero-name {
  text-align: left;
  padding: 0 0 0 10px;
}
.hero-hours {
   min-width: 2em; 
   text-align: right;
  font-style: normal;
  font-weight: 600;
  color: #7a4417;
  white-space: nowrap;
}

/* ====== 실종/목격 사이드카드 ====== */

/* 전체 카드 컨테이너 */
.photo-board .photo-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 12px;
}

/* 개별 항목 카드 */
.photo-item {
  cursor: pointer;
  background: #e3cfb8;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.07);
  padding: 12px;
  display: grid;
  grid-template-columns: 80px 1fr;
  column-gap: 12px;
  align-items: center;
  color: #2a1c10;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

/* 썸네일 래퍼 */
.photo-thumb-wrap {
  width: 100%;
  height: 80px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 썸네일 이미지 */
.photo-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 썸네일 없을 때 fallback */
.photo-fallback {
  width: 100%;
  height: 80px;
  border-radius: 4px;
  background: #d9c2a7;
  color: #2a1c10;
  border: 1px solid rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
}

/* 오른쪽 텍스트 */
.photo-caption {
  min-width: 0;
}
.caption-title {
  font-size: 14px;
  font-weight: 600;
  color: #2a1c10;
  line-height: 1.4;
  margin-bottom: 4px;
  word-break: keep-all;
}
.caption-meta {
  font-size: 12px;
  line-height: 1.4;
  color: rgba(0,0,0,0.6);
  word-break: keep-all;
}

/* 비어있을 때 */
.photo-empty {
  background: #efe8dd;
  color: rgba(0,0,0,0.5);
  border: 1px dashed rgba(0,0,0,0.2);
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  padding: 24px 12px;
  text-align: center;
}

/* 공지 */
.notice-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #3a2514;
  margin-bottom: 12px;
}
.notice-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  row-gap: 6px;
}
.notice-card li {
  color: #5a412a;
  font-size: 0.9rem;
}

/* ================= 반응형 ================= */
@media (max-width: 768px) {
  .hero-inner {
    padding: 56px 20px 140px;
    justify-content: center;
    flex-direction: column;
    text-align: center;
  }

  .hero-copy {
    text-align: center;
    margin: 0 auto;
  }

  .hero-emoji {
    font-size: 32px;
  }

  .hero-title {
    font-size: clamp(2rem, 1rem + 2vw, 2.5rem);
    color: rgb(68, 11, 11);
  }

  .hero-desc {
    font-size: 1rem;
  }

  .hero-btn {
    width: auto;
    margin: 0 auto;
  }

  .hero-art {
    min-width: 280px;
    max-width: 360px;
    margin-top: 32px;
  }

  .cloud {
    width: 140px;
  }

  .cloud-a {
    top: -10px;
    left: 20px;
  }

  .cloud-b {
    top: -30px;
    right: 20px;
  }

  .pets {
    width: 360px;
    max-width: 100%;
  }

  .home-inner {
    grid-template-columns: 1fr;
  }
}

.hero-section {
  position: relative;
  background-color: #eacf9f;
  overflow: visible;
}

.hero-wave-static {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -40px;
  height: 140px;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}
.wave-static-svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.adoption-thumb {
  background-color: #e8d3b5;
  border-radius: var(--radius-md);
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a412a;
  font-weight: 600;
  font-size: 14px;
  overflow: hidden;          /* 이미지가 둥근 라운드 밖으로 안 튀게 */
  border: 1px solid rgba(0,0,0,0.05);
}

.adoption-img {
  width: 100%;
  height: 100%;
  object-fit: cover;         /* 꽉 채우되 비율 유지 */
  display: block;
}

.thumb-fallback {
  /* 예전 fallback 박스 유지하고 싶으면 여기에 스타일 계속 둬도 돼 */
  text-align: center;
}
</style>