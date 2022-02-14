// eslint-disable-next-line max-classes-per-file
export class JsFailError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, JsFailError.prototype);
  }
}

export class NewUrlError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, NewUrlError.prototype);
  }
}

export class BetProcessingError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, BetProcessingError.prototype);
  }
}

export class BetProcessingSuccess extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, BetProcessingSuccess.prototype);
  }
}
