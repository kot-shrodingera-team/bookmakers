import { ClearGermesDataGeneratorOptions } from '../../utils/generators/clearGermesDataGenerator';

declare global {
  // interface GermesDataAdditionalFields {}
  interface Window {
    Y: {
      bfplatform: {
        _getService: (serviceName: 'instructions') => {
          request: (options: { url: string }) => unknown;
        };
      };
    };
  }
}

// eslint-disable-next-line prettier/prettier
export const clearGermesDataGeneratorOptions: ClearGermesDataGeneratorOptions = {
  bookmakerName: 'Betfair Sport',
  // additionalFields: {},
};

export default {};
