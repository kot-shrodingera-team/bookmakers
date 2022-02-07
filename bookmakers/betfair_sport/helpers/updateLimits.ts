import doStake from '../../../src/worker_callbacks/doStake';
import setStakeSum, {
  clearStakeSum,
} from '../../../src/worker_callbacks/setStakeSum';
import { getElement, text } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const updateLimits = async () => {
  setStakeSum(0, false, true);
  doStake();
  const minStakeElement = await getElement('.set-min-stake');
  if (!minStakeElement) {
    throw new JsFailError('Не появилась минимальная ставка');
  }
  const maxStakeElement = await getElement('.set-max-stake');
  if (!maxStakeElement) {
    throw new JsFailError('Не появилась максимальная ставка');
  }
  const minStake = text(minStakeElement);
  const maxStake = text(maxStakeElement);

  const minStakeRegex = /^min: .(\d+\.\d+)$/;
  const maxStakeRegex = /^max: .(\d+\.\d+)$/;

  const minStakeMatch = minStake.match(minStakeRegex);
  const maxStakeMatch = maxStake.match(maxStakeRegex);

  if (!minStakeMatch) {
    throw new JsFailError(
      `Непонятный формат минимальной ставки: "${minStake}"`,
    );
  }
  if (!maxStakeMatch) {
    throw new JsFailError(
      `Непонятный формат максимальной ставки: "${maxStake}"`,
    );
  }

  window.germesData.minimumStake = Number(minStakeMatch[1]);
  window.germesData.maximumStake = Number(maxStakeMatch[1]);
  clearStakeSum();
};

export default updateLimits;
