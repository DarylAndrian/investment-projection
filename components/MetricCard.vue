<template>
  <div class="metric-card">
    <div class="title">{{ title }}</div>
    <!-- Use the appropriate color/class based on the passed value/success state -->
    <div :class="['value', { 'text-success': isSuccess }]">{{ formattedValue }}</div>
  </div >
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [String, Number], 
  isSuccess: { type: Boolean, default: false }
})

// Simple computed formatting logic here (e.g., currency formatting)
const formattedValue = computed(() => {
    if (typeof props.value === 'number') {
        return `$${props.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return props.value;
});
</script>

<style scoped>
.metric-card { 
  background: #fff; 
  border: 1px solid #ddd; 
  padding: 15px; 
  border-radius: 8px;
}
.title { color: #666; font-size: 0.9em; margin-bottom: 4px;}
.value { font-size: 2rem; font-weight: 600; }

/* Dynamic classes for styling */
.text-success { color: green !important; }
</style>