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
} from '../../../utils';
import {
  sendErrorMessage,
  betProcessingError,
  betProcessingCompltete,
} from '../../../utils/betProcessing';
import { CheckCouponLoadingGeneratorOptions } from '../../../utils/generators/worker_callbacks/checkCouponLoadingGenerator';
import { StateMachine } from '../../../utils/stateMachine';
import { accountBlocked } from '../helpers/accountChecks';
import checkLastCoupons from '../helpers/checkLastCoupons';
import openBet from '../show_stake/openBet';

const loaderSelector = '[class*="progress-overlay"]';
const errorSelector = '[class*="error-box"] [class*="text-area"]';
// const betPlacedSelector = '';
const emptyCouponSelector = '[class*="new-coupon"] > [class*="empty"]';

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
    error: () => getElement(errorSelector, getRemainingTimeout()),
    // betPlaced: () => getElement(betPlacedSelector, getRemainingTimeout()),
    newCouponInHistory: () =>
      awaiter(() => checkLastCoupons(), getRemainingTimeout(), 100),
  };

  machine.setStates({
    start: {
      entry: async () => {
        try {
          const setStakeSumSuccess = await setStakeSum();
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
        const { currentBet } = window.germesData.additionalFields;
        germesLog(
          `Ждём принятия ставки ${currentBet.eventName} - ${currentBet.betName}`,
          LogType.INFO,
        );
        getElement(emptyCouponSelector, getRemainingTimeout()).then(
          (emptyCoupon) => {
            if (emptyCoupon) {
              germesLog('Купон очистился', LogType.INFO);
            }
          },
        );
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
    error: {
      entry: async () => {
        germesLog('Появилась ошибка', LogType.INFO);
        window.germesData.betProcessingAdditionalInfo = undefined;
        const errorText = text(<HTMLElement>machine.data.result);
        germesLog(errorText, LogType.ERROR_MESSAGE);

        // Превышена cуммарная ставка для события "LIVE 1:0 Островская Н - Михайлик Яна Поб 1"|Max=300 руб
        // Могут быть пробелы, например если валюта тенге |Max=1 000 тенге
        const maxRegexMatch = errorText.match(/\|Max=([\d\s]+)/i);
        const minMaxRegexMatch = errorText.match(
          /Допустимая сумма ставки ([\d\s]+) - ([\d\s]+)/i,
        );
        if (maxRegexMatch) {
          const newMax = Number(maxRegexMatch[1].replace(/\s/g, ''));
          germesLog(`Новый максимум: ${newMax}`, LogType.INFO);
          window.germesData.maximumStake = newMax;
        } else if (minMaxRegexMatch) {
          const newMin = Number(maxRegexMatch[1].replace(/\s/g, ''));
          const newMax = Number(maxRegexMatch[2].replace(/\s/g, ''));
          germesLog(`Новые лимиты: ${newMin} - ${newMax}`, LogType.INFO);
          window.germesData.minimumStake = newMin;
          window.germesData.maximumStake = newMax;
        } else if (/Нет прав на выполнение операции/i.test(errorText)) {
          accountBlocked();
        } else if (/Изменена котировка на событие/i.test(errorText)) {
          //
        } else if (
          /Ставки на событие .* временно не принимаются/i.test(errorText)
        ) {
          //
        } else if (/прием закончен/i.test(errorText)) {
          //
        } else if (
          /Слишком маленький интервал между ставками/i.test(errorText)
        ) {
          //
        } else if (/Слишком частые ставки на событие/i.test(errorText)) {
          //
        } else {
          sendErrorMessage(errorText);
          sendDevTGBotMessage(errorText);
        }
        const errorOkButton = document.querySelector<HTMLElement>(
          '[class*="error-box--"] > [class*="button-area--"] > [class*="button--"]',
        );
        if (!errorOkButton) {
          germesLog(
            'Не найдена кнопка закрытия ошибки принятия ставки',
            LogType.ERROR,
          );
        } else {
          germesLog(
            'Нажимаем на кнопку закрытия ошибки принятия ставки',
            LogType.ACTION,
          );
          errorOkButton.click();
        }
        betProcessingError(machine);
      },
    },
    newCouponInHistory: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;

        if (checkLastCoupons(true)) {
          const lastCouponCaption = document.querySelector(
            '[class*="coupon-list"] article[class*="coupon"] [class*="caption"]',
          );
          if (!lastCouponCaption) {
            germesLog('Не найден заголовок принятого купона', LogType.ERROR);
            betProcessingError(machine);
            return;
          }
          const lastCouponCaptionString = text(lastCouponCaption);
          if (lastCouponCaptionString === 'Пари не принято') {
            germesLog('Пари не принято', LogType.ERROR);
            try {
              await openBet();
            } catch (error) {
              germesLog('Ошибка переоткрытия купона', LogType.ERROR);
              germesLog(error.message, LogType.FATAL);
            }
            betProcessingError(machine);
            return;
          }
          germesLog(lastCouponCaptionString, LogType.INFO);
        } else {
          // Может такое быть?
        }

        betProcessingCompltete(machine);
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
