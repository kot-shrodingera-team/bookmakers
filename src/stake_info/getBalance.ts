import getBalanceGeneratorOptions, {
  preUpdateBalance,
} from '../../bookmakers/template/stake_info/getBalanceGeneratorOptions';
import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '../../utils/generators/stake_info/getStakeInfoValueGenerator';

const getBalance = getStakeInfoValueGenerator(getBalanceGeneratorOptions);

export const balanceReady = stakeInfoValueReadyGenerator(
  getBalanceGeneratorOptions,
);

export const updateBalance = (): void => {
  preUpdateBalance();
  worker.StakeInfo.Balance = getBalance();
  worker.JSBalanceChange(getBalance());
};

export default getBalance;
