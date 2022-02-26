import { ClearGermesDataGeneratorOptions } from '../../utils/generators/clearGermesDataGenerator';

declare global {
  interface GermesDataAdditionalFields {
    bettingFrame: HTMLIFrameElement;
  }
  // interface Window {}
}

// eslint-disable-next-line prettier/prettier
export const clearGermesDataGeneratorOptions: ClearGermesDataGeneratorOptions = {
    bookmakerName: 'BetOnline',
    additionalFields: {
      bettingFrame: undefined,
    },
  };

export default {};
