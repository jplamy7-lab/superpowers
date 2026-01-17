// Test de charge/stress pour les skills
import { findSkillsInDir } from '../../lib/skills-core.js';
import path from 'path';

describe('Stress test skills discovery', () => {
  it('should handle 1000 fake skills without crash', () => {
    const fakeDir = path.join(__dirname, 'fake-skills');
    // Générer 1000 dossiers SKILL.md fictifs
    for (let i = 0; i < 1000; i++) {
      const dir = path.join(fakeDir, `skill${i}`);
      require('fs').mkdirSync(dir, { recursive: true });
      require('fs').writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: skill${i}\ndescription: stress test\n---\n`);
    }
    const skills = findSkillsInDir(fakeDir, 'stress', 2);
    expect(skills.length).toBe(1000);
  });
});
