// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import VolunteerView from '@/views/volunteer/VolunteerView.vue'
import DonationView from '@/views/DonationView.vue'
import AdoptionView from '../views/adoption/AdoptionView.vue'
import MissingView from '@/views/MissingView.vue'
import SightingView from '@/views/SightingView.vue'
import PostView from '@/views/Post/PostView.vue'
import PostDetailView from '@/views/Post/PostDetailView.vue'
import HeroesView from '@/views/HeroesView.vue'
import AboutView from '@/views/footer/AboutView.vue'
import TermsView from '@/views/footer/TermsView.vue'
import PrivacyView from '@/views/footer/PrivacyView.vue'
import CommunityGuideView from '@/views/footer/CommunityGuideView.vue'
import AdoptionProcessView from '@/views/footer/AdoptionProcessView.vue'
import VolunteerGuideView from '@/views/footer/VolunteerGuideView.vue'
import PostWriteView from '@/views/Post/PostWriteView.vue'
import FaqView from '@/views/footer/FaqView.vue'
import ShelterheadMypageView from '@/views/volunteer/ShelterheadMypageView.vue'
import LoginPlaceholderView from '@/views/LoginPlaceholderView.vue'

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
    { 
        path: '/adoption', 
        name : 'adoption',
        component: AdoptionView 
    },
    {
        path: "/adoption-post/:id",
        name: "adoptionDetail",
        component: () => import("@/views/adoption/AdoptionDetail.vue"),
        props: true
    },
    {
  path: "/adoption/write",
  name: "AdoptionWrite",
  component: () => import("@/views/adoption/AdoptionWrite.vue"),
},
        { path: '/missing', name: 'missing', component: MissingView },
        { path: '/sighting', name: 'sighting', component: SightingView },

        // 자유게시판
        { path: '/post', name: 'post', component: PostView },
        { path: '/post/write', name: 'post.write', component: PostWriteView },
        { path: '/post/:id', name: 'post.detail', component: PostDetailView, props: true },

        { path: '/post.write', redirect: { name: 'post.write' } },

        { path: '/heroes', name: 'heroes', component: HeroesView },
        { path: '/about', component: AboutView },
        { path: '/terms', component: TermsView },
        { path: '/privacy', component: PrivacyView },
        { path: '/community-guide', component: CommunityGuideView },
        { path: '/adoption-process', component: AdoptionProcessView },
        { path: '/volunteer-guide', component: VolunteerGuideView },
        { path: '/faq', component: FaqView },
        { 
          path: '/shelter-head/mypage',                 // 보호소장 마이페이지 라우팅
          component: ShelterheadMypageView,
          children: [
                      { 
                        path: 'recruitinsert',          // 봉사모집 게시글 작성 라우팅
                        name: 'VolunteerRecruitInsert',
                        component: () => import('@/views/volunteer/VolunteerRecruitInsertView.vue')
                      }
                    ]
        },
        { path: '/login', name: 'login', component: LoginPlaceholderView }
    ],
    
    scrollBehavior: () => ({ top: 0 }) // 페이지 이동 시 상단으로
    
})

export default router
