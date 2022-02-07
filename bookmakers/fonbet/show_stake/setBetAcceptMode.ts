import { germesLog, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const setBetAcceptMode = async (): Promise<void> => {
  const set = window.app.headerApi.settings();
  if (worker.StakeAcceptRuleShoulder === 0) {
    germesLog(
      'Устанавливаем режим принятия ставок только с текущим коэффициентом',
      LogType.ACTION,
    );
    set.takeUpBets = false;
    set.takeChangedBets = false;
  } else if (worker.StakeAcceptRuleShoulder === 1) {
    germesLog(
      'Устанавливаем режим принятия ставок с повышением коэффициента',
      LogType.ACTION,
    );
    set.takeUpBets = true;
    set.takeChangedBets = false;
  } else if (worker.StakeAcceptRuleShoulder === 2) {
    germesLog(
      'Устанавливаем режим принятия ставок с любым изменением коэффициента',
      LogType.ACTION,
    );
    set.takeUpBets = true;
    set.takeChangedBets = true;
  }
  try {
    window.app.settingsApply(set, 'takeUpBets');
  } catch {
    throw new JsFailError('Ошибка установки режима принятия ставок');
  }
  try {
    window.app.settingsApply(set, 'takeChangedBets');
  } catch {
    throw new JsFailError('Ошибка установки режима принятия ставок');
  }
};

export default setBetAcceptMode;
