import { getWorkerParameter, germesLog, LogType, stakeInfoString } from '../..';

/**
 * Опции генератора колбэка checkCouponLoading (проверка статуса обработки ставки)
 */
export interface CheckCouponLoadingGeneratorOptions {
  /**
   * Асинхронная функция проверки статуса обработки
   */
  asyncCheck: () => Promise<void>;
  /**
   * Флаг отключения вывода лога "Обработка ставки", по умолчанию false
   */
  disableLog?: boolean;
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
    const step = window.germesData.betProcessingStep;
    const additionalInfo = window.germesData.betProcessingAdditionalInfo
      ? ` (${window.germesData.betProcessingAdditionalInfo})`
      : '';
    switch (step) {
      case 'beforeStart':
        options.asyncCheck();
        window.germesData.betProcessingStep = 'processing';
        return true;
      case 'processing':
        if (!options.disableLog) {
          germesLog(`Обработка ставки${additionalInfo}`, LogType.PROGRESS);
        }
        return true;
      case 'error':
        germesLog('Обработка ставки завершена (ошибка)', LogType.ACTION);
        return false;
      case 'success':
        germesLog('Обработка ставки завершена (принята)', LogType.ACTION);
        return false;
      case 'reopened':
        germesLog(
          'Обработка ставки завершена (ставка переоткрыта)',
          LogType.ACTION,
        );
        return false;
      case 'reopen':
        germesLog('Переоткрытие купона', LogType.PROGRESS);
        return true;
      default:
        germesLog(
          `Обработка ставки (!default)${additionalInfo}`,
          LogType.PROGRESS,
        );
        return true;
    }
  };

export default checkCouponLoadingGenerator;
