import { describe, expect, it } from 'vitest';
import { q } from '../../src/index.js';

describe('Query String Parser', () => {
  describe('parse function', () => {
    it('should parse a simple query string', () => {
      const result = q.parseQuery('page=2&limit=10');
      expect(result).toEqual({ page: '2', limit: '10' });
    });

    it('should handle query string with leading question mark', () => {
      const result = q.parseQuery('?page=2&limit=10');
      expect(result).toEqual({ page: '2', limit: '10' });
    });

    it('should handle empty query string', () => {
      expect(q.parseQuery('')).toEqual({});
      expect(q.parseQuery('?')).toEqual({});
    });

    it('should handle parameters without values', () => {
      const result = q.parseQuery('page=2&filter&sort=asc');
      expect(result).toEqual({ page: '2', filter: '', sort: 'asc' });
    });

    it('should handle URL encoded values', () => {
      const result = q.parseQuery(
        'search=hello%20world&category=books%20%26%20magazines',
      );
      expect(result).toEqual({
        search: 'hello world',
        category: 'books & magazines',
      });
    });

    it('should convert duplicate parameters to arrays', () => {
      const result = q.parseQuery('tags=js&tags=ts');
      expect(result).toEqual({ tags: ['js', 'ts'] });
    });

    it('should handle multiple duplicate parameters', () => {
      const result = q.parseQuery(
        'page=2&tags=js&tags=ts&filter=recent&filter=popular',
      );
      expect(result).toEqual({
        page: '2',
        tags: ['js', 'ts'],
        filter: ['recent', 'popular'],
      });
    });

    it('should handle complex query strings', () => {
      const result = q.parseQuery(
        'page=2&tags=javascript&tags=typescript&sort=date&order=desc&limit=20',
      );
      expect(result).toEqual({
        page: '2',
        tags: ['javascript', 'typescript'],
        sort: 'date',
        order: 'desc',
        limit: '20',
      });
    });

    it('should parse nested objects using dot notation', () => {
      const result = q.parseQuery(
        'object.prop1=1&object.prop2=2&tags=javascript&tags=typescript',
      );
      expect(result).toEqual({
        object: {
          prop1: '1',
          prop2: '2',
        },
        tags: ['javascript', 'typescript'],
      });
    });

    it('should handle deeply nested objects', () => {
      const result = q.parseQuery(
        'user.profile.name=John&user.profile.age=30&user.settings.theme=dark',
      );
      expect(result).toEqual({
        user: {
          profile: {
            name: 'John',
            age: '30',
          },
          settings: {
            theme: 'dark',
          },
        },
      });
    });

    it('should handle arrays within nested objects', () => {
      const result = q.parseQuery(
        'user.hobbies=reading&user.hobbies=gaming&user.profile.name=John',
      );
      expect(result).toEqual({
        user: {
          hobbies: ['reading', 'gaming'],
          profile: {
            name: 'John',
          },
        },
      });
    });

    it('should handle edge case with both value and nested properties', () => {
      const result = q.parseQuery('user=john&user.name=John+Doe&user.age=30');
      expect(result).toEqual({
        user: {
          name: 'John Doe',
          age: '30',
        },
      });
    });
  });

  describe('parseUrl function', () => {
    it('should extract and parse query string from URL', () => {
      const result = q.parseUrl('https://example.com?page=2&tags=js&tags=ts');
      expect(result).toEqual({ page: '2', tags: ['js', 'ts'] });
    });

    it('should return empty object for URL without query string', () => {
      const result = q.parseUrl('https://example.com');
      expect(result).toEqual({});
    });

    it('should handle complex URLs', () => {
      const result = q.parseUrl(
        'https://api.example.com/search/results?q=typescript&page=2&sort=relevance&filter=active&filter=recent',
      );
      expect(result).toEqual({
        q: 'typescript',
        page: '2',
        sort: 'relevance',
        filter: ['active', 'recent'],
      });
    });

    it('should handle URLs with nested objects', () => {
      const result = q.parseUrl(
        'https://example.com?object.prop1=1&object.prop2=2&tags=javascript&tags=typescript',
      );
      expect(result).toEqual({
        object: {
          prop1: '1',
          prop2: '2',
        },
        tags: ['javascript', 'typescript'],
      });
    });
  });
});
