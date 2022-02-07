declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GermesDataAdditionalFields {}
  interface GermesData {
    bookmakerName: string;
    minimumStake: number;
    maximumStake: number;
    doStakeTime: Date;
    betProcessingStep: string;
    betProcessingAdditionalInfo: string;
    betProcessingTimeout: number;
    stakeDisabled: boolean;
    stopBetProcessing: () => void;
    // Для ручника
    updateManualDataIntervalId: number;
    stopUpdateManualData: boolean;
    manualMaximumStake: number;
    manualCoefficient: number;
    manualParameter: number;
    manualStakeEnabled: boolean;
    additionalFields: GermesDataAdditionalFields;
  }

  interface Window {
    consoleCopy: Console;
    germesData: GermesData;
  }
}

export default {};
