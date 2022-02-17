import doStake from '../../../src/worker_callbacks/doStake';
import setStakeSum from '../../../src/worker_callbacks/setStakeSum';
import {
  getWorkerParameter,
  // sendTGBotMessage,
  getElement,
  getRemainingTimeout,
  sleep,
  germesLog,
  LogType,
  awaiter,
  sendErrorMessage,
} from '../../../utils';
import BetProcessing from '../../../utils/BetProcessing';
import {
  BetProcessingError,
  BetProcessingSuccess,
} from '../../../utils/errors';
import { CheckCouponLoadingGeneratorOptions } from '../../../utils/generators/worker_callbacks/checkCouponLoadingGenerator';
import getBackSum from '../helpers/getBackSum';
import getRefID from '../helpers/getRefID';
import getStakedSum from '../helpers/getStakedSum';
import viewOpenBets from '../helpers/viewOpenBets';
import openBet from '../show_stake/openBet';

const loaderSelector = 'bf-spinner';
const matchedBetsSelector = '.receipt__matched-bets';
const unmatchedBetsSelector = '.receipt__unmatched-bets';
const unplacedBetsSelector = '.receipt__unplaced-bets';
const cancelledBetsSelector = '.receipt__cancelled-bets';

// const placeBetsCancelButtonSelector =
//   '[on-click="$ctrl.onCancelAllAbove()"] > button';
const openBetsCancelButtonSelector =
  '[on-click="$ctrl.onCancelBetsClick()"] > button';

const loaderNotAppearedTimeout =
  getWorkerParameter<number>('loaderNotAppearedTimeout', 'number') || 3000;
const noResultAfterLoaderDisappearedTimeout =
  getWorkerParameter<number>(
    'noResultAfterLoaderDisappearedTimeout',
    'number',
  ) || 3000;

// const sendDevTGBotMessage = (message: string): void => {
//   sendTGBotMessage(
//     '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
//     126302051,
//     message,
//   );
// };

const checkCouponLoadingGeneratorOptions = <CheckCouponLoadingGeneratorOptions>{
  createBetProcessing: () => {
    const betProcessing = new BetProcessing();
    betProcessing.steps = {
      start: async () => {
        try {
          const backSum = getBackSum(worker.StakeInfo.Summ);
          germesLog(
            `Сумма ставки в боте: ${worker.StakeInfo.Summ}\nBack сумма: ${backSum}`,
            LogType.INFO,
          );
          const setStakeSumSuccess = await setStakeSum(backSum);
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
      // error: async () => {
      //   germesLog('Появилась ошибка', LogType.INFO);
      //   const errorText = text(<HTMLElement>betProcessing.stepResult);
      //   germesLog(errorText, LogType.ERROR_MESSAGE);
      //   if (/Ошибка/i.test(errorText)) {
      //     //
      //   } else {
      //     sendErrorMessage(errorText);
      //     sendDevTGBotMessage(errorText);
      //   }
      //   throw new BetProcessingError();
      // },
      // betPlaced: async () => {
      //   throw new BetProcessingSuccess();
      // },
      matched: async () => {
        const unmatchedBets = document.querySelector(unmatchedBetsSelector);
        if (unmatchedBets) {
          betProcessing.setNextStep('partial');
          return;
        }
        throw new BetProcessingSuccess('Ставка принята');
      },
      unmatched: async () => {
        const matchedBets = document.querySelector(matchedBetsSelector);
        if (matchedBets) {
          betProcessing.setNextStep('partial');
          return;
        }
        germesLog('Ставка не принята', LogType.INFO);
        window.germesData.additionalFields.refID = getRefID();
        const { refID } = window.germesData.additionalFields;
        if (!refID) {
          // TODO?: информ
          throw new BetProcessingError('Не удалось определить RefID ставки');
        }
        germesLog(`RefID: ${refID}`, LogType.INFO);
        betProcessing.setNextStep('openBetsCheck');
      },
      partial: async () => {
        germesLog(
          'Частично принятая ставка (Matched & Unmatched Bets)',
          LogType.INFO,
        );
        window.germesData.additionalFields.refID = getRefID();
        const { refID } = window.germesData.additionalFields;
        if (!refID) {
          // TODO?: информ
          throw new BetProcessingError('Не удалось определить RefID ставки');
        }
        germesLog(`RefID: ${refID}`, LogType.INFO);
        betProcessing.setNextStep('openBetsCheck');
      },
      unplaced: async () => {
        throw new BetProcessingError('Ставка снята (Unplaced Bets)');
      },
      cancel: async () => {
        // TODO?: спиннер
        germesLog('Ждём отмены ставки', LogType.DEV_INFO);

        await Promise.race([
          getElement(cancelledBetsSelector, getRemainingTimeout()),
          getElement(unplacedBetsSelector, getRemainingTimeout()),
        ]);

        const cancelledBets = document.querySelector(cancelledBetsSelector);
        const unplacedBets = document.querySelector(unplacedBetsSelector);

        if (!cancelledBets && !unplacedBets) {
          throw new BetProcessingError('Не дождались отмены ставки');
        }

        if (cancelledBets) {
          germesLog('Есть отменённые ставки', LogType.INFO);
        }
        if (unplacedBets) {
          germesLog('Есть отклонённые ставки', LogType.INFO);
        }

        betProcessing.setNextStep('openBetsCheck');
      },
      openBetsCheck: async () => {
        worker.TakeScreenShot(false);
        try {
          await viewOpenBets();
        } catch (error) {
          throw new BetProcessingError(error.message);
        }
        await sleep(1000);
        worker.TakeScreenShot(false);

        const openBetsCancelButton = document.querySelector<HTMLElement>(
          openBetsCancelButtonSelector,
        );
        if (openBetsCancelButton) {
          germesLog('Есть кнопка отмены ставок (Open Bets)', LogType.DEV_INFO);
          openBetsCancelButton.click();
          betProcessing.setNextStep('cancel');
          return;
        }
        germesLog('Нет кнопки отмены ставок (Open Bets)', LogType.DEV_INFO);

        const stakedSum = await getStakedSum();

        const backSum = getBackSum(worker.StakeInfo.Summ);
        germesLog(
          `Ставилось: ${backSum} (Lay: ${window.germesData.additionalFields.isLay})\n` +
            `Поставилось: ${stakedSum}`,
          LogType.INFO,
        );
        if (stakedSum === backSum) {
          throw new BetProcessingSuccess(
            'Сумма ставок в игре равна совпадает с желаемой',
          );
        }
        if (stakedSum > backSum) {
          // TODO?: информ
          throw new BetProcessingSuccess('Сумма ставок в игре больше желаемой');
        }
        germesLog('Переоткрываем ставку', LogType.INFO);
        try {
          await openBet();
        } catch (error) {
          germesLog(
            `Ошибка переоткрытия ставки:\n${error.message}`,
            LogType.ERROR,
          );
        }
        if (stakedSum === 0) {
          throw new BetProcessingError();
        }
        const message =
          `Ставка частично принята\n` +
          `Принятая сумма: ${stakedSum} (${
            window.germesData.additionalFields.isLay ? 'Lay' : 'Back'
          })` +
          `В боте ставка учтена как непринятая (не будет перекрыта)`;
        sendErrorMessage(message);
        // TODO: FakeStake
        // worker.StakeInfo.Summ = getBotSum(stakedSum);
        throw new BetProcessingError(
          'Сумма ставок в игре равна меньше желаемой, ставка принята частично',
        );
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
      matched: () => getElement(matchedBetsSelector, getRemainingTimeout()),
      unmatched: () => getElement(unmatchedBetsSelector, getRemainingTimeout()),
      unplaced: () => getElement(unplacedBetsSelector, getRemainingTimeout()),
    };
    return betProcessing;
  },
};

export default checkCouponLoadingGeneratorOptions;
