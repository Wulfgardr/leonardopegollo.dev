import { access, mkdir, readdir, rename, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const distDirectory = resolve('dist');
const indexFile = resolve(distDirectory, 'index.html');
const clientDirectory = resolve(distDirectory, 'client');
const workerDirectory = resolve(distDirectory, 'server');
const workerFile = resolve(workerDirectory, 'index.js');

await access(indexFile, constants.R_OK);
await mkdir(clientDirectory, { recursive: true });

for (const entry of await readdir(distDirectory, { withFileTypes: true })) {
  if (['.openai', 'client', 'server'].includes(entry.name)) continue;
  await rename(
    resolve(distDirectory, entry.name),
    resolve(clientDirectory, entry.name),
  );
}

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
