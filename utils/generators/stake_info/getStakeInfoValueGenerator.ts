import { getWorkerParameter, germesLog, LogType, text, awaiter } from '../..';

interface TextValue {
  /**
   * Функция, возвращающая исходный текст
   */
  getText: () => string;
  selector?: never;
  context?: never;
}

interface TextFromElement {
  /**
   * Селектор элемента
   */
  selector: string;
  /**
   * Функция, возвращающая контекст для поиска элемента, по умолчанию document
   */
  context?: () => Document | Element;
  getText?: never;
}

interface ExtractValueFromTextOptions {
  /**
   * Опции получения текста
   *
   * Определяет функцию, возвращую текст, или селектор элемента, текст которого будет использоваться
   */
  text: TextValue | TextFromElement;
  /**
   * Заменяемые подстроки в тексте
   *
   * Используется, например, если нужно заменить запятые на точки
   */
  replaceDataArray?: {
    /**
     * Искомый текст/регулярное выражение
     */
    searchValue: string | RegExp;
    /**
     * Текст, на который производится замена
     */
    replaceValue: string;
  }[];
  /**
   * Регулярное выражение для удаления символов из текста, по умолчанию /[\s,']/g;
   */
  removeRegex?: RegExp;
  /**
   * Регулярное выражение для получения значения из текста, по умолчанию /(\d+(?:\.\d+)?)/
   */
  matchRegex?: RegExp;
  /**
   * Возвращаемое значение при ошибке
   */
  errorValue: number;
}

interface StakeInfoValueBasicOptions {
  /**
   * Текстовое описание получаемого значения
   */
  name:
    | 'balance'
    | 'coefficient'
    | 'currentSum'
    | 'maximumStake'
    | 'minimumStake';
  /**
   * Массив значений, которые расцениватся как 0
   */
  zeroValues?: string[];
  /**
   * Функция модификации результата
   *
   * @param value промежуточное значение
   * @param extractType метод, которым получено значение (фиксированное или из текста)
   */
  modifyValue?: (value: number, extractType: string) => number;
  /**
   * Флаг отключения вывода логов, по умолчанию false
   */
  disableLog?: boolean;
}

interface StakeInfoValueFixedOptions extends StakeInfoValueBasicOptions {
  /**
   * Фиксированное (постоянное) значение
   */
  fixedValue: () => number;
  valueFromText?: never;
}

interface StakeInfoValueTextOptions extends StakeInfoValueBasicOptions {
  /**
   * Получение значение из текста
   */
  valueFromText: ExtractValueFromTextOptions;
  fixedValue?: never;
}

// eslint-disable-next-line prettier/prettier
export type StakeInfoValueOptions = StakeInfoValueFixedOptions | StakeInfoValueTextOptions;

export const defaultNumberRegex = /(\d+(?:\.\d+)?)/;
export const defaultRemoveRegex = /[\s,']/g;

const getStakeInfoValueGenerator =
  (options: StakeInfoValueOptions) =>
  (disableLog = false): number => {
    if (options.name === 'balance') {
      if (
        getWorkerParameter('fakeBalance', 'number') ||
        getWorkerParameter('fakeAuth')
      ) {
        const fakeBalance = getWorkerParameter<number>('fakeBalance', 'number');
        if (fakeBalance !== undefined) {
          return fakeBalance;
        }
        return 100000;
      }
    } else if (options.name === 'coefficient') {
      if (
        getWorkerParameter('fakeCoefficient') ||
        getWorkerParameter('fakeOpenStake')
      ) {
        const coefficient = Number(JSON.parse(worker.ForkObj).coefficient);
        if (Number.isNaN(coefficient)) {
          return 0;
        }
        return coefficient;
      }
    } else if (options.name === 'currentSum') {
      if (
        getWorkerParameter('fakeCurrentSum', 'number') ||
        getWorkerParameter('fakeOpenStake')
      ) {
        const fakeCurrentSum = getWorkerParameter<number>(
          'fakeCurrentSum',
          'number',
        );
        if (fakeCurrentSum !== undefined) {
          return fakeCurrentSum;
        }
        return 0;
      }
    } else if (options.name === 'maximumStake') {
      if (
        getWorkerParameter('fakeMaximumStake', 'number') ||
        getWorkerParameter('fakeAuth') ||
        getWorkerParameter('fakeOpenStake')
      ) {
        const fakeMaximumStake = getWorkerParameter<number>(
          'fakeMaximumStake',
          'number',
        );
        if (fakeMaximumStake !== undefined) {
          return fakeMaximumStake;
        }
        return 100000;
      }
      if (window.germesData.maximumStake !== undefined) {
        return window.germesData.maximumStake;
      }
    } else if (options.name === 'minimumStake') {
      if (
        getWorkerParameter('fakeMinimumStake', 'number') ||
        getWorkerParameter('fakeAuth') ||
        getWorkerParameter('fakeOpenStake')
      ) {
        const fakeMinimumStake = getWorkerParameter<number>(
          'fakeMinimumStake',
          'number',
        );
        if (fakeMinimumStake !== undefined) {
          return fakeMinimumStake;
        }
        return 0;
      }
      if (window.germesData.minimumStake !== undefined) {
        return window.germesData.minimumStake;
      }
    }
    let preliminaryValue = 0;
    let extractType = '';
    if ('fixedValue' in options) {
      preliminaryValue = options.fixedValue();
      extractType = 'fixed';
    } else {
      const valueFromTextOptions = options.valueFromText;
      let valueText = '';
      if ('getText' in valueFromTextOptions.text) {
        valueText = valueFromTextOptions.text.getText();
      } else {
        const context = valueFromTextOptions.text.context
          ? valueFromTextOptions.text.context()
          : document;
        const valueElement = context.querySelector(
          valueFromTextOptions.text.selector,
        );
        if (!valueElement) {
          if (options.disableLog !== true && disableLog !== true) {
            germesLog(`Не найден элемент ${options.name}`, LogType.ERROR);
          }
          return valueFromTextOptions.errorValue;
        }
        valueText = text(valueElement);
      }
      if (valueFromTextOptions.replaceDataArray) {
        valueFromTextOptions.replaceDataArray.forEach((replaceData) => {
          valueText = valueText.replace(
            replaceData.searchValue,
            replaceData.replaceValue,
          );
        });
      }
      const removeRegex = valueFromTextOptions.removeRegex
        ? valueFromTextOptions.removeRegex
        : defaultRemoveRegex;
      valueText = valueText.replace(removeRegex, '');
      if (!options.zeroValues || !options.zeroValues.includes(valueText)) {
        const matchRegex = valueFromTextOptions.matchRegex
          ? valueFromTextOptions.matchRegex
          : defaultNumberRegex;
        const minimumStakeMatch = valueText.match(matchRegex);
        if (!minimumStakeMatch) {
          if (options.disableLog !== true && disableLog !== true) {
            germesLog(
              `Непонятный формат элемента ${options.name}: "${valueText}"`,
              LogType.ERROR,
            );
          }
          return valueFromTextOptions.errorValue;
        }
        preliminaryValue = Number(minimumStakeMatch[1]);
      }
      extractType = 'text';
    }
    if (options.modifyValue) {
      return options.modifyValue(preliminaryValue, extractType);
    }
    return preliminaryValue;
  };

export const stakeInfoValueReadyGenerator =
  (options: StakeInfoValueOptions) =>
  async (timeout = 5000, interval = 100): Promise<boolean> => {
    const modifiedOptions = {
      ...options,
      valueFromText: {
        ...options.valueFromText,
        errorValue: null,
      },
      disableLog: true,
    } as StakeInfoValueOptions;
    const modifiedGetStakeInfoValue =
      getStakeInfoValueGenerator(modifiedOptions);
    const valueLoaded = await awaiter(
      () => {
        return modifiedGetStakeInfoValue() !== null;
      },
      timeout,
      interval,
    );
    return Boolean(valueLoaded);
  };

export default getStakeInfoValueGenerator;
