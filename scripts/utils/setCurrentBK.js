import fs from 'fs/promises';

const setCurrentBk = async (bookmakerName) => {
  const dotenvPath = '.env';
  const content = `GERMES_CURRENT_BK=${bookmakerName}\n`;

  process.stdout.write(`Setting Current BK to ${bookmakerName} `);

  await fs.writeFile(dotenvPath, content, {
    encoding: 'utf8',
    flag: 'w',
  });
  process.stdout.write('Done\n');
};

export default setCurrentBk;
