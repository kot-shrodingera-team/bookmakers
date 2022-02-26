import { germesLog, getElement, LogType } from '../../../utils';
import { NewUrlError } from '../../../utils/errors';

const afterSuccesfulLogin = async (): Promise<void> => {
  if (window.location.pathname !== '/esports') {
    germesLog('Открыт не раздел ESPORTS', LogType.DEV_INFO);
    const eSportsButton = await getElement<HTMLElement>(
      'a[href="/esports"]',
      10000,
    );
    if (eSportsButton) {
      eSportsButton.click();
      throw new NewUrlError('Переходим в раздел ESPORTS');
    }
  }
};

export default afterSuccesfulLogin;
