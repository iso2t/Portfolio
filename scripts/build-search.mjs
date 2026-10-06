import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import * as pagefind from 'pagefind';

async function htmlFiles(directory) {
  try {
    return (await readdir(directory, { recursive: true }))
      .filter(file => file.endsWith('.html'));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function publicRoute(file, scoped) {
  const relative = file.replaceAll('\\', '/');
  // Next.js adapter builds use route-cache/APP_PAGE/<owner hash>/$/<route>.html.
  const routeFile = scoped ? relative.split('/$/')[1] : relative;
  if (!routeFile) throw new Error(`Unrecognized Next.js HTML path: ${file}`);
  const normalized = '/' + routeFile.slice(0, -'.html'.length);
  // Undo Next.js's escaping of / and routes beginning with /index/.
  return normalized === '/index' ? '/' : normalized.replace(/^\/index\//, '/');
}

function checkErrors(result) {
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  return result;
}

try {
  const manifest = JSON.parse(await readFile('.next/prerender-manifest.json', 'utf8'));
  const expectedRoutes = new Set(Object.entries(manifest.routes)
    .filter(([pathname, route]) => !['/_global-error', '/_not-found'].includes(pathname) &&
      route.dataRoute?.endsWith('.rsc') &&
      !(route.initialStatus >= 400))
    .map(([route]) => route));
  const pages = new Map();

  for (const [directory, scoped] of [
    ['.next/server/app', false],
    ['.next/server/route-cache/APP_PAGE', true],
  ]) {
    const files = await htmlFiles(directory);
    console.log(`Search: found ${files.length} HTML files in ${directory}`);
    for (const file of files) {
      const route = publicRoute(file, scoped);
      if (!expectedRoutes.has(route) || pages.has(route)) continue;
      const content = await readFile(path.join(directory, file), 'utf8');
      if (!content.includes('data-pagefind-body')) continue;
      pages.set(route, content);
    }
  }

  const missing = [...expectedRoutes].filter(route => !pages.has(route));
  if (!pages.size || missing.length) {
    throw new Error(`Missing searchable prerendered HTML for: ${missing.join(', ') || 'all pages'}`);
  }

  const { index } = checkErrors(await pagefind.createIndex());
  if (!index) throw new Error('Pagefind did not create an index.');
  for (const [url, content] of pages) {
    checkErrors(await index.addHTMLFile({ url, content }));
  }
  checkErrors(await index.writeFiles({ outputPath: 'public/_pagefind' }));

  // An adapter may package public assets before npm's postbuild runs.
  // Include the generated search bundle in that deployment output as well.
  const vercelStatic = '.vercel/output/static';
  if (await stat(vercelStatic).then(info => info.isDirectory()).catch(error => {
    if (error.code === 'ENOENT') return false;
    throw error;
  })) {
    checkErrors(await index.writeFiles({ outputPath: `${vercelStatic}/_pagefind` }));
    console.log(`Search: included index in ${vercelStatic}/_pagefind`);
  }

  console.log(`Search: indexed ${pages.size} pages with public URLs into public/_pagefind`);
} finally {
  await pagefind.close();
}
