import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { ObjectValues } from '@/generic.types'
import { type Skill, useSkill, type SkillCheckResult } from '@/composables/skill'
import type { SkillDieRank } from '@/composables/dicePool'

const APP_MODE = {
  CUSTOM_ROLLER: 'Custom Roller',
  IDLE_SKILLING: 'Idle Skilling'
} as const

type AppMode = ObjectValues<typeof APP_MODE>

const DEFAULT_INTERVAL = 8

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getNextChallenge = (rank: SkillDieRank): number => {
  switch (rank) {
    case 'Novice':
      return randomInt(6, 10)
    case 'Adept':
      return randomInt(10, 14)
    case 'Expert':
      return randomInt(14, 18)
    case 'Master':
    default:
      return 25
  }
}

const useAppStore = defineStore('App', () => {
  const mode = ref<AppMode>('Custom Roller')
  const skill = ref<Skill>(useSkill())
  // Idle Skilling
  const interval = ref(DEFAULT_INTERVAL)
  const modifier = ref(0)
  const challenge = ref(getNextChallenge(skill.value.rank))

  const setMode = (newMode: AppMode): void => {
    mode.value = newMode
  }

  const handleResult = (result: SkillCheckResult): void => {
    const idle = result.idleResult
    const triangles = idle.shapes.length
    const squares = idle.shapes.filter((shape) => shape !== 'Triangle').length
    const stars = idle.shapes.filter((shape) => shape === 'Star').length
    // experience
    if (idle.success) {
      skill.value.addExperience(idle.challenge)
    }
    skill.value.addExperience(triangles)
    // setup next challenge
    interval.value = DEFAULT_INTERVAL - stars
    modifier.value = squares
    challenge.value = getNextChallenge(skill.value.rank)
  }

  const rollSkillCheck = () => {
    const result = skill.value.check(challenge.value, modifier.value)
    handleResult(result)
    return result
  }

  return { mode, skill, interval, modifier, challenge, setMode, rollSkillCheck }
})

export { type AppMode, useAppStore }
