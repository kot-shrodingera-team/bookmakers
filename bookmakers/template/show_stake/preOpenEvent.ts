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
} from '../../../utils';
import { NewUrlError, JsFailError } from '../../../utils/errors';
import getSiteCurrency from '../helpers/getSiteCurrency';

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
};

export default preOpenEvent;
