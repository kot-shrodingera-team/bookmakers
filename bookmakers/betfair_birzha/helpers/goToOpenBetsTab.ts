import { germesLog, LogType, getElement } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

export const openBetsTabSelector = 'betslip ul.tabs-container > li.OPEN';
export const openBetsTabActiveSelector =
  'betslip ul.tabs-container > li.active.OPEN';

const goToOpenBetsTab = async (): Promise<void> => {
  const openBetsTab = document.querySelector<HTMLElement>(openBetsTabSelector);
  if (!openBetsTab) {
    throw new JsFailError('Не найдена вкладка Open Bets');
  }
  if ([...openBetsTab.classList].includes('active')) {
    germesLog('Уже открыта вкладка Open Bets', LogType.INFO);
    return;
  }
  openBetsTab.click();
  const openBetsTabActive = await getElement(openBetsTabActiveSelector);
  if (!openBetsTabActive) {
    throw new JsFailError('Не удалось переключиться на вкладку Open Bets');
  }
  germesLog('Переключились на вкладку Open Bets', LogType.INFO);
};

export default goToOpenBetsTab;
