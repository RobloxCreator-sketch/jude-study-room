'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto'),semver=require('semver');
const REPO='RobloxCreator-sketch/jude-study-room',API=`https://api.github.com/repos/${REPO}/git/ref/heads/classroom`,RAW=`https://raw.githubusercontent.com/${REPO}`;
const MAX_FILE=2*1024*1024,MAX_TOTAL=12*1024*1024,MAX_MANIFEST=128*1024;
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function manifestId(m){return hash(JSON.stringify({bridgeVersion:m.bridgeVersion,minShellVersion:m.minShellVersion,files:m.files}))}
function validPath(name){return typeof name==='string'&&name.length<=200&&name.split('/').every(part=>/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*$/.test(part)&&!/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))&&(/\.(?:html|js|css|woff2|png|jpg|jpeg|webp|svg|txt)$/.test(name)||name==='vendor/katex/LICENSE')}
function validateManifest(m,shellVersion){
 if(!m||m.schema!==1||m.bridgeVersion!==1||!semver.valid(m.minShellVersion)||semver.lt(shellVersion,m.minShellVersion))throw Error('This classroom update needs a newer desktop app.');
 if(!Array.isArray(m.files)||!m.files.length||m.files.length>100)throw Error('Invalid classroom file list.');let total=0;const names=new Set();
 for(const file of m.files){if(!file||!validPath(file.path)||names.has(file.path.toLowerCase())||!Number.isInteger(file.size)||file.size<0||file.size>MAX_FILE||!/^[a-f0-9]{64}$/.test(file.sha256))throw Error('Invalid classroom file.');names.add(file.path.toLowerCase());total+=file.size}
 if(total>MAX_TOTAL||!m.files.some(f=>f.path==='index.html')||m.contentId!==manifestId(m))throw Error('Invalid classroom update.');return m;
}
async function limitedBytes(response,limit,signal){if(!response.ok||Number(response.headers.get('content-length'))>limit)throw Error('Classroom update could not be downloaded.');const reader=response.body.getReader(),parts=[];let size=0;while(true){signal?.throwIfAborted();const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw Error('Classroom file is too large.')}parts.push(value)}return Buffer.concat(parts,size)}
function createContentManager({cacheRoot,bundledRoot,shellVersion,fetchImpl=fetch,timeoutMs=10000}){
 let active=null,pending=null,flight=null;let status={status:'idle',source:'bundled',message:'Lessons and classroom improvements update when this app opens.'};
 const getStatus=()=>({...status,currentContent:active?.manifest.contentId.slice(0,10),pendingContent:pending?.manifest.contentId.slice(0,10)});
 async function verify(root,manifest){validateManifest(manifest,shellVersion);for(const file of manifest.files){const p=path.join(root,...file.path.split('/')),info=await fs.lstat(p);if(!info.isFile()||info.isSymbolicLink()||info.size!==file.size||hash(await fs.readFile(p))!==file.sha256)throw Error('A saved classroom file did not match.')}return {root,manifest}}
 async function local(){
  try{const id=(await fs.readFile(path.join(cacheRoot,'current'),'utf8')).trim();if(!/^[a-f0-9]{64}$/.test(id))throw Error();const root=path.join(cacheRoot,id),manifest=JSON.parse(await fs.readFile(path.join(root,'manifest.json'),'utf8'));if(manifest.contentId!==id)throw Error();return await verify(root,manifest)}catch{}
  const manifest=JSON.parse(await fs.readFile(path.join(bundledRoot,'../content-manifest.json'),'utf8'));return verify(bundledRoot,manifest);
 }
 async function request(url,limit,signal){return limitedBytes(await fetchImpl(url,{headers:{Accept:'application/vnd.github+json','User-Agent':`Jude-Study-Room/${shellVersion}`},redirect:'error',cache:'no-store',signal}),limit,signal)}
 async function check(){if(flight)return flight;flight=(async()=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);timer.unref?.();let staging;
  status={...status,status:'checking',message:'Checking for classroom improvements…'};
  try{
   const head=JSON.parse((await request(API,MAX_MANIFEST,controller.signal)).toString());const commit=head.object?.sha;if(!/^[a-f0-9]{40}$/.test(commit))throw Error('Invalid classroom revision.');
   const manifest=validateManifest(JSON.parse((await request(`${RAW}/${commit}/content-manifest.json`,MAX_MANIFEST,controller.signal)).toString()),shellVersion);
   if(active?.manifest.contentId===manifest.contentId){pending=null;status={status:'current',source:active.root===bundledRoot?'bundled':'saved',message:'Your lessons and classroom interface are up to date.'};return getStatus()}
   const target=path.join(cacheRoot,manifest.contentId);try{pending=await verify(target,manifest)}catch{
    await fs.mkdir(cacheRoot,{recursive:true});staging=path.join(cacheRoot,'staging-'+crypto.randomUUID());await fs.mkdir(staging,{recursive:true});
    for(let start=0;start<manifest.files.length;start+=5){controller.signal.throwIfAborted();const results=await Promise.allSettled(manifest.files.slice(start,start+5).map(async file=>{
     let bytes;for(const root of [active?.root,bundledRoot].filter(Boolean)){try{const p=path.join(root,...file.path.split('/'));const info=await fs.lstat(p);if(info.isFile()&&!info.isSymbolicLink()&&info.size===file.size){const candidate=await fs.readFile(p);if(hash(candidate)===file.sha256){bytes=candidate;break}}}catch{}}
     if(!bytes)bytes=await request(`${RAW}/${commit}/ui/${file.path}`,Math.min(MAX_FILE,file.size),controller.signal);
     if(bytes.length!==file.size||hash(bytes)!==file.sha256)throw Error('A classroom download did not match.');controller.signal.throwIfAborted();const dest=path.join(staging,...file.path.split('/'));await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,bytes,{flag:'wx'});
    }));const rejected=results.find(r=>r.status==='rejected');if(rejected)throw rejected.reason}
    controller.signal.throwIfAborted();await fs.writeFile(path.join(staging,'manifest.json'),JSON.stringify(manifest));await verify(staging,manifest);
    // A failed earlier download never becomes the active classroom.
    await fs.rm(target,{recursive:true,force:true});await fs.rename(staging,target);staging=null;pending={root:target,manifest};
   }
   status={status:'ready',source:'saved',message:'A classroom improvement is ready. Reload when your work is saved, or reopen the app.'};return getStatus();
  }catch(error){status={status:'offline',source:active?.root===bundledRoot?'bundled':'saved',message:error.message.includes('newer desktop')?error.message:'Using your saved classroom. The update check could not finish; try again when connected.'};return getStatus()}
  finally{clearTimeout(timer);if(staging)await fs.rm(staging,{recursive:true,force:true}).catch(()=>{})}
 })();try{return await flight}finally{flight=null}}
 async function activate(){if(!pending)return active;await verify(pending.root,pending.manifest);const pointer=path.join(cacheRoot,'current-'+crypto.randomUUID());await fs.writeFile(pointer,pending.manifest.contentId);await fs.rename(pointer,path.join(cacheRoot,'current'));active=pending;pending=null;status={status:'current',source:'saved',message:'Your lessons and classroom interface are up to date.'};return active}
 async function prepare(){active=await local();await check();if(pending)await activate();return {entry:path.join(active.root,'index.html'),...getStatus()}}
 async function recover(){const manifest=JSON.parse(await fs.readFile(path.join(bundledRoot,'../content-manifest.json'),'utf8'));active=await verify(bundledRoot,manifest);pending=null;await fs.rm(path.join(cacheRoot,'current'),{force:true});status={status:'bundled',source:'bundled',message:'Using the included classroom interface. Reopen the app to check online improvements again.'};return {entry:path.join(active.root,'index.html'),...getStatus()}}
 return {prepare,check,activate,getStatus,recover};
}
module.exports={createContentManager,validateManifest,manifestId,validPath,hash,API,RAW};
