import { QuestionAnswer } from '../types/game';

type Difficulty = 'easy' | 'medium' | 'hard';

export function generateMathQuestions(difficulty: Difficulty, count: number): QuestionAnswer[] {
  const questions: QuestionAnswer[] = [];
  const usedAnswers = new Set<number>();

  while (questions.length < count) {
    const qa = generateSingleQuestion(difficulty);
    const answerValue = evalAnswer(qa);

    // Ensure answer is unique and valid (integer)
    if (qa && !usedAnswers.has(answerValue) && Number.isInteger(answerValue)) {
      usedAnswers.add(answerValue);
      questions.push({
        q: qa.q,
        a: qa.a,
        pairId: questions.length
      });
    }
  }

  return questions;
}

function generateSingleQuestion(difficulty: Difficulty): { q: string, a: string } {
  let num1: number, num2: number, op: string;

  switch (difficulty) {
    case 'easy':
      // Numbers 1-10, Addition and Multiplication
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      op = Math.random() > 0.5 ? '+' : '×';
      if (op === '×') {
        num1 = Math.floor(Math.random() * 5) + 1; // Keep multiplication simple for easy
        num2 = Math.floor(Math.random() * 5) + 1;
      }
      return formatQA(num1, num2, op);

    case 'medium':
      // Numbers 5-20, Mix of operations
      const opsMedium = ['+', '-', '×'];
      op = opsMedium[Math.floor(Math.random() * opsMedium.length)];
      num1 = Math.floor(Math.random() * 15) + 5;
      num2 = Math.floor(Math.random() * 15) + 5;
      
      if (op === '-') {
        if (num1 < num2) [num1, num2] = [num2, num1]; // Avoid negative
      }
      return formatQA(num1, num2, op);

    case 'hard':
      // Numbers up to 100, Advanced operations
      const opsHard = ['+', '-', '×', '÷', '√'];
      op = opsHard[Math.floor(Math.random() * opsHard.length)];
      
      if (op === '√') {
        const root = Math.floor(Math.random() * 10) + 2;
        return { q: `√${root * root}`, a: `${root}` };
      }
      
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;

      if (op === '÷') {
        const divisor = Math.floor(Math.random() * 12) + 2;
        const quotient = Math.floor(Math.random() * 10) + 2;
        return { q: `${divisor * quotient} ÷ ${divisor}`, a: `${quotient}` };
      }
      
      if (op === '×') {
        num1 = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 12) + 2;
      }

      if (op === '-') {
        if (num1 < num2) [num1, num2] = [num2, num1];
      }

      return formatQA(num1, num2, op);

    default:
      return { q: '1 + 1', a: '2' };
  }
}

function formatQA(n1: number, n2: number, op: string): { q: string, a: string } {
  let ans: number;
  let qStr = `${n1} ${op} ${n2}`;
  
  if (op === '+') ans = n1 + n2;
  else if (op === '-') ans = n1 - n2;
  else if (op === '×') ans = n1 * n2;
  else ans = n1 / n2;

  return { q: qStr, a: ans.toString() };
}

function evalAnswer(qa: { q: string, a: string }): number {
  return parseFloat(qa.a);
}
