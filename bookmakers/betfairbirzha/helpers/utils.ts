import { germesLog, getElement, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

export const openBetsTabSelector = 'betslip ul.tabs-container > li.OPEN';
export const openBetsTabActiveSelector =
  'betslip ul.tabs-container > li.active.OPEN';
export const placeBetsTabSelector = 'betslip ul.tabs-container > li.POTENTIAL';
export const placeBetsTabActiveSelector =
  'betslip ul.tabs-container > li.active.POTENTIAL';

export const getActiveTab = (): string => {
  const activeTab = document.querySelector(
    'betslip ul.tabs-container > li.active',
  );
  if (!activeTab) {
    throw new JsFailError('Не найдена активная вкладка');
  }
  if ([...activeTab.classList].includes('OPEN')) {
    return 'open';
  }
  if ([...activeTab.classList].includes('POTENTIAL')) {
    return 'place';
  }
  throw new JsFailError('Не удалось определить активную влкадку купона');
};

export const goToOpenBetsTab = async (): Promise<void> => {
  const openBetsTab = document.querySelector<HTMLElement>(openBetsTabSelector);
  if (!openBetsTab) {
    throw new JsFailError('Не найдена вкладка Open Bets');
  }
  if ([...openBetsTab.classList].includes('OPEN')) {
    germesLog('Уже открыта вкладка Open Bets', LogType.INFO);
    return;
  }
  openBetsTab.click();
  const openBetsTabActive = await getElement(openBetsTabActiveSelector);
  if (!openBetsTabActive) {
    throw new JsFailError('Не удалось переключиться на вкладку Open Bets');
  }
};

export const goToPlaceBetsTab = async (): Promise<void> => {
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
};
