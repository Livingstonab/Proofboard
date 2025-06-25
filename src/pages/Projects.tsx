import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Eye, 
  Heart, 
  Share2, 
  ExternalLink, 
  Video, 
  Shield, 
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Download,
  Globe
} from 'lucide-react';
import { Project } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('proofboard_projects');
    if (savedProjects && user) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        const userProjects = parsedProjects.filter((p: Project) => p.userId === user.id);
        setProjects(userProjects);
        setFilteredProjects(userProjects);
      } catch (error) {
        console.error('Failed to parse saved projects:', error);
      }
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      switch (filterType) {
        case 'verified':
          filtered = filtered.filter(project => project.nftId);
          break;
        case 'public':
          filtered = filtered.filter(project => project.isPublic);
          break;
        case 'private':
          filtered = filtered.filter(project => !project.isPublic);
          break;
      }
    }

    setFilteredProjects(filtered);
  }, [searchTerm, filterType, projects]);

  const handleShare = (project: Project) => {
    const shareUrl = `${window.location.origin}/project/${project.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Project link copied to clipboard!');
  };

  const handleDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      
      // Update localStorage
      const allProjects = JSON.parse(localStorage.getItem('proofboard_projects') || '[]');
      const updatedAllProjects = allProjects.filter((p: Project) => p.id !== projectId);
      localStorage.setItem('proofboard_projects', JSON.stringify(updatedAllProjects));
      
      toast.success('Project deleted successfully');
    }
  };

  const handleLike = (projectId: string) => {
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, likes: p.likes + 1 } : p
    );
    setProjects(updatedProjects);
    
    // Update localStorage
    const allProjects = JSON.parse(localStorage.getItem('proofboard_projects') || '[]');
    const updatedAllProjects = allProjects.map((p: Project) =>
      p.id === projectId ? { ...p, likes: p.likes + 1 } : p
    );
    localStorage.setItem('proofboard_projects', JSON.stringify(updatedAllProjects));
    
    toast.success('Project liked!');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 animate-pulse">
              <div className="aspect-video bg-gray-300/20 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-300/20 rounded mb-2"></div>
              <div className="h-3 bg-gray-300/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Projects
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and showcase your verified creative work.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
          >
            <option value="all">All Projects</option>
            <option value="verified">Verified Only</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <div className="flex items-center bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <Link to="/dashboard/add-project">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || filterType !== 'all' ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Start building your verified portfolio by adding your first project.'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <Link to="/dashboard/add-project">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {viewMode === 'grid' ? (
                <Card className="overflow-hidden group">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 relative">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex space-x-2">
                      {project.nftId && (
                        <span className="px-2 py-1 bg-green-500/20 backdrop-blur-sm text-green-400 text-xs rounded-full flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                      {!project.isPublic && (
                        <span className="px-2 py-1 bg-orange-500/20 backdrop-blur-sm text-orange-400 text-xs rounded-full">
                          Private
                        </span>
                      )}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                      <Button size="sm" variant="outline" className="text-white border-white/30">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-white border-white/30" onClick={() => handleShare(project)}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-white border-white/30">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleLike(project.id)}
                          className="flex items-center hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          {project.likes}
                        </button>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {project.views}
                        </span>
                      </div>
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Link to={`/dashboard/projects/${project.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleShare(project)}
                          className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex-shrink-0 relative overflow-hidden">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="w-8 h-8 text-purple-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {project.nftId && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          )}
                          {!project.isPublic && (
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                              Private
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <button 
                            onClick={() => handleLike(project.id)}
                            className="flex items-center hover:text-red-500 transition-colors"
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            {project.likes}
                          </button>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {project.views}
                          </span>
                          <span>
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link to={`/dashboard/projects/${project.id}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                          <button 
                            onClick={() => handleShare(project)}
                            className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;