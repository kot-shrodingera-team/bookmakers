import { germesLog, text, awaiter, getElement, LogType } from '../../../utils';

const getPlacedBetCoefficient = async (): Promise<void> => {
  const eventNameSelector =
    '.bss-NormalBetItem_FixtureDescription, .lbs-NormalBetItem_FixtureDescription';
  const marketNameSelector =
    '.bss-NormalBetItem_Market, .lbs-NormalBetItem_Market';
  const betNameSelector = '.bss-NormalBetItem_Title, .lbs-NormalBetItem_Title';
  const betHandicapSelector =
    '.bss-NormalBetItem_Handicap, .lbs-NormalBetItem_Handicap';

  const eventNameElement = document.querySelector(eventNameSelector);
  if (!eventNameElement) {
    germesLog('Не найдено событие результата', LogType.ERROR);
    return;
  }
  const marketNameElement = document.querySelector(marketNameSelector);
  if (!marketNameElement) {
    germesLog('Не найден маркет результата', LogType.ERROR);
    return;
  }
  const betNameElement = document.querySelector(betNameSelector);
  if (!betNameElement) {
    germesLog('Не найдена роспись результата', LogType.ERROR);
    return;
  }

  const eventName = text(eventNameElement);
  const marketName = text(marketNameElement);
  const betHandicapElement = document.querySelector(betHandicapSelector);
  const betHandicap = betHandicapElement ? text(betHandicapElement) : '';

  const betNameRaw = text(betNameElement);

  const betName = betHandicap
    ? betNameRaw.replace(betHandicap, ` ${betHandicap}`)
    : betNameRaw;

  germesLog(
    `Результат:\n${eventName}\n${marketName}\n${betName}`,
    LogType.INFO,
  );

  const betReferenceElement = document.querySelector(
    '.bss-ReceiptContent_BetRef, .lbs-ReceiptContent_BetRef',
  );
  if (!betReferenceElement) {
    germesLog('Не найден Bet Ref успешной ставки', LogType.ERROR);
    return;
  }
  const betReferenceText = text(betReferenceElement);
  const betReferenceRegex = /^Bet Ref (.*)$/i;
  const betReferenceMatch = betReferenceText.match(betReferenceRegex);
  if (!betReferenceMatch) {
    germesLog(
      `Не понятный формат Bet Ref: "${betReferenceText}"`,
      LogType.ERROR,
    );
    return;
  }
  const betReference = betReferenceMatch[1];
  germesLog(`Bet Ref: "${betReference}"`, LogType.INFO);

  const myBetsDropdown = document.querySelector<HTMLElement>(
    '.mbr-MyBetsRhsModule .mbr-Header_DropDownLabel',
  );
  if (!myBetsDropdown) {
    germesLog('Не найден элемент выбора фильтра My Bets', LogType.ERROR);
    return;
  }
  if (text(myBetsDropdown) !== 'All') {
    germesLog('Переключаем на All фильтр My Bets', LogType.ACTION);
    myBetsDropdown.click();
    const myBetsDropdownAll = [
      ...document.querySelectorAll<HTMLElement>(
        '.mbr-MyBetsRhsModule .mbr-DropDownItem',
      ),
    ].find((element) => text(element) === 'All');
    if (!myBetsDropdownAll) {
      germesLog('Не найден All фильтр My Bets', LogType.ERROR);
      return;
    }
    myBetsDropdownAll.click();
    const myBetsAllSelected = await awaiter(
      () => text(myBetsDropdown) === 'All',
      1000,
    );
    if (!myBetsAllSelected) {
      germesLog(
        'Не удалось переключиться на All фильтр My Bets',
        LogType.ERROR,
      );
      return;
    }
    germesLog('Ждём появления последней ставки в My Bets', LogType.INFO);
    await getElement<HTMLElement>('.mbr-OpenBetItem');
  } else {
    germesLog('Уже выбран All фильтр My Bets', LogType.INFO);
    if (window.germesData.additionalFields.prevLastBet) {
      germesLog('Ждём обновления последней ставки в My Bets', LogType.INFO);
      const lastBetUpdated = await awaiter(
        () =>
          window.germesData.additionalFields.prevLastBet !==
          document.querySelector('.mbr-OpenBetItem'),
      );
      if (!lastBetUpdated) {
        germesLog('Не обновилась последняя ставка в My Bets', LogType.ERROR);
        return;
      }
      germesLog('Обновилась последняя ставка в My Bets', LogType.INFO);
    }
  }
  const lastBet = document.querySelector<HTMLElement>('.mbr-OpenBetItem');
  if (!lastBet) {
    germesLog('Не найдена последняя ставка в My Bets', LogType.ERROR);
    return;
  }
  if (lastBet.classList.contains('mbr-OpenBetItem_Collapsed')) {
    germesLog('Раскрываем последнюю ставку в My Bets', LogType.ACTION);
    lastBet.click();
  } else {
    germesLog('Уже раскрыта последняя ставка в My Bets', LogType.INFO);
  }

  const lastBetEventNameElement = document.querySelector(
    '.mbr-BetParticipant_FixtureName',
  );
  if (!lastBetEventNameElement) {
    germesLog('Не найдено событие последней ставки', LogType.ERROR);
    return;
  }
  const lastBetMaretNameElement = document.querySelector(
    '.mbr-BetParticipant_MarketDescription',
  );
  if (!lastBetMaretNameElement) {
    germesLog('Не найден маркет последней ставки', LogType.ERROR);
    return;
  }
  const lastBetBetNameElement = document.querySelector(
    '.mbr-BetParticipant_ParticipantSpanText',
  );
  if (!lastBetBetNameElement) {
    germesLog('Не найдена роспись последней ставки', LogType.ERROR);
    return;
  }
  const lastBetEventName = text(lastBetEventNameElement);
  const lastBetMarketName = text(lastBetMaretNameElement);
  const lastBetBetName = text(lastBetBetNameElement);

  germesLog(
    `Последняя ставка:\n${lastBetEventName}\n${lastBetMarketName}\n${lastBetBetName}`,
    LogType.INFO,
  );

  if (eventName !== lastBetEventName) {
    germesLog('Не совпадают события', LogType.ERROR);
    germesLog(`${eventName} != ${lastBetEventName}`, LogType.ERROR);
    return;
  }
  if (marketName !== lastBetMarketName) {
    germesLog('Не совпадают маркеты', LogType.ERROR);
    germesLog(`${marketName} != ${lastBetMarketName}`, LogType.ERROR);
    return;
  }
  if (betName !== lastBetBetName) {
    germesLog('Не совпадают росписи', LogType.ERROR);
    germesLog(`${betName} != ${lastBetBetName}`, LogType.ERROR);
    return;
  }

  const lastBetOddElement = document.querySelector(
    '.mbr-BetParticipant_HeaderOdds',
  );
  if (!lastBetOddElement) {
    germesLog('Не найден коэффициент последней ставки', LogType.ERROR);
    return;
  }
  const lastBetOddText = text(lastBetOddElement);
  const lastBetOdd = Number(lastBetOddText);
  if (Number.isNaN(lastBetOdd)) {
    germesLog(
      `Непонятный формат коэффициента последней ставки: "${lastBetOddText}"`,
      LogType.ERROR,
    );
    return;
  }
  germesLog(`Итоговый коэффициент: ${lastBetOdd}`, LogType.INFO);

  window.germesData.additionalFields.resultCoefficient = lastBetOdd;
};

export default getPlacedBetCoefficient;
