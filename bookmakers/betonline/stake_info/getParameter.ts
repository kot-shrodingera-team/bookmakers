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

  // esports
  // const marketNameSelector = '.M5RJm';
  const betNameSelector = '.cHtPr';

  const context =
    window.germesData.additionalFields.bettingFrame.contentDocument;

  // const marketNameElement = context.querySelector(marketNameSelector);
  const betNameElement = context.querySelector(betNameSelector);

  // if (!marketNameElement) {
  //   germesLog('Не найден маркет ставки', LogType.ERROR);
  //   return -9999;
  // }
  if (!betNameElement) {
    germesLog('Не найдена роспись ставки', LogType.ERROR);
    return -9999;
  }

  // const marketName = text(marketNameElement);
  const betName = text(betNameElement);

  // if (marketName === 'Draw No Bet') {
  //   return 0;
  // }

  const parameterRegex = /\s([+-]?\d+(?:\.\d+)?)$/;
  const parameterMatch = betName.match(parameterRegex);
  if (parameterMatch) {
    return Number(parameterMatch[1]);
  }
  return -6666;
};

export default getParameter;
