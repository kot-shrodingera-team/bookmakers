import { CheckStakeEnabledGeneratorOptions } from '../../../utils/generators/stake_info/checkStakeEnabledGenerator';
import getStakeCount from '../../../src/stake_info/getStakeCount';
import { germesLog, LogType } from '../../../utils';
// import acceptChanges from '../helpers/acceptChanges';

const preCheck = (): boolean => {
  if (window.germesData.additionalFields.preparedBet) {
    if (
      [...window.germesData.additionalFields.preparedBet.classList].some(
        (className) => /_Suspended$/i.test(className),
      )
    ) {
      germesLog('Ставка недоступна', LogType.ERROR);
      return false;
    }
    return true;
  }

  // const betslipModule = document.querySelector('.bsm-BetslipStandardModule');
  // if (
  //   betslipModule &&
  //   ![...betslipModule.classList].includes('bsm-BetslipStandardModule_Expanded')
  // ) {
  //   germesLog('Купон не развёрнут', LogType.ERROR);
  //   return false;
  // }
  const suspendedStake = document.querySelector(
    // '.bss-NormalBetItem.bss-NormalBetItem_Suspended',
    '.lbs-NormalBetItem.lbs-NormalBetItem_Suspended, .bss-NormalBetItem.bss-NormalBetItem_Suspended',
  );

  if (suspendedStake) {
    germesLog('Ставка недоступна', LogType.ERROR);
    return false;
  }

  // const acceptButton = document.querySelector(
  //   // '.bs-AcceptButton, .lbl-AcceptButton',
  //   '.lqb-AcceptButton',
  // );
  // if (acceptButton) {
  //   germesLog('Принимаем изменения', LogType.ACTION);
  //   acceptChanges();
  //   return false;
  // }

  return true;
};

const checkStakeEnabledGeneratorOptions: CheckStakeEnabledGeneratorOptions = {
  preCheck,
  getStakeCount,
  // betCheck: {
  //   selector: '',
  //   errorClasses: [
  //     {
  //       className: '',
  //       message: '',
  //     },
  //   ],
  // },
  // errorsCheck: [
  //   {
  //     selector: '',
  //     message: '',
  //   },
  // ],
  // context: () => document,
};

export default checkStakeEnabledGeneratorOptions;
