import { version } from '../package.json';
import { germesLog, getSessionData, LogType, setSessionData } from '../utils';
import showStake from './show_stake/showStake';

const fastLoad = async (): Promise<void> => {
  if (getSessionData('ShowStake') === '1') {
    germesLog('Предыдущее открытие купона незавершено', LogType.ERROR);
    const earlyShowStakeCount = Number(getSessionData('EarlyShowStakeCount'));
    if (Number.isNaN(earlyShowStakeCount) && earlyShowStakeCount >= 3) {
      germesLog(
        'Открытие купона не завершено в течении трёх попыток',
        LogType.ERROR,
      );
      germesLog('Перезагружаем страницу', LogType.ACTION);
      setSessionData('ShowStake', '0');
      worker.JSFail();
      window.location.reload();
      return;
    }
    if (Number.isNaN(earlyShowStakeCount)) {
      setSessionData('EarlyShowStakeCount', '0');
    } else {
      setSessionData('EarlyShowStakeCount', String(earlyShowStakeCount + 1));
    }
    worker.JSFail();
    return;
  }
  setSessionData('TransitionToEventPage', '0');
  germesLog(`[${worker.ForkId}] (v${version})`, LogType.INFO);
  showStake();
};

export default fastLoad;
