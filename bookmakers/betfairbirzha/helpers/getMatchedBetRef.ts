import { text } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const getMatchedBetRef = (): number => {
  const refIdElement = document.querySelector(
    '.bet-placed-information__reference',
  );
  if (!refIdElement) {
    throw new JsFailError('Не найден RefId принятой ставки');
  }
  const refIdMatch = refIdElement.textContent.trim().match(/^Ref: (\d+)$/i);
  if (!refIdMatch) {
    throw new JsFailError(`RefId в непонятном формате: ${text(refIdElement)}`);
  }
  return Number(refIdMatch[1]);
};

export default getMatchedBetRef;
