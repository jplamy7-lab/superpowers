import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Extract YAML frontmatter from a skill file.
 * Current format:
 * ---
 * name: skill-name
 * description: Use when [condition] - [what it does]
 * ---
 *
 * @param {string} filePath - Path to SKILL.md file
 * @returns {{name: string, description: string}}
 */
function extractFrontmatter(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');


        let skillsCache = null;
        let cacheMtime = null;

        function getDirMtime(dir) {
            try {
                return fs.statSync(dir).mtimeMs;
            } catch {
                return null;
            }
        }

        function findSkillsInDir(dir, sourceType, maxDepth = 3) {
            const mtime = getDirMtime(dir);
            if (skillsCache && cacheMtime === mtime) {
                return skillsCache;
            }
            const skills = [];

            if (!fs.existsSync(dir)) {
                console.warn(`[skills-core] Dossier non trouvé: ${dir}`);
                return skills;
            }

            function recurse(currentDir, depth) {
                let entries = [];
                try {
                    entries = fs.readdirSync(currentDir, { withFileTypes: true });
                } catch (error) {
                    console.error(`[skills-core] Erreur lecture dossier ${currentDir}:`, error.message);
                    return;
                }

                for (const entry of entries) {
                    const fullPath = path.join(currentDir, entry.name);

                    if (entry.isDirectory()) {
                        // Check for SKILL.md in this directory
                        const skillFile = path.join(fullPath, 'SKILL.md');
                        if (fs.existsSync(skillFile)) {
                            const { name, description } = extractFrontmatter(skillFile);
                            skills.push({
                                path: fullPath,
                                skillFile: skillFile,
                                name: name || entry.name,
                                description: description || '',
                                sourceType: sourceType
                            });
                        }

                        // Recurse into subdirectories
                        recurse(fullPath, depth + 1);
                    }
                }
            }

            recurse(dir, 0);
            skillsCache = skills;
            cacheMtime = mtime;
            return skills;
        }
    const skills = [];

    if (!fs.existsSync(dir)) {
        console.warn(`[skills-core] Dossier non trouvé: ${dir}`);
        return skills;
    }

    function recurse(currentDir, depth) {
        if (depth > maxDepth) return;

        let entries = [];
        try {
            entries = fs.readdirSync(currentDir, { withFileTypes: true });
        } catch (error) {
            console.error(`[skills-core] Erreur lecture dossier ${currentDir}:`, error.message);
            return;
        }

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                // Check for SKILL.md in this directory
                const skillFile = path.join(fullPath, 'SKILL.md');
                if (fs.existsSync(skillFile)) {
                    const { name, description } = extractFrontmatter(skillFile);
                    skills.push({
                        path: fullPath,
                        skillFile: skillFile,
                        name: name || entry.name,
                        description: description || '',
                        sourceType: sourceType
                    });
                }

                // Recurse into subdirectories
                recurse(fullPath, depth + 1);
            }
        }
    }

    recurse(dir, 0);
    return skills;
}

/**
 * Resolve a skill name to its file path, handling shadowing
 * (personal skills override superpowers skills).
 *
 * @param {string} skillName - Name like "superpowers:brainstorming" or "my-skill"
 * @param {string} superpowersDir - Path to superpowers skills directory
 * @param {string} personalDir - Path to personal skills directory
 * @returns {{skillFile: string, sourceType: string, skillPath: string} | null}
 */
function resolveSkillPath(skillName, superpowersDir, personalDir) {
    // Strip superpowers: prefix if present
    const forceSuperpowers = skillName.startsWith('superpowers:');
    const actualSkillName = forceSuperpowers ? skillName.replace(/^superpowers:/, '') : skillName;

    // Try personal skills first (unless explicitly superpowers:)
    try {
        if (!forceSuperpowers && personalDir) {
            const personalPath = path.join(personalDir, actualSkillName);
            const personalSkillFile = path.join(personalPath, 'SKILL.md');
            if (fs.existsSync(personalSkillFile)) {
                return {
                    skillFile: personalSkillFile,
                    sourceType: 'personal',
                    skillPath: actualSkillName
                };
            }
        }

        // Try superpowers skills
        if (superpowersDir) {
            const superpowersPath = path.join(superpowersDir, actualSkillName);
            const superpowersSkillFile = path.join(superpowersPath, 'SKILL.md');
            if (fs.existsSync(superpowersSkillFile)) {
                return {
                    skillFile: superpowersSkillFile,
                    sourceType: 'superpowers',
                    skillPath: actualSkillName
                };
            }
        }
    } catch (error) {
        console.error(`[skills-core] Erreur résolution skill ${skillName}:`, error.message);
    }
    return null;
}

/**
 * Check if a git repository has updates available.
 *
 * @param {string} repoDir - Path to git repository
 * @returns {boolean} - True if updates are available
 */
function checkForUpdates(repoDir) {
    try {
        // Quick check with 3 second timeout to avoid delays if network is down
        const output = execSync('git fetch origin && git status --porcelain=v1 --branch', {
            cwd: repoDir,
            timeout: 3000,
            encoding: 'utf8',
            stdio: 'pipe'
        });

        // Parse git status output to see if we're behind
        const statusLines = output.split('\n');
        for (const line of statusLines) {
            if (line.startsWith('## ') && line.includes('[behind ')) {
                return true; // We're behind remote
            }
        }
        return false; // Up to date
    } catch (error) {
        console.error(`[skills-core] Erreur git dans ${repoDir}:`, error.message);
        // Network down, git error, timeout, etc. - don't block bootstrap
        return false;
    }
}

/**
 * Strip YAML frontmatter from skill content, returning just the content.
 *
 * @param {string} content - Full content including frontmatter
 * @returns {string} - Content without frontmatter
 */
function stripFrontmatter(content) {
    const lines = content.split('\n');
    let inFrontmatter = false;
    let frontmatterEnded = false;
    const contentLines = [];

    for (const line of lines) {
        if (line.trim() === '---') {
            if (inFrontmatter) {
                frontmatterEnded = true;
                continue;
            }
            inFrontmatter = true;
            continue;
        }

        if (frontmatterEnded || !inFrontmatter) {
            contentLines.push(line);
        }
    }

    return contentLines.join('\n').trim();
}

export {
    extractFrontmatter,
    findSkillsInDir,
    resolveSkillPath,
    checkForUpdates,
    stripFrontmatter
};
