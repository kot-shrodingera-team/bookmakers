import { getElement, awaiter, germesLog, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const setFrameReference = async (): Promise<void> => {
  const bettingFrameSelector = 'iframe#liveBettingFrame, iframe#iframeESports';
  const bettingFrame = await getElement<HTMLIFrameElement>(
    bettingFrameSelector,
    10000,
  );

  if (!bettingFrame) {
    throw new JsFailError('Не найден bettingFrame');
  }
  window.germesData.additionalFields.bettingFrame = bettingFrame;
  germesLog('Есть bettingFrame', LogType.DEV_INFO);

  if (bettingFrame.contentWindow.location.href === 'about:blank') {
    germesLog('Ждём появления документа bettingFrame', LogType.DEV_INFO);
    const result = await awaiter(
      () => {
        return bettingFrame.contentWindow.location.href !== 'about:blank';
      },
      10000,
      50,
    );
    if (!result) {
      throw new JsFailError('Не дождались появления документа bettingFrame');
    }
    germesLog('Появился документ bettingFrame', LogType.DEV_INFO);
  } else {
    germesLog('Уже есть документ bettingFrame', LogType.DEV_INFO);
  }

  const document = await awaiter(() => {
    if (bettingFrame.contentDocument && bettingFrame.contentDocument.body) {
      return bettingFrame.contentDocument;
    }
    return null;
  });
  if (!document) {
    throw new JsFailError('Документ bettingFrame фрейма пуст');
  }
};

export default setFrameReference;
