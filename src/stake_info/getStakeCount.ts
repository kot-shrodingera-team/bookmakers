import getStakeCountGeneratorOptions from '../../bookmakers/template/stake_info/getStakeCountGeneratorOptions';
import getStakeCountGenerator from '../../utils/generators/stake_info/getStakeCountGenerator';

const getStakeCount = getStakeCountGenerator(getStakeCountGeneratorOptions);

export default getStakeCount;
