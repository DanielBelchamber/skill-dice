import type { ObjectValues } from '@/generic.types'

const SKILL_DIE_RANK = {
  MASTER: 'Master',
  EXPERT: 'Expert',
  APPRENTICE: 'Apprentice',
  NOVICE: 'Novice'
} as const

type SkillDieRank = ObjectValues<typeof SKILL_DIE_RANK>

const SKILL_DIE_SHAPE = {
  STAR: 'Star',
  SQUARE: 'Square',
  TRIANGLE: 'Triangle'
} as const

type SkillDieShape = ObjectValues<typeof SKILL_DIE_SHAPE>

type SkillDieValue = 0 | 1 | 2 | 3 | 4 | 5

const VALUE_PYRAMID = [
  5, 4, 4, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0
] as SkillDieValue[]

type NamedProbabilityReference = Record<string, number>
type NumberedProbabilityReference = Record<number, number>

type SkillDie = {
  rank: SkillDieRank
  faceCount: number
}

const MASTER_DIE: SkillDie = {
  rank: SKILL_DIE_RANK.MASTER,
  faceCount: 6
}

const EXPERT_DIE: SkillDie = {
  rank: SKILL_DIE_RANK.EXPERT,
  faceCount: 8
}

const ADEPT_DIE: SkillDie = {
  rank: SKILL_DIE_RANK.APPRENTICE,
  faceCount: 12
}

const NOVICE_DIE: SkillDie = {
  rank: SKILL_DIE_RANK.NOVICE,
  faceCount: 20
}

const createSkillDie = (type: SkillDieRank): SkillDie => {
  switch (type) {
    case SKILL_DIE_RANK.MASTER:
      return { ...MASTER_DIE }
    case SKILL_DIE_RANK.EXPERT:
      return { ...EXPERT_DIE }
    case SKILL_DIE_RANK.APPRENTICE:
      return { ...ADEPT_DIE }
    case SKILL_DIE_RANK.NOVICE:
      return { ...NOVICE_DIE }
  }
}

const getShape = (value: SkillDieValue): SkillDieShape | null => {
  switch (value) {
    case 5:
      return 'Star'
    case 4:
      return 'Square'
    case 3:
      return 'Triangle'
    default:
      return null
  }
}

type SkillDieRoll = {
  rank: SkillDieRank
  value: SkillDieValue
  shape: SkillDieShape | null
}

const rollDie = (type: SkillDieRank, faceCount: number): SkillDieRoll => {
  const values = VALUE_PYRAMID.slice(0, faceCount)
  const rolledValue = values[Math.floor(Math.random() * faceCount)]
  return {
    rank: type,
    value: rolledValue,
    shape: getShape(rolledValue)
  }
}

const mergeProbabilities = (reference: NamedProbabilityReference): NamedProbabilityReference => {
  const mergedReference: NamedProbabilityReference = {}
  for (const key in reference) {
    const probability = reference[key]
    const newKey = key.split('=>').sort().reverse().join('=>')
    if (mergedReference[newKey]) {
      mergedReference[newKey] += probability
    } else {
      mergedReference[newKey] = probability
    }
  }
  return mergedReference
}

const calculateRollProbabilities = (
  dieList: NamedProbabilityReference[],
  reference: NamedProbabilityReference
): NamedProbabilityReference => {
  const die = dieList[0]
  const remaining = dieList.slice(1)

  // build new reference
  const newReference: NamedProbabilityReference = {}
  if (Object.keys(reference).length === 0) {
    for (const dieKey in die) {
      newReference[dieKey] = die[dieKey]
    }
  } else {
    for (const refKey in reference) {
      for (const dieKey in die) {
        const newKey = `${refKey}=>${dieKey}`
        newReference[newKey] = reference[refKey] * die[dieKey]
      }
    }
  }
  const mergedReference = mergeProbabilities(newReference)

  if (remaining.length === 0) {
    return mergedReference
  } else {
    return calculateRollProbabilities(remaining, mergedReference)
  }
}

const calculateTotalProbabilities = (
  rollProbabilities: NamedProbabilityReference
): NumberedProbabilityReference => {
  const totalProbabilities: NumberedProbabilityReference = {}
  for (const key in rollProbabilities) {
    const probability = rollProbabilities[key]
    const total = key.split('=>').reduce((sum, value) => sum + parseInt(value), 0)
    if (totalProbabilities[total]) {
      totalProbabilities[total] += probability
    } else {
      totalProbabilities[total] = probability
    }
  }
  return totalProbabilities
}

type OutcomeProbabilities = {
  rollProbabilities: NamedProbabilityReference
  totalProbabilities: NumberedProbabilityReference
}

type SkillDicePool = {
  /** display dice ranks */
  display: () => SkillDieRank[]
  /** roll dice pool to get the rank, value, and shape (if any) for each die */
  roll: () => SkillDieRoll[]
  /** calculate the probabilities for each roll outcome */
  calculateProbabilities: () => OutcomeProbabilities
}

const useDicePool = (dice: SkillDie[]): SkillDicePool => {
  const display = (): SkillDieRank[] => dice.map((d) => d.rank)

  const roll = (): SkillDieRoll[] => dice.map((die) => rollDie(die.rank, die.faceCount))

  const calculateProbabilities = () => {
    const dieOutcomes = dice.map((d) => {
      const values = VALUE_PYRAMID.slice(0, d.faceCount)
      const probabilities: NamedProbabilityReference = {}
      for (let i = 0; i <= 5; i++) {
        const count = values.filter((v) => v === i).length
        if (count > 0) {
          probabilities[i] = count / d.faceCount
        }
      }
      return probabilities
    })

    const rollProbabilities = calculateRollProbabilities(dieOutcomes, {})
    const totalProbabilities = calculateTotalProbabilities(rollProbabilities)

    return {
      rollProbabilities,
      totalProbabilities
    }
  }

  return { display, roll, calculateProbabilities }
}

export {
  type SkillDicePool,
  type SkillDie,
  type SkillDieRank,
  type SkillDieRoll,
  type SkillDieShape,
  type SkillDieValue,
  createSkillDie,
  useDicePool
}
