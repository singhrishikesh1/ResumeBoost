import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to escape HTML to prevent XSS injection in generated document
function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function generateResumePDF(resumeData: any, template: string, fontSize: number): Promise<Buffer> {
  // Read frontend stylesheet dynamically so CSS changes are automatically propagated
  let styles = '';
  try {
    const cssPath = path.resolve(__dirname, '../../frontend/src/index.css');
    if (fs.existsSync(cssPath)) {
      styles = fs.readFileSync(cssPath, 'utf8');
    }
  } catch (error) {
    console.error('Warning: Could not read frontend index.css, falling back to basic styling.', error);
  }

  // Generate HTML structure identical to React's App.tsx rendering
  const emailHtml = resumeData.personalInfo.email 
    ? `<span>${escapeHtml(resumeData.personalInfo.email)}</span>` 
    : '';
  const phoneHtml = resumeData.personalInfo.phone 
    ? `<span>${escapeHtml(resumeData.personalInfo.phone)}</span>` 
    : '';
  const locationHtml = resumeData.personalInfo.location 
    ? `<span>${escapeHtml(resumeData.personalInfo.location)}</span>` 
    : '';
  const websiteHtml = resumeData.personalInfo.website 
    ? `<span>${escapeHtml(resumeData.personalInfo.website.replace(/^https?:\/\//, ''))}</span>` 
    : '';

  // Render Experience list items
  let experienceHtml = '';
  if (resumeData.experience && resumeData.experience.length > 0) {
    experienceHtml = `
      <div class="res-section">
        <h3>Experience</h3>
        ${resumeData.experience.map((exp: any) => `
          <div class="res-item" style="margin-bottom: 1.2em;">
            <div class="res-item-header">
              <span style="font-weight: bold;">${escapeHtml(exp.company)}</span>
              <span>${escapeHtml(exp.duration)}</span>
            </div>
            <div class="res-item-sub">
              <span style="font-style: italic;">${escapeHtml(exp.role)}</span>
            </div>
            ${exp.bullets && exp.bullets.filter((b: string) => b.trim()).length > 0 ? `
              <ul class="res-bullet-list">
                ${exp.bullets.filter((b: string) => b.trim()).map((bullet: string) => `
                  <li style="line-height: 1.4; margin-bottom: 0.2em;">${escapeHtml(bullet)}</li>
                `).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Render Projects list items
  let projectsHtml = '';
  if (resumeData.projects && resumeData.projects.length > 0) {
    projectsHtml = `
      <div class="res-section">
        <h3>Projects</h3>
        ${resumeData.projects.map((proj: any) => `
          <div class="res-item" style="margin-bottom: 1.2em;">
            <div class="res-item-header">
              <span style="font-weight: bold;">${escapeHtml(proj.name)}</span>
              ${proj.role ? `<span style="font-style: italic; font-weight: normal;">${escapeHtml(proj.role)}</span>` : ''}
            </div>
            ${proj.bullets && proj.bullets.filter((b: string) => b.trim()).length > 0 ? `
              <ul class="res-bullet-list" style="margin-top: 0.3em;">
                ${proj.bullets.filter((b: string) => b.trim()).map((bullet: string) => `
                  <li style="line-height: 1.4; margin-bottom: 0.2em;">${escapeHtml(bullet)}</li>
                `).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Render Education list items
  let educationHtml = '';
  if (resumeData.education && resumeData.education.length > 0) {
    educationHtml = `
      <div class="res-section">
        <h3>Education</h3>
        ${resumeData.education.map((edu: any) => `
          <div class="res-item" style="margin-bottom: 1.2em;">
            <div class="res-item-header">
              <span style="font-weight: bold;">${escapeHtml(edu.school)}</span>
              <span>${escapeHtml(edu.duration)}</span>
            </div>
            <div class="res-item-sub">
              <span>${escapeHtml(edu.degree)}</span>
            </div>
            ${edu.bullets && edu.bullets.filter((b: string) => b.trim()).length > 0 ? `
              <ul class="res-bullet-list">
                ${edu.bullets.filter((b: string) => b.trim()).map((bullet: string) => `
                  <li style="line-height: 1.4; margin-bottom: 0.2em;">${escapeHtml(bullet)}</li>
                `).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Render Skills
  let skillsHtml = '';
  const activeSkills = resumeData.skills ? resumeData.skills.filter((s: string) => s.trim()) : [];
  if (activeSkills.length > 0) {
    skillsHtml = `
      <div class="res-section" style="margin-bottom: 0;">
        <h3>Skills</h3>
        <p class="res-skills-list" style="line-height: 1.5;">
          ${activeSkills.map((s: string) => escapeHtml(s)).join('  •  ')}
        </p>
      </div>
    `;
  }

  // Put together the full HTML page shell
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        ${styles}
        /* Override body styling for printing */
        body {
          margin: 0;
          padding: 0;
          background: white !important;
          color: black !important;
          -webkit-print-color-adjust: exact;
        }
        .resume-document {
          width: 100% !important;
          min-height: auto !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
          font-size: ${fontSize}px !important;
        }
      </style>
    </head>
    <body>
      <div class="resume-document ${escapeHtml(template)}">
        <div class="res-header">
          <div>
            <h1 class="res-name" style="margin: 0; font-size: 2.2em;">
              ${escapeHtml(resumeData.personalInfo.fullName || 'Your Name')}
            </h1>
            <div class="res-title" style="font-size: 1.1em; font-weight: 500;">
              ${escapeHtml(resumeData.experience[0]?.role || 'Professional')}
            </div>
          </div>
          <div class="res-contact" style="display: flex; flex-direction: column; gap: 0.2em;">
            ${emailHtml}
            ${phoneHtml}
            ${locationHtml}
            ${websiteHtml}
          </div>
        </div>

        ${resumeData.summary ? `
          <div class="res-section">
            <h3>Summary</h3>
            <p style="line-height: 1.5;">${escapeHtml(resumeData.summary)}</p>
          </div>
        ` : ''}

        ${experienceHtml}
        ${projectsHtml}
        ${educationHtml}
        ${skillsHtml}
      </div>
    </body>
    </html>
  `;

  // Launch headless browser and output page PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Generate PDF buffer
  const pdfBuffer = await page.pdf({
    format: 'a4',
    printBackground: true,
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '20mm',
      right: '20mm'
    }
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
}







