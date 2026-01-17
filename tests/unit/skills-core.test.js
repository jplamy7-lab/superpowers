import { extractFrontmatter, findSkillsInDir } from '../../lib/skills-core.js';
import fs from 'fs';
import path from 'path';

describe('extractFrontmatter', () => {
  it('should extract name and description from valid SKILL.md', () => {
    const testFile = path.join(__dirname, 'fixtures', 'SKILL.md');
    fs.writeFileSync(testFile, '---\nname: test-skill\ndescription: Ceci est un test\n---\n');
    const result = extractFrontmatter(testFile);
    expect(result.name).toBe('test-skill');
    expect(result.description).toBe('Ceci est un test');
    fs.unlinkSync(testFile);
  });

  it('should return empty strings for missing file', () => {
    const result = extractFrontmatter('nonexistent.md');
    expect(result.name).toBe('');
    expect(result.description).toBe('');
  });
});

// ...plus de tests à ajouter pour findSkillsInDir
