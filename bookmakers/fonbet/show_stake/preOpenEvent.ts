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
  awaiter,
  getElement,
} from '../../../utils';
import { NewUrlError, JsFailError } from '../../../utils/errors';
import { checkAccountBlocked, accountBlocked } from '../helpers/accountChecks';
import checkAppLoaded from '../helpers/checkAppLoaded';
import getSiteCurrency from '../helpers/getSiteCurrency';
import processCookieModalWindow from '../helpers/processCookieModalWinow';

const preOpenEvent = async (): Promise<void> => {
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
  /*                        Ожидание загрузки API сайта                       */
  /* ======================================================================== */

  const appLoaded = await awaiter(checkAppLoaded);
  if (!appLoaded) {
    throw new JsFailError('API не загрузилось');
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
  /*                       Проверка блокировки аккаунта                       */
  /* ======================================================================== */

  if (checkAccountBlocked()) {
    accountBlocked();
    throw new JsFailError('accountBlocked');
  }
  processCookieModalWindow();

  if (window.app.accountManager.needVerification()) {
    germesLog('Необходима верификация', LogType.ERROR);
  }

  /* ======================================================================== */
  /*                              Переход на Лайв                             */
  /* ======================================================================== */

  const liveButton = document.querySelector<HTMLElement>(
    '.menu__item > [href^="/live"]',
  );
  if (!liveButton.parentElement.classList.contains('_state_active')) {
    germesLog('Не на лайве', LogType.DEV_INFO);
    germesLog('Переходим на лайв', LogType.ACTION);
    liveButton.click();
    const betsTable = await getElement(
      '[class^="line-filter-layout__content"]',
    );
    if (!betsTable) {
      throw new JsFailError('Не найдена таблица ставок');
    }
    germesLog('Появилась таблица ставок', LogType.INFO);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const appLoaded = await awaiter(checkAppLoaded);
    if (!appLoaded) {
      throw new JsFailError('API не загрузилось');
    }
  } else {
    germesLog('Открыт лайв', LogType.DEV_INFO);
  }
};

export default preOpenEvent;
