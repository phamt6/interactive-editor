import { OnLoadResult } from 'esbuild-wasm';
import localforage from 'localforage';

class CacheService {
  private cacheDB: LocalForage;

  constructor() {
    this.cacheDB = localforage.createInstance({
      name: 'response-cache',
    });
  }

  async getPackage(pkg: string): Promise<OnLoadResult> {
    const cachedPkg = await this.cacheDB.getItem<OnLoadResult>(pkg);
    if (cachedPkg) return cachedPkg;

    const resp = await fetch(pkg);
    const contents = await resp.text();

    const loadedPkg: OnLoadResult = {
      loader: 'jsx',
      contents,
      resolveDir: new URL('./', resp.url).pathname,
    };

    await this.cacheDB.setItem(pkg, loadedPkg);

    return loadedPkg;
  }
}

export default new CacheService();
