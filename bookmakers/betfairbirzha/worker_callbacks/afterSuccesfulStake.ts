// import getStakeInfoValueGenerator, {
//   StakeInfoValueOptions,
// } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';
import getCoefficient from '../../../src/stake_info/getCoefficient';
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

const getResultCoefficient = getCoefficient;

const afterSuccesfulStake = (): void => {
  if (getWorkerParameter('fakeDoStake')) {
    return;
  }
  germesLog('Обновление итогового коэффициента', LogType.INFO);
  const resultCoefficient = getResultCoefficient();
  if (resultCoefficient !== worker.StakeInfo.Coef) {
    germesLog(
      `Коеффициент изменился: ${worker.StakeInfo.Coef} => ${resultCoefficient}`,
      LogType.ACTION,
    );
    worker.StakeInfo.Coef = resultCoefficient;
    return;
  }
  germesLog('Коеффициент не изменился', LogType.INFO);
};

export default afterSuccesfulStake;
