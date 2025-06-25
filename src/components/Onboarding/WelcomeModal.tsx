import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Crown, CheckCircle, ArrowRight, Gift } from 'lucide-react';
import Button from '../UI/Button';
import { useAuth } from '../../contexts/AuthContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onboardingData?: any;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, onboardingData }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      title: `Welcome to ProofMint, ${user?.name?.split(' ')[0] || 'Creator'}! 🎉`,
      subtitle: 'Your creative journey starts here',
      content: (
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've successfully joined the future of creative verification. Let's explore what makes ProofMint special.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">AI-Powered</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generate stunning videos automatically</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Blockchain Verified</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Permanent proof of authenticity</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Gift className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Global Reach</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Multi-language support included</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Your Profile is Ready! 🚀',
      subtitle: 'Based on your preferences, we\'ve set up your account',
      content: (
        <div>
          {onboardingData && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Your Profile Summary:</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tech Category:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{onboardingData.techCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Skill Level:</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{onboardingData.skillLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{onboardingData.experience}</span>
                </div>
                {onboardingData.interests?.length > 0 && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Interests:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {onboardingData.interests.map((interest: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your personalized dashboard is ready with features tailored to your expertise level and interests.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Free Plan Includes:</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 5 verified projects</li>
                  <li>• AI video generation</li>
                  <li>• NFT minting</li>
                  <li>• Public portfolio</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Premium Features:</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Unlimited projects</li>
                  <li>• Advanced analytics</li>
                  <li>• Resume builder</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Ready to Create? 🎨',
      subtitle: 'Let\'s add your first project and get you started',
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ArrowRight className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You're all set! Your dashboard is ready and waiting for your first amazing project.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Start with a project you're most proud of. It will be featured prominently on your profile and help establish your credibility.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">What happens next:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mb-2 text-xs font-bold">1</div>
                <span className="text-gray-700 dark:text-gray-300">Add your project details</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mb-2 text-xs font-bold">2</div>
                <span className="text-gray-700 dark:text-gray-300">AI generates your video</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mb-2 text-xs font-bold">3</div>
                <span className="text-gray-700 dark:text-gray-300">Get your verified NFT</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ProofMint
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex space-x-2">
                {welcomeSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {welcomeSteps[currentStep].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {welcomeSteps[currentStep].subtitle}
                </p>
              </div>
              
              {welcomeSteps[currentStep].content}
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleSkip}
              >
                Skip Tour
              </Button>

              <div className="flex items-center space-x-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </Button>
                )}
                
                <Button onClick={handleNext}>
                  {currentStep === welcomeSteps.length - 1 ? (
                    <>
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;