<template>
  <div class="input-controls">
    <!-- Section 1: Core Inputs -->
    <fieldset>
      <legend>Core Assumptions</legend>

      <!-- Start Amount Slider -->
      <p class="slabel">Starting investment (USD)</p>
      <div class="srow slider-group">
        <input type="range" min="0" max="20000" step="100" v-model.number="localInputs.startAmount" @input="updateInput('startAmount', $event.target.value)">
        <span class="sval">{{ formatCurrency(localInputs.startAmount) }}</span>
      </div>

      <!-- Monthly Top-up Slider -->
      <p class="slabel">Monthly top-up (USD)</p>
      <div class="srow slider-group">
        <input type="range" min="0" max="1000" step="10" v-model.number="localInputs.monthlyTopUp" @input="updateInput('monthlyTopUp', $event.target.value)">
        <span class="sval">{{ formatCurrency(localInputs.monthlyTopUp) }}/mo</span>
      </div>

      <!-- Goal Target Slider -->
      <p class="slabel">Target monthly income (after tax)</p>
      <div class="srow slider-group">
        <input type="range" min="5" max="200" step="5" v-model.number="localInputs.targetMonthlyIncome" @input="updateInput('targetMonthlyIncome', $event.target.value)">
        <span class="sval">{{ formatCurrency(localInputs.targetMonthlyIncome) }}/mo</span>
      </div>

      <!-- Tax Rate Slider -->
      <p class="slabel">Withholding tax</p>
      <div class="srow slider-group">
        <input type="range" min="0" max="30" step="5" v-model.number="localInputs.withholdingTax" @input="updateInput('withholdingTax', $event.target.value)">
        <span class="sval">{{ localInputs.withholdingTax }}%</span>
      </div>

    </fieldset>

    <!-- Section 2: Allocation Inputs (Visible only in Split View) -->
    <div v-if="store.selectedEtf === 'SPLIT'">
      <fieldset>
        <legend>Portfolio Allocation</legend>
        <p class="slabel">JEPI allocation weight (%)</p>
        <div class="srow slider-group">
            <input type="range" min="10" max="90" step="5" v-model.number="localInputs.splitAllocationRatio" @input="updateInput('splitAllocationRatio', $event.target.value)">
            <span class="sval">{{ localInputs.splitAllocationRatio }}%</span>
        </div>
      </fieldset>
    </div>

  </div >
</template>

<script setup>
import { computed } from 'vue';
// Pinia store instance needed to access the update function
import { useCalculatorStore } from '@/stores/calculatorStore'; 

const store = useCalculatorStore();

// Use computed property derived from the store state for local binding
const localInputs = computed(() => ({
    startAmount: store.inputs.startAmount,
    monthlyTopUp: store.inputs.monthlyTopUp,
    targetMonthlyIncome: store.inputs.targetMonthlyIncome,
    withholdingTax: store.inputs.withholdingTax,
    splitAllocationRatio: store.inputs.splitAllocationRatio || 0
}));

// Function to update the Pinia Store when a slider moves
function updateInput(key, value) {
  store.updateInput(key, value);
}

// Utility for formatting numbers
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
</script>

<style scoped>
fieldset {
    border: 1px solid #eee;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
}
legend {
    font-weight: 600;
    color: #333;
    padding: 0 10px;
}
.srow { display: flex; align-items: center; gap: 20px; margin-bottom: 1rem;}

input[type="range"] {
    flex-grow: 1; /* Allows slider to take available space */
    accent-color: #378ADD;
}
.sval { min-width: 100px; text-align: right; font-weight: 500;}
</style>