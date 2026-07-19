import React from 'react';
import { Layout, Type } from 'lucide-react';

export type ResumeTemplate = 'modern' | 'executive' | 'minimalist';

interface TemplateSelectorProps {
  activeTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  activeTemplate,
  onTemplateChange,
  fontSize,
  onFontSizeChange
}) => {
  return (
    <div 
      className="glass-card template-selector fade-in" 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.75rem 1.25rem',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1rem'
      }}
    >
      {/* Template Types */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Layout size={16} className="logo-icon" style={{ color: 'var(--primary)' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Template:</span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {(['modern', 'executive', 'minimalist'] as ResumeTemplate[]).map((t) => (
            <button
              key={t}
              onClick={() => onTemplateChange(t)}
              className={`btn ${activeTemplate === t ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                padding: '0.25rem 0.6rem', 
                fontSize: '0.75rem', 
                borderRadius: 'var(--radius-sm)',
                textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size Settings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Type size={16} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Font: {fontSize}px</span>
        <input
          type="range"
          min="12"
          max="20"
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          style={{ width: '80px', height: '4px', cursor: 'pointer', accentColor: 'var(--primary)' }}
        />
      </div>
    </div>
  );
};
