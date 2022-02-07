import { germesLog, LogType } from '.';

class GermesRequest {
  subscribes: {
    [url: string]: ((
      url: string,
      data: string,
      method: string,
      fullUrl: string,
    ) => unknown)[];
  };

  constructor() {
    this.subscribes = {};
  }

  subscribe(
    url: string,
    callback: (
      url: string,
      data: string,
      method: string,
      fullUrl: string,
    ) => void,
  ): void {
    if (!this.subscribes[url]) {
      this.subscribes[url] = [];
    }
    if (worker.Api.Rqst.AddRequestResponseHandler(url)) {
      this.subscribes[url].push(callback);
    } else {
      germesLog(`Не удалось подписаться на url: "${url}"`, LogType.FATAL);
    }
  }

  onResponse(url: string, data: string, method: string, fullUrl: string): void {
    if (this.subscribes[url]) {
      this.subscribes[url].forEach((callback) =>
        callback(url, data, method, fullUrl),
      );
    } else {
      germesLog(`Нет подписок для url: "${url}"`, LogType.FATAL);
    }
  }

  clearAllRequestResponseSubscribes(): void {
    this.subscribes = {};
    worker.Api.Rqst.ClearAllRequestResponseSubscribes();
  }
}

export default GermesRequest;
