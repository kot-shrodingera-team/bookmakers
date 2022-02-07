const checkAppLoaded = (): boolean => {
  // eslint-disable-next-line no-underscore-dangle
  return window.app && window.app.lineManager && window.app._ready;
};

export default checkAppLoaded;
