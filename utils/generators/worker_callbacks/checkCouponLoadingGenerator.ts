import { getWorkerParameter, germesLog, LogType, stakeInfoString } from '../..';
import BetProcessing from '../../BetProcessing';

/**
 * Опции генератора колбэка checkCouponLoading (проверка статуса обработки ставки)
 */
export interface CheckCouponLoadingGeneratorOptions {
  /**
   * Функция инициализации объекта BetProcessing
   */
  createBetProcessing: () => BetProcessing;
  /**
   * Флаг вывода шага обработки ставки каждую итерацию, по умолчанию false
   */
  stepDebug?: boolean;
}

/**
 * Генератор колбэка checkCouponLoading (проверка статуса обработки ставки)
 * @returns Функция, которая возвращает true, если ставка ещё обрабатывается, иначе false
 */
const checkCouponLoadingGenerator =
  (options: CheckCouponLoadingGeneratorOptions) => (): boolean => {
    if (getWorkerParameter('fakeDoStake')) {
      germesLog('[fake] Обработка ставки завершена', LogType.ACTION);
      return false;
    }
    const now = new Date();
    const { doStakeTime } = window.germesData;
    const timePassedSinceDoStake = now.getTime() - doStakeTime.getTime();
    const timeout = window.germesData.betProcessingTimeout
      ? window.germesData.betProcessingTimeout + 10000
      : 50000;
    if (timePassedSinceDoStake > timeout) {
      const message =
        `В ${window.germesData.bookmakerName} очень долгое принятие ставки\n` +
        `Бот засчитает ставку как НЕ принятую\n` +
        `${stakeInfoString()}\n` +
        `Пожалуйста, проверьте самостоятельно. Если всё плохо - пишите в ТП`;
      worker.Helper.SendInformedMessage(message);
      germesLog(
        `Слишком долгая обработка (> ${
          timeout / 1000
        }), считаем ставку непринятой`,
        LogType.ERROR,
      );
      return false;
    }
    if (!window.germesData.betProcessing) {
      window.germesData.betProcessing = options.createBetProcessing();
      (async () => {
        try {
          await window.germesData.betProcessing.start();
        } catch (error) {
          germesLog(
            `Ошибка обработки ставки:\n${error.message}`,
            LogType.FATAL,
          );
        }
      })();
      return true;
    }
    if (options.stepDebug) {
      germesLog(
        `Шаг обработки ставки: ${window.germesData.betProcessing.step}`,
        LogType.DEV_INFO,
      );
    }
    if (window.germesData.betProcessing.betPlaced !== null) {
      return false;
    }
    return true;
  };

export default checkCouponLoadingGenerator;
