import { ClearGermesDataGeneratorOptions } from '../../utils/generators/clearGermesDataGenerator';

declare global {
  interface GermesDataAdditionalFields {
    marketLink: HTMLAnchorElement;
    isLay: boolean;
  }
  // interface Window {}
}

// eslint-disable-next-line prettier/prettier
export const clearGermesDataGeneratorOptions: ClearGermesDataGeneratorOptions = {
  bookmakerName: 'BetfairEx',
  additionalFields: {
    marketLink: undefined,
    isLay: undefined,
  },
};

export default {};
