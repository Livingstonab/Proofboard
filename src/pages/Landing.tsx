import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Sparkles, 
  Shield, 
  Globe, 
  Video, 
  FileText, 
  Crown,
  CheckCircle,
  ArrowRight,
  Play,
  Github,
  Twitter,
  Linkedin,
  Star,
  Users,
  TrendingUp,
  Zap,
  Award,
  Target,
  Palette
} from 'lucide-react';
import Button from '../components/UI/Button';
import FloatingContactButtons from '../components/FloatingContactButtons';

const Landing: React.FC = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 });
  const [howItWorksRef, howItWorksInView] = useInView({ threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1 });
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const features = [
    {
      icon: Video,
      title: 'AI Video Generation',
      description: 'Automatically generate stunning video presentations of your projects using Tavus AI technology.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'NFT Minting',
      description: 'Mint your projects as verifiable NFTs on Algorand blockchain for permanent proof of ownership.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Reach global audiences with automatic translation powered by Lingo API.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FileText,
      title: 'Professional Resume Builder',
      description: 'Generate beautiful, shareable resumes from your verified projects and achievements.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Track your portfolio performance with detailed insights and engagement metrics.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Community & Following',
      description: 'Connect with other creators, follow their work, and build your professional network.',
      color: 'from-pink-500 to-rose-500'
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Set up your professional profile with bio, skills, and contact preferences.',
      icon: Target
    },
    {
      step: '02',
      title: 'Add Projects',
      description: 'Upload your work with descriptions, images, and choose target languages.',
      icon: Palette
    },
    {
      step: '03',
      title: 'AI Enhancement',
      description: 'Our AI generates videos, translates content, and stores everything on IPFS.',
      icon: Sparkles
    },
    {
      step: '04',
      title: 'Mint & Share',
      description: 'Mint NFTs for verification and share your portfolio with the world.',
      icon: Award
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Full Stack Developer',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'ProofMint transformed how I showcase my work. The AI videos and NFT verification give my portfolio a professional edge that clients love.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'UI/UX Designer',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'The multi-language support helped me reach international clients. The resume builder is incredibly professional and saves me hours.',
      rating: 5
    },
    {
      name: 'Alex Johnson',
      role: 'Blockchain Developer',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Being able to mint my projects as NFTs adds credibility and proves ownership. The analytics help me understand my audience better.',
      rating: 5
    }
  ];

  const stats = [
    { number: '10K+', label: 'Projects Created' },
    { number: '5K+', label: 'Active Creators' },
    { number: '25K+', label: 'NFTs Minted' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Bolt Logo Banner */}
      <div className="w-full bg-black/20 backdrop-blur-sm border-b border-white/10 py-3">
        <div className="container mx-auto px-6 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/black_circle_360x360.png" 
              alt="Powered by Bolt" 
              className="w-8 h-8"
            />
            <span className="text-white/80 text-sm font-medium">Powered by Bolt</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">ProofMint</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How it Works</a>
              <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-white/90 text-sm">Your All-In-One Web3 Portfolio App</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Showcase Your Work.
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mint NFTs. Inspire the World.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Build stunning portfolios, generate AI-powered videos, translate content globally, 
              and mint verifiable NFTs. The future of creative showcasing is here.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/signup">
                <Button size="lg" className="px-10 py-4 text-lg">
                  <Zap className="mr-2 w-5 h-5" />
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 py-4 text-lg text-white border-white/30 hover:bg-white/10"
                onClick={() => setShowDemoVideo(true)}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-32 px-6 bg-white/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}Modern Creators
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to build, verify, and share your professional work in the Web3 era.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" ref={howItWorksRef} className="py-32 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Four simple steps to transform your work into verified, shareable Web3 assets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 relative z-10">
                  {step.step}
                </div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent transform -translate-y-1/2 z-0"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="py-32 px-6 bg-white/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of professionals who have transformed their portfolios with ProofMint.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-3xl p-16 border border-purple-500/30">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Build Your
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}Web3 Portfolio?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join the future of creative showcasing. Start building your verified portfolio today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="px-12 py-4 text-lg">
                  <Sparkles className="mr-2 w-5 h-5" />
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-12 py-4 text-lg text-white border-white/30 hover:bg-white/10"
                onClick={() => setShowDemoVideo(true)}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">ProofMint</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Your All-In-One Web3 Portfolio App. Showcase your work, mint NFTs, share resumes, and more.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20 text-center text-gray-400">
            <p>&copy; 2025 ProofMint. All rights reserved. Built for creators, by creators.</p>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      {showDemoVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">ProofMint Demo</h3>
              <button
                onClick={() => setShowDemoVideo(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">Demo video would be embedded here</p>
                <p className="text-white/50 text-sm mt-2">Showcasing ProofMint's features and workflow</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Contact Buttons */}
      <FloatingContactButtons />
    </div>
  );
};

export default Landing;