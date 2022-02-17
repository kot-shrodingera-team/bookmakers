import { germesLog, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

export const viewOpenBetsButtonSelector =
  '[on-click="$ctrl.onViewOpenBets()"] button';

const viewOpenBets = async (): Promise<void> => {
  const viewOpenBetsButton = document.querySelector<HTMLElement>(
    viewOpenBetsButtonSelector,
  );
  if (!viewOpenBetsButton) {
    throw new JsFailError('Не найдена кнопка View Open Bets');
  }
  germesLog('Нажимаем кнопку View Open Bets', LogType.ACTION);
  viewOpenBetsButton.click();
};

export default viewOpenBets;
