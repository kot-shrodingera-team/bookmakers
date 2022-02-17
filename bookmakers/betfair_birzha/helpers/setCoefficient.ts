import { fireEvent, germesLog, LogType } from '../../../utils';
import { BetProcessingError } from '../../../utils/errors';

const setCoefficient = (coefficient: number) => {
  const coefficientInput = document.querySelector<HTMLInputElement>(
    'input[ng-model="$ctrl.price"]',
  );
  if (!coefficientInput) {
    throw new BetProcessingError('Не найдено поле ввода коэффициента');
  }
  germesLog(
    `Устанавливаем коэффициент в купоне ${coefficient}`,
    LogType.DEV_ACTION,
  );
  coefficientInput.value = String(coefficient);
  fireEvent(coefficientInput, 'input');
};

export default setCoefficient;
