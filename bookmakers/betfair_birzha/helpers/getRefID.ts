import { germesLog, LogType, text } from '../../../utils';

const getRefID = (): number => {
  const refIDElement = document.querySelector(
    '.bet-placed-information__reference',
  );
  if (!refIDElement) {
    germesLog('Не найден RefID ставки', LogType.ERROR);
    return null;
  }
  const refIDText = text(refIDElement);
  const refIDMatch = refIDText.match(/^Ref: (\d+)$/i);
  if (!refIDMatch) {
    germesLog(`RefID в непонятном формате: ${refIDText}`, LogType.ERROR);
    return null;
  }
  return Number(refIDMatch[1]);
};

export default getRefID;
