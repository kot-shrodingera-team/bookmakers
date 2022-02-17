import { germesLog, LogType, round, text } from '../../../utils';

const getStakedSum = async (): Promise<number> => {
  const { refID } = window.germesData.additionalFields;
  const openBets = [...document.querySelectorAll('betslip-bet')];
  if (openBets.length === 0) {
    germesLog(`Нет ставок в игре с RefID ${refID}`, LogType.INFO);
    return 0;
  }
  const targetBets = openBets.filter((openBet, index) => {
    const refIDElement = openBet.querySelector(
      '.bet-placed-information__reference',
    );
    if (!refIDElement) {
      germesLog(`Не найден RefID открытой ставки №${index + 1}`);
      return false;
    }
    return text(refIDElement).includes(String(refID));
  });
  if (targetBets.length === 0) {
    germesLog(
      `Нет ставкок в игре с RefID "${refID}". Считаем ставку не принятой`,
      LogType.INFO,
    );
    return 0;
  }
  germesLog(
    `Ставок в игре с RefID ${refID}: ${targetBets.length}`,
    LogType.INFO,
  );
  const stakedSum = round(
    targetBets.reduce((sum, nextBet, index) => {
      const nextBetSumElement = nextBet.querySelector(
        '.betslip-bet__runner-detail:nth-child(2)',
      );
      if (!nextBetSumElement) {
        germesLog(`Не найдена сумма ставки №${index + 1}`, LogType.ERROR);
        return sum;
      }
      const nextBetSumText = text(nextBetSumElement);
      const nextBetSum = Number(nextBetSumText.slice(1));
      if (Number.isNaN(nextBetSum)) {
        germesLog(
          `Не удаётся определить сумму ставки №${
            index + 1
          } (${nextBetSumText})`,
          LogType.ERROR,
        );
        return sum;
      }
      return sum + nextBetSum;
    }, 0),
  );
  return stakedSum;
};

export default getStakedSum;
