/**
 * Convert plain English descriptions to regex patterns
 * @param {string} englishDescription - Plain English description of the pattern
 * @returns {RegExp} - The corresponding regex pattern
 */
export function englishToRegex(englishDescription) {
    if (!englishDescription || typeof englishDescription !== 'string') {
      throw new Error('English description must be a non-empty string');
    }
  
    const desc = englishDescription.toLowerCase().trim();
    
    // Define pattern mappings
    const patterns = [
      // Email patterns
      {
        keywords: ['email', 'emails', 'email address'],
        regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
      },
      
      // Phone patterns
      {
        keywords: ['phone', 'phone number', 'telephone'],
        regex: /(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g
      },
      
      // URL patterns
      {
        keywords: ['url', 'urls', 'website', 'link', 'http'],
        regex: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
      },
      
      // Number patterns
      {
        keywords: ['number', 'numbers', 'digit', 'digits', 'numeric'],
        regex: /\d+/g
      },
      
      // Date patterns
      {
        keywords: ['date', 'dates', 'mm/dd/yyyy', 'dd/mm/yyyy'],
        regex: /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g
      },
      
      // Time patterns
      {
        keywords: ['time', '24 hour', '12 hour'],
        regex: /\b\d{1,2}:\d{2}(:\d{2})?(\s?(AM|PM|am|pm))?\b/g
      },
      
      // ZIP code patterns
      {
        keywords: ['zip', 'zip code', 'postal code'],
        regex: /\b\d{5}(-\d{4})?\b/g
      },
      
      // Credit card patterns
      {
        keywords: ['credit card', 'card number'],
        regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
      },
      
      // SSN patterns
      {
        keywords: ['ssn', 'social security', 'social security number'],
        regex: /\b\d{3}-\d{2}-\d{4}\b/g
      },
      
      // Word patterns
      {
        keywords: ['word', 'words', 'letters only'],
        regex: /\b[a-zA-Z]+\b/g
      },
      
      // Whitespace patterns
      {
        keywords: ['whitespace', 'spaces', 'space'],
        regex: /\s+/g
      },
      
      // IP address patterns
      {
        keywords: ['ip', 'ip address'],
        regex: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g
      }
    ];
    
    // Special pattern constructions
    if (desc.includes('starts with') || desc.includes('beginning')) {
      const word = extractTargetWord(desc);
      return new RegExp(`^${word}`, 'g');
    }
    
    if (desc.includes('ends with') || desc.includes('ending')) {
      const word = extractTargetWord(desc);
      return new RegExp(`${word}$`, 'g');
    }
    
    if (desc.includes('contains')) {
      const word = extractTargetWord(desc);
      return new RegExp(word, 'gi');
    }
    
    // Check for specific length requirements
    const lengthMatch = desc.match(/(\d+)\s*(character|char|digit|letter)s?/);
    if (lengthMatch) {
      const length = lengthMatch[1];
      if (desc.includes('digit') || desc.includes('number')) {
        return new RegExp(`\\d{${length}}`, 'g');
      }
      if (desc.includes('letter') || desc.includes('character')) {
        return new RegExp(`[a-zA-Z]{${length}}`, 'g');
      }
    }
    
    // Find matching pattern
    for (const pattern of patterns) {
      if (pattern.keywords.some(keyword => desc.includes(keyword))) {
        return pattern.regex;
      }
    }
    
    // If no specific pattern found, try to build one from common terms
    if (desc.includes('any character')) {
      return /./g;
    }
    
    if (desc.includes('alphanumeric')) {
      return /[a-zA-Z0-9]+/g;
    }
    
    // Default fallback - treat as literal string search
    const escapedDesc = englishDescription.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escapedDesc, 'gi');
  }
  
  /**
   * Helper function to extract target word from description
   * @param {string} desc - Description string
   * @returns {string} - Extracted word or empty string
   */
  function extractTargetWord(desc) {
    const words = desc.split(' ');
    const targetIndex = words.findIndex(word => 
      ['with', 'starts', 'ends', 'contains', 'beginning', 'ending'].includes(word)
    );
    
    if (targetIndex !== -1 && targetIndex < words.length - 1) {
      return words[targetIndex + 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    return '';
  }