import typeData from '@/data/types.json'

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

export const CATEGORY_STYLES = {
  '秩序基石': { primary: '#7c3aed', bannerBg: '#6d28d9', light: '#f5f3ff', lighter: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
  '机变原力': { primary: '#059669', bannerBg: '#047857', light: '#ecfdf5', lighter: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  '远见智囊': { primary: '#3b82f6', bannerBg: '#2563eb', light: '#eff6ff', lighter: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
  '无界星火': { primary: '#d97706', bannerBg: '#b45309', light: '#fffbeb', lighter: '#fef3c7', text: '#92400e', border: '#fde68a' },
}

export const DIMENSION_COLORS = {
  EI: { primary: '#7c3aed', light: '#f5f3ff', text: '#5b21b6', lighter: '#ede9fe' },
  SN: { primary: '#059669', light: '#ecfdf5', text: '#065f46', lighter: '#d1fae5' },
  TF: { primary: '#3b82f6', light: '#eff6ff', text: '#1e40af', lighter: '#dbeafe' },
  JP: { primary: '#d97706', light: '#fffbeb', text: '#92400e', lighter: '#fef3c7' },
}
