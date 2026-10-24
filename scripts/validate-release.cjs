const fs=require('node:fs');const version=require('../package.json').version;
if(!/^\d+\.\d+\.\d+$/.test(version))throw Error('Release versions must be stable x.y.z numbers.');
for(const file of ['desktop/files.cjs','ui/math.js','ui/submissions.js','desktop/main.cjs','desktop/preload.cjs','desktop/updates.cjs','ui/app.js','ui/account.js','ui/updates.js','ui/lessons.js'])require('node:child_process').execFileSync(process.execPath,['--check',file]);
if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,`version=${version}\ntag=v${version}\n`);
console.log('Release source checked:',version);
