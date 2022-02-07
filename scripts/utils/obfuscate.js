import dotenv from 'dotenv';
import fs from 'fs/promises';
import javascriptObfuscator from 'javascript-obfuscator';
import obfuscatorConfig from './obfuscator.config';

const obfuscate = async () => {
  const bookmakerName = dotenv.config({}).parsed.GERMES_CURRENT_BK;
  const inputPath = `./dist/${bookmakerName}.js`;
  const outputPath = `./dist/obfuscated/${bookmakerName}.js`;

  process.stdout.write(`Obfuscating file ${inputPath}... `);

  const content = await fs.readFile(inputPath, {
    encoding: 'utf8',
    flag: 'r',
  });
  const obfuscationResult = javascriptObfuscator.obfuscate(
    content,
    obfuscatorConfig,
  );
  process.stdout.write('Done\n');

  process.stdout.write(`Writing file ${outputPath}... `);

  await fs.writeFile(outputPath, obfuscationResult.getObfuscatedCode(), {
    encoding: 'utf8',
    flag: 'w',
  });
  process.stdout.write('Done\n');
};

export default obfuscate;
