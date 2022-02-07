import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Заменяем
// /bookmakers/*/
// на
// /bookmakers/${bookmakerName}/
// в файлах
// src/**
// tsconfig.json
// rollup.config.js

const processFile = async (filePath, bookmakerName, disableLog = true) => {
  if (!disableLog) {
    process.stdout.write(`Processing file ${filePath} `);
  }

  const content = await fs.readFile(filePath, {
    encoding: 'utf8',
    flag: 'r',
  });
  // console.log(`----- Before -----\n${content}-----\n`);
  const modifiedContent =
    filePath === 'tsconfig.json'
      ? content.replace(
          /\/bookmakers\/([a-z0-9_]+)\//,
          `/bookmakers/${bookmakerName}/`,
        )
      : content.replaceAll(
          /\/bookmakers\/([a-z0-9_]+)\//g,
          `/bookmakers/${bookmakerName}/`,
        );
  // console.log(`----- After -----\n${modifiedContent}-----\n`);
  await fs.writeFile(filePath, modifiedContent, {
    encoding: 'utf8',
    flag: 'w',
  });

  if (!disableLog) {
    process.stdout.write('Done\n');
  }
};

const processDir = async (dirPath, bookmakerName, disableLog = true) => {
  if (!disableLog) {
    process.stdout.write(`Processing dir ${dirPath} `);
  }
  const dir = await fs.readdir(dirPath, { withFileTypes: true });

  // eslint-disable-next-line no-restricted-syntax
  for (const entry of dir) {
    const entryPath = path.join(dirPath, entry.name);
    // console.log(entryPath);
    const isFile = entry.isFile();
    // console.log(`isFile: ${isFile}`);
    if (!isFile) {
      // eslint-disable-next-line no-await-in-loop
      await processDir(entryPath, bookmakerName);
    } else {
      // eslint-disable-next-line no-await-in-loop
      await processFile(entryPath, bookmakerName);
    }
  }
  if (!disableLog) {
    process.stdout.write('Done\n');
  }
};

const copyTemplate = async () => {
  const bookmakerName = dotenv.config({}).parsed.GERMES_CURRENT_BK;
  const srcPath = 'src';
  const tsConfigPath = 'tsconfig.json';

  process.stdout.write(`Changing template to ${bookmakerName}\n`);

  await processDir(srcPath, bookmakerName);
  await processFile(tsConfigPath, bookmakerName);
};

export default copyTemplate;
