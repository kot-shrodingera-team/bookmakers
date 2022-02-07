import { germesLog, LogType, text } from '../../../utils';

/*
Проверка, появилась ли новая ставка в истории (временной, которая под купоном)
в lastSameBetCount записано количество таких же последних ставок в истории
это для корректной обработки повторных ставок
в обычной ситуации без повторов lastSameBetCount = 0 и возвращается true, если в истории появилась подходящая ставка
флаг logging можно включать в последней проверке, чтобы вывести дополнительную информацию
по умолчанию она не выводится, чтобы не спамить в логи
*/

const checkLastCoupons = (logging = false): boolean => {
  const lastCoupons = [
    ...document.querySelectorAll(
      '[class*="coupon-list"] article[class*="coupon"]',
    ),
  ];
  if (lastCoupons.length === 0) {
    return false;
  }
  let lastFittingCouponsCount = 0;
  const { currentBet } = window.germesData.additionalFields;
  // eslint-disable-next-line no-restricted-syntax
  for (const coupon of lastCoupons) {
    const eventNameElement = coupon.querySelector(
      'td[class*="coupon__table-col"]:first-child > [class*="coupon__event-link"], td[class*="coupon__table-col"]:first-child > span:last-child',
    );
    if (!eventNameElement) {
      germesLog(
        `Не найден Event Name для купона #${lastFittingCouponsCount + 1}`,
        LogType.ERROR,
      );
      return false;
    }
    const betNameElement = coupon.querySelector('td[class*="_type_stake"]');
    if (!betNameElement) {
      germesLog(
        `Не найден Bet Name для купона #${lastFittingCouponsCount + 1}`,
        LogType.ERROR,
      );
      return false;
    }
    const eventName = text(eventNameElement);
    const betName = text(betNameElement);
    if (eventName === currentBet.eventName && betName === currentBet.betName) {
      // если ставка в истории подходящая (такое же событие и исход)

      // увеличиваем количество подходящих ставок
      lastFittingCouponsCount += 1;
      if (lastFittingCouponsCount === currentBet.lastSameBetCount + 1) {
        // если количество подходящих купонов стало больше, чем было
        // значит ставка принята
        return true;
      }
    } else {
      // иначе не подходящая (другая) ставка
      if (logging) {
        germesLog(`${eventName} !== ${currentBet.eventName}`, LogType.INFO);
        germesLog(`${betName} !== ${currentBet.betName}`, LogType.INFO);
      }
      // дальше смотреть нет смысла
      break;
    }
  }
  if (logging) {
    germesLog(
      `Таких же ставок в истории\nБыло: ${currentBet.lastSameBetCount}\nСтало: ${lastFittingCouponsCount}`,
      LogType.ERROR,
    );
  }
  return false;
};

export default checkLastCoupons;
