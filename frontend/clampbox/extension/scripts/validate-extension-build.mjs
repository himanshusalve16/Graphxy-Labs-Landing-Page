import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const manifestPath = join(distDir, 'manifest.json');
const failures = [];

function fail(message) {
  failures.push(message);
}

function assertExists(relativePath, context) {
  const normalized = normalize(relativePath).replace(/^(\.\.[/\\])+/, '');
  const fullPath = join(distDir, normalized);
  if (!existsSync(fullPath)) {
    fail(`${context} references missing file: ${relativePath}`);
  }
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`Unable to parse JSON: ${path} (${error.message})`);
    return null;
  }
}

if (!existsSync(manifestPath)) {
  fail('dist/manifest.json is missing. Run npm run build before validation.');
} else {
  const manifest = readJson(manifestPath);

  if (manifest) {
    if (manifest.manifest_version !== 3) {
      fail('manifest_version must be 3.');
    }

    if (!manifest.background?.service_worker) {
      fail('Manifest is missing background.service_worker.');
    } else {
      assertExists(manifest.background.service_worker, 'background.service_worker');
    }

    if (!manifest.action?.default_popup) {
      fail('Manifest is missing action.default_popup.');
    } else {
      assertExists(manifest.action.default_popup, 'action.default_popup');
    }

    for (const [size, iconPath] of Object.entries(manifest.icons || {})) {
      assertExists(iconPath, `icons.${size}`);
    }

    for (const [size, iconPath] of Object.entries(manifest.action?.default_icon || {})) {
      assertExists(iconPath, `action.default_icon.${size}`);
    }

    for (const [index, script] of (manifest.content_scripts || []).entries()) {
      for (const jsPath of script.js || []) {
        assertExists(jsPath, `content_scripts[${index}].js`);
      }

      for (const cssPath of script.css || []) {
        assertExists(cssPath, `content_scripts[${index}].css`);
      }
    }

    if (manifest.action?.default_popup) {
      const popupPath = join(distDir, manifest.action.default_popup);
      if (existsSync(popupPath)) {
        const popupHtml = readFileSync(popupPath, 'utf8');

        for (const match of popupHtml.matchAll(/<(script|link|img|source|iframe|object|embed)\b[^>]*\b(?:src|href)="([^"]+)"/g)) {
          if (/^(?:https?:)?\/\//.test(match[2])) {
            fail(`popup.html loads remote resource: ${match[2]}`);
          }
        }

        for (const match of popupHtml.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
          const assetPath = match[1];
          if (
            assetPath.startsWith('#') ||
            assetPath.startsWith('mailto:') ||
            assetPath.startsWith('chrome-extension:')
          ) {
            continue;
          }

          if (/^(?:https?:)?\/\//.test(assetPath)) {
            continue;
          }

          assertExists(join(dirname(manifest.action.default_popup), assetPath), `popup.html ${match[0]}`);
        }
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Clampbox extension build validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Clampbox extension build validation passed.');
