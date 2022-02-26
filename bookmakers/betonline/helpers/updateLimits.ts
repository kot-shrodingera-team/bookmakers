import getCurrentSum from '../../../src/stake_info/getCurrentSum';
import { clearStakeSum } from '../../../src/worker_callbacks/setStakeSum';
import { getElement, awaiter } from '../../../utils';
import { JsFailError } from '../../../utils/errors';
import { sumInputSelector } from '../stake_info/getCurrentSumGeneratorOptions';

const updateLimits = async (): Promise<void> => {
  const context =
    window.germesData.additionalFields.bettingFrame.contentDocument;

  const maxBetButton = await getElement<HTMLElement>('._lxlf', 5000, context);
  if (!maxBetButton) {
    throw new JsFailError('Не найдена кнопка получения максимальной ставки');
  }

  const sumInput = await getElement<HTMLInputElement>(
    sumInputSelector,
    5000,
    context,
  );
  if (!sumInput) {
    throw new JsFailError('Не найдено поле ввода суммы ставки');
  }

  // log(`Дождались кнопку "Максимальная ставка"`, 'orange');
  maxBetButton.click();

  const maxSumAppeared = await awaiter(
    () => sumInput.value !== '' && Number(sumInput.value) !== 0,
  );

  if (!maxSumAppeared) {
    throw new JsFailError('Максимальная сумма не появилась в поле ввода');
  }

  window.germesData.maximumStake = getCurrentSum();

  clearStakeSum();
};

export default updateLimits;
