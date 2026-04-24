import { defineStore } from 'pinia';

// Financial constants for ETFs
const ETF = {
  JEPI: { yield: 0.0826, growth: 0.02, er: 0.0035, freq: 12, label: 'JEPI', color: '#378ADD' },
  SCHD: { yield: 0.0335, growth: 0.07, er: 0.0006, freq: 4, label: 'SCHD', color: '#639922' }
};

/**
 * Calculates the monthly dividend payout based on current assets and ETF specifics.
 * @param {number} balance - Current portfolio balance
 * @param {number} monthlyTopUp - Monthly contribution
 * @param {Object} etf - The ETF object from constants
 * @param {number} taxRate - Tax rate percentage
 * @returns {number} Net monthly dividend ($)
 */
function calculateDividend(balance, monthlyTopUp, etf, taxRate) {
  const annualDiv = (balance + monthlyTopUp) * etf.yield;
  const monthlyDiv = annualDiv / 12;
  const netDiv = monthlyDiv * (1 - taxRate / 100);
  return Math.max(0, netDiv);
}

/**
 * Runs monthly simulation for a single ETF or combined portfolio
 * @param {Array} allocations - Array of { etf, balance, monthlyTopUp }
 * @param {number} targetMonthlyIncome - Target after-tax monthly income
 * @param {number} taxRate - Tax rate percentage
 * @returns {Object} Simulation results
 */
function runSimulation(allocations, targetMonthlyIncome, taxRate) {
  const MAX_MONTHS = 300; // 25 years
  let month = 0;

  for (month = 1; month <= MAX_MONTHS; month++) {
    // Calculate total dividend across all allocations
    let totalDiv = 0;
    for (const alloc of allocations) {
      totalDiv += calculateDividend(alloc.balance, alloc.monthlyTopUp, alloc.etf, taxRate);
    }

    // Check goal
    if (month > 1 && totalDiv >= targetMonthlyIncome) {
      const totalBalance = allocations.reduce((sum, a) => sum + a.balance, 0);
      return { months: month, portfolioValue: totalBalance, reached: true };
    }

    // Compound each allocation
    for (const alloc of allocations) {
      const monthlyGrowth = alloc.etf.growth / 12;
      alloc.balance = alloc.balance * (1 + monthlyGrowth) + alloc.monthlyTopUp;
    }
  }

  const totalBalance = allocations.reduce((sum, a) => sum + a.balance, 0);
  return { months: MAX_MONTHS, portfolioValue: totalBalance, reached: false };
}


export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    // --- USER INPUT STATE ---
    selectedEtf: 'JEPI', 
    inputs: {
      startAmount: 2000, // Starting investment (USD)
      monthlyTopUp: 100, // Monthly top-up (USD)
      targetMonthlyIncome: 30, // Goal income target (after tax)
      withholdingTax: 30, // Withholding tax (%)
      splitAllocationRatio: 60, // Used if selectedEtf is 'SPLIT'
    },
    // --- RESULTS STATE ---
    results: {
      currentNetDiv: null,
      timeToGoalMonths: null,
      portfolioValueAtGoal: null,
      isGoalReached: false,
      metrics: {} 
    }
  }),
  getters: {
    currentMetrics: (state) => state.results 
  },
  actions: {
    setEtf(etfKey) {
      this.selectedEtf = etfKey;
      this.calculate();
    },
    updateInput(key, value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        this.inputs[key] = numValue;
      }
      this.calculate();
    },
    calculate() {
      const { startAmount: start, monthlyTopUp: monthly, targetMonthlyIncome: target, withholdingTax: tax, splitAllocationRatio: splitRatio } = this.inputs;

      let netDivResult = null;
      let goalMonths = null;
      let finalValue = null;
      let isReached = false;
      let etfDetails = {};

      if (this.selectedEtf === 'JEPI' || this.selectedEtf === 'SCHD') {
        const etf = ETF[this.selectedEtf];

        // Current dividend (based on starting amount + first month top-up)
        netDivResult = calculateDividend(start, monthly, etf, tax);
        etfDetails = { name: etf.label, color: etf.color };

        // Run simulation
        const simulation = runSimulation(
          [{ etf, balance: start, monthlyTopUp: monthly }],
          target,
          tax
        );

        goalMonths = simulation.months;
        finalValue = Math.floor(simulation.portfolioValue);
        isReached = simulation.reached;

      } else if (this.selectedEtf === 'SPLIT') {
        const jepiBalance = start * splitRatio / 100;
        const schdBalance = start - jepiBalance;
        const jepiMonthly = monthly * splitRatio / 100;
        const schdMonthly = monthly - jepiMonthly;

        // Current dividend
        netDivResult = calculateDividend(jepiBalance, jepiMonthly, ETF.JEPI, tax) +
                       calculateDividend(schdBalance, schdMonthly, ETF.SCHD, tax);

        etfDetails = [
          { name: ETF.JEPI.label, color: ETF.JEPI.color, weight: splitRatio },
          { name: ETF.SCHD.label, color: ETF.SCHD.color, weight: 100 - splitRatio }
        ];

        // Run split simulation
        const simulation = runSimulation(
          [
            { etf: ETF.JEPI, balance: jepiBalance, monthlyTopUp: jepiMonthly },
            { etf: ETF.SCHD, balance: schdBalance, monthlyTopUp: schdMonthly }
          ],
          target,
          tax
        );

        goalMonths = simulation.months;
        finalValue = Math.floor(simulation.portfolioValue);
        isReached = simulation.reached;
      }

      this.results.currentNetDiv = netDivResult;
      this.timeToGoalMonths = goalMonths;
      this.portfolioValueAtGoal = finalValue;
      this.isGoalReached = isReached;
      this.results.metrics = { etfDetails };
    }
  }
});