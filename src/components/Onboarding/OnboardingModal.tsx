import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../UI/Button';
import { useAuth } from '../../contexts/AuthContext';

interface OnboardingData {
  techCategory: string;
  skillLevel: string;
  experience: string;
  interests: string[];
  goals: string;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    techCategory: '',
    skillLevel: '',
    experience: '',
    interests: [],
    goals: ''
  });

  const techCategories = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'DevOps Engineer',
    'Data Scientist',
    'UI/UX Designer',
    'Product Manager',
    'QA Engineer',
    'Blockchain Developer',
    'AI/ML Engineer',
    'Cybersecurity Specialist'
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', desc: 'Just starting out' },
    { value: 'intermediate', label: 'Intermediate', desc: '1-3 years experience' },
    { value: 'advanced', label: 'Advanced', desc: '3+ years experience' }
  ];

  const experienceOptions = [
    'Less than 1 year',
    '1-2 years',
    '3-5 years',
    '5-10 years',
    '10+ years'
  ];

  const interestOptions = [
    'Web Development',
    'Mobile Apps',
    'Machine Learning',
    'Blockchain',
    'Cloud Computing',
    'Cybersecurity',
    'Data Analytics',
    'Game Development',
    'IoT',
    'AR/VR'
  ];

  const steps = [
    {
      title: 'What\'s your tech category?',
      subtitle: 'Help us understand your primary focus area'
    },
    {
      title: 'What\'s your skill level?',
      subtitle: 'This helps us personalize your experience'
    },
    {
      title: 'How much experience do you have?',
      subtitle: 'Tell us about your professional journey'
    },
    {
      title: 'What interests you most?',
      subtitle: 'Select all that apply (optional)'
    },
    {
      title: 'What are your goals?',
      subtitle: 'What do you hope to achieve with ProofMint?'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem('proofmint_onboarding', JSON.stringify({
      ...data,
      completedAt: new Date().toISOString(),
      userId: user?.id
    }));
    
    onComplete(data);
    onClose();
  };

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {techCategories.map((category) => (
              <button
                key={category}
                onClick={() => setData({ ...data, techCategory: category })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  data.techCategory === category
                    ? 'border-purple-500 bg-purple-500/10 text-purple-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {category}
                </div>
              </button>
            ))}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            {skillLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setData({ ...data, skillLevel: level.value })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  data.skillLevel === level.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {level.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {level.desc}
                </div>
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            {experienceOptions.map((exp) => (
              <button
                key={exp}
                onClick={() => setData({ ...data, experience: exp })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  data.experience === exp
                    ? 'border-purple-500 bg-purple-500/10 text-purple-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {exp}
                </div>
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  data.interests.includes(interest)
                    ? 'border-purple-500 bg-purple-500/10 text-purple-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {interest}
                </div>
              </button>
            ))}
          </div>
        );

      case 4:
        return (
          <div>
            <textarea
              value={data.goals}
              onChange={(e) => setData({ ...data, goals: e.target.value })}
              placeholder="Tell us about your goals with ProofMint..."
              className="w-full h-32 px-4 py-3 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.techCategory !== '';
      case 1: return data.skillLevel !== '';
      case 2: return data.experience !== '';
      case 3: return true; // Optional step
      case 4: return data.goals.trim() !== '';
      default: return false;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  We'd like to know more about you
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {steps[currentStep].title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {steps[currentStep].subtitle}
              </p>
              
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;