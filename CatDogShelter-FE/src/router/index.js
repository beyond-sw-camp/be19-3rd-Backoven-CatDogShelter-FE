// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// ===== Auth =====
import LoginView from '@/views/auth/login/index.vue'
import SignupUserView from '@/views/auth/signup/user/index.vue'
import SignupShelterView from '@/views/auth/signup/shelter/index.vue'

// ===== 메인 / 게시판들 =====
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
import HeroesrankingView from '@/views/heros/Heroesranking.vue'

// ===== Footer 영역 페이지 =====
import AboutView from '@/views/footer/AboutView.vue'
import TermsView from '@/views/footer/TermsView.vue'
import PrivacyView from '@/views/footer/PrivacyView.vue'
import CommunityGuideView from '@/views/footer/CommunityGuideView.vue'
import AdoptionProcessView from '@/views/footer/AdoptionProcessView.vue'
import VolunteerGuideView from '@/views/footer/VolunteerGuideView.vue'
import FaqView from '@/views/footer/FaqView.vue'

// ===== 기타 뷰 =====
import ShelterheadMypageView from '@/views/volunteer/shelterhead/ShelterheadMypageView.vue'
import LoginPlaceholderView from '@/views/LoginPlaceholderView.vue'

// ===== 실종 글 작성 =====
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
  // Auth
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup.user', component: SignupUserView },
    { path: '/signup/shelter', name: 'signup.shelter', component: SignupShelterView },
    { path: '/_signup', redirect: { name: 'signup.user' } },   // 레거시 경로 정리

    // 봉사게시판 (목록 페이지)
    {
      path: '/volunteer',
      component: VolunteerView,
      children: [
        {
          // 봉사모집 상세
          path: 'detail/:id',
          name: 'VolunteerDetail',
          component: () =>
            import('@/views/volunteer/recruit/VolunteerDetailView.vue'),
          props: true,
        },
        {
          // 봉사후기 상세
          path: 'review/:id',
          name: 'VolunteerReviewDetail',
          component: () =>
            import('@/views/volunteer/review/VolunteerReviewDetailView.vue'),
          props: true,
        },
        {
          // 봉사후기 작성
          path: 'review/insert',
          name: 'VolunteerReviewInsert',
          component: () =>
            import('@/views/volunteer/review/VolunteerReviewInsertView.vue'),
        },
      ],
    },

    // 후원게시판 목록
    {
      path: '/donation',
      name: 'donation',
      component: DonationView,
    },

    // 후원게시판 상세
    {
      path: '/donation/:id',
      name: 'donation-detail',
      component: DonationDetailView,
      props: true,
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
      component: () =>
        import('@/views/adoption/AdoptionDetail.vue'),
      props: true,
    },

    // 입양 글쓰기
    {
      path: '/adoption/write',
      name: 'AdoptionWrite',
      component: () =>
        import('@/views/adoption/AdoptionWrite.vue'),
    },

    // 실종 게시판 목록
    {
      path: '/missing',
      name: 'missing',
      component: MissingView,
    },
    {
      path: '/missing/:postId',
      name: 'missing-detail',
      component: MissingDetailView,
      props: true, // 이거 켜두면 route param(postId)을 props로도 받을 수 있음
    },

    // 실종 신고 작성
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

    // 혹시 /post.write 로 들어온 애들 redirect
    {
      path: '/post.write',
      redirect: { name: 'post.write' },
    },

    // 히어로즈
    {
      path: '/heroes',
      name: 'heroes',
      component: HeroesrankingView,
    },

    // footer / 정책 / 안내
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

    // 보호소장 마이페이지
    {
      path: '/shelter-head/mypage',                 // 보호소장 마이페이지 라우팅
      component: ShelterheadMypageView,
      children: [
        {
          // 봉사모집 글 작성
          path: 'recruitinsert',          // 봉사모집 게시글 작성 라우팅
          name: 'VolunteerRecruitInsert',
          component: () =>
            import('@/views/volunteer/recruit/VolunteerRecruitInsertView.vue'),
        },
      ],
    },
    

    // ===== 여기부터는 네가 원래 아래에 쭉 적어놨던 중복 라우트들 =====
    // 자유게시판
    { path: '/post', name: 'post', component: PostView },
    { path: '/post/write', name: 'post.write', component: PostWriteView },
    { path: '/post/:id', name: 'post.detail', component: PostDetailView, props: true },

    { path: '/post.write', redirect: { name: 'post.write' } },
    { path: '/about', component: AboutView },
    { path: '/terms', component: TermsView },
    { path: '/privacy', component: PrivacyView },
    { path: '/community-guide', component: CommunityGuideView },
    { path: '/adoption-process', component: AdoptionProcessView },
    { path: '/volunteer-guide', component: VolunteerGuideView },
    { path: '/faq', component: FaqView },

    {
      path: '/shelter-head/mypage',                 // 보호소장 마이페이지 라우팅 (중복 선언 존중)
      component: ShelterheadMypageView,
      children: [
        {
          path: 'recruitinsert',          // 봉사모집 게시글 작성 라우팅
          name: 'VolunteerRecruitInsert',
          component: () => import('@/views/volunteer/recruit/VolunteerRecruitInsertView.vue')
        }
      ]
    },

  //   // 로그인 테스트 화면
  //   {
  //     path: '/login',
  //     name: 'login',
  //     component: LoginPlaceholderView,
  //   },
  // ],
    // 404 → 홈
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  // 라우트 이동 시 항상 화면 최상단
  scrollBehavior: () => ({ top: 0 }),
})

export default router