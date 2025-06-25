import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  DollarSign, 
  Globe,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import Card from '../components/UI/Card';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalProjects: 0,
    newWins: 0,
    trialWinRate: 0,
    newMRR: 0,
    viewsByCountry: [],
    mrrByMonth: [],
    pageViews: [],
    projectPerformance: []
  });

  useEffect(() => {
    // Load analytics data from localStorage
    const projects = JSON.parse(localStorage.getItem('proofmint_projects') || '[]');
    const userProjects = projects.filter((p: any) => p.userId === user?.id);
    
    // Calculate analytics
    const totalViews = userProjects.reduce((sum: number, p: any) => sum + p.views, 0);
    const totalLikes = userProjects.reduce((sum: number, p: any) => sum + p.likes, 0);
    const totalProjects = userProjects.length;
    
    // Mock additional analytics data
    setAnalyticsData({
      totalViews,
      totalLikes,
      totalProjects,
      newWins: Math.floor(totalViews * 0.1),
      trialWinRate: totalProjects > 0 ? Math.floor((totalLikes / totalViews) * 100) : 0,
      newMRR: Math.floor(totalViews * 0.05),
      viewsByCountry: [
        { country: 'United States', views: Math.floor(totalViews * 0.4), percentage: 40 },
        { country: 'United Kingdom', views: Math.floor(totalViews * 0.2), percentage: 20 },
        { country: 'Canada', views: Math.floor(totalViews * 0.15), percentage: 15 },
        { country: 'Germany', views: Math.floor(totalViews * 0.1), percentage: 10 },
        { country: 'France', views: Math.floor(totalViews * 0.08), percentage: 8 },
        { country: 'Others', views: Math.floor(totalViews * 0.07), percentage: 7 }
      ],
      mrrByMonth: [
        { month: 'Jan', amount: 1200 },
        { month: 'Feb', amount: 1450 },
        { month: 'Mar', amount: 1680 },
        { month: 'Apr', amount: 1920 },
        { month: 'May', amount: 2150 },
        { month: 'Jun', amount: 2380 }
      ],
      pageViews: userProjects.map((p: any) => ({
        name: p.title,
        views: p.views,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      })),
      projectPerformance: userProjects.map((p: any, index: number) => ({
        name: p.title,
        views: p.views,
        likes: p.likes,
        date: new Date(p.createdAt).toLocaleDateString()
      }))
    });
  }, [user]);

  const stats = [
    {
      title: 'New Wins',
      value: analyticsData.newWins,
      change: '+12%',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Trial-Win Rate',
      value: `${analyticsData.trialWinRate}%`,
      change: '+5%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'New MRR',
      value: `$${analyticsData.newMRR}`,
      change: '+18%',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Page Views',
      value: analyticsData.totalViews,
      change: '+25%',
      icon: Eye,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const pageViewsData = {
    labels: analyticsData.pageViews.map(p => p.name),
    datasets: [
      {
        data: analyticsData.pageViews.map(p => p.views),
        backgroundColor: analyticsData.pageViews.map(p => p.color),
        borderWidth: 0,
      }
    ]
  };

  const mrrData = {
    labels: analyticsData.mrrByMonth.map(m => m.month),
    datasets: [
      {
        label: 'MRR',
        data: analyticsData.mrrByMonth.map(m => m.amount),
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your project performance and audience engagement.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-500 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Page Views Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Page Views Distribution
              </h3>
              <PieChart className="w-5 h-5 text-gray-500" />
            </div>
            <div className="h-64">
              {analyticsData.pageViews.length > 0 ? (
                <Doughnut data={pageViewsData} options={{ ...chartOptions, cutout: '60%' }} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* MRR by Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                MRR by Month
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="h-64">
              <Bar data={mrrData} options={chartOptions} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Views by Country */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Views by Country
            </h3>
            <Globe className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {analyticsData.viewsByCountry.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {country.country.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {country.country}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {country.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Project Performance Table */}
      {analyticsData.projectPerformance.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Project Performance
              </h3>
              <Activity className="w-5 h-5 text-gray-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Project
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Views
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Likes
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.projectPerformance.map((project, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                        {project.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {project.views}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {project.likes}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {project.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;