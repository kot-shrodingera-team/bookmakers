import { germesLog, LogType, setSessionData, stakeInfoString } from '.';
import { JsFailError } from './errors';
import { StateMachine } from './stateMachine';

export const betProcessingError = async (
  machine: StateMachine,
): Promise<void> => {
  window.germesData.betProcessingStep = 'error';
  setSessionData('BetProcessing', '0');
  machine.stop();
};

export const betProcessingCompltete = (machine: StateMachine): void => {
  window.germesData.betProcessingStep = 'success';
  setSessionData('BetProcessing', '0');
  machine.stop();
};

export const reopenBet = async (
  openBet: () => Promise<void>,
  machine: StateMachine,
): Promise<void> => {
  try {
    window.germesData.betProcessingStep = 'reopen';
    await openBet();
    germesLog('Ставка успешно переоткрыта', LogType.SUCCESS);
    window.germesData.betProcessingStep = 'reopened';
  } catch (reopenError) {
    if (reopenError instanceof JsFailError) {
      germesLog(reopenError.message, LogType.FATAL);
    } else {
      germesLog(reopenError.message, LogType.FATAL);
    }
    window.germesData.betProcessingStep = 'error';
  }
  machine.stop();
};

export const sendErrorMessage = (message: string): void => {
  worker.Helper.SendInformedMessage(
    `В ${window.germesData.bookmakerName} произошла ошибка принятия ставки:\n` +
      `${message}\n` +
      `${stakeInfoString()}`,
  );
};
