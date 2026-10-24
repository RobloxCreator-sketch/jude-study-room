'use strict';
const semver = require('semver');
const REPOSITORY = 'RobloxCreator-sketch/jude-study-room';
const RELEASES = `https://github.com/${REPOSITORY}/releases`;
const API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;

function macRelease(release, currentVersion, arch) {
  if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+$/.test(release.tag_name || '')) return null;
  const version = release.tag_name.slice(1);
  if (!semver.valid(version) || !semver.gt(version, currentVersion)) return null;
  const name = `Jude-Study-Room-${version}-mac-${arch}.zip`;
  const url = `${RELEASES}/download/v${version}/${name}`;
  const asset = release.assets?.find(asset => asset.name === name && asset.browser_download_url === url);
  if (!asset) throw new Error('This release does not have a download for your Mac yet.');
  return {version, url};
}

function createUpdateManager({version, platform, arch, packaged, fetchRelease = fetch, windowsUpdater, openExternal, confirmRestart = async () => false, notify = () => {}}) {
  let state = {status:'idle', currentVersion:version, platform, message:'Check for a newer version of Jude Study Room.'};
  let checkPromise;
  function set(patch) {state={...state,...patch}; notify({...state}); return {...state};}
  function getStatus() {return {...state};}
  const updater = platform === 'win32' ? windowsUpdater : null;
  if (updater) {
    updater.autoDownload = false;
    updater.autoInstallOnAppQuit = false;
    updater.allowPrerelease = false;
    updater.allowDowngrade = false;
    updater.on('checking-for-update',()=>set({status:'checking',message:'Checking GitHub for updates…'}));
    updater.on('update-available',info=>set({status:'available',newVersion:info.version,message:`Version ${info.version} is available.`}));
    updater.on('update-not-available',()=>set({status:'current',message:'You have the latest version.'}));
    updater.on('download-progress',progress=>set({status:'downloading',progress:Math.round(progress.percent),message:`Downloading update… ${Math.round(progress.percent)}%`}));
    updater.on('update-downloaded',info=>set({status:'ready',newVersion:info.version,progress:100,message:'Your update is ready. Save your work, then install and restart.'}));
    updater.on('error',()=>set({status:'error',message:'The update could not be completed. Check your internet connection and try again.'}));
  }
  async function check() {
    if (checkPromise) return checkPromise;
    if (state.status === 'ready' || state.status === 'downloading') return getStatus();
    checkPromise = (async()=>{
      set({status:'checking',message:'Checking GitHub for updates…'});
      try {
        if (platform === 'win32') {
          if (!packaged || !updater) return set({status:'development',message:'Windows installation updates are available in the installed release build.'});
          await updater.checkForUpdates();
          return getStatus();
        }
        if (platform !== 'darwin') return set({status:'unsupported',message:'This release supports Mac and Windows.'});
        const result = await fetchRelease(API,{headers:{Accept:'application/vnd.github+json','User-Agent':`Jude-Study-Room/${version}`},signal:AbortSignal.timeout(20000),redirect:'error'});
        if (result.status === 404) return set({status:'unpublished',message:'The first GitHub release is still being prepared. Try again later.'});
        if (!result.ok) throw new Error('GitHub update check failed.');
        const update = macRelease(await result.json(),version,arch);
        return update ? set({status:'available',newVersion:update.version,downloadUrl:update.url,message:`Version ${update.version} is available. Download it and replace the app in Applications.`}) : set({status:'current',message:'You have the latest version.'});
      } catch (error) {
        return set({status:'error',message:error.message.includes('download for your Mac')?error.message:'Could not check for updates. Check your internet connection and try again.'});
      }
    })();
    try {return await checkPromise;} finally {checkPromise=null;}
  }
  async function download() {
    if (state.status !== 'available') throw new Error('Check for an available update first.');
    if (platform === 'darwin') {
      // The URL comes only from a validated asset in this repository's release.
      await openExternal(state.downloadUrl);
      return getStatus();
    }
    if (!updater || platform !== 'win32') throw new Error('Install updates from the Windows release build.');
    set({status:'downloading',progress:0,message:'Downloading update…'});
    try {await updater.downloadUpdate();} catch(error) {set({status:'error',message:'The download did not complete. Try checking for updates again.'});throw new Error(state.message);}
    return getStatus();
  }
  async function install() {
    if (platform !== 'win32' || !updater || state.status !== 'ready') throw new Error('There is no Windows update ready to install.');
    if (await confirmRestart()) updater.quitAndInstall(false,true);
    return getStatus();
  }
  return {getStatus,check,download,install};
}
module.exports={createUpdateManager,macRelease,REPOSITORY,RELEASES};
