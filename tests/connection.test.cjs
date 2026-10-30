const {test}=require('node:test'),assert=require('node:assert/strict');
const {ORIGIN,createClassroomFetch}=require('../desktop/connection.cjs');
const OLD='https://jude-study-room-login.blueseed4096.chatgpt.site';
test('current classroom connects directly; approved redirects preserve credentials, POST body and file uploads',async()=>{
 for(const body of ['{"username":"sample"}',new FormData()]){
 const calls=[],signal=AbortSignal.timeout(10000),headers={Authorization:'Bearer sample'};
 const send=createClassroomFetch(async(url,opts)=>{calls.push({url,opts});return calls.length===1?new Response(null,{status:307,headers:{location:ORIGIN+'/api/login'}}):Response.json({ok:true})});
 assert.equal((await send(OLD+'/api/login',{method:'POST',body,headers,signal})).status,200);
 assert.equal(calls[1].url,ORIGIN+'/api/login');assert.equal(calls[1].opts.method,'POST');assert.equal(calls[1].opts.body,body);assert.equal(calls[1].opts.headers,headers);assert.equal(calls[1].opts.signal,signal);assert.ok(calls.every(c=>c.opts.redirect==='manual'));
 }
 let count=0;await createClassroomFetch(async()=>{count++;return Response.json({ok:true})})(ORIGIN+'/api/health');assert.equal(count,1);
});
test('unapproved redirects never receive passwords or tokens',async()=>{
 for(const location of ['https://evil.example/api/login','http://jude-study-room-login.dirtyspoon.chatgpt.site/api/login',ORIGIN+'/api/student',ORIGIN+'/api/login?leak=1','https://user:pass@jude-study-room-login.dirtyspoon.chatgpt.site/api/login']){
 let count=0;const send=createClassroomFetch(async()=>{count++;return new Response(null,{status:307,headers:{location}})});
 await assert.rejects(()=>send(OLD+'/api/login',{method:'POST',body:'secret'}),/unrecognized/);assert.equal(count,1);
 }
});
test('rejects method-changing redirects, loops and untrusted starting addresses',async()=>{
 for(const status of [301,302,303])await assert.rejects(()=>createClassroomFetch(async()=>new Response(null,{status,headers:{location:ORIGIN+'/api/login'}}))(OLD+'/api/login'),/unrecognized/);
 let count=0;await assert.rejects(()=>createClassroomFetch(async()=>{count++;return new Response(null,{status:308,headers:{location:ORIGIN+'/api/health'}})})(ORIGIN+'/api/health'),/too many/);assert.equal(count,4);
 await assert.rejects(()=>createClassroomFetch(()=>{throw Error('must not fetch')})('https://evil.example/api/login'),/Untrusted/);
});
