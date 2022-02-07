import {
  germesLog,
  getElement,
  getWorkerParameter,
  LogType,
} from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const preOpenBet = async (): Promise<void> => {
  if (getWorkerParameter('useAPI')) {
    /* ====================================================================== */
    /*                Ждём появления какой-нибудь кнопки ставки               */
    /* ====================================================================== */

    const anySelection = await getElement('.com-bet-button');
    // com-bet-button ui-bet-button ui-market-action bet-button-1259f71d89b966a7b870c2f9e55e47520e28a22c ui-runner ui-924_289515235-55190 ui-runner-active ui-betslip-action
    if (!anySelection) {
      throw new JsFailError('Не появилось ни одной кнопки ставки');
    }
    germesLog('Появилась кнопка ставки', LogType.DEV_INFO);
  } else {
    const marketTabsList = await getElement('.marketgroups-list-container');
    if (!marketTabsList) {
      throw new JsFailError('Не найден контейнер вкладок маркетов');
    }
    if (marketTabsList.childElementCount === 0) {
      germesLog('Нет вкладок маркетов', LogType.DEV_INFO);
    } else {
      const allMarketsTab = await getElement<HTMLElement>(
        '.tabs-container [data-galabel="All Markets"], .tabs-container [data-galabel="All"]', // В футболе All, в других спортах All Markets
      );
      if (!allMarketsTab) {
        throw new JsFailError('Не найдена вкладка всех маркетов');
      }
      if (allMarketsTab.classList.contains('ui-selected')) {
        germesLog('Уже выбрана вкладка всех маркетов', LogType.DEV_INFO);
      } else {
        germesLog('Переключаемся на вкладку всех маркетов', LogType.DEV_ACTION);
        allMarketsTab.click();
      }
    }
  }
};

export default preOpenBet;
