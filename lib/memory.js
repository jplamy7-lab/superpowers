// Module de mémoire et apprentissage continu
import fs from 'fs';
import path from 'path';

function getMemoryFile(agentOrRoom) {
  return path.join('memory', `${agentOrRoom}.json`);
}

export function readMemory(agentOrRoom) {
  const file = getMemoryFile(agentOrRoom);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeMemory(agentOrRoom, entry) {
  const mem = readMemory(agentOrRoom);
  mem.push({ ...entry, timestamp: Date.now() });
  fs.mkdirSync('memory', { recursive: true });
  fs.writeFileSync(getMemoryFile(agentOrRoom), JSON.stringify(mem, null, 2));
}

export function searchMemory(agentOrRoom, query) {
  return readMemory(agentOrRoom).filter(e => JSON.stringify(e).includes(query));
}

export function enrichMemory(agentOrRoom, result) {
  // Apprentissage continu : enrichit la mémoire avec le résultat d’un workflow
  writeMemory(agentOrRoom, { type: 'learning', data: result });
}
