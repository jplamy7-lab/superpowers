import fs from 'fs';
import path from 'path';

function validateSkillFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/---[\s\S]*?name:\s*(.+)[\r\n]+description:\s*(.+)[\r\n]+---/);
  if (!match) {
    return { file: filePath, valid: false, error: 'Frontmatter manquant ou mal formé' };
  }
  const name = match[1].trim();
  const description = match[2].trim();
  if (!name || !description) {
    return { file: filePath, valid: false, error: 'name ou description manquant' };
  }
  return { file: filePath, valid: true };
}

function findSkillFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findSkillFiles(fullPath));
    } else if (entry.name === 'SKILL.md') {
      results.push(fullPath);
    }
  }
  return results;
}

const skillsDir = path.resolve('skills');
const skillFiles = findSkillFiles(skillsDir);
let allValid = true;
for (const file of skillFiles) {
  const result = validateSkillFile(file);
  if (!result.valid) {
    console.error(`Erreur dans ${file}: ${result.error}`);
    allValid = false;
  }
}
if (!allValid) {
  process.exit(1);
} else {
  console.log('Tous les SKILL.md sont valides.');
}
