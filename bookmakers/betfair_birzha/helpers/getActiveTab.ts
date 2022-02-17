import { JsFailError } from '../../../utils/errors';

export const activeTabSelector = 'betslip ul.tabs-container > li.active';

const getActiveTab = (): string => {
  const activeTab = document.querySelector(activeTabSelector);
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

export default getActiveTab;
