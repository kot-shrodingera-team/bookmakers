import { germesLog, LogType } from '../../../utils';

const updateMaximumStake = (): void => {
  const newMaximumErrorRegex =
    /^Stake\/risk entered on selection .* is above the available maximum of .*?(\d+\.\d+).*?$/i;
  const newMaximumShortErrorRegex = /^Max Stake .*?(\d+\.\d+).*?$/i;
  const unknownMaximumErrorRegex = /^Your stake exceeds the maximum allowed$/i;

  const errorMessageElement = document.querySelector(
    '.bss-Footer_MessageBody, .lbs-Footer_MessageBody, .bsi-FooterIT_MessageBody',
  );
  if (!errorMessageElement) {
    germesLog('Не найдена ошибка максимума в купоне', LogType.ERROR);
    return;
  }
  const betErrorMessage = errorMessageElement.textContent.trim();

  const newMaximumMatch = betErrorMessage.match(newMaximumErrorRegex);
  if (newMaximumMatch) {
    const newMaximum = Number(newMaximumMatch[1]);
    germesLog(`Новый максимум: "${newMaximum}"`, LogType.ACTION);
    window.germesData.maximumStake = newMaximum;
    return;
  }
  const newMaximumShortMatch = betErrorMessage.match(newMaximumShortErrorRegex);
  if (newMaximumShortMatch) {
    const newMaximum = Number(newMaximumShortMatch[1]);
    germesLog(`Новый максимум: "${newMaximum}"`, LogType.ACTION);
    window.germesData.maximumStake = newMaximum;
    return;
  }
  const unknownMaximumMatch = betErrorMessage.match(unknownMaximumErrorRegex);
  if (unknownMaximumMatch) {
    germesLog('Нет максимума в тексте ошибки', LogType.INFO);
    const maximumMessageElement = document.querySelector(
      '.bss-NormalBetItem_MessageBody, .lbs-NormalBetItem_MessageBody',
    );
    if (!maximumMessageElement) {
      germesLog(
        'Нет ни максимума в тексте ошибки, ни отдельного элемента с максимумом',
        LogType.ERROR,
      );
      window.germesData.maximumStake = 0;
      return;
    }
    germesLog('Есть отдельный элемент с максимумом', LogType.INFO);
    const maximumMessage = maximumMessageElement.textContent.trim();

    germesLog(maximumMessage, LogType.ERROR_MESSAGE);

    const maximumMath = maximumMessage.match(newMaximumShortErrorRegex);

    if (maximumMath) {
      const newMaximum = Number(maximumMath[1]);
      germesLog(`Новый максимум: "${newMaximum}"`, LogType.ACTION);
      window.germesData.maximumStake = newMaximum;
      return;
    }
    germesLog(
      `Не удалось получить максимум из сообщения: "${maximumMessage}"`,
      LogType.ERROR,
    );
    window.germesData.maximumStake = 0;
    return;
  }
  germesLog('Неизвестный максимум', LogType.ERROR);
  window.germesData.maximumStake = 0;
};

export default updateMaximumStake;
