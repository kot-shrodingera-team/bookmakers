import {
  germesLog,
  LogType,
  getWorkerParameter,
  awaiter,
  getElement,
  toFormData,
} from '../../../utils';
import { NewUrlError, JsFailError } from '../../../utils/errors';
import findEventInOverview from '../helpers/findEventInOverview';

const openEvent = async (): Promise<void> => {
  const useAPI =
    getWorkerParameter('useAPI') === undefined
      ? false
      : getWorkerParameter('useAPI');

  /* ======================================================================== */
  /*                   Определение времени матча для футбола                  */
  /* ======================================================================== */

  const prematchOnly = getWorkerParameter('prematchOnly');
  const sendLiveMatchTime = getWorkerParameter('sendLiveMatchTime');
  if (prematchOnly || sendLiveMatchTime) {
    if (window.location.hash !== '#/IP/B1') {
      germesLog('Открываем Overview футбола', LogType.ACTION);
      window.location.hash = '#/IP/B1';
      const footballIconSelected = await getElement(
        '.ovm-ClassificationBarButton-1.ovm-ClassificationBarButton-active',
      );
      if (!footballIconSelected) {
        throw new JsFailError('Иконка футбола не стала активной');
      }
    }
    await getElement('.ovm-Fixture');
    const targetMatch = await findEventInOverview();
    if (!targetMatch) {
      window.location.reload();
      throw new NewUrlError('События не найдены. Перезагружаем страницу');
    }
    germesLog('Определяем время матча', LogType.INFO);
    await awaiter(() => {
      const timerElement = targetMatch.querySelector('.ovm-InPlayTimer');
      if (!timerElement) {
        return false;
      }
      return timerElement.textContent.trim();
    });
    const timerElement = targetMatch.querySelector('.ovm-InPlayTimer');
    if (!timerElement) {
      throw new JsFailError('Не найдено время матча');
    }
    const matchTime = timerElement.textContent.trim();
    germesLog(`Время матча: ${matchTime}`);
    if (matchTime !== '00:00') {
      if (sendLiveMatchTime) {
        germesLog('Отправляем время матча', LogType.ACTION);
        const bodyData = toFormData({
          bot_api: worker.ApiKey,
          fork_id: worker.ForkId,
          event_id: worker.EventId,
          match_time: matchTime,
        });
        fetch('https://strike.ws/bet_365_event_duration.php', {
          method: 'POST',
          body: bodyData,
        });
      }
      if (prematchOnly) {
        throw new JsFailError('Матч уже начался');
      }
    }
  }

  /* ======================================================================== */
  /*                            Переход на событие                            */
  /* ======================================================================== */

  if (useAPI) {
    return;
  }

  if (window.location.href === worker.EventUrl) {
    germesLog('Уже открыто нужное событие', LogType.INFO);
    return;
  }
  germesLog(`${window.location.href} !== ${worker.EventUrl}`, LogType.DEV_INFO);
  germesLog('Открываем страницу события', LogType.DEV_ACTION);
  window.location.href = worker.EventUrl;
};

export default openEvent;
