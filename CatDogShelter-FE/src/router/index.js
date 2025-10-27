import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import VolunteerView from '@/views/volunteer/VolunteerView.vue'
import DonationView from '@/views/DonationView.vue'
import AdoptionView from '@/views/AdoptionView.vue'
import MissingView from '@/views/MissingView.vue'
import SightingView from '@/views/SightingView.vue'
import PostView from '@/views/PostView.vue'
import HeroesView from '@/views/HeroesView.vue'
import AboutView from '@/views/footer/AboutView.vue'
import TermsView from '@/views/footer/TermsView.vue'
import PrivacyView from '@/views/footer/PrivacyView.vue'
import CommunityGuideView from '@/views/footer/CommunityGuideView.vue'
import AdoptionProcessView from '@/views/footer/AdoptionProcessView.vue'
import VolunteerGuideView from '@/views/footer/VolunteerGuideView.vue'
import FaqView from '@/views/footer/FaqView.vue'
import ShelterheadMypageView from '@/views/ShelterheadMypageView.vue'
import VolunteerReviewDetailView from '@/views/volunteer/VolunteerReviewDetailView.vue'
import VolunteerReviewInsertView from '@/views/volunteer/VolunteerReviewInsertView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: HomeView },

        // 봉사게시판 라우팅
        {
          path: '/volunteer',
          component: VolunteerView, // 봉사 게시판 메인
          children: [
                      {
                        path: 'detail/:id', // 봉사모집 상세 라우팅
                        name: 'VolunteerDetail',
                        component: () => import('@/views/volunteer/VolunteerDetailView.vue')
                      },
                      {
                        path: 'review/:id', // 봉사후기 상세 라우팅
                        name: 'VolunteerReviewDetail',
                        component: () => import('@/views/volunteer/VolunteerReviewDetailView.vue')
                      },
                      {
                        path: 'review/insert', // 봉사후기 상세 라우팅
                        name: 'VolunteerReviewInsert',
                        component: () => import('@/views/volunteer/VolunteerReviewInsertView.vue')
                      }
                    ]
        },
        { path: '/donation', name: 'donation', component: DonationView },
        { path: '/adoption', name: 'adoption', component: AdoptionView },
        { path: '/missing', name: 'missing', component: MissingView },
        { path: '/sighting', name: 'sighting', component: SightingView },
        { path: '/post', name: 'post', component: PostView },
        { path: '/heroes', name: 'heroes', component: HeroesView },
        { path: '/about', component: AboutView },
        { path: '/terms', component: TermsView },
        { path: '/privacy', component: PrivacyView },
        { path: '/community-guide', component: CommunityGuideView },
        { path: '/adoption-process', component: AdoptionProcessView },
        { path: '/volunteer-guide', component: VolunteerGuideView },
        { path: '/faq', component: FaqView },

        // 보호소장 마이페이지 라우팅
        {
          path: '/shelter-head/mypage',
          component: ShelterheadMypageView,
          children: [
                      { // 봉사모집 게시글 작성 라우팅
                        path: 'recruitinsert',
                        name: 'VolunteerRecruitInsert',
                        component: () => import('@/views/volunteer/VolunteerRecruitInsertView.vue')
                      }
                    ]
        }
      ]
})

export default router
