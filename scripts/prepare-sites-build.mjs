import { access, mkdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const distDirectory = resolve('dist');
const indexFile = resolve(distDirectory, 'index.html');
const workerDirectory = resolve(distDirectory, 'server');
const workerFile = resolve(workerDirectory, 'index.js');

await access(indexFile, constants.R_OK);
await mkdir(workerDirectory, { recursive: true });
await writeFile(
  workerFile,
  `export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
`,
  'utf8',
);
