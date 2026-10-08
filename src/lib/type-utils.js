import typeData from '@/data/types.json'
import questionsData from '@/data/questions.json'
import analysisData from '@/data/type-analysis.json'

const types = typeData

export function getTypeById(id) {
  return types.find(t => t.id === id)
}

export function getTypesByCategory() {
  const groups = {}
  for (const t of types) {
    if (!groups[t.category]) groups[t.category] = []
    groups[t.category].push(t)
  }
  return groups
}

export function getTypesByCategoryName(category) {
  return types.filter(t => t.category === category)
}

/** 阵营主题色配置 */
export const CATEGORY_STYLES = {
  '秩序基石': { primary: '#7c3aed', bannerBg: '#6d28d9', light: '#f5f3ff', lighter: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
  '机变原力': { primary: '#059669', bannerBg: '#047857', light: '#ecfdf5', lighter: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  '远见智囊': { primary: '#3b82f6', bannerBg: '#2563eb', light: '#eff6ff', lighter: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
  '无界星火': { primary: '#d97706', bannerBg: '#b45309', light: '#fffbeb', lighter: '#fef3c7', text: '#92400e', border: '#fde68a' },
}

/** 四轴得分 */
/** 维度颜色映射（四原色体系） */
export const DIMENSION_COLORS = {
  EI: { primary: '#7c3aed', light: '#f5f3ff', text: '#5b21b6', lighter: '#ede9fe' },   // 静谧紫
  SN: { primary: '#059669', light: '#ecfdf5', text: '#065f46', lighter: '#d1fae5' },   // 自然绿
  TF: { primary: '#3b82f6', light: '#eff6ff', text: '#1e40af', lighter: '#dbeafe' },   // 逻辑蓝
  JP: { primary: '#d97706', light: '#fffbeb', text: '#92400e', lighter: '#fef3c7' },   // 灵感金
}

/** 归一化得分（含原始分、绝对最大值、归一化百分比） */
/**
 * 计算每个维度的"绝对最大值"：将该维度下所有题目的
 * 单题最大可能得分与相应权重相乘后求和。
 * 对 circle 题：最大绝对值为 2（取值 [-2,2]）
 * 对 options 题：取 choices 中绝对值最大的 value
 */
export function calculateAbsoluteMax() {
  const maxScores = { EI: 0, SN: 0, TF: 0, JP: 0 }
  for (const q of questionsData) {
    // 单题最大可能绝对值
    let maxVal = 2 // circle 题取值 ±2
    if (q.type === 'options' && q.choices) {
      maxVal = Math.max(...q.choices.map(c => Math.abs(c.value)))
    }
    const score = maxVal * Math.abs(q.sign || 1) * (q.weight || 1)
    if (q.axis === 'E_I') maxScores.EI += score
    if (q.axis === 'S_N') maxScores.SN += score
    if (q.axis === 'T_F') maxScores.TF += score
    if (q.axis === 'J_P') maxScores.JP += score
  }
  return maxScores
}

/**
 * 计算归一化得分（核心算法）：
 * 1. 遍历用户作答，每道题的实际得分 = 选项分值 × 权重 × 正反向符号
 * 2. 累加得到范围在 [-absoluteMax, +absoluteMax] 之间的原始得分
 * 3. 归一化公式：(rawScore + absoluteMax) / (2 × absoluteMax) × 100
 *    将跨度映射到 0%–100%
 */
export function calculateNormalizedScores(answers) {
  const rawScores = { EI: 0, SN: 0, TF: 0, JP: 0 }
  const absoluteMax = calculateAbsoluteMax()

  for (const [qId, val] of Object.entries(answers)) {
    const question = questionsData.find(q => q.id === parseInt(qId))
    if (!question) continue
    const score = val * (question.sign || 1) * (question.weight || 1)
    if (question.axis === 'E_I') rawScores.EI += score
    if (question.axis === 'S_N') rawScores.SN += score
    if (question.axis === 'T_F') rawScores.TF += score
    if (question.axis === 'J_P') rawScores.JP += score
  }

  const pct = {}
  for (const key of ['EI', 'SN', 'TF', 'JP']) {
    const max = absoluteMax[key]
    pct[key] = max === 0 ? 50 : ((rawScores[key] + max) / (2 * max)) * 100
  }

  return { raw: rawScores, max: absoluteMax, normalized: pct }
}

const analysis = analysisData

export function getAnalysisById(id) {
  return analysis.find(a => a.id === id)
}

/** 计算得分 → 匹配人格类型 */
export function calculateType(answers) {
  const scores = { EI: 0, SN: 0, TF: 0, JP: 0 }

  for (const [qId, val] of Object.entries(answers)) {
    const question = questionsData.find(q => q.id === parseInt(qId))
    if (!question) continue
    const finalScore = val * (question.sign || 1) * (question.weight || 1)
    if (question.axis === 'E_I') scores.EI += finalScore
    if (question.axis === 'S_N') scores.SN += finalScore
    if (question.axis === 'T_F') scores.TF += finalScore
    if (question.axis === 'J_P') scores.JP += finalScore
  }

  // 四轴正负 → 4 位类型码
  const first  = scores.EI > 0 ? 'E' : 'I'
  const second = scores.SN > 0 ? 'R' : 'V'
  const third  = scores.TF > 0 ? 'T' : 'H'
  const fourth = scores.JP > 0 ? 'A' : 'F'
  const typeId = first + second + third + fourth

  return { typeId, type: getTypeById(typeId), scores }
}
