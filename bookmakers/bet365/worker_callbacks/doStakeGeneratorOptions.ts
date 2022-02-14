import getCoefficient from '../../../src/stake_info/getCoefficient';
import getParameter from '../../../src/stake_info/getParameter';
import { germesLog, getWorkerParameter, LogType } from '../../../utils';
import { DoStakeGeneratorOptions } from '../../../utils/generators/worker_callbacks/doStakeGenerator';

const preCheck = (): boolean => {
  window.germesData.additionalFields.prevLastBet =
    document.querySelector('.mbr-OpenBetItem');
  if (getWorkerParameter('resultCoefficientTest')) {
    if (window.germesData.additionalFields.prevLastBet) {
      germesLog('Есть предыдущая ставка в истории', LogType.INFO);
    } else {
      germesLog('Нет предыдущей ставки в истории', LogType.INFO);
    }
  }
  const betslipBetCreditsCheckbox = document.querySelector<HTMLElement>(
    '.bsc-BetCreditsHeader_CheckBox, .lbs-StandardBetslip .lbc-BetCreditsHeader_CheckBox',
  );
  // .bsc-BetCreditsHeader_CheckBox.bsc-BetCreditsHeader_CheckBox-selected
  // .bsc-BetCreditsHeader_CheckBox
  if (betslipBetCreditsCheckbox) {
    germesLog('Есть бонусы', LogType.DEV_INFO);
    const betCreditsSelected =
      [...betslipBetCreditsCheckbox.classList].includes(
        'bsc-BetCreditsHeader_CheckBox-selected',
      ) ||
      [...betslipBetCreditsCheckbox.classList].includes(
        'lbc-BetCreditsHeader_CheckBox-selected',
      );
    if (getWorkerParameter('useBetBonuses')) {
      if (betCreditsSelected) {
        germesLog('Используются бонусы', LogType.INFO);
      } else {
        germesLog('Включаем использование бонусов', LogType.ACTION);
        betslipBetCreditsCheckbox.click();
      }
    } else if (betCreditsSelected) {
      germesLog('Отключаем использование бонусов', LogType.ACTION);
      betslipBetCreditsCheckbox.click();
    } else {
      germesLog('Бонусы не используются', LogType.INFO);
    }
  } else {
    germesLog('Нет бонусов', LogType.DEV_INFO);
  }

  // const acceptButton = document.querySelector(
  //   // '.lbl-AcceptButton',
  //   '.lqb-AcceptButton',
  // );
  // if (acceptButton) {
  //   germesLog('Ошибка ставки: в купоне были изменения', LogType.INFO);
  // }
  return true;
};

// const apiMethod = (): boolean => {
//   // BetSlipLocator.betSlipManager.betslip.activeModule.slip.footer.model.placeBet();
//   return true;
// };

// const postCheck = (): boolean => {
//   return true;
// };

const doStakeGeneratorOptions: DoStakeGeneratorOptions = {
  preCheck,
  doStakeButtonSelector:
    // '.bss-PlaceBetButton, .lbs-PlaceBetButton',
    '.lqb-PlaceBetButton, .lqb-AcceptButton, .bsf-PlaceBetButton, .bsf-AcceptButton',
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
  // context: () => document,
};

export default doStakeGeneratorOptions;
