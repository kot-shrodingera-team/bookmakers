import dotenv from 'dotenv';
// eslint-disable-next-line import/no-unresolved
import { fileFromPath } from 'formdata-node/file-from-path';
import { FormData } from 'formdata-node';
import fetch from 'node-fetch';

const upload = async (mode) => {
  const bookmakerName = dotenv.config({}).parsed.GERMES_CURRENT_BK;
  const LOGIN = 'vladiq';
  const PASSWORD =
    '143665125363ea20f16be0a5a99b4c8053f0d0cabd55ecbfd1d49b5f7a3febc6';
  const url = `http://95.142.46.215/update.theforks.ru/js_injections/uploader.php?login=${LOGIN}&password=${PASSWORD}`;
  const filePath = `./dist/obfuscated/${bookmakerName}.js`;

  process.stdout.write(`Uploading file ${filePath} `);

  const formData = new FormData();
  const aliasId = (() => {
    if (mode === 'uploadProduction') {
      return 1;
    }
    if (mode === 'uploadDevelopment') {
      return 3;
    }
    throw new Error('Unknown upload alias');
  })();
  formData.append('alias_id', aliasId);
  const file = await fileFromPath(filePath, {
    type: 'text/javascript',
  });
  formData.append('filename', file);
  await fetch(url, {
    method: 'POST',
    body: formData,
  });
  process.stdout.write('Done\n');
};

export default upload;
