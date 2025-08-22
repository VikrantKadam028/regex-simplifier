import { englishToRegex } from './src/englishToRegex.js';
import { regexToEnglish } from './src/regexToEnglish.js';
import { testRegex } from './src/testRegex.js';

export { englishToRegex, regexToEnglish, testRegex };

// For CommonJS compatibility
export default {
  englishToRegex,
  regexToEnglish,
  testRegex
};