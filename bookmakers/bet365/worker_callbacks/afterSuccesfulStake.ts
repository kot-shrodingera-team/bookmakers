// import getStakeInfoValueGenerator, {
//   StakeInfoValueOptions,
// } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';
import clearCoupon from '../../../src/show_stake/clearCoupon';
// import getCoefficient from '../../../src/stake_info/getCoefficient';
import { getWorkerParameter, germesLog, LogType } from '../../../utils';

// // const getResultCoefficientText = (): string => {
// //   return null;
// // };

// export const resultCoefficientSelector = '';

// const resultCoefficientOptions: StakeInfoValueOptions = {
//   name: 'coefficient',
//   // fixedValue: () => 0,
//   valueFromText: {
//     text: {
//       // getText: getResultCoefficientText,
//       selector: resultCoefficientSelector,
//       context: () => document,
//     },
//     replaceDataArray: [
//       {
//         searchValue: '',
//         replaceValue: '',
//       },
//     ],
//     removeRegex: /[\s,']/g,
//     matchRegex: /(\d+(?:\.\d+)?)/,
//     errorValue: 0,
//   },
//   zeroValues: [],
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   modifyValue: (value: number, extractType: string) => value,
//   disableLog: false,
// };

// const getResultCoefficient = getStakeInfoValueGenerator(
//   resultCoefficientOptions
// );

// const getResultCoefficient = getCoefficient;

const afterSuccesfulStake = (): void => {
  if (getWorkerParameter('fakeDoStake')) {
    return;
  }

  if (getWorkerParameter('resultCoefficientTest')) {
    // germesLog('Обновление итогового коэффициента', 'steelblue');
    const { resultCoefficient } = window.germesData.additionalFields;
    if (resultCoefficient && resultCoefficient !== worker.StakeInfo.Coef) {
      germesLog(
        `Коеффициент изменился: ${worker.StakeInfo.Coef} => ${resultCoefficient}`,
        LogType.ACTION,
      );
      worker.StakeInfo.Coef = resultCoefficient;
      return;
    }
    germesLog('Коеффициент не изменился', LogType.INFO);
    if (getWorkerParameter('clearAfterBetPlaced')) {
      clearCoupon();
    }
    // if (getWorkerParameter('sendBetRef')) {
    //   const betReferenceElement = document.querySelector(
    //     '.bss-ReceiptContent_BetRef, .lbs-ReceiptContent_BetRef'
    //   );
    //   if (!betReferenceElement) {
    //     germesLog('Не найден Bet Reference', LogType.ERROR);
    //     return;
    //   }
    //   const bodyData = toFormData({
    //     bot_api: worker.ApiKey,
    //     fork_id: worker.ForkId,
    //     bet365_bet_id: betReferenceElement.textContent
    //       .replace('Bet Ref', '')
    //       .trim(),
    //   });
    //   fetch('https://strike.ws/bet_365_bet_ids_to_our_server.php', {
    //     method: 'POST',
    //     body: bodyData,
    //   });
    // }
  }
};

export default afterSuccesfulStake;
