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

const placeBetButtonSelector = '.Kx2Ob:not([disabled=""])';
const loaderSelector = '.Kx2Ob[disabled=""]';
export const errorSelector = '.qTb_h';
const betPlacedSelector = '.ek_L6';

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
    const context =
      window.germesData.additionalFields.bettingFrame.contentDocument;
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
            () => context.querySelector(loaderSelector) === null,
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
        betProcessing.addCheck('placeBetButtonAppeared', () =>
          getElement(
            placeBetButtonSelector,
            noResultAfterLoaderDisappearedTimeout,
            context,
          ),
        );
      },
      placeBetButtonAppeared: async () => {
        throw new BetProcessingError(
          'Появилась кнопка ставки. Считаем ставку непринятой',
        );
      },
      noResultAfterLoaderDisappeared: async () => {
        const message = `Результат не появился в течении ${noResultAfterLoaderDisappearedTimeout} мс после исчезания индикатора`;
        sendErrorMessage(message);
        throw new BetProcessingError(message);
      },
      error: async () => {
        germesLog('Появилась ошибка', LogType.INFO);
        const errorElement = <HTMLElement>betProcessing.stepResult;
        const errorText = text(errorElement);
        germesLog(errorText, LogType.ERROR_MESSAGE);
        if (/Odds have changed/i.test(errorText)) {
          //
        } else if (/Odd is not active/i.test(errorText)) {
          //
        } else {
          sendErrorMessage(errorText);
          sendDevTGBotMessage(errorText);
        }
        germesLog('Ждём, пока исчезнет ошибка', LogType.INFO);
        const errorDissappeared = await awaiter(
          () => !context.querySelector(errorSelector),
          10000,
        );
        if (!errorDissappeared) {
          germesLog('Ошибка не исчезла', LogType.ERROR);
        } else {
          germesLog('Ошибка исчезла', LogType.INFO);
        }
        throw new BetProcessingError();
      },
      betPlaced: async () => {
        const betPlacedMessageElement = <HTMLElement>(
          window.germesData.betProcessing.stepResult
        );
        const betPlacedMessageText = text(betPlacedMessageElement);
        const betPlacedMessageRegex =
          /Bet placed successfully\. Ticket#: (\d)+/i;
        const betPlacedMatch = betPlacedMessageText.match(
          betPlacedMessageRegex,
        );
        if (!betPlacedMatch) {
          germesLog(
            `Не удалось определить ID ставки из сообщения: "${betPlacedMessageText}". Не проверяем итоговый коэффициент коэффициент`,
            LogType.ERROR,
          );
          throw new BetProcessingSuccess();
        }

        const ticketID = betPlacedMatch[1];
        germesLog(`TicketID: ${ticketID}`, LogType.INFO);
        worker.TakeScreenShot(false);

        const targetBet = await awaiter(() => {
          const bets = [...document.querySelectorAll('.L5TBr > div')];
          return bets.find((bet, index) => {
            const ticketIDElement = bet.querySelector(
              '.dndnH .Wd2o7:nth-child(2)',
            );
            if (!ticketIDElement) {
              germesLog(
                `Не найден TicketID ставки №${index + 1}`,
                LogType.ERROR,
              );
              return false;
            }
            const ticketIDText = text(ticketIDElement);
            return ticketIDText.includes(ticketID);
          });
        });
        if (!targetBet) {
          germesLog(
            'Не найдена ставка с нужным TicketID. Не проверяем итоговый коэффициент коэффициент',
            LogType.ERROR,
          );
          throw new BetProcessingSuccess();
        }

        const resultCoefficientElement =
          targetBet.querySelector('.fqdyK > em > span');
        if (!resultCoefficientElement) {
          germesLog('Не найден итоговый коэффициент', LogType.ERROR);
          throw new BetProcessingSuccess();
        }
        const resultCoefficientText = text(resultCoefficientElement).replace(
          ',',
          '.',
        );
        const resultCoefficient = Number(resultCoefficientText);
        if (Number.isNaN(resultCoefficient)) {
          germesLog(
            `Непонятный формат итогового коэффициента: ${resultCoefficientText}`,
            LogType.ERROR,
          );
        } else if (resultCoefficient !== worker.StakeInfo.Coef) {
          germesLog(
            `Коэффициент изменился ${worker.StakeInfo.Coef} => ${resultCoefficient}`,
            LogType.INFO,
          );
          worker.StakeInfo.Coef = resultCoefficient;
        } else {
          germesLog('Коэффициент не изменился', LogType.INFO);
        }
        throw new BetProcessingSuccess();
      },
      timeout: async () => {
        const message = 'Не дождались результата ставки';
        sendErrorMessage(message);
        window.germesData.stakeDisabled = true;
        throw new BetProcessingError(message);
      },
    };
    betProcessing.checks = {
      loader: () => getElement(loaderSelector, getRemainingTimeout(), context),
      loaderNotAppeared: () => sleep(loaderNotAppearedTimeout),
      error: () => getElement(errorSelector, getRemainingTimeout(), context),
      betPlaced: () =>
        getElement(betPlacedSelector, getRemainingTimeout(), context),
    };
    return betProcessing;
  },
};

export default checkCouponLoadingGeneratorOptions;
