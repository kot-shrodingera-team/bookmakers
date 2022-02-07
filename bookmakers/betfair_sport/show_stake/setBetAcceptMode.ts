import { germesLog, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const setBetAcceptMode = async (): Promise<void> => {
  const betAcceptanceBox = document.querySelector<HTMLElement>(
    '.bet-acceptance-box .com-toggler',
  );
  if (!betAcceptanceBox) {
    throw new JsFailError('Не найден переключатель режима принятия ставок');
  }
  if (worker.StakeAcceptRuleShoulder === 0) {
    if (betAcceptanceBox.classList.contains('selected')) {
      germesLog(
        'Уже выбран режим принятия ставок только с текущим коэффициентом',
        LogType.INFO,
      );
      return;
    }
    germesLog(
      'Включаем режим принятия ставок только с текущим коэффициентом',
      LogType.ACTION,
    );
    betAcceptanceBox.click();
  } else if (worker.StakeAcceptRuleShoulder === 1) {
    throw new JsFailError(
      'В Betfair нет режима принятия ставок только с повышением коэффициента',
    );
  } else if (worker.StakeAcceptRuleShoulder === 2) {
    if (!betAcceptanceBox.classList.contains('selected')) {
      germesLog(
        'Уже выбран режим принятия ставок с любым изменением коэффициента',
        LogType.INFO,
      );
      return;
    }
    germesLog(
      'Включаем режим принятия ставок с любым изменением коэффициента',
      LogType.ACTION,
    );
    betAcceptanceBox.click();
  } else {
    throw new JsFailError('Неизвестный режим принятия ставок. Обратитесь в ТП');
  }
};

export default setBetAcceptMode;
