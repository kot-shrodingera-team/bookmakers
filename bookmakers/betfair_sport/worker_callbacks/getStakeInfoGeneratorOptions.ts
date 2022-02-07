import showStake from '../../../src/show_stake/showStake';
import checkAuth from '../../../src/stake_info/checkAuth';
import checkStakeEnabled from '../../../src/stake_info/checkStakeEnabled';
import getBalance from '../../../src/stake_info/getBalance';
import getCoefficient from '../../../src/stake_info/getCoefficient';
import getCurrentSum from '../../../src/stake_info/getCurrentSum';
import getMaximumStake from '../../../src/stake_info/getMaximumStake';
import getMinimumStake from '../../../src/stake_info/getMinimumStake';
import getStakeCount from '../../../src/stake_info/getStakeCount';
import { GetStakeInfoGeneratorOptions } from '../../../utils/generators/worker_callbacks/getStakeInfoGenerator';
import getParameter from '../stake_info/getParameter';

const isReShowStakeNeeded = () => {
  return false;
};

const preAction = (): void => {};

const getStakeInfoGeneratorOptions: GetStakeInfoGeneratorOptions = {
  reShowStake: {
    isNeeded: isReShowStakeNeeded,
    showStake,
  },
  preAction,
  checkAuth,
  getStakeCount,
  getBalance,
  getMinimumStake,
  getMaximumStake,
  getCurrentSum,
  checkStakeEnabled,
  getCoefficient,
  getParameter,
};

export default getStakeInfoGeneratorOptions;
