import getCoefficient from '../../../src/stake_info/getCoefficient';
import getParameter from '../../../src/stake_info/getParameter';
import setStakeSum from '../../../src/worker_callbacks/setStakeSum';
import { germesLog, LogType } from '../../../utils';
import { DoStakeGeneratorOptions } from '../../../utils/generators/worker_callbacks/doStakeGenerator';
import openBet from '../show_stake/openBet';

const preCheck = async (): Promise<boolean> => {
  const acceptButton = document.querySelector('.TaqDP');
  if (acceptButton) {
    germesLog('Есть кнопка принятия изменений', LogType.INFO);
    germesLog('Переоткрываем купон', LogType.ACTION);
    try {
      await openBet();
      await setStakeSum();
    } catch (error) {
      germesLog(`Ошибка переоткрытия ставки:\n${error.message}`, LogType.ERROR);
    }
  }
  return true;
};

// const apiMethod = (): boolean => {
//   return true;
// };

// const postCheck = (): boolean => {
//   return true;
// };

const doStakeGeneratorOptions: DoStakeGeneratorOptions = {
  preCheck,
  doStakeButtonSelector: '.Kx2Ob', // esports
  // apiMethod,
  // errorClasses: [
  //   {
  //     className: '',
  //     message: '',
  //   },
  // ],
  // disabledCheck: false,
  getCoefficient,
  getParameter,
  // postCheck,
  context: () =>
    window.germesData.additionalFields.bettingFrame.contentDocument,
};

export default doStakeGeneratorOptions;
