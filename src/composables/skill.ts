import { ref } from 'vue'

import {
  createSkillDie,
  useDicePool,
  type SkillDicePool,
  type SkillDieRank
} from '@/composables/dicePool'

type SkillStripe = 0 | 1 | 2 | 3 | 4

type SkillProficiency = {
  rank: SkillDieRank
  stripe: SkillStripe
}

const nextRank = (rank: SkillDieRank): SkillDieRank => {
  switch (rank) {
    case 'Novice':
      return 'Adept'
    case 'Adept':
      return 'Expert'
    case 'Expert':
    case 'Master':
      return 'Master'
  }
}

const createSkillDicePool = (proficiency: SkillProficiency): SkillDicePool => {
  const { rank, stripe } = proficiency
  const dice = [...Array(5)].map((_, index) =>
    index < stripe ? createSkillDie(nextRank(rank)) : createSkillDie(rank)
  )
  return useDicePool(dice)
}

const useSkill = (proficiency?: SkillProficiency) => {
  const rank = ref<SkillDieRank>(proficiency?.rank ?? 'Novice')
  const stripe = ref<SkillStripe>(proficiency?.stripe ?? 0)
  const pool = ref<SkillDicePool>(createSkillDicePool({ rank: rank.value, stripe: stripe.value }))

  const roll = () => pool.value.roll()

  return { rank, stripe, roll }
}

export { nextRank, useSkill }
