import { germesLog, getElement, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const preOpenBet = async (): Promise<void> => {
  const context =
    window.germesData.additionalFields.bettingFrame.contentDocument;
  const betslip = await getElement('.hlq5z', 10000, context);
  if (!betslip) {
    throw new JsFailError('Не найден купон');
  }

  const betslipTab = await getElement<HTMLElement>('.M_K9V', 5000, context);
  if (!betslipTab) {
    throw new JsFailError('Не найдена вкладка купона BETSLIP');
  }

  if (betslipTab.classList.contains('CVNU8')) {
    germesLog('Уже открыта вкладка купона BETSLIP', LogType.DEV_INFO);
  } else {
    germesLog('Переключаем на вкладку купона BETSLIP', LogType.ACTION);
    betslipTab.click();
    const betslipTabActive = await getElement('.M_K9V.CVNU8', 5000, context);
    if (!betslipTabActive) {
      throw new JsFailError('Вкладка купона не переключилась на BETSLIP');
    }
    germesLog('Вкладка купона переключилась на BETSLIP', LogType.DEV_INFO);

    await getElement('.I2MdV, .g2u7Z', 5000, context); // ожидание появления какой-нибудь ставки в купоне, или пустого купона
  }
};

export default preOpenBet;
