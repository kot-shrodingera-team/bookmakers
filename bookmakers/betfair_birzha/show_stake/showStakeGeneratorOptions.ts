import { ShowStakeGeneratorOptions } from '../../../utils/generators/show_stake/showStakeGenerator';
import { clearGermesData } from '../../../src/bookmakerApi';
import checkStakeEnabled from '../../../src/stake_info/checkStakeEnabled';
import getCoefficient from '../../../src/stake_info/getCoefficient';
import getMaximumStake from '../../../src/stake_info/getMaximumStake';
import getParameter from '../stake_info/getParameter';
import openBet from './openBet';
import openEvent from './openEvent';
import preOpenBet from './preOpenBet';
import preOpenEvent from './preOpenEvent';
import setBetAcceptMode from './setBetAcceptMode';

const showStakeGeneratorOptions: ShowStakeGeneratorOptions = {
  clearGermesData,
  preOpenEvent,
  openEvent,
  preOpenBet,
  openBet,
  setBetAcceptMode,
  getMaximumStake,
  getCoefficient,
  getParameter,
  getStakeEnabled: checkStakeEnabled,
};

export default showStakeGeneratorOptions;
