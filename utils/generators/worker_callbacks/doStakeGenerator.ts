import { getWorkerParameter, germesLog, LogType, timeString } from '../..';

/**
 * Опции генератора колбэка doStake (попытка ставки)
 */
export interface DoStakeGeneratorOptions {
  /**
   * Функция проверки перед попыткой ставки
   *
   * Если вернёт false, попытка ставки считается не успешной
   */
  preCheck?: () => boolean;
  /**
   * Селектор элемента кнопки ставки
   */
  doStakeButtonSelector: string;
  /**
   * Проверяемые классы ошибок/недоступности кнопки ставки
   *
   * Если у элемента кнопки ставки будет хотя бы одни такой класс, попытка ставки считается не успешной
   */
  errorClasses?: {
    /**
     * Имя класса, которое указывает на ошибку/недоступность кнопки ставки
     */
    className: string;
    /**
     * Дополнительное пояснение для этой ошибки
     */
    message?: string;
  }[];
  /**
   * Флаг проверки кнопки ставки на аттрибут disabled, по умолчанию false
   */
  disabledCheck?: boolean;
  /**
   * Функции получения коэффициента
   */
  getCoefficient: () => number;
  /**
   * Функция получения параметра
   */
  getParameter: () => number;
  /**
   * API метод попытки ставки. Если присутствует, будет выполняется вместо клика по кнопке
   *
   * Если вернёт false, попытка ставки считается не успешной
   */
  apiMethod?: () => boolean;
  /**
   * Функция проверки после попытки ставки
   *
   * Если вернёт false, попытка ставки считается не успешной
   */
  postCheck?: () => boolean;
  /**
   * context - Функция, возвращающая контекст для поиска элементов DOM, по умолчанию document
   */
  context?: () => Document | Element;
}

/**
 * Генератор колбэка doStake (попытка ставки)
 * @returns Функция, которая возвращает true, если попытка ставки успешна, иначе false
 */
const doStakeGenerator =
  (options: DoStakeGeneratorOptions) => async (): Promise<boolean> => {
    if (getWorkerParameter('fakeDoStake')) {
      germesLog('[fake] Делаем ставку', LogType.ACTION);
      return true;
    }
    if (window.germesData.stakeDisabled) {
      germesLog('Ставка недоступна [forced]. Не делаем ставку', LogType.ERROR);
      return false;
    }
    const context = options.context ? options.context() : document;
    germesLog('Делаем ставку', LogType.ACTION);
    if (options.preCheck && !options.preCheck()) {
      return false;
    }
    const stakeButton = context.querySelector<HTMLButtonElement>(
      options.doStakeButtonSelector,
    );

    if (!stakeButton) {
      germesLog('Не найдена кнопка "Сделать ставку"', LogType.ERROR);
      return false;
    }
    const actualCoefficient = options.getCoefficient();
    germesLog(
      `Коэффициент перед ставкой: "${actualCoefficient}"`,
      LogType.INFO,
    );
    if (actualCoefficient < worker.StakeInfo.Coef) {
      germesLog('Коэффициент перед ставкой упал', LogType.ERROR);
      return false;
    }
    const actualParameter = options.getParameter();
    germesLog(`Параметр перед ставкой: "${actualParameter}"`, LogType.INFO);
    if (actualParameter !== worker.StakeInfo.Parametr) {
      germesLog('Параметр перед ставкой изменился', LogType.ERROR);
      return false;
    }
    if (options.errorClasses) {
      const errorClass = options.errorClasses.find(({ className }) => {
        return [...stakeButton.classList].includes(className);
      });
      if (errorClass) {
        germesLog(
          `Кнопка ставки недоступна${
            errorClass.message ? ` (${errorClass.message})` : ''
          }`,
          LogType.ERROR,
        );
        return false;
      }
    }
    if (options.disabledCheck) {
      if (stakeButton.disabled) {
        germesLog('Кнопка ставки недоступна', LogType.ERROR);
        return false;
      }
    }
    window.germesData.doStakeTime = new Date();
    germesLog(
      `Время ставки: ${timeString(window.germesData.doStakeTime)}`,
      LogType.INFO,
    );
    window.germesData.stopUpdateManualData = true;
    if (options.apiMethod) {
      if (!options.apiMethod()) {
        germesLog('Ошибка попытки ставки API методом', LogType.ERROR);
        return false;
      }
    } else {
      stakeButton.click();
    }

    if (options.postCheck && !options.postCheck()) {
      return false;
    }
    // window.germesData.betProcessingStep = 'beforeStart';
    return true;
  };

export default doStakeGenerator;
