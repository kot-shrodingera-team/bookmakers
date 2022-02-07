import {
  germesLog,
  getElement,
  getWorkerParameter,
  LogType,
  text,
} from '../../../utils';
import { JsFailError, NewUrlError } from '../../../utils/errors';

const checkCurrentLanguage = async (): Promise<void> => {
  const useAPI = !getWorkerParameter('dontUseAPI');

  if (
    useAPI &&
    window.Locator &&
    window.Locator.user &&
    window.Locator.user.languageId
  ) {
    const { languageId } = window.Locator.user;
    if (languageId === '1') {
      germesLog('Установлен английский язык', LogType.DEV_INFO);
      return;
    }
    germesLog(
      `Установлен не английский язык (${languageId})`,
      LogType.DEV_INFO,
    );
    germesLog('Устанавливаем английский язык', LogType.ACTION);
  }

  const accountIcon = document.querySelector<HTMLElement>(
    '.hm-MainHeaderMembersWide_MembersMenuIcon',
  );
  if (!accountIcon) {
    throw new JsFailError('Не найдена кнопка аккаунта');
  }
  accountIcon.click();
  const accountPreferencesButton = await getElement<HTMLElement>(
    '.um-PreferencesTabButton',
  );
  if (!accountPreferencesButton) {
    throw new JsFailError('Не найдена кнопка настроек аккаунта');
  }
  accountPreferencesButton.click();
  const languageLabel = document.querySelector<HTMLElement>(
    '.um-MembersInfoPreferences_Language .um-PreferenceDropDown_ButtonLabel',
  );
  if (!languageLabel) {
    throw new JsFailError('Не найдено значение опции языка');
  }
  const currentLanguage = text(languageLabel);
  if (currentLanguage === 'English') {
    germesLog('Установлен английский язык', LogType.DEV_INFO);
    accountIcon.click();
    return;
  }
  languageLabel.click();
  const languageOptions = [
    ...document.querySelectorAll<HTMLElement>('.um-PreferenceDropDownItem'),
  ];
  const englishLanguageOption = languageOptions.find(
    (option) => text(option) === 'English',
  );
  if (!englishLanguageOption) {
    throw new JsFailError('Не найден английский язык в списке языкова');
  }
  englishLanguageOption.click();
  throw new NewUrlError();
};

export default checkCurrentLanguage;
