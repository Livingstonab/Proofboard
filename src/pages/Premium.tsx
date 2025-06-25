import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  Video, 
  BarChart3,
  Users,
  Sparkles,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import toast from 'react-hot-toast';
import { processPaddlePayment } from '../lib/api';

const Premium: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const plans = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        '5 verified projects',
        'Basic AI video generation',
        'Standard NFT minting',
        'Public portfolio',
        'Community support',
        'Basic analytics'
      ],
      limitations: [
        'Limited to 5 projects',
        'Basic video quality',
        'Standard support'
      ]
    },
    premium: {
      name: 'Premium',
      price: { monthly: 19, yearly: 190 },
      description: 'For serious creators and professionals',
      features: [
        'Unlimited verified projects',
        'HD AI video generation',
        'Priority NFT minting',
        'Custom portfolio themes',
        'Advanced analytics dashboard',
        'Multi-language translations',
        'Priority support',
        'Resume builder',
        'Custom branding',
        'API access'
      ],
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      price: { monthly: 99, yearly: 990 },
      description: 'For teams and organizations',
      features: [
        'Everything in Premium',
        'Team collaboration',
        'White-label solutions',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'Advanced security',
        'Bulk operations',
        'Custom workflows',
        'Enterprise support'
      ]
    }
  };

  const handleUpgrade = async (planName: string) => {
    setIsUpgrading(true);
    
    try {
      // Process REAL payment with Paddle
      const paymentResult = await processPaddlePayment(planName.toLowerCase());
      
      if (paymentResult.success) {
        // Update user to premium
        updateUser({ isPremium: true });
        
        toast.success(`Successfully upgraded to ${planName}! Payment processed.`);
        
        // Store subscription info with CORRECT key
        localStorage.setItem('proofboard_subscription', JSON.stringify({
          plan: planName,
          billing: selectedPlan,
          startDate: new Date().toISOString(),
          status: 'active',
          transactionId: paymentResult.transactionId
        }));
      } else {
        toast.error('Payment failed. Please try again.');
      }
      
    } catch (error) {
      toast.error('Upgrade failed. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const features = [
    {
      icon: Video,
      title: 'HD AI Video Generation',
      description: 'Create stunning 4K videos with advanced AI technology'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into your portfolio performance'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Multi-language support for worldwide audience'
    },
    {
      icon: Shield,
      title: 'Priority Verification',
      description: 'Faster NFT minting and blockchain verification'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team on projects'
    },
    {
      icon: Sparkles,
      title: 'Custom Branding',
      description: 'Personalize your portfolio with custom themes'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-6"
        >
          <Crown className="w-5 h-5 text-purple-400 mr-2" />
          <span className="text-purple-400 font-medium">Upgrade to Premium</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Unlock Your Creative
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {' '}Potential
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
        >
          Take your portfolio to the next level with premium features designed for serious creators and professionals.
        </motion.p>
      </div>

      {/* Current Plan Status */}
      {user?.isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Premium Active
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    You're currently on the Premium plan
                  </p>
                </div>
              </div>
              <Button variant="outline">
                Manage Subscription
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-lg p-1 border border-white/20 dark:border-gray-700/20">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-6 py-2 rounded-md transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`px-6 py-2 rounded-md transition-all relative ${
              selectedPlan === 'yearly'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {Object.entries(plans).map(([key, plan], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </span>
              </div>
            )}

            <Card className={`p-8 h-full ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price[selectedPlan]}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{selectedPlan === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>

                {key === 'free' ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!user?.isPremium}
                  >
                    {user?.isPremium ? 'Current Plan' : 'Current Plan'}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade(plan.name)}
                    isLoading={isUpgrading}
                    disabled={user?.isPremium && key === 'premium'}
                  >
                    {user?.isPremium && key === 'premium' ? (
                      'Current Plan'
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Upgrade to {plan.name}
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Limitations:</p>
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start space-x-3">
                        <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto mt-2"></div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Premium Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Features
          
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Unlock powerful tools to elevate your creative portfolio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="p-6 text-center hover:scale-105 transition-transform duration-200">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What happens to my projects if I downgrade?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your projects remain safe and accessible. However, you'll be limited to the free plan's project limit for new creations.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offer a 30-day money-back guarantee for all premium subscriptions. Contact support for assistance.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can try premium features for 14 days free when you upgrade. No credit card required.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center mt-16"
      >
        <Card className="p-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Go Premium?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of creators who have elevated their portfolios with ProofBoard Premium.
          </p>
          <Button size="lg" onClick={() => handleUpgrade('Premium')}>
            <Zap className="w-5 h-5 mr-2" />
            Upgrade Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default Premium;