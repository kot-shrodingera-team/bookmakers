import { awaiter, germesLog, getElement, LogType } from '../../../utils';
import { JsFailError } from '../../../utils/errors';

const setFrameReference = async (): Promise<void> => {
  const iframeSelector = '';
  const iframe = await getElement<HTMLIFrameElement>(iframeSelector, 10000);

  if (!iframeSelector) {
    throw new JsFailError('Не наден iframe');
  }
  // window.germesData.additionalFields.iframe = iframe;
  germesLog('Есть iframe', LogType.DEV_INFO);

  if (iframe.contentWindow.location.href === 'about:blank') {
    germesLog('Ждём появления документа iframe', LogType.DEV_INFO);
    const result = await awaiter(
      () => {
        return iframe.contentWindow.location.href !== 'about:blank';
      },
      10000,
      50,
    );
    if (!result) {
      throw new JsFailError('Не дождались появления документа iframe');
    }
    germesLog('Появился документ iframe', LogType.DEV_INFO);
  } else {
    germesLog('Уже есть документ iframe', LogType.DEV_INFO);
  }

  const document = await awaiter(() => {
    if (iframe.contentDocument && iframe.contentDocument.body) {
      return iframe.contentDocument;
    }
    return null;
  });
  if (!document) {
    throw new JsFailError('Документ iframe пуст');
  }
};

export default setFrameReference;
