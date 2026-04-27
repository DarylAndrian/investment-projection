<template>
  <div class="chart-section">
    <h3>{{ title }}</h3>
    <div class="chart-container">
      <LineChart v-if="hasData" :data="chartData" />
      <div v-else class="empty-chart">
        <i class="pi pi-chart-line"></i>
        <p>No data yet. Adjust inputs to see projection.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import LineChart from './LineChart.vue'
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Projection' },
  chartData: { type: Object, default: () => ({ labels: [], datasets: [] }) }
})

const hasData = computed(() => {
  return props.chartData?.labels?.length > 0 && props.chartData?.datasets?.length > 0
})
</script>

<style scoped>
.chart-section { margin-top: 1.5rem; }
.chart-section h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; color: #1a1a1a; }
.chart-container { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 1rem; height: 280px; position: relative; }
</style>