const {contextBridge,ipcRenderer}=require('electron');
function subscribe(channel,callback){if(typeof callback!=='function')throw new Error('A callback is required.');const listener=(_event,value)=>callback(value);ipcRenderer.on(channel,listener);return ()=>ipcRenderer.removeListener(channel,listener)}
contextBridge.exposeInMainWorld('study',{call:(action,args)=>ipcRenderer.invoke('study',action,args),onUpdate:callback=>subscribe('study-update',callback),onShowUpdates:callback=>subscribe('study-show-updates',callback)});
