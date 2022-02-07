import { getWorkerParameter } from '../..';

/**
 * Опции генератора функции определения авторизации
 */
export interface CheckAuthGeneratorOptions {
  /**
   * Дополнительная проверка авторизации
   * Если вернёт false, считается, что авторизации нет
   */
  preCheck?: () => boolean;
  /**
   * Селектор элемента наличия авторизации
   */
  authElementSelector: string;
  /**
   * Функция, возвращающая контекст для поиска элементов DOM, по умолчанию document
   */
  context?: () => Document | Element;
}

/**
 * Генератор функции определения авторизации
 * @returns Функция, которая возвращает true, если есть авторизация, иначе false
 */
const checkAuthGenerator =
  (options: CheckAuthGeneratorOptions) => (): boolean => {
    if (getWorkerParameter('fakeAuth')) {
      return true;
    }
    if (options.preCheck && !options.preCheck()) {
      return false;
    }
    const context = options.context ? options.context() : document;
    const authElement = context.querySelector(options.authElementSelector);
    return Boolean(authElement);
  };

export default checkAuthGenerator;
