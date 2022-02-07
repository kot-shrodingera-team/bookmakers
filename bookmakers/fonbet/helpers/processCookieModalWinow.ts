import { germesLog, LogType } from '../../../utils';

const processCookieModalWindow = (): void => {
  const cookieModalWindow = document.querySelector('._cookie-policy');
  if (cookieModalWindow) {
    germesLog('Есть окно с сообщением о Cookies', LogType.INFO);
    const acceptCookies = document.querySelector<HTMLElement>(
      '._cookie-policy ~ .modal-window__button-area a.modal-window__button',
    );
    if (acceptCookies) {
      germesLog('Нажимаем кнопку "Согласен"', LogType.ACTION);
      acceptCookies.click();
    } else {
      germesLog('Не найдена кнопка "Согласен"', LogType.ERROR);
    }
  }
};

export default processCookieModalWindow;
