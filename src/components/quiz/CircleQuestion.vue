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

const circleValues = [2, 1, 0, -1, -2]
</script>

<template>
  <!-- 已做完 → 变暗 -->
  <section
    v-if="!isActive"
    class="bg-slate-50/50 rounded-xl p-4 md:p-6 opacity-30 shadow-sm transition-all duration-500 my-4"
  >
    <h3
      class="text-base md:text-lg font-bold text-center mb-8 text-slate-500"
    >
      {{ question.text }}
    </h3>
    <div class="flex items-center justify-between max-w-xl mx-auto px-1">
      <span class="text-xs font-bold text-slate-400">同意</span>
      <div class="flex items-center gap-4 md:gap-8">
        <button
          v-for="(val, index) in circleValues"
          :key="val"
          :class="[
            'rounded-full border-[3px] transition-colors',
            index === 2 ? 'w-5 h-5' : (index === 1 || index === 3) ? 'w-8 h-8' : 'w-11 h-11',
            selectedValue === val ? 'bg-slate-400 border-slate-400' : 'border-slate-200'
          ]"
          @click="emit('select', val)"
        />
      </div>
      <span class="text-xs font-bold text-slate-400">不同意</span>
    </div>
  </section>

  <!-- 当前题（第一个未答）→ 亮 + 绿环高亮 -->
  <section
    v-else-if="isCurrent"
    class="bg-white rounded-xl p-6 md:p-8 shadow-[0_10px_30px_rgba(59,130,246,0.1)] ring-1 ring-inset ring-[#059669]/40 transition-colors duration-500 z-10 relative my-6"
  >
    <h3
      class="text-lg md:text-xl font-bold text-center mb-10 text-[#151e12] leading-snug"
    >
      {{ question.text }}
    </h3>
    <div class="flex items-center justify-between max-w-xl mx-auto px-2">
      <span class="text-xs font-extrabold text-[#059669]">同意</span>

      <div class="flex items-center gap-3 md:gap-5">
        <button
          v-for="(val, index) in circleValues"
          :key="val"
          :class="[
            'rounded-full border-[3px] transition-colors duration-300 flex items-center justify-center',
            index === 2 ? 'w-7 h-7' : (index === 1 || index === 3) ? 'w-10 h-10' : 'w-14 h-14',
            selectedValue === val
              ? 'bg-[#3b82f6] border-[#3b82f6] shadow-md'
              : 'border-slate-300 hover:bg-slate-50'
          ]"
          @click="emit('select', val)"
        />
      </div>

      <span class="text-xs font-extrabold text-[#7c3aed]">不同意</span>
    </div>
  </section>

  <!-- 未答但不是当前题 → 亮色但不带绿环 -->
  <section
    v-else
    class="bg-white rounded-xl p-6 md:p-8 shadow-sm transition-colors duration-500 my-6"
  >
    <h3
      class="text-lg md:text-xl font-bold text-center mb-10 text-[#151e12] leading-snug"
    >
      {{ question.text }}
    </h3>
    <div class="flex items-center justify-between max-w-xl mx-auto px-2">
      <span class="text-xs font-extrabold text-slate-400">同意</span>

      <div class="flex items-center gap-3 md:gap-5">
        <button
          v-for="(val, index) in circleValues"
          :key="val"
          :class="[
            'rounded-full border-[3px] transition-colors duration-300 flex items-center justify-center',
            index === 2 ? 'w-7 h-7' : (index === 1 || index === 3) ? 'w-10 h-10' : 'w-14 h-14',
            selectedValue === val
              ? 'bg-[#3b82f6] border-[#3b82f6] shadow-md'
              : 'border-slate-300 hover:bg-slate-50'
          ]"
          @click="emit('select', val)"
        />
      </div>

      <span class="text-xs font-extrabold text-[#7c3aed]">不同意</span>
    </div>
  </section>
</template>
