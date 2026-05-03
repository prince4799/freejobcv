/**
 * FreejobCV Resume Builder Pro
 * Core Application Logic
 */

// Template Registry (Combinations of Layout, Theme, Font)
const templates = [
    { id: 't1', name: 'Executive Pro', layout: 'classic', theme: 'midnight', font: 'serif' },
    { id: 't2', name: 'Modern Sky', layout: 'sidebar-left', theme: 'sapphire', font: 'modern' },
    { id: 't3', name: 'Creative Ruby', layout: 'minimal', theme: 'ruby', font: 'elegant' },
    { id: 't4', name: 'Emerald Sidebar', layout: 'sidebar-right', theme: 'emerald', font: 'modern' },
    { id: 't5', name: 'Midnight Grid', layout: 'grid', theme: 'midnight', font: 'modern' },
    { id: 't6', name: 'Golden Era', layout: 'classic', theme: 'gold', font: 'serif' },
    { id: 't7', name: 'Sunset Minimal', layout: 'minimal', theme: 'sunset', font: 'elegant' },
    { id: 't8', name: 'Oceanic Split', layout: 'sidebar-left', theme: 'ocean', font: 'modern' },
    { id: 't9', name: 'Royal Classic', layout: 'classic', theme: 'royal', font: 'elegant' },
    { id: 't10', name: 'Slate Professional', layout: 'sidebar-right', theme: 'slate', font: 'modern' },
    { id: 't11', name: 'Forest Grid', layout: 'grid', theme: 'forest', font: 'modern' },
    { id: 't12', name: 'Rose Elegant', layout: 'minimal', theme: 'rose', font: 'elegant' },
    { id: 't13', name: 'Deep Midnight', layout: 'sidebar-left', theme: 'midnight', font: 'serif' },
    { id: 't14', name: 'Tech Sapphire', layout: 'grid', theme: 'sapphire', font: 'modern' },
    { id: 't15', name: 'Minimalist Slate', layout: 'classic', theme: 'slate', font: 'modern' },
    { id: 't16', name: 'Vibrant Sunset', layout: 'sidebar-right', theme: 'sunset', font: 'elegant' },
    { id: 't17', name: 'Emerald Classic', layout: 'classic', theme: 'emerald', font: 'serif' },
    { id: 't18', name: 'Ocean Grid', layout: 'grid', theme: 'ocean', font: 'modern' },
    { id: 't19', name: 'Ruby Sidebar', layout: 'sidebar-left', theme: 'ruby', font: 'modern' },
    { id: 't20', name: 'Golden Minimal', layout: 'minimal', theme: 'gold', font: 'serif' },
    { id: 't21', name: 'Royal Sidebar', layout: 'sidebar-right', theme: 'royal', font: 'elegant' },
    { id: 't22', name: 'Classic Blue', layout: 'classic', theme: 'default', font: 'modern' },
    { id: 't23', name: 'Midnight Minimal', layout: 'minimal', theme: 'midnight', font: 'modern' },
    { id: 't24', name: 'Oceanic Classic', layout: 'classic', theme: 'ocean', font: 'elegant' },
    { id: 't25', name: 'Forest Sidebar', layout: 'sidebar-left', theme: 'forest', font: 'modern' },
    { id: 't26', name: 'Tech Master', layout: 'classic', theme: 'tech', font: 'tech' },
    { id: 't27', name: 'Creative Split', layout: 'asymmetric', theme: 'creative-red', font: 'elegant' },
    { id: 't28', name: 'Executive Border', layout: 'bordered', theme: 'midnight', font: 'serif' },
    { id: 't29', name: 'Modern Asymmetric', layout: 'asymmetric', theme: 'soft-green', font: 'modern' },
    { id: 't30', name: 'Clean Border', layout: 'bordered', theme: 'default', font: 'modern' }
];

let resumeData = {
    personal: {
        fullName: 'John Doe',
        jobTitle: 'Senior Software Engineer',
        email: 'john.doe@example.com',
        phone: '+1 234 567 890',
        location: 'New York, USA',
        website: 'linkedin.com/in/johndoe'
    },
    summary: 'Experienced software engineer with a passion for building scalable web applications and leading cross-functional teams.',
    experience: [
        {
            company: 'Tech Solutions Inc.',
            role: 'Senior Developer',
            duration: '2020 - Present',
            description: 'Leading the frontend team in developing high-performance React applications.'
        }
    ],
    education: [
        {
            school: 'University of Technology',
            degree: 'B.S. in Computer Science',
            duration: '2014 - 2018'
        }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'UI/UX Design'],
    projects: [
        {
            name: 'E-commerce Platform',
            link: 'github.com/johndoe/shop',
            description: 'Built a full-stack e-commerce solution using Next.js and Stripe.'
        }
    ],
    templateId: 't1'
};

// Initialize Lucide Icons
lucide.createIcons();

// DOM Elements
const templateContainer = document.querySelector('.template-selector');
const previewArea = document.querySelector('.preview-area');
const experienceList = document.getElementById('experience-list');
const educationList = document.getElementById('education-list');
const projectsList = document.getElementById('projects-list');
const dropZone = document.getElementById('drop-zone');
const pdfUpload = document.getElementById('pdf-upload');
const downloadBtn = document.getElementById('download-pdf');
const resetBtn = document.getElementById('reset-btn');
const zoomSlider = document.getElementById('zoom-slider');

// Zoom Logic
zoomSlider.addEventListener('input', (e) => {
    const scale = e.target.value;
    document.querySelectorAll('.resume-sheet').forEach(sheet => {
        sheet.style.transform = `scale(${scale})`;
    });
});

// Local Storage Helpers
function saveToLocal() {
    localStorage.setItem('freejobcv_resume_data', JSON.stringify(resumeData));
}

function loadFromLocal() {
    const saved = localStorage.getItem('freejobcv_resume_data');
    if (saved) {
        resumeData = JSON.parse(saved);
        return true;
    }
    return false;
}

// Reset Logic
resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset? This will clear all entered data.')) {
        localStorage.removeItem('freejobcv_resume_data');
        location.reload();
    }
});

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-tab`).classList.remove('hidden');
    });
});

// Render Template Selector
function renderTemplateSelector() {
    templateContainer.innerHTML = templates.map(t => {
        const hasSidebar = ['sidebar-left', 'sidebar-right', 'asymmetric'].includes(t.layout);
        return `
            <div class="template-card ${resumeData.templateId === t.id ? 'active' : ''} theme-${t.theme} font-${t.font}" data-id="${t.id}">
                ${hasSidebar ? '<div class="template-badge">Best for single page</div>' : ''}
                <div class="preview-mini ${t.layout}">
                    ${t.layout === 'sidebar-left' ? '<div class="mini-sidebar"></div><div class="mini-main"></div>' : ''}
                    ${t.layout === 'sidebar-right' ? '<div class="mini-main"></div><div class="mini-sidebar"></div>' : ''}
                    ${t.layout === 'asymmetric' ? '<div class="mini-main"></div><div class="mini-sidebar"></div>' : ''}
                    ${t.layout === 'classic' ? '<div class="mini-header"></div><div class="mini-main"></div>' : ''}
                    ${t.layout === 'minimal' || t.layout === 'grid' || t.layout === 'bordered' ? '<div class="mini-main"></div>' : ''}
                </div>
                <span>${t.name}</span>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            resumeData.templateId = card.dataset.id;
            saveToLocal();
            updatePreview();
        });
    });
}

// Dynamic Items (Experience & Education)
function addExperience(data = { company: '', role: '', duration: '', description: '' }) {
    const id = data.id || Date.now();
    const html = `
        <div class="item-row" id="exp-${id}">
            <button class="remove-btn" onclick="removeItem('exp-${id}')"><i data-lucide="x"></i></button>
            <div class="input-grid">
                <input type="text" placeholder="Company" value="${data.company || ''}" oninput="updateItem('experience', ${id}, 'company', this.value)">
                <input type="text" placeholder="Role" value="${data.role || ''}" oninput="updateItem('experience', ${id}, 'role', this.value)">
                <input type="text" placeholder="Duration" value="${data.duration || ''}" oninput="updateItem('experience', ${id}, 'duration', this.value)">
            </div>
            <textarea placeholder="Description" oninput="updateItem('experience', ${id}, 'description', this.value)" style="margin-top: 1rem;">${data.description || ''}</textarea>
        </div>
    `;
    experienceList.insertAdjacentHTML('beforeend', html);
    lucide.createIcons();
    
    if (!data.id) {
        resumeData.experience.push({ ...data, id });
        saveToLocal();
    }
    updatePreview();
}

function addEducation(data = { school: '', degree: '', duration: '' }) {
    const id = data.id || Date.now();
    const html = `
        <div class="item-row" id="edu-${id}">
            <button class="remove-btn" onclick="removeItem('edu-${id}')"><i data-lucide="x"></i></button>
            <div class="input-grid">
                <input type="text" placeholder="School" value="${data.school || ''}" oninput="updateItem('education', ${id}, 'school', this.value)">
                <input type="text" placeholder="Degree" value="${data.degree || ''}" oninput="updateItem('education', ${id}, 'degree', this.value)">
                <input type="text" placeholder="Duration" value="${data.duration || ''}" oninput="updateItem('education', ${id}, 'duration', this.value)">
            </div>
        </div>
    `;
    educationList.insertAdjacentHTML('beforeend', html);
    lucide.createIcons();
    
    if (!data.id) {
        resumeData.education.push({ ...data, id });
        saveToLocal();
    }
    updatePreview();
}

function addProject(data = { name: '', link: '', description: '' }) {
    const id = data.id || Date.now();
    const html = `
        <div class="item-row" id="proj-${id}">
            <button class="remove-btn" onclick="removeItem('proj-${id}')"><i data-lucide="x"></i></button>
            <div class="input-grid">
                <input type="text" placeholder="Project Name" value="${data.name || ''}" oninput="updateItem('projects', ${id}, 'name', this.value)">
                <input type="text" placeholder="Link/URL" value="${data.link || ''}" oninput="updateItem('projects', ${id}, 'link', this.value)">
            </div>
            <textarea placeholder="Description" oninput="updateItem('projects', ${id}, 'description', this.value)" style="margin-top: 1rem;">${data.description || ''}</textarea>
        </div>
    `;
    projectsList.insertAdjacentHTML('beforeend', html);
    lucide.createIcons();
    
    if (!data.id) {
        resumeData.projects.push({ ...data, id });
        saveToLocal();
    }
    updatePreview();
}

function removeItem(id) {
    const element = document.getElementById(id);
    let type;
    if (id.startsWith('exp')) type = 'experience';
    else if (id.startsWith('edu')) type = 'education';
    else if (id.startsWith('proj')) type = 'projects';
    
    const numericId = parseInt(id.split('-')[1]);
    
    resumeData[type] = resumeData[type].filter(item => item.id !== numericId);
    element.remove();
    saveToLocal();
    updatePreview();
}

function updateItem(type, id, field, value) {
    const item = resumeData[type].find(i => i.id === id);
    if (item) {
        item[field] = value;
        saveToLocal();
        updatePreview();
    }
}

// Event Listeners for Personal Info
document.getElementById('full-name').addEventListener('input', (e) => { resumeData.personal.fullName = e.target.value; saveToLocal(); updatePreview(); });
document.getElementById('job-title').addEventListener('input', (e) => { resumeData.personal.jobTitle = e.target.value; saveToLocal(); updatePreview(); });
document.getElementById('email').addEventListener('input', (e) => { resumeData.personal.email = e.target.value; saveToLocal(); updatePreview(); });
document.getElementById('phone').addEventListener('input', (e) => { resumeData.personal.phone = e.target.value; saveToLocal(); updatePreview(); });
document.getElementById('location').addEventListener('input', (e) => { resumeData.personal.location = e.target.value; saveToLocal(); updatePreview(); });
document.getElementById('website').addEventListener('input', (e) => { resumeData.personal.website = e.target.value; saveToLocal(); updatePreview(); });
document.getElementById('summary-text').addEventListener('input', (e) => { resumeData.summary = e.target.value; saveToLocal(); updatePreview(); });
document.getElementById('skills-input').addEventListener('input', (e) => { 
    resumeData.skills = e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''); 
    saveToLocal();
    updatePreview(); 
});

// Update Preview HTML
function updatePreview() {
    const { personal, summary, experience, education, projects, skills, templateId } = resumeData;
    const template = templates.find(t => t.id === templateId);
    
    // Clear preview and prepare for multiple pages
    const previewArea = document.querySelector('.preview-area');
    const zoomScale = zoomSlider.value;
    
    // Helper to create a new page
    function createPage() {
        const page = document.createElement('div');
        page.className = `resume-sheet layout-${template.layout} theme-${template.theme} font-${template.font}`;
        page.style.transform = `scale(${zoomScale})`;
        return page;
    }

    const headerHtml = `
        <header class="resume-header">
            <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">${personal.fullName || 'Your Name'}</h1>
            <p style="font-weight: 600; color: var(--resume-accent); margin-bottom: 1rem; font-size: 1.1rem;">${personal.jobTitle}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: var(--resume-secondary);">
                <span>${personal.email}</span>
                <span>${personal.phone}</span>
                <span>${personal.location}</span>
                <span>${personal.website}</span>
            </div>
        </header>
    `;

    const summaryHtml = summary ? `
        <section class="resume-section">
            <h2>Professional Summary</h2>
            <p style="line-height: 1.6;">${summary}</p>
        </section>
    ` : '';

    const experienceItems = experience.map(exp => `
        <div class="resume-item">
            <div class="item-header">
                <span>${exp.company}</span>
                <span>${exp.duration}</span>
            </div>
            <div class="item-subheader">
                <span>${exp.role}</span>
            </div>
            <p class="item-desc">${exp.description}</p>
        </div>
    `);

    const educationItems = education.map(edu => `
        <div class="resume-item">
            <div class="item-header">
                <span>${edu.school}</span>
                <span>${edu.duration}</span>
            </div>
            <div class="item-subheader">
                <span>${edu.degree}</span>
            </div>
        </div>
    `);

    const projectsItems = projects.map(proj => `
        <div class="resume-item">
            <div class="item-header">
                <span>${proj.name}</span>
                <span style="font-weight: 400; font-size: 0.8rem; color: var(--resume-accent);">${proj.link}</span>
            </div>
            <p class="item-desc">${proj.description}</p>
        </div>
    `);

    const skillsHtml = `
        <section class="resume-section">
            <h2>Skills</h2>
            <div class="skills-list">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </section>
    `;

    // Internal function to render content into pages
    function paginate() {
        previewArea.innerHTML = '';
        let currentPage = createPage();
        previewArea.appendChild(currentPage);
        
        let targetContainer;
        if (template.layout === 'sidebar-left') {
            currentPage.innerHTML = '<div class="resume-sidebar"></div><div class="resume-main"></div>';
            targetContainer = currentPage.querySelector('.resume-main');
            currentPage.querySelector('.resume-sidebar').innerHTML = headerHtml + skillsHtml;
        } else if (template.layout === 'sidebar-right') {
            currentPage.innerHTML = '<div class="resume-main"></div><div class="resume-sidebar"></div>';
            targetContainer = currentPage.querySelector('.resume-main');
            currentPage.querySelector('.resume-sidebar').innerHTML = skillsHtml;
            targetContainer.innerHTML = headerHtml;
        } else if (template.layout === 'asymmetric') {
            currentPage.innerHTML = '<div class="resume-main"></div><div class="resume-sidebar"></div>';
            targetContainer = currentPage.querySelector('.resume-main');
            currentPage.querySelector('.resume-sidebar').innerHTML = skillsHtml;
            targetContainer.innerHTML = headerHtml;
        } else if (template.layout === 'bordered') {
            currentPage.innerHTML = '<div class="resume-content"></div>';
            targetContainer = currentPage.querySelector('.resume-content');
            targetContainer.innerHTML = headerHtml;
        } else {
            currentPage.innerHTML = '<div class="resume-content"></div>';
            targetContainer = currentPage.querySelector('.resume-content');
            targetContainer.innerHTML = headerHtml;
        }

        const maxContentHeight = 1050; // Max height for content within a 1123px (297mm) page

        function addContent(html, title = '') {
            const tempDiv = document.createElement('div');
            if (title) tempDiv.innerHTML = `<section class="resume-section"><h2>${title}</h2>${html}</section>`;
            else tempDiv.innerHTML = html;
            
            targetContainer.appendChild(tempDiv);
            
            // Measure the height of all content on the current page
            // We check if the bottom of the last element exceeds the page limit
            const pageRect = currentPage.getBoundingClientRect();
            const contentRect = tempDiv.getBoundingClientRect();
            const relativeBottom = (contentRect.bottom - pageRect.top) / zoomScale;
            
            if (relativeBottom > maxContentHeight) {
                // Move to new page
                targetContainer.removeChild(tempDiv);
                currentPage = createPage();
                previewArea.appendChild(currentPage);
                
                if (template.layout === 'sidebar-left' || template.layout === 'sidebar-right' || template.layout === 'asymmetric') {
                    currentPage.innerHTML = '<div class="resume-main"></div>';
                    targetContainer = currentPage.querySelector('.resume-main');
                } else {
                    currentPage.innerHTML = '<div class="resume-content"></div>';
                    targetContainer = currentPage.querySelector('.resume-content');
                }
                
                if (title) tempDiv.innerHTML = `<section class="resume-section"><h2>${title}</h2>${html}</section>`;
                targetContainer.appendChild(tempDiv);
            }
        }

        if (summaryHtml) addContent(summaryHtml);
        
        if (experienceItems.length > 0) {
            addContent(experienceItems[0], 'Experience');
            for (let i = 1; i < experienceItems.length; i++) {
                addContent(experienceItems[i]);
            }
        }
        
        if (projectsItems.length > 0) {
            addContent(projectsItems[0], 'Projects');
            for (let i = 1; i < projectsItems.length; i++) {
                addContent(projectsItems[i]);
            }
        }
        
        if (educationItems.length > 0) {
            addContent(educationItems[0], 'Education');
            for (let i = 1; i < educationItems.length; i++) {
                addContent(educationItems[i]);
            }
        }

        if (template.layout !== 'sidebar-left' && template.layout !== 'sidebar-right') {
            addContent(skillsHtml);
        }
    }

    paginate();
}

// PDF Export (Using browser print)
downloadBtn.addEventListener('click', () => {
    window.print();
});

// PDF Upload & Parsing
dropZone.addEventListener('click', () => pdfUpload.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handlePDF(file);
});

pdfUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handlePDF(file);
});

async function handlePDF(file) {
    if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
    }
    
    // Set worker source for pdf.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    previewArea.innerHTML = `
        <div class="loading-state">
            <i data-lucide="loader-2" class="spin"></i>
            <p>Analyzing your resume...</p>
        </div>
    `;
    lucide.createIcons();

    const reader = new FileReader();
    reader.onload = async function() {
        const typedarray = new Uint8Array(this.result);
        try {
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Group items by their vertical position (y-coordinate) to reconstruct lines
                const items = textContent.items;
                const lines = {};
                
                items.forEach(item => {
                    if (!item.transform) return; // Safety check for non-text items
                    const y = Math.round(item.transform[5]); // Y-coordinate
                    if (!lines[y]) lines[y] = [];
                    lines[y].push(item);
                });
                
                // Sort lines from top to bottom
                const sortedY = Object.keys(lines).sort((a, b) => b - a);
                
                sortedY.forEach(y => {
                    // Sort items in each line from left to right
                    const lineItems = lines[y].sort((a, b) => a.transform[4] - b.transform[4]);
                    const lineText = lineItems.map(item => item.str).join(' ');
                    if (lineText.trim()) {
                        fullText += lineText + '\n';
                    }
                });
                
                fullText += '\n---PAGE_BREAK---\n'; // Mark page breaks for the parser
            }
            
            const parsedData = parseResumeText(fullText);
            applyParsedData(parsedData);
        } catch (err) {
            console.error('Detailed PDF Parse Error:', err);
            alert(`Failed to parse PDF: ${err.message || 'Unknown error'}`);
            updatePreview();
        }
    };
    reader.readAsArrayBuffer(file);
}

function applyParsedData(data) {
    if (!data) return;

    // Apply Personal Info
    if (data.personal) {
        const p = data.personal;
        resumeData.personal = { ...resumeData.personal, ...p };
        document.getElementById('full-name').value = p.fullName || resumeData.personal.fullName;
        document.getElementById('job-title').value = p.jobTitle || resumeData.personal.jobTitle;
        document.getElementById('email').value = p.email || resumeData.personal.email;
        document.getElementById('phone').value = p.phone || resumeData.personal.phone;
        document.getElementById('website').value = p.website || resumeData.personal.website;
    }
    
    // Apply Summary
    if (data.summary) {
        resumeData.summary = data.summary;
        document.getElementById('summary-text').value = data.summary;
    }
    
    // Apply Skills
    if (data.skills && data.skills.length > 0) {
        resumeData.skills = data.skills;
        document.getElementById('skills-input').value = data.skills.join(', ');
    }
    
    // Apply Experience
    if (data.experience && data.experience.length > 0) {
        experienceList.innerHTML = '';
        resumeData.experience = [];
        data.experience.forEach(exp => addExperience(exp));
    }
    
    // Apply Education
    if (data.education && data.education.length > 0) {
        educationList.innerHTML = '';
        resumeData.education = [];
        data.education.forEach(edu => addEducation(edu));
    }

    // Apply Projects
    if (data.projects && data.projects.length > 0) {
        projectsList.innerHTML = '';
        resumeData.projects = [];
        data.projects.forEach(proj => addProject(proj));
    }
    
    updatePreview();
    
    // Switch to Edit tab to show the filled data
    document.querySelector('[data-tab="edit"]').click();
}

function init() {
    loadFromLocal();
    
    document.getElementById('full-name').value = resumeData.personal.fullName;
    document.getElementById('job-title').value = resumeData.personal.jobTitle;
    document.getElementById('email').value = resumeData.personal.email;
    document.getElementById('phone').value = resumeData.personal.phone;
    document.getElementById('location').value = resumeData.personal.location;
    document.getElementById('website').value = resumeData.personal.website;
    document.getElementById('summary-text').value = resumeData.summary;
    document.getElementById('skills-input').value = resumeData.skills.join(', ');
    
    experienceList.innerHTML = '';
    resumeData.experience.forEach((exp, index) => {
        addExperience(exp);
    });
    
    educationList.innerHTML = '';
    resumeData.education.forEach((edu, index) => {
        addEducation(edu);
    });

    projectsList.innerHTML = '';
    if (resumeData.projects) {
        resumeData.projects.forEach((proj, index) => {
            addProject(proj);
        });
    }
    
    renderTemplateSelector();
    updatePreview();
}

init();
