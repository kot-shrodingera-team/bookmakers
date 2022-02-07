import { germesLog, getElement, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';
import { openBetsTabActiveSelector } from './utils';

const goToMarket = async (): Promise<void> => {
  if (!window.germesData.additionalFields.marketLink) {
    window.germesData.additionalFields.marketLink = document.createElement('a');
    const body = document.querySelector('body');
    body.insertAdjacentElement(
      'afterbegin',
      window.germesData.additionalFields.marketLink,
    );
  }
  window.germesData.additionalFields.marketLink.href = worker.EventUrl;
  germesLog('Переходим на маркет', LogType.INFO);
  window.germesData.additionalFields.marketLink.click();
  const openBetsTabActive = await getElement(openBetsTabActiveSelector);
  if (!openBetsTabActive) {
    throw new JsFailError(
      'Не удалось перейти на новый маркет (не открылась вкладка Open Bets)',
    );
  }
  germesLog('Перешли на маркет', LogType.DEV_INFO);
};

export default goToMarket;
