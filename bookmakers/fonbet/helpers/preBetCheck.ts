import { germesLog, LogType, text } from '../../../utils';

const preBetCheck = (): boolean => {
  const errorSpan = document.querySelector(
    '[class*="error-box"] [class*="text-area"]',
  );

  if (errorSpan) {
    const errorText = text(errorSpan);
    germesLog('В купоне ошибка', LogType.ERROR);
    germesLog(errorText, LogType.ERROR_MESSAGE);
    const errorOkButton = document.querySelector<HTMLElement>(
      '[class*="error-box--"] > [class*="button-area--"] > [class*="button--"]',
    );
    if (!errorOkButton) {
      germesLog('Не найдена кнопка закрытия ошибки', LogType.ERROR);
      return false;
    }
    germesLog('Закрываем ошибку', LogType.ACTION);
    errorOkButton.click();
  }

  const acceptChangesButton = document.querySelector<HTMLElement>(
    '[class*="button-accept"][class*="_enabled"]',
  );
  if (acceptChangesButton) {
    germesLog('В купоне изменения', LogType.INFO);
    germesLog('Принимаем изменения', LogType.ACTION);
    acceptChangesButton.click();
    return false;
  }
  return true;
};

export default preBetCheck;
