import { describe, it, expect } from 'vitest';

describe('Secrets Validation', () => {
  it('should have OpenAI API key configured', () => {
    const key = process.env.OPENAI_API_KEY;
    expect(key).toBeDefined();
    expect(key).toMatch(/^sk-proj-/);
  });

  it('should have Coinbase API key configured', () => {
    const key = process.env.COINBASE_API_KEY;
    expect(key).toBeDefined();
    expect(key).toMatch(/^[a-f0-9-]+$/);
  });

  it('should have Coinbase private key configured', () => {
    const key = process.env.COINBASE_PRIVATE_KEY;
    expect(key).toBeDefined();
    expect(key.length).toBeGreaterThan(0);
  });
});
