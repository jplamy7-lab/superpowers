// Monitoring et telemetry pour les skills
// Usage : node scripts/monitoring.js

import fs from 'fs';

function logSkillEvent(skillName, event, status) {
  const logLine = `${new Date().toISOString()} | ${skillName} | ${event} | ${status}\n`;
  fs.appendFileSync('skills-monitoring.log', logLine);
}

// Exemple d’utilisation
logSkillEvent('brainstorming', 'invoke', 'success');
logSkillEvent('subagent-driven-development', 'invoke', 'fail');
