import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const rootDir = __dirname;
const distDir = resolve(rootDir, 'dist');

function copyExtensionStaticFiles() {
  return {
    name: 'copy-extension-static-files',
    buildStart() {
      rmSync(distDir, { recursive: true, force: true });
    },
    writeBundle() {
      mkdirSync(distDir, { recursive: true });
      copyFileSync(resolve(rootDir, 'manifest.json'), resolve(distDir, 'manifest.json'));

      const builtPopupPath = resolve(distDir, 'src/popup/popup.html');
      if (existsSync(builtPopupPath)) {
        const popupHtml = readFileSync(builtPopupPath, 'utf8').replaceAll('../../assets/', './assets/');
        writeFileSync(resolve(distDir, 'popup.html'), popupHtml);
        rmSync(resolve(distDir, 'src'), { recursive: true, force: true });
      }

      const assetsDir = resolve(rootDir, 'assets');
      if (existsSync(assetsDir)) {
        cpSync(assetsDir, resolve(distDir, 'assets'), { recursive: true });
      }
    }
  };
}

export default defineConfig({
  root: rootDir,
  base: './',
  publicDir: false,
  plugins: [copyExtensionStaticFiles()],
  css: {
    postcss: {
      plugins: []
    }
  },
  build: {
    outDir: distDir,
    emptyOutDir: false,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        popup: resolve(rootDir, 'src/popup/popup.html'),
        background: resolve(rootDir, 'src/background/background.js'),
        content: resolve(rootDir, 'src/content/content.js')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return '[name].js';
          }

          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
