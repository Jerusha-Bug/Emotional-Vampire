02:33:03.542 Running build in Washington, D.C., USA (East) – iad1
02:33:03.542 Build machine configuration: 2 cores, 8 GB
02:33:03.725 Cloning github.com/Jerusha-Bug/Emotional-Vampire (Branch: main, Commit: 8aaa3cb)
02:33:04.180 Cloning completed: 455.000ms
02:33:04.598 Restored build cache from previous deployment (7T1u2TpQ6BrdMDsJYFg9yq2gNvjM)
02:33:06.334 Running "vercel build"
02:33:06.955 Vercel CLI 50.28.0
02:33:07.746 Installing dependencies...
02:33:08.893 
02:33:08.894 up to date in 885ms
02:33:08.894 
02:33:08.894 39 packages are looking for funding
02:33:08.895   run `npm fund` for details
02:33:08.931 Running "npm run build"
02:33:09.027 
02:33:09.028 > build
02:33:09.028 > react-router build
02:33:09.028 
02:33:10.344 [36mvite v7.3.1 [32mbuilding client environment for production...[36m[39m
02:33:10.389 transforming...
02:33:11.261 [32m✓[39m 35 modules transformed.
02:33:11.265 [31m✗[39m Build failed in 887ms
02:33:11.267 [31m[vite:esbuild] Transform failed with 1 error:
02:33:11.267 /vercel/path0/app/components/EnergyApp.jsx:1058:59: ERROR: Unexpected "}"[39m
02:33:11.267 file: [36m/vercel/path0/app/components/EnergyApp.jsx:1058:59[39m
02:33:11.267 [33m
02:33:11.267 [33mUnexpected "}"[33m
02:33:11.267 1056 |              return (
02:33:11.267 1057 |                <section className="mb-4 relative overflow-hidden"
02:33:11.267 1058 |    style={{background:`${rc}0.12)`, borderRadius:'24px', ...}}>
02:33:11.267      |                                                             ^
02:33:11.267 1059 |    <Fingerprint className="absolute top-3 right-3 w-16 h-16 pointer-events-none"
02:33:11.268 1060 |      style={{color:`${rc}0.30)`, strokeWidth:1}} />
02:33:11.268 [39m
02:33:11.268     at failureErrorWithLog (/vercel/path0/node_modules/esbuild/lib/main.js:1467:15)
02:33:11.268     at /vercel/path0/node_modules/esbuild/lib/main.js:736:50
02:33:11.268     at responseCallbacks.<computed> (/vercel/path0/node_modules/esbuild/lib/main.js:603:9)
02:33:11.268     at handleIncomingPacket (/vercel/path0/node_modules/esbuild/lib/main.js:658:12)
02:33:11.268     at Socket.readFromStdout (/vercel/path0/node_modules/esbuild/lib/main.js:581:7)
02:33:11.268     at Socket.emit (node:events:508:28)
02:33:11.268     at addChunk (node:internal/streams/readable:559:12)
02:33:11.268     at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)
02:33:11.268     at Socket.Readable.push (node:internal/streams/readable:390:5)
02:33:11.268     at Pipe.onStreamRead (node:internal/stream_base_commons:189:23) {
02:33:11.268   errors: [Getter/Setter],
02:33:11.268   warnings: [Getter/Setter],
02:33:11.268   frame: '\n' +
02:33:11.268     '\x1B[33mUnexpected "}"\x1B[39m\n' +
02:33:11.269     '1056 |              return (\n' +
02:33:11.269     '1057 |                <section className="mb-4 relative overflow-hidden"\n' +
02:33:11.269     "1058 |    style={{background:`${rc}0.12)`, borderRadius:'24px', ...}}>\n" +
02:33:11.269     '     |                                                             ^\n' +
02:33:11.269     '1059 |    <Fingerprint className="absolute top-3 right-3 w-16 h-16 pointer-events-none"\n' +
02:33:11.269     '1060 |      style={{color:`${rc}0.30)`, strokeWidth:1}} />\n',
02:33:11.269   loc: {
02:33:11.269     column: 59,
02:33:11.269     file: '/vercel/path0/app/components/EnergyApp.jsx',
02:33:11.269     length: 1,
02:33:11.269     line: 1058,
02:33:11.269     lineText: "  style={{background:`${rc}0.12)`, borderRadius:'24px', ...}}>",
02:33:11.269     namespace: '',
02:33:11.269     suggestion: ''
02:33:11.269   },
02:33:11.269   code: 'PLUGIN_ERROR',
02:33:11.269   plugin: 'vite:esbuild',
02:33:11.269   hook: 'transform',
02:33:11.269   id: '/vercel/path0/app/components/EnergyApp.jsx',
02:33:11.269   watchFiles: [
02:33:11.270     '/vercel/path0/node_modules/@react-router/dev/dist/config/defaults/entry.client.tsx',
02:33:11.270     '/vercel/path0/app/root.tsx',
02:33:11.270     '/vercel/path0/app/routes/home.tsx',
02:33:11.270     '/vercel/path0/node_modules/react/jsx-runtime.js',
02:33:11.270     '/vercel/path0/node_modules/react/index.js',
02:33:11.270     '/vercel/path0/node_modules/react-dom/client.js',
02:33:11.270     '/vercel/path0/node_modules/react-router/dist/development/dom-export.mjs',
02:33:11.272     '/vercel/path0/node_modules/react/cjs/react.production.js',
02:33:11.272     '/vercel/path0/node_modules/react/cjs/react-jsx-runtime.production.js',
02:33:11.272     '/vercel/path0/node_modules/react-router/dist/development/chunk-FNSCYPCZ.mjs',
02:33:11.272     '/vercel/path0/node_modules/react-router/dist/development/chunk-EPOLDU6W.mjs',
02:33:11.272     '/vercel/path0/node_modules/react-dom/index.js',
02:33:11.272     '/vercel/path0/node_modules/react-dom/cjs/react-dom-client.production.js',
02:33:11.272     '/vercel/path0/node_modules/scheduler/index.js',
02:33:11.272     '/vercel/path0/package.json',
02:33:11.272     '/vercel/path0/node_modules/react-router/node_modules/cookie/dist/index.js',
02:33:11.272     '/vercel/path0/node_modules/set-cookie-parser/lib/set-cookie.js',
02:33:11.272     '/vercel/path0/node_modules/react-dom/cjs/react-dom.production.js',
02:33:11.272     '/vercel/path0/node_modules/scheduler/cjs/scheduler.production.js',
02:33:11.272     '/vercel/path0/app/components/EnergyApp.jsx',
02:33:11.272     '/vercel/path0/app/app.css',
02:33:11.273     '/vercel/path0/node_modules/tailwindcss/index.css',
02:33:11.273     '/vercel/path0/app/tailwind.css',
02:33:11.273     '/vercel/path0/app/routes.ts',
02:33:11.273     '/vercel/path0/.nvmrc',
02:33:11.273     '/vercel/path0/README.md',
02:33:11.273     '/vercel/path0/app/welcome/welcome.tsx',
02:33:11.273     '/vercel/path0/vercel.json',
02:33:11.273     '/vercel/path0/tsconfig.json',
02:33:11.273     '/vercel/path0/app/welcome/logo-dark.svg',
02:33:11.273     '/vercel/path0/tailwind.config.js',
02:33:11.273     '/vercel/path0/postcss.config.js',
02:33:11.273     '/vercel/path0/app/welcome/logo-light.svg',
02:33:11.273     '/vercel/path0/vite.config.ts',
02:33:11.273     '*',
02:33:11.273     'app/**/*.{,aspx,astro,cjs,css,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,json,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,svg,tpl,ts,tsx,twig,vue}'
02:33:11.273   ]
02:33:11.273 }
02:33:11.308 Error: Command "npm run build" exited with 1
