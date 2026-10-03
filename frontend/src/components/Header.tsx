import React from 'react';
import { Sparkles, Printer } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onExportPDF: () => void;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onExportPDF, isGenerating }) => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo-group">
          <Sparkles className="logo-icon" size={28} fill="currentColor" />
          <span className="logo-text">ResumeBoost</span>
        </div>
        
        <div className="nav-actions">
          <button 
            onClick={onExportPDF} 
            className="btn btn-primary"
            title="Download PDF Resume"
            disabled={isGenerating}
          >
            <Printer size={18} />
            <span>{isGenerating ? 'Generating...' : 'Export PDF'}</span>
          </button>
          
          <a 
            href="https://github.com/singhrishikesh1/ResumeBoost" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
            aria-label="View on GitHub"
            style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};


