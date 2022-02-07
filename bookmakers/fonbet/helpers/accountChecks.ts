import { getWorkerParameter, germesLog, LogType } from '../../../utils';

export const checkAccountBlocked = (): boolean => {
  if (getWorkerParameter('dontCheckBlocked') === true) {
    return false;
  }
  return window.app.session.attributes.liveBlocked;
};

export const accountBlocked = (): void => {
  if (getWorkerParameter('dontCheckBlocked') === true) {
    return;
  }
  const { payBlocked } = window.app.session.attributes;
  const message = `Аккаунт Фонбет заблокирован! ${
    payBlocked
      ? 'Вывод заблокирован, требуется верификация'
      : 'Вывод доступен, верификация не требуется'
  }. ${
    worker.SetBookmakerPaused(true)
      ? 'Фонбет поставлен на паузу'
      : 'Фонбет НЕ поставлен на паузу'
  }`;
  germesLog(message, LogType.ERROR);
  worker.Helper.SendInformedMessage(message);
};
