interface GermesWorker {
  Api: {
    DomEventsHelper: {
      KeyPress: (charCode: number) => void;
      KeyDown: (charCode: number) => void;
      KeyUp: (charCode: number) => void;
    };
    Rqst: {
      /**
       * Подписка на ответы с указанного url,
       * после этого, при появлении ответа на какой-либо HTTP-запрос с данным url,
       * будет выполнено window.request.onResponse(url, data, method, fullUrl)
       * @param url
       */
      AddRequestResponseHandler: (url: string) => boolean;
      /**
       * Очиста подписки на все url
       */
      ClearAllRequestResponseSubscribes: () => void;
    };
  };
  /**
   * Флаг режима разработки
   */
  Dev: boolean;
  /**
   * Установка колбеков, которые бот будет вызывать
   * @param consoleLog Метод логгирования, непонятно на что влияет
   * @param getStakeInfo Получение информации о ставке
   * (минимальная, максимальная суммы ставок, коеффициент, параметр),
   * данные записываются в объект worker.StakeInfo
   * @param setStakeSumm Указание суммы ставки
   * (бот определяет аргумент sum, а сама функция должна вбить эту сумму в купон).
   * Если вбили сумму, возвращаем true,
   * если какие-то проблемы или ошибка (например, не нашли поле ввода суммы), возвращаем false
   * @param doStake Принятие ставки (нажатие на кнопку принятия).
   * Если нажали, возвращаем true,
   * если какие-то проблемы или ошибка (например, не нашли кнопку), возвращаем false
   * @param checkCouponLoading Проверка, грузится ли ещё купон (обрабатывается ставка).
   * Если ещё грузится (результат не известен, принялась или нет), возвращаем true,
   * бот повторит этот же колбек через секунду,
   * если загрузка закончилась, неважно, принялась ставка или нет, возвращаем false,
   * бот выполнит следующий колбек
   * @param checkStakeStatus Проверка, принялась ли ставка.
   * Если ставка принята и всё ок, возвращаем true,
   * тогда бот заканчивает работу с этим плечом и считает, что ставка сделана,
   * если ставка не принялась (например, упал кэф или ставка больше недоступна), возвращаем false,
   * тогда бот опять начнёт начнёт с getStakeInfo()
   * @param afterSuccessfulStake Действия после успешной ставки
   */
  SetCallBacks: (
    consoleLog: (str: string) => void,
    getStakeInfo: () => string | void,
    setStakeSumm: (stakeSum: number) => boolean,
    doStake: () => boolean,
    checkCouponLoading: () => boolean,
    checkStakeStatus: () => boolean,
    afterSuccessfulStake?: () => void,
  ) => void;
  /**
   * Установка колбека быстрого открытия купона
   * @param FastLoad Функция быстрого открытия купона
   */
  SetFastCallback: (FastLoad: () => void) => void;
  /**
   * Выполнение JS кода во всех фреймах страницы
   * @param code Выполняемый код
   */
  ExecuteCodeInAllFrames: (code: string) => void;
  Helper: {
    /**
     * Вывод сообщения в боковой лог конторы
     * @param message Текст сообщения
     */
    WriteLine: (message: string) => void;
    /**
     * Вывод цветного сообщения в боковой лог конторы
     * @param message Текст сообщения
     * @param r Красная составляющая цвета
     * @param g Зелёная составляющая цвета
     * @param b Синяя составляющая цвета
     */
    WriteLineRGB: (message: string, r?: number, g?: number, b?: number) => void;
    /**
     * Отправка сообщения в Телеграм
     * @param message Текст сообщения
     */
    SendInformedMessage: (message: string) => void;
    /**
     * Открытие страницы в браузере
     * @param url адрес страницы
     */
    LoadUrl: (url: string) => void;
  };
  /**
   * Api ключ бота
   */
  ApiKey: string;
  /**
   * ID вилки (из БД на сервере)
   */
  ForkId: string;
  /**
   * Флаг, который устанавливается в true, когда обрабатывается вилка в боте
   */
  IsShowStake: boolean;
  /**
   * Логин аккаунта данной бк, указывается в боте
   */
  Login: string;
  /**
   * Пароль аккаунта данной бк, указывается в боте
   */
  Password: string;
  /**
   * Состояние авторизации. Но бот получает изменение только после worker.JSLogined()
   */
  Islogin: boolean;
  /**
   * Тип конторы. ЦУПИС (true) или офшор (false)
   */
  IsRu: boolean;
  /**
   * Основной URL конторы. Вшитый по умолчанию или указанный вручную в настройках
   */
  BookmakerMainUrl: string;
  /**
   * URL конторы, который открывается при авторизации. Формируется на основе BookmakerMainUrl
   */
  BookmakerLoginUrl: string;
  /**
   * Обновление состояния авторизации (в значение worker.Islogin)
   */
  JSLogined: () => void;
  /**
   * Сообщение боту, что открытие (именно открытие) купона не удалось
   */
  JSFail: () => void;
  /**
   * Сообщение боту, что открытие (именно открытие) купона успешно завершилось
   */
  JSStop: () => void;
  /**
   * Обновление баланса. Можно вызывать в любом месте
   * @param balance Значение баланса
   */
  JSBalanceChange: (balance: number) => void;
  /**
   * Снятие скриншотов контор и создание нового шага в логах
   * @param saveAsBreaked Не особо понятно, на что влияет, лучше ставить true
   * @returns true, если получилось, false, если нет
   */
  TakeScreenShot: (saveAsBreaked: boolean) => boolean;
  /**
   * Версия бота
   */
  BotVer: string;
  /**
   * Валюта конторы в боте
   */
  Currency: string;
  /**
   * ID валюты конторы в боте
   */
  CurrencyId: string;
  /**
   * Курс валюты в боте, относительно рубля
   */
  CurrencyRate: number;
  /**
   * Номер плеча конторы в текущей вилке
   */
  ShoulderNumber: number;
  /**
   * Режим принятия ставок конторы на текущем плече
   * 0 - только с текущим кэфом
   * 1 - с повышением коэффициента
   * 2 - с любым изменением коэффициента
   */
  StakeAcceptRuleShoulder: number;
  /**
   * Размер комиссии для бирж ставок
   */
  ProfitCommission: number;
  /**
   * Ставить контору на паузу при порезке аккаунта
   */
  PauseOnLimitedAccount: boolean;
  /**
   * ID конторы в боте
   */
  BookmakerId: string;
  /**
   * Имя конторы в боте
   */
  BookmakerName: string;
  /**
   * ID спорта в боте
   */
  SportId: number;
  /**
   * Название события в виде '[teamOne] vs [teamTwo]'
   */
  EventTeams: string;
  /**
   * Название первой команды/игрока
   */
  TeamOne: string;
  /**
   * Название второй команды/игрока
   */
  TeamTwo: string;
  /**
   * Объект ставки в виде JSON-строки
   */
  ForkObj: string;
  /**
   * ID ставки. Информация, используя которую можно найти конкретную ставку
   */
  BetId: string;
  /**
   * ID события. Информация, используя которую можно найти конкретное событие
   */
  EventId: string;
  /**
   * URL события. Может отсутсвовать или указывать на главную страницу бк
   */
  EventUrl: string;
  /**
   * Текстовая роспись ставки
   */
  BetName: string;
  /**
   * Количество попыток авторизации
   */
  LoginTry: number;
  /**
   * Проверка существования сессионных данных
   * @param  key Ключ в словаре
   * @returns true, если ключ существует, false, если ключ не существует
   */
  SessionDataKeyExists: (key: string) => boolean;
  /**
   * Получение сессионных данных
   * @param key Ключ в словаре
   * @returns Значение, если ключ существует, null, если ключ не существует
   */
  GetSessionData: (key: string) => string;
  /**
   * Установка сессионных данных
   * @param key Ключ в словаре
   * @param value Новое значение
   * @returns true, если значение успешно изменилось, иначе false
   */
  SetSessionData: (key: string, value: string) => boolean;
  /**
   * Изменение состояния паузы конторы в текущей сессии
   * @param pause true чтобы поставить на паузу, false - чтобы снять с паузы
   * @returns true, если состояние паузы успешно изменилось, иначе false
   */
  SetBookmakerPaused: (pause: boolean) => boolean;

  /**
   * Данные о ставке
   */
  StakeInfo: {
    /**
     * Текущий баланс аккаунта
     */
    Balance: number;
    /**
     * Состояние авторизации
     */
    Auth: boolean;
    /**
     * Количество открытых ставок
     */
    StakeCount: number;
    /**
     * Минимальная сумма ставки (которую допускает контора)
     */
    MinSumm: number;
    /**
     * Максимальная сумма ставки (которую допускает контора)
     */
    MaxSumm: number;
    /**
     * Текущая сумма ставки в купоне
     */
    Summ: number;
    /**
     * Доступность ставки (можно ли сейчас её сделать)
     */
    IsEnebled: boolean;
    /**
     * Коеффициент ставки
     */
    Coef: number;
    /**
     * Параметр ставки (для фор, тоталов и тд)
     */
    Parametr: number;
  };
  /**
   * Старые параметры воркера для этой БК (в JSON формате)
   */
  WorkerParameters: string;
  /**
   * Параметры воркера для этой БК (в JSON формате)
   */
  BookmakerAdditionalOptions: string;
  /**
   * RuCaptcha Api ключ
   */
  RuCaptchaApiKey: string;
  /**
   * Функция обновления максимальной ставки в ручнике
   */
  JSMaxChange: (newMax: number) => unknown;
  /**
   * Функция обновления коэффициента в ручнике
   */
  JSCoefChange: (newCoef: number) => unknown;
  /**
   * Функция обновления параметра ставки в ручнике
   */
  JSParameterChange: (newParameter: number) => unknown;
  /**
   * Функция обновления доступности ставки в ручнике
   */
  JSEnabledChange: (newStakeEnabled: boolean) => unknown;
}

declare global {
  const worker: GermesWorker;
}

export {};
