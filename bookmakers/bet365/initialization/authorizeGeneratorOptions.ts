import { AuthorizeGeneratorOptions } from '../../../utils/generators/initialization/authorizeGenerator';
// import {
//   balanceReady,
//   updateBalance,
// } from '../../../src/stake_info/getBalance';
// import { getElement, log, resolveRecaptcha } from '../../../utils';
// import { authElementSelector } from '../stake_info/checkAuthReadyGeneratorOptions';
// import afterSuccesfulLogin from './afterSuccesfulLogin';
import { domFullLoaded, germesLog, LogType } from '../../../utils';

const preCheck = async (): Promise<boolean> => {
  germesLog('Ожидаем загрузки DOM', LogType.DEV_INFO);
  await domFullLoaded();
  germesLog('DOM загружен', LogType.DEV_INFO);
  return true;
};

// const preInputCheck = async (): Promise<boolean> => {
//   return true;
// };

// const beforeSubmitCheck = async (): Promise<boolean> => {
//   // const recaptchaIFrame = await getElement('iframe[title="reCAPTCHA"]', 1000);
//   // if (recaptchaIFrame) {
//   //   log('Есть капча. Пытаемся решить', 'orange');
//   //   try {
//   //     await resolveRecaptcha(window);
//   //   } catch (e) {
//   //     if (e instanceof Error) {
//   //       log(e.message, 'red');
//   //     }
//   //     return false;
//   //   }
//   // } else {
//   //   log('Нет капчи', 'steelblue');
//   // }
//   return true;
// };

// const afterSubmitCheck = async (): Promise<boolean> => {
//   return true;
// };

const authorizeGeneratorOptions: AuthorizeGeneratorOptions = {
  preCheck,
  openForm: {
    selector: '.hm-MainHeaderRHSLoggedOutWide_Login',
    openedSelector: '.lms-StandardLogin_Container',
    beforeOpenDelay: 5000,
    loopCount: 1,
    triesInterval: 3000,
    afterOpenDelay: 3000,
  },
  // preInputCheck,
  loginInputSelector: 'input.lms-StandardLogin_Username',
  passwordInputSelector: 'input.lms-StandardLogin_Password',
  beforePasswordInputDelay: 2000,
  submitButtonSelector: '.lms-LoginButton',
  // inputType: 'fireEvent',
  // fireEventNames: ['input'],
  beforeSubmitDelay: 2000,
  // beforeSubmitCheck,
  // afterSubmitCheck,
  // loginedWait: {
  //   loginedSelector: authElementSelector,
  //   timeout: 5000,
  //   balanceReady,
  //   updateBalance,
  //   afterSuccesfulLogin,
  // },
  // context: () => document,
};

export default authorizeGeneratorOptions;
