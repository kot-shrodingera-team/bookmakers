// import getCurrentSum from '../../../src/stake_info/getCurrentSum';
import { fireEvent, germesLog, LogType } from '../../../utils';
import { SetStakeSumGeneratorOptions } from '../../../utils/generators/worker_callbacks/setStakeSumGenerator';
// import openPreparedBet from '../helpers/openPreparedBet';
import { sumInputSelector } from '../stake_info/getCurrentSumGeneratorOptions';

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const preCheck = async (sum: number): Promise<boolean> => {
//   if (window.germesData.additionalFields.openningPreparedBet) {
//     germesLog('Открываем подготовленную ставку', LogType.PROGRESS);
//     return false;
//   }
//   if (window.germesData.additionalFields.preparedBet) {
//     germesLog('Открываем подготовленную ставку', LogType.ACTION);
//     window.germesData.additionalFields.openningPreparedBet = true;
//     openPreparedBet()
//       .finally(() => {
//         window.germesData.additionalFields.openningPreparedBet = false;
//       })
//       .then(
//         () => {
//           germesLog('Подготовленная ставка открыта', LogType.SUCCESS);
//           window.germesData.additionalFields.preparedBet = undefined;
//         },
//         (error) => {
//           germesLog('Ошибка открытия подготовленной ставки', LogType.FATAL);
//           germesLog(error.message, LogType.FATAL);
//           window.germesData.stakeDisabled = true;
//         },
//       );

//     return false;
//   }
//   return true;
// };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setStake = (sum: number): boolean => {
  try {
    const { slip } = window.BetSlipLocator.betSlipManager.betslip.activeModule;
    let bet;
    if ('bet' in slip && slip.bet) {
      bet = slip.bet;
    } else if ('bets' in slip && slip.bets && slip.bets[0]) {
      [bet] = slip.bets;
    } else {
      throw new Error('Не найдена функция ввода суммы ставки');
    }
    const stakeInput = bet.stakeBox.stakeValueInputElement;
    fireEvent(stakeInput, 'focus', FocusEvent);
    bet.stakeBox.setStake(String(sum));
    return true;
  } catch (e) {
    germesLog(`Ошибка ввода суммы ставки:\n${e.message}`, LogType.ERROR);
    return false;
  }
};

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const preInputCheck = (sum: number): boolean => {
//   return true;
// };

const setStakeSumGeneratorOptions: SetStakeSumGeneratorOptions = {
  // preCheck,
  function: setStake,
  sumInputSelector,
  // alreadySetCheck: {
  //   getCurrentSum,
  //   falseOnSumChange: false,
  // },
  // preInputCheck,
  // inputType: 'fireEvent' as 'fireEvent' | 'react' | 'nativeInput',
  // fireEventNames: ['input'],
  // context: () => document,
};

export default setStakeSumGeneratorOptions;
