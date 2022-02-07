import clearCoupon from '../../../src/show_stake/clearCoupon';
import { germesLog, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';
import goToMarket from '../helpers/goToMarket';
import { goToPlaceBetsTab } from '../helpers/utils';

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
  if (window.location.href !== worker.EventUrl) {
    await goToMarket();
  }
};

export default openEvent;
