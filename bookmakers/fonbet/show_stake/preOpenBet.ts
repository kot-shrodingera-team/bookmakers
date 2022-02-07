import { germesLog, getElement, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const preOpenBet = async (): Promise<void> => {
  const wideCouponButton = document.querySelector<HTMLElement>(
    '[title="Широкая лента купонов"]',
  );
  if (wideCouponButton) {
    germesLog('Включена узкая лента купонов', LogType.DEV_INFO);
    germesLog('Переключаем на широкую лентку купонов', LogType.DEV_ACTION);
    wideCouponButton.click();
    const narrowCouponButton = await getElement(
      '[title="Узкая лента купонов"]',
    );
    if (!narrowCouponButton) {
      throw new JsFailError(
        'Не удалось переключиться на широкую ленту купонов',
      );
    }
    germesLog('Переключились на широкую ленту купонов', LogType.DEV_INFO);
  } else {
    const narrowCouponButton = await getElement(
      '[title="Узкая лента купонов"]',
    );
    if (!narrowCouponButton) {
      throw new JsFailError('Ошибка определения широкой/узкой ленты купонов');
    }
    germesLog('Включена широкая лента купонов', LogType.DEV_INFO);
  }
};

export default preOpenBet;
