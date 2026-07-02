import React, { useState, useEffect } from 'react';
import { Check, X, Zap, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/_core/hooks/useAuth';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: Record<string, boolean | number>;
}

interface UserSubscription {
  tier: string;
  status: string;
  price: number;
  features: Record<string, boolean | number>;
  endsAt?: string;
}

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  unlimitedLikes: 'Unlimited Likes',
  unlimitedSuperLikes: 'Unlimited Super Likes',
  unlimitedMessages: 'Unlimited Messages',
  rewindFeature: 'Rewind Feature',
  boostFeature: 'Boost Profile',
  incognitoMode: 'Incognito Mode',
  advancedFilters: 'Advanced Filters',
  seenByFeature: 'See Who Liked You',
  prioritySupport: 'Priority Support',
  premiumBadge: 'Premium Badge',
  aiMatchingBoost: 'AI Matching Boost',
};

export default function DatingSubscription() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await fetch('/api/dating/subscription/plans');
      const data = await response.json();
      setPlans(data || []);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/dating/subscription');
      const data = await response.json();
      setCurrentSubscription(data);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId);
    try {
      const response = await fetch('/api/dating/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: planId }),
      });
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
    } finally {
      setUpgrading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'elite':
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 'vip':
        return <Star className="w-6 h-6 text-purple-500" />;
      case 'premium':
        return <Zap className="w-6 h-6 text-pink-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade Your Experience</h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan to unlock premium features
          </p>
        </div>

        {/* Current Subscription Info */}
        {currentSubscription && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {currentSubscription.tier}
                </h2>
                {currentSubscription.endsAt && (
                  <p className="text-sm text-gray-600 mt-1">
                    Renews on {new Date(currentSubscription.endsAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Monthly Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${currentSubscription.price.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription?.tier === plan.id;
            const isHigherTier = plans.findIndex((p) => p.id === currentSubscription?.tier) < plans.findIndex((p) => p.id === plan.id);

            return (
              <Card
                key={plan.id}
                className={`p-6 transition-all ${
                  isCurrentPlan
                    ? 'ring-2 ring-pink-500 shadow-lg scale-105'
                    : 'hover:shadow-lg hover:scale-102'
                }`}
              >
                {/* Badge */}
                {isCurrentPlan && (
                  <div className="mb-4 inline-block px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">
                    Current Plan
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {getTierIcon(plan.id)}
                    <h3 className="text-xl font-bold text-gray-900 capitalize">{plan.name}</h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    ${plan.price.toFixed(2)}
                    <span className="text-sm text-gray-600 font-normal">/month</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {Object.entries(plan.features).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3">
                      {value ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={value ? 'text-gray-700' : 'text-gray-400'}>
                        {FEATURE_DESCRIPTIONS[key] || key}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                {isCurrentPlan ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading === plan.id || (!isHigherTier && currentSubscription?.tier !== 'free')}
                    className={`w-full ${
                      plan.id === 'elite'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                        : plan.id === 'vip'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                        : plan.id === 'premium'
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {upgrading === plan.id ? (
                      <Spinner className="w-4 h-4" />
                    ) : plan.price === 0 ? (
                      'Downgrade'
                    ) : (
                      'Upgrade Now'
                    )}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <Card className="p-8 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and digital wallets through Stripe.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                The Free tier is always available with basic features. Upgrade to Premium, VIP, or Elite to unlock advanced features.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
