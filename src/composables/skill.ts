import { computed, ref, type Ref } from 'vue'

import {
  createSkillDie,
  useDicePool,
  type SkillDieRank,
  type SkillDie,
  type SkillDicePool,
  type SkillDieShape,
  type SkillDieValue
} from '@/composables/dicePool'

type SkillStripe = 0 | 1 | 2 | 3 | 4

type SkillProficiency = {
  rank: SkillDieRank
  stripe: SkillStripe
}

const nextRank = (rank: SkillDieRank): SkillDieRank => {
  switch (rank) {
    case 'Novice':
      return 'Apprentice'
    case 'Apprentice':
      return 'Expert'
    case 'Expert':
    case 'Master':
      return 'Master'
  }
}

const assembleSkillDice = (proficiency: SkillProficiency): SkillDie[] => {
  const { rank, stripe } = proficiency
  return [...Array(5)].map((_, index) =>
    index < stripe ? createSkillDie(nextRank(rank)) : createSkillDie(rank)
  )
}

type RollDisplay = {
  rank: SkillDieRank
  value: SkillDieValue
}

type SkillRoll = {
  display: RollDisplay[]
  total: number
  shapes: SkillDieShape[]
}

type SkillCheck = {
  challenge: number
  modifier: number
  success: boolean
  display: RollDisplay[]
  total: number
  shapes: SkillDieShape[]
}

type Skill = {
  rank: Ref<SkillDieRank>
  stripe: Ref<SkillStripe>
  setRank: (newRank: SkillDieRank) => void
  setStripe: (newStripe: SkillStripe) => void
  display: () => SkillDieRank[]
  roll: () => SkillRoll
  check: (challenge: number, modifier?: number) => SkillCheck
}

const useSkill = (): Skill => {
  // default rank and stripe
  const rank = ref<SkillDieRank>('Novice')
  const stripe = ref<SkillStripe>(0)

  const dice = computed<SkillDie[]>(() =>
    assembleSkillDice({ rank: rank.value, stripe: stripe.value })
  )
  const pool = computed<SkillDicePool>(() => useDicePool(dice.value))

  const setRank = (newRank: SkillDieRank) => (rank.value = newRank)
  const setStripe = (newStripe: SkillStripe) => (stripe.value = newStripe)

  const display = (): SkillDieRank[] => {
    return pool.value.display()
  }

  const roll = (): SkillRoll => {
    const rollResult = pool.value.roll()
    const display = rollResult.map((die) => ({ rank: die.rank, value: die.value }))
    const total = rollResult.reduce((sum, die) => sum + die.value, 0)
    const shapes = rollResult
      .reduce((list, die) => (die.shape ? [...list, die.shape] : list), [] as SkillDieShape[])
      .sort((a, b) => {
        if (a === 'Star' || b === 'Triangle') return -1
        if (a === 'Triangle' || b === 'Star') return 1
        return 0
      })

    return { display, total, shapes }
  }

  const check = (challenge: number, modifier = 0): SkillCheck => {
    const rollResult = roll()

    return {
      ...rollResult,
      challenge,
      modifier,
      total: rollResult.total + modifier,
      success: rollResult.total + modifier >= challenge
    }
  }

  return {
    rank,
    stripe,
    setRank,
    setStripe,
    display,
    roll,
    check
  }
}

export { type RollDisplay, type Skill, type SkillCheck, type SkillRoll, type SkillStripe, useSkill }
