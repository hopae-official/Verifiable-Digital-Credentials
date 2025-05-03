import { randomBytes } from 'node:crypto';

export function generateRandom(len: number): string {
  return randomBytes(len).toString('hex');
}
