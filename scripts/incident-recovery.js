// Automatisation de la récupération après incident
import fs from 'fs';

export function repairSkill(skillPath) {
  // Exemple : restaurer SKILL.md depuis une sauvegarde
  const backup = skillPath + '.bak';
  if (fs.existsSync(backup)) {
    fs.copyFileSync(backup, skillPath);
    return true;
  }
  return false;
}

export function logIncident(skillName, error) {
  fs.appendFileSync('incident.log', `${new Date().toISOString()} | ${skillName} | ${error}\n`);
}
