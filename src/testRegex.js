/**
 * Test a regex pattern against sample text
 * @param {string|RegExp} regexPattern - The regex pattern to test
 * @param {string} sampleText - The text to test against
 * @param {Object} options - Options for testing
 * @returns {Object} - Test results with matches and additional info
 */
export function testRegex(regexPattern, sampleText, options = {}) {
    if (!regexPattern) {
      throw new Error('Regex pattern is required');
    }
    
    if (typeof sampleText !== 'string') {
      throw new Error('Sample text must be a string');
    }
  
    let regex;
    
    // Handle different input types
    if (regexPattern instanceof RegExp) {
      regex = regexPattern;
    } else if (typeof regexPattern === 'string') {
      try {
        // Try to create regex from string
        regex = new RegExp(regexPattern, options.flags || 'g');
      } catch (error) {
        throw new Error(`Invalid regex pattern: ${error.message}`);
      }
    } else {
      throw new Error('Regex pattern must be a string or RegExp object');
    }
  
    const results = {
      pattern: regex.source,
      flags: regex.flags,
      sampleText: sampleText,
      matches: [],
      matchCount: 0,
      isMatch: false,
      firstMatch: null,
      lastMatch: null,
      positions: []
    };
  
    try {
      // Test if pattern matches
      results.isMatch = regex.test(sampleText);
      
      // Reset regex for finding all matches
      regex.lastIndex = 0;
      
      let match;
      while ((match = regex.exec(sampleText)) !== null) {
        const matchInfo = {
          value: match[0],
          index: match.index,
          length: match[0].length,
          groups: match.slice(1) // Capture groups
        };
        
        results.matches.push(match[0]);
        results.positions.push(matchInfo);
        
        // Set first and last match
        if (results.firstMatch === null) {
          results.firstMatch = matchInfo;
        }
        results.lastMatch = matchInfo;
        
        // Prevent infinite loop for zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex = match.index + 1;
        }
        
        // Break if regex doesn't have global flag
        if (!regex.global) {
          break;
        }
      }
      
      results.matchCount = results.matches.length;
      
      // Additional analysis
      if (options.detailed) {
        results.analysis = {
          coverage: calculateCoverage(results.positions, sampleText.length),
          uniqueMatches: [...new Set(results.matches)],
          matchLengths: results.positions.map(pos => pos.length),
          averageMatchLength: results.positions.length > 0 
            ? results.positions.reduce((sum, pos) => sum + pos.length, 0) / results.positions.length 
            : 0
        };
      }
      
    } catch (error) {
      results.error = error.message;
    }
  
    return results;
  }
  
  /**
   * Quick test function that returns only matches array (for backward compatibility)
   * @param {string|RegExp} regexPattern - The regex pattern to test
   * @param {string} sampleText - The text to test against
   * @returns {Array} - Array of matches
   */
  export function testRegexSimple(regexPattern, sampleText) {
    const results = testRegex(regexPattern, sampleText);
    return results.matches;
  }
  
  /**
   * Test if a string matches a pattern (boolean result)
   * @param {string|RegExp} regexPattern - The regex pattern to test
   * @param {string} sampleText - The text to test against
   * @returns {boolean} - Whether the pattern matches
   */
  export function isMatch(regexPattern, sampleText) {
    const results = testRegex(regexPattern, sampleText);
    return results.isMatch;
  }
  
  /**
   * Find and replace using regex
   * @param {string|RegExp} regexPattern - The regex pattern to find
   * @param {string} sampleText - The text to search in
   * @param {string} replacement - The replacement text
   * @returns {string} - Text with replacements made
   */
  export function replaceWithRegex(regexPattern, sampleText, replacement) {
    if (!regexPattern || typeof sampleText !== 'string' || typeof replacement !== 'string') {
      throw new Error('Pattern, sample text, and replacement must be provided');
    }
  
    let regex;
    
    if (regexPattern instanceof RegExp) {
      regex = regexPattern;
    } else if (typeof regexPattern === 'string') {
      try {
        regex = new RegExp(regexPattern, 'g');
      } catch (error) {
        throw new Error(`Invalid regex pattern: ${error.message}`);
      }
    } else {
      throw new Error('Regex pattern must be a string or RegExp object');
    }
  
    return sampleText.replace(regex, replacement);
  }
  
  /**
   * Helper function to calculate what percentage of text is covered by matches
   * @param {Array} positions - Array of match position objects
   * @param {number} textLength - Length of the original text
   * @returns {number} - Percentage of text covered (0-100)
   */
  function calculateCoverage(positions, textLength) {
    if (textLength === 0) return 0;
    
    // Create array of covered positions
    const covered = new Array(textLength).fill(false);
    
    positions.forEach(pos => {
      for (let i = pos.index; i < pos.index + pos.length; i++) {
        covered[i] = true;
      }
    });
    
    const coveredCount = covered.filter(Boolean).length;
    return Math.round((coveredCount / textLength) * 100 * 100) / 100; // Round to 2 decimal places
  }