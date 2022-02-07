import { ClearGermesDataGeneratorOptions } from '../../utils/generators/clearGermesDataGenerator';

interface Bet365Bet {
  ConstructString: string;
  Uid: string;
}

interface Bet365AddBetData {
  item: Bet365Bet;
  action: number;
  partType: string;
  constructString: string;
  key: () => string;
  getSportType: () => string;
  getCastCode: () => string;
}

interface Locator {
  user: {
    _balance: {
      refreshBalance: () => void;
      totalBalance: string;
      bonusBalance: string;
    };
    currencyCode: string;
    languageId: string;
  };
  treeLookup: {
    getReference: (id: string) => unknown;
  };
  subscriptionManager: {
    subscribe: (eventId: string) => unknown;
  };
}

interface BetSlipLocator {
  betSlipManager: {
    getBetCount: () => number;
    deleteAllBets: () => void;
    addBet: (data: Bet365AddBetData) => void;
    betslip: {
      activeModule: {
        quickBetslipMoveToStandard: () => void;
        slip: {
          footer: {
            model: {
              acceptChanges: () => unknown;
              placeBet: () => unknown;
            };
          };
          bet: {
            stakeBox: {
              stakeValueInputElement: HTMLElement;
              setStake: (sum: string) => unknown;
            };
          };
          bets: [
            {
              stakeBox: {
                stakeValueInputElement: HTMLElement;
                setStake: (sum: string) => unknown;
              };
            },
          ];
        };
      };
    };
  };
}

declare global {
  interface GermesDataAdditionalFields {
    acceptChangesDelayStart: Date;
    referredBetData: {
      placeNowValue: number;
      referredValue: number;
    };
    resultCoefficient: number;
    prevLastBet: Element;
    preparedBet: HTMLElement;
    openningPreparedBet: boolean;
  }
  interface Window {
    Locator: Locator;
    BetSlipLocator: BetSlipLocator;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ns_favouriteslib_ui: unknown;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ns_mybetssubscriptionlib: {
      MyBetsSubscriptionsManager: {
        GetInstance: () => {
          closeBetsEnabled: boolean;
        };
      };
    };
  }
}

// eslint-disable-next-line prettier/prettier
export const clearGermesDataGeneratorOptions: ClearGermesDataGeneratorOptions = {
    bookmakerName: 'Bet365',
    additionalFields: {
      acceptChangesDelayStart: undefined,
      referredBetData: {
        placeNowValue: undefined,
        referredValue: undefined,
      },
      resultCoefficient: undefined,
      prevLastBet: undefined,
      preparedBet: undefined,
      openningPreparedBet: undefined,
    },
  };

export default {};
