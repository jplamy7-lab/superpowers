// Test harness avancé pour exécuter et mocker les skills
// Usage : node scripts/test-harness.js <skillName>

import { findSkillsInDir, extractFrontmatter } from '../lib/skills-core.js';
import path from 'path';

const skills = findSkillsInDir(path.resolve('skills'), 'superpowers');

function runSkillTest(skillName) {
  const skill = skills.find(s => s.name === skillName);
  if (!skill) {
    console.error('Skill introuvable:', skillName);
    process.exit(1);
  }
  // Mock d’exécution (à compléter selon l’agent)
  console.log(`Test de la skill: ${skill.name}`);
  console.log('Description:', skill.description);
  // ...ajouter des mocks et assertions ici
}

if (process.argv.length > 2) {
  runSkillTest(process.argv[2]);
} else {
  console.log('Usage: node scripts/test-harness.js <skillName>');
}
import { findSkillsInDir, extractFrontmatter } from '../lib/skills-core.js';
import fs from 'fs';

const skills = findSkillsInDir('skills', 'superpowers', 3);
console.log('Test harness: skills trouvés:', skills.length);
skills.forEach(skill => {
  try {
    const front = extractFrontmatter(skill.skillFile);
    if (!front.name || !front.description) {
      throw new Error('Frontmatter incomplet');
    }
    console.log(`Skill OK: ${skill.name}`);
  } catch (e) {
    console.error(`Skill FAIL: ${skill.name} - ${e.message}`);
  }
});
