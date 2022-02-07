import getStakeInfoGeneratorOptions from '../../bookmakers/template/worker_callbacks/getStakeInfoGeneratorOptions';
import getStakeInfoGenerator from '../../utils/generators/worker_callbacks/getStakeInfoGenerator';

const getStakeInfo = getStakeInfoGenerator(getStakeInfoGeneratorOptions);

export default getStakeInfo;
