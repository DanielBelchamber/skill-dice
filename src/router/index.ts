import { createRouter, createWebHistory } from 'vue-router'

import DiceRoller from '@/views/DiceRoller.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dice-roller',
      component: DiceRoller
    }
  ]
})

export default router
