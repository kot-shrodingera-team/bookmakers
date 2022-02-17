import { getWorkerParameter, germesLog, LogType, text } from '../../../utils';

const getParameter = (): number => {
  if (
    getWorkerParameter('fakeParameter') ||
    getWorkerParameter('fakeOpenStake')
  ) {
    const parameter = Number(JSON.parse(worker.ForkObj).param);
    if (Number.isNaN(parameter)) {
      return -6666;
    }
    return parameter;
  }

  const marketNameSelector = '.MARKET.selected';
  const betNameSelector = '.betslip__editable-bet__runner';

  const marketNameElement = document.querySelector(marketNameSelector);
  const betNameElement = document.querySelector(betNameSelector);

  if (!marketNameElement) {
    germesLog('Не найден маркет ставки', LogType.ERROR);
    return -9999;
  }
  if (!betNameElement) {
    germesLog('Не найдена роспись ставки', LogType.ERROR);
    return -9999;
  }

  const marketName = text(marketNameElement);
  const betName = text(betNameElement);

  if (marketName === 'Draw no Bet') {
    return 0;
  }

  let parameter = -6666;

  const doubleParameterRegex = /([+-]?\d+(?:\.\d+)?) & ([+-]?\d+(?:\.\d+)?)$/;
  const doubleParameterMatch = betName.match(doubleParameterRegex);
  const singleParameterRegex = /([+-]?\d+(?:\.\d+)?)(?: Goals)?$/;
  const singleParameterMatch = betName.match(singleParameterRegex);

  if (doubleParameterMatch) {
    parameter =
      (Number(doubleParameterMatch[1]) + Number(doubleParameterMatch[2])) / 2;
  } else if (singleParameterMatch) {
    parameter = Number(singleParameterMatch[1]);
  }

  if (
    parameter !== -6666 &&
    /handicap/i.test(marketName) &&
    window.germesData.additionalFields.isLay
  ) {
    return -parameter;
  }

  return parameter;
};

export default getParameter;
