const commissionCoefficient = (coefficient: number): number => {
  if (coefficient === 0) {
    return 0;
  }
  return (
    Math.floor(
      1000 * (1 + (coefficient - 1) * (1 - worker.ProfitCommission / 100)),
    ) / 1000
  );
};

export default commissionCoefficient;
