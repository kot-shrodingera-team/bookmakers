import { InitializeGeneratorOptions } from '../../../utils/generators/initialization/initializeGenerator';
import authorize from '../../../src/initialization/authorize';
import checkAuth from '../../../src/stake_info/checkAuth';
import checkAuthReady from '../../../src/stake_info/checkAuthReady';
import {
  balanceReady,
  updateBalance,
} from '../../../src/stake_info/getBalance';
import afterSuccesfulLogin from './afterSuccesfulLogin';

const initializeGeneratorOptions: InitializeGeneratorOptions = {
  checkAuthReady,
  // checkAuthReadyTimeout: 5000,
  checkAuth,
  balanceReady,
  updateBalance,
  authorize,
  afterSuccesfulLogin,
};

export default initializeGeneratorOptions;
