import { getWorkerParameter, germesLog, LogType, setSessionData } from '../..';
import { JsFailError, NewUrlError } from '../../errors';

export interface ShowStakeGeneratorOptions {
  /**
   * Функция очистки window.germesData
   */
  clearGermesData: () => void;
  /**
   * Функция, выполняемая перед открытием события
   */
  preOpenEvent: () => Promise<void>;
  /**
   * Функция открытия события
   */
  openEvent: () => Promise<void>;
  /**
   * Функция, выполняемая перед открытием ставки
   */
  preOpenBet: () => Promise<void>;
  /**
   * Функция открытия ставки
   */
  openBet: () => Promise<void>;
  /**
   * Функция установки режима принятия ставки
   */
  setBetAcceptMode: () => Promise<void>;
  /**
   * Функция получения максимальной ставки
   */
  getMaximumStake: (disableLog: boolean) => number;
  /**
   * Функция получения коэффициента
   */
  getCoefficient: (disableLog: boolean) => number;
  /**
   * Функция получения параметра ставки
   */
  getParameter: (disableLog: boolean) => number;
  /**
   * Функция получения доступности ставки
   */
  getStakeEnabled: (disableLog: boolean) => boolean;
}

const showStakeGenerator =
  (options: ShowStakeGeneratorOptions) => async (): Promise<void> => {
    if (getWorkerParameter('fakeOpenStake')) {
      germesLog('[fake] Ставка открыта', LogType.SUCCESS);
      worker.JSStop();
      return;
    }
    setSessionData('ShowStake', '1');
    options.clearGermesData();
    try {
      germesLog(
        `Открываем ставку:\n${worker.TeamOne} vs ${worker.TeamTwo}\n${worker.BetName}`,
        LogType.INFO,
      );
      await options.preOpenEvent();
      await options.openEvent();
      await options.preOpenBet();
      await options.openBet();
      await options.setBetAcceptMode();
      germesLog('Ставка успешно открыта', LogType.SUCCESS);
      setSessionData('ShowStake', '0');
      if (
        worker.JSMaxChange ||
        worker.JSCoefChange ||
        worker.JSParameterChange ||
        worker.JSEnabledChange
      ) {
        window.germesData.updateManualDataIntervalId = window.setInterval(
          () => {
            if (window.germesData.stopUpdateManualData) {
              return;
            }
            if (worker.JSMaxChange) {
              const newMax = options.getMaximumStake(true);
              if (newMax && newMax !== window.germesData.manualMaximumStake) {
                germesLog(
                  `Обновляем макс ${window.germesData.manualMaximumStake} => ${newMax}`,
                  LogType.ACTION,
                );
                window.germesData.manualMaximumStake = newMax;
                worker.StakeInfo.MaxSumm = newMax;
                worker.JSMaxChange(newMax);
              }
            }
            if (worker.JSCoefChange) {
              const newCoef = options.getCoefficient(true);
              if (newCoef && newCoef !== window.germesData.manualCoefficient) {
                germesLog(
                  `Обновляем кэф ${window.germesData.manualCoefficient} => ${newCoef}`,
                  LogType.ACTION,
                );
                window.germesData.manualCoefficient = newCoef;
                worker.StakeInfo.Coef = newCoef;
                worker.JSCoefChange(newCoef);
              }
            }
            if (worker.JSParameterChange) {
              const newParameter = options.getParameter(true);
              if (
                newParameter &&
                newParameter !== window.germesData.manualParameter
              ) {
                germesLog(
                  `Обновляем параметр ${window.germesData.manualParameter} => ${newParameter}`,
                  LogType.ACTION,
                );
                window.germesData.manualParameter = newParameter;
                worker.StakeInfo.Parametr = newParameter;
                worker.JSParameterChange(newParameter);
              }
            }
            if (worker.JSEnabledChange) {
              const newStakeEnabled = options.getStakeEnabled(true);
              if (newStakeEnabled !== window.germesData.manualStakeEnabled) {
                germesLog(
                  `Обновляем доступность ставки ${window.germesData.manualStakeEnabled} => ${newStakeEnabled}`,
                  LogType.ACTION,
                );
                window.germesData.manualStakeEnabled = newStakeEnabled;
                worker.StakeInfo.IsEnebled = newStakeEnabled;
                worker.JSEnabledChange(newStakeEnabled);
              }
            }
          },
          200,
        );
      }
      worker.JSStop();
    } catch (error) {
      if (error instanceof JsFailError) {
        germesLog(error.message, LogType.FATAL);
        setSessionData('ShowStake', '0');
        worker.JSFail();
      } else if (error instanceof NewUrlError) {
        germesLog(error.message, LogType.ACTION);
      } else {
        // Любая другая ошибка
        germesLog(
          'Скрипт вызвал исключение. Если часто повторяется, обратитесь в ТП',
          LogType.FATAL,
        );
        germesLog(error.message, LogType.FATAL);
        setSessionData('ShowStake', '0');
        worker.JSFail();
        throw error;
      }
    }
  };

export default showStakeGenerator;
