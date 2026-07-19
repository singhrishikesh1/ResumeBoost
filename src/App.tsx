import { useState } from 'react';
import { Header } from './components/Header';
import { JobMatcher } from './components/JobMatcher';
import { ATSDashboard } from './components/ATSDashboard';
import { ResumeEditor } from './components/ResumeEditor';
import { TemplateSelector, type ResumeTemplate } from './components/TemplateSelector';
import { analyzeResume } from './utils/atsEngine';
import { initialResumeData, initialJobDescription } from './utils/mockResume';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

function App() {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [activeTemplate, setActiveTemplate] = useState<ResumeTemplate>('modern');
  const [fontSize, setFontSize] = useState<number>(14);

  // Compute real-time ATS report
  const report = analyzeResume(resumeData, jobDescription);

  return (
    <>
      <Header />
      
      <main className="container" style={{ paddingBottom: '3rem' }}>
        <div className="dashboard-grid">
          
          {/* Left Panel: Inputs & ATS Feedback */}
          <div className="sidebar-panel">
            <JobMatcher value={jobDescription} onChange={setJobDescription} />
            <ATSDashboard report={report} />
            <ResumeEditor data={resumeData} onChange={setResumeData} />
          </div>
          
          {/* Right Panel: Live PDF Preview */}
          <div className="resume-preview-container">
            <TemplateSelector 
              activeTemplate={activeTemplate} 
              onTemplateChange={setActiveTemplate} 
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
            />
            
            <div className="preview-scroller">
              <div 
                className={`resume-document ${activeTemplate}`} 
                style={{ fontSize: `${fontSize}px` }}
              >
                {/* Resume Header */}
                <div className="res-header">
                  <div>
                    <h1 className="res-name" style={{ margin: 0, fontSize: '2.2em' }}>
                      {resumeData.personalInfo.fullName || 'Your Name'}
                    </h1>
                    <div className="res-title" style={{ fontSize: '1.1em', fontWeight: 500 }}>
                      {resumeData.experience[0]?.role || 'Professional'}
                    </div>
                  </div>
                  <div className="res-contact" style={{ display: 'flex', flexDirection: 'column', gap: '0.2em' }}>
                    {resumeData.personalInfo.email && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', justifyContent: activeTemplate === 'executive' ? 'center' : 'flex-end' }}>
                        <Mail size={12} /> {resumeData.personalInfo.email}
                      </span>
                    )}
                    {resumeData.personalInfo.phone && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', justifyContent: activeTemplate === 'executive' ? 'center' : 'flex-end' }}>
                        <Phone size={12} /> {resumeData.personalInfo.phone}
                      </span>
                    )}
                    {resumeData.personalInfo.location && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', justifyContent: activeTemplate === 'executive' ? 'center' : 'flex-end' }}>
                        <MapPin size={12} /> {resumeData.personalInfo.location}
                      </span>
                    )}
                    {resumeData.personalInfo.website && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', justifyContent: activeTemplate === 'executive' ? 'center' : 'flex-end' }}>
                        <Globe size={12} /> {resumeData.personalInfo.website.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {resumeData.summary && (
                  <div className="res-section">
                    <h3>Summary</h3>
                    <p style={{ lineHeight: '1.5' }}>{resumeData.summary}</p>
                  </div>
                )}

                {/* Experience Section */}
                {resumeData.experience.length > 0 && (
                  <div className="res-section">
                    <h3>Experience</h3>
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="res-item" style={{ marginBottom: '1.2em' }}>
                        <div className="res-item-header">
                          <span style={{ fontWeight: 'bold' }}>{exp.company}</span>
                          <span>{exp.duration}</span>
                        </div>
                        <div className="res-item-sub">
                          <span style={{ fontStyle: 'italic' }}>{exp.role}</span>
                        </div>
                        {exp.bullets.length > 0 && (
                          <ul className="res-bullet-list">
                            {exp.bullets.filter(b => b.trim()).map((bullet, bIdx) => (
                              <li key={bIdx} style={{ lineHeight: '1.4', marginBottom: '0.2em' }}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Section */}
                {resumeData.projects.length > 0 && (
                  <div className="res-section">
                    <h3>Projects</h3>
                    {resumeData.projects.map((proj) => (
                      <div key={proj.id} className="res-item" style={{ marginBottom: '1.2em' }}>
                        <div className="res-item-header">
                          <span style={{ fontWeight: 'bold' }}>{proj.name}</span>
                          {proj.role && <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>{proj.role}</span>}
                        </div>
                        {proj.bullets.length > 0 && (
                          <ul className="res-bullet-list" style={{ marginTop: '0.3em' }}>
                            {proj.bullets.filter(b => b.trim()).map((bullet, bIdx) => (
                              <li key={bIdx} style={{ lineHeight: '1.4', marginBottom: '0.2em' }}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Education Section */}
                {resumeData.education.length > 0 && (
                  <div className="res-section">
                    <h3>Education</h3>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="res-item" style={{ marginBottom: '1.2em' }}>
                        <div className="res-item-header">
                          <span style={{ fontWeight: 'bold' }}>{edu.school}</span>
                          <span>{edu.duration}</span>
                        </div>
                        <div className="res-item-sub">
                          <span>{edu.degree}</span>
                        </div>
                        {edu.bullets.length > 0 && (
                          <ul className="res-bullet-list">
                            {edu.bullets.filter(b => b.trim()).map((bullet, bIdx) => (
                              <li key={bIdx} style={{ lineHeight: '1.4', marginBottom: '0.2em' }}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills Section */}
                {resumeData.skills.filter(s => s.trim()).length > 0 && (
                  <div className="res-section" style={{ marginBottom: 0 }}>
                    <h3>Skills</h3>
                    <p className="res-skills-list" style={{ lineHeight: '1.5' }}>
                      {resumeData.skills.filter(s => s.trim()).join('  •  ')}
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
}

export default App;
