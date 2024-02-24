import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useSkill } from '@/composables/skill'

export const useAppStore = defineStore('App', () => {
  const skill = ref(useSkill())

  return { skill }
})
