let updateStatus={status:'idle',message:'Check for a newer version.'};
function paintUpdates(){
 const panel=document.querySelector('#update-panel');
 if(panel){panel.innerHTML=`<h2>App updates</h2><p class="small">Installed version ${esc(updateStatus.currentVersion||'')}</p><p role="status">${esc(updateStatus.message)}</p>${updateStatus.status==='downloading'?`<progress max="100" value="${updateStatus.progress||0}" style="width:100%"></progress>`:''}<div class="tools">${updateStatus.status==='available'?`<button type="button" class="primary" id="download-update">${updateStatus.platform==='darwin'?'Download Mac update ↗':'Download update'}</button>`:''}${updateStatus.status==='ready'?'<button type="button" class="primary" id="install-update">Install and restart</button>':''}${!['checking','downloading','ready'].includes(updateStatus.status)?'<button type="button" class="secondary" id="check-updates">Check for updates</button>':''}</div><p class="small">${updateStatus.platform==='darwin'?'Mac updates open a GitHub download. Quit this app, unzip the new version, and replace the copy in Applications.':'Windows updates install only when you choose Install and restart.'} Your accounts and classroom work stay online.</p>`;
  const button=(id,action)=>{const element=document.getElementById(id);if(element)element.onclick=async()=>{element.disabled=true;try{updateStatus=await call(action);paintUpdates()}catch(error){toast(error.message);element.disabled=false}}};
  button('check-updates','check-updates');button('download-update','download-update');button('install-update','install-update');
 }
 const banner=document.querySelector('#update-banner');
 const available=['available','ready'].includes(updateStatus.status);banner.hidden=!available;
 if(available){banner.innerHTML=`<span>Version ${esc(updateStatus.newVersion)} ${updateStatus.status==='ready'?'is ready to install':'is available'}</span> <button type="button" class="secondary" id="view-update">View update</button>`;document.querySelector('#view-update').onclick=showUpdates}
}
async function showUpdates(){
 if(modal.open&&!document.querySelector('#update-panel')){toast('Save or close your open work before checking app updates.');return}
 try{updateStatus=await call('update-status');if(!modal.open)show('<section id="update-panel"></section>');paintUpdates()}catch(error){toast(error.message)}
}
window.study.onUpdate(status=>{updateStatus=status;paintUpdates()});
window.study.onShowUpdates(showUpdates);
document.querySelector('#updates-button').onclick=showUpdates;
call('update-status').then(status=>{updateStatus=status;paintUpdates()}).catch(()=>{});
