import {
  getWorkerParameter,
  germesLog,
  LogType,
  text,
  ri,
} from '../../../utils';
import getSiteTeamNames from '../helpers/getSiteTeamNames';

const parseParameter = (parameter: string): number => {
  const singleParameterRegex = /^[+-]?\d+(?:\.\d+)?$/;
  const doubleParameterRegex = /^([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?)$/;
  const doubleParameterMatch = parameter.match(doubleParameterRegex);
  if (doubleParameterMatch) {
    const firstParameter = Number(doubleParameterMatch[1]);
    const secondParameter = Number(doubleParameterMatch[2]);
    return (firstParameter + secondParameter) / 2;
  }
  if (singleParameterRegex.test(parameter)) {
    return Number(parameter);
  }
  return null;
};

const getHandicapScoreOffset = (score: string, player: 1 | 2): number => {
  const match = score.match(/\((\d+)-(\d+)\)/);
  if (!match) {
    // log(`Не удалось распаристь счёт: "${score}"`, 'crimson');
    return null;
  }
  const left = Number(match[1]);
  const right = Number(match[2]);
  return player === 1 ? right - left : left - right;
};

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

  if (window.germesData.additionalFields.preparedBet) {
    const parameter = Number(JSON.parse(worker.ForkObj).param);
    if (Number.isNaN(parameter)) {
      return -6666;
    }
    return parameter;
  }

  const marketNameSelector =
    // '.bss-NormalBetItem_Market, .lbs-NormalBetItem_Market';
    '.lqb-NormalBetItem_Market, .bss-NormalBetItem_Market';
  const betNameSelector =
    // '.bss-NormalBetItem_Title, .lbs-NormalBetItem_Title';
    '.lqb-NormalBetItem_Title, .bss-NormalBetItem_Title';

  const marketNameElement = document.querySelector(marketNameSelector);
  const betNameElement = document.querySelector(betNameSelector);
  const betHandicapSelector =
    // '.bss-NormalBetItem_Handicap, .lbs-NormalBetItem_Handicap';
    '.lqb-NormalBetItem_Handicap, .bss-NormalBetItem_Handicap';

  if (!marketNameElement) {
    germesLog('Не найден маркет ставки', LogType.ERROR);
    return -9999;
  }
  if (!betNameElement) {
    germesLog('Не найдена роспись ставки', LogType.ERROR);
    return -9999;
  }

  const marketName = text(marketNameElement);
  let betName = text(betNameElement);

  if (/^(Draw No Bet)$/i.test(marketName)) {
    return 0;
  }

  const betslipHandicapElement = document.querySelector(betHandicapSelector);

  if (betslipHandicapElement) {
    // germesLog('Есть отдельный элемент параметра', LogType.DEV_INFO);
    const betslipHandicap = text(betslipHandicapElement);
    if (
      betslipHandicap &&
      betName.endsWith(betslipHandicap) &&
      !betName.endsWith(` ${betslipHandicap}`)
    ) {
      betName = betName.replace(betslipHandicap, ` ${betslipHandicap}`);
    }
  }

  const { market, bet_type: betType }: { market: string; bet_type: string } =
    JSON.parse(worker.ForkObj);
  let handicapOffset = 0;
  if (
    (worker.SportId === 1 || worker.SportId === 139) &&
    (market === 'F' ||
      (betType.includes('HANDICAP') && !betType.includes('3W')))
  ) {
    germesLog('Фора от счёта', LogType.INFO);
    const teamNames = getSiteTeamNames();
    const teamRegex = ri`${teamNames.teamOne}|${teamNames.teamTwo}`;
    const gameScoreRegex = /\(\d+-\d+\)/;
    const betslipHandicapRegex = ri`^(${gameScoreRegex}) (${teamRegex}) ([+-]?\d+\.\d+(?:,\d+\.\d)?)$`;
    const betslipMatch = betName.match(betslipHandicapRegex);
    if (!betslipMatch) {
      germesLog('В купоне неподходящая роспись', LogType.ERROR);
      return -9999;
    }
    const handicapPlayer = ri`${betslipMatch[2]}`.test(teamNames.teamOne)
      ? 1
      : 2;
    handicapOffset = getHandicapScoreOffset(betslipMatch[1], handicapPlayer);
  }

  if (betslipHandicapElement) {
    const betslipHandicap = betslipHandicapElement.textContent.trim();

    if (betslipHandicap === '') {
      germesLog('Отдельный элемент параметра пуст', LogType.DEV_INFO);
    } else {
      const result = parseParameter(betslipHandicap);
      if (result === null) {
        germesLog(
          `Не удалось определить параметр ставки: "${betslipHandicap}"`,
          LogType.ERROR,
        );
        return -9999;
      }
      return result + handicapOffset;
    }
  }

  // A to win game 1
  // Over 6.5 games in set 1
  const parameterRegex = /.*(?<!set|game) ([-+]?\d+(?:\.\d+)?)(?=\s|$)/i;

  const betslipParameterMatch = betName.match(parameterRegex);
  if (betslipParameterMatch) {
    return parseParameter(betslipParameterMatch[1]);
  }
  const scoreRegex = /.* (\d+)-(\d+)$/i;
  const scoreMatch = betName.match(scoreRegex);
  if (scoreMatch) {
    const leftScore = Number(scoreMatch[1]);
    const rightScore = Number(scoreMatch[2]);
    const digitsCount = Math.ceil(Math.log10(rightScore + 1));
    const result = Number(leftScore + rightScore / 10 ** digitsCount);
    return result;
  }
  return -6666;
};

export default getParameter;
