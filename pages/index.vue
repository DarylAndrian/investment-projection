<template>
  <div class="calculator-dashboard">
    <h1>💰 Dividend Yield Planner</h1>
    
    <!-- Tabs for Single, Split, Compare views -->
    <div class="tabs">
      <button @click="setActiveTab('single')" :class="{ active: activeTab === 'single' }">Single ETF</button>
      <button @click="setActiveTab('split')" :class="{ active: activeTab === 'split' }">JEPI + SCHD Split</button>
      <button @click="setActiveTab('compare')" :class="{ active: activeTab === 'compare' }">Compare ETFs</button>
    </div>

    <!-- Main View for Single ETF (active by default) -->
    <div v-if="activeTab === 'single'">
      <h2 class="section-title">Inputs</h2>
      <InputControls @inputChange="updateStoreValue" />
      
      <h2 class="section-title mt-6">Results Snapshot</h2>
      <!-- Use MetricCard component here -->
      <MetricCard title="Net Monthly Dividend (JEPI)" :value="store.currentMetrics.currentNetDiv"></MetricCard>

    </div >

    <!-- Placeholder for Chart Component -->
    <div v-if="activeTab === 'single'" class="chart-area">
        <ChartComponent :data="calcData" />
    </div>


  </div>
</template>

<script setup>
import { useCalculatorStore } from '../stores/calculatorStore.js'
import InputControls from '../components/InputControls.vue'
import MetricCard from '../components/MetricCard.vue'
// Assume ChartComponent exists and is imported

const store = useCalculatorStore();
const activeTab = ref('single'); 

onMounted(() => {
    store.calculate(); // Run initial calculation on mount
});

function setActiveTab(tabName) {
    activeTab.value = tabName;
}

// Handler function to pass input changes from InputControls back to the store
function updateStoreValue(key, value) {
    store.updateInput(key, value);
}
</script>

<style scoped>
/* Add general layout styles here */
.calculator-dashboard { padding: 24px; max-width: 1200px; margin: 0 auto; }
.tabs button { /* Styling for tabs */ }
.section-title { margin-top: 3rem; margin-bottom: 1.5rem;}
/* ... other necessary styles ... */
</style>