import { germesLog, LogType, text } from '../../../utils';

const getCurrentEventName = (): string => {
  const eventNameElement = document.querySelector(
    // '.bss-NormalBetItem_FixtureDescription',
    '.lbs-NormalBetItem_FixtureDescription, .bss-NormalBetItem_FixtureDescription',
  );
  if (!eventNameElement) {
    germesLog(
      'Ошибка получения заголовка события: не найден заголовок события',
      LogType.ERROR,
    );
    return '';
  }
  return text(eventNameElement);
};

export default getCurrentEventName;
