import { getWorkerParameter, getElement, germesLog, LogType } from '../..';

/**
 * Опции генератора функции ожидания готовности определения авторизации
 */
export interface CheckAuthReadyGeneratorOptions {
  /**
   * Селектор элемента отсутствия авторизации
   */
  noAuthElementSelector: string;
  /**
   * Селектор элемента наличия авторизации
   */
  authElementSelector: string;
  /**
   * Таймаут ожидания элемента наличия авторизации после появления элемента отсутствия авторизации, по умолчанию 0
   *
   * Используется, если при загрузке страницы может появится элемент отсутствия авторизации,
   * и только через какое-то время элемент наличия авторизации
   */
  maxDelayAfterNoAuthElementAppeared?: number;
  /**
   * Функция, возвращающая контекст для поиска элементов DOM, по умолчанию document
   */
  context?: () => Document | Element;
}

/**
 * Генератор функции ожидания готовности определения авторизации
 *
 * Ожидает появления элемента наличия или отсутствия авторизации
 * @returns Асинхронная функция, которая возвращает true, если есть готовность определения авторизации, иначе false
 * - timeout - Таймаут проверки, по умолчанию 5000
 */
const checkAuthReadyGenerator =
  (options: CheckAuthReadyGeneratorOptions) =>
  async (timeout = 5000): Promise<void> => {
    if (getWorkerParameter('fakeAuth')) {
      return;
    }
    const context = options.context ? options.context() : document;
    await Promise.race([
      getElement(options.noAuthElementSelector, timeout, context),
      getElement(options.authElementSelector, timeout, context),
    ]);
    const noAuthElement = context.querySelector(options.noAuthElementSelector);
    const authElement = context.querySelector(options.authElementSelector);
    if (options.maxDelayAfterNoAuthElementAppeared && noAuthElement) {
      germesLog(
        'Появился элемент отсутсвия авторизации, ожидаем элемент наличия авторизации',
        LogType.DEV_INFO,
      );
      const authElementWaited = await getElement(
        options.authElementSelector,
        options.maxDelayAfterNoAuthElementAppeared,
        context,
      );
      if (authElementWaited) {
        germesLog('Появился элемент наличия авторизации', LogType.DEV_INFO);
      } else {
        germesLog('Элемент наличия авторизации не появился', LogType.DEV_INFO);
      }
      return;
    }
    if (noAuthElement) {
      germesLog('Появился элемент отсутствия авторизации', LogType.DEV_INFO);
    } else if (authElement) {
      germesLog('Появился элемент наличия авторизации', LogType.DEV_INFO);
    } else {
      germesLog(
        'Не найден элемент наличия или отсутствия авторизации',
        LogType.ERROR,
      );
    }
  };

export default checkAuthReadyGenerator;
