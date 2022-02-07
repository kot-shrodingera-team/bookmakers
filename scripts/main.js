import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import build from './utils/build';
import copyTemplate from './utils/copyTemplate';
import obfuscate from './utils/obfuscate';
import setCurrentBk from './utils/setCurrentBK';
import upload from './utils/upload';

(async () => {
  const { mode, bookmakerName } = yargs(hideBin(process.argv)).argv;
  if (bookmakerName) {
    await setCurrentBk(bookmakerName);
    await copyTemplate();
  }
  if (mode === 'changeBK') {
    return;
  }
  await build();
  if (mode === 'build') {
    return;
  }
  await obfuscate();
  if (mode === 'obfuscate') {
    return;
  }
  await upload(mode);
})();
