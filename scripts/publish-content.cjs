'use strict';
const {spawnSync}=require('node:child_process');const repo=process.env.GITHUB_REPOSITORY,commit=process.env.GITHUB_SHA;
if(repo!=='RobloxCreator-sketch/jude-study-room'||!/^[a-f0-9]{40}$/.test(commit||''))throw Error('Unexpected classroom publication target.');
const endpoint=`repos/${repo}/git/refs/heads/classroom`,current=spawnSync('gh',['api',`repos/${repo}/git/ref/heads/classroom`],{encoding:'utf8'});let args;
if(current.status===0)args=['api','--method','PATCH',endpoint,'-f',`sha=${commit}`,'-F','force=false'];else if(current.stderr.includes('HTTP 404'))args=['api','--method','POST',`repos/${repo}/git/refs`,'-f','ref=refs/heads/classroom','-f',`sha=${commit}`];else throw Error(current.stderr||'Could not read classroom channel.');
const result=spawnSync('gh',args,{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr||'Could not publish classroom content.');console.log('Classroom update channel now points to validated commit',commit);
