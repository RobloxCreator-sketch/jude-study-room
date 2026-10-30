'use strict';
const ORIGIN='https://jude-study-room-login.dirtyspoon.chatgpt.site';
const TRUSTED_ORIGINS=new Set([ORIGIN,'https://jude-study-room-login.blueseed4096.chatgpt.site']);
// Only the classroom's explicitly approved hosts may receive login details or files.
function createClassroomFetch(fetchImpl=fetch){return async function classroomFetch(raw,options={}){
 const original=new URL(raw);let current=original;
 if(!TRUSTED_ORIGINS.has(original.origin)||!original.pathname.startsWith('/api/')||original.username||original.password)throw Error('Untrusted classroom address.');
 for(let redirects=0;redirects<=3;redirects++){
  const response=await fetchImpl(current.href,{...options,redirect:'manual'});
  if(![301,302,303,307,308].includes(response.status))return response;
  const location=response.headers.get('location');
  const next=location?new URL(location,current):null;
  if(![307,308].includes(response.status)||!next||!TRUSTED_ORIGINS.has(next.origin)||next.username||next.password||next.pathname!==original.pathname||next.search!==original.search||next.hash)throw Error('The classroom moved to an unrecognized address. Install the latest app update.');
  await response.body?.cancel();current=next;
 }
 throw Error('The classroom address redirected too many times.');
}}
module.exports={ORIGIN,createClassroomFetch};
