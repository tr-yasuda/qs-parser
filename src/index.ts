import array from './core/array/index.js';
import boolean from './core/boolean/index.js';
import date from './core/date/index.js';
import number from './core/number/index.js';
import object from './core/object/index.js';
import string from './core/string/index.js';
import { parseQuery, parseUrl } from './runtime/index.js';

export const q = {
  array,
  boolean,
  date,
  number,
  object,
  string,
  parseQuery,
  parseUrl,
};
