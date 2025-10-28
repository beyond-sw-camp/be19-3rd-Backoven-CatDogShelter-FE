// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/views/auth/useAuth'

// ===== Auth =====
import LoginView from '@/views/auth/login/index.vue'
import SignupUserView from '@/views/auth/signup/user/index.vue'
import SignupShelterView from '@/views/auth/signup/shelter/index.vue'

// ===== User MyPage =====
import UserMyPageView from '@/views/mypage/UserMyPageView.vue'
import UserEdit from '@/views/mypage/UserEdit.vue'
import UserMessages from '@/views/mypage/UserMessages.vue'

// ===== Shelter Head MyPage =====
import ShelterheadMypageView from '@/views/volunteer/shelterhead/ShelterheadMypageView.vue'

// ===== Main Boards =====
import HomeView from '@/views/HomeView.vue'
import VolunteerView from '@/views/volunteer/VolunteerView.vue'
import DonationView from '@/views/DonationView.vue'
import DonationDetailView from '@/views/donation/DonationDetailView.vue'
import MissingDetailView from '@/views/missing/MissingDetailView.vue'
import AdoptionView from '@/views/adoption/AdoptionView.vue'
import MissingView from '@/views/MissingView.vue'
import SightingView from '@/views/SightingView.vue'
import PostView from '@/views/Post/PostView.vue'
import PostDetailView from '@/views/Post/PostDetailView.vue'
import PostWriteView from '@/views/Post/PostWriteView.vue'
import HeroesrankingView from '@/views/heros/HeroesrankingView.vue'

// ===== Footer =====
import AboutView from '@/views/footer/AboutView.vue'
import TermsView from '@/views/footer/TermsView.vue'
import PrivacyView from '@/views/footer/PrivacyView.vue'
import CommunityGuideView from '@/views/footer/CommunityGuideView.vue'
import AdoptionProcessView from '@/views/footer/AdoptionProcessView.vue'
import VolunteerGuideView from '@/views/footer/VolunteerGuideView.vue'
import FaqView from '@/views/footer/FaqView.vue'

// ===== Missing Write =====
import MissingPostWirte from '@/views/missing/MissingPostWirte.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    { path: '/', name: 'home', component: HomeView },

    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup.user', component: SignupUserView },
    { path: '/signup/shelter', name: 'signup.shelter', component: SignupShelterView },

    // ✅ User MyPage
  {
  path: '/mypage',
  component: UserMyPageView,
  beforeEnter: (to, from, next) => {
    const { isAuthed } = useAuth()
    if (!isAuthed.value) {
      alert("로그인이 필요합니다.")
      return next('/login')
    }
    next()
  }
}
,
    {
      path: '/mypage/edit',
      name: 'mypage-edit',
      component: UserEdit,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/mypage/messages',
      name: 'mypage-messages',
      component: UserMessages,
      meta: { requiresAuth: true }
    },

    // ✅ Shelter MyPage
    {
      path: '/shelter-head/mypage',
      name: 'shelter-mypage',
      component: ShelterheadMypageView,
      meta: { requiresAuth: true, role: 'shelter' }
    },

    { path: '/volunteer', name: 'volunteer', component: VolunteerView },
    {
      path: '/donation/:id', name: 'donation-detail',
      component: DonationDetailView, props: true,
    },
    { path: '/donation', name: 'donation', component: DonationView },

    { path: '/adoption', name: 'adoption', component: AdoptionView },
    {
      path: '/adoption-post/:id',
      name: 'adoptionDetail',
      component: () => import('@/views/adoption/AdoptionDetail.vue'),
      props: true,
    },
    {
      path: '/adoption/write',
      name: 'AdoptionWrite',
      component: () => import('@/views/adoption/AdoptionWrite.vue'),
      meta: { requiresAuth: true } // ✅ 보호소장만 제한하고 싶으면 role:'shelter'
    },

    { path: '/missing', name: 'missing', component: MissingView },
    { path: '/missing/write', name: 'missing.write', component: MissingPostWirte },

    { path: '/sighting', name: 'sighting', component: SightingView },

    { path: '/post', name: 'post', component: PostView },
    { path: '/post/write', name: 'post.write', component: PostWriteView, meta: { requiresAuth: true } },
    {
      path: '/post/:id',
      name: 'post.detail',
      component: PostDetailView,
      props: true,
    },

    { path: '/heroes', name: 'heroes', component: HeroesrankingView },

    { path: '/about', component: AboutView },
    { path: '/terms', component: TermsView },
    { path: '/privacy', component: PrivacyView },
    { path: '/community-guide', component: CommunityGuideView },
    { path: '/adoption-process', component: AdoptionProcessView },
    { path: '/volunteer-guide', component: VolunteerGuideView },
    { path: '/faq', component: FaqView },

    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],

  scrollBehavior: () => ({ top: 0 }),
})


router.beforeEach(async (to) => {
  const { authed, fetchMe } = useAuth()
  const storedAuth = localStorage.getItem('authed') === '1'
  const userRole = localStorage.getItem('userRole')

  // 1) 로그인 필요 페이지
  if (to.meta.requiresAuth) {

    // ✅ authed 또는 localStorage 중 하나만 true면 통과
    if (!authed.value && !storedAuth) {
      return {
        name: 'login',
        query: { next: to.fullPath }
      }
    }

    // ✅ fetchMe는 에러 무시하고 추가 검증
    try {
      await fetchMe()
    } catch (_) {
      return {
        name: 'login',
        query: { next: to.fullPath }
      }
    }
  }

  // 2) 권한 확인
  if (to.meta.role && to.meta.role !== userRole) {
    alert('접근 권한이 없습니다.')
    return { name: 'home' }
  }

  return true
})

export default router
