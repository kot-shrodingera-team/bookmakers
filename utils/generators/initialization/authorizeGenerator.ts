import {
  germesLog,
  LogType,
  sleep,
  getElement,
  nativeInput,
  fireEvent,
} from '../..';
import { setReactInputValue } from '../../reactUtils';

/**
 * Опции генератора функции авторизации на сайте бк
 */
export interface AuthorizeGeneratorOptions {
  /**
   * Функция проверки перед началом авторизации
   *
   * Используется, если, например, нужно дождаться полной загрузки страницы
   *
   * Если вернёт false, авторизация считается не успешной
   */
  preCheck?: () => Promise<boolean>;
  /**
   * Опции открытия формы авторизации
   *
   * Используется если на сайте не отображаются сразу поля логина и пароля,
   * а есть отдельная кнопка для открытия формы авторизации
   */
  openForm?: {
    /**
     * Селектор элемента открытия формы
     */
    selector: string;
    /**
     * Селектор элемента открытой формы
     */
    openedSelector: string;
    /**
     * Задержка в мс после перед открытием формы, по умолчанию 0
     */
    beforeOpenDelay?: number;
    /**
     * Количество попыток открытия формы, по умолчанию 1
     */
    loopCount?: number;
    /**
     * Интервал попыток открытия формы в мс, по умолчанию 2000
     */
    triesInterval?: number;
    /**
     * Задержка в мс после появления открытой формы, перед вводом данных, по умолчанию 0
     */
    afterOpenDelay?: number;
  };
  /**
   * Функция проверки перед вводом данных
   *
   * Используется, если, например, нужно переключить типа логина (по почте, логину или телефону)
   * Или какие-то другие проверки
   *
   * Если вернёт false, авторизация считается не успешной
   */
  preInputCheck?: () => Promise<boolean>;
  /**
   * Селектор элемента ввода логина
   */
  loginInputSelector: string;
  /**
   * Селектор элемента ввода пароля
   */
  passwordInputSelector: string;
  /**
   * Задержка перед вводом пароля, по умолчанию 0
   */
  beforePasswordInputDelay?: number;
  /**
   * Селектор элемента submit (кнопка входа)
   */
  submitButtonSelector: string;
  /**
   * Тип ввода данных в поля логина и пароля, по умолчанию fireEvent
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
   * Задержка перед submit (после ввода данных), по умолчанию 0
   */
  beforeSubmitDelay?: number;
  /**
   * Функция проверки перед попыткой входа (нажатием кнопки)
   *
   * Если вернёт false, авторизация считается не успешной
   */
  beforeSubmitCheck?: () => Promise<boolean>;
  /**
   * Функция проверки после попыткой входа (нажатия кнопки)
   *
   * Если вернёт false, авторизация считается не успешной
   */
  afterSubmitCheck?: () => Promise<boolean>;
  /**
   * Ожидание появления авторизации
   *
   * Используется если авторизация происходит без перезагрузки страницы
   */
  loginedWait?: {
    /**
     * Селектор элемента наличия авторизации
     */
    loginedSelector: string;
    /**
     * Таймаут ожидания появления авторизации
     */
    timeout?: number;
    /**
     * Функция ожидания появления баланса
     */
    balanceReady: () => Promise<boolean>;
    /**
     * Функция обновления баланса в боте
     */
    updateBalance: () => void;
    /**
     * Функция, выполняющася после успешной авторизации
     */
    afterSuccesfulLogin?: () => Promise<void>;
  };
  /**
   * context - Функция, возвращающая контекст для поиска элементов DOM, по умолчанию document
   */
  context?: () => Document | Element;
}

/**
 * Генератор функции авторизации на сайте бк
 */
const authorizeGenerator =
  (options: AuthorizeGeneratorOptions) => async (): Promise<void> => {
    const context = options.context ? options.context() : document;

    /* ======================================================================== */
    /*                        Проверка перед авторизацией                       */
    /* ======================================================================== */

    if (options.preCheck) {
      const preCheckSuccesful = await options.preCheck();
      if (!preCheckSuccesful) {
        germesLog('Не пройдена проверка перед авторизации', LogType.ERROR);
        return;
      }
    }

    /* ========================================================================== */
    /*                         Открытие формы авторизации                         */
    /* ========================================================================== */

    if (options.openForm) {
      const loopCount = options.openForm.loopCount
        ? options.openForm.loopCount
        : 1;
      const triesInterval = options.openForm.triesInterval
        ? options.openForm.triesInterval
        : 2000;

      /* --------------- Ожидание перед открытием формы авторизации --------------- */

      if (options.openForm.beforeOpenDelay) {
        germesLog(
          `Ожидание (${options.openForm.beforeOpenDelay} мс) перед открытием формы авторизации`,
          LogType.DEV_INFO,
        );
        await sleep(options.openForm.beforeOpenDelay);
      }

      /* ----------------- Цикл попыток открытия формы авторизации ---------------- */

      for (let i = 1; i <= loopCount; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await Promise.race([
          getElement(options.openForm.selector, 5000, context),
          getElement(options.openForm.openedSelector, 5000, context),
        ]);

        const openLoginFormButton = context.querySelector<HTMLElement>(
          options.openForm.selector,
        );
        const openedForm = context.querySelector<HTMLElement>(
          options.openForm.openedSelector,
        );
        if (openedForm) {
          germesLog('Форма авторизации уже открыта', LogType.DEV_INFO);
          break;
        }
        if (!openLoginFormButton) {
          germesLog(
            'Не найдена кнопка открытия формы авторизации',
            LogType.ERROR,
          );
          return;
        }

        germesLog('Открываем форму авторизации', LogType.DEV_ACTION);
        openLoginFormButton.click();

        // eslint-disable-next-line no-await-in-loop
        const authForm = await getElement(
          options.openForm.openedSelector,
          triesInterval,
          context,
        );
        if (!authForm) {
          if (i === loopCount) {
            germesLog('Форма авторизации так и не появилась', LogType.ERROR);
            return;
          }
          germesLog(
            'Форма авторизации не появилась. Пробуем ещё раз',
            LogType.INFO,
          );
        } else {
          germesLog('Появилась форма авторизации', LogType.DEV_INFO);
          break;
        }
      }

      /* ---------------- Задержка после открытия формы авторизации --------------- */

      if (options.openForm.afterOpenDelay) {
        germesLog(
          `Ожидание (${options.openForm.afterOpenDelay} мс) после открытия формы авторизации`,
          LogType.DEV_INFO,
        );
        await sleep(options.openForm.afterOpenDelay);
      }
    }

    /* ========================================================================== */
    /*                        Проверка перед вводом данных                        */
    /* ========================================================================== */

    if (options.preInputCheck) {
      const preInputCheckSuccesful = await options.preInputCheck();
      if (!preInputCheckSuccesful) {
        germesLog(
          'Не пройдена проверка перед вводом данных авторизации',
          LogType.ERROR,
        );
        return;
      }
    }

    /* ========================================================================== */
    /*                          Определение метода ввода                          */
    /* ========================================================================== */

    const input = (inputElement: HTMLInputElement, value: string): void => {
      if (options.inputType === 'nativeInput') {
        nativeInput(inputElement, value);
      } else if (options.inputType === 'react') {
        setReactInputValue(inputElement, value);
      } else {
        // eslint-disable-next-line no-param-reassign
        inputElement.value = value;
        if (options.fireEventNames) {
          options.fireEventNames.forEach((eventName) => {
            fireEvent(inputElement, eventName);
          });
        } else {
          // fireEvent(inputElement, 'focus');
          // fireEvent(inputElement, 'click');
          // fireEvent(inputElement, 'keypress');
          // fireEvent(inputElement, 'keyup');
          fireEvent(inputElement, 'input');
        }
      }
    };

    /* ========================================================================== */
    /*                                 Ввод данных                                */
    /* ========================================================================== */

    germesLog('Вводим данные для авторизации', LogType.DEV_ACTION);

    /* ------------------------------- Ввод логина ------------------------------ */

    const loginInput = await getElement<HTMLInputElement>(
      options.loginInputSelector,
      5000,
      context,
    );
    if (!loginInput) {
      germesLog('Не найдено поле ввода логина', LogType.ERROR);
      return;
    }
    input(loginInput, worker.Login);

    /* ---------------------- Задержка перед вводом пароля ---------------------- */

    if (options.beforePasswordInputDelay) {
      germesLog(
        `Ожидание (${options.beforePasswordInputDelay} мс) перед вводом пароля`,
        LogType.DEV_INFO,
      );
      await sleep(options.beforePasswordInputDelay);
    }

    /* ------------------------------- Ввод пароля ------------------------------ */

    const passwordInput = await getElement<HTMLInputElement>(
      options.passwordInputSelector,
      5000,
      context,
    );
    if (!passwordInput) {
      germesLog('Не найдено поле ввода пароля', LogType.ERROR);
      return;
    }
    input(passwordInput, worker.Password);

    /* ========================================================================== */
    /*                    Ожидание перед нажатием кнопки входа                    */
    /* ========================================================================== */

    if (options.beforeSubmitDelay) {
      germesLog(
        `Ожидание (${options.beforeSubmitDelay} мс) перед нажатием кнопки входа`,
        LogType.DEV_INFO,
      );
      await sleep(options.beforeSubmitDelay);
    }

    /* ========================================================================== */
    /*                    Проверка перед нажатием кнопки входа                    */
    /* ========================================================================== */

    if (options.beforeSubmitCheck) {
      const check = await options.beforeSubmitCheck();
      if (!check) {
        germesLog(
          'Не удалось пройти проверку перед попыткой входа',
          LogType.ERROR,
        );
        return;
      }
    }

    /* ========================================================================== */
    /*                            Нажатие кнопки входа                            */
    /* ========================================================================== */

    const loginSubmitButton = await getElement<HTMLElement>(
      options.submitButtonSelector,
      5000,
      context,
    );
    if (!loginSubmitButton) {
      germesLog('Не найдена кнопка входа', LogType.ERROR);
      return;
    }

    germesLog('Нажимаем на кнопку входа', LogType.DEV_ACTION);
    loginSubmitButton.click();
    worker.LoginTry += 1;

    /* ========================================================================== */
    /*                     Проверка после нажатия кнопки входа                    */
    /* ========================================================================== */

    if (options.afterSubmitCheck) {
      const check = await options.afterSubmitCheck();
      if (!check) {
        germesLog(
          'Не удалось пройти проверку после попыткой входа',
          LogType.ERROR,
        );
        return;
      }
    }

    /* ========================================================================== */
    /*               Ожидание авторизации после нажатия кнопки входа              */
    /* ========================================================================== */

    if (options.loginedWait) {
      const timeout = options.loginedWait.timeout || 5000;
      const logined = await getElement(
        options.loginedWait.loginedSelector,
        timeout,
        context,
      );
      if (!logined) {
        germesLog('Авторизация не удалась', LogType.ERROR);
        return;
      }
      germesLog('Авторизация успешна', LogType.SUCCESS);
      worker.Islogin = true;
      worker.JSLogined();
      const balanceLoaded = await options.loginedWait.balanceReady();
      if (!balanceLoaded) {
        germesLog('Баланс не появился', LogType.ERROR);
      } else {
        options.loginedWait.updateBalance();
      }
      if (options.loginedWait.afterSuccesfulLogin) {
        options.loginedWait.afterSuccesfulLogin();
      }
    }
  };

export default authorizeGenerator;
