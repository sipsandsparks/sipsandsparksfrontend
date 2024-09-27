import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { scrollToTop: true },
    props: { isDesktop: false }
  },
  {
    path: '/about',
    name: 'about',
    component: HomeView,
  },
  {
    path: '/contact',
    name: 'contact',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ContactView.vue')
  },
  {
    path: '/match',
    name: 'match',
    component: () => import(/* webpackChunkName: "about" */ '../views/MatchFormView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/AdminView.vue')
  },
  {
    // Wildcard route to catch all unmatched routes
    path: '/:catchAll(.*)',
    component: HomeView,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.name !== 'about') {
      return { top: 0 }
    }
  },
})

export default router
