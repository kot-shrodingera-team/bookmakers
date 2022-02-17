import { round } from '../../../utils';

const getBackSum = (sum: number) => {
  return window.germesData.additionalFields.isLay
    ? round(sum / (window.germesData.additionalFields.rawCoefficient - 1))
    : sum;
};

export default getBackSum;
