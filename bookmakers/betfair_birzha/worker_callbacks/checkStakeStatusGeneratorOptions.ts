import { updateBalance } from '../../../src/stake_info/getBalance';
import { CheckStakeStatusGeneratorOptions } from '../../../utils/generators/worker_callbacks/checkStakeStatusGenerator';

const checkStakeStatusGeneratorOptions: CheckStakeStatusGeneratorOptions = {
  updateBalance,
};

export default checkStakeStatusGeneratorOptions;
