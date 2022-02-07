import getCoefficient from '../../../src/stake_info/getCoefficient';
import { germesLog, LogType } from '../../../utils';
import { DoStakeGeneratorOptions } from '../../../utils/generators/worker_callbacks/doStakeGenerator';

// const preCheck = (): boolean => {
//   return true;
// };

// const apiMethod = (): boolean => {
//   return true;
// };

const postCheck = (): boolean => {
  const doStakeButton = document.querySelector(
    '[on-click="$ctrl.onPlaceBetsClick()"] button[type="submit"]',
  );
  if (!doStakeButton) {
    germesLog('Не найдена кнопка ставки', LogType.ERROR);
    return false;
  }
  if (doStakeButton.getAttribute('disabled')) {
    germesLog('Кнопка ставки недоступна', LogType.ERROR);
    return false;
  }
  return true;
};

const doStakeGeneratorOptions: DoStakeGeneratorOptions = {
  // preCheck,
  doStakeButtonSelector:
    '[on-click="$ctrl.onPlaceBetsClick()"] button[type="submit"]',
  // apiMethod,
  // errorClasses: [
  //   {
  //     className: '',
  //     message: '',
  //   },
  // ],
  disabledCheck: false,
  getCoefficient,
  postCheck,
  // context: () => document,
};

export default doStakeGeneratorOptions;
