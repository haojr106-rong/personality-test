<script setup>
import { computed } from 'vue'
import { CATEGORY_STYLES } from '@/lib/type-utils'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  type: {
    type: Object,
    default: undefined,
  },
  typeId: {
    type: String,
    default: undefined,
  },
  scores: {
    type: Object,
    default: undefined,
  },
})

/** 四轴中文标签 */
const axisLabels = {
  EI: ['外倾', '内倾'],
  SN: ['现实', '构想'],
  TF: ['思考', '情感'],
  JP: ['掌控', '随性'],
}

const traitTags = computed(() => {
  const id = props.typeId || '????'
  if (!props.scores || id === '????') {
    return [
      { label: '未知', color: '#94a3b8', bg: '#94a3b8/10', border: '#94a3b8/20', icon: 'help' },
      { label: '未知', color: '#94a3b8', bg: '#94a3b8/10', border: '#94a3b8/20', icon: 'help' },
      { label: '未知', color: '#94a3b8', bg: '#94a3b8/10', border: '#94a3b8/20', icon: 'help' },
      { label: '未知', color: '#94a3b8', bg: '#94a3b8/10', border: '#94a3b8/20', icon: 'help' },
    ]
  }
  const cs = categoryStyle.value
  return [
    { label: id[0] === 'E' ? axisLabels.EI[0] : axisLabels.EI[1], color: cs.primary, bg: cs.light, border: cs.border, icon: id[0] === 'E' ? 'groups' : 'person' },
    { label: id[1] === 'R' ? axisLabels.SN[0] : axisLabels.SN[1], color: cs.primary, bg: cs.light, border: cs.border, icon: id[1] === 'R' ? 'visibility' : 'psychology' },
    { label: id[2] === 'T' ? axisLabels.TF[0] : axisLabels.TF[1], color: cs.primary, bg: cs.light, border: cs.border, icon: id[2] === 'T' ? 'psychology' : 'favorite' },
    { label: id[3] === 'A' ? axisLabels.JP[0] : axisLabels.JP[1], color: cs.primary, bg: cs.light, border: cs.border, icon: id[3] === 'A' ? 'calendar_month' : 'auto_awesome' },
  ]
})

/** 各项得分（归一化到 0~100 用于展示） */
const chartBars = computed(() => {
  if (!props.scores) return []
  const max = Math.max(
    Math.abs(props.scores.EI),
    Math.abs(props.scores.SN),
    Math.abs(props.scores.TF),
    Math.abs(props.scores.JP),
    1
  )
  return [
    { axis: 'E/I', value: props.scores.EI, pct: (props.scores.EI / max) * 50, label: axisLabels.EI[props.scores.EI > 0 ? 0 : 1] },
    { axis: 'S/N', value: props.scores.SN, pct: (props.scores.SN / max) * 50, label: axisLabels.SN[props.scores.SN > 0 ? 0 : 1] },
    { axis: 'T/F', value: props.scores.TF, pct: (props.scores.TF / max) * 50, label: axisLabels.TF[props.scores.TF > 0 ? 0 : 1] },
    { axis: 'J/P', value: props.scores.JP, pct: (props.scores.JP / max) * 50, label: axisLabels.JP[props.scores.JP > 0 ? 0 : 1] },
  ]
})

/** 根据结果类型所属阵营获取主题色 */
const categoryStyle = computed(() => {
  if (!props.type) return CATEGORY_STYLES['秩序基石']
  return CATEGORY_STYLES[props.type.category] || CATEGORY_STYLES['秩序基石']
})
</script>

<template>
  <div class="w-full animate-fade-in">
    <!-- Result Container Card -->
    <div
      class="bg-white rounded-3xl shadow-[0_20px_50px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col lg:flex-row min-h-[600px] border border-slate-50"
    >
      <!-- Left: 权重图表 -->
      <div class="w-full lg:w-1/2 p-10 flex items-center justify-center relative bg-white">
        <div class="w-full aspect-square rounded-xl bg-white/50 backdrop-blur-sm p-6 flex flex-col justify-center gap-5">
          <h3 class="text-lg font-bold text-slate-400 text-center font-['Plus_Jakarta_Sans']">维度权重分布</h3>

          <div v-if="chartBars.length" class="space-y-5">
            <div v-for="bar in chartBars" :key="bar.axis" class="space-y-1.5">
              <div class="flex justify-between text-sm">
                <span class="font-bold text-slate-500">{{ bar.axis }}</span>
                <span class="font-semibold" :style="{ color: bar.value >= 0 ? categoryStyle.primary : categoryStyle.text }">
                  {{ bar.label }}
                </span>
              </div>
              <div class="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{ backgroundColor: categoryStyle.text, width: `${Math.max(0, 50 - bar.pct)}%` }"
                />
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{ backgroundColor: categoryStyle.primary, width: `${Math.max(0, 50 + bar.pct)}%` }"
                />
              </div>
              <div class="flex justify-between text-[10px] text-slate-300 font-bold">
                <span>{{ axisLabels[bar.axis.replace('/', '')]?.[1] }}</span>
                <span>{{ axisLabels[bar.axis.replace('/', '')]?.[0] }}</span>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center gap-4 h-full">
            <div class="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
              <span class="material-symbols-outlined text-5xl text-slate-300">leaderboard</span>
            </div>
            <span class="text-2xl font-bold text-slate-200">暂无数据</span>
          </div>
        </div>
      </div>

      <!-- Right: 分析区 -->
      <div class="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col">
        <!-- 头部 -->
        <div class="mb-10 flex flex-col md:flex-row gap-8 items-start">
          <div class="flex-grow">
            <div class="flex items-center gap-3 mb-4">
              <span
                class="px-4 py-1 rounded-full text-sm font-semibold"
                :style="{ backgroundColor: categoryStyle.light, color: categoryStyle.primary }"
              >
                测试结果报告
              </span>
              <div class="h-[2px] flex-grow bg-[#e0ecd7]"></div>
            </div>
            <h1 class="text-[48px] font-extrabold text-[#151e12] mb-2 font-['Plus_Jakarta_Sans']">
              {{ type?.name || '未知' }}
              <span :style="type ? { color: categoryStyle.primary } : {}">
                {{ typeId || '???' }}
              </span>
            </h1>
            <p v-if="type?.description" class="text-lg text-[#6b7c65] font-medium italic">
              "{{ type.description }}"
            </p>
            <p v-else class="text-lg text-slate-300 font-medium italic">"暂无描述"</p>
          </div>
          <!-- 头像占位 -->
          <div
            class="w-32 md:w-40 aspect-square rounded-xl flex flex-col items-center justify-center gap-2 flex-shrink-0 border-4 border-dashed"
            :style="type ? { borderColor: categoryStyle.lighter, backgroundColor: categoryStyle.light + '80' } : { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }"
          >
            <span class="material-symbols-outlined text-4xl" :style="type ? { color: categoryStyle.primary } : { color: '#94a3b8' }">image</span>
            <span class="text-[10px] font-bold uppercase tracking-tighter text-center px-2" :style="type ? { color: categoryStyle.primary } : { color: '#94a3b8' }">
              人格类型参考图
            </span>
          </div>
        </div>

        <!-- 四维标签 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div
            v-for="tag in traitTags"
            :key="tag.label"
            class="rounded-2xl flex flex-col items-center gap-2 p-4 border hover:scale-105 transition-transform"
            :style="{
              backgroundColor: tag.bg,
              borderColor: tag.border,
            }"
          >
            <span class="material-symbols-outlined" :style="{ color: tag.color }">{{ tag.icon }}</span>
            <span class="text-sm font-semibold" :style="{ color: tag.color }">{{ tag.label }}</span>
          </div>
        </div>

        <!-- 分析正文 -->
        <div class="flex-grow">
          <div
            class="flex items-start gap-4 p-8 rounded-3xl border-l-8 relative overflow-hidden bg-white shadow-sm"
            :style="type ? { borderLeftColor: categoryStyle.primary } : { borderLeftColor: '#cbd5e1' }"
          >
            <div class="relative z-10">
              <span class="material-symbols-outlined text-4xl mb-4 block" :style="type ? { color: categoryStyle.primary } : { color: '#cbd5e1' }">
                format_quote
              </span>
              <p v-if="type?.longDescription" class="text-lg leading-relaxed mb-6" :class="type ? 'text-[#3c4b36]' : 'text-slate-300'">
                {{ type.longDescription }}
              </p>
              <p v-else class="text-lg text-slate-300 leading-relaxed mb-6">
                完成人格测试后，此处将展示你的详细人格分析报告。目前尚无测试数据，请先完成测试。
              </p>
              <p v-if="type?.quote" class="text-base italic" :class="type ? 'text-[#6b7c65]' : 'text-slate-300'">
                {{ type.quote }}
              </p>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="mt-12 flex items-center justify-between">
          <button
            class="px-6 py-3 rounded-full font-bold text-sm border-2 transition-all inline-flex items-center gap-2"
            :style="{
              borderColor: categoryStyle.primary,
              color: categoryStyle.primary,
            }"
            @click="router.push('/quiz')"
            @mouseenter="$event.currentTarget.style.backgroundColor = categoryStyle.primary; $event.currentTarget.style.color = 'white'"
            @mouseleave="$event.currentTarget.style.backgroundColor = 'transparent'; $event.currentTarget.style.color = categoryStyle.primary"
          >
            {{ type ? '重新测试' : '开始测试' }}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <div class="flex gap-4">
            <button
              class="w-12 h-12 rounded-full border-2 border-[#dbe6d2] flex items-center justify-center text-[#6b7c65] transition-colors"
              :style="{
                '--hover-border': categoryStyle.primary,
                '--hover-text': categoryStyle.primary,
              }"
              @mouseenter="$event.currentTarget.style.borderColor = categoryStyle.primary; $event.currentTarget.style.color = categoryStyle.primary"
              @mouseleave="$event.currentTarget.style.borderColor = '#dbe6d2'; $event.currentTarget.style.color = '#6b7c65'"
            >
              <span class="material-symbols-outlined">share</span>
            </button>
            <button
              class="w-12 h-12 rounded-full border-2 border-[#dbe6d2] flex items-center justify-center text-[#6b7c65] transition-colors"
              @mouseenter="$event.currentTarget.style.borderColor = categoryStyle.primary; $event.currentTarget.style.color = categoryStyle.primary"
              @mouseleave="$event.currentTarget.style.borderColor = '#dbe6d2'; $event.currentTarget.style.color = '#6b7c65'"
            >
              <span class="material-symbols-outlined">download</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心优势 / 潜在盲点 / 成长建议 -->
    <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white p-8 rounded-3xl shadow-xl border-b-4" :style="{ borderBottomColor: type ? categoryStyle.primary : '#cbd5e1' }">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" :style="{ backgroundColor: type ? categoryStyle.light : '#f1f5f9' }">
          <span class="material-symbols-outlined text-3xl" :style="{ color: type ? categoryStyle.primary : '#94a3b8' }">lightbulb</span>
        </div>
        <h3 class="text-2xl font-bold text-[#151e12] mb-3 font-['Plus_Jakarta_Sans']">核心优势</h3>
        <p class="text-sm" :style="{ color: type ? categoryStyle.text : '#94a3b8' }">
          {{ type?.traits?.[0]?.description || '未知' }}
        </p>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-xl border-b-4" :style="{ borderBottomColor: type ? categoryStyle.primary : '#cbd5e1' }">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" :style="{ backgroundColor: type ? categoryStyle.light : '#f1f5f9' }">
          <span class="material-symbols-outlined text-3xl" :style="{ color: type ? categoryStyle.primary : '#94a3b8' }">warning</span>
        </div>
        <h3 class="text-2xl font-bold text-[#151e12] mb-3 font-['Plus_Jakarta_Sans']">潜在盲点</h3>
        <p class="text-sm" :style="{ color: type ? categoryStyle.text : '#94a3b8' }">
          {{ type?.traits?.[1]?.description || '未知' }}
        </p>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-xl border-b-4" :style="{ borderBottomColor: type ? categoryStyle.primary : '#cbd5e1' }">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" :style="{ backgroundColor: type ? categoryStyle.light : '#f1f5f9' }">
          <span class="material-symbols-outlined text-3xl" :style="{ color: type ? categoryStyle.primary : '#94a3b8' }">rocket_launch</span>
        </div>
        <h3 class="text-2xl font-bold text-[#151e12] mb-3 font-['Plus_Jakarta_Sans']">成长建议</h3>
        <p class="text-sm" :style="{ color: type ? categoryStyle.text : '#94a3b8' }">
          {{ type?.traits?.[2]?.description || '未知' }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-12 flex flex-col items-center opacity-40">
      <div class="flex gap-2 mb-4">
        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: categoryStyle.primary }"></div>
        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: categoryStyle.lighter }"></div>
        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: categoryStyle.light }"></div>
      </div>
      <p class="text-sm font-semibold text-[#6b7c65] uppercase tracking-widest">Discover Your True Self</p>
    </footer>
  </div>
</template>
