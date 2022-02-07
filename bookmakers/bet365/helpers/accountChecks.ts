import {
  getElement,
  germesLog,
  awaiter,
  LogType,
  getWorkerParameter,
  setSessionData,
  getSessionData,
} from '../../../utils';
import { JsFailError } from '../../../utils/errors';

/**
 * Проверка на наличие кэшаута
 * @returns true, если есть кэшаут, false, если нет
 * @throws JsFailError, если не удалось определить наличие кэшаута
 */
export const checkCashOut = async (timeout = 5000): Promise<boolean> => {
  const myBetsTab = await getElement<HTMLElement>(
    '.hm-MainHeaderCentreWide .hm-HeaderMenuItemMyBets',
  );
  if (!myBetsTab) {
    throw new JsFailError('Не найдена вкладка MyBets');
  }
  const inPlayButton = await getElement<HTMLElement>(
    '.hm-MainHeaderCentreWide .hm-HeaderMenuItem:nth-child(2)',
  );
  if (!inPlayButton) {
    throw new JsFailError('Не найдена вкладка In-Play');
  }

  myBetsTab.click();
  await getElement('.myb-MyBetsHeader_Button, .myb-HeaderButton', timeout);
  const myBetsFilterButtons = [
    ...document.querySelectorAll('.myb-MyBetsHeader_Button, .myb-HeaderButton'),
  ];
  if (myBetsFilterButtons.length === 0) {
    inPlayButton.click();
    throw new JsFailError('Не найдены кнопки фильтров истории ставок');
  }
  const cashOutFilterButton = myBetsFilterButtons.find(
    (button) =>
      button.textContent === 'Cash Out' ||
      button.textContent === 'Chiudi Scommessa', // Итальянская версия
  );
  if (!cashOutFilterButton) {
    inPlayButton.click();
    throw new JsFailError('Не найдена кнопка фильтра Cash Out');
  }
  const cashOutEnabled = ![...cashOutFilterButton.classList].includes('Hidden');
  inPlayButton.click();
  return cashOutEnabled;
};

/**
 * Проверка пореза
 * @returns true, если есть порез, false, если нет пореза
 * @throws JsFailError, если не удалось определить порез
 */
export const checkAccountLimited = async (): Promise<boolean> => {
  const useApi = !getWorkerParameter('dontUseAPI');
  if (
    useApi &&
    window.ns_mybetssubscriptionlib &&
    window.ns_mybetssubscriptionlib.MyBetsSubscriptionsManager &&
    window.ns_mybetssubscriptionlib.MyBetsSubscriptionsManager.GetInstance &&
    window.ns_mybetssubscriptionlib.MyBetsSubscriptionsManager.GetInstance()
  ) {
    germesLog('Проверка пореза по API', LogType.DEV_ACTION);
    const checkReady = await awaiter(
      () =>
        typeof window.ns_mybetssubscriptionlib.MyBetsSubscriptionsManager.GetInstance()
          .closeBetsEnabled !== 'undefined',
    );
    if (checkReady) {
      // Если closeBetsEnabled = true, пореза нет
      const { closeBetsEnabled } =
        window.ns_mybetssubscriptionlib.MyBetsSubscriptionsManager.GetInstance();
      if (closeBetsEnabled) {
        germesLog('Пореза нет', LogType.DEV_INFO);
      } else {
        germesLog('Есть порез', LogType.DEV_INFO);
      }
      return !closeBetsEnabled;
    }
    germesLog(
      'Не удалось проверить порез аккаунта. Проверяем CashOut',
      LogType.ACTION,
    );
  }
  const cashOut = await checkCashOut();
  if (cashOut) {
    germesLog('Есть кэшаут', LogType.DEV_INFO);
    return false;
  }
  germesLog('Нет кэшаута', LogType.ERROR);
  return true;
};

export const accountRestricted = (): void => {
  setSessionData('AccountRestricted', '1');
  const message = worker.SetBookmakerPaused(true)
    ? 'Аккаунт Bet365 заблокирован! Bet365 поставлен на паузу'
    : 'Аккаунт Bet365 заблокирован! Bet365 НЕ поставлен на паузу. Поставьте на паузу вручную';
  germesLog(message, LogType.FATAL);
  worker.Helper.SendInformedMessage(message);
};

export const accountStep2 = (): void => {
  setSessionData('setSessionDataAccountStep2', '1');
  const message = worker.SetBookmakerPaused(true)
    ? 'В Bet365 не пройден Step 2, ставки заблокированы! Bet365 поставлен на паузу'
    : 'В Bet365 не пройден Step 2, ставки заблокированы! Поставьте на паузу вручную';
  germesLog(message, LogType.FATAL);
  worker.Helper.SendInformedMessage(message);
};

export const accountSurvey = (): void => {
  setSessionData('setSessionDataAccountSurvey', '1');
  const message = worker.SetBookmakerPaused(true)
    ? 'В Bet365 не пройден опрос, ставки заблокированы! Bet365 поставлен на паузу'
    : 'В Bet365 не пройден опрос, ставки заблокированы! Поставьте на паузу вручную';
  germesLog(message, LogType.FATAL);
  worker.Helper.SendInformedMessage(message);
};

export const accountLimited = (): void => {
  setSessionData('AccountLimited', '1');
  const message = (() => {
    let text = 'В Bet365 порезанный аккаунт. ';
    if (worker.PauseOnLimitedAccount) {
      text += 'В настройках включена опция паузы при порезанном аккаунте. ';
      if (worker.SetBookmakerPaused(true)) {
        text += 'БК успешно поставлена на паузу';
      } else {
        text += 'Не удалось поставить БК на паузу. Поставьте на паузу вручную';
      }
    } else {
      text +=
        'В настройках отключена опция паузы при порезанном аккаунте. БК продолжает работу';
    }
    return text;
  })();
  if (getSessionData('AccountLimitedInformed') !== '1') {
    worker.Helper.SendInformedMessage(message);
    setSessionData('AccountLimitedInformed', '1');
    germesLog(message, LogType.ERROR);
  } else {
    germesLog(message, LogType.ACTION);
  }
};
