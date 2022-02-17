import { ClearGermesDataGeneratorOptions } from '../../utils/generators/clearGermesDataGenerator';

declare global {
  interface GermesDataAdditionalFields {
    marketLink: HTMLAnchorElement;
    isLay: boolean;
    rawCoefficient: number;
    refID: number;
  }
  // interface Window {}
}

// eslint-disable-next-line prettier/prettier
export const clearGermesDataGeneratorOptions: ClearGermesDataGeneratorOptions = {
    bookmakerName: 'BetfairExchange',
    additionalFields: {
      marketLink: undefined,
      isLay: undefined,
      rawCoefficient: undefined,
      refID: undefined,
    },
  };

export default {};
