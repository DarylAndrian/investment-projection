<template>
  <div class="control-row" :class="{ disabled }">
    <label :for="`input-${label}`" class="control-label">{{ label }}</label>
    <div class="input-slider-row">
      <InputNumber
        :id="`input-${label}`"
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        :min="min"
        :max="max"
        :step="step"
        :prefix="prefix"
        :suffix="suffix"
        class="control-input"
      />
      <Slider
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        :min="min"
        :max="max"
        :step="step"
        class="control-slider"
      />
    </div>
  </div>
</template>

<script setup>
import InputNumber from 'primevue/inputnumber'
import Slider from 'primevue/slider'

defineProps({
  modelValue: { type: Number, required: true },
  label: { type: String, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.control-row {
  background: var(--bg-card);
  padding: var(--sp-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  margin-bottom: var(--sp-4);
  box-shadow: var(--shadow-xs);
  transition: box-shadow var(--duration-fast) var(--ease-in-out),
              transform var(--duration-fast) var(--ease-in-out);
}
.control-row:hover:not(.disabled) {
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}
.control-label {
  display: block;
  font-weight: var(--font-semibold);
  margin-bottom: var(--sp-3);
  color: var(--text-primary);
  font-size: var(--text-sm);
}
.input-slider-row {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}
.control-input {
  width: 180px;
  flex-shrink: 0;
}
.control-slider {
  flex: 1;
}
.disabled {
  opacity: 0.5;
  pointer-events: none;
}

@media (max-width: 768px) {
  .input-slider-row {
    flex-direction: column;
    align-items: stretch;
  }
  .control-input {
    width: 100%;
  }
}
</style>
