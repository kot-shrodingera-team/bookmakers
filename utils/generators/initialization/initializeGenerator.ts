import { germesLog, LogType } from '../..';

/**
 * Опции генератора функции проверки и вызова авторизации
 */
export interface InitializeGeneratorOptions {
  /**
   * Функция ожидания готовности определения авторизации
   */
  checkAuthReady: (timeout?: number) => Promise<void>;
  /**
   * Таймаут функции ожидания готовности определения авторизации
   */
  checkAuthReadyTimeout?: number;
  /**
   * Функция проверки наличия авторизации
   */
  checkAuth: () => boolean;
  /**
   * Функция ожидания появления баланса
   */
  balanceReady: () => Promise<boolean>;
  /**
   * Функция обновления баланса в боте
   */
  updateBalance: () => void;
  /**
   * Функция авторизации на сайте бк
   */
  authorize: () => Promise<void>;
  /**
   * Функция, выполняющася после успешной авторизации
   */
  afterSuccesfulLogin?: () => Promise<void>;
}

/**
 * Генератор функции проверки и вызова авторизации
 */
const initializeGenerator =
  (options: InitializeGeneratorOptions) => async (): Promise<void> => {
    if (worker.LoginTry > 3) {
      germesLog('Превышен лимит попыток авторизации', LogType.ERROR);
      return;
    }
    const timeout = options.checkAuthReadyTimeout
      ? options.checkAuthReadyTimeout
      : 5000;
    await options.checkAuthReady(timeout);
    worker.Islogin = options.checkAuth();
    worker.JSLogined();
    if (worker.Islogin) {
      germesLog('Есть авторизация', LogType.SUCCESS);
      worker.Islogin = true;
      worker.JSLogined();
      const balanceLoaded = await options.balanceReady();
      if (!balanceLoaded) {
        germesLog('Баланс не появился', LogType.ERROR);
      } else {
        germesLog('Баланс появился', LogType.DEV_INFO);
        options.updateBalance();
      }
      if (options.afterSuccesfulLogin) {
        options.afterSuccesfulLogin();
      }
    } else {
      options.authorize();
    }
  };

export default initializeGenerator;
