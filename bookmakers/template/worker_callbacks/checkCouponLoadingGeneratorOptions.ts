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
  sendErrorMessage,
} from '../../../utils';
import BetProcessing from '../../../utils/BetProcessing';
import {
  BetProcessingError,
  BetProcessingSuccess,
} from '../../../utils/errors';
import { CheckCouponLoadingGeneratorOptions } from '../../../utils/generators/worker_callbacks/checkCouponLoadingGenerator';

const loaderSelector = '';
const errorSelector = '';
const betPlacedSelector = '';

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

const checkCouponLoadingGeneratorOptions = <CheckCouponLoadingGeneratorOptions>{
  createBetProcessing: () => {
    const betProcessing = new BetProcessing();
    betProcessing.steps = {
      start: async () => {
        try {
          const setStakeSumSuccess = await setStakeSum();
          if (!setStakeSumSuccess) {
            throw new BetProcessingError('Не удалось ввести сумму ставки');
          }
        } catch (error) {
          if (error instanceof BetProcessingError) {
            throw error;
          }
          throw new BetProcessingError(
            `Ошибка ввода суммы ставки:\n${error.message}`,
          );
        }
        try {
          const doStakeSuccess = await doStake();
          if (!doStakeSuccess) {
            throw new BetProcessingError('Не удалось сделать ставку');
          }
        } catch (error) {
          if (error instanceof BetProcessingError) {
            throw error;
          }
          throw new BetProcessingError(
            `Ошибка попытки ставки:\n${error.message}`,
          );
        }
        germesLog('Начало обработки ставки', LogType.INFO);
      },
      loaderNotAppeared: async () => {
        const message = `Индикатор или результат не появился в течении ${loaderNotAppearedTimeout} мс`;
        sendErrorMessage(message);
        throw new BetProcessingError(message);
      },
      loader: async () => {
        germesLog('Появился индикатор', LogType.INFO);
        betProcessing.deleteCheck('loader');
        betProcessing.deleteCheck('loaderNotAppeared');
        betProcessing.addCheck('loaderDissappeared', () =>
          awaiter(
            () => document.querySelector(loaderSelector) === null,
            getRemainingTimeout(),
          ),
        );
      },
      loaderDissappeared: async () => {
        germesLog('Исчез индикатор', LogType.INFO);
        betProcessing.deleteCheck('loaderDissappeared');
        betProcessing.addCheck('noResultAfterLoaderDisappeared', () =>
          sleep(noResultAfterLoaderDisappearedTimeout),
        );
      },
      noResultAfterLoaderDisappeared: async () => {
        const message = `Результат не появился в течении ${noResultAfterLoaderDisappearedTimeout} мс после исчезания индикатора`;
        sendErrorMessage(message);
        throw new BetProcessingError(message);
      },
      error: async () => {
        germesLog('Появилась ошибка', LogType.INFO);
        const errorText = text(<HTMLElement>betProcessing.stepResult);
        germesLog(errorText, LogType.ERROR_MESSAGE);
        if (/Ошибка/i.test(errorText)) {
          //
        } else {
          sendErrorMessage(errorText);
          sendDevTGBotMessage(errorText);
        }
        throw new BetProcessingError();
      },
      betPlaced: async () => {
        throw new BetProcessingSuccess();
      },
      timeout: async () => {
        const message = 'Не дождались результата ставки';
        sendErrorMessage(message);
        throw new BetProcessingError(message);
      },
    };
    betProcessing.checks = {
      loader: () => getElement(loaderSelector, getRemainingTimeout()),
      loaderNotAppeared: () => sleep(loaderNotAppearedTimeout),
      error: () => getElement(errorSelector, getRemainingTimeout()),
      betPlaced: () => getElement(betPlacedSelector, getRemainingTimeout()),
    };
    return betProcessing;
  },
};

export default checkCouponLoadingGeneratorOptions;
