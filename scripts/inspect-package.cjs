const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
const builder=createRequire(fs.realpathSync(require.resolve('electron-builder/package.json')));const lib=createRequire(builder.resolve('app-builder-lib/package.json'));const asar=lib('@electron/asar');
const archive=path.resolve(process.argv[2]);const files=asar.listPackage(archive).map(file=>file.replace(/\\/g,'/'));
for(const file of ['/desktop/main.cjs','/desktop/updates.cjs','/ui/updates.js','/node_modules/semver/package.json','/node_modules/electron-updater/package.json'])if(!files.includes(file))throw Error('Packaged app is missing '+file);
console.log('Packaged update component and dependencies verified.');
