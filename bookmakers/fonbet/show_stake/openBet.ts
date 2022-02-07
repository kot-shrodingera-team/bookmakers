import clearCoupon from '../../../src/show_stake/clearCoupon';
import getCoefficient from '../../../src/stake_info/getCoefficient';
import getMaximumStake from '../../../src/stake_info/getMaximumStake';
import { minimumStakeReady } from '../../../src/stake_info/getMinimumStake';
import getStakeCount from '../../../src/stake_info/getStakeCount';
import {
  germesLog,
  LogType,
  repeatingOpenBet,
  text,
  getWorkerParameter,
} from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const openBet = async (): Promise<void> => {
  /* ======================================================================== */
  /*                              Очистка купона                              */
  /* ======================================================================== */

  const couponCleared = await clearCoupon();
  if (!couponCleared) {
    throw new JsFailError('Не удалось очистить купон');
  }

  /* ======================================================================== */
  /*                      Формирование данных для поиска                      */
  /* ======================================================================== */

  const eventRootId = Number(worker.EventId);
  const {
    subevent_id: eventId,
    factor_id: lineId,
    p: lineP,
  } = JSON.parse(worker.BetId);

  /* ======================================================================== */
  /*           Открытие ставки, проверка, что ставка попала в купон           */
  /* ======================================================================== */

  const openingAction = async () => {
    window.app.couponManager.newCoupon.newAddStake(
      'live',
      'live',
      eventRootId,
      Number(eventId),
      Number(lineId),
      typeof lineP !== 'undefined' ? Number(lineP) * 100 : undefined,
    );
  };
  await repeatingOpenBet(openingAction, getStakeCount, 1, 1000, 50);

  /* ======================================================================== */
  /*                        Ожидание минимальной ставки                       */
  /* ======================================================================== */

  const minLoaded = await minimumStakeReady();
  if (!minLoaded) {
    throw new JsFailError('Минимум не появился');
  }
  germesLog('Появился минимум', LogType.DEV_INFO);

  /* ======================================================================== */
  /*                    Вывод информации об открытой ставке                   */
  /* ======================================================================== */

  const eventNameSelector = '[class*="stake-wide"] > [class*="column2--"]';
  // const marketNameSelector = '';
  const betNameSelector = '[class*="stake-wide"] > [class*="column3--"]';

  const eventNameElement = document.querySelector(eventNameSelector);
  // const marketNameElement = document.querySelector(marketNameSelector);
  const betNameElement = document.querySelector(betNameSelector);

  if (!eventNameElement) {
    throw new JsFailError('Не найдено событие открытой ставки');
  }
  // if (!marketNameElement) {
  //   throw new JsFailError('Не найден маркет открытой ставки');
  // }
  if (!betNameElement) {
    throw new JsFailError('Не найдена роспись открытой ставки');
  }

  const eventName = text(eventNameElement);
  // const marketName = text(marketNameElement);
  const betName = text(betNameElement);

  germesLog(
    // `Открыта ставка\n${eventName}\n${marketName}\n${betName}`,
    `Открыта ставка\n${eventName}\n${betName}`,
    LogType.INFO,
  );

  /* ======================================================================== */
  /*                  Проверка пореза по максимальной ставке                  */
  /* ======================================================================== */

  const accountRestrictionCheckByMaxStake = getWorkerParameter(
    'accountRestrictionCheckByMaxStake',
  );
  if (accountRestrictionCheckByMaxStake && worker.Currency === 'RUR') {
    const maximumStake = getMaximumStake();
    if (maximumStake <= 500) {
      const paused = worker.SetBookmakerPaused(true);
      let message = `В Фонбете максмальная сумма ставки ${maximumStake} <= 500. Считаем что аккаунт порезан\n`;
      if (paused) {
        message = `${message}Поставили на паузу`;
      } else {
        message = `${message}НЕ удалось поставить на паузу`;
      }
      worker.Helper.SendInformedMessage(message);
      throw new JsFailError(message);
    }
  }

  /* ======================================================================== */
  /*                           Проверка коэффициента                          */
  /* ======================================================================== */

  const coefficientDropCheck = getWorkerParameter('coefficientDropCheck');
  if (coefficientDropCheck) {
    const currentCoefficient = getCoefficient();
    const { coefficient: forkCoefficient } = JSON.parse(worker.ForkObj);
    if (!forkCoefficient) {
      throw new JsFailError('Не удалось получить коэффициент из вилки');
    }
    germesLog(
      `Коэффициент: ${forkCoefficient} => ${currentCoefficient}`,
      LogType.DEV_INFO,
    );
    if (currentCoefficient < forkCoefficient) {
      throw new JsFailError('Коэффициент упал от исходного');
    }
  }
};

export default openBet;
