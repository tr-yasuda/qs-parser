// Import the query string parser

// Example 1: Parse a simple query string
import { q } from '../src/index.js';

const queryString = 'page=2&tags=js&tags=ts';
console.log('Parsing query string:', queryString);
console.log('Result:', q.parseQuery(queryString));
// Output: { page: '2', tags: ['js', 'ts'] }

// Example 2: Parse a URL with query parameters
const url =
  'https://example.com/search?q=typescript&page=1&sort=relevance&filter=active&filter=recent';
console.log('\nParsing URL:', url);
console.log('Result:', q.parseUrl(url));
// Output: { q: 'typescript', page: '1', sort: 'relevance', filter: ['active', 'recent'] }

// Example 3: Handle URL encoded values
const encodedQuery = 'search=hello%20world&category=books%20%26%20magazines';
console.log('\nParsing encoded query:', encodedQuery);
console.log('Result:', q.parseQuery(encodedQuery));
// Output: { search: 'hello world', category: 'books & magazines' }
