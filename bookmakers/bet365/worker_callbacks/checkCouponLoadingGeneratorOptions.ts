// import checkAuth from '../../../src/stake_info/checkAuth';
import doStake from '../../../src/worker_callbacks/doStake';
import setStakeSum, {
  clearStakeSum,
} from '../../../src/worker_callbacks/setStakeSum';
import {
  getWorkerParameter,
  sendTGBotMessage,
  getElement,
  getRemainingTimeout,
  sleep,
  germesLog,
  LogType,
  awaiter,
  text,
  setSessionData,
} from '../../../utils';
import {
  sendErrorMessage,
  betProcessingError,
  betProcessingCompltete,
  reopenBet,
} from '../../../utils/betProcessing';
import { CheckCouponLoadingGeneratorOptions } from '../../../utils/generators/worker_callbacks/checkCouponLoadingGenerator';
import { StateMachine } from '../../../utils/stateMachine';
// import acceptChanges from '../helpers/acceptChanges';
import {
  accountRestricted,
  accountStep2,
  accountSurvey,
} from '../helpers/accountChecks';
import openPreparedBet from '../helpers/openPreparedBet';
import updateMaximumStake from '../helpers/updateMaximumStake';
import openBet from '../show_stake/openBet';

const loaderSelector =
  // '.bss-ProcessingButton, .lbs-ProcessingButton';
  '.lqb-ProcessingButton, .bsf-ProcessingButton';
// const referBetSelector =
//   // '.bss-ReferBetConfirmation, .lbs-ReferBetConfirmation';
//   '.lqb-ReferBetConfirmation';
export const errorSelector =
  // '.bss-Footer_MessageBody, .lbs-Footer_MessageBody, .bsi-FooterIT_MessageBody';
  '.lqb-QuickBetHeader_HasMessage .lqb-QuickBetHeader_MessageBody, .bs-OpportunityChangeErrorMessage_Contents';
// const placeBetErrorSelector =
//   // '.bs-PlaceBetErrorMessage_Contents, .lbl-PlaceBetErrorMessage_Contents';
//   '.lqb-PlaceBetErrorMessage_Contents'; // предположительно, возможно такого вообще нет
// const acceptButtonSelector =
//   // '.bs-AcceptButton, .lbl-AcceptButton';
//   '.lqb-AcceptButton';
const receiptTickSelector =
  // '.bss-ReceiptContent_Tick, .bss-StandardBetslip-receipt, .lbs-ReceiptContent_Tick, .lbs-StandardBetslip-receipt';
  '.lqb-QuickBetHeader_DoneButton, .bss-ReceiptContent_Tick';

const loaderNotAppearedTimeout =
  getWorkerParameter<number>('loaderNotAppearedTimeout', 'number') || 3000;
const noResultAfterLoaderDisappearedTimeout =
  getWorkerParameter<number>(
    'noResultAfterLoaderDisappearedTimeout',
    'number',
  ) || 3000;

const sendDevTGBotMessage = (message: string): void => {
  sendTGBotMessage(
    '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
    126302051,
    message,
  );
};

const asyncCheck = async () => {
  const machine = new StateMachine();

  setSessionData('BetProcessing', '1');

  machine.promises = {
    loaderNotAppeared: () => sleep(loaderNotAppearedTimeout),
    loader: () => getElement(loaderSelector, getRemainingTimeout()),
    // referBet: () => getElement(referBetSelector, getRemainingTimeout()),
    error: () => getElement(errorSelector, getRemainingTimeout()),
    // placeBetError: () =>
    //   getElement(placeBetErrorSelector, getRemainingTimeout()),
    // acceptButton: () => getElement(acceptButtonSelector, getRemainingTimeout()),
    betPlaced: () => getElement(receiptTickSelector, getRemainingTimeout()),
  };

  machine.setStates({
    start: {
      entry: async () => {
        if (window.germesData.additionalFields.preparedBet) {
          germesLog('Открываем подготовленную ставку', LogType.ACTION);
          try {
            await openPreparedBet();
          } catch (error) {
            germesLog('Ошибка открытия подготовленной ставки', LogType.FATAL);
            germesLog(error.message, LogType.FATAL);
            window.germesData.stakeDisabled = true;
            betProcessingError(machine);
            return;
          }
          germesLog('Подготовленная ставка открыта', LogType.SUCCESS);
        }
        try {
          const setStakeSumSuccess = await setStakeSum();
          if (!setStakeSumSuccess) {
            germesLog('Не удалось ввести сумму ставки', LogType.ERROR);
            betProcessingError(machine);
            return;
          }
          await sleep(1000);
          const doStakeSuccess = await doStake();
          if (!doStakeSuccess) {
            germesLog('Не удалось сделать ставку', LogType.ERROR);
            betProcessingError(machine);
            return;
          }
        } catch (e) {
          germesLog(`Ошибка попытки ставки: ${e.message}`, LogType.ERROR);
          betProcessingError(machine);
          return;
        }
        germesLog('Начало обработки ставки', LogType.INFO);
      },
    },
    loaderNotAppeared: {
      entry: async () => {
        const message = `Индикатор или результат не появился в течении ${loaderNotAppearedTimeout} мс`;
        germesLog(message, LogType.ERROR);
        sendErrorMessage(message);
        betProcessingError(machine);
      },
    },
    loader: {
      entry: async () => {
        germesLog('Появился индикатор', LogType.INFO);
        window.germesData.betProcessingAdditionalInfo = 'индикатор';
        delete machine.promises.loader;
        delete machine.promises.loaderNotAppeared;
        machine.promises.loaderDissappeared = () =>
          awaiter(
            () => document.querySelector(loaderSelector) === null,
            getRemainingTimeout(),
          );
      },
    },
    loaderDissappeared: {
      entry: async () => {
        germesLog('Исчез индикатор', LogType.INFO);
        window.germesData.betProcessingAdditionalInfo = undefined;
        delete machine.promises.loaderDissappeared;
        machine.promises.noResultAfterLoaderDisappeared = () =>
          sleep(noResultAfterLoaderDisappearedTimeout);
      },
    },
    noResultAfterLoaderDisappeared: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;
        // if (!checkAuth()) {
        //   window.germesData.stakeDisabled = true;
        //   const message = `Результат не появился в течении ${noResultAfterLoaderDisappearedTimeout} мс после исчезания индикатора и пропала авторизация`;
        //   germesLog(message, LogType.ERROR);
        //   sendErrorMessage(message);
        //   betProcessingError(machine);
        //   return;
        // }
        const message = `Результат не появился в течении ${noResultAfterLoaderDisappearedTimeout} мс после исчезания индикатора`;
        germesLog(message, LogType.ERROR);
        sendErrorMessage(message);
        // if (getWorkerParameter('noResultAfterLoaderDisappearedStop')) {
        //   window.germesData.stakeDisabled = false; // Тест. Порой ставка принята, хотя не видно результата
        // }
        betProcessingError(machine);
      },
    },
    // referBet: {
    //   entry: async (): Promise<void> => {
    //     germesLog('Refer Bet Confirmation', LogType.INFO);
    //     const placeNowValueSelector =
    //       '.bss-ReferBetConfirmation_PlaceNow .bss-ReferBetConfirmation_Referred:nth-child(1) .bss-ReferBetConfirmation_Referred-value, .lbs-ReferBetConfirmation_PlaceNow .lbs-ReferBetConfirmation_Referred:nth-child(1) .lbs-ReferBetConfirmation_Referred-value';
    //     const referredValueSelector =
    //       '.bss-ReferBetConfirmation_PlaceNow .bss-ReferBetConfirmation_Referred:nth-child(2) .bss-ReferBetConfirmation_Referred-value, .lbs-ReferBetConfirmation_PlaceNow .lbs-ReferBetConfirmation_Referred:nth-child(2) .lbs-ReferBetConfirmation_Referred-value';
    //     const placeBetAndReferButtonSelector =
    //       '.bss-PlaceBetReferButton_Text, .lbs-PlaceBetReferButton_Text';

    //     germesLog('Ждём появления данных', LogType.INFO);
    //     sendTGBotMessage(
    //       '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
    //       126302051,
    //       'ReferBerError Test',
    //     );

    //     await Promise.all([
    //       getElement(placeNowValueSelector, getRemainingTimeout()),
    //       getElement(referredValueSelector, getRemainingTimeout()),
    //       getElement(placeBetAndReferButtonSelector, getRemainingTimeout()),
    //     ]);

    //     const placeNowValueElement = document.querySelector(
    //       placeNowValueSelector,
    //     );
    //     const referredValueElement = document.querySelector(
    //       referredValueSelector,
    //     );
    //     const placeBetAndReferButton = document.querySelector<HTMLElement>(
    //       placeBetAndReferButtonSelector,
    //     );
    //     if (!placeNowValueElement) {
    //       germesLog('placeNowValueElement not found', LogType.ERROR);
    //     } else {
    //       germesLog(
    //         `placeNowValueElement text: "${text(placeNowValueElement)}"`,
    //       );
    //     }
    //     if (!referredValueElement) {
    //       germesLog('referredValueElement not found', LogType.ERROR);
    //     } else {
    //       germesLog(
    //         `referredValueElement text: "${text(referredValueElement)}"`,
    //       );
    //     }
    //     if (!placeBetAndReferButton) {
    //       germesLog('placeBetAndReferButton not found', LogType.ERROR);
    //     } else {
    //       germesLog(
    //         `placeBetAndReferButton text: "${text(placeBetAndReferButton)}"`,
    //       );
    //     }

    //     if (
    //       !placeNowValueElement ||
    //       !referredValueElement ||
    //       !placeBetAndReferButton
    //     ) {
    //       const message =
    //         'Не дождались результата принятия ставки при Refer Bet Confirmation';
    //       germesLog(message, LogType.ERROR);
    //       sendErrorMessage(message);
    //       betProcessingError(machine);
    //       return;
    //     }

    //     const placeNowValueText = text(placeNowValueElement);
    //     const referredValueText = text(referredValueElement);
    //     const valueRegex = /(\d+(?:\.\d+)?)/;
    //     const placeNowValueMatch = placeNowValueText.match(valueRegex);
    //     if (!placeNowValueMatch) {
    //       const message = `Не удалось определить значение Place Now: ${placeNowValueText}`;
    //       germesLog(message, LogType.ERROR);
    //       sendErrorMessage(message);
    //       betProcessingError(machine);
    //       return;
    //     }
    //     const referredValueMatch = referredValueText.match(valueRegex);
    //     if (!referredValueMatch) {
    //       const message = `Не удалось определить значение Referred: ${referredValueText}`;
    //       germesLog(message, LogType.ERROR);
    //       sendErrorMessage(message);
    //       betProcessingError(machine);
    //       return;
    //     }
    //     window.germesData.additionalFields.referredBetData.placeNowValue =
    //       Number(placeNowValueMatch[1]);
    //     window.germesData.additionalFields.referredBetData.referredValue =
    //       Number(referredValueMatch[1]);

    //     placeBetAndReferButton.click();
    //     germesLog('Нажимаем на кнопку "Place Bet and Refer"', LogType.ACTION);
    //     delete machine.promises.referBet;
    //     delete machine.promises.loaderNotAppeared;
    //     delete machine.promises.loaderDissappeared;
    //     delete machine.promises.noResultAfterLoaderDisappeared;
    //     machine.promises.loader = () =>
    //       getElement(loaderSelector, getRemainingTimeout());
    //   },
    // },
    error: {
      entry: async () => {
        germesLog('Появилась ошибка', LogType.INFO);
        window.germesData.betProcessingAdditionalInfo = undefined;

        await sleep(500); // чтобы закончились анимации

        let errorText = text(<HTMLElement>machine.data.result);
        if (errorText === '') {
          germesLog('Текст ошибки пустой. Ждём появления', LogType.ACTION);
          errorText = await awaiter(() =>
            text(<HTMLElement>machine.data.result),
          );
          if (!errorText) {
            const message = 'Не появился текст ошибки принятия ставки';
            germesLog(message, LogType.ERROR);
            sendErrorMessage(message);
            worker.TakeScreenShot(false);
            betProcessingError(machine);
            return;
          }
        }

        germesLog(errorText, LogType.ERROR_MESSAGE);

        worker.TakeScreenShot(false);

        // const acceptButton = document.querySelector(
        //   // '.lbl-AcceptButton',
        //   '.lqb-AcceptButton',
        // );

        const accountRestrictedRegex =
          /Certain restrictions may be applied to your account. If you have an account balance you can request to withdraw these funds now by going to the Withdrawal page in Members./i;
        const accountStep2Regex =
          /In accordance with licensing conditions we are required to verify your age and identity. Certain restrictions may be applied to your account until we are able to verify your details. Please go to the Know Your Customer page in Members and provide the requested information./i;
        const accountSurveyRegex =
          /As part of the ongoing management of your account we need you to answer a set of questions relating to Responsible Gambling. Certain restrictions may be applied to your account until you have successfully completed this. You can answer these questions now by going to the Self-Assessment page in Members./i;
        const selectionChangedRegex =
          /The line and price of your selection changed|The price and availability of your selection changed|The availability of your selection changed|The selection is no longer available|The price of your selection changed|The price of your selection has changed|The line, odds or availability of your selections has changed.|The line, odds or availability of selections on your betslip has changed. Please review your betslip|La linea, le quote o la disponibilità delle tue selezioni è cambiata./i;

        const newMaximumErrorRegex =
          /^Stake\/risk entered on selection .* is above the available maximum of .*?(\d+\.\d+).*?$/i;
        const newMaximumShortErrorRegex = /^Max Stake .*?(\d+\.\d+).*?$/i;
        const unknownMaximumErrorRegex =
          /^Your stake exceeds the maximum allowed$/i;

        const pleaseEnterAStakeErrorRegex = /^Please enter a stake$/i;

        const checkMyBetsRegex =
          /Please check My Bets for confirmation that your bet has been successfully placed./;

        if (accountRestrictedRegex.test(errorText)) {
          accountRestricted();
          window.germesData.stakeDisabled = true;
          betProcessingError(machine);
          return;
        }
        if (accountStep2Regex.test(errorText)) {
          accountStep2();
          window.germesData.stakeDisabled = true;
          betProcessingError(machine);
          return;
        }
        if (accountSurveyRegex.test(errorText)) {
          accountSurvey();
          window.germesData.stakeDisabled = true;
          betProcessingError(machine);
          return;
        }
        if (selectionChangedRegex.test(errorText)) {
          const suspendedStake = document.querySelector(
            // '.bss-NormalBetItem.bss-NormalBetItem_Suspended, .lbs-NormalBetItem.lbs-NormalBetItem_Suspended',
            '.lqb-NormalBetItem.lqb-NormalBetItem_Suspended, .bss-NormalBetItem.bss-NormalBetItem_Suspended',
          );
          if (suspendedStake) {
            germesLog('Ставка недоступна', LogType.ERROR);
            betProcessingError(machine);
            return;
          }
          germesLog('Изменение котировок', LogType.ERROR);
          // if (!acceptButton) {
          //   germesLog('Не найдена кнопка принятия изменений', LogType.ERROR);
          // } else {
          //   germesLog('Принимаем изменения', LogType.ACTION);
          //   acceptChanges();
          //   const acceptButtonDisappeared = await awaiter(
          //     () => !document.querySelector(acceptButtonSelector),
          //   );
          //   if (!acceptButtonDisappeared) {
          //     germesLog('Кнопка принятия изменений не исчезла', LogType.ERROR);
          //     betProcessingError(machine);
          //     return;
          //   }
          //   germesLog('Кнопка принятия изменения исчезла', LogType.DEV_INFO);
          // }
          betProcessingError(machine);
          return;
        }
        if (
          newMaximumErrorRegex.test(errorText) ||
          newMaximumShortErrorRegex.test(errorText) ||
          unknownMaximumErrorRegex.test(errorText)
        ) {
          germesLog('Превышена максимальная ставка', LogType.ERROR);
          updateMaximumStake();
          const delay =
            2000 -
            (new Date().getTime() - window.germesData.doStakeTime.getTime());
          if (delay > 0) {
            germesLog('Задержка после появления максимума');
            await sleep(delay);
          }
          // if (!acceptButton) {
          //   germesLog('Не найдена кнопка принятия изменений', LogType.ERROR);
          // } else {
          //   germesLog('Принимаем изменения', LogType.ACTION);
          //   acceptChanges();
          // }
          betProcessingError(machine);
          return;
        }
        if (pleaseEnterAStakeErrorRegex.test(errorText)) {
          // germesLog('Перевбиваем сумму ставки', LogType.ACTION);
          germesLog('Очищаем сумму ставки', LogType.ACTION);
          clearStakeSum();
          // setStakeSum(worker.StakeInfo.Summ);
          // await sleep(500);
          betProcessingError(machine);
          return;
        }
        if (checkMyBetsRegex.test(errorText)) {
          const dontInformCheckMyBetsError = getWorkerParameter(
            'dontInformCheckMyBetsError',
          );
          const checkMyBetsStop = getWorkerParameter('checkMyBetsStop');
          const message = 'Неизвестный результат. Check My Bets';
          germesLog(message, LogType.ERROR);
          if (!dontInformCheckMyBetsError) {
            sendErrorMessage(message);
          }
          await sleep(500); // чтобы закончились анимации
          worker.TakeScreenShot(false);
          if (checkMyBetsStop) {
            window.germesData.stakeDisabled = true;
            betProcessingError(machine);
            return;
          }
          germesLog('Переоткрываем ставку', LogType.ACTION);
          await reopenBet(openBet, machine);
          await sleep(500); // чтобы закончились анимации
          germesLog('Переоткрыли ставку', LogType.INFO);
          return;
        }
        germesLog('Непонятная ошибка', LogType.ERROR);
        sendErrorMessage(errorText);
        sendDevTGBotMessage(errorText);
        betProcessingError(machine);
      },
    },
    // placeBetError: {
    //   entry: async () => {
    //     germesLog('Появилась ошибка ставки', LogType.INFO);
    //     window.germesData.betProcessingAdditionalInfo = null;
    //     const placeBetErrorText = text(machine.data.result as HTMLElement);
    //     germesLog(placeBetErrorText, LogType.ERROR_MESSAGE);

    //     const checkMyBetsRegex =
    //       /Please check My Bets for confirmation that your bet has been successfully placed./i;

    //     if (checkMyBetsRegex.test(placeBetErrorText)) {
    //       const dontInformCheckMyBetsError = getWorkerParameter(
    //         'dontInformCheckMyBetsError',
    //       );
    //       const checkMyBetsStop = getWorkerParameter('checkMyBetsStop');
    //       const message = 'Неизвестный результат. Check My Bets';
    //       germesLog(message, LogType.ERROR);
    //       if (!dontInformCheckMyBetsError) {
    //         sendErrorMessage(message);
    //       }
    //       await sleep(500); // чтобы закончились анимации
    //       worker.TakeScreenShot(false);
    //       if (checkMyBetsStop) {
    //         window.germesData.stopBetProcessing();
    //         return;
    //       }
    //       germesLog('Переоткрываем ставку', LogType.ACTION);
    //       await reopenBet(openBet, machine);
    //       await sleep(500); // чтобы закончились анимации
    //       germesLog('Переоткрыли ставку', LogType.INFO);
    //       return;
    //     }

    //     germesLog('В купоне непонятная ошибка ставки', LogType.ERROR);
    //     sendErrorMessage(placeBetErrorText);
    //     betProcessingError(machine);
    //   },
    // },
    // acceptButton: {
    //   entry: async () => {
    //     germesLog(
    //       'Появилась кнопка принятия изменений, но нет сообщения',
    //       LogType.INFO,
    //     );
    //     machine.promises = {
    //       error: () => getElement(errorSelector, getRemainingTimeout()),
    //       placeBetError: () =>
    //         getElement(placeBetErrorSelector, getRemainingTimeout()),
    //       errorNotAppeared: () => sleep(5000),
    //     };
    //   },
    // },
    errorNotAppeared: {
      entry: async () => {
        const message =
          'Не появилось сообщение после появления кнопки принятия изменений';
        germesLog(message, LogType.ERROR);
        sendErrorMessage(message);
        betProcessingError(machine);
      },
    },
    betPlaced: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;
        betProcessingCompltete(machine);
      },
    },
    timeout: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;
        const message = 'Не дождались результата ставки';
        germesLog(message, LogType.ERROR);
        sendErrorMessage(message);
        betProcessingError(machine);
      },
    },
  });

  machine.start('start');
};

const checkCouponLoadingGeneratorOptions = <CheckCouponLoadingGeneratorOptions>{
  asyncCheck,
  disableLog: false,
};

export default checkCouponLoadingGeneratorOptions;
