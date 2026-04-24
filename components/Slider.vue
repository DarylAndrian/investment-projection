<template>
  <div class="slider-wrapper">
    <label class="slider-label">{{ label }}</label>
    <div class="slider-controls">
      <Slider v-model="value" :min="min" :max="max" :step="step" class="slider" />
      <InputNumber v-model="value" :min="min" :max="max" :step="step" :prefix="prefix" :suffix="suffix" class="slider-input" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Slider from 'primevue/slider'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  label: String,
  modelValue: [Number, String],
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  prefix: String,
  suffix: String
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => +props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
.slider-wrapper { margin-bottom: 1.5rem; }
.slider-label { display: block; font-size: 0.85rem; color: #666; margin-bottom: 0.25rem; }
.slider-controls { display: flex; align-items: center; gap: 1rem; }
.slider { flex: 1; }
.slider-input { width: 120px; }
</style>