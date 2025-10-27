// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import VolunteerView from '@/views/volunteer/VolunteerView.vue'
import DonationDetailView from '@/views/donation/DonationDetailView.vue'
import DonationView from '@/views/DonationView.vue'
import AdoptionView from '@/views/adoption/AdoptionView.vue'
import MissingView from '@/views/MissingView.vue'
import SightingView from '@/views/SightingView.vue'
import PostView from '@/views/Post/PostView.vue'
import PostDetailView from '@/views/Post/PostDetailView.vue'
import PostWriteView from '@/views/Post/PostWriteView.vue'
import HeroesView from '@/views/HeroesView.vue'

// ===== Footer 영역 페이지 =====
import AboutView from '@/views/footer/AboutView.vue'
import TermsView from '@/views/footer/TermsView.vue'
import PrivacyView from '@/views/footer/PrivacyView.vue'
import CommunityGuideView from '@/views/footer/CommunityGuideView.vue'
import AdoptionProcessView from '@/views/footer/AdoptionProcessView.vue'
import VolunteerGuideView from '@/views/footer/VolunteerGuideView.vue'
import FaqView from '@/views/footer/FaqView.vue'

// ===== 기타 뷰 =====
import ShelterheadMypageView from '@/views/ShelterheadMypageView.vue'
import LoginPlaceholderView from '@/views/LoginPlaceholderView.vue'

// ===== 실종 글 작성 페이지 (이번에 만든 거) =====
import MissingPostWirte from '@/views/missing/MissingPostWirte.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    // 홈
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    // 봉사게시판
    {
      path: '/volunteer',
      component: VolunteerView, // 봉사 게시판 메인
      children: [
        {
          path: 'detail/:id', // 봉사모집 상세
          name: 'VolunteerDetail',
          component: () => import('@/views/volunteer/VolunteerDetailView.vue'),
          props: true,
        },
        {
          path: 'review/:id', // 봉사후기 상세
          name: 'VolunteerReviewDetail',
          component: () => import('@/views/volunteer/VolunteerReviewDetailView.vue'),
          props: true,
        },
        {
          path: 'review/insert', // 봉사후기 작성
          name: 'VolunteerReviewInsert',
          component: () => import('@/views/volunteer/VolunteerReviewInsertView.vue'),
        },
      ],
    },

    // 후원게시판
    {
      path: '/donation',
      name: 'donation',
      component: DonationView,
    },

    {
      path: '/donation/:id',
      name: 'donation-detail',
      component: DonationDetailView,
      props: true
    },

    // 입양 게시판 목록
    {
      path: '/adoption',
      name: 'adoption',
      component: AdoptionView,
    },

    // 입양 상세
    {
      path: '/adoption-post/:id',
      name: 'adoptionDetail',
      component: () => import('@/views/adoption/AdoptionDetail.vue'),
      props: true,
    },

    // 입양 글쓰기
    {
      path: '/adoption/write',
      name: 'AdoptionWrite',
      component: () => import('@/views/adoption/AdoptionWrite.vue'),
    },

    // 실종 게시판 목록
    {
      path: '/missing',
      name: 'missing',
      component: MissingView,
    },

    // 🔥 실종 신고 작성
    {
      path: '/missing/write',
      name: 'missing.write',
      component: MissingPostWirte,
    },

    // 목격 게시판
    {
      path: '/sighting',
      name: 'sighting',
      component: SightingView,
    },

    // 자유게시판 목록
    {
      path: '/post',
      name: 'post',
      component: PostView,
    },

    // 자유게시판 글쓰기
    {
      path: '/post/write',
      name: 'post.write',
      component: PostWriteView,
    },

    // 자유게시판 상세
    {
      path: '/post/:id',
      name: 'post.detail',
      component: PostDetailView,
      props: true,
    },

    // 혹시 /post.write 로 잘못 들어오는 애들 redirect
    {
      path: '/post.write',
      redirect: { name: 'post.write' },
    },

    // 히어로즈
    {
      path: '/heroes',
      name: 'heroes',
      component: HeroesView,
    },

    // footer/소개/정책 쪽
    {
      path: '/about',
      component: AboutView,
    },
    {
      path: '/terms',
      component: TermsView,
    },
    {
      path: '/privacy',
      component: PrivacyView,
    },
    {
      path: '/community-guide',
      component: CommunityGuideView,
    },
    {
      path: '/adoption-process',
      component: AdoptionProcessView,
    },
    {
      path: '/volunteer-guide',
      component: VolunteerGuideView,
    },
    {
      path: '/faq',
      component: FaqView,
    },

    // 보호소장 마이페이지 + 하위 라우트
    {
      path: '/shelter-head/mypage',
      component: ShelterheadMypageView,
      children: [
        {
          path: 'recruitinsert', // 봉사모집 글 작성
          name: 'VolunteerRecruitInsert',
          component: () =>
            import('@/views/volunteer/VolunteerRecruitInsertView.vue'),
        },
      ],
    },

    // 로그인 테스트 화면
    {
      path: '/login',
      name: 'login',
      component: LoginPlaceholderView,
    },
  ],

  // 라우트 이동 시 항상 화면 최상단으로
  scrollBehavior: () => ({ top: 0 }),
})

export default router