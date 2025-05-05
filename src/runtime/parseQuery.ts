/**
 * Query string parser implementation
 * Parses URL query strings into structured objects
 * Handles malformed URLs and query strings robustly
 */

/**
 * Type for the parsed query result, which can be a string, array of strings,
 * or a nested object containing these types
 */
export type ParsedQuery = {
  [key: string]: string | string[] | ParsedQuery;
};

/**
 * Safely decodes a URI component, returning the original string if decoding fails
 * @param str - The string to decode
 * @returns The decoded string or the original string if decoding fails
 */
function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (e) {
    // Return the original string if decoding fails
    return str;
  }
}

/**
 * Sets a value in a nested object using a path of keys
 * @param obj - The object to modify
 * @param path - Array of keys representing the path to the value
 * @param value - The value to set
 * @param existingValue - Optional existing value at the path
 */
function setNestedValue(
  obj: ParsedQuery,
  path: string[],
  value: string,
  existingValue?: string | string[],
): void {
  // Handle empty path segments
  if (path.length === 0) return;

  // Filter out empty path segments
  const validPath = path.filter((segment) => segment.length > 0);
  if (validPath.length === 0) return;

  // Handle the simple case of a single-level path
  if (validPath.length === 1) {
    const key = validPath[0];

    // If there's an existing value
    if (key in obj) {
      const current = obj[key];

      // If it's already an array, add the new value
      if (Array.isArray(current)) {
        current.push(value);
      } else if (typeof current === 'string') {
        // Convert to an array with both values
        obj[key] = [current, value];
      } else if (typeof current === 'object') {
        // This is an edge case where we have both a value and a nested object
        // with the same key prefix, e.g., "user=john" and "user.name=john"
        // In this case, we'll keep the object and add a special "__value" property
        current.__value = value;
      }
    } else {
      // First occurrence or provided existing value
      obj[key] = existingValue ?? value;
    }
    return;
  }

  // For nested paths, create objects as needed
  const currentKey = validPath[0];
  const remainingPath = validPath.slice(1);

  // Create a nested object if it doesn't exist
  if (
    !(currentKey in obj) ||
    typeof obj[currentKey] !== 'object' ||
    Array.isArray(obj[currentKey])
  ) {
    obj[currentKey] = {};
  }

  // Recursively set the value in the nested object
  setNestedValue(obj[currentKey], remainingPath, value, existingValue);
}

/**
 * Normalizes a query string by removing the leading '?' if present
 * @param queryString - The query string to normalize
 * @returns The normalized query string or empty string for null/undefined input
 */
function normalizeQueryString(queryString: string | null | undefined): string {
  // Handle null or undefined input
  if (queryString == null) {
    return '';
  }

  // Ensure we're working with a string
  const query = String(queryString);

  // Remove leading '?' if present
  return query.startsWith('?') ? query.substring(1) : query;
}

/**
 * Extracts key-value pairs from a query parameter
 * @param param - The parameter string (e.g., "key=value")
 * @returns An object with the extracted key and value, or null if extraction fails
 */
function extractKeyValuePair(
  param: string,
): { key: string; value: string } | null {
  if (!param) return null;

  try {
    // Split by '=' to get key and value
    const equalsIndex = param.indexOf('=');
    const rawKey = equalsIndex > -1 ? param.substring(0, equalsIndex) : param;
    const rawValue = equalsIndex > -1 ? param.substring(equalsIndex + 1) : '';

    // Safely decode the key and value
    const key = safeDecodeURIComponent(rawKey);
    const value = safeDecodeURIComponent(rawValue);

    // Skip parameters without a key
    if (!key) return null;

    return { key, value };
  } catch (_) {
    // Return null if any error occurs during processing
    return null;
  }
}

/**
 * Collects parameters with the same key into a map
 * @param params - Array of parameter strings
 * @returns A map of keys to arrays of values
 */
function collectParameters(params: string[]): Map<string, string[]> {
  const paramMap = new Map<string, string[]>();

  for (const param of params) {
    const keyValuePair = extractKeyValuePair(param);
    if (!keyValuePair) continue;

    const { key, value } = keyValuePair;

    // Add to our parameter map
    if (paramMap.has(key)) {
      paramMap.get(key)?.push(value);
    } else {
      paramMap.set(key, [value]);
    }
  }

  return paramMap;
}

/**
 * Processes a key-value pair and adds it to the result object
 * @param result - The result object to modify
 * @param key - The parameter key
 * @param values - Array of values for the key
 */
function processKeyValuePair(
  result: ParsedQuery,
  key: string,
  values: string[],
): void {
  try {
    // Check if this is a nested key (contains dots)
    if (key.includes('.')) {
      // Split the key into path segments
      const path = key.split('.');

      // For nested keys, we handle each value separately
      for (const value of values) {
        setNestedValue(result, path, value);
      }
    } else {
      // For simple keys, if there are multiple values, store as an array
      result[key] = values.length === 1 ? values[0] : values;
    }
  } catch (error) {
    // Log the error to aid debugging
    console.error(`Error processing key "${key}":`, error);
    // If there's an error processing this key, store the raw values
    result[key] = values.length === 1 ? values[0] : values;
  }
}

/**
 * Parses a URL query string into a structured object with support for nested objects
 * @param queryString - The query string to parse (with or without the leading '?')
 * @returns An object with parsed query parameters
 *
 * @example
 * // Returns { page: "2", tags: ["js", "ts"] }
 * parseQuery("page=2&tags=js&tags=ts")
 *
 * @example
 * // Returns { object: { prop1: "1", prop2: "2" }, tags: ["javascript", "typescript"] }
 * parseQuery("object.prop1=1&object.prop2=2&tags=javascript&tags=typescript")
 */
export function parseQuery(queryString: string): ParsedQuery {
  // Normalize the query string
  const normalizedQuery = normalizeQueryString(queryString);

  // Handle empty query string
  if (!normalizedQuery) {
    return {};
  }

  // Split the query string by '&' to get individual parameters
  const params = normalizedQuery.split('&');
  const result: ParsedQuery = {};

  // Collect parameters with the same key
  const paramMap = collectParameters(params);

  // Process the parameters and build the result object
  for (const [key, values] of paramMap.entries()) {
    processKeyValuePair(result, key, values);
  }

  return result;
}

/**
 * Parses a complete URL or URL with query string into a structured object of query parameters
 * @param url - The URL or query string to parse
 * @returns An object with parsed query parameters
 *
 * @example
 * // Returns { page: "2", tags: ["js", "ts"] }
 * parseUrl("https://example.com?page=2&tags=js&tags=ts")
 *
 * @example
 * // Returns { object: { prop1: "1", prop2: "2" }, tags: ["javascript", "typescript"] }
 * parseUrl("https://example.com?object.prop1=1&object.prop2=2&tags=javascript&tags=typescript")
 */
export function parseUrl(url: string): ParsedQuery {
  // Handle null or undefined input
  if (url == null) {
    return {};
  }

  try {
    // Ensure we're working with a string
    const urlStr = String(url);

    // Try to parse as a URL first
    try {
      const urlObj = new URL(urlStr);
      return parseQuery(urlObj.search);
    } catch (e) {
      // If URL parsing fails, try to extract query string directly
      const queryIndex = urlStr.indexOf('?');
      if (queryIndex === -1) {
        // If no query string delimiter is found, check if the entire string might be a query
        if (urlStr.includes('=')) {
          // This might be just a query string without the '?'
          return parseQuery(urlStr);
        }
        return {};
      }

      const queryString = urlStr.substring(queryIndex);
      return parseQuery(queryString);
    }
  } catch (error) {
    // Return an empty object for any unhandled errors
    return {};
  }
}
