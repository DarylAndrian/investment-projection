<template>
  <div class="chart-container">
    <h3>Projection Timeline</h3>
    <!-- Canvas element where Chart.js will draw -->
    <canvas ref="myChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// We need to assume Chart.js is globally available or imported via assets/setup
// For simplicity here, we assume it's included in the main build process.
// If using standard Vue CLI/Vite setup: import { Line } from 'vue-chartjs';

const myChart = ref(null);

// Props to receive formatted data from the store (time labels and value arrays)
const props = defineProps({
    data: { 
        type: Object, 
        required: true // Expects an object with labels and datasets
    }
});

let chartInstance = null;

onMounted(() => {
  // Initialize Chart.js when the component mounts
  initializeChart();
});

// Function to draw/update the chart whenever props change (data changes)
const initializeChart = () => {
    if (myChart.value && props.data.labels && props.data.datasets) {
        const ctx = myChart.value.getContext('2d');
        
        // Destroy previous instance if exists to prevent memory leaks/overlapping charts
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: props.data.labels, // Years or months
                datasets: [
                    {
                        label: 'Portfolio Value',
                        data: props.data.datasets[0].values, 
                        borderColor: '#378ADD',
                        tension: 0.2,
                        fill: false
                    },
                     // Add second dataset here if needed (e.g., Goal Line)
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    }
};

// Expose chartInstance if needed for external updates/controls (e.g., on store change)
defineExpose({ 
    chartInstance 
});
</script>

<style scoped>
.chart-container {
  height: 400px; /* Define a fixed height for the canvas */
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}
/* Chart.js specific styling usually handled by CSS framework, but good practice to include base styles */
</style>