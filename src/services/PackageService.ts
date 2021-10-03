import { OnLoadResult } from 'esbuild-wasm';
import localforage from 'localforage';
import CleanCSS from 'clean-css';

class PackageService {
  private cacheDB: LocalForage;
  private cleanCSS: CleanCSS.MinifierOutput;

  constructor() {
    this.cacheDB = localforage.createInstance({
      name: 'response-cache',
    });
    this.cleanCSS = new CleanCSS({
      level: {
        1: {
          specialComments: '0',
        },
      },
    });
  }

  private sanitizeCSS(css: string): string {
    css = css.replace(/"/g, '\\"').replace(/'/g, "\\'");

    const { styles } = this.cleanCSS.minify(css);
    return styles;
  }

  private makeContents(contents: string, isCss: Boolean): string {
    if (isCss) {
      return `
        const stylesheet = document.createElement('style');
        stylesheet.innerText = '${this.sanitizeCSS(contents)}';
        document.head.appendChild(stylesheet);
      `;
    }

    return contents;
  }

  public async getPackage(pkg: string): Promise<OnLoadResult> {
    const cachedPkg = await this.cacheDB.getItem<OnLoadResult>(pkg);
    if (cachedPkg) return cachedPkg;

    const resp = await fetch(pkg);
    const contents = this.makeContents(
      await resp.text(),
      Boolean(pkg.match(/.css$/))
    );

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
