import doStake from '../../../src/worker_callbacks/doStake';
import setStakeSum from '../../../src/worker_callbacks/setStakeSum';
import {
  getWorkerParameter,
  sendTGBotMessage,
  getElement,
  getRemainingTimeout,
  sleep,
  germesLog,
  LogType,
  awaiter,
  text,
  round,
} from '../../../utils';
import {
  sendErrorMessage,
  betProcessingError,
  betProcessingCompltete,
} from '../../../utils/betProcessing';
import { CheckCouponLoadingGeneratorOptions } from '../../../utils/generators/worker_callbacks/checkCouponLoadingGenerator';
import { StateMachine } from '../../../utils/stateMachine';
import getRawCoefficient from '../helpers/getRawCoefficient';

const loaderSelector = 'bf-spinner';
const matchedBetsSelector = '.receipt__matched-bets';
const unmatchedBetsSelector = '.receipt__unmatched-bets';
const unplacedBetsSelector = '.receipt__unplaced-bets';

const loaderNotAppearedTimeout =
  getWorkerParameter<number>('loaderNotAppearedTimeout', 'number') || 3000;
const noResultAfterLoaderDisappearedTimeout =
  getWorkerParameter<number>(
    'noResultAfterLoaderDisappearedTimeout',
    'number',
  ) || 3000;

const sendDevTGBotMessage = (message: string): void => {
  sendTGBotMessage(
    '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
    126302051,
    message,
  );
};

const asyncCheck = async () => {
  const machine = new StateMachine();

  machine.promises = {
    loader: () => getElement(loaderSelector, getRemainingTimeout()),
    loaderNotAppeared: () => sleep(loaderNotAppearedTimeout),
    matched: () => getElement(matchedBetsSelector, getRemainingTimeout()),
    unmatched: () => getElement(unmatchedBetsSelector, getRemainingTimeout()),
    unplaced: () => getElement(unplacedBetsSelector, getRemainingTimeout()),
  };

  machine.setStates({
    start: {
      entry: async () => {
        try {
          let stakeSum = worker.StakeInfo.Summ;
          if (window.germesData.additionalFields.isLay) {
            stakeSum = round(stakeSum / (getRawCoefficient() - 1));
          }
          const setStakeSumSuccess = await setStakeSum(stakeSum);
          if (!setStakeSumSuccess) {
            germesLog('Не удалось ввести сумму ставки', LogType.ERROR);
            betProcessingError(machine);
            return;
          }
          const doStakeSuccess = await doStake();
          if (!doStakeSuccess) {
            germesLog('Не удалось сделать ставку', LogType.ERROR);
            betProcessingError(machine);
            return;
          }
        } catch (e) {
          germesLog(`Ошибка попытки ставки: ${e.message}`, LogType.ERROR);
          betProcessingError(machine);
          return;
        }
        germesLog('Начало обработки ставки', LogType.INFO);
      },
    },
    loaderNotAppeared: {
      entry: async () => {
        const message = `Индикатор или результат не появился в течении ${loaderNotAppearedTimeout} мс`;
        germesLog(message, LogType.ERROR);
        sendErrorMessage(message);
        betProcessingError(machine);
      },
    },
    loader: {
      entry: async () => {
        germesLog('Появился индикатор', LogType.INFO);
        window.germesData.betProcessingAdditionalInfo = 'индикатор';
        delete machine.promises.loader;
        delete machine.promises.loaderNotAppeared;
        machine.promises.loaderDissappeared = () =>
          awaiter(
            () => document.querySelector(loaderSelector) === null,
            getRemainingTimeout(),
          );
      },
    },
    loaderDissappeared: {
      entry: async () => {
        germesLog('Исчез индикатор', LogType.INFO);
        window.germesData.betProcessingAdditionalInfo = undefined;
        delete machine.promises.loaderDissappeared;
        machine.promises.noResultAfterLoaderDisappeared = () =>
          sleep(noResultAfterLoaderDisappearedTimeout);
      },
    },
    noResultAfterLoaderDisappeared: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;
        const message = `Результат не появился в течении ${noResultAfterLoaderDisappearedTimeout} мс после исчезания индикатора`;
        germesLog(message, LogType.ERROR);
        sendErrorMessage(message);
        betProcessingError(machine);
      },
    },
    // error: {
    //   entry: async () => {
    //     germesLog('Появилась ошибка', LogType.INFO);
    //     window.germesData.betProcessingAdditionalInfo = undefined;
    //     const errorText = text(<HTMLElement>machine.data.result);
    //     germesLog(errorText, LogType.ERROR_MESSAGE);
    //     if (/Ошибка/i.test(errorText)) {
    //       //
    //     } else {
    //       sendErrorMessage(errorText);
    //       sendDevTGBotMessage(errorText);
    //     }
    //     betProcessingError(machine);
    //   },
    // },
    matched: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;
        const unmatchedBets = document.querySelector(unmatchedBetsSelector);
        if (unmatchedBets) {
          machine.promises = {
            partial: () => sleep(0),
          };
          return;
        }
        betProcessingCompltete(machine);
      },
    },
    unmatched: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;
        const matchedBets = document.querySelector(matchedBetsSelector);
        if (matchedBets) {
          machine.promises = {
            partial: () => sleep(0),
          };
        }
        betProcessingCompltete(machine);
      },
    },
    partial: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;
        germesLog(
          'Частично принятая ставка (Matched & Unmatched Bets)',
          LogType.INFO,
        );
        betProcessingCompltete(machine);
      },
    },
    unplaced: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;
        germesLog('Ставка снята (Unplaced Bets)', LogType.INFO);
        betProcessingError(machine);
      },
    },
    timeout: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;
        const message = 'Не дождались результата ставки';
        germesLog(message, LogType.ERROR);
        sendErrorMessage(message);
        betProcessingError(machine);
      },
    },
  });

  machine.start('start');
};

const checkCouponLoadingGeneratorOptions = <CheckCouponLoadingGeneratorOptions>{
  asyncCheck,
  disableLog: false,
};

export default checkCouponLoadingGeneratorOptions;
