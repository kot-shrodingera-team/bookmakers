import clearCoupon from '../../../src/show_stake/clearCoupon';
import getCoefficient from '../../../src/stake_info/getCoefficient';
import getStakeCount from '../../../src/stake_info/getStakeCount';
import {
  germesLog,
  LogType,
  repeatingOpenBet,
  text,
  getWorkerParameter,
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

  const { id } = JSON.parse(worker.BetId);
  germesLog(`id = "${id}"`, LogType.DEV_INFO);

  /* ======================================================================== */
  /*           Открытие ставки, проверка, что ставка попала в купон           */
  /* ======================================================================== */

  const openingAction = async () => {
    // esports
    await fetch(
      `https://ultraplay.betonline.ag/api/betslip/add?connectionId=%22%22&id=${id}&stopBroadcasting=false`,
    );
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
  /*                            Обновление лимитов                            */
  /* ======================================================================== */

  await updateLimits();

  /* ======================================================================== */
  /*                    Вывод информации об открытой ставке                   */
  /* ======================================================================== */

  const context =
    window.germesData.additionalFields.bettingFrame.contentDocument;

  const eventNameSelector = '.GUqY7:first-child';
  const marketNameSelector = '.M5RJm';
  const betNameSelector = '.cHtPr';

  const eventNameElement = context.querySelector(eventNameSelector);
  const marketNameElement = context.querySelector(marketNameSelector);
  const betNameElement = context.querySelector(betNameSelector);

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
