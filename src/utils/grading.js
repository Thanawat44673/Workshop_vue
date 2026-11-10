export function parseScoreInput(input) {
  const value = input === null || input === undefined ? '' : String(input).trim()

  if (!value) {
    return { error: 'กรุณากรอกคะแนนก่อนคำนวณ' }
  }

  if (!/^-?\d+(?:\.\d+)?$/.test(value)) {
    return { error: 'กรุณากรอกคะแนนเป็นตัวเลขเท่านั้น' }
  }

  const score = Number(value)
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    return { error: 'คะแนนต้องอยู่ระหว่าง 0 ถึง 100' }
  }

  return { score }
}

export function getGrade(score) {
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}
