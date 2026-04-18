import { Tile, FunData, LearningData, QuestionAnswer } from '../types/game'
import { generateMathQuestions } from './mathGenerator'
import { shuffle } from '../utils/shuffle'
import funData from '../data/fun.json'
import learningData from '../data/learning.json'

const PAIRS_BY_DIFFICULTY = {
  easy: 8,
  medium: 18,
  hard: 32
}

const GRID_SIZE_BY_DIFFICULTY = {
  easy: 4,
  medium: 6,
  hard: 8
}

function ensurePairCount<T>(data: T[], count: number): T[] {
  if (data.length === 0) return []
  const result = [...data]
  while (result.length < count) {
    result.push(...shuffle(data))
  }
  return result.slice(0, count)
}

export function loadFunTiles(theme: string, difficulty: 'easy' | 'medium' | 'hard') {
  const data = funData as FunData
  const themeData = data.themes[theme] || data.themes.animals
  
  const allPairs = [
    ...(themeData.easy?.pairs || []),
    ...(themeData.medium?.pairs || []),
    ...(themeData.hard?.pairs || [])
  ]

  const uniquePairs = Array.from(new Map(allPairs.map(p => [p.name, p])).values())
  const targetPairs = PAIRS_BY_DIFFICULTY[difficulty]
  
  // Ensure we have exactly targetPairs by duplicating if necessary
  const finalPairs = ensurePairCount(uniquePairs, targetPairs)
  const gridSize = GRID_SIZE_BY_DIFFICULTY[difficulty]

  const tiles: Tile[] = finalPairs.flatMap((pair, index) => [
    {
      id: index * 2,
      value: pair.emoji,
      pairId: index,
      isFlipped: false,
      isMatched: false
    },
    {
      id: index * 2 + 1,
      value: pair.emoji,
      pairId: index,
      isFlipped: false,
      isMatched: false
    }
  ])

  const shuffledTiles = shuffle(tiles)
  
  return {
    tiles: shuffledTiles,
    gridSize
  }
}

export function loadLearningTiles(subject: string, topic: string, difficulty: 'easy' | 'medium' | 'hard') {
  const targetPairs = PAIRS_BY_DIFFICULTY[difficulty]
  const gridSize = GRID_SIZE_BY_DIFFICULTY[difficulty]
  
  let finalQA: QuestionAnswer[] = []

  if (subject === 'math') {
    finalQA = generateMathQuestions(difficulty, targetPairs)
  } else {
    const data = learningData as LearningData
    const subjectData = data.subjects[subject] || data.subjects.math
    const topicData = subjectData[topic] || subjectData.addition
    
    const allQA = [
      ...(topicData.easy || []),
      ...(topicData.medium || []),
      ...(topicData.hard || [])
    ]

    const seenAnswers = new Set<string>()
    const uniqueQA = allQA.filter(qa => {
      if (seenAnswers.has(qa.a)) return false
      seenAnswers.add(qa.a)
      return true
    })

    finalQA = ensurePairCount(uniqueQA, targetPairs)
  }
  
  const tiles: Tile[] = finalQA.flatMap((qa, index) => [
    {
      id: index * 2,
      content: qa.q,
      pairId: index, // Use stable sequential pairId for match logic
      type: 'question',
      isFlipped: false,
      isMatched: false,
      explanation: qa.explanation || `The answer to ${qa.q} is ${qa.a}.`
    },
    {
      id: index * 2 + 1,
      content: qa.a,
      pairId: index,
      type: 'answer',
      isFlipped: false,
      isMatched: false,
      explanation: qa.explanation || `The answer to ${qa.q} is ${qa.a}.`
    }
  ])

  const shuffledTiles = shuffle(tiles)

  return {
    tiles: shuffledTiles,
    gridSize
  }
}
