import esbuild from 'esbuild-wasm';
import CacheService from '../services/CacheService';

const UnpkgPathGenerator = (source: string) => {
  return {
    name: 'Get unpkg Path',
    setup: (build: esbuild.PluginBuild) => {
      build.onResolve({ filter: /.*/ }, (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: source,
          };
        }

        return await CacheService.getPackage(args.path);
      });
    },
  };
};

export default UnpkgPathGenerator;
