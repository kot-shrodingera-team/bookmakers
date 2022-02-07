import { germesLog, LogType } from '../../../utils';
import { CheckAuthGeneratorOptions } from '../../../utils/generators/stake_info/checkAuthGenerator';
import { authElementSelector } from './checkAuthReadyGeneratorOptions';

const preCheck = () => {
  const loginForm = document.querySelector('.lms-StandardLogin_Container');
  if (loginForm) {
    germesLog('Есть форма логина. Авторизации нет', LogType.ERROR);
    return false;
  }
  return true;
};

const checkAuthGeneratorOptions: CheckAuthGeneratorOptions = {
  preCheck,
  authElementSelector,
  context: () => document,
};

export default checkAuthGeneratorOptions;
