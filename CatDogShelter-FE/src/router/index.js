// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/views/auth/useAuth'

// ===== Auth =====
import LoginView from '@/views/auth/login/index.vue'
import SignupUserView from '@/views/auth/signup/user/index.vue'
import SignupShelterView from '@/views/auth/signup/shelter/index.vue'

<<<<<<< HEAD
// ===== 메인 / 게시판들 =====
// ===== Main pages =====
=======
// ===== User MyPage =====
import UserMyPageView from '@/views/mypage/UserMyPageView.vue'
import UserEdit from '@/views/mypage/UserEdit.vue'
import UserMessages from '@/views/mypage/UserMessages.vue'

// ===== Shelter Head MyPage =====
import ShelterheadMypageView from '@/views/volunteer/shelterhead/ShelterheadMypageView.vue'

// ===== Main Boards =====
>>>>>>> devlop
import HomeView from '@/views/HomeView.vue'
import VolunteerView from '@/views/volunteer/VolunteerView.vue'
import DonationView from '@/views/DonationView.vue'
import DonationDetailView from '@/views/donation/DonationDetailView.vue'
import MissingDetailView from '@/views/missing/MissingDetailView.vue'
import AdoptionView from '@/views/adoption/AdoptionView.vue'
import MissingView from '@/views/MissingView.vue'
import SightingView from '@/views/SightingView.vue'
import SightingView from '@/views/Sighting/SightingView.vue'
import PostView from '@/views/Post/PostView.vue'
import PostDetailView from '@/views/Post/PostDetailView.vue'
import PostWriteView from '@/views/Post/PostWriteView.vue'
import HeroesrankingView from '@/views/heros/HeroesrankingView.vue'

<<<<<<< HEAD
// ===== Footer 영역 페이지 =====
// ===== Footer pages =====
=======
// ===== Footer =====
>>>>>>> devlop
import AboutView from '@/views/footer/AboutView.vue'
import TermsView from '@/views/footer/TermsView.vue'
import PrivacyView from '@/views/footer/PrivacyView.vue'
import CommunityGuideView from '@/views/footer/CommunityGuideView.vue'
import AdoptionProcessView from '@/views/footer/AdoptionProcessView.vue'
import VolunteerGuideView from '@/views/footer/VolunteerGuideView.vue'
import FaqView from '@/views/footer/FaqView.vue'

<<<<<<< HEAD
// ===== 기타 뷰 =====
// ===== Misc views =====
import ShelterheadMypageView from '@/views/volunteer/shelterhead/ShelterheadMypageView.vue'
import ApplicantsView from '@/views/volunteer/shelterhead/Applicants.vue'
import LoginPlaceholderView from '@/views/LoginPlaceholderView.vue'

// ===== 실종 글 작성 =====
// ===== Missing post writer =====
=======
// ===== Missing Write =====
>>>>>>> devlop
import MissingPostWirte from '@/views/missing/MissingPostWirte.vue'
import AdminPageView from '@/views/AdminPageView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
<<<<<<< HEAD
    // 홈
    // Home
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  // Auth
    // Auth
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup.user', component: SignupUserView },
    { path: '/signup/shelter', name: 'signup.shelter', component: SignupShelterView },
    { path: '/_signup', redirect: { name: 'signup.user' } },   // 레거시 경로 정리
    { path: '/_signup', redirect: { name: 'signup.user' } },   // legacy path cleanup

    // 봉사게시판 (목록 페이지)
    // Volunteer board (list layout)
    {
      path: '/volunteer',
      component: VolunteerView,
      children: [
        {
          // 봉사모집 상세
          // Volunteer recruiting detail
          path: 'detail/:id',
          name: 'VolunteerDetail',
          component: () =>
            import('@/views/volunteer/recruit/VolunteerDetailView.vue'),
          props: true,
        },
        {
          // 봉사후기 상세
          // Volunteer review detail
          path: 'review/:id',
          name: 'VolunteerReviewDetail',
          component: () =>
            import('@/views/volunteer/review/VolunteerReviewDetailView.vue'),
          props: true,
        },
        {
          // 봉사후기 작성
          // Volunteer review write
          path: 'review/insert',
          name: 'VolunteerReviewInsert',
          component: () =>
            import('@/views/volunteer/review/VolunteerReviewInsertView.vue'),
        },
      ],
    },

    // 후원게시판 목록
    // Donation board list
=======
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
      path: '/donation',
      name: 'donation',
      component: DonationView,
      path: '/mypage/messages',
      name: 'mypage-messages',
      component: UserMessages,
      meta: { requiresAuth: true }
    },

    // ✅ Shelter MyPage
>>>>>>> devlop
    {
      path: '/shelter-head/mypage',
      name: 'shelter-mypage',
      component: ShelterheadMypageView,
      meta: { requiresAuth: true, role: 'shelter' }
    },

<<<<<<< HEAD
    // 후원게시판 상세
    // Donation detail
=======
>>>>>>> devlop
    {
      path: '/donation/:id',
      name: 'donation-detail',
      component: DonationDetailView,
      props: true,
      path: '/admin-page',
      name: 'admin-page',
      component: AdminPageView,
    },

<<<<<<< HEAD
    // 입양 게시판 목록
    // Adoption board list
=======
    { path: '/volunteer', name: 'volunteer', component: VolunteerView },
>>>>>>> devlop
    {
      path: '/adoption',
      name: 'adoption',
      component: AdoptionView,
      path: '/donation/:id', name: 'donation-detail',
      component: DonationDetailView, props: true,
    },
    { path: '/donation', name: 'donation', component: DonationView },

<<<<<<< HEAD
    // 입양 상세
    // Adoption detail
=======
    { path: '/adoption', name: 'adoption', component: AdoptionView },
>>>>>>> devlop
    {
      path: '/adoption-post/:id',
      name: 'adoptionDetail',
      component: () =>
        import('@/views/adoption/AdoptionDetail.vue'),
      component: () => import('@/views/adoption/AdoptionDetail.vue'),
      props: true,
    },
<<<<<<< HEAD

    // 입양 글쓰기
    // Adoption write
=======
>>>>>>> devlop
    {
      path: '/adoption/write',
      name: 'AdoptionWrite',
      component: () =>
        import('@/views/adoption/AdoptionWrite.vue'),
      component: () => import('@/views/adoption/AdoptionWrite.vue'),
      meta: { requiresAuth: true } // ✅ 보호소장만 제한하고 싶으면 role:'shelter'
    },

<<<<<<< HEAD
    // 실종 게시판 목록
    // Missing board list
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
      props: true, // allow route param(postId) as prop
    },

    // 실종 신고 작성
    // Missing report write
    {
      path: '/missing/write',
      name: 'missing.write',
      component: MissingPostWirte,
    },

    // 목격 게시판
    // Sighting board list
    {
      path: '/sighting',
      name: 'sighting',
      component: SightingView,
    },

    // 자유게시판 목록
    // Community board list
    {
      path: '/post',
      name: 'post',
      component: PostView,
    },

    // 자유게시판 글쓰기
    // Community board write
    {
      path: '/post/write',
      name: 'post.write',
      component: PostWriteView,
    },

    // 자유게시판 상세
    // Community board detail
=======
    { path: '/missing', name: 'missing', component: MissingView },
    { path: '/missing/write', name: 'missing.write', component: MissingPostWirte },

    { path: '/sighting', name: 'sighting', component: SightingView },

    { path: '/post', name: 'post', component: PostView },
    { path: '/post/write', name: 'post.write', component: PostWriteView, meta: { requiresAuth: true } },
>>>>>>> devlop
    {
      path: '/post/:id',
      name: 'post.detail',
      component: PostDetailView,
      props: true,
    },

<<<<<<< HEAD
    // 혹시 /post.write 로 들어온 애들 redirect
    // Redirect if someone hits /post.write directly
    {
      path: '/post.write',
      redirect: { name: 'post.write' },
    },

    // 히어로즈
    // Heroes
    {
      path: '/heroes',
      name: 'heroes',
      component: HeroesrankingView,
    },

    // footer / 정책 / 안내
    // footer / policy / guide pages
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
    // shelter head mypage
    {
      path: '/shelter-head/mypage',                 // 보호소장 마이페이지 라우팅
      path: '/shelter-head/mypage',
      component: ShelterheadMypageView,
      children: [
        {
          // 봉사모집 글 작성
          path: 'recruitinsert',          // 봉사모집 게시글 작성 라우팅
          path: 'recruitinsert',
          name: 'VolunteerRecruitInsert',
          component: () =>
            import('@/views/volunteer/recruit/VolunteerRecruitInsertView.vue'),
        },
        {
          path: 'applicants',
          name: 'ShelterApplicants',
          component: ApplicantsView,
        },
      ],
    },

    // src/router/index.js
    { path: '/auth/find-id', name: 'find.id', component: () => import('@/views/auth/findIdView.vue') },

    

    // ===== 여기부터는 네가 원래 아래에 쭉 적어놨던 중복 라우트들 =====
    // 자유게시판
    // ===== duplicated routes (kept to match existing structure) =====
    { path: '/post', name: 'post', component: PostView },
    { path: '/post/write', name: 'post.write', component: PostWriteView },
    { path: '/post/:id', name: 'post.detail', component: PostDetailView, props: true },

    { path: '/post.write', redirect: { name: 'post.write' } },
=======
    { path: '/heroes', name: 'heroes', component: HeroesrankingView },

>>>>>>> devlop
    { path: '/about', component: AboutView },
    { path: '/terms', component: TermsView },
    { path: '/privacy', component: PrivacyView },
    { path: '/community-guide', component: CommunityGuideView },
    { path: '/adoption-process', component: AdoptionProcessView },
    { path: '/volunteer-guide', component: VolunteerGuideView },
    { path: '/faq', component: FaqView },

<<<<<<< HEAD
    {
      path: '/shelter-head/mypage',                 // 보호소장 마이페이지 라우팅 (중복 선언 존중)
      path: '/shelter-head/mypage',
      component: ShelterheadMypageView,
      children: [
        {
          path: 'recruitinsert',          // 봉사모집 게시글 작성 라우팅
          path: 'recruitinsert',
          name: 'VolunteerRecruitInsert',
          component: () => import('@/views/volunteer/recruit/VolunteerRecruitInsertView.vue')
        },
        {
          path: 'applicants',
          name: 'ShelterApplicants',
          component: ApplicantsView,
        }
      ]
    },
    {
      path: '/auth/find-password',
      name: 'find.password.request',
      component: () => import('@/views/auth/findPasswordRequestView.vue'),
    },
    {
      path: '/auth/find-password/verify',
      name: 'find.password.verify',
      component: () => import('@/views/auth/findPasswordVerifyView.vue'),
    },
    {
      path: '/auth/find-password/reset',
      name: 'find.password.reset',
      component: () => import('@/views/auth/findPasswordResetView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPageView,
      meta: { requiresAdmin: true },
    },

  //   // 로그인 테스트 화면
  //   {
  //     path: '/login',
  //     name: 'login',
  //     component: LoginPlaceholderView,
  //   },
  // ],
    // 404 → 홈
    // 404 → home
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  // 라우트 이동 시 항상 화면 최상단
  // always scroll to top on route change
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAdmin) {
    const role = localStorage.getItem('role')
    if (role === 'ADMIN') return next()
    return next({ name: 'login' })
  }
  next()
=======
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
>>>>>>> devlop
})

export default router
