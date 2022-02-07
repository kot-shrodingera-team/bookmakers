import dotenv from 'dotenv';
import { rollup } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

const build = async () => {
  const bookmakerName = dotenv.config({}).parsed.GERMES_CURRENT_BK;
  const outputPath = `./dist/${bookmakerName}.js`;
  const inputOptions = {
    input: './src/index.ts',
    plugins: [typescript(), json()],
  };
  const outputOptions = {
    file: outputPath,
    format: 'es',
  };

  process.stdout.write(`Building file ${outputPath} `);

  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
  if (bundle) {
    await bundle.close();
  }

  process.stdout.write('Done\n');
};

export default build;
