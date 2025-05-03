/**
 * Date schema module for qs-parser
 * Exports the date schema creator
 *
 * @remarks
 * IMPORTANT: When validating string inputs, only the 'YYYY-MM-DD' format (e.g., '2023-01-31') is supported.
 * Other date formats will result in validation errors.
 */
import date from './schema.js';

export default date;
