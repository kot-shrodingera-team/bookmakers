import {
  germesLog,
  getSessionData,
  getWorkerParameter,
  LogType,
  setSessionData,
} from '../../../utils';
import { NewUrlError, JsFailError } from '../../../utils/errors';

const openEvent = async (): Promise<void> => {
  if (getWorkerParameter('useAPI')) {
    /* ====================================================================== */
    /*                 Проверка, что открыт раздел Sportsbook                 */
    /* ====================================================================== */

    const sportsbookTab = document.querySelector<HTMLElement>('#SPORTSBOOK');
    if (!sportsbookTab) {
      throw new JsFailError('Не найден раздел Sportsbook');
    }
    if (!sportsbookTab.parentElement.classList.contains('ssc-actv')) {
      germesLog('Открыт не раздел Sportsbook', LogType.INFO);
      sportsbookTab.click();
      throw new NewUrlError('Переходим в раздел Sportsbook');
    }
    germesLog('Открыт раздел Sportsbook', LogType.DEV_INFO);
  } else {
    /* ====================================================================== */
    /*            Если не было попытки перехода на страницу события           */
    /* ====================================================================== */

    if (getSessionData('TransitionToEventPage') === '0') {
      if (window.location.href === worker.EventUrl) {
        germesLog('Уже открыто нужное событие', LogType.INFO);
        return;
      }
      germesLog(
        `${window.location.href} !== ${worker.EventUrl}`,
        LogType.DEV_INFO,
      );
      setSessionData('TransitionToEventPage', '1');
      window.location.href = worker.EventUrl;
      throw new NewUrlError('Переходим на событие');
    }

    /* ====================================================================== */
    /*             Если была попытка перехода на страницу события             */
    /* ====================================================================== */

    if (window.location.href === worker.EventUrl) {
      germesLog('Открыли нужное событие', LogType.INFO);
      return;
    }
    germesLog(`${window.location.href} !== ${worker.EventUrl}`, LogType.ERROR);
    throw new JsFailError('Не удалось перейти на нужное событие');
  }
};

export default openEvent;
