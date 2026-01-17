// Debug mode avancé pour traçabilité complète
// Usage : node scripts/debug-mode.js <skillName>

import fs from 'fs';

function logDebug(skillName, message) {
  const logLine = `${new Date().toISOString()} | ${skillName} | ${message}\n`;
  fs.appendFileSync('skills-debug.log', logLine);
}

// Exemple d’utilisation
logDebug('brainstorming', 'Entrée dans le workflow');
logDebug('subagent-driven-development', 'Review spec compliance');
