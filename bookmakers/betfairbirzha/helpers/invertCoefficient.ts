import { round } from '../../../utils';

const invertCoefficient = (coefficient: number): number => {
  return round(coefficient / (coefficient - 1), 3);
};

export default invertCoefficient;
