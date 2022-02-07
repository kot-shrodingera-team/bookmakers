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
// import changeToStandardBetslip from '../helpers/changeToStandardBetslip';
import { expandMarkets } from '../helpers/expandAllMarkets';

const openBet = async (): Promise<void> => {
  const useAPI =
    getWorkerParameter('useAPI') === undefined
      ? false
      : getWorkerParameter('useAPI');
  const usePreparedBet =
    getWorkerParameter('usePreparedBet') === undefined
      ? true
      : getWorkerParameter('usePreparedBet');

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { betId, fi, od, zw } = (() => {
    if (worker.BetId.startsWith('{')) {
      return JSON.parse(worker.BetId);
    }
    const rawBetData = worker.BetId.split('_');
    if (rawBetData.length < 5) {
      throw new JsFailError(
        'Некорректный формат данных о ставке. Сообщите в ТП',
      );
    }
    const betData = rawBetData
      .slice(0, 4)
      .concat(rawBetData.slice(4).join('_'));
    return {
      betId: betData[0],
      fi: betData[1],
      od: betData[2],
      zw: betData[3],
    };
  })();

  const ConstructString = `pt=N#o=${od}#f=${fi}#fp=${betId}#so=#c=1#mt=1#id=${zw}Y#|TP=BS${zw}#`;
  const Uid = '';
  // const pom = '1';
  const partType = 'N';
  const getSportType = (): string => partType;
  const getCastCode = (): string => '';
  const key = (): string => zw;
  const addBetItem = {
    // pom,
    ConstructString,
    Uid,
  };

  /* ======================================================================== */
  /*                               Поиск ставки                               */
  /* ======================================================================== */

  let bet: HTMLElement;

  if (!useAPI) {
    const checkedBets = <HTMLElement[]>[];
    bet = await awaiter(() => {
      expandMarkets();
      const bets = [
        ...document.querySelectorAll<HTMLElement>('.gl-Participant_General'),
      ];
      return bets.find((_bet) => {
        if (checkedBets.includes(_bet)) {
          return null;
        }
        checkedBets.push(_bet);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const testZW = (<any>_bet)?.wrapper?.twinEmphasizedHandlerType;
        return testZW === zw;
      });
    });
    if (!bet) {
      throw new JsFailError('Ставка не найдена');
    }

    if (
      [...bet.classList].some((className) => /_Suspended$/i.test(className))
    ) {
      throw new JsFailError('Ставка недоступна');
    }

    if (usePreparedBet) {
      window.germesData.additionalFields.preparedBet = bet;
      window.germesData.additionalFields.openningPreparedBet = false;

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
      return;
    }
  }

  /* ======================================================================== */
  /*           Открытие ставки, проверка, что ставка попала в купон           */
  /* ======================================================================== */

  const openingAction = async () => {
    if (!useAPI) {
      bet.click();
    } else {
      window.BetSlipLocator.betSlipManager.addBet({
        item: addBetItem,
        action: 0,
        partType,
        constructString: ConstructString,
        key,
        getSportType,
        getCastCode,
      });
    }
  };
  await repeatingOpenBet(openingAction, getStakeCount, 1, 1000, 50);

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
  //   const changed = await changeToStandardBetslip();
  //   if (!changed) {
  //     throw new JsFailError('Не удалось переключится на стандартный купон');
  //   }
  //   await getElement(eventNameSelector);
  // }

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
};

export default openBet;
