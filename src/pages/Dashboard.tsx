import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Heart, Share2, ExternalLink, Video, Shield, TrendingUp, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user's projects from localStorage
    const loadProjects = () => {
      const savedProjects = localStorage.getItem('proofboard_projects');
      if (savedProjects && user) {
        try {
          const allProjects = JSON.parse(savedProjects);
          const userProjects = allProjects.filter((p: Project) => p.userId === user.id);
          setProjects(userProjects);
        } catch (error) {
          console.error('Failed to parse saved projects:', error);
          setProjects([]);
        }
      } else {
        setProjects([]);
      }
      setIsLoading(false);
    };

    if (user) {
      loadProjects();
    }
  }, [user]);

  const stats = [
    { 
      label: 'Total Projects', 
      value: projects.length, 
      color: 'from-purple-500 to-pink-500',
      icon: Video,
      change: projects.length > 0 ? '+100%' : '0%'
    },
    { 
      label: 'Total Views', 
      value: projects.reduce((sum, p) => sum + p.views, 0), 
      color: 'from-blue-500 to-cyan-500',
      icon: Eye,
      change: '+12%'
    },
    { 
      label: 'Total Likes', 
      value: projects.reduce((sum, p) => sum + p.likes, 0), 
      color: 'from-green-500 to-emerald-500',
      icon: Heart,
      change: '+8%'
    },
    { 
      label: 'NFTs Minted', 
      value: projects.filter(p => p.nftId).length, 
      color: 'from-orange-500 to-red-500',
      icon: Shield,
      change: projects.filter(p => p.nftId).length > 0 ? '+100%' : '0%'
    },
  ];

  const recentActivity = [
    {
      type: 'project_created',
      message: 'You created a new project',
      time: '2 hours ago',
      icon: Plus,
      color: 'text-green-500'
    },
    {
      type: 'project_viewed',
      message: 'Your project received 5 new views',
      time: '4 hours ago',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      type: 'project_liked',
      message: 'Someone liked your project',
      time: '6 hours ago',
      icon: Heart,
      color: 'text-red-500'
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 animate-pulse">
              <div className="h-4 bg-gray-300/20 rounded mb-4"></div>
              <div className="h-8 bg-gray-300/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {projects.length === 0 
            ? "Ready to create your first verified project? Let's get started!"
            : `You have ${projects.length} project${projects.length === 1 ? '' : 's'} in your portfolio.`
          }
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard/add-project">
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </Button>
            </Link>
            <Link to="/dashboard/create-post">
              <Button variant="outline">
                Create Post
              </Button>
            </Link>
            <Link to="/dashboard/projects">
              <Button variant="outline">
                View All Projects
              </Button>
            </Link>
            <Link to="/dashboard/analytics">
              <Button variant="outline">
                View Analytics
              </Button>
            </Link>
            <Link to="/dashboard/resume">
              <Button variant="outline">
                Generate Resume
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Projects
              </h2>
              <Link to="/dashboard/projects">
                <Button variant="ghost">
                  View All
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {projects.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start building your verified portfolio by adding your first project.
                </p>
                <Link to="/dashboard/add-project">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Project
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 3).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex-shrink-0 relative overflow-hidden">
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
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {project.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {project.views}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {project.likes}
                              </span>
                              <span>
                                {new Date(project.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <Link to={`/dashboard/projects/${project.id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Activity Feed */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            
            {projects.length === 0 ? (
              <Card className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  No Activity Yet
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create your first project to see activity here.
                </p>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${activity.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;