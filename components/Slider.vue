<template>
  <div class="srow">
    <label class="slabel">{{ label }}</label>
    <input type="range" :min="min" :max="max" :step="step" :value="modelValue" @input="$emit('update:modelValue', +$event.target.value)" style="flex:1">
    <span class="sval">{{ prefix || '' }}{{ modelValue }}{{ suffix || '' }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [Number, String],
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  prefix: String,
  suffix: String
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.srow { display: flex; align-items: center; gap: 12px; margin-bottom: 1.1rem; }
.slabel { font-size: 12px; color: #666; margin-bottom: 4px; letter-spacing: .03em; white-space: nowrap; }
.sval { font-size: 14px; font-weight: 500; min-width: 72px; text-align: right; color: #1a1a1a; }
input[type=range] { flex: 1; accent-color: #378ADD; }
</style>