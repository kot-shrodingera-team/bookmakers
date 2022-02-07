import { getElement } from '../../../utils';

const changeToStandardBetslip = async (): Promise<boolean> => {
  window.BetSlipLocator.betSlipManager.betslip.activeModule.quickBetslipMoveToStandard();
  const expandedBetslip = await getElement(
    '.bss-BetslipStandardModule_Expanded, .lbs-StandardBetslip',
  );
  if (!expandedBetslip) {
    return false;
  }
  return true;
};

export default changeToStandardBetslip;
