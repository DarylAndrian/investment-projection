<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { Chart } from 'chart.js'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ labels: [], datasets: [] })
  }
})

const canvas = ref(null)
let chart = null

function render() {
  if (chart) chart.destroy()
  if (!canvas.value) return
  chart = new Chart(canvas.value, {
    type: 'line',
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: '#eee' } }
      }
    }
  })
}

onMounted(() => render())
onUnmounted(() => { if (chart) chart.destroy() })
watch(() => props.data, () => render(), { deep: true })
</script>

<style scoped>
.chart-container { position: relative; width: 100%; height: 100%; }
</style>