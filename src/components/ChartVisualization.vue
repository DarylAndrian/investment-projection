<template>
  <div class="chart-viz" ref="canvasContainer">
    <canvas ref="canvas"></canvas>
    <div v-if="loading" class="chart-loading">
      <i class="fas fa-spinner fa-spin" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

// Dynamic import Chart.js for smaller initial bundle
let Chart = null
let registered = false

async function ensureChart() {
  if (Chart) return Chart
  const chartModule = await import('chart.js')
  Chart = chartModule.default || chartModule.Chart
  if (!registered) {
    Chart.register(
      chartModule.LineController,
      chartModule.LineElement,
      chartModule.PointElement,
      chartModule.LinearScale,
      chartModule.CategoryScale,
      chartModule.Tooltip,
      chartModule.Legend,
      chartModule.Filler
    )
    registered = true
  }
  return Chart
}

// Format currency with 2 decimal places
function formatCurrency(value) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Check if dark mode is active
function isDarkMode() {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

const props = defineProps({
  chartData: { type: Object, required: true },
  options: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
})

const canvas = ref(null)
const canvasContainer = ref(null)
let chartInstance = null

async function createChart() {
  if (!canvas.value || !props.chartData?.datasets?.length) return
  if (chartInstance) chartInstance.destroy()

  const ChartClass = await ensureChart()
  const ctx = canvas.value.getContext('2d')
  const textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
  const textSecondary = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
  const borderLight = getComputedStyle(document.documentElement).getPropertyValue('--border-light').trim()
  const darkMode = isDarkMode()

  chartInstance = new ChartClass(ctx, {
    type: 'line',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 16,
            font: { size: 12 },
            color: textPrimary
          }
        },
        tooltip: {
          backgroundColor: darkMode ? 'rgba(30,41,59,0.9)' : 'rgba(0,0,0,0.8)',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          titleColor: '#fff',
          bodyColor: '#fff'
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxTicksLimit: 12,
            font: { size: 11 },
            color: textSecondary
          }
        },
        y: {
          ticks: {
            font: { size: 11 },
            color: textSecondary,
            callback: formatCurrency
          },
          grid: {
            color: borderLight
          }
        },
        y1: {
          position: 'right',
          ticks: {
            font: { size: 11 },
            color: textSecondary,
            callback: formatCurrency
          },
          grid: { drawOnChartArea: false }
        },
        ...props.options?.scales
      },
      ...props.options
    }
  })
}

onMounted(() => {
  nextTick(createChart)
})

watch(
  () => props.chartData,
  () => nextTick(createChart),
  { deep: true }
)

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<style scoped>
.chart-viz {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 280px;
}
.chart-viz canvas {
  width: 100% !important;
  height: 100% !important;
}
.chart-loading {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  z-index: 5;
}
:deep(.dark) .chart-loading {
  background: rgba(15, 23, 42, 0.8);
}
.chart-loading i {
  font-size: 2rem;
  color: var(--brand-500);
}
</style>
