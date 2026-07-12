((root, factory) => {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.bladeculatorCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const normalizeNumericValue = (value, {
    min = 0,
    max = Infinity,
    step = 1,
    clampStep = true
  } = {}) => {
    let normalized = Number.isFinite(value) ? value : min;
    if (clampStep && Number.isFinite(step) && step > 0) {
      normalized = Math.round((normalized - min) / step) * step + min;
    }
    return Math.min(max, Math.max(min, normalized));
  };

  const calculateBladeTotals = (state, stockItems) => {
    const daysPerShave = Math.max(1, state.days || 1);
    const deUses = Math.max(1, state.deUses || 1);
    const seUses = Math.max(1, state.seUses || 1);

    return stockItems.reduce((totals, item) => {
      const value = Number.isFinite(state[item.key]) ? state[item.key] : 0;
      const blades = value * item.multiplier;
      const usesPerBlade = item.bladeType === 'se' ? seUses : deUses;
      totals.totalBlades += blades;
      totals.totalDays += blades * usesPerBlade * daysPerShave;
      return totals;
    }, { totalBlades: 0, totalDays: 0 });
  };

  const calculateSoapTotals = (state) => {
    const daysPerShave = Math.max(1, state.days || 1);
    const gramsPerShave = Math.max(1, state.soapGramsPerShave || 1);
    const jarWeight = Math.max(1, state.soapJarWeight || 0);
    const full = Number.isFinite(state.soapFull) ? state.soapFull : 0;
    const rest75 = Number.isFinite(state.soap75) ? state.soap75 : 0;
    const rest50 = Number.isFinite(state.soap50) ? state.soap50 : 0;
    const rest25 = Number.isFinite(state.soap25) ? state.soap25 : 0;

    const totalJars = full + rest75 * 0.75 + rest50 * 0.5 + rest25 * 0.25;
    const totalContainers = full + rest75 + rest50 + rest25;
    const totalGrams = jarWeight * totalJars;
    const shaves = Math.floor(totalGrams / gramsPerShave);

    return {
      totalDays: shaves * daysPerShave,
      totalGrams,
      totalContainers
    };
  };

  const splitDuration = (days) => {
    const years = Math.floor(days / 365);
    const remainingAfterYears = days % 365;
    return {
      years,
      months: Math.floor(remainingAfterYears / 30),
      remainingDays: remainingAfterYears % 30
    };
  };

  return {
    normalizeNumericValue,
    calculateBladeTotals,
    calculateSoapTotals,
    splitDuration
  };
});
