import checkCouponLoadingGeneratorOptions from '../../bookmakers/template/worker_callbacks/checkCouponLoadingGeneratorOptions';
import checkCouponLoadingGenerator from '../../utils/generators/worker_callbacks/checkCouponLoadingGenerator';

const checkCouponLoading = checkCouponLoadingGenerator(
  checkCouponLoadingGeneratorOptions,
);

export default checkCouponLoading;
