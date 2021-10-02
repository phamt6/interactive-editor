import { OnLoadResult } from 'esbuild-wasm';
import localforage from 'localforage';
import CleanCSS from 'clean-css';

class PackageService {
  private cacheDB: LocalForage;
  private cssPkg: boolean = false;

  constructor() {
    this.cacheDB = localforage.createInstance({
      name: 'response-cache',
    });
  }

  private sanitizeCSS(css: string): string {
    const cleanCSS = new CleanCSS({
      level: {
        1: {
          specialComments: '0',
        },
      },
    });

    css = css.replace(/"/g, '\\"').replace(/'/g, "\\'");

    const { styles } = cleanCSS.minify(css);
    return styles;
  }

  private makeContents(contents: string): string {
    if (this.cssPkg) {
      return `
        const stylesheet = document.createElement('style');
        stylesheet.innerText = "${this.sanitizeCSS(contents)}";
        document.head.appendChild(stylesheet);
      `;
    }

    return contents;
  }

  async getPackage(pkg: string): Promise<OnLoadResult> {
    const cachedPkg = await this.cacheDB.getItem<OnLoadResult>(pkg);
    if (cachedPkg) return cachedPkg;

    const resp = await fetch(pkg);
    this.cssPkg = Boolean(pkg.match(/.css$/));
    const contents = this.makeContents(await resp.text());

    const loadedPkg: OnLoadResult = {
      loader: 'jsx',
      contents,
      resolveDir: new URL('./', resp.url).pathname,
    };

    await this.cacheDB.setItem(pkg, loadedPkg);

    return loadedPkg;
  }
}

export default new PackageService();
