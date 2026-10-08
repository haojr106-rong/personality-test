<script setup>
defineProps({
  question: {
    type: Object,
    required: true,
  },
  isActive: Boolean,
  isCurrent: Boolean,
  selectedValue: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['select'])
</script>

<template>
  <!-- 已做完 → 变暗 -->
  <section
    v-if="!isActive"
    class="bg-slate-50/50 rounded-xl p-4 md:p-6 opacity-30 shadow-sm transition-all duration-500 my-4"
  >
    <h3
      class="text-base md:text-lg font-bold text-center mb-6 text-slate-500 leading-snug"
    >
      {{ question.text }}
    </h3>
    <div class="flex flex-col gap-2 w-full max-w-lg mx-auto">
      <button
        v-for="(choice, idx) in question.choices"
        :key="idx"
        :class="[
          'w-full py-2.5 px-5 text-left rounded-xl border-2 transition-colors text-sm',
          selectedValue === choice.value
            ? 'border-slate-400 bg-slate-200 text-slate-600 font-bold'
            : 'border-slate-200 text-slate-400'
        ]"
        @click="emit('select', choice.value)"
      >
        {{ choice.text }}
      </button>
    </div>
  </section>

  <!-- 当前题（第一个未答）→ 亮 + 绿环高亮 -->
  <section
    v-else-if="isCurrent"
    class="bg-white rounded-xl p-6 md:p-8 shadow-[0_10px_30px_rgba(59,130,246,0.1)] ring-1 ring-inset ring-[#059669]/40 transition-colors duration-500 z-10 relative my-6"
  >
    <h3
      class="text-lg md:text-xl font-bold text-center mb-8 text-[#151e12] leading-snug"
    >
      {{ question.text }}
    </h3>
    <div class="flex flex-col gap-3 w-full max-w-lg mx-auto px-1">
      <button
        v-for="(choice, idx) in question.choices"
        :key="idx"
        :class="[
          'w-full py-3 px-5 text-left rounded-xl border-2 transition-colors duration-300 text-sm',
          selectedValue === choice.value
            ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#2563eb] font-bold shadow-sm'
            : 'border-slate-300 hover:border-[#3b82f6]/50 hover:bg-slate-50 text-[#151e12]'
        ]"
        @click="emit('select', choice.value)"
      >
        {{ choice.text }}
      </button>
    </div>
  </section>

  <!-- 未答但不是当前题 → 亮色但不带绿环 -->
  <section
    v-else
    class="bg-white rounded-xl p-6 md:p-8 shadow-sm transition-colors duration-500 my-6"
  >
    <h3
      class="text-lg md:text-xl font-bold text-center mb-8 text-[#151e12] leading-snug"
    >
      {{ question.text }}
    </h3>
    <div class="flex flex-col gap-3 w-full max-w-lg mx-auto px-1">
      <button
        v-for="(choice, idx) in question.choices"
        :key="idx"
        :class="[
          'w-full py-3 px-5 text-left rounded-xl border-2 transition-colors duration-300 text-sm',
          selectedValue === choice.value
            ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#2563eb] font-bold shadow-sm'
            : 'border-slate-300 hover:border-[#3b82f6]/50 hover:bg-slate-50 text-[#151e12]'
        ]"
        @click="emit('select', choice.value)"
      >
        {{ choice.text }}
      </button>
    </div>
  </section>
</template>
