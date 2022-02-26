import { germesLog, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const setBetAcceptMode = async (): Promise<void> => {
  // esports
  const context =
    window.germesData.additionalFields.bettingFrame.contentDocument;

  const acceptAnyOdds =
    context.querySelector<HTMLInputElement>('#accept-any-odds');
  if (!acceptAnyOdds) {
    throw new JsFailError(
      'Не найден чекбокс принятия с любыми изменениями коэффициента',
    );
  }

  const acceptBetterOdds = context.querySelector<HTMLInputElement>(
    '#accept-better-odds',
  );
  if (!acceptBetterOdds) {
    throw new JsFailError(
      'Не найден чекбокс принятия только с повышением коэффициента',
    );
  }

  if (acceptAnyOdds.checked && acceptBetterOdds.checked) {
    throw new JsFailError('Выбраны оба режима принятия ставок');
  }

  if (worker.StakeAcceptRuleShoulder === 0) {
    if (!acceptAnyOdds.checked && !acceptBetterOdds.checked) {
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
    if (acceptAnyOdds.checked) {
      acceptAnyOdds.click();
    } else {
      acceptBetterOdds.click();
    }
  } else if (worker.StakeAcceptRuleShoulder === 1) {
    if (!acceptAnyOdds.checked && acceptBetterOdds.checked) {
      germesLog(
        'Уже выбран режим принятия ставок только с повышением коэффициента',
        LogType.INFO,
      );
      return;
    }
    germesLog(
      'Включаем режим принятия ставок только с повышением коэффициента',
      LogType.ACTION,
    );
    acceptBetterOdds.click();
  } else if (worker.StakeAcceptRuleShoulder === 2) {
    if (acceptAnyOdds.checked && !acceptBetterOdds.checked) {
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
    acceptAnyOdds.click();
  } else {
    throw new JsFailError('Неизвестный режим принятия ставок. Обратитесь в ТП');
  }
};

export default setBetAcceptMode;
