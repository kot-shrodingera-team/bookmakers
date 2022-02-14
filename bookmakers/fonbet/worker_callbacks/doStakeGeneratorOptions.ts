import getCoefficient from '../../../src/stake_info/getCoefficient';
import getParameter from '../../../src/stake_info/getParameter';
import { germesLog, LogType, text } from '../../../utils';
import { DoStakeGeneratorOptions } from '../../../utils/generators/worker_callbacks/doStakeGenerator';
import preBetCheck from '../helpers/preBetCheck';

const preCheck = (): boolean => {
  if (!preBetCheck()) {
    return false;
  }

  // В заголовке купона может быть ID и время ставки, а может быть и текст "Пари не принято"
  // С последним вариантом могут быть проблемы, в частности, если уже был не принятый купон, и новый тоже не принимается
  // То есть текст не поменяется, соответственно просто по изменению заголовка купона нельзя судить о принятии купона
  // Один из вариантов - смотреть, если последние n купонов "Пари не принято", то запоминать их количество и от этого уже плясать

  const currentBetElement = document.querySelector(
    '[class*="stake-wide"], [class*="stake-narrow"]',
  );
  if (!currentBetElement) {
    germesLog('Не найдена текущая ставка', LogType.ERROR);
    return false;
  }
  const currentBetColumn2 =
    currentBetElement.querySelector('[class*="column2"]');
  if (!currentBetColumn2) {
    germesLog(
      'Не найдена вторая колонка текущей ставки (название события)',
      LogType.ERROR,
    );
    return false;
  }

  const { currentBet } = window.germesData.additionalFields;

  currentBet.eventName = (() => {
    const wholeEventName = text(currentBetColumn2);
    const betScore = currentBetColumn2.querySelector('[class*="bet-score"]');
    if (!betScore) {
      return wholeEventName;
    }
    return wholeEventName.replace(text(betScore), '').trim();
  })();
  const currentBetColumn3 =
    currentBetElement.querySelector('[class*="column3"]');
  if (!currentBetColumn3) {
    germesLog(
      'Не найдена третья колонка текущей ставки (исход)',
      LogType.ERROR,
    );
    return false;
  }
  currentBet.betName = text(currentBetColumn3);

  const lastCoupons = [
    ...document.querySelectorAll(
      '[class*="coupon-list"] article[class*="coupon"]',
    ),
  ];
  if (lastCoupons.length !== 0) {
    const lastOtherCoupon = lastCoupons.find((coupon) => {
      const eventNameElement = coupon.querySelector(
        'td[class*="coupon__table-col"]:first-child > [class*="coupon__event-link"], td[class*="coupon__table-col"]:first-child > span:last-child',
      );
      const betNameElement = coupon.querySelector('td[class*="_type_stake"]');
      if (!eventNameElement || !betNameElement) {
        return false;
      }
      return (
        text(eventNameElement) !== currentBet.eventName ||
        text(betNameElement) !== currentBet.betName
      );
    });
    const lastOtherBetIndex = lastCoupons.indexOf(lastOtherCoupon);
    currentBet.lastSameBetCount =
      lastOtherBetIndex === -1 ? lastCoupons.length : lastOtherBetIndex;
    if (currentBet.lastSameBetCount > 0) {
      germesLog(
        `Количество таких же последних купонов: ${currentBet.lastSameBetCount}`,
        LogType.INFO,
      );
    }
  } else {
    currentBet.lastSameBetCount = 0;
  }

  return true;
};

// const apiMethod = (): boolean => {
//   return true;
// };

// const postCheck = (): boolean => {
//   return true;
// };

const doStakeGeneratorOptions: DoStakeGeneratorOptions = {
  preCheck,
  doStakeButtonSelector: '[class*="button"][class*="normal-bet"]',
  // apiMethod,
  errorClasses: [
    {
      className: '_disabled--1hdBR',
      // message: '',
    },
  ],
  // disabledCheck: false,
  getCoefficient,
  getParameter,
  // postCheck,
  // context: () => document,
};

export default doStakeGeneratorOptions;
