import { AuthorizeGeneratorOptions } from '../../../utils/generators/initialization/authorizeGenerator';
// import {
//   balanceReady,
//   updateBalance,
// } from '../../../src/stake_info/getBalance';
// import { getElement, log, resolveRecaptcha } from '../../../utils';
// import { authElementSelector } from '../stake_info/checkAuthReadyGeneratorOptions';
// import afterSuccesfulLogin from './afterSuccesfulLogin';

// const preCheck = async (): Promise<boolean> => {
//   return true;
// };

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
  // preCheck,
  // openForm: {
  //   selector: '',
  //   openedSelector: '',
  //   beforeOpenDelay: 0,
  //   loopCount: 1,
  //   triesInterval: 2000,
  //   afterOpenDelay: 0,
  // },
  // preInputCheck,
  loginInputSelector: 'input#ssc-liu',
  passwordInputSelector: 'input#ssc-lipw',
  // beforePasswordInputDelay: 0,
  submitButtonSelector: 'input#ssc-lis',
  // inputType: 'fireEvent',
  fireEventNames: ['keyup'],
  // beforeSubmitDelay: 0,
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
