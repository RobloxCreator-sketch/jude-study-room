let studentPreview=false;
function studentPreviewState(room){
 const body=structuredClone(room),v=body.visibility||{},hidden=(kind,id)=>(v[kind]||[]).includes(id);
 body.assignments=body.assignments.filter(a=>!hidden('classes',a.subject)&&!hidden('units',a.unitId||'unit-1-'+a.subject)&&!hidden('lessons',a.id));
 const ids=new Set(body.assignments.map(a=>a.id));
 body.classes=(body.classes||baseClasses).map(c=>c&&!hidden('classes',c.id)?c:null);
 body.units=(body.units||defaultUnits).filter(u=>!hidden('classes',u.subject)&&!hidden('units',u.id));
 body.lessons=(body.lessons||[]).filter(l=>ids.has(l.id));
 delete body.visibility;delete body.lessonGuides;
 // Tutor notes are personal and do not represent Jude's notebook.
 for(const key of Object.keys(body))if(/^notes[0-3]$/.test(key)||key.startsWith('notes_'))delete body[key];
 return body;
}
function previewBlocks(action,args){return studentPreview&&(['save','upload-file','remove-file','student','password','setup','login','export'].includes(action))&&!(action==='save'&&args?.read===true)}
function previewAccountLabel(){document.querySelector('#account-name').textContent=activeUser.username+' · '+(studentPreview?'Student preview':tutor()?'Tutor':'Student');document.querySelector('#student-preview-button').hidden=activeUser.role!=='tutor'||studentPreview;document.querySelector('#student-preview-banner').hidden=!studentPreview;}
async function switchStudentPreview(enabled){
 if(activeUser?.role!=='tutor')return;
 if(modal.open){toast('Save or close your open work before switching views.');return}
 const button=document.querySelector(enabled?'#student-preview-button':'#exit-student-preview');button.disabled=true;
 try{const r=await call('save',{read:true,view:2});studentPreview=enabled;data=enabled?studentPreviewState(r.state):r.state;revision=r.revision;answerGuides=enabled?{}:r.guides;role=enabled?'student':activeUser.role;page='home';selected=null;selectedUnit=null;previewAccountLabel();render();document.querySelector('#sync-state').textContent=enabled?'Student preview · read only · no changes are saved':'Connected · shared classroom';}
 catch(error){toast(error.message)}finally{button.disabled=false}
}
document.querySelector('#student-preview-button').onclick=()=>switchStudentPreview(true);
document.querySelector('#exit-student-preview').onclick=()=>switchStudentPreview(false);
