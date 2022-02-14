import {
  getWorkerParameter,
  germesLog,
  LogType,
  nativeInput,
  fireEvent,
} from '../..';
import { setReactInputValue } from '../../reactUtils';

/**
 * Опции генератора колбэка setStakeSum (ввод суммы ставки)
 */
export interface SetStakeSumGeneratorOptions {
  /**
   * Функция проверки перед вводом суммы ставки
   *
   * Если вернёт false, ввод суммы ставки считается не успешной
   */
  preCheck?: (number?: number) => Promise<boolean>;
  /**
   * Функция ввода суммы ставки
   */
  function?: (sum?: number) => boolean;
  /**
   * Селектор элемента ввода суммы в купоне
   */
  sumInputSelector: string;
  /**
   * Проверка, введена ли уже нужная сумма
   *
   * Если она уже введена, ввод суммы заканчивается и считается успешным
   */
  alreadySetCheck?: {
    /**
     * Функция получения текущей суммы в купоне
     */
    getCurrentSum: () => number;
    /**
     * Флаг, указывающий на то, считать ли ввод суммы не успешным после ввода, если изначально сумма была иной, по умолчанию false
     *
     * Используется, если нужна задержка после изменения суммы в купоне
     */
    falseOnSumChange: boolean;
  };
  /**
   * Функция проверки перед вводом суммы ставки
   *
   * Если вернёт false, ввод суммы ставки считается не успешной
   */
  preInputCheck?: (number?: number) => boolean;
  /**
   * Тип ввода данных в поле ввода суммы ставки, по умолчанию fireEvent
   */
  inputType?: 'fireEvent' | 'react' | 'nativeInput';
  /**
   * Массив имён инициируемых событих, если тип ввода данных fireEvent, по умолчанию одно событие input
   *
   * Используется если нужно инициировать другие события, например keyDown, keyUp и тд.
   * Выполняются в указанном порядке
   */
  fireEventNames?: string[];
  /**
   * context - Функция, возвращающая контекст для поиска элементов DOM, по умолчанию document
   */
  context?: () => Document | Element;
}

/**
 * Генератор колбэка setStakeSum (ввод суммы ставки)
 * @returns Функция, которая возвращает true, если ввод суммы ставки успешен, иначе false
 * - sum - вводимая сумма ставки
 */
const setStakeSumGenerator =
  (options: SetStakeSumGeneratorOptions) =>
  async (
    sum: number = worker.StakeInfo.Summ,
    disableLog = false,
    skipChecks = false,
  ): Promise<boolean> => {
    if (getWorkerParameter('fakeDoStake')) {
      germesLog(`[fake] Вводим сумму ставки: "${sum}"`, LogType.ACTION);
      return true;
    }
    if (window.germesData.stakeDisabled) {
      germesLog('Ставка недоступна [forced]. Не вводим сумму', LogType.ERROR);
      return false;
    }
    if (!skipChecks && options.preCheck) {
      if (!(await options.preCheck(sum))) {
        return false;
      }
    }
    if (options.function) {
      return options.function(sum);
    }
    const context = options.context ? options.context() : document;
    if (!disableLog) {
      germesLog(`Вводим сумму ставки: "${sum}"`, LogType.ACTION);
    }
    if (!skipChecks && sum > worker.StakeInfo.Balance) {
      germesLog(
        'Ошибка ввода суммы ставки: вводимая сумма больше баланса',
        LogType.ERROR,
      );
      return false;
    }
    if (!skipChecks && sum > worker.StakeInfo.MaxSumm) {
      germesLog(
        'Ошибка ввода суммы ставки: вводимая сумма больше максимальной ставки',
        LogType.ERROR,
      );
      return false;
    }
    const inputElement = context.querySelector<HTMLInputElement>(
      options.sumInputSelector,
    );
    if (!inputElement) {
      germesLog('Поле ввода суммы ставки не найдено', LogType.ERROR);
      return false;
    }
    let falseOnSumChangeCheck = false;
    if (!skipChecks && options.alreadySetCheck) {
      const currentSum = options.alreadySetCheck.getCurrentSum();
      if (currentSum === sum) {
        if (!disableLog) {
          germesLog('Уже введена нужная сумма', LogType.INFO);
        }
        return true;
      }
      if (options.alreadySetCheck.falseOnSumChange) {
        falseOnSumChangeCheck = true;
      }
    }
    if (!skipChecks && options.preInputCheck && !options.preInputCheck(sum)) {
      return false;
    }
    if (options.inputType === 'nativeInput') {
      nativeInput(inputElement, String(sum));
    } else if (options.inputType === 'react') {
      setReactInputValue(inputElement, sum);
    } else {
      inputElement.value = String(sum);
      if (options.fireEventNames) {
        options.fireEventNames.forEach((eventName) => {
          fireEvent(inputElement, eventName);
        });
      } else {
        fireEvent(inputElement, 'input');
      }
    }
    if (falseOnSumChangeCheck) {
      if (!disableLog) {
        germesLog('Задержка после изменения суммы в купоне', LogType.INFO);
      }
      return false;
    }
    return true;
  };

/**
 * Генератор функции clearStakeSum (очистка поля ввода суммы ставки)
 * @returns Функция, которая возвращает true, если очистка поля ввода суммы ставки успешна, иначе false
 */
export const clearStakeSumGenerator =
  (options: SetStakeSumGeneratorOptions) =>
  (disableLog = false): boolean => {
    const context = options.context ? options.context() : document;
    if (!disableLog) {
      germesLog('Очищаем сумму ставки', LogType.ACTION);
    }
    const inputElement = context.querySelector<HTMLInputElement>(
      options.sumInputSelector,
    );
    if (!inputElement) {
      germesLog('Поле ввода суммы ставки не найдено', LogType.ERROR);
      return false;
    }
    if (options.inputType === 'nativeInput') {
      nativeInput(inputElement, '');
    } else if (options.inputType === 'react') {
      setReactInputValue(inputElement, '');
    } else {
      inputElement.value = '';
      if (options.fireEventNames) {
        options.fireEventNames.forEach((eventName) => {
          fireEvent(inputElement, eventName);
        });
      } else {
        fireEvent(inputElement, 'input');
      }
    }
    return true;
  };

export default setStakeSumGenerator;
