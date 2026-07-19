import React, { useState } from 'react';
import { User, FileText, Briefcase, GraduationCap, FolderGit2, Wrench, Plus, Trash2 } from 'lucide-react';
import type { ResumeData } from '../utils/atsEngine';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

type TabType = 'contact' | 'summary' | 'experience' | 'education' | 'projects' | 'skills';

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('contact');

  // Helper to update deeply nested fields
  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const updateSummary = (value: string) => {
    onChange({
      ...data,
      summary: value
    });
  };

  // Repeater Updates for Experience
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      duration: '',
      bullets: ['']
    };
    onChange({
      ...data,
      experience: [...data.experience, newExp]
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => (exp.id === id ? { ...exp, [field]: value } : exp))
    });
  };

  const addExpBullet = (expId: string) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp) return;
    updateExperience(expId, 'bullets', [...exp.bullets, '']);
  };

  const updateExpBullet = (expId: string, idx: number, val: string) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp) return;
    const newBullets = [...exp.bullets];
    newBullets[idx] = val;
    updateExperience(expId, 'bullets', newBullets);
  };

  const removeExpBullet = (expId: string, idx: number) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp) return;
    updateExperience(expId, 'bullets', exp.bullets.filter((_, i) => i !== idx));
  };

  // Repeater Updates for Education
  const addEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      duration: '',
      bullets: ['']
    };
    onChange({
      ...data,
      education: [...data.education, newEdu]
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  const updateEducation = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      education: data.education.map(edu => (edu.id === id ? { ...edu, [field]: value } : edu))
    });
  };

  const addEduBullet = (eduId: string) => {
    const edu = data.education.find(e => e.id === eduId);
    if (!edu) return;
    updateEducation(eduId, 'bullets', [...edu.bullets, '']);
  };

  const updateEduBullet = (eduId: string, idx: number, val: string) => {
    const edu = data.education.find(e => e.id === eduId);
    if (!edu) return;
    const newBullets = [...edu.bullets];
    newBullets[idx] = val;
    updateEducation(eduId, 'bullets', newBullets);
  };

  const removeEduBullet = (eduId: string, idx: number) => {
    const edu = data.education.find(e => e.id === eduId);
    if (!edu) return;
    updateEducation(eduId, 'bullets', edu.bullets.filter((_, i) => i !== idx));
  };

  // Repeater Updates for Projects
  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: '',
      role: '',
      bullets: ['']
    };
    onChange({
      ...data,
      projects: [...data.projects, newProj]
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter(proj => proj.id !== id)
    });
  };

  const updateProject = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      projects: data.projects.map(proj => (proj.id === id ? { ...proj, [field]: value } : proj))
    });
  };

  const addProjBullet = (projId: string) => {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;
    updateProject(projId, 'bullets', [...proj.bullets, '']);
  };

  const updateProjBullet = (projId: string, idx: number, val: string) => {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;
    const newBullets = [...proj.bullets];
    newBullets[idx] = val;
    updateProject(projId, 'bullets', newBullets);
  };

  const removeProjBullet = (projId: string, idx: number) => {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;
    updateProject(projId, 'bullets', proj.bullets.filter((_, i) => i !== idx));
  };

  // Skills Updates
  const handleSkillsChange = (val: string) => {
    const skillsArr = val.split(',').map(s => s.trim());
    onChange({
      ...data,
      skills: skillsArr
    });
  };

  return (
    <section className="glass-card fade-in" style={{ padding: '1rem' }}>
      {/* Editor Tabs Navigation */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '0.25rem', 
          overflowX: 'auto', 
          borderBottom: '1px solid var(--border-glass)', 
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem',
          scrollbarWidth: 'none'
        }}
      >
        {[
          { id: 'contact', label: 'Contact', icon: <User size={16} /> },
          { id: 'summary', label: 'Summary', icon: <FileText size={16} /> },
          { id: 'experience', label: 'Work', icon: <Briefcase size={16} /> },
          { id: 'education', label: 'Education', icon: <GraduationCap size={16} /> },
          { id: 'projects', label: 'Projects', icon: <FolderGit2 size={16} /> },
          { id: 'skills', label: 'Skills', icon: <Wrench size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              padding: '0.5rem 0.75rem', 
              fontSize: '0.85rem', 
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div style={{ textAlign: 'left' }}>
        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Personal Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="e.g. name@domain.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="e.g. (555) 000-0000"
                />
              </div>
              <div className="form-group">
                <label>Location (City, State)</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="e.g. New York, NY"
                />
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Professional Portfolio / LinkedIn / GitHub</label>
              <input
                type="text"
                className="form-input"
                value={data.personalInfo.website}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                placeholder="e.g. https://github.com/profile"
              />
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Professional Summary</h3>
            <div className="form-group">
              <label>Briefly pitch your core accomplishments and career targets</label>
              <textarea
                className="form-textarea"
                value={data.summary}
                onChange={(e) => updateSummary(e.target.value)}
                placeholder="Write a profile summary..."
                style={{ height: '140px' }}
              />
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Work Experience</h3>
              <button onClick={addExperience} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                <Plus size={14} /> Add Role
              </button>
            </div>

            {data.experience.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No experience details added yet. Click add role above.</p>
            ) : (
              data.experience.map((exp) => (
                <div key={exp.id} className="repeater-item">
                  <button onClick={() => removeExperience(exp.id)} className="remove-btn" title="Remove Experience">
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className="form-group">
                      <label>Company / Organization</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Job Title / Role</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ maxWidth: '300px' }}>
                    <label>Duration / Dates</label>
                    <input
                      type="text"
                      className="form-input"
                      value={exp.duration}
                      onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                      placeholder="e.g. 2024 - Present or Jan 2022 - Feb 2023"
                    />
                  </div>

                  {/* Bullet points repeater */}
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Key Responsibilities & Achievements</span>
                      <button onClick={() => addExpBullet(exp.id)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                        <Plus size={12} /> Bullet
                      </button>
                    </div>
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-input"
                          value={bullet}
                          onChange={(e) => updateExpBullet(exp.id, bulletIdx, e.target.value)}
                          placeholder="e.g. Spearheaded frontend development, improving app load speed by 20%..."
                          style={{ flexGrow: 1, padding: '0.5rem' }}
                        />
                        <button
                          onClick={() => removeExpBullet(exp.id, bulletIdx)}
                          className="remove-btn"
                          style={{ position: 'static', color: 'var(--text-muted)' }}
                          title="Remove Bullet"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Education</h3>
              <button onClick={addEducation} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                <Plus size={14} /> Add Education
              </button>
            </div>

            {data.education.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No education details added yet.</p>
            ) : (
              data.education.map((edu) => (
                <div key={edu.id} className="repeater-item">
                  <button onClick={() => removeEducation(edu.id)} className="remove-btn" title="Remove Education">
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className="form-group">
                      <label>School / University</label>
                      <input
                        type="text"
                        className="form-input"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        placeholder="School name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Degree & Major</label>
                      <input
                        type="text"
                        className="form-input"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="e.g. M.S. in Computer Science"
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ maxWidth: '300px' }}>
                    <label>Duration / Dates</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.duration}
                      onChange={(e) => updateEducation(edu.id, 'duration', e.target.value)}
                      placeholder="e.g. 2020 - 2024"
                    />
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Achievements & Coursework (Optional)</span>
                      <button onClick={() => addEduBullet(edu.id)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                        <Plus size={12} /> Bullet
                      </button>
                    </div>
                    {edu.bullets.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-input"
                          value={bullet}
                          onChange={(e) => updateEduBullet(edu.id, bulletIdx, e.target.value)}
                          placeholder="e.g. Completed thesis in AI safety..."
                          style={{ flexGrow: 1, padding: '0.5rem' }}
                        />
                        <button
                          onClick={() => removeEduBullet(edu.id, bulletIdx)}
                          className="remove-btn"
                          style={{ position: 'static', color: 'var(--text-muted)' }}
                          title="Remove Bullet"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Projects</h3>
              <button onClick={addProject} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                <Plus size={14} /> Add Project
              </button>
            </div>

            {data.projects.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No project details added yet.</p>
            ) : (
              data.projects.map((proj) => (
                <div key={proj.id} className="repeater-item">
                  <button onClick={() => removeProject(proj.id)} className="remove-btn" title="Remove Project">
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className="form-group">
                      <label>Project Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                        placeholder="Project title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Your Role (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={proj.role}
                        onChange={(e) => updateProject(proj.id, 'role', e.target.value)}
                        placeholder="e.g. Lead Designer"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Project Bullet Points</span>
                      <button onClick={() => addProjBullet(proj.id)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                        <Plus size={12} /> Bullet
                      </button>
                    </div>
                    {proj.bullets.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-input"
                          value={bullet}
                          onChange={(e) => updateProjBullet(proj.id, bulletIdx, e.target.value)}
                          placeholder="e.g. Designed fully interactive UI using Tailwind, reaching 200 active users..."
                          style={{ flexGrow: 1, padding: '0.5rem' }}
                        />
                        <button
                          onClick={() => removeProjBullet(proj.id, bulletIdx)}
                          className="remove-btn"
                          style={{ position: 'static', color: 'var(--text-muted)' }}
                          title="Remove Bullet"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Professional Skills</h3>
            <div className="form-group">
              <label>Enter skills, comma separated</label>
              <textarea
                className="form-textarea"
                value={data.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder="e.g. React, TypeScript, Git, Python"
                style={{ height: '120px' }}
              />
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Skills Preview ({data.skills.filter(s => s).length})</span>
              <div className="badge-container">
                {data.skills.filter(s => s).map((skill, idx) => (
                  <span key={idx} className="badge badge-success" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
