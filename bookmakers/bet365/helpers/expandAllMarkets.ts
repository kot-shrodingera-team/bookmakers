import { getElement, germesLog, LogType } from '../../../utils';

const expandAllMarkets = async (): Promise<void> => {
  // const marketHeaderButtons = [
  //   ...gameElement.querySelectorAll<HTMLElement>('.bet-title.min'),
  // ];
  // // eslint-disable-next-line no-restricted-syntax
  // for (const button of marketHeaderButtons) {
  //   button.click();
  //   // eslint-disable-next-line no-await-in-loop
  //   await sleep(0);
  // }
  const expandAllButton = await getElement<HTMLElement>(
    'button.scoreboard-nav__view-item',
  );
  if (!expandAllButton) {
    germesLog('Не найдена кнопка разворачивания всех маркетов', LogType.INFO);
    return;
  }
  if (expandAllButton.classList.contains('scoreboard-nav__btn--is-active')) {
    germesLog('Разворачиваем все маркеты', LogType.ACTION);
    expandAllButton.click();
  } else {
    germesLog('Маркеты уже развёрнуты', LogType.INFO);
  }
};

export const expandMarkets = (): void => {
  const marketHeaders = [
    ...document.querySelectorAll<HTMLElement>(
      '.sip-MarketGroupButton:not(.sip-MarketGroup_Open)',
    ),
  ];
  marketHeaders.forEach((header) => {
    header.click();
  });
};

export default expandAllMarkets;
