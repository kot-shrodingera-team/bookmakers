import { getWorkerParameter, getElement } from '../../../utils';

const preOpenBet = async (): Promise<void> => {
  const useAPI =
    getWorkerParameter('useAPI') === undefined
      ? false
      : getWorkerParameter('useAPI');

  if (useAPI) {
    return;
  }

  /* ========================================================================== */
  /*              Раскрытие маркетов для открытия ставки через DOM              */
  /* ========================================================================== */

  await getElement('.sip-MarketGroupButton');

  const marketHeaders = [
    ...document.querySelectorAll<HTMLElement>(
      '.sip-MarketGroupButton:not(.sip-MarketGroup_Open)',
    ),
  ];
  marketHeaders.forEach((header) => {
    header.click();
  });
};

export default preOpenBet;
