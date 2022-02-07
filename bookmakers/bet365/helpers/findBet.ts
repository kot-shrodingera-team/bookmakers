import { germesLog, LogType, text } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const findBet = (
  gameId: string,
  marketId: string,
  betParameter: string,
): HTMLElement => {
  const marketBets = [
    ...document.querySelectorAll<HTMLElement>(
      `#allBetsTable[data-gameid="${gameId}"] > .bet_group_col span[data-type="${Number(
        marketId,
      )}"]`,
    ),
  ];
  if (marketBets.length === 0) {
    throw new JsFailError('Не найдены ставки по нужному маркету');
  }
  germesLog(
    `По нужному маркету найдено ставок: ${marketBets.length}`,
    LogType.DEV_INFO,
  );
  if (betParameter === 'null') {
    if (marketBets.length > 1) {
      throw new JsFailError(
        'Найдено больше одной ставки по данному маркету (без параметра)',
      );
    }
    return marketBets[0];
  }
  const filteredBets = marketBets.filter((bet) => {
    return text(bet).includes(betParameter);
  });
  if (filteredBets.length === 0) {
    throw new JsFailError(
      'Не найдены ставки по нужному маркету с нужным параметром',
    );
  }
  if (filteredBets.length > 1) {
    throw new JsFailError('Найдено больше одной ставки с данным параметром');
  }
  germesLog('Нужная ставка найдена', LogType.INFO);
  return filteredBets[0];
};

export default findBet;
