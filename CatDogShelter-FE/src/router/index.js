// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// ===== 메인 / 게시판 =====
import HomeView from '@/views/HomeView.vue'
import VolunteerView from '@/views/volunteer/VolunteerView.vue'
import DonationView from '@/views/DonationView.vue'
import DonationDetailView from '@/views/donation/DonationDetailView.vue'
import AdoptionView from '@/views/adoption/AdoptionView.vue'
import MissingView from '@/views/MissingView.vue'
import MissingDetailView from '@/views/missing/MissingDetailView.vue'
import SightingView from '@/views/SightingView.vue'
import PostView from '@/views/Post/PostView.vue'
import PostDetailView from '@/views/Post/PostDetailView.vue'
import PostWriteView from '@/views/Post/PostWriteView.vue'   // ✅ 누락된 import 추가
import HeroesView from '@/views/HeroesView.vue'

// ===== Footer =====
import AboutView from '@/views/footer/AboutView.vue'
import TermsView from '@/views/footer/TermsView.vue'
import PrivacyView from '@/views/footer/PrivacyView.vue'
import CommunityGuideView from '@/views/footer/CommunityGuideView.vue'
import AdoptionProcessView from '@/views/footer/AdoptionProcessView.vue'
import VolunteerGuideView from '@/views/footer/VolunteerGuideView.vue'
import FaqView from '@/views/footer/FaqView.vue'

// ===== Auth =====
import LoginView from '@/views/auth/login/index.vue'
import SignupUserView from '@/views/auth/signup/user/index.vue'
import SignupShelterView from '@/views/auth/signup/shelter/index.vue'

// ===== 기타 =====
import ShelterheadMypageView from '@/views/volunteer/shelterhead/ShelterheadMypageView.vue'
import MissingPostWirte from '@/views/missing/MissingPostWirte.vue' // 파일명이 'Wirte'면 그대로 두자

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },

    // 게시판
    { path: '/volunteer', name: 'volunteer', component: VolunteerView },
    { path: '/donation', name: 'donation', component: DonationView },
    { path: '/donation/:id', name: 'donation.detail', component: DonationDetailView, props: true },
    { path: '/adoption', name: 'adoption', component: AdoptionView },
    { path: '/missing', name: 'missing', component: MissingView },
    { path: '/missing/:id', name: 'missing.detail', component: MissingDetailView, props: true },
    { path: '/sighting', name: 'sighting', component: SightingView },

    // 실종 신고 작성
    { path: '/missing/write', name: 'missing.write', component: MissingPostWirte },

    // 자유게시판
    { path: '/post', name: 'post', component: PostView },
    { path: '/post/write', name: 'post.write', component: PostWriteView },
    { path: '/post/:id', name: 'post.detail', component: PostDetailView, props: true },
    { path: '/post.write', redirect: { name: 'post.write' } }, // 과거 링크 대응

    // 히어로즈
    { path: '/heroes', name: 'heroes', component: HeroesView },

    // Auth
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup.user', component: SignupUserView },
    { path: '/signup/shelter', name: 'signup.shelter', component: SignupShelterView },
    { path: '/_signup', redirect: { name: 'signup.user' } },   // 레거시 경로 정리

    // 보호소장 마이페이지(중첩)
    {
      path: '/shelter-head/mypage',
      component: ShelterheadMypageView,
      children: [
        {
          path: 'recruitinsert',
          name: 'VolunteerRecruitInsert',
          component: () =>
            import('@/views/volunteer/recruit/VolunteerRecruitInsertView.vue'),
        },
      ],
    },

    // 404 → 홈
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
