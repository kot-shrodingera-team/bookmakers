import { round } from '../../../utils';

const getBackCoefficient = (coefficient: number) => {
  return window.germesData.additionalFields.isLay
    ? round(
        coefficient / (window.germesData.additionalFields.rawCoefficient - 1),
      )
    : coefficient;
};

export default getBackCoefficient;
