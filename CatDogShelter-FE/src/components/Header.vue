<template>
  <header class="site-header">
    <nav class="navbar">
      <!-- 왼쪽: 로고 + 메뉴 -->
      <div class="nav-left">
        <RouterLink to="/" class="logo" aria-label="댕냥쉼터 홈으로">
          <img src="@/assets/logo.svg" alt="댕냥쉼터 로고" class="logo-img" />
          <span class="brand">댕냥쉼터</span>
        </RouterLink>

        <ul class="menu">
          <li><RouterLink to="/volunteer">봉사게시판</RouterLink></li>
          <li><RouterLink to="/donation">후원게시판</RouterLink></li>
          <li><RouterLink to="/adoption">입양게시판</RouterLink></li>
          <li><RouterLink to="/missing">실종게시판</RouterLink></li>
          <li><RouterLink to="/sighting">목격게시판</RouterLink></li>
          <li><RouterLink to="/post">자유게시판</RouterLink></li>
          <li><RouterLink to="/heroes">댕냥히어로즈</RouterLink></li>
        </ul>
      </div>

      <!-- 오른쪽: 로그인 / 마이페이지 / 로그아웃 -->
      <div class="nav-right">
        <!-- 로그인 전 -->
        <button
          v-if="!isLogin"
          class="auth-btn login-only"
          @click="handleLogin"
        >
          로그인
        </button>

        <!-- 로그인 후 -->
        <template v-else>
          <RouterLink to="/mypage" class="auth-btn mypage-btn">
            마이페이지
          </RouterLink>
          <button class="auth-btn logout-btn" @click="handleLogout">
            로그아웃
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

// 로그인 여부 (임시: 나중에 store나 JWT로 교체)
const isLogin = ref(false)

// 로그인 버튼 → /login 이동
function handleLogin() {
  router.push('/login')
}

// 로그아웃 버튼 → 토큰 삭제 후 홈으로 이동
function handleLogout() {
  // 실제 구현 시: localStorage.removeItem('accessToken') 등
  isLogin.value = false
  router.push('/')
}
</script>

<style scoped>
/* ====== 기본 구조 ====== */
.site-header {
  width: 100%;
  background-color: #f7ecd1; /* 따뜻한 베이지 톤 */
  border-bottom: 1px solid rgba(0,0,0,0.06);
   display: flex;
  justify-content: center;
}

.navbar {
  width: 100%;
  max-width: 1400px;
  height : 70px;
  margin: 0 auto;
  min-height: 56px;
  padding: 0px 40px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  box-sizing: border-box;
  font-family: "Pretendard Variable", "Noto Sans KR", system-ui, sans-serif;
}

/* ====== 왼쪽: 로고 + 메뉴 ====== */
.nav-left {
  display: flex;
  align-items: center;
  gap: 50px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #000;
}
.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.brand {
  font-size: 22px;
  font-weight: 700;
  color: #000;
  line-height: 1;
}

/* 메뉴 */
.menu {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 36px;
  margin: 0;
  padding: 0;
}

.menu a {
  text-decoration: none;
  color: #000;
  font-weight: 700;
  font-size: 18px;
  line-height: -0.2px;
  transition: opacity 0.15s ease;
}

.menu a:hover {
  opacity: 0.7;
}

.menu :deep(.router-link-active) {
  text-decoration: underline 1px dotted rgba(0,0,0,0.5);
  text-underline-offset: 3px;
  opacity: 0.9;
}

/* ====== 오른쪽: 계정 버튼 ====== */
.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-btn {
  background-color: #ffffff;
  color: #000;
  border: 1px solid rgba(0,0,0,0.25);
  border-radius: 6px;
  padding: 8px 12px;
  min-width: 80px;
  text-align: center;

  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;

  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  transition: background-color .15s ease, filter .15s ease, transform .02s ease;
}

.auth-btn:hover {
  filter: brightness(0.97);
  background-color: #fff;
}

.auth-btn:active {
  transform: translateY(1px);
}

/* ====== 반응형 ====== */
@media (max-width: 1100px) {
  .menu {
    gap: 20px;
    font-size: 14px;
  }
}

@media (max-width: 900px) {
  .navbar {
    padding: 10px 16px;
  }
  .brand {
    font-size: 16px;
  }
  .menu {
    gap: 16px;
  }
  .auth-btn {
    min-width: auto;
    padding: 8px 10px;
    font-size: 13.5px;
  }
}

@media (max-width: 640px) {
  .menu {
    display: none; /* 모바일 버전은 추후 햄버거 메뉴로 교체 예정 */
  }
}
</style>