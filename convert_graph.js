const fs = require("fs");

// carica il tuo graph.json attuale
const graph = require("./graph.json");

// 1. mappa ID stringa → ID numerico
const idMap = new Map();
graph.nodes.forEach((node, index) => {
  idMap.set(node.id, index);
});

// 2. nuovi nodi (solo id numerico)
const newNodes = graph.nodes.map((_, index) => ({
  id: index
}));

// 3. nuovi link con source/target numerici
const newLinks = graph.links.map(link => {
  const src = idMap.get(link.source);
  const tgt = idMap.get(link.target);

  if (src === undefined || tgt === undefined) {
    throw new Error(
      `Link non valido: ${link.source} -> ${link.target}`
    );
  }

  return {
    source: src,
    target: tgt,
    value: link.value
  };
});

// 4. nuovo grafo
const newGraph = {
  nodes: newNodes,
  links: newLinks
};

// 5. salva file
fs.writeFileSync(
  "graph_numeric.json",
  JSON.stringify(newGraph, null, 2)
);

console.log("✅ graph_numeric.json creato con successo");