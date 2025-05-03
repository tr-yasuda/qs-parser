/**
 * String processing functions for string schema
 */

/**
 * Process trim constraint
 * @param value - The string to process
 * @param trim - Whether to trim the string
 * @returns The processed string
 */
export const processTrim = (value: string, trim?: boolean): string => {
  return trim ? value.trim() : value;
};

/**
 * Process toLowerCase constraint
 * @param value - The string to process
 * @param toLowerCase - Whether to convert to lowercase
 * @returns The processed string
 */
export const processToLowerCase = (
  value: string,
  toLowerCase?: boolean,
): string => {
  return toLowerCase ? value.toLowerCase() : value;
};

/**
 * Process toUpperCase constraint
 * @param value - The string to process
 * @param toUpperCase - Whether to convert to uppercase
 * @returns The processed string
 */
export const processToUpperCase = (
  value: string,
  toUpperCase?: boolean,
): string => {
  return toUpperCase ? value.toUpperCase() : value;
};
