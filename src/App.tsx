import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import AddProject from './pages/AddProject';
import Analytics from './pages/Analytics';
import Resume from './pages/Resume';
import Premium from './pages/Premium';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Explore from './pages/Explore';

// Onboarding Components
import OnboardingModal from './components/Onboarding/OnboardingModal';
import WelcomeModal from './components/Onboarding/WelcomeModal';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Dashboard Layout Component
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(false);
  const [onboardingData, setOnboardingData] = React.useState(null);

  React.useEffect(() => {
    if (user) {
      // Check if user has completed onboarding
      const savedOnboarding = localStorage.getItem('proofmint_onboarding');
      const hasCompletedOnboarding = savedOnboarding && JSON.parse(savedOnboarding).userId === user.id;
      
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  const handleOnboardingComplete = (data: any) => {
    setOnboardingData(data);
    setShowOnboarding(false);
    setShowWelcome(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 min-h-screen">
        {children}
      </main>

      {/* Onboarding Modals */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
      
      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleWelcomeComplete}
        onboardingData={onboardingData}
      />
    </div>
  );
};

// Public Project View (for shared links)
const PublicProjectView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <ProjectDetails isPublicView={true} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Public Project View (for shared links) */}
              <Route path="/project/:id" element={<PublicProjectView />} />
              
              {/* Public Profile View */}
              <Route path="/profile/:username" element={<Profile />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard/projects"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Projects />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard/projects/:id"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ProjectDetails />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard/add-project"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AddProject />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard/analytics"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Analytics />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard/resume"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Resume />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard/premium"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Premium />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Profile />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard/explore"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Explore />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;