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
    const url = new URL(request.url);
    const lastSegment = url.pathname.split('/').at(-1) ?? '';

    if (!lastSegment.includes('.')) {
      url.pathname = url.pathname.endsWith('/')
        ? \`\${url.pathname}index.html\`
        : \`\${url.pathname}/index.html\`;
    }

    return env.ASSETS.fetch(new Request(url, request));
  },
};
`,
  'utf8',
);
