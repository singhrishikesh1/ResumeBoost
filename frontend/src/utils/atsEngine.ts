export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    website: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    duration: string;
    bullets: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    role: string;
    bullets: string[];
  }>;
  skills: string[];
}

export interface ATSReport {
  score: number;
  keywordMatches: Array<{ word: string; found: boolean }>;
  suggestions: Array<{ id: string; type: 'high' | 'med' | 'low'; message: string }>;
  sectionScores: {
    personal: number;
    summary: number;
    experience: number;
    education: number;
    projects: number;
    skills: number;
  };
  metricsCount: number;
  actionVerbsCount: number;
}

const COMMON_STOP_WORDS = new Set([
  'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have',
  'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt',
  'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some',
  'such', 'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent',
  'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why',
  'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours',
  'yourself', 'yourselves'
]);

const ACTION_VERBS = new Set([
  'developed', 'led', 'designed', 'built', 'managed', 'implemented', 'optimized', 'created',
  'improved', 'engineered', 'formulated', 'spearheaded', 'orchestrated', 'streamlined', 'architected',
  'collaborated', 'delivered', 'automated', 'integrated', 'authored', 'established', 'initiated'
]);

export function analyzeResume(resume: ResumeData, jobDescription: string): ATSReport {
  const suggestions: ATSReport['suggestions'] = [];
  
  // 1. Profile Completeness Section Scores
  const personalScore = (resume.personalInfo.fullName ? 25 : 0) +
                        (resume.personalInfo.email ? 25 : 0) +
                        (resume.personalInfo.phone ? 25 : 0) +
                        (resume.personalInfo.location ? 25 : 0);
                        
  const summaryScore = resume.summary.trim().length > 50 ? 100 : (resume.summary.trim().length > 0 ? 50 : 0);
  const experienceScore = resume.experience.length > 0 ? Math.min(100, resume.experience.length * 40) : 0;
  const educationScore = resume.education.length > 0 ? Math.min(100, resume.education.length * 50) : 0;
  const projectsScore = resume.projects.length > 0 ? Math.min(100, resume.projects.length * 35) : 0;
  const skillsScore = resume.skills.length > 0 ? Math.min(100, resume.skills.length * 10) : 0;

  // 2. Keyword extraction from job description
  const cleanJD = jobDescription.toLowerCase().replace(/[^a-zA-Z0-9+#\-\s]/g, ' ');
  const jdWords = cleanJD.split(/\s+/).filter(w => w.length > 2 && !COMMON_STOP_WORDS.has(w));
  
  // Extract unique keywords and count their frequency in JD
  const wordFrequency: { [key: string]: number } = {};
  jdWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Prioritize top words in the job description as core keywords
  const sortedKeywords = Object.keys(wordFrequency)
    .sort((a, b) => wordFrequency[b] - wordFrequency[a])
    .slice(0, 15); // Top 15 keywords

  // Check if keywords are in resume text
  const resumeText = JSON.stringify(resume).toLowerCase();
  const keywordMatches = sortedKeywords.map(word => {
    // Exact or partial word boundary match
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b|\\b${escapeRegExp(word)}s\\b`, 'i');
    return {
      word,
      found: regex.test(resumeText)
    };
  });

  const matchedCount = keywordMatches.filter(m => m.found).length;
  const keywordScore = sortedKeywords.length > 0 ? Math.round((matchedCount / sortedKeywords.length) * 100) : 100;

  // 3. Action Verbs & Metrics calculations
  let actionVerbsCount = 0;
  let metricsCount = 0;
  
  // Combine all bullet points
  const allBullets = [
    ...resume.experience.flatMap(e => e.bullets),
    ...resume.projects.flatMap(p => p.bullets),
    ...resume.education.flatMap(ed => ed.bullets)
  ];

  allBullets.forEach(bullet => {
    const cleanBullet = bullet.toLowerCase();
    
    // Check Action Verbs (often at the beginning of the bullet)
    const firstWord = cleanBullet.trim().split(/\s+/)[0];
    if (ACTION_VERBS.has(firstWord)) {
      actionVerbsCount++;
    }
    
    // Check Metrics (percentage, $, quantities, time savings e.g. "10%", "3x", "$5,000", "50+")
    const hasMetric = /%|\b\d+x\b|\$\d+|\b\d+\s*(?:percent|million|billion|k|hours|days|weeks|months|years|pages)\b|\b\d+\+\b/.test(cleanBullet);
    if (hasMetric) {
      metricsCount++;
    }
  });

  // Calculate final weights
  // 40% Keyword Match, 30% Completeness, 20% Impact (Action verbs & metrics), 10% formatting
  const avgCompleteness = (personalScore + summaryScore + experienceScore + educationScore + projectsScore + skillsScore) / 6;
  
  let impactScore = 0;
  if (allBullets.length > 0) {
    const actionVerbRate = Math.min(1, actionVerbsCount / Math.max(1, allBullets.length - 2)); // Aim for most bullets starting with action verbs
    const metricRate = Math.min(1, metricsCount / Math.max(1, Math.floor(allBullets.length / 2))); // Aim for at least 50% bullets with metrics
    impactScore = Math.round((actionVerbRate * 50) + (metricRate * 50));
  }

  const formattingScore = (resume.personalInfo.website ? 50 : 0) + (resume.skills.length >= 5 && resume.skills.length <= 15 ? 50 : 25);

  const finalScore = Math.round(
    (keywordScore * 0.40) +
    (avgCompleteness * 0.30) +
    (impactScore * 0.20) +
    (formattingScore * 0.10)
  );

  // 4. Generate Suggestions
  // Missing Keywords
  const missingKeywords = keywordMatches.filter(m => !m.found).map(m => m.word);
  if (missingKeywords.length > 0) {
    suggestions.push({
      id: 'missing-keywords',
      type: 'high',
      message: `Integrate these missing key skills/terms from the job description: ${missingKeywords.slice(0, 5).join(', ')}${missingKeywords.length > 5 ? '... and others.' : ''}`
    });
  }

  // Completeness suggestions
  if (personalScore < 100) {
    suggestions.push({
      id: 'contact-info',
      type: 'high',
      message: 'Complete your contact details. Ensure full name, email, phone, and city/state location are present.'
    });
  }
  if (summaryScore === 0) {
    suggestions.push({
      id: 'profile-summary',
      type: 'med',
      message: 'Write a brief professional summary highlighting your key value proposition and matching expertise.'
    });
  }
  if (experienceScore < 80) {
    suggestions.push({
      id: 'work-experience',
      type: 'high',
      message: 'Expand your work history. ATS systems heavily weigh relevant experience duration and details.'
    });
  }
  if (skillsScore < 50) {
    suggestions.push({
      id: 'skills-list',
      type: 'med',
      message: 'Add more key skills. Having 8-15 well-targeted skills helps ATS parsing matching score.'
    });
  }

  // Impact suggestions
  if (allBullets.length > 0 && actionVerbsCount / allBullets.length < 0.5) {
    suggestions.push({
      id: 'action-verbs',
      type: 'med',
      message: 'Start more bullet points with strong action verbs (e.g., Developed, Designed, Automated, Spearheaded) rather than passive language.'
    });
  }
  if (allBullets.length > 0 && metricsCount / allBullets.length < 0.3) {
    suggestions.push({
      id: 'metrics',
      type: 'med',
      message: 'Quantify your impact. Include numbers, percentages, or timeframes in your bullet points (e.g., "boosted speed by 25%", "saved 5 hours weekly").'
    });
  }

  // Formatting suggestions
  if (!resume.personalInfo.website) {
    suggestions.push({
      id: 'portfolio-link',
      type: 'low',
      message: 'Add a professional link (like GitHub, Portfolio, or LinkedIn) to showcase your work and validation.'
    });
  }

  return {
    score: Math.max(10, Math.min(99, finalScore)), // Scale between 10 and 99 for realistic representation
    keywordMatches,
    suggestions: suggestions.sort((a, b) => {
      const priority = { high: 0, med: 1, low: 2 };
      return priority[a.type] - priority[b.type];
    }),
    sectionScores: {
      personal: Math.round(personalScore),
      summary: Math.round(summaryScore),
      experience: Math.round(experienceScore),
      education: Math.round(educationScore),
      projects: Math.round(projectsScore),
      skills: Math.round(skillsScore)
    },
    metricsCount,
    actionVerbsCount
  };
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
