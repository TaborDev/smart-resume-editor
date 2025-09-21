export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const sanitizeLatex = (input: string): string => {
  // Remove potentially dangerous LaTeX commands
  const dangerousCommands = [
    '\\input',
    '\\include',
    '\\write',
    '\\openout',
    '\\closeout',
    '\\immediate',
    '\\catcode'
  ];
  
  let sanitized = input;
  dangerousCommands.forEach(cmd => {
    const regex = new RegExp(`\\${cmd}\\b`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  return sanitized;
};

export const extractKeywords = (text: string): string[] => {
  // Basic keyword extraction - can be enhanced with NLP
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  
  return [...new Set(words.filter(word => 
    word.length > 2 && !stopWords.has(word)
  ))];
};

export const calculateMatchScore = (resumeKeywords: string[], jobKeywords: string[]): number => {
  const resumeSet = new Set(resumeKeywords.map(k => k.toLowerCase()));
  const jobSet = new Set(jobKeywords.map(k => k.toLowerCase()));
  
  const intersection = new Set([...resumeSet].filter(x => jobSet.has(x)));
  return Math.round((intersection.size / jobSet.size) * 100);
};