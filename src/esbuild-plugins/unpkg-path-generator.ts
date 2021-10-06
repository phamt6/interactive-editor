import esbuild from 'esbuild-wasm';
import PackageService from '../services/PackageService';

const UnpkgPathGenerator = (source: string) => {
  return {
    name: 'Get unpkg Path',
    setup: (build: esbuild.PluginBuild) => {
      build.onResolve({ filter: /.*/ }, (args: esbuild.OnResolveArgs) => {
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'unpkg-gen' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'unpkg-gen',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }

        return {
          namespace: 'unpkg-gen',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: source,
          };
        }

        return await PackageService.getPackage(args.path);
      });
    },
  };
};

export default UnpkgPathGenerator;
