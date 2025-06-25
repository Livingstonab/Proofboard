import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Heart, 
  Share2, 
  Shield, 
  Globe, 
  User,
  Video,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  ExternalLink,
  UserPlus,
  Bookmark,
  Play,
  Award,
  Crown,
  Zap
} from 'lucide-react';
import { Project, User as UserType } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Explore: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'projects' | 'creators' | 'trending'>('projects');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all public projects and users
    const loadData = () => {
      try {
        // Load projects
        const savedProjects = localStorage.getItem('proofmint_projects');
        if (savedProjects) {
          const allProjects = JSON.parse(savedProjects);
          const publicProjects = allProjects.filter((p: Project) => p.isPublic);
          setProjects(publicProjects);
          setFilteredProjects(publicProjects);
        }

        // Load users (mock data for demo)
        const mockUsers: UserType[] = [
          {
            id: '1',
            name: 'Alex Johnson',
            username: 'alexj',
            email: 'alex@example.com',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
            bio: 'Full-stack developer passionate about AI and blockchain technology. Building the future one project at a time.',
            isPremium: true,
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'Sarah Chen',
            username: 'sarahc',
            email: 'sarah@example.com',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
            bio: 'UI/UX Designer creating beautiful and functional digital experiences. Love minimalist design and user-centered approach.',
            isPremium: false,
            createdAt: '2024-01-02T00:00:00Z'
          },
          {
            id: '3',
            name: 'Mike Rodriguez',
            username: 'miker',
            email: 'mike@example.com',
            avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
            bio: 'Mobile app developer specializing in React Native and Flutter. 5+ years of experience in cross-platform development.',
            isPremium: true,
            createdAt: '2024-01-03T00:00:00Z'
          },
          {
            id: '4',
            name: 'Emma Wilson',
            username: 'emmaw',
            email: 'emma@example.com',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
            bio: 'Data scientist and ML engineer. Turning data into insights and building intelligent systems.',
            isPremium: true,
            createdAt: '2024-01-04T00:00:00Z'
          },
          {
            id: '5',
            name: 'David Kim',
            username: 'davidk',
            email: 'david@example.com',
            avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150',
            bio: 'DevOps engineer and cloud architect. Passionate about automation, scalability, and infrastructure as code.',
            isPremium: false,
            createdAt: '2024-01-05T00:00:00Z'
          },
          {
            id: '6',
            name: 'Lisa Thompson',
            username: 'lisat',
            email: 'lisa@example.com',
            avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
            bio: 'Product manager with a technical background. Bridging the gap between business needs and technical solutions.',
            isPremium: true,
            createdAt: '2024-01-06T00:00:00Z'
          }
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Failed to load explore data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
        case 'trending':
          filtered = filtered.sort((a, b) => b.views - a.views).slice(0, 10);
          break;
        case 'recent':
          filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'premium':
          // Filter projects from premium users
          filtered = filtered.filter(project => {
            // In a real app, you'd check if the project owner is premium
            return Math.random() > 0.5; // Mock premium filter
          });
          break;
      }
    }

    setFilteredProjects(filtered);
  }, [searchTerm, filterType, projects]);

  useEffect(() => {
    let filteredUserList = users;

    if (searchTerm) {
      filteredUserList = filteredUserList.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType === 'premium') {
      filteredUserList = filteredUserList.filter(user => user.isPremium);
    }

    setFilteredUsers(filteredUserList);
  }, [searchTerm, filterType, users]);

  const handleLike = (projectId: string) => {
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, likes: p.likes + 1 } : p
    );
    setProjects(updatedProjects);
    
    // Update in localStorage
    const allProjects = JSON.parse(localStorage.getItem('proofmint_projects') || '[]');
    const updatedAllProjects = allProjects.map((p: Project) =>
      p.id === projectId ? { ...p, likes: p.likes + 1 } : p
    );
    localStorage.setItem('proofmint_projects', JSON.stringify(updatedAllProjects));
    
    toast.success('Project liked!');
  };

  const handleBookmark = (projectId: string) => {
    // In a real app, you'd save bookmarks to user's profile
    toast.success('Project bookmarked!');
  };

  const handleShare = (project: Project) => {
    const shareUrl = `${window.location.origin}/project/${project.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Project link copied to clipboard!');
  };

  const handleFollow = (userId: string) => {
    // Mock follow functionality
    toast.success('Following user!');
  };

  const getTrendingProjects = () => {
    return projects
      .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
      .slice(0, 6);
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
          Explore Community
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover amazing verified projects and connect with talented creators worldwide.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700/20 p-1">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === 'projects' 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 mr-2 inline" />
            Projects
          </button>
          <button
            onClick={() => setActiveTab('creators')}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === 'creators' 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4 mr-2 inline" />
            Creators
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === 'trending' 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2 inline" />
            Trending
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder={`Search ${activeTab}...`}
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
            <option value="all">All {activeTab}</option>
            {activeTab === 'projects' && (
              <>
                <option value="verified">Verified Only</option>
                <option value="trending">Most Popular</option>
                <option value="recent">Most Recent</option>
              </>
            )}
            <option value="premium">Premium Only</option>
          </select>

          {activeTab === 'projects' && (
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
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'projects' && (
        <>
          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria.
              </p>
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
                    <Card className="overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 relative">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Video className="w-16 h-16 text-purple-400" />
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
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                          <Button size="sm" variant="outline" className="text-white border-white/30">
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-white border-white/30" 
                            onClick={() => handleShare(project)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-white border-white/30"
                            onClick={() => handleBookmark(project.id)}
                          >
                            <Bookmark className="w-4 h-4" />
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
                              className="flex items-center hover:text-red-400 transition-colors"
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
                          <Link to={`/project/${project.id}`}>
                            <Button size="sm" variant="outline">
                              View Project
                            </Button>
                          </Link>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleLike(project.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleShare(project)}
                              className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-6 hover:scale-[1.01] transition-transform duration-300">
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
                              <Video className="w-8 h-8 text-purple-400" />
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
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                              <button 
                                onClick={() => handleLike(project.id)}
                                className="flex items-center hover:text-red-400 transition-colors"
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
                              <Link to={`/project/${project.id}`}>
                                <Button size="sm" variant="outline">
                                  View Project
                                </Button>
                              </Link>
                              <button 
                                onClick={() => handleShare(project)}
                                className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
                              >
                                <Share2 className="w-4 h-4" />
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
        </>
      )}

      {activeTab === 'creators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 text-center hover:scale-[1.02] transition-transform duration-300">
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      {creator.avatar ? (
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  {creator.isPremium && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {creator.name}
                </h3>
                <p className="text-purple-600 dark:text-purple-400 text-sm mb-3">
                  @{creator.username}
                </p>
                
                {creator.bio && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {creator.bio}
                  </p>
                )}

                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {new Date(creator.createdAt).getFullYear()}
                  </span>
                  {creator.isPremium && (
                    <span className="flex items-center text-yellow-600">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Link to={`/profile/${creator.username}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    onClick={() => handleFollow(creator.id)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'trending' && (
        <div className="space-y-8">
          {/* Featured Project */}
          {getTrendingProjects().length > 0 && (
            <Card className="p-8">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-purple-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Featured Project
                </h2>
              </div>
              
              {(() => {
                const featured = getTrendingProjects()[0];
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg relative overflow-hidden">
                      {featured.thumbnail ? (
                        <img
                          src={featured.thumbnail}
                          alt={featured.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="w-20 h-20 text-purple-400" />
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-full flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {featured.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {featured.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {featured.views} views
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {featured.likes} likes
                        </span>
                        {featured.nftId && (
                          <span className="flex items-center text-green-500">
                            <Shield className="w-4 h-4 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Link to={`/project/${featured.id}`}>
                          <Button>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Project
                          </Button>
                        </Link>
                        <Button variant="outline" onClick={() => handleShare(featured)}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Card>
          )}

          {/* Trending Grid */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Trending This Week
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTrendingProjects().slice(1).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 relative">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="w-16 h-16 text-purple-400" />
                        </div>
                      )}
                      
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          #{index + 2}
                        </span>
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
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {project.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {project.likes}
                          </span>
                        </div>
                      </div>

                      <Link to={`/project/${project.id}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          View Project
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;