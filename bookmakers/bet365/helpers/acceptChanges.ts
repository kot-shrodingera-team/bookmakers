import { JsFailError } from '../../../utils/errors';

const acceptChanges = (): void => {
  const acceptButton = document.querySelector(
    // '.bs-AcceptButton, .lbl-AcceptButton',
    '.lbq-AcceptButton, .bsf-AcceptButton',
  );
  if (acceptButton) {
    try {
      window.BetSlipLocator.betSlipManager.betslip.activeModule.slip.footer.model.acceptChanges();
    } catch (e) {
      throw new JsFailError(`Ошибка принятия изменений:\n${e.message}`);
    }
  }
};

export default acceptChanges;
