import { getWorkerParameter } from '../..';

export interface GetStakeCountGeneratorElementOptions {
  /**
   * Селектор ставки в купоне
   */
  stakeSelector: string;
  /**
   * Функция, возвращающая контекст для поиска элементов DOM, по умолчанию document
   */
  context?: () => Document | Element;
  function?: never;
}

export interface GetStakeCountGeneratorFunctionOptions {
  function: () => number;
  stakeSelector?: never;
  context?: never;
}

/**
 * Опции генератора функции получения количества ставок в купоне
 */
export type GetStakeCountGeneratorOptions =
  | GetStakeCountGeneratorElementOptions
  | GetStakeCountGeneratorFunctionOptions;

/**
 * Генератор функции получения количества ставок в купоне
 * @returns Функция, которая возвращает количество ставок в купоне
 */
const getStakeCountGenerator =
  (options: GetStakeCountGeneratorOptions) => (): number => {
    if (
      getWorkerParameter('fakeStakeCount') ||
      getWorkerParameter('fakeOpenStake')
    ) {
      return 1;
    }
    if ('function' in options) {
      return options.function();
    }
    const context = options.context ? options.context() : document;
    return context.querySelectorAll(options.stakeSelector).length;
  };

export default getStakeCountGenerator;
