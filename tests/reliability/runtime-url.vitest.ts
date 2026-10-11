import { describe, it, expect } from 'vitest';
import { runtimeDatabaseUrl } from '@/lib/database/runtime-url';
describe('runtime database pooling', () => {
 it('routes Prisma application traffic through its transaction pooler without changing credentials', () => {
   const original = 'postgres://user:pass@db.prisma.io:5432/postgres?sslmode=require';
   const result = new URL(runtimeDatabaseUrl(original, true)!);
   expect(result.hostname).toBe('pooled.db.prisma.io');
   expect(result.username).toBe('user'); expect(result.password).toBe('pass');
   expect(result.searchParams.get('pgbouncer')).toBe('true');
   expect(result.searchParams.get('connection_limit')).toBe('3');
   expect(original).toContain('@db.prisma.io');
 });
 it('preserves explicit budgets and never rewrites unrelated databases', () => {
   const result = new URL(runtimeDatabaseUrl('postgres://u:p@localhost:5432/db?connection_limit=2', true)!);
   expect(result.hostname).toBe('localhost'); expect(result.searchParams.get('connection_limit')).toBe('2');
   expect(runtimeDatabaseUrl('prisma://secret', true)).toBe('prisma://secret');
 });
});
