import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import VolunteerView from '@/views/VolunteerView.vue'
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
import AdminPageView from '@/views/AdminPageView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/volunteer', name: 'volunteer', component: VolunteerView },
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
        { path: '/admin-page', component: AdminPageView}
    ]
})

export default router
