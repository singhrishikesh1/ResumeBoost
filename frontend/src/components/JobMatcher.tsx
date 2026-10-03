import React from 'react';
import { Briefcase } from 'lucide-react';

interface JobMatcherProps {
  value: string;
  onChange: (val: string) => void;
}

export const JobMatcher: React.FC<JobMatcherProps> = ({ value, onChange }) => {
  return (
    <section className="glass-card fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Briefcase size={20} className="logo-icon" style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Target Job Description</h2>
      </div>
      
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="job-description-input" className="sr-only" style={{ display: 'none' }}>
          Job Description Text
        </label>
        <textarea
          id="job-description-input"
          className="form-textarea"
          placeholder="Paste the target job description here. We'll analyze it in real-time to check for keyword matching, impact metrics, action verbs, and ATS optimization gaps..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ height: '180px', fontSize: '0.9rem' }}
        />
      </div>
    </section>
  );
};




