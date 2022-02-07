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

  const marketNameSelector = '.market';
  const betNameSelector = '.selection-name';
  const handicapSelector = '.selection-handicap .ui-runner-handicap';

  const marketNameElement = document.querySelector(marketNameSelector);
  const betNameElement = document.querySelector(betNameSelector);
  const handicapElement = document.querySelector(handicapSelector);

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

  if (handicapElement) {
    const handicap = text(handicapElement).replaceAll(/\s/g, '');
    if (!/^([+-]?\d+(?:\.\d+)?)$/.test(handicap)) {
      germesLog(`Непонятный формат форы: ${handicap}`, LogType.ERROR);
      return -9999;
    }
    return Number(handicap);
  }

  if (marketName === 'Draw No Bet') {
    return 0;
  }

  const parameterRegex = /([+-]?\d+(?:\.\d+)?)( Goals)?$/;
  const parameterMatch = betName.match(parameterRegex);
  if (parameterMatch) {
    return Number(parameterMatch[1]);
  }
  return -6666;
};

export default getParameter;
