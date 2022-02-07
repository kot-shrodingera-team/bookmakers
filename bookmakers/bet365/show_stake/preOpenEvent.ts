import checkAuth from '../../../src/stake_info/checkAuth';
import checkAuthReady from '../../../src/stake_info/checkAuthReady';
import {
  balanceReady,
  updateBalance,
} from '../../../src/stake_info/getBalance';
import {
  checkBookerHost,
  germesLog,
  checkCurrency,
  LogType,
  getSessionData,
  awaiter,
  getWorkerParameter,
} from '../../../utils';
import { NewUrlError, JsFailError } from '../../../utils/errors';
import { checkAccountLimited, accountLimited } from '../helpers/accountChecks';
import getSiteCurrency from '../helpers/getSiteCurrency';

const preOpenEvent = async (): Promise<void> => {
  /* ======================================================================== */
  /*                    Пауза, если заблокированный аккаунт                   */
  /* ======================================================================== */

  if (getSessionData('AccountRestricted') === '1') {
    const message = worker.SetBookmakerPaused(true)
      ? 'Аккаунт Bet365 заблокирован! Bet365 поставлен на паузу'
      : 'Аккаунт Bet365 заблокирован! Bet365 НЕ поставлен на паузу. Поставьте на паузу вручную';
    worker.Helper.SendInformedMessage(message);
    throw new JsFailError(message);
  }

  /* ======================================================================== */
  /*                     Проверка адреса открытой страницы                    */
  /* ======================================================================== */

  if (!checkBookerHost()) {
    germesLog('Открыта не страница конторы (или зеркала)', LogType.ERROR);
    germesLog(
      `${window.location.host} !== ${worker.BookmakerMainUrl}`,
      LogType.ERROR,
    );
    window.location.href = new URL(worker.BookmakerMainUrl).href;
    throw new NewUrlError('Открываем страницу БК');
  }

  /* ======================================================================== */
  /*                 Проверка авторизации и обновление баланса                */
  /* ======================================================================== */

  await checkAuthReady();
  worker.Islogin = checkAuth();
  worker.JSLogined();
  if (!worker.Islogin) {
    throw new JsFailError('Нет авторизации');
  }
  germesLog('Есть авторизация', LogType.INFO);
  await balanceReady();
  updateBalance();

  /* ======================================================================== */
  /*                              Проверка валюты                             */
  /* ======================================================================== */

  const siteCurrency = getSiteCurrency();
  checkCurrency(siteCurrency);

  /* ======================================================================== */
  /*                         Закрытие всплывающих окон                        */
  /* ======================================================================== */

  const closeButton = document.querySelector<HTMLElement>(
    '.pm-PushTargetedMessageOverlay_CloseButton',
  );
  if (closeButton) {
    closeButton.click();
  }

  const remainLoggedInButton = document.querySelector<HTMLElement>(
    '.alm-ActivityLimitStayButton',
  );
  if (remainLoggedInButton) {
    germesLog('Нажимаем кнопку "Remain Logged In"', LogType.ACTION);
    remainLoggedInButton.click();
  }

  const lastLoginButton = document.querySelector<HTMLElement>(
    '.llm-LastLoginModule_Button',
  );
  if (lastLoginButton) {
    germesLog('Нажимаем кнопку "Continue" Last Login', LogType.ACTION);
    lastLoginButton.click();
  }

  const pushBetDialogOkButton = document.querySelector<HTMLElement>(
    '.bil-BetslipPushBetDialog_OkayButton',
  );
  if (pushBetDialogOkButton) {
    germesLog('Нажимаем кнопку "OK" PushBetDialog', LogType.ACTION);
    pushBetDialogOkButton.click();
  }

  /* ======================================================================== */
  /*                           Проверка загрузки API                          */
  /* ======================================================================== */

  const locatorLoaded = await awaiter(
    () =>
      typeof window.BetSlipLocator !== 'undefined' &&
      typeof window.ns_favouriteslib_ui !== 'undefined',
    10000,
  );
  if (!locatorLoaded) {
    window.location.href = new URL('/#/IP/', worker.BookmakerMainUrl).href;
    throw new NewUrlError('Страница не догрузилась. Перезагружаем');
  }

  /* ======================================================================== */
  /*                         Проверка языка и кэшаута                         */
  /* ======================================================================== */

  if (
    !getWorkerParameter('fakeAuth') &&
    !getWorkerParameter('disableAccountChecks')
  ) {
    if (!getWorkerParameter('disableAccountLimitedCheck')) {
      if (await checkAccountLimited()) {
        accountLimited();
        if (worker.PauseOnLimitedAccount) {
          throw new JsFailError();
        }
      }
    }
  }
};

export default preOpenEvent;
