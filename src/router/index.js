import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import { useQuizStore } from '@/stores/quiz'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('@/pages/Quiz.vue'),
    },
    {
      path: '/types',
      name: 'types',
      component: () => import('@/pages/TypeList.vue'),
    },
    {
      path: '/types/:id',
      name: 'type-detail',
      component: () => import('@/pages/TypeDetail.vue'),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('@/pages/Result.vue'),
      meta: { requiresCompletedQuiz: true },
    },
    {
      path: '/notice/:type',
      name: 'public-notice',
      component: () => import('@/pages/PublicNotice.vue'),
    },
  ],
})

router.beforeEach((to) => {
  if (!to.meta.requiresCompletedQuiz) return true

  const quizStore = useQuizStore()
  if (quizStore.allAnswered) return true

  return {
    name: 'quiz',
    query: { notice: 'complete-required' },
  }
})

export default router
