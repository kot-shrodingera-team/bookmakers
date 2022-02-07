import afterSuccesfulStake from '../bookmakers/template/worker_callbacks/afterSuccesfulStake';
import { germesLog, getSessionData, LogType, setSessionData } from '../utils';
import { clearGermesData } from './bookmakerApi';
import fastLoad from './fastLoad';
import initialize from './initialization/initialize';
import showStake from './show_stake/showStake';
import checkCouponLoading from './worker_callbacks/checkCouponLoading';
import checkStakeStatus from './worker_callbacks/checkStakeStatus';
import getStakeInfo from './worker_callbacks/getStakeInfo';

window.alert = (message: string): void => {
  germesLog(`Перехваченный алерт: ${message}`);
};

worker.SetCallBacks(
  germesLog,
  getStakeInfo,
  (sum: number) => {
    worker.StakeInfo.Summ = sum; // запомнить сумму для setStakeSum
    return true;
  },
  () => {
    window.germesData.doStakeTime = new Date(); // Чтобы в checkCouponLoading не было ошибки при определении timePassedSinceDoStake
    window.germesData.betProcessingStep = 'beforeStart'; // Чтобы checkCouponLoading корректно начал обработку
    return true;
  },
  checkCouponLoading,
  checkStakeStatus,
  afterSuccesfulStake,
);

worker.SetFastCallback(fastLoad);
clearGermesData();

(async (): Promise<void> => {
  if (getSessionData('ShowStake') === '1' && worker.IsShowStake) {
    // Бот считает, что сейчас открытие купона, и в сессионных данных установлен флаг ShowStake
    // То есть были fastLoad и showStake, в котором записали в сессионные данные флаг ShowStake
    // И была перезагрузка страницы, например для перехода на страницу события
    germesLog('Загрузка страницы с открытием купона', LogType.INFO);
    showStake();
  } else if (!worker.IsShowStake) {
    // Бот считает, что сейчас не открытие купона
    // Значит авторизация
    // Сбрасываем флаги сессионных данных ShowStake и TransitionToEventPage
    setSessionData('ShowStake', '0');
    setSessionData('TransitionToEventPage', '0');
    germesLog('Загрузка страницы с авторизацией', LogType.INFO);
    initialize();
  } else {
    // Бот считает, что сейчас открытие купона, но в сессионных данных не установлен флаг ShowStake
    // Значит было открытие купона, но оно накончилось
    // Не открываем купон, скорее всего просто руками ходят по сайту
    germesLog('Загрузка страницы без открытия купона', LogType.INFO);
  }
})();
