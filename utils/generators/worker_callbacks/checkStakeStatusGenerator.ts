import { getWorkerParameter, germesLog, LogType } from '../..';

/**
 * Опции генератора колбэка checkStakeStatus (определение результата ставки)
 */
export interface CheckStakeStatusGeneratorOptions {
  /**
   * Функция обновления баланса в бк
   */
  updateBalance: () => void;
}

/**
 * Генератор колбэка checkStakeStatus (определение результата ставки)
 * @returns Функция, которая возвращает true, если ставка принята, иначе false
 */
const checkStakeStatusGenerator =
  (options: CheckStakeStatusGeneratorOptions) => (): boolean => {
    if (getWorkerParameter('fakeDoStake')) {
      germesLog('[fake] Ставка принята', LogType.SUCCESS);
      return true;
    }
    if (window.germesData.betProcessingStep === 'success') {
      germesLog('Ставка принята', LogType.SUCCESS);
      options.updateBalance();
      return true;
    }
    germesLog('Ставка не принята', LogType.FATAL);
    window.germesData.stopUpdateManualData = false;
    return false;
  };

export default checkStakeStatusGenerator;
