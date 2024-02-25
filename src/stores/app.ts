import { defineStore } from 'pinia'
import { ref } from 'vue'

import { type Skill, useSkill } from '@/composables/skill'
import type { ObjectValues } from '@/generic.types'

const APP_MODE = {
  CUSTOM_ROLLER: 'Custom Roller',
  IDLE_SKILLING: 'Idle Skilling'
} as const

type AppMode = ObjectValues<typeof APP_MODE>

const useAppStore = defineStore('App', () => {
  const mode = ref<AppMode>('Custom Roller')
  const skill = ref<Skill>(useSkill())

  const setMode = (newMode: AppMode): void => {
    mode.value = newMode
  }

  return { mode, skill, setMode }
})

export { type AppMode, useAppStore }
