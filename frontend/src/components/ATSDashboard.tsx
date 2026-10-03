import React from 'react';
import { Award, CheckCircle2, AlertCircle, Sparkles, Check, X, ShieldAlert } from 'lucide-react';
import type { ATSReport } from '../utils/atsEngine';

interface ATSDashboardProps {
  report: ATSReport;
}

export const ATSDashboard: React.FC<ATSDashboardProps> = ({ report }) => {
  const { score, keywordMatches, suggestions, metricsCount, actionVerbsCount } = report;

  // Circle properties for SVG score ring
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine score color theme
  const getScoreColor = (val: number) => {
    if (val < 50) return 'var(--danger)';
    if (val < 75) return 'var(--warning)';
    return 'var(--success)';
  };

  const matchedKeywords = keywordMatches.filter(m => m.found);
  const missingKeywords = keywordMatches.filter(m => !m.found);

  return (
    <section className="glass-card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Award size={20} className="logo-icon" style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>ATS Optimization Hub</h2>
      </div>

      {/* Main Score Row */}
      <div className="score-container" style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
        <div className="progress-ring-wrapper">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="var(--border-glass)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={getScoreColor(score)}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              className="progress-ring-circle"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <span className="score-text" style={{ color: getScoreColor(score) }}>{score}</span>
        </div>

        <div style={{ flexGrow: 1, textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>ATS Match Score</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {score < 50 
              ? 'Critical matching gaps. Add target skills and quantify bullet achievements.'
              : score < 75 
                ? 'Moderate compatibility. Incorporate missing keywords to reach 80+.' 
                : 'Excellent optimization! Your resume matches the job description perfectly.'}
          </p>
        </div>
      </div>

      {/* Metrics & Impact Counts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: actionVerbsCount > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
            {actionVerbsCount}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Action Verbs</span>
        </div>
        <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: metricsCount > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
            {metricsCount}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quantifiable Metrics</span>
        </div>
      </div>

      {/* Keywords Breakdown */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem' }}>Keywords Analysis</h3>
        
        {keywordMatches.length === 0 ? (
          <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
            Paste a job description to extract target keywords.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Matched */}
            {matchedKeywords.length > 0 && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--success)' }}>
                  Matched ({matchedKeywords.length})
                </span>
                <div className="badge-container">
                  {matchedKeywords.map((item, idx) => (
                    <span key={idx} className="badge badge-success">
                      <Check size={10} /> {item.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Missing */}
            {missingKeywords.length > 0 && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--danger)' }}>
                  Missing ({missingKeywords.length})
                </span>
                <div className="badge-container">
                  {missingKeywords.map((item, idx) => (
                    <span key={idx} className="badge badge-danger" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                      <X size={10} /> {item.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Smart Recommendations */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem' }}>Actionable Insights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {suggestions.length === 0 ? (
            <div className="improvement-card low" style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem' }}>No improvement suggestions! Your resume matches the specifications flawlessly.</span>
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className={`improvement-card ${suggestion.type}`}
              >
                {suggestion.type === 'high' ? (
                  <ShieldAlert size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
                ) : suggestion.type === 'med' ? (
                  <AlertCircle size={16} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <Sparkles size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: suggestion.type === 'high' ? 'var(--danger)' : suggestion.type === 'med' ? 'var(--warning)' : 'var(--success)' }}>
                    {suggestion.type} Priority
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{suggestion.message}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};



