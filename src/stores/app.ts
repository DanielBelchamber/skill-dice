import { defineStore } from 'pinia'
import { ref } from 'vue'

import { type Skill, useSkill } from '@/composables/skill'

const useAppStore = defineStore('App', () => {
  const skill = ref<Skill>(useSkill())
  const modifier = ref(0)
  const challenge = ref(0)

  const rollSkillCheck = () => {
    const result = skill.value.check(challenge.value, modifier.value)
    return result
  }

  return { skill, modifier, challenge, rollSkillCheck }
})

export { useAppStore }
