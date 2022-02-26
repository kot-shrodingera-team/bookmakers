import { CheckAuthGeneratorOptions } from '../../../utils/generators/stake_info/checkAuthGenerator';
import { authElementSelector } from './checkAuthReadyGeneratorOptions';

const preCheck = () => {
  return true;
};

const checkAuthGeneratorOptions: CheckAuthGeneratorOptions = {
  preCheck,
  authElementSelector,
  context: () => document,
};

export default checkAuthGeneratorOptions;
