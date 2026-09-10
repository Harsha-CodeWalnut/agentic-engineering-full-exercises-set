import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const mode = process.argv[2] ?? "test";
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "brownfield-java-"));
function files(root) {
  return fs.readdirSync(root,{withFileTypes:true}).flatMap(entry => {
    const full=path.join(root,entry.name);
    return entry.isDirectory()?files(full):entry.name.endsWith(".java")?[full]:[];
  });
}
function run(command, args) {
  const result=spawnSync(command,args,{stdio:"inherit",shell:false});
  if(result.error) throw result.error;
  if(result.status!==0) throw new Error(command+" failed with exit code "+result.status);
}
try {
  run("javac",["--release","21","-d",temporary,...files("src/main/java"),...files("src/test/java")]);
  if(mode==="demo") run("java",["-cp",temporary,"com.codewalnut.support.Main"]);
  else run("java",["-cp",temporary,"com.codewalnut.support.ContractChecks",...(mode==="acceptance"?["acceptance"]:[])]);
} catch(error) { console.error(error.message); process.exitCode=1; }
finally { fs.rmSync(temporary,{recursive:true,force:true}); }
