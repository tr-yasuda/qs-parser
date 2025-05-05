// Import the query string parser
import { parseQuery, parseUrl } from '../src/runtime/index.js';

// Example 1: Parse a query string with nested objects
const queryString =
  'object.prop1=1&object.prop2=2&tags=javascript&tags=typescript';
console.log('Parsing query string with nested objects:', queryString);
console.log('Result:', parseQuery(queryString));
// Output:
// {
//   object: {
//     prop1: '1',
//     prop2: '2'
//   },
//   tags: ['javascript', 'typescript']
// }

// Example 2: Parse a URL with nested objects
const url =
  'https://example.com/api?user.profile.name=John&user.profile.age=30&user.settings.theme=dark';
console.log('\nParsing URL with deeply nested objects:', url);
console.log('Result:', parseUrl(url));
// Output:
// {
//   user: {
//     profile: {
//       name: 'John',
//       age: '30'
//     },
//     settings: {
//       theme: 'dark'
//     }
//   }
// }

// Example 3: Handle arrays within nested objects
const nestedArrayQuery =
  'user.hobbies=reading&user.hobbies=gaming&user.profile.name=John';
console.log('\nParsing query with arrays in nested objects:', nestedArrayQuery);
console.log('Result:', parseQuery(nestedArrayQuery));
// Output:
// {
//   user: {
//     hobbies: ['reading', 'gaming'],
//     profile: {
//       name: 'John'
//     }
//   }
// }

// Example 4: Handle an edge case with both value and nested properties
const edgeCaseQuery = 'user=john&user.name=John+Doe&user.age=30';
console.log('\nParsing edge case query:', edgeCaseQuery);
console.log('Result:', parseQuery(edgeCaseQuery));
// Output:
// {
//   user: {
//     _value: 'john',
//     name: 'John Doe',
//     age: '30'
//   }
// }
