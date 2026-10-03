import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', flexShrink: 0 }}
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-primary" />
      ) : (
        <Sun size={18} className="text-primary" />
      )}
    </button>
  );
};



