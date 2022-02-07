import { getWorkerParameter } from '../../../utils';
import { checkAccountLimited, accountLimited } from '../helpers/accountChecks';
import checkCurrentLanguage from '../helpers/checkCurrentLanguage';

const afterSuccesfulLogin = async (): Promise<void> => {
  if (
    !getWorkerParameter('fakeAuth') &&
    !getWorkerParameter('disableAccountChecks')
  ) {
    if (!getWorkerParameter('disableLanguageCheck')) {
      await checkCurrentLanguage();
    }
    if (!getWorkerParameter('disableAccountLimitedCheck')) {
      if (await checkAccountLimited()) {
        accountLimited();
      }
    }
  }
};

export default afterSuccesfulLogin;
