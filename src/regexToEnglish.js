/**
 * Convert regex patterns to plain English explanations
 * @param {string|RegExp} regexPattern - The regex pattern to explain
 * @returns {string} - Plain English explanation of the pattern
 */
export function regexToEnglish(regexPattern) {
    if (!regexPattern) {
      throw new Error('Regex pattern is required');
    }
  
    let pattern = regexPattern;
    
    // Convert RegExp object to string, or clean string input
    if (regexPattern instanceof RegExp) {
      pattern = regexPattern.source;
    } else if (typeof regexPattern === 'string') {
      // Remove leading/trailing slashes if present
      pattern = pattern.replace(/^\/|\/[gimuy]*$/g, '');
    } else {
      throw new Error('Regex pattern must be a string or RegExp object');
    }
  
    // Common pattern explanations
    const explanations = [
      {
        pattern: /^\\b\[A-Za-z0-9\._%-\+\]\+@\[A-Za-z0-9\.\-\]\+\\\.\[A-Z\|a-z\]\{2,\}\\b$/,
        explanation: "Email address pattern"
      },
      {
        pattern: /^\\d\{3\}-\\d\{2\}-\\d\{4\}$/,
        explanation: "3 digits - 2 digits - 4 digits (SSN-like pattern)"
      },
      {
        pattern: /^\\d\{5\}(-\\d\{4\})?\$$/,
        explanation: "5 digits optionally followed by dash and 4 more digits (ZIP code)"
      },
      {
        pattern: /^\\d\{4\}\[\\s-\]\?\\d\{4\}\[\\s-\]\?\\d\{4\}\[\\s-\]\?\\d\{4\}$/,
        explanation: "Credit card number (4 groups of 4 digits with optional separators)"
      },
      {
        pattern: /^https\?:/,
        explanation: "URL starting with http or https"
      }
    ];
  
    // Check for exact matches first
    for (const { pattern: regexCheck, explanation } of explanations) {
      if (regexCheck.test(pattern)) {
        return explanation;
      }
    }
  
    // Build explanation piece by piece
    let explanation = "";
    let i = 0;
    
    while (i < pattern.length) {
      const char = pattern[i];
      
      switch (char) {
        case '^':
          explanation += "Start of string/line, then ";
          break;
          
        case '$':
          explanation += "end of string/line";
          break;
          
        case '.':
          explanation += "any character";
          break;
          
        case '*':
          explanation += " (zero or more times)";
          break;
          
        case '+':
          explanation += " (one or more times)";
          break;
          
        case '?':
          explanation += " (optional)";
          break;
          
        case '\\':
          i++;
          const nextChar = pattern[i];
          switch (nextChar) {
            case 'd':
              explanation += "digit";
              break;
            case 'w':
              explanation += "word character (letter, digit, or underscore)";
              break;
            case 's':
              explanation += "whitespace character";
              break;
            case 'b':
              explanation += "word boundary";
              break;
            case 'D':
              explanation += "non-digit";
              break;
            case 'W':
              explanation += "non-word character";
              break;
            case 'S':
              explanation += "non-whitespace character";
              break;
            case 'n':
              explanation += "newline";
              break;
            case 't':
              explanation += "tab";
              break;
            default:
              explanation += `literal ${nextChar}`;
          }
          break;
          
        case '[':
          const closingBracket = pattern.indexOf(']', i);
          if (closingBracket !== -1) {
            const charClass = pattern.substring(i + 1, closingBracket);
            explanation += `character from set: ${interpretCharacterClass(charClass)}`;
            i = closingBracket;
          } else {
            explanation += "literal [";
          }
          break;
          
        case '{':
          const closingBrace = pattern.indexOf('}', i);
          if (closingBrace !== -1) {
            const quantifier = pattern.substring(i + 1, closingBrace);
            if (quantifier.includes(',')) {
              const [min, max] = quantifier.split(',');
              if (max === '') {
                explanation += ` (${min} or more times)`;
              } else {
                explanation += ` (${min} to ${max} times)`;
              }
            } else {
              explanation += ` (exactly ${quantifier} times)`;
            }
            i = closingBrace;
          } else {
            explanation += "literal {";
          }
          break;
          
        case '(':
          const closingParen = findMatchingParen(pattern, i);
          if (closingParen !== -1) {
            explanation += "group: (";
            // Don't increment i here, let the loop handle the group contents
          } else {
            explanation += "literal (";
          }
          break;
          
        case ')':
          explanation += ")";
          break;
          
        case '|':
          explanation += " OR ";
          break;
          
        default:
          if (char.match(/[a-zA-Z0-9]/)) {
            explanation += `literal ${char}`;
          } else {
            explanation += `literal ${char}`;
          }
      }
      
      i++;
      
      // Add connecting words
      if (i < pattern.length && !explanation.endsWith(" ") && 
          !explanation.endsWith("(") && pattern[i] !== ')' && 
          pattern[i] !== '*' && pattern[i] !== '+' && pattern[i] !== '?' &&
          pattern[i] !== '{' && pattern[i] !== '$') {
        explanation += ", then ";
      }
    }
    
    // Clean up the explanation
    explanation = explanation
      .replace(/, then $/, "")
      .replace(/^Start of string\/line, then /, "Start of string/line, ")
      .replace(/, then end of string\/line$/, ", end of string/line")
      .trim();
      
    return explanation || "Complex regex pattern";
  }
  
  /**
   * Helper function to interpret character classes
   * @param {string} charClass - Character class content
   * @returns {string} - Human readable description
   */
  function interpretCharacterClass(charClass) {
    if (charClass === 'a-z') return 'lowercase letters';
    if (charClass === 'A-Z') return 'uppercase letters';
    if (charClass === '0-9') return 'digits';
    if (charClass === 'a-zA-Z') return 'letters';
    if (charClass === 'a-zA-Z0-9') return 'letters and digits';
    if (charClass === 'A-Za-z0-9') return 'letters and digits';
    if (charClass.includes('-')) {
      const parts = charClass.split('-');
      return `${parts[0]} through ${parts[parts.length - 1]}`;
    }
    return charClass;
  }
  
  /**
   * Helper function to find matching closing parenthesis
   * @param {string} pattern - Regex pattern
   * @param {number} start - Starting position
   * @returns {number} - Position of matching closing paren or -1
   */
  function findMatchingParen(pattern, start) {
    let count = 1;
    for (let i = start + 1; i < pattern.length; i++) {
      if (pattern[i] === '\\') {
        i++; // Skip escaped character
        continue;
      }
      if (pattern[i] === '(') count++;
      if (pattern[i] === ')') count--;
      if (count === 0) return i;
    }
    return -1;
  }