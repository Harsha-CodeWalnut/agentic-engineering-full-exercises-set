import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
export function validate(root) {
  const graph = JSON.parse(fs.readFileSync(path.join(root,"graphify-out/graph.json")));
  const nodes = graph.nodes;
  const edges = graph.links ?? graph.edges;
  assert.ok(Array.isArray(nodes) && nodes.length && Array.isArray(edges) && edges.length,"submit a populated Graphify graph");
  const ids = new Set(nodes.map(node => node.id));
  assert.ok(nodes.every(node => typeof node.id === "string" && node.id.trim()),"graph node IDs must be nonempty strings");
  assert.equal(ids.size,nodes.length,"graph node IDs must be unique");
  for(const edge of edges) assert.ok(ids.has(edge.source) && ids.has(edge.target),"graph contains a dangling edge");
  const sources = nodes.map(node => node.source_file).filter(value => typeof value === "string" && value.length);
  for(const relative of sources) {
    const absolute = path.resolve(root,relative);
    const local = path.relative(fs.realpathSync(root),fs.realpathSync(absolute));
    assert.ok(local && !local.startsWith("..") && !path.isAbsolute(local),"graph source must be within this exercise: "+relative);
    assert.ok(fs.statSync(absolute).isFile(),"graph source must refer to a file: "+relative);
  }
  for(const [label,pattern] of [["application code",/^billing-graph-app\/src\//],["tests",/^billing-graph-app\/scripts\/run-/],["supplied documents",/^docs\/(?!query-guide\.md)/]]) {
    assert.ok(sources.some(source => pattern.test(source.replaceAll("\\","/"))),"graph is missing "+label+" sources");
  }
  const transcript = fs.readFileSync(path.join(root,"evidence/commands/graphify.txt"),"utf8");
  for(const command of ["graphify query","graphify path","graphify explain"]) assert.ok(transcript.includes(command),"record real output for "+command);
  assert.match(transcript,/graphify (?:version: )?\d+\.\d+/i,"record the Graphify version");
}
