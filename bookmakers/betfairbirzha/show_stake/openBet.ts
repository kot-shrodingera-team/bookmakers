import clearCoupon from '../../../src/show_stake/clearCoupon';
import getCoefficient from '../../../src/stake_info/getCoefficient';
import getStakeCount from '../../../src/stake_info/getStakeCount';
import {
  germesLog,
  LogType,
  getElement,
  repeatingOpenBet,
  text,
  getWorkerParameter,
  awaiter,
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

  const {
    selection_id: betSelectionId,
    bH: betHandicap,
    all_availableToBack: allAvailableToBack,
    all_availableToLay: allAvailableToLay,
  } = JSON.parse(worker.BetId);
  if (
    (allAvailableToBack === undefined && allAvailableToLay === undefined) ||
    (allAvailableToBack !== undefined && allAvailableToLay !== undefined)
  ) {
    throw new JsFailError(
      'Не удалось определить направление ставки. Обратитесь в ТП',
    );
  }
  if (allAvailableToLay !== undefined) {
    worker.Helper.WriteLine('Lay ставка');
    window.germesData.additionalFields.isLay = true;
  } else {
    worker.Helper.WriteLine('Back ставка');
    window.germesData.additionalFields.isLay = false;
  }
  const betType = window.germesData.additionalFields.isLay ? 'lay' : 'back';
  const betSelector =
    `[bet-handicap='${betHandicap}']` +
    `[bet-selection-id='${betSelectionId}']` +
    `[bet-type='${betType}']` +
    ` > button.${betType}-selection-button`;
  germesLog(`betSelector = "${betSelector}"`, LogType.DEV_INFO);

  /* ======================================================================== */
  /*                               Поиск ставки                               */
  /* ======================================================================== */

  const bet = await getElement<HTMLElement>(betSelector);
  if (!bet) {
    throw new JsFailError('Ставка не найдена');
  }

  /* ======================================================================== */
  /*                       Проверка наличия коэффициента                      */
  /* ======================================================================== */

  const priceAppeared = await awaiter(() => {
    return bet.getAttribute('price') && bet.getAttribute('price') !== '0';
  }, 1000);
  if (!priceAppeared) {
    throw new JsFailError(
      'Ошибка открытия купона: Коэффициент так и не появился',
    );
  }

  /* ======================================================================== */
  /*           Открытие ставки, проверка, что ставка попала в купон           */
  /* ======================================================================== */

  const openingAction = async () => {
    bet.click();
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
  /*                    Вывод информации об открытой ставке                   */
  /* ======================================================================== */

  const eventNameSelector = '.EVENT';
  const marketNameSelector = '.MARKET.selected';
  const betNameSelector = '.betslip__editable-bet__runner';

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
  const betName = `${text(betNameElement)} ${
    window.germesData.additionalFields.isLay ? '(Lay)' : '(Back)'
  }`;

  germesLog(
    `Открыта ставка\n${eventName}\n${marketName}\n${betName}`,
    LogType.INFO,
  );
};

export default openBet;
