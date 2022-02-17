import { germesLog, getElement, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

export const placeBetsTabSelector = 'betslip ul.tabs-container > li.POTENTIAL';
export const placeBetsTabActiveSelector =
  'betslip ul.tabs-container > li.active.POTENTIAL';

const goToPlaceBetsTab = async (): Promise<void> => {
  const placeBetsTab =
    document.querySelector<HTMLElement>(placeBetsTabSelector);
  if (!placeBetsTab) {
    throw new JsFailError('Не найдена вкладка Place Bets');
  }
  if ([...placeBetsTab.classList].includes('OPEN')) {
    germesLog('Уже открыта вкладка Place Bets', LogType.INFO);
    return;
  }
  placeBetsTab.click();
  const placeBetsTabActive = await getElement(placeBetsTabActiveSelector);
  if (!placeBetsTabActive) {
    throw new JsFailError('Не удалось переключиться на вкладку Place Bets');
  }
  germesLog('Переключились на вкладку Place Bets', LogType.INFO);
};

export default goToPlaceBetsTab;
