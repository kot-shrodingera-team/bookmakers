import getStakeCount from '../../../src/stake_info/getStakeCount';
import {
  repeatingOpenBet,
  getWorkerParameter,
  germesLog,
  getElement,
  // sleep,
  text,
  LogType,
} from '../../../utils';
import { JsFailError } from '../../../utils/errors';
// import changeToStandardBetslip from './changeToStandardBetslip';

const openPreparedBet = async (): Promise<void> => {
  if (!window.germesData.additionalFields.preparedBet) {
    throw new JsFailError('Нет ставки для открытия');
  }

  await repeatingOpenBet(
    async () => window.germesData.additionalFields.preparedBet.click(),
    getStakeCount,
    1,
    1000,
    50,
  );

  /* ======================================================================== */
  /*               Ожидание появления названия события в купоне               */
  /* ======================================================================== */

  const eventNameSelector =
    '.lqb-NormalBetItem_FixtureDescription, .bss-NormalBetItem_FixtureDescription';
  const eventNameElement = await getElement(eventNameSelector);
  if (!eventNameElement) {
    throw new JsFailError('Событие не появилось в купоне');
  }

  /* ======================================================================== */
  /*         Проверка на всплывающее окно о целых параметрах в Италии         */
  /* ======================================================================== */

  const pushBetDialogCheckTimeout = getWorkerParameter<number>(
    'pushBetDialogCheckTimeout',
    'number',
  );
  if (pushBetDialogCheckTimeout) {
    germesLog('Ожидаем всплывающее окно о целых параметрах', LogType.DEV_INFO);
    const pushBetDialogOkButton = await getElement<HTMLElement>(
      '.bil-BetslipPushBetDialog_OkayButton',
      pushBetDialogCheckTimeout,
    );
    if (pushBetDialogOkButton) {
      germesLog('Нажимаем "OK" в окне о целых параметрах', LogType.ACTION);
      pushBetDialogOkButton.click();
    } else {
      germesLog('Не было всплывающего окна о целых параметрах', LogType.INFO);
    }
  }

  /* ======================================================================== */
  /*                      Переключение мобильного купона                      */
  /* ======================================================================== */

  // const quickBetBetslipSelector = '.qbs-NormalBetItem_Title, .lqb-QuickBetslip';
  // const eventNameSelector =
  //   '.bss-NormalBetItem_FixtureDescription, .lbs-NormalBetItem_FixtureDescription';

  // await Promise.race([
  //   getElement(eventNameSelector),
  //   getElement(quickBetBetslipSelector),
  // ]);
  // const qbsBetTitle = document.querySelector(quickBetBetslipSelector);
  // if (qbsBetTitle) {
  //   germesLog('Мобильный купон. Переключаем на стандартный', LogType.ACTION);
  //   await sleep(500);
  //   const changed = await changeToStandardBetslip();
  //   if (!changed) {
  //     throw new JsFailError('Не удалось переключится на стандартный купон');
  //   }
  //   await getElement(eventNameSelector);
  // }

  /* ======================================================================== */
  /*                    Вывод информации об открытой ставке                   */
  /* ======================================================================== */

  // const eventNameSelector = '.lqb-NormalBetItem_FixtureDescription';
  const marketNameSelector =
    // '.bss-NormalBetItem_Market, .lbs-NormalBetItem_Market';
    '.lqb-NormalBetItem_Market, .bss-NormalBetItem_Market';
  const betNameSelector =
    // '.bss-NormalBetItem_Title, .lbs-NormalBetItem_Title';
    '.lqb-NormalBetItem_Title, .bss-NormalBetItem_Title';
  const betHandicapSelector =
    // '.bss-NormalBetItem_Handicap, .lbs-NormalBetItem_Handicap';
    '.lqb-NormalBetItem_Handicap, .bss-NormalBetItem_Handicap';

  // const eventNameElement = document.querySelector(eventNameSelector);
  // if (!eventNameElement) {
  //   throw new JsFailError('Не найдено событие открытой ставки');
  // }
  const marketNameElement = document.querySelector(marketNameSelector);
  if (!marketNameElement) {
    throw new JsFailError('Не найден маркет открытой ставки');
  }
  const betNameElement = document.querySelector(betNameSelector);
  if (!betNameElement) {
    throw new JsFailError('Не найдена роспись открытой ставки');
  }

  const eventName = text(eventNameElement);
  const marketName = text(marketNameElement);

  // Если есть параметр, нужно его дождаться
  const { param } = JSON.parse(worker.ForkObj);
  if (param) {
    if (!/^(Draw No Bet)$/i.test(marketName)) {
      germesLog(
        'Ставка с параметром, ожидаем появления параметра в купоне',
        LogType.INFO,
      );
      // const parameterLoaded = await awaiter(
      //   () => getParameter() !== -6666 && getParameter() !== -9999,
      //   5000,
      //   50
      // );
      const parameterLoaded = await getElement(betHandicapSelector);
      if (!parameterLoaded) {
        throw new JsFailError('Не дождались появления параметра');
      }
    }
  }

  const betHandicapElement = document.querySelector(betHandicapSelector);
  const betHandicap = betHandicapElement ? text(betHandicapElement) : '';

  const betNameRaw = text(betNameElement);

  const betName = betHandicap
    ? betNameRaw.replace(betHandicap, ` ${betHandicap}`)
    : betNameRaw;

  germesLog(
    `Открыта ставка\n${eventName}\n${marketName}\n${betName}`,
    LogType.INFO,
  );

  window.germesData.additionalFields.preparedBet = null;
};

export default openPreparedBet;
