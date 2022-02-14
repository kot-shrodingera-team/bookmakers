import { germesLog, LogType } from '.';
import { BetProcessingError, BetProcessingSuccess } from './errors';

interface PromiseWithDone<T = unknown> extends Promise<T> {
  done: boolean;
}

class BetProcessing {
  steps: Record<string, () => Promise<void>>;

  checks: Record<string, () => Promise<unknown>>;

  step: string;

  forcedStep: string;

  stepResult: unknown;

  startDateTime: Date;

  timeout: number;

  interval: number;

  betPlaced: boolean;

  constructor() {
    this.steps = null;
    this.checks = null;
    this.step = null;
    this.forcedStep = null;
    this.stepResult = null;
    this.startDateTime = new Date();
    this.timeout = 50000;
    this.interval = 50;
    this.betPlaced = null;
  }

  start = async () => {
    this.step = 'start';
    await this.transition();
  };

  transition = async () => {
    if (!(this.step in this.steps)) {
      throw new Error(`Не определён шаг обработки ставки "${this.step}"`);
    }
    germesLog(`Шаг обработки ставки: ${this.step}`, LogType.DEV_INFO);
    if (this.forcedStep) {
      this.forcedStep = null;
    }
    try {
      await this.steps[this.step]();
    } catch (error) {
      if (error instanceof BetProcessingError) {
        if (error.message) {
          germesLog(error.message, LogType.ERROR);
        }
        this.betPlaced = false;
        return;
      }
      if (error instanceof BetProcessingSuccess) {
        if (error.message) {
          germesLog(error.message, LogType.INFO);
        }
        this.betPlaced = true;
        return;
      }
      this.betPlaced = false;
      throw new Error(
        `Необрабатываемая ошибка на шаге обработки ставки "${this.step}": ${error.message}`,
      );
    }
    if (this.betPlaced !== null || this.step === 'timeout') {
      return;
    }
    if (this.forcedStep) {
      this.step = this.forcedStep;
    } else {
      const promises = Object.values(this.checks).map((func) => {
        const promise = <PromiseWithDone>func();
        promise.done = false;
        promise.then((value) => {
          promise.done = true;
          return value;
        });
        return promise;
      });
      try {
        this.stepResult = await Promise.any(promises);
      } catch (error) {
        // Если все промисы отклонены (таймаут)
        this.step = 'timeout';
        await this.transition();
        return;
      }
      // Находим индекс завершённого промиса
      const index = promises.findIndex((promise) => promise.done);
      // Находим по этому индексу следующий шаг
      this.step = index === -1 ? null : Object.keys(this.checks)[index];
      // Вроде как не может быть такого, что step некорректный
    }
    await this.transition();
  };

  addCheck = (name: string, check: () => Promise<unknown>) => {
    if (name in this.checks) {
      germesLog(
        `Невозможно добавить проверку ${name}, так как она уже есть`,
        LogType.ERROR,
      );
    } else {
      this.checks[name] = check;
    }
  };

  deleteCheck = (name: string) => {
    if (!(name in this.checks)) {
      germesLog(
        `Невозможно удалить проверку ${name}, так как её нет`,
        LogType.ERROR,
      );
    } else {
      delete this.checks[name];
    }
  };

  setNextStep = (name: string) => {
    this.forcedStep = name;
  };
}

export default BetProcessing;
