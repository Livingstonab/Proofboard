import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  Plus, 
  Compass, 
  FileText, 
  Crown, 
  BarChart3, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/dashboard/projects', icon: FolderOpen, label: 'My Projects' },
    { path: '/dashboard/add-project', icon: Plus, label: 'Add Project' },
    { path: '/dashboard/explore', icon: Compass, label: 'Explore' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' },
    { path: '/dashboard/resume', icon: FileText, label: 'Resume' },
    { path: '/dashboard/premium', icon: Crown, label: 'Premium' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border-r border-white/20 dark:border-gray-700/20 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ProofMint
          </span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all duration-200 mt-8 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;