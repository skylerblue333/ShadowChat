/**
 * SKYCOIN4444 SIGN-UP FLOW x44
 * Most Irresistible Sign-Up Ever
 * 
 * Conversion Psychology:
 * - FOMO (Fear of Missing Out)
 * - Social Proof (Real testimonials)
 * - Scarcity (Limited spots)
 * - Urgency (Time pressure)
 * - Value Proposition (Clear benefits)
 * - Trust Signals (Security, reviews)
 * - Friction Reduction (1-click signup)
 * - Instant Gratification (Rewards on signup)
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const SignUpFlow: React.FC = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(Math.floor(Math.random() * 100) + 1);
  const [usersOnline, setUsersOnline] = useState(Math.floor(Math.random() * 10000) + 5000);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSpotsLeft(prev => Math.max(1, prev - Math.floor(Math.random() * 3)));
      setUsersOnline(prev => prev + Math.floor(Math.random() * 50) - 20);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignUp = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#d4af37] to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#6366f1] to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {step === 0 && <HeroStep onNext={() => setStep(1)} spotsLeft={spotsLeft} usersOnline={usersOnline} />}
          {step === 1 && <BenefitsStep onNext={() => setStep(2)} />}
          {step === 2 && <SignUpStep email={email} setEmail={setEmail} onSignUp={handleSignUp} loading={loading} />}
          {step === 3 && <SuccessStep />}
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================================
// STEP 1: HERO - FOMO & URGENCY
// ============================================================================
const HeroStep: React.FC<{ onNext: () => void; spotsLeft: number; usersOnline: number }> = ({ onNext, spotsLeft, usersOnline }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8"
    >
      {/* FOMO Banner */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] rounded-lg p-4 text-center"
      >
        <div className="text-black font-bold text-lg">⚡ ONLY {spotsLeft} SPOTS LEFT</div>
        <div className="text-black text-sm mt-1">{usersOnline.toLocaleString()} users online right now</div>
      </motion.div>

      {/* Main Headline */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-center">
          <span className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent">
            Join the Revolution
          </span>
        </h1>
        <p className="text-center text-[#e0e0e0] text-lg">
          The #1 AI Platform on Earth. Join {usersOnline.toLocaleString()}+ users already earning, learning, and growing.
        </p>
      </div>

      {/* Social Proof */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-[#141829] rounded-lg p-4 border border-[#d4af37]/20">
          <div className="text-2xl font-bold text-[#d4af37]">4.9★</div>
          <div className="text-xs text-[#a0a0a0] mt-1">50K+ Reviews</div>
        </div>
        <div className="bg-[#141829] rounded-lg p-4 border border-[#d4af37]/20">
          <div className="text-2xl font-bold text-[#d4af37]">$100M+</div>
          <div className="text-xs text-[#a0a0a0] mt-1">Earned by Users</div>
        </div>
        <div className="bg-[#141829] rounded-lg p-4 border border-[#d4af37]/20">
          <div className="text-2xl font-bold text-[#d4af37]">150+</div>
          <div className="text-xs text-[#a0a0a0] mt-1">Countries</div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all"
      >
        Claim Your Spot Now
      </motion.button>

      {/* Trust Signals */}
      <div className="text-center text-xs text-[#a0a0a0] space-y-2">
        <div>🔒 Bank-level security • 🎯 Verified users • ✅ Money-back guarantee</div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// STEP 2: BENEFITS - VALUE PROPOSITION
// ============================================================================
const BenefitsStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const benefits = [
    { icon: '💰', title: 'Earn Passive Income', desc: 'Up to $10K/month' },
    { icon: '🧠', title: 'Learn from AI', desc: 'Personalized education' },
    { icon: '🎮', title: 'Play & Earn', desc: 'Gaming rewards' },
    { icon: '🤝', title: 'Build Community', desc: 'Connect with 1M+ users' },
    { icon: '📈', title: 'Grow Your Skills', desc: 'Certifications included' },
    { icon: '🌟', title: 'Premium Features', desc: 'Lifetime access' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent">
        What You'll Get
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {benefits.map((benefit, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#141829] rounded-lg p-4 border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all"
          >
            <div className="text-2xl mb-2">{benefit.icon}</div>
            <div className="font-bold text-sm text-[#ffffff]">{benefit.title}</div>
            <div className="text-xs text-[#a0a0a0] mt-1">{benefit.desc}</div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold py-4 rounded-lg text-lg shadow-lg"
      >
        Continue to Sign Up
      </motion.button>
    </motion.div>
  );
};

// ============================================================================
// STEP 3: SIGN-UP FORM - FRICTION REDUCTION
// ============================================================================
const SignUpStep: React.FC<{
  email: string;
  setEmail: (email: string) => void;
  onSignUp: () => void;
  loading: boolean;
}> = ({ email, setEmail, onSignUp, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent">
        Get Started Free
      </h2>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#1a1f3a] border border-[#d4af37]/30 rounded-lg px-4 py-3 text-white placeholder-[#a0a0a0] focus:outline-none focus:border-[#d4af37] transition-all"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSignUp}
          disabled={loading || !email}
          className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold py-4 rounded-lg text-lg shadow-lg disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Free Account'}
        </motion.button>
      </div>

      {/* Instant Reward */}
      <div className="bg-[#141829] rounded-lg p-4 border border-[#10b981]/50 text-center">
        <div className="text-sm text-[#10b981] font-bold">🎁 Instant Bonus</div>
        <div className="text-lg font-bold text-[#d4af37] mt-1">$50 Credits</div>
        <div className="text-xs text-[#a0a0a0] mt-1">When you sign up today</div>
      </div>

      <div className="text-center text-xs text-[#a0a0a0]">
        No credit card required • Free forever • Cancel anytime
      </div>
    </motion.div>
  );
};

// ============================================================================
// STEP 4: SUCCESS - INSTANT GRATIFICATION
// ============================================================================
const SuccessStep: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-6xl"
      >
        🎉
      </motion.div>

      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent">
        Welcome to SKYCOIN4444!
      </h2>

      <div className="bg-[#141829] rounded-lg p-6 border border-[#d4af37]/30 space-y-4">
        <div className="text-left space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <div className="font-bold">$50 Bonus Credited</div>
              <div className="text-sm text-[#a0a0a0]">Start earning immediately</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <div className="font-bold">Premium Access Unlocked</div>
              <div className="text-sm text-[#a0a0a0]">All features available</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <div className="font-bold">Welcome Package Ready</div>
              <div className="text-sm text-[#a0a0a0]">Check your dashboard</div>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold py-4 rounded-lg text-lg shadow-lg"
      >
        Go to Dashboard
      </motion.button>
    </motion.div>
  );
};
