<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import {
  calculateType,
  calculateNormalizedScores,
  getAnalysisById,
  CATEGORY_STYLES,
  DIMENSION_COLORS,
} from '@/lib/type-utils'

const store = useQuizStore()
const router = useRouter()

/* ========== 计算类型 & 归一化得分 ========== */
const result = computed(() => {
  const { typeId, type, scores } = calculateType(store.answers)
  const norm = calculateNormalizedScores(store.answers)
  return { typeId, type, scores, norm }
})

const hasResult = computed(() => store.allAnswered)

function restartQuiz() {
  if (!window.confirm('重新测试将清空本次测评结果，是否继续？')) return
  store.resetQuiz()
  router.replace('/quiz')
}

/* ========== 头像图片加载 ========== */
const imageModules = import.meta.glob('@/assets/16_type/**/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const typeImages = {}
for (const [filePath, url] of Object.entries(imageModules)) {
  const match = filePath.match(/([A-Z]+)[（(].+[）)].*\.png$/)
  if (match) typeImages[match[1]] = url
}
const avatarUrl = computed(() => typeImages[result.value.typeId] || '')

/* ========== 阵营主题色 ========== */
const categoryStyle = computed(() => {
  if (!result.value.type) return CATEGORY_STYLES['秩序基石']
  return CATEGORY_STYLES[result.value.type.category] || CATEGORY_STYLES['秩序基石']
})

/* ========== 类型详情分析 ========== */
const analysis = computed(() => getAnalysisById(result.value.typeId))

/* ========== 类型码四个字母 → 四原色 ========== */
const typeCodeColors = computed(() => {
  const id = result.value.typeId
  if (!id || id.length < 4) return []
  const axisOrder = ['EI', 'SN', 'TF', 'JP']
  return id.split('').map((letter, i) => ({
    letter,
    color: DIMENSION_COLORS[axisOrder[i]].primary,
  }))
})

/* ========== 四维配置 ========== */
const DIMENSIONS = [
  { key: 'EI', label: '精力来源',  leftLabel: '内倾',  rightLabel: '外倾', icon: 'battery_low' },
  { key: 'SN', label: '认知方式',  leftLabel: '构想',  rightLabel: '现实', icon: 'visibility' },
  { key: 'TF', label: '决策依据',  leftLabel: '情感',  rightLabel: '思考', icon: 'balance' },
  { key: 'JP', label: '生活态度',  leftLabel: '随性',  rightLabel: '掌控', icon: 'calendar_month' },
]

/** 根据归一化得分生成进度条的展示数据 */
const barData = computed(() => {
  const norm = result.value.norm.normalized
  return DIMENSIONS.map(dim => {
    const pct = norm[dim.key]
    const color = DIMENSION_COLORS[dim.key].primary
    const isRight = pct > 50
    let displayText
    if (Math.abs(pct - 50) < 0.5) {
      displayText = '平衡'
    } else if (isRight) {
      displayText = `${dim.rightLabel} · ${Math.round(pct)}%`
    } else {
      displayText = `${dim.leftLabel} · ${Math.round(100 - pct)}%`
    }
    return {
      ...dim,
      pct: Math.round(pct),
      displayText,
      isRight,
      color,
      lightBg: DIMENSION_COLORS[dim.key].light,
      textColor: DIMENSION_COLORS[dim.key].text,
    }
  })
})

</script>

<template>
  <!-- ====== 无结果 ====== -->
  <div
    v-if="!hasResult"
    class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in"
  >
    <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
      <span class="material-symbols-outlined text-5xl text-slate-400">lock</span>
    </div>
    <h2 class="text-3xl font-bold text-[#151e12] mb-3 font-['Plus_Jakarta_Sans']">尚未进行测试，暂无结果</h2>
    <p class="text-lg text-[#6b7c65] mb-8 max-w-md">
      请先完成全部 60 道性格探索题，系统才能为您生成专属的人格分析报告。
    </p>
    <button
      class="bg-[#059669] text-white px-10 py-4 rounded-full font-bold shadow-[0_10px_20px_rgba(5,150,105,0.2)] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(5,150,105,0.3)] transition-all active:scale-95 inline-flex items-center gap-2"
      @click="router.push('/quiz')"
    >
      <span>立即开始测试</span>
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  </div>

  <!-- ====== 结果页 ====== -->
  <div v-else class="min-h-screen bg-[#f8fafc]">

    <!-- ============================================================ -->
    <!-- PART 1: 阵营色背景 + 白字中文 + 黑字英文 + 右侧插图         -->
    <!-- ============================================================ -->
    <section style="background-color: #C4C9D1; clip-path: polygon(0% 0%, 100% 0%, 98.5% 25%, 100% 55%, 100% 100%, 72% 98.5%, 58% 100%, 42% 98.5%, 28% 100%, 0% 100%, 1.5% 65%, 0% 35%);">
      <div class="px-6 py-12 md:py-16">
        <div class="flex flex-col md:flex-row items-start justify-between max-w-3xl mx-auto gap-6 md:gap-0">
          <!-- 左侧文字 — 顶对齐，偏左 -->
          <div class="text-left">
            <p class="text-slate-600 text-base font-medium tracking-wide">
              你的人格类型是
            </p>

            <h1
              class="mt-2 text-4xl md:text-5xl lg:text-6xl font-black leading-tight font-['Plus_Jakarta_Sans']" :style="{ color: categoryStyle.primary }"
            >
              {{ result.type?.name || '未知' }}
            </h1>

            <div class="flex items-center gap-1 mt-2">
              <span
                v-for="(item, i) in typeCodeColors"
                :key="i"
                class="text-2xl md:text-3xl font-black text-[#151e12]/90"
              >
                {{ item.letter }}
              </span>
            </div>
          </div>

          <!-- 右侧头像 -->
          <div class="shrink-0 mt-1">
            <div class="relative">
              <div
                class="absolute inset-0 rounded-2xl blur-xl opacity-30"
                :style="{ backgroundColor: categoryStyle.lighter }"
              ></div>
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                :alt="`${result.typeId} 人格类型图`"
                class="relative w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl shadow-lg ring-2 ring-white/20"
              />
              <div
                v-else
                class="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl shadow-lg flex items-center justify-center bg-white/15"
              >
                <span class="material-symbols-outlined text-5xl text-white/60">person</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- PART 2: 人格详细分析                                          -->
    <!-- ============================================================ -->
    <section class="max-w-3xl mx-auto px-4 md:px-6 mt-8" v-if="analysis">
      <div
        class="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 space-y-6"
      >
        <!-- 概述 -->
        <div>
          <h3 class="text-lg font-bold text-[#151e12] mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-xl" :style="{ color: categoryStyle.primary }">psychology</span>
            人格概述
          </h3>
          <p class="text-slate-600 leading-relaxed text-sm">{{ analysis.overview }}</p>
        </div>

        <hr class="border-slate-100" />

        <!-- 核心优势 -->
        <div>
          <h3 class="text-sm font-bold text-[#151e12] mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg" :style="{ color: '#059669' }">lightbulb</span>
            核心优势
          </h3>
          <ul class="space-y-2">
            <li
              v-for="(item, i) in analysis.strengths"
              :key="i"
              class="flex items-start gap-2.5 text-sm text-slate-600"
            >
              <span class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" :style="{ backgroundColor: '#059669' }"></span>
              {{ item }}
            </li>
          </ul>
        </div>

        <hr class="border-slate-100" />

        <!-- 潜在盲点 -->
        <div>
          <h3 class="text-sm font-bold text-[#151e12] mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg" :style="{ color: '#d97706' }">warning</span>
            潜在盲点
          </h3>
          <ul class="space-y-2">
            <li
              v-for="(item, i) in analysis.weaknesses"
              :key="i"
              class="flex items-start gap-2.5 text-sm text-slate-600"
            >
              <span class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" :style="{ backgroundColor: '#d97706' }"></span>
              {{ item }}
            </li>
          </ul>
        </div>

        <hr class="border-slate-100" />

        <!-- 职场路径 + 人际关系 + 成长建议 三列 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl" :style="{ backgroundColor: categoryStyle.light }">
            <h4 class="text-xs font-bold text-[#151e12] mb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base" :style="{ color: categoryStyle.primary }">work</span>
              职场路径
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">{{ analysis.career }}</p>
          </div>
          <div class="p-4 rounded-xl" :style="{ backgroundColor: categoryStyle.light }">
            <h4 class="text-xs font-bold text-[#151e12] mb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base" :style="{ color: categoryStyle.primary }">favorite</span>
              人际关系
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">{{ analysis.relationship }}</p>
          </div>
          <div class="p-4 rounded-xl" :style="{ backgroundColor: categoryStyle.light }">
            <h4 class="text-xs font-bold text-[#151e12] mb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base" :style="{ color: categoryStyle.primary }">rocket_launch</span>
              成长建议
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">{{ analysis.growth }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- PART 3: 四维双向进度条 — 核心算法展示                         -->
    <!-- ============================================================ -->
    <section class="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-black text-[#151e12] font-['Plus_Jakarta_Sans']">
          维度深度分析
        </h2>
        <p class="mt-3 text-slate-500 text-sm">
          基于加权归一化算法，精准呈现你在四个核心维度上的倾向分布
        </p>
        <div class="flex items-center justify-center gap-2 mt-5">
          <span class="w-12 h-1 rounded-full" :style="{ backgroundColor: categoryStyle.primary }"></span>
          <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: categoryStyle.lighter }"></span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        <div
          v-for="bar in barData"
          :key="bar.key"
          class="bg-white rounded-2xl p-6 md:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300"
        >
          <!-- 维度头部 -->
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2.5">
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center"
                :style="{ backgroundColor: bar.lightBg }"
              >
                <span class="material-symbols-outlined text-lg" :style="{ color: bar.color }">
                  {{ bar.icon }}
                </span>
              </div>
              <span class="font-bold text-[#151e12] text-sm">{{ bar.label }}</span>
            </div>
            <span
              class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full"
              :style="{ backgroundColor: bar.lightBg, color: bar.textColor }"
            >
              {{ bar.key.replace('_', '/') }}
            </span>
          </div>

          <!-- ===== 双向进度条 ===== -->
          <div class="relative pt-2 pb-3">
            <!-- 左右标签 -->
            <div class="flex justify-between text-xs mb-2">
              <span class="font-semibold" :style="{ color: bar.textColor }">{{ bar.leftLabel }}</span>
              <span class="font-semibold" :style="{ color: bar.textColor }">{{ bar.rightLabel }}</span>
            </div>

            <!-- 进度条轨道 — 颜色充满，靠游标区分倾向 -->
            <div
              class="relative h-2.5 rounded-full overflow-visible"
              :style="{ backgroundColor: bar.color + '20' }"
            >
              <!-- 50% 中点标记 -->
              <div
                class="absolute top-0 bottom-0 w-px z-10"
                :style="{ backgroundColor: bar.color + '50', left: '50%' }"
              ></div>

              <!-- 圆形游标指示器 — CSS left 直接绑定归一化百分比 -->
              <div
                class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full shadow-md border-[3px] border-white transition-all duration-1000 ease-out z-20"
                :style="{
                  left: `${bar.pct}%`,
                  backgroundColor: bar.color,
                  boxShadow: `0 0 0 4px ${bar.color}15, 0 3px 10px ${bar.color}30`,
                }"
              >
                <div class="absolute inset-0 rounded-full bg-white/20 scale-[0.45]"></div>
              </div>
            </div>
          </div>

          <!-- 主导倾向展示 -->
          <div class="flex items-center justify-center gap-1.5 mt-1.5 pt-2.5 border-t border-slate-50">
            <div
              class="w-1.5 h-1.5 rounded-full"
              :style="{ backgroundColor: bar.color }"
            ></div>
            <span
              class="font-extrabold text-base tracking-tight"
              :style="{ color: bar.color }"
            >
              {{ bar.displayText }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <div class="flex justify-center pb-16">
      <button
        class="rounded-full border-2 px-8 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md"
        :style="{ borderColor: categoryStyle.primary, color: categoryStyle.primary }"
        @click="restartQuiz"
      >
        重新进行测评
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
