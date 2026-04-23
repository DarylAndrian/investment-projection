import { defineStore } from 'pinia';

// Financial constants for ETFs
const ETF = {
  JEPI: { yield: 0.0826, er: 0.0035, freq: 12, label: 'JEPI', color: '#378ADD' }, // High Yield/Monthly
  SCHD: { yield: 0.0335, er: 0.0006, freq: 4, label: 'SCHD', color: '#639922'} // Dividend Growth/Quarterly
};

/**
 * Calculates the monthly dividend payout based on current assets and ETF specifics.
 * @param {Object} etf - The ETF object from constants.
 * @returns {number} Net monthly dividend ($).
 */
function calculateDividend(startAmount, monthlyTopUp, etf, taxRate) {
    // 1. Dividend from starting lump sum (annual yield / frequency / 12 months)
    const initialDiv = startAmount * (etf.yield / 12);

    // 2. Dividend from recurring top-up (monthly amount * annual yield / 12)
    const recurringDiv = monthlyTopUp * etf.yield / 12;

    // Total Gross Monthly Div = Initial + Recurring
    let totalGrossMonthlyDividend = initialDiv + recurringDiv;

    // Apply tax rate percentage
    const netMonthlyDividend = totalGrossMonthlyDividend * (1 - taxRate / 100);
    return Math.max(0, netMonthlyDividend); // Ensure it's not negative
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
      this.calculate(); // Recalculate on selection change
    },
    updateInput(key, value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        this.inputs[key] = numValue;
      }
      this.calculate(); // Recalculate immediately on change
    },
    /**
     * Main calculation function: calculates all projections based on inputs.
     */
    calculate() {
      const { startAmount: start, monthlyTopUp: monthly, targetMonthlyIncome: target, withholdingTax: tax } = this.inputs;

      let netDivResult = null;
      let goalMonths = null;
      let finalValue = null;
      let isReached = false;
      let etfDetails = {};


      if (this.selectedEtf === 'JEPI' || this.selectedEtf === 'SCHD') {
        const key = this.selectedEtf;
        const etf = ETF[key];

        // 1. Calculate Dividend
        netDivResult = calculateDividend(start, monthly, etf, tax);
        
        etfDetails = { name: etf.label, color: etf.color };

        // 2. Run Simulation (Simplified Goal Tracking Loop)
        const simulation = this._runSingleEtfSimulation(etf, start, monthly, target, tax);
        
        goalMonths = simulation.months;
        finalValue = Math.floor(simulation.portfolioValue);
        isReached = simulation.reached;

      } else if (this.selectedEtf === 'SPLIT') {
         // 3. Split Calculation Logic (Placeholder - Needs full implementation)
         const jAmt = start * this.inputs.splitAllocationRatio / 100;
         const sAmt = start - jAmt;

         // Simplified placeholder calculation for split view
         netDivResult = calculateDividend(jAmt, monthly*this.inputs.splitAllocationRatio/100, ETF.JEPI, tax) + 
                        calculateDividend(sAmt, monthly*(1-this.inputs.splitAllocationRatio/100), ETF.SCHD, tax);

         goalMonths = Math.floor(Math.random() * 48 + 12); // Placeholder: 12 to 60 months
         finalValue = Math.floor(start * (1 + (this.inputs.monthlyTopUp / start) * 1.5));
         isReached = this.calculateSingleEtfTarget({yield: 0.04, er: 0.001}, start, monthly, target, tax);


      } else {
        // Default/Error state
        netDivResult = null;
        goalMonths = null;
        finalValue = null;
        isReached = false;
        etfDetails = {};
      }

      this.results.currentNetDiv = netDivResult;
      this.timeToGoalMonths = goalMonths;
      this.portfolioValueAtGoal = finalValue;
      this.isGoalReached = isReached;
      this.results.metrics = { etfDetails }; // Store the ETF details for other components

    }
  },
  /**
   * CORE SIMULATION FUNCTION: Runs a simplified monthly projection simulation.
   */
  methods: {
    _runSingleEtfSimulation(etf, startAmount, monthlyTopUp, targetMonthlyIncome, taxRate) {
      let currentBalance = startAmount;
      let monthCounter = 0;
      const MAX_MONTHS = 300; // Cap simulation at 25 years

      for (let month = 1; month <= MAX_MONTHS; month++) {
        // Calculate dividend for this cycle
        const currentNetDiv = calculateDividend(currentBalance, monthlyTopUp, etf, taxRate);

        // Check if goal is met *before* next top-up/growth calculation
        if (monthCounter > 0 && currentNetDiv >= targetMonthlyIncome) {
            return {
                months: monthCounter + 1,
                portfolioValue: currentBalance,
                reached: true
            };
        }

        // Growth Calculation for next month (Simplified Annual Compound Rate used for portfolio growth visualization)
        const annualGrowthRate = etf.yield; // Using yield as proxy for annual growth rate
        currentBalance += monthlyTopUp * (1 + annualGrowthRate / 12); // Add top-up + minor compounding on top-up
        currentBalance *= (1 + annualGrowthRate / 100); // Compound the total balance

        monthCounter++;
      }

      return {
          months: MAX_MONTHS,
          portfolioValue: currentBalance,
          reached: false
      };
    },

    calculateSingleEtfTarget(etf, start, monthly, target, tax){
        // More rigorous check using the simulation logic (placeholder for now)
        const netDiv = calculateDividend(start, monthly, etf, tax);
        return netDiv >= target;
    }
  }
});