import clearCoupon from '../../../src/show_stake/clearCoupon';
import { germesLog, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';
import goToMarket from '../helpers/goToMarket';
import goToPlaceBetsTab from '../helpers/goToPlaceBetsTab';

const openEvent = async (): Promise<void> => {
  const betslip = document.querySelector('betslip');
  if (betslip) {
    germesLog('Открыта страница с купоном', LogType.INFO);
    await goToPlaceBetsTab();

    /* ====================================================================== */
    /*                             Очистка купона                             */
    /* ====================================================================== */

    const couponCleared = await clearCoupon();
    if (!couponCleared) {
      throw new JsFailError('Не удалось очистить купон');
    }
  }

  const market = document.querySelector('.MARKET.selected');
  if (
    market &&
    market.getAttribute('link-id') === JSON.parse(worker.BetId).market_id
  ) {
    germesLog('Уже открыт нужный маркет', LogType.DEV_INFO);
  } else {
    await goToMarket();
  }
};

export default openEvent;
