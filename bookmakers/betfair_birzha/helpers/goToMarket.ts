import getStakeCount from '../../../src/stake_info/getStakeCount';
import { awaiter, germesLog, getElement, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';
import { openBetsTabActiveSelector } from './goToOpenBetsTab';

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
  const marketChanged = await awaiter(() => {
    const market = document.querySelector('.MARKET.selected');
    if (!market) {
      return false;
    }
    return (
      market.getAttribute('link-id') === JSON.parse(worker.BetId).market_id
    );
  });
  if (!marketChanged) {
    throw new JsFailError('Не удалось перейти на маркет');
  }
  germesLog('Перешли на маркет', LogType.DEV_INFO);
  await Promise.race([
    getElement(openBetsTabActiveSelector),
    awaiter(() => getStakeCount() !== 0),
  ]);
  const openBetsTabActive = document.querySelector(openBetsTabActiveSelector);
  const stakeCount = getStakeCount();

  if (stakeCount !== 0) {
    germesLog(`Есть ставки в купоне (${stakeCount})`, LogType.DEV_INFO);
  } else if (openBetsTabActive) {
    germesLog('Открылась вклада Open Bets', LogType.DEV_INFO);
  } else {
    throw new JsFailError(
      'Не удалось перейти на новый маркет (не открылась вкладка Open Bets, не появились ставки в купоне)',
    );
  }
};

export default goToMarket;
