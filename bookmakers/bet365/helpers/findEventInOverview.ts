import { germesLog, LogType, sleep, text } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const findEventInOverview = async (): Promise<HTMLElement> => {
  const scroller = document.querySelector<HTMLElement>('.ovm-OverviewScroller');
  if (!scroller) {
    throw new JsFailError('Не найден скроллер');
  }
  const overviewContent = document.querySelector<HTMLElement>(
    '.ovm-OverviewView_Content',
  );
  if (!overviewContent) {
    throw new JsFailError('Не найден Overview');
  }
  const matches = <HTMLElement[]>[];
  const workerTeamOne = worker.TeamOne;
  const workerTeamTwo = worker.TeamTwo.replace(/_eventid\[[^\]]*]$/, '');
  germesLog(
    `Ищем событие "${workerTeamOne} - ${workerTeamTwo}"`,
    LogType.DEV_ACTION,
  );
  while (
    scroller.scrollTop !==
    overviewContent.offsetHeight - scroller.offsetHeight
  ) {
    const newMatches = [
      ...document.querySelectorAll<HTMLElement>('.ovm-Fixture'),
    ].filter((matchElement) => {
      return !matches.includes(matchElement);
    });
    scroller.scrollTo(0, overviewContent.offsetHeight - scroller.offsetHeight);
    const targetMatch = newMatches.find((match) => {
      const teamNameOneElement = match.querySelector(
        '.ovm-FixtureDetailsTwoWay_Team:nth-child(1)',
      );
      const teamNameTwoElement = match.querySelector(
        '.ovm-FixtureDetailsTwoWay_Team:nth-child(2)',
      );
      if (!teamNameOneElement) {
        throw new JsFailError('Не найдена первая команда события');
      }
      if (!teamNameTwoElement) {
        throw new JsFailError('Не найдена первая команда события');
      }
      const teamNameOne = text(teamNameOneElement);
      const teamNameTwo = text(teamNameTwoElement);
      germesLog(`${teamNameOne} - ${teamNameTwo}`, LogType.DEV_INFO);
      return teamNameOne === workerTeamOne && teamNameTwo === workerTeamTwo;
    });
    if (targetMatch) {
      return targetMatch;
    }
    matches.push(...newMatches);
    // eslint-disable-next-line no-await-in-loop
    await sleep(100);
  }
  throw new JsFailError('Событие не найдено в Overview');
};

export default findEventInOverview;
