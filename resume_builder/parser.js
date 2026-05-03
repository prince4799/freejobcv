/**
 * Enhanced Heuristic-based Resume Parser
 * Designed to handle multi-page resumes and complex layouts
 */

function parseResumeText(text) {
    const data = {
        personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: []
    };

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l !== '---PAGE_BREAK---');
    const fullText = lines.join(' ');

    // 1. Better Contact Info Extraction
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+|github\.com\/[a-zA-Z0-9_-]+|[a-zA-Z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?/gi;

    const emails = fullText.match(emailRegex);
    if (emails) data.personal.email = emails[0];

    const phones = fullText.match(phoneRegex);
    if (phones) data.personal.phone = phones[0];

    const urls = fullText.match(urlRegex);
    if (urls) data.personal.website = urls.find(u => u.includes('linkedin') || u.includes('github') || u.includes('portfolio')) || urls[0];

    // 2. Name & Title Detection
    // Usually the first line is the name, second is the title
    if (lines.length > 0) {
        // Skip common headers if they appear at the top
        let firstLineIdx = 0;
        while (firstLineIdx < lines.length && (lines[firstLineIdx].length < 3 || /resume|cv|curriculum/i.test(lines[firstLineIdx]))) {
            firstLineIdx++;
        }
        data.personal.fullName = lines[firstLineIdx] || '';
        
        // Look for a job title in the next few lines (not an email or phone)
        for (let i = firstLineIdx + 1; i < Math.min(firstLineIdx + 5, lines.length); i++) {
            if (!lines[i].includes('@') && !phoneRegex.test(lines[i]) && lines[i].length > 5 && lines[i].length < 50) {
                data.personal.jobTitle = lines[i];
                break;
            }
        }
    }

    // 3. Section Segmentation
    const sectionHeaders = {
        experience: /EXPERIENCE|WORK HISTORY|EMPLOYMENT|PROFESSIONAL EXPERIENCE|CAREER/i,
        education: /EDUCATION|ACADEMIC|QUALIFICATIONS|STUDIES/i,
        skills: /SKILLS|TECHNICAL|COMPETENCIES|EXPERTISE|TECHNOLOGIES/i,
        summary: /SUMMARY|OBJECTIVE|PROFILE|ABOUT ME/i,
        projects: /PROJECTS|PERSONAL PROJECTS|ACADEMIC PROJECTS/i
    };

    let currentSection = null;
    const blocks = { experience: [], education: [], skills: [], summary: [], projects: [] };

    lines.forEach(line => {
        let isHeader = false;
        for (const [section, regex] of Object.entries(sectionHeaders)) {
            // Header is usually short and matches the regex
            if (regex.test(line) && line.length < 30) {
                currentSection = section;
                isHeader = true;
                break;
            }
        }

        if (!isHeader && currentSection) {
            blocks[currentSection].push(line);
        }
    });

    // 4. Refine Summary
    data.summary = blocks.summary.join(' ').trim();

    // 5. Refine Skills
    if (blocks.skills.length > 0) {
        const skillsText = blocks.skills.join(', ');
        data.skills = skillsText
            .split(/[,•|]|\s{2,}/)
            .map(s => s.trim())
            .filter(s => s.length > 1 && s.length < 40 && !sectionHeaders.skills.test(s));
    }

    // 6. Experience Parsing (State Machine)
    const datePattern = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|20\d{2}|Present|\d{2}\/\d{2,4})/i;

    if (blocks.experience.length > 0) {
        let currentExp = null;
        
        blocks.experience.forEach(line => {
            const hasDate = datePattern.test(line);
            
            if (hasDate || (line.length < 50 && currentExp === null)) {
                if (currentExp) data.experience.push(currentExp);
                
                const parts = line.split(/[|-–—]/);
                currentExp = {
                    company: (parts[0] || '').trim() || 'Company Name',
                    role: (parts[1] || '').trim() || 'Professional Role',
                    duration: line.match(new RegExp(datePattern.source + '.*' + datePattern.source, 'i'))?.[0] || line.match(datePattern)?.[0] || 'Duration',
                    description: ''
                };
            } else if (currentExp) {
                currentExp.description += line + ' ';
            }
        });
        if (currentExp) data.experience.push(currentExp);
    }

    // 7. Education Parsing
    if (blocks.education.length > 0) {
        let currentEdu = null;
        blocks.education.forEach(line => {
            if (/University|College|Institute|School|Academy/i.test(line) || datePattern.test(line)) {
                if (currentEdu) data.education.push(currentEdu);
                const parts = line.split(/[|-–—]/);
                currentEdu = {
                    school: (parts[0] || '').trim() || 'Institution',
                    degree: (parts[1] || '').trim() || 'Degree',
                    duration: line.match(datePattern)?.[0] || 'Year'
                };
            } else if (currentEdu && currentEdu.degree === 'Degree') {
                currentEdu.degree = line;
            }
        });
        if (currentEdu) data.education.push(currentEdu);
    }

    // 8. Projects Parsing
    if (blocks.projects.length > 0) {
        let currentProj = null;
        blocks.projects.forEach(line => {
            // New project often starts with a name and maybe a link or bullet
            if (line.length < 50 && (line.includes('http') || line.includes('github') || !line.includes(' '))) {
                if (currentProj) data.projects.push(currentProj);
                currentProj = {
                    name: line.replace(/[•*-]/g, '').trim(),
                    link: line.match(urlRegex)?.[0] || '',
                    description: ''
                };
            } else if (currentProj) {
                currentProj.description += line + ' ';
            } else {
                // First line as project name
                currentProj = { name: line, link: '', description: '' };
            }
        });
        if (currentProj) data.projects.push(currentProj);
    }

    // 9. Final Cleanups
    data.experience = data.experience.map(exp => ({
        ...exp,
        description: (exp.description || '').trim().substring(0, 500)
    }));

    data.projects = data.projects.map(proj => ({
        ...proj,
        description: (proj.description || '').trim().substring(0, 500)
    }));

    return data;
}
