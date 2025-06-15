import { describe, expect, it, beforeEach } from 'vitest';
import { SdJwtVcCredential } from '../credentials/sdjwtvc.credential';
import { pathMatch } from '../match';

describe('pathMatch', () => {
  let credential: SdJwtVcCredential;

  beforeEach(() => {
    credential = new SdJwtVcCredential('test-id', ['test-vct-value']);
  });

  describe('processPathPointer', () => {
    describe('String components - object key selection', () => {
      it('should select a property by name', () => {
        const data = { name: 'John', age: 30 };
        const result = pathMatch(['name'], data);
        expect(result).toEqual(['John']);
      });

      it('should navigate nested objects', () => {
        const data = { person: { name: 'John', age: 30 } };
        const result = pathMatch(['person', 'name'], data);
        expect(result).toEqual(['John']);
      });

      it('should throw error when accessing string key on non-object', () => {
        const data = ['name', 'age'];
        expect(() => pathMatch(['0'], data)).toThrow(
          'Path component requires object but found non-object element',
        );
      });

      it('should throw error when accessing string key on null', () => {
        const data = { name: null };
        expect(() => pathMatch(['name', 'prop'], data)).toThrow(
          'Path component requires object but found non-object element',
        );
      });

      it('should throw error when property does not exist and results in empty selection', () => {
        const data = { name: 'John' };
        expect(() => pathMatch(['age'], data)).toThrow(
          'No elements selected after processing path component',
        );
      });
    });

    describe('Null components - all array elements selection', () => {
      it('should select all elements from an array', () => {
        const data = { items: [1, 2, 3] };
        const result = pathMatch(['items', null], data);
        expect(result).toEqual([1, 2, 3]);
      });

      it('should throw error when using null on non-array', () => {
        const data = { items: 'not-an-array' };
        expect(() => pathMatch(['items', null], data)).toThrow(
          'Null path component requires array but found non-array element',
        );
      });

      it('should process all array elements for the next segment', () => {
        const data = {
          people: [
            { name: 'John', roles: ['admin', 'user'] },
            { name: 'Jane', roles: ['editor'] },
          ],
        };
        // Select all people, then all roles for each person
        const result = pathMatch(['people', null, 'roles', null], data);
        expect(result).toEqual(['admin', 'user', 'editor']);
      });

      it('should throw error on empty array', () => {
        const data = { items: [] };
        expect(() => pathMatch(['items', null], data)).toThrow(
          'No elements selected after processing path component',
        );
      });
    });

    describe('Number components - array index selection', () => {
      // Note: This isn't in the type definition but the implementation handles it
      it('should select element by index from an array', () => {
        const data = { items: [1, 2, 3] };
        // Using any to bypass TypeScript's type checking
        const path: any = ['items', 1];
        const result = pathMatch(path, data);
        expect(result).toEqual([2]); // 0-based index, so index 1 is the second element (2)
      });

      it('should throw error when using number on non-array', () => {
        const data = { items: 'not-an-array' };
        // Using any to bypass TypeScript's type checking
        const path: any = ['items', 1];
        expect(() => pathMatch(path, data)).toThrow(
          'Numeric path component requires array but found non-array element',
        );
      });

      it('should throw error when index is out of bounds', () => {
        const data = { items: [1, 2, 3] };
        // Using any to bypass TypeScript's type checking
        const path: any = ['items', 10]; // Index out of bounds
        expect(() => pathMatch(path, data)).toThrow(
          'No elements selected after processing path component',
        );
      });
    });

    describe('Complex paths and combinations', () => {
      it('should handle complex nested structures', () => {
        const data = {
          organization: {
            departments: [
              {
                name: 'Engineering',
                teams: [
                  { name: 'Frontend', members: ['Alice', 'Bob'] },
                  { name: 'Backend', members: ['Charlie', 'Dave'] },
                ],
              },
              {
                name: 'Marketing',
                teams: [{ name: 'Growth', members: ['Eve', 'Frank'] }],
              },
            ],
          },
        };

        // Get all team names
        const teamNames = pathMatch(
          ['organization', 'departments', null, 'teams', null, 'name'],
          data,
        );
        expect(teamNames).toEqual(['Frontend', 'Backend', 'Growth']);

        // Get all members from all teams
        const allMembers = pathMatch(
          ['organization', 'departments', null, 'teams', null, 'members', null],
          data,
        );
        expect(allMembers).toEqual([
          'Alice',
          'Bob',
          'Charlie',
          'Dave',
          'Eve',
          'Frank',
        ]);
      });

      it('should throw error for invalid path component', () => {
        const data = { name: 'John' };
        // Using any to bypass TypeScript's type checking
        const path: any = ['name', true];
        expect(() => pathMatch(path, data)).toThrow(
          'Invalid path component: true',
        );
      });
    });
  });
});
