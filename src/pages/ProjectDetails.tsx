import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Eye, 
  Heart, 
  Share2, 
  Download, 
  ExternalLink,
  Shield,
  Globe,
  Calendar,
  User,
  Video,
  FileText,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MoreHorizontal,
  CheckCircle
} from 'lucide-react';
import { Project } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

interface ProjectDetailsProps {
  isPublicView?: boolean;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ isPublicView = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Load project data with CORRECT localStorage key
    const savedProjects = localStorage.getItem('proofboard_projects');
    if (savedProjects) {
      try {
        const projects: Project[] = JSON.parse(savedProjects);
        const foundProject = projects.find(p => p.id === id);
        
        if (foundProject) {
          setProject(foundProject);
          
          // Increment view count if not the owner
          if (!isPublicView || (user && user.id !== foundProject.userId)) {
            const updatedProjects = projects.map(p => 
              p.id === id ? { ...p, views: p.views + 1 } : p
            );
            localStorage.setItem('proofboard_projects', JSON.stringify(updatedProjects));
            setProject({ ...foundProject, views: foundProject.views + 1 });
          }
          
          // Generate QR code for sharing
          const shareUrl = `${window.location.origin}/project/${id}`;
          QRCode.toDataURL(shareUrl)
            .then(url => setQrCodeUrl(url))
            .catch(console.error);
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    }
    setIsLoading(false);
  }, [id, user, isPublicView]);

  const handleLike = () => {
    if (!project) return;
    
    const savedProjects = localStorage.getItem('proofboard_projects');
    if (savedProjects) {
      try {
        const projects: Project[] = JSON.parse(savedProjects);
        const updatedProjects = projects.map(p => 
          p.id === id ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p
        );
        localStorage.setItem('proofboard_projects', JSON.stringify(updatedProjects));
        
        setProject({ ...project, likes: isLiked ? project.likes - 1 : project.likes + 1 });
        setIsLiked(!isLiked);
        toast.success(isLiked ? 'Like removed' : 'Project liked!');
      } catch (error) {
        console.error('Failed to update likes:', error);
      }
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = () => {
    if (!project || !window.confirm('Are you sure you want to delete this project?')) return;
    
    const savedProjects = localStorage.getItem('proofboard_projects');
    if (savedProjects) {
      try {
        const projects: Project[] = JSON.parse(savedProjects);
        const updatedProjects = projects.filter(p => p.id !== id);
        localStorage.setItem('proofboard_projects', JSON.stringify(updatedProjects));
        toast.success('Project deleted successfully');
        navigate('/dashboard/projects');
      } catch (error) {
        console.error('Failed to delete project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    toast.error('Failed to load video');
  };

  const downloadCertificate = () => {
    if (!project) return;
    
    // Create a simple certificate content
    const certificateContent = `
      CERTIFICATE OF AUTHENTICITY
      
      Project: ${project.title}
      Creator: ${user?.name}
      NFT ID: ${project.nftId}
      Transaction ID: ${project.algorandTxId}
      Created: ${new Date(project.createdAt).toLocaleDateString()}
      
      This certificate verifies the authenticity of the above project
      on the Algorand blockchain.
    `;
    
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title}-certificate.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Certificate downloaded!');
  };

  const isOwner = user && project && user.id === project.userId;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Project Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link to={isPublicView ? "/" : "/dashboard"}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isPublicView ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' : ''}`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(isPublicView ? '/' : '/dashboard/projects')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isPublicView ? 'Back to Home' : 'Back to Projects'}
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {project.views} views
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {project.likes} likes
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {project.nftId && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified NFT
                </span>
              )}
              
              {project.isPublic && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Public
                </span>
              )}

              <Button variant="outline" onClick={handleLike}>
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>

              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              {isOwner && (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Section */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 relative">
                {project.videoUrl && !videoError ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    poster={project.thumbnail}
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onError={handleVideoError}
                    muted={isMuted}
                  >
                    <source src={project.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : project.thumbnail ? (
                  <div className="relative w-full h-full">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Video className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg font-semibold mb-2">AI Video Generated</p>
                        <p className="text-sm opacity-80">
                          {videoError ? 'Video temporarily unavailable' : 'Click to play video'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Video className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Project Media
                      </p>
                    </div>
                  </div>
                )}

                {/* Video Status Badge */}
                {project.videoUrl && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm text-blue-400 text-sm rounded-full flex items-center">
                      <Video className="w-4 h-4 mr-1" />
                      AI Generated
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About This Project
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.description}
              </p>
            </Card>

            {/* Translations */}
            {project.translations && Object.keys(project.translations).length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-500" />
                  Multi-Language Translations
                </h2>
                <div className="space-y-6">
                  {Object.entries(project.translations).map(([lang, translation]) => (
                    <div key={lang} className="border-l-4 border-purple-500 pl-6 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        {lang === 'fr' ? '🇫🇷 French' : '🇪🇸 Spanish'}
                        <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-600 text-xs rounded-full">
                          AI Translated
                        </span>
                      </h3>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {translation.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {translation.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* NFT Information */}
            {project.nftId && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  Blockchain Verification
                </h2>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                    <span className="text-green-800 dark:text-green-200 font-semibold">
                      Verified on Algorand Blockchain
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-green-800 dark:text-green-200">
                        NFT ID
                      </label>
                      <p className="text-green-900 dark:text-green-100 font-mono text-sm break-all">
                        {project.nftId}
                      </p>
                    </div>
                    {project.algorandTxId && (
                      <div>
                        <label className="text-sm font-medium text-green-800 dark:text-green-200">
                          Transaction ID
                        </label>
                        <p className="text-green-900 dark:text-green-100 font-mono text-sm break-all">
                          {project.algorandTxId}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Algorand
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                      onClick={downloadCertificate}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                      onClick={() => copyToClipboard(project.nftId || '')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy NFT ID
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Creator
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.name || 'ProofBoard Creator'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{user?.username || 'creator'}
                  </p>
                </div>
              </div>
              
              {!isOwner && (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Follow Creator
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    View Portfolio
                  </Button>
                </div>
              )}
            </Card>

            {/* Project Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Views</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.views.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Likes</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.likes.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`font-medium ${project.nftId ? 'text-green-500' : 'text-yellow-500'}`}>
                    {project.nftId ? 'Verified' : 'Pending'}
                  </span>
                </div>
                {project.videoUrl && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">AI Video</span>
                    <span className="font-medium text-blue-500">Generated</span>
                  </div>
                )}
                {project.translations && Object.keys(project.translations).length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Languages</span>
                    <span className="font-medium text-purple-500">
                      {Object.keys(project.translations).length + 1}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Project
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Assets
                </Button>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
                {project.videoUrl && (
                  <Button variant="outline" className="w-full">
                    <Video className="w-4 h-4 mr-2" />
                    Download Video
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Share Project
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/project/${project.id}`}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(`${window.location.origin}/project/${project.id}`)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {qrCodeUrl && (
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      QR Code
                    </label>
                    <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-32 h-32" />
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setShowShareModal(false)}>
                    Close
                  </Button>
                  <Button onClick={() => copyToClipboard(`${window.location.origin}/project/${project.id}`)}>
                    Copy Link
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;