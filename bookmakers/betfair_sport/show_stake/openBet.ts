import clearCoupon from '../../../src/show_stake/clearCoupon';
import getCoefficient from '../../../src/stake_info/getCoefficient';
import getStakeCount from '../../../src/stake_info/getStakeCount';
import {
  germesLog,
  LogType,
  repeatingOpenBet,
  text,
  getWorkerParameter,
  getElement,
} from '../../../utils';
import { JsFailError } from '../../../utils/errors';
import updateLimits from '../helpers/updateLimits';

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

  const {
    marketId,
    selectionId,
    // marketName,
    // type,
    // runnerName,
    uuid,
  } = JSON.parse(worker.BetId);
  const apiUrl =
    `https://www.betfair.com/sport/inplay` +
    `?gaMod=inplaysports` +
    `&eventId=${worker.EventId}` +
    `&gaZone=Main` +
    `&bseId=${worker.EventId}` +
    `&isSP=false` +
    `&bsContext=REAL` +
    `&bssId=${selectionId}` +
    // `&bsmSt=1642694406000` +
    `&action=addSelection` +
    `&bsUUID=${uuid}` +
    `&bsmId=${marketId}` +
    `&modules=betslip` +
    // `&xsrftoken=b1ceb731-7a11-11ec-80e6-fa163e1a51fe` +
    `&bsGroup=${worker.EventId}`;
  const marketSelector = `.ui-market[data-marketid="${marketId}"]`;
  const betSelector =
    `.ui-bet-button` +
    `[data-marketid="${marketId}"]` +
    `[data-selectionid="${selectionId}"]` +
    `[data-uuid="${uuid}"]`;
  // germesLog(betSelector);

  /* ======================================================================== */
  /*                               Поиск ставки                               */
  /* ======================================================================== */

  let bet: HTMLElement;

  if (!getWorkerParameter('useAPI')) {
    const market = await getElement(marketSelector);
    if (!market) {
      throw new JsFailError('Маркет не найден');
    }
    germesLog('Маркет найден', LogType.DEV_INFO);
    // При загрузке класс ui-market-suspended похоже не успевает прогрузится
    // возможно стоит ждать появления класса ui-market-open
    if (market.classList.contains('ui-market-suspended')) {
      throw new JsFailError('Маркет недоступен');
    }

    bet = await getElement(betSelector, 1000);
    if (!bet) {
      throw new JsFailError('Ставка не найдена');
    }
    germesLog('Ставка найдена', LogType.DEV_INFO);
    if (bet.classList.contains('ui-disabled')) {
      throw new JsFailError('Ставка недоступна');
    }
  }

  /* ======================================================================== */
  /*           Открытие ставки, проверка, что ставка попала в купон           */
  /* ======================================================================== */

  const openingAction = async () => {
    if (getWorkerParameter('useAPI')) {
      // eslint-disable-next-line no-underscore-dangle
      window.Y.bfplatform._getService('instructions').request({ url: apiUrl });
    } else {
      bet.click();
    }
  };
  await repeatingOpenBet(openingAction, getStakeCount, 1, 1000, 50);

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

  /* ======================================================================== */
  /*                             Проверка лимитов                             */
  /* ======================================================================== */

  await updateLimits();

  /* ======================================================================== */
  /*                    Вывод информации об открытой ставке                   */
  /* ======================================================================== */

  const eventNameSelector = '.event-name';
  const marketNameSelector = '.market';
  const betNameSelector = '.selection-name';

  const eventNameElement = document.querySelector(eventNameSelector);
  const marketNameElement = document.querySelector(marketNameSelector);
  const betNameElement = document.querySelector(betNameSelector);

  if (!eventNameElement) {
    throw new JsFailError('Не найдено событие открытой ставки');
  }
  if (!marketNameElement) {
    throw new JsFailError('Не найден маркет открытой ставки');
  }
  if (!betNameElement) {
    throw new JsFailError('Не найдена роспись открытой ставки');
  }

  const eventName = text(eventNameElement);
  const marketName = text(marketNameElement);
  const betName = text(betNameElement);

  germesLog(
    `Открыта ставка\n${eventName}\n${marketName}\n${betName}`,
    LogType.INFO,
  );
};

export default openBet;
