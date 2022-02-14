export interface ClearGermesDataGeneratorOptions {
  bookmakerName: string;
  additionalFields: GermesDataAdditionalFields;
}

const clearGermesDataGenerator =
  (options: ClearGermesDataGeneratorOptions) => (): void => {
    if (window.germesData && window.germesData.updateManualDataIntervalId) {
      clearInterval(window.germesData.updateManualDataIntervalId);
    }
    window.germesData = {
      bookmakerName: options.bookmakerName,
      minimumStake: undefined,
      maximumStake: undefined,
      doStakeTime: undefined,
      // betProcessingStep: undefined,
      // betProcessingAdditionalInfo: undefined,
      betProcessingTimeout: 50000,
      stakeDisabled: undefined,
      // stopBetProcessing: () => {
      //   window.germesData.betProcessingStep = 'error';
      //   window.germesData.stakeDisabled = true;
      // },
      updateManualDataIntervalId: undefined,
      stopUpdateManualData: undefined,
      manualMaximumStake: undefined,
      manualCoefficient: undefined,
      manualParameter: undefined,
      manualStakeEnabled: undefined,

      betProcessing: undefined,

      additionalFields: JSON.parse(JSON.stringify(options.additionalFields)),
    };
  };

export default clearGermesDataGenerator;
