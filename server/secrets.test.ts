import { describe, it, expect } from 'vitest';

describe('API Credentials Validation', () => {
  it('should have Stripe API key configured', () => {
    const stripeKey = process.env.STRIPE_API_KEY;
    expect(stripeKey).toBeDefined();
    expect(stripeKey).toMatch(/^sk_test_/);
    console.log('✅ Stripe API key validated');
  });

  it('should have OpenAI API key configured', () => {
    const openaiKey = process.env.OPENAI_API_KEY;
    expect(openaiKey).toBeDefined();
    expect(openaiKey).toMatch(/^sk-proj-/);
    console.log('✅ OpenAI API key validated');
  });

  it('should validate Stripe API key format', () => {
    const stripeKey = process.env.STRIPE_API_KEY;
    expect(stripeKey).toMatch(/^sk_test_[a-zA-Z0-9]{32,}$/);
    console.log('✅ Stripe API key format valid');
  });

  it('should validate OpenAI API key format', () => {
    const openaiKey = process.env.OPENAI_API_KEY;
    expect(openaiKey).toMatch(/^sk-proj-[a-zA-Z0-9_-]{40,}$/);
    console.log('✅ OpenAI API key format valid');
  });

  it('should have both keys present for production', () => {
    const hasStripe = !!process.env.STRIPE_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    expect(hasStripe && hasOpenAI).toBe(true);
    console.log('✅ All production credentials present');
  });
});
