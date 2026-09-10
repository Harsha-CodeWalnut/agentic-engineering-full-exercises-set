import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { verifyComparableEvidence, verifyEvidenceOnlyHistory } from "../../../../scripts/comparable-evidence.mjs";

const root=process.cwd();
const agents=fs.readFileSync("AGENTS.md","utf8");
assert.ok(agents.trim().split(/\s+/).length<=500,"keep AGENTS.md under 500 words");
const links=[...agents.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]*)?\)/g)].map(m=>m[1]);
assert.ok(links.some(link=>link.startsWith(".agent/")||link.startsWith("./.agent/")),"link to focused supporting guidance under .agent/");
for(const link of links) {
  if(/^https?:/.test(link)) continue;
  const absolute=path.resolve(root,decodeURIComponent(link));
  assert.ok(absolute.startsWith(root+path.sep) && fs.existsSync(absolute),"broken or out-of-scope guidance link: "+link);
}
const after=fs.readFileSync("../evidence/after.md","utf8");
const implementation=after.match(/^(?:- )?Implementation commit:\s*([a-f0-9]{40})\s*$/m)?.[1];
const start=after.match(/^(?:- )?Starting commit:\s*([a-f0-9]{40})\s*$/m)?.[1];
const guided=after.match(/^(?:- )?Run base commit:\s*([a-f0-9]{40})\s*$/m)?.[1];
assert.ok(guided && guided!==start,"record the guidance-only commit as Run base commit");
const git=(args)=>execFileSync("git",args,{cwd:root,encoding:"utf8"}).trim();
const repo=git(["rev-parse","--show-toplevel"]);
const prefix=git(["rev-parse","--show-prefix"]);
const changed=git(["diff","--name-only",start,guided]).split(/\r?\n/).filter(Boolean);
assert.ok(changed.length && changed.every(file=>file===prefix+"AGENTS.md" || (file.startsWith(prefix+".agent/") && file.endsWith(".md"))),"the intervention commit must contain only Markdown onboarding guidance");
const exerciseRoot=path.resolve(root,"..");
const allowed=changed.map(file=>path.relative(exerciseRoot,path.join(repo,file)).split(path.sep).join("/"));
assert.deepEqual(verifyComparableEvidence({repositoryRoot:repo,exerciseRoot,allowIdenticalPatches:true,allowedAfterRunBaseFiles:allowed}),[]);
assert.deepEqual(verifyEvidenceOnlyHistory({repositoryRoot:repo,exerciseRoot,fromCommit:implementation}),[]);
assert.equal(git(["diff","--name-only",implementation,"--","src/"]),"","source must match the recorded second implementation");
for(const file of changed) {
  const current=fs.readFileSync(path.join(repo,file),"utf8").replaceAll("\r\n","\n");
  assert.equal(execFileSync("git",["show",guided+":"+file],{cwd:root,encoding:"utf8"}).replaceAll("\r\n","\n"),current,"guidance changed after the fresh run started");
}
const capture=fs.readFileSync("../evidence/commands/verify.txt","utf8");
assert.ok(capture.includes("Repository commit: "+implementation),"capture must identify the second implementation commit");
assert.ok(capture.startsWith("Command: npm run evidence:verify"),"use evidence:capture");
assert.match(capture,/exit code: 0\s*$/,"acceptance verification must pass");
for(const name of ["before-session.txt","after-session.txt"]) assert.ok(fs.readFileSync("../evidence/"+name,"utf8").trim().length>100,"include actual agent session output");
console.log("PASS concise linked guidance, guidance-only intervention, matched runs and captured acceptance");
