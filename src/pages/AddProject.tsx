import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Video, 
  Globe, 
  Shield, 
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Loader,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import toast from 'react-hot-toast';
import { generateTavusVideo, translateText, mintNFT, uploadToIPFS } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    files: [] as File[],
    videoMessage: '',
    language: 'en',
    isPublic: true,
    generateVideo: true, // Video toggle
  });

  const [results, setResults] = useState({
    videoUrl: '',
    translations: {} as Record<string, { title: string; description: string }>,
    nftId: '',
    txId: '',
    ipfsUrls: [] as string[]
  });

  const steps = [
    { title: 'Project Details', icon: FileText },
    { title: 'File Upload', icon: Upload },
    { title: 'AI Video Generation', icon: Video },
    { title: 'Multi-Language Translation', icon: Globe },
    { title: 'NFT Minting & Verification', icon: Shield },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' }
  ];

  const categories = [
    'Web Development',
    'Mobile App',
    'UI/UX Design',
    'AI/Machine Learning',
    'Blockchain/Web3',
    'Data Science',
    'Game Development',
    'DevOps/Cloud',
    'Cybersecurity',
    'IoT/Hardware',
    'E-commerce',
    'Social Media',
    'Educational',
    'Healthcare',
    'Finance/Fintech',
    'Other'
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md'],
    },
    maxFiles: 5,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      setFormData({ ...formData, files: acceptedFiles });
    },
  });

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      await handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to create a project');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Step 1: Upload files to IPFS
      let fileUrls: string[] = [];
      if (formData.files.length > 0) {
        setProcessingStep('Uploading files to IPFS...');
        for (const file of formData.files) {
          const url = await uploadToIPFS(file);
          fileUrls.push(url);
        }
        setResults(prev => ({ ...prev, ipfsUrls: fileUrls }));
        toast.success('Files uploaded to IPFS successfully!');
      }

      // Step 2: Generate topic-specific AI video using Tavus (only if enabled)
      let videoUrl = '';
      if (formData.generateVideo) {
        setProcessingStep('Generating topic-specific AI video with Tavus...');
        const videoScript = formData.videoMessage || formData.description;
        videoUrl = await generateTavusVideo(formData.title, videoScript, formData.category);
        setResults(prev => ({ ...prev, videoUrl }));
        toast.success('Topic-specific AI video generated successfully!');
      }

      // Step 3: Translate content using Lingo
      setProcessingStep('Translating content...');
      const targetLanguages = ['fr', 'es'];
      const translations: Record<string, { title: string; description: string }> = {};
      
      for (const lang of targetLanguages) {
        translations[lang] = {
          title: await translateText(formData.title, lang),
          description: await translateText(formData.description, lang),
        };
      }
      setResults(prev => ({ ...prev, translations }));
      toast.success('Content translated successfully!');

      // Step 4: Mint NFT on Algorand
      setProcessingStep('Minting NFT on Algorand blockchain...');
      const metadata = {
        name: formData.title,
        description: formData.description,
        category: formData.category,
        image: fileUrls[0] || '',
        video: videoUrl,
        translations,
        creator: user.name,
        creatorId: user.id,
        timestamp: new Date().toISOString(),
        properties: {
          category: 'verified_project',
          language: formData.language,
          files: fileUrls,
          projectType: formData.category
        }
      };
      
      const txId = await mintNFT(metadata);
      const nftId = `NFT-${Date.now()}`;
      setResults(prev => ({ ...prev, nftId, txId }));
      toast.success('NFT minted successfully!');

      // Step 5: Save project to localStorage
      setProcessingStep('Saving project...');
      const newProject = {
        id: Date.now().toString(),
        userId: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        thumbnail: fileUrls[0] || '',
        videoUrl: videoUrl,
        fileUrls: fileUrls,
        nftId: nftId,
        algorandTxId: txId,
        translations: translations,
        language: formData.language,
        isPublic: formData.isPublic,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage with proper key
      const existingProjects = JSON.parse(localStorage.getItem('proofboard_projects') || '[]');
      const updatedProjects = [...existingProjects, newProject];
      localStorage.setItem('proofboard_projects', JSON.stringify(updatedProjects));

      // Update analytics
      const analytics = JSON.parse(localStorage.getItem('proofboard_analytics') || '{}');
      const updatedAnalytics = {
        ...analytics,
        totalProjects: (analytics.totalProjects || 0) + 1,
        videosGenerated: (analytics.videosGenerated || 0) + (formData.generateVideo ? 1 : 0),
        nftsMinted: (analytics.nftsMinted || 0) + 1,
        languagesUsed: [...new Set([...(analytics.languagesUsed || []), formData.language])],
        recentActivity: [
          ...(analytics.recentActivity || []).slice(0, 9),
          {
            type: 'project_created',
            message: `Created project "${formData.title}"`,
            timestamp: new Date().toISOString()
          },
          ...(formData.generateVideo ? [{
            type: 'video_generated',
            message: `AI video generated for "${formData.title}"`,
            timestamp: new Date().toISOString()
          }] : []),
          {
            type: 'nft_minted',
            message: `NFT minted for "${formData.title}"`,
            timestamp: new Date().toISOString()
          }
        ]
      };
      localStorage.setItem('proofboard_analytics', JSON.stringify(updatedAnalytics));

      toast.success('Project created successfully!');
      
      // Navigate to project details
      setTimeout(() => {
        navigate(`/dashboard/projects/${newProject.id}`);
      }, 2000);

    } catch (error) {
      console.error('Project creation error:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Information
              </h3>
              <div className="space-y-4">
                <Input
                  label="Project Title *"
                  placeholder="Enter your project title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Description *
                  </label>
                  <textarea
                    className="w-full px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    rows={4}
                    placeholder="Describe your project in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Generate AI Video
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Create a topic-specific video for your project
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, generateVideo: !formData.generateVideo })}
                    className="flex items-center"
                  >
                    {formData.generateVideo ? (
                      <ToggleRight className="w-8 h-8 text-purple-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Make this project public in my portfolio and explore page
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upload Project Files
              </h3>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-purple-600 dark:text-purple-400">Drop files here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Drag & drop files here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports images, videos, PDFs, and text files (max 50MB each)
                    </p>
                  </div>
                )}
              </div>

              {formData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Selected Files ({formData.files.length})
                  </h4>
                  {formData.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg"
                    >
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                AI Video Generation
              </h3>
              {formData.generateVideo ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Custom Video Script (Optional)
                    </label>
                    <textarea
                      className="w-full px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                      rows={3}
                      placeholder="Enter a custom script for your AI video, or we'll use your project description..."
                      value={formData.videoMessage}
                      onChange={(e) => setFormData({ ...formData, videoMessage: e.target.value })}
                    />
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Video className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                          Topic-Specific AI Video Generation
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Our AI will generate a video specifically related to your project category ({formData.category || 'selected category'}) 
                          and description. The video will be under 5 minutes and showcase content relevant to your work.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Video Generation Disabled
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You've chosen to skip AI video generation for this project. You can enable it in the previous step.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Multi-Language Translation
              </h3>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-100">
                      Lingo API Translation
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Your project title and description will be automatically translated into French and Spanish 
                      using Lingo API to reach a global audience.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      🇫🇷 French Translation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatic translation to reach French-speaking audiences worldwide
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      🇪🇸 Spanish Translation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatic translation to reach Spanish-speaking audiences worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                NFT Minting & Blockchain Verification
              </h3>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">
                      Algorand Blockchain Verification
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                      Your project will be minted as an NFT on the Algorand blockchain using ARC3 standard 
                      for permanent proof of authenticity and ownership.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    NFT Metadata Preview
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Title:</span>
                      <span className="text-gray-900 dark:text-white">{formData.title || 'Your Project Title'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="text-gray-900 dark:text-white">{formData.category || 'Selected Category'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Creator:</span>
                      <span className="text-gray-900 dark:text-white">{user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Blockchain:</span>
                      <span className="text-gray-900 dark:text-white">Algorand</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Standard:</span>
                      <span className="text-gray-900 dark:text-white">ARC3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Files:</span>
                      <span className="text-gray-900 dark:text-white">{formData.files.length} file(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Video:</span>
                      <span className="text-gray-900 dark:text-white">{formData.generateVideo ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          disabled={isProcessing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Project
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Build and verify your project with AI-powered features and blockchain authentication.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.title} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {steps[currentStep].title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <Loader className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Creating Your Project
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {processingStep}
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Step Content */}
      <Card className="p-8 mb-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0 || isProcessing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={
            isProcessing ||
            (currentStep === 0 && (!formData.title || !formData.description || !formData.category))
          }
          isLoading={isProcessing}
        >
          {currentStep === steps.length - 1 ? 'Create Project' : 'Next'}
          {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default AddProject;