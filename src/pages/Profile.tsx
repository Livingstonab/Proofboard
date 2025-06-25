import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter,
  Edit,
  Share2,
  Download,
  Eye,
  Heart,
  Shield,
  Video,
  ExternalLink,
  Camera,
  Save,
  UserPlus,
  UserCheck,
  Settings,
  Crown,
  Star,
  Calendar,
  Award,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import toast from 'react-hot-toast';
import { Project } from '../types';

interface ProfileData {
  fullName: string;
  bio: string;
  profilePicture: string;
  techCategory: string;
  skillLevel: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
  contactPreference: 'whatsapp' | 'email';
  whatsapp: string;
  email: string;
  otherProjects: Array<{
    id: string;
    title: string;
    url: string;
    description: string;
  }>;
  otherInfo: string;
  isPublic: boolean;
  followers: number;
  following: number;
}

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: user?.name || '',
    bio: '',
    profilePicture: user?.avatar || '',
    techCategory: '',
    skillLevel: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      website: ''
    },
    contactPreference: 'email',
    whatsapp: '',
    email: user?.email || '',
    otherProjects: [],
    otherInfo: '',
    isPublic: true,
    followers: 0,
    following: 0
  });

  const isOwnProfile = !username || username === user?.username;

  useEffect(() => {
    // Load profile data
    const savedProfile = localStorage.getItem(`proofboard_profile_${user?.id}`);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfileData({ ...profileData, ...parsed });
      } catch (error) {
        console.error('Failed to parse profile data:', error);
      }
    }

    // Load user's projects
    const savedProjects = localStorage.getItem('proofboard_projects');
    if (savedProjects && user) {
      try {
        const allProjects = JSON.parse(savedProjects);
        const userProjects = allProjects.filter((p: Project) => p.userId === user.id && p.isPublic);
        setProjects(userProjects);
      } catch (error) {
        console.error('Failed to parse projects:', error);
      }
    }

    // Load user's posts
    const savedPosts = localStorage.getItem('proofboard_posts');
    if (savedPosts && user) {
      try {
        const allPosts = JSON.parse(savedPosts);
        const userPosts = allPosts.filter((p: any) => p.userId === user.id && p.visibility === 'public');
        setPosts(userPosts);
      } catch (error) {
        console.error('Failed to parse posts:', error);
      }
    }
  }, [user]);

  const handleSaveProfile = () => {
    localStorage.setItem(`proofboard_profile_${user?.id}`, JSON.stringify(profileData));
    toast.success('Profile saved successfully!');
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileData({ ...profileData, profilePicture: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setProfileData({
      ...profileData,
      followers: isFollowing ? profileData.followers - 1 : profileData.followers + 1
    });
    toast.success(isFollowing ? 'Unfollowed user' : 'Following user!');
  };

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user?.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile link copied to clipboard!');
  };

  const addOtherProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: '',
      url: '',
      description: ''
    };
    setProfileData({
      ...profileData,
      otherProjects: [...profileData.otherProjects, newProject]
    });
  };

  const removeOtherProject = (id: string) => {
    setProfileData({
      ...profileData,
      otherProjects: profileData.otherProjects.filter(p => p.id !== id)
    });
  };

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

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isOwnProfile ? 'My Profile' : `${profileData.fullName}'s Profile`}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isOwnProfile ? 'Manage your professional profile and portfolio' : 'Professional portfolio and projects'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {isOwnProfile ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  <Button onClick={shareProfile}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={isFollowing ? "outline" : "primary"}
                    onClick={handleFollow}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={shareProfile}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                      {profileData.profilePicture ? (
                        <img
                          src={profileData.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <User className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors">
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Basic Info */}
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        className="w-full px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {profileData.fullName || 'Your Name'}
                    </h2>
                    <p className="text-purple-600 dark:text-purple-400 mb-4">
                      @{user?.username}
                    </p>
                    {profileData.bio && (
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {profileData.bio}
                      </p>
                    )}
                  </>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {projects.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {posts.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData.followers}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact & Social */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact & Social
              </h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />

                  <Input
                    label="WhatsApp"
                    value={profileData.whatsapp}
                    onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                    placeholder="+1234567890"
                  />

                  <Input
                    label="GitHub"
                    value={profileData.socialLinks.github}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, github: e.target.value }
                    })}
                    placeholder="https://github.com/username"
                  />

                  <Input
                    label="LinkedIn"
                    value={profileData.socialLinks.linkedin}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/in/username"
                  />

                  <Input
                    label="Website"
                    value={profileData.socialLinks.website}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, website: e.target.value }
                    })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {profileData.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a href={`mailto:${profileData.email}`} className="text-purple-600 hover:text-purple-700">
                        {profileData.email}
                      </a>
                    </div>
                  )}
                  
                  {profileData.whatsapp && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <a href={`https://wa.me/${profileData.whatsapp}`} className="text-green-600 hover:text-green-700">
                        {profileData.whatsapp}
                      </a>
                    </div>
                  )}

                  {profileData.socialLinks.github && (
                    <div className="flex items-center space-x-3">
                      <Github className="w-5 h-5 text-gray-400" />
                      <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                        GitHub
                      </a>
                    </div>
                  )}

                  {profileData.socialLinks.linkedin && (
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-gray-400" />
                      <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                        LinkedIn
                      </a>
                    </div>
                  )}

                  {profileData.socialLinks.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <a href={profileData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                        Website
                      </a>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {isEditing && (
              <Button onClick={handleSaveProfile} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            )}
          </div>

          {/* Right Column - Projects & Posts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Projects */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Projects ({projects.length})
                </h3>
                {isOwnProfile && (
                  <Link to="/dashboard/add-project">
                    <Button size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </Link>
                )}
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No projects yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {isOwnProfile ? 'Start building your portfolio by adding your first project.' : 'This user hasn\'t added any projects yet.'}
                  </p>
                  {isOwnProfile && (
                    <Link to="/dashboard/add-project">
                      <Button>
                        <Video className="w-4 h-4 mr-2" />
                        Add Your First Project
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 relative">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Video className="w-12 h-12 text-purple-500" />
                          </div>
                        )}
                        
                        {project.nftId && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-green-500/20 backdrop-blur-sm text-green-400 text-xs rounded-full flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {project.title}
                        </h4>
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
                          <span>
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <Link to={`/project/${project.id}`}>
                          <Button size="sm" variant="outline" className="w-full">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Project
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>

            {/* Posts */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Posts ({posts.length})
                </h3>
                {isOwnProfile && (
                  <Link to="/dashboard/create-post">
                    <Button size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </Link>
                )}
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No posts yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {isOwnProfile ? 'Share your thoughts and updates with the community.' : 'This user hasn\'t posted anything yet.'}
                  </p>
                  {isOwnProfile && (
                    <Link to="/dashboard/create-post">
                      <Button>
                        <Edit className="w-4 h-4 mr-2" />
                        Create Your First Post
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <p className="text-gray-900 dark:text-white mb-2">{post.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </span>
                        </div>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Resume Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Resume
                </h3>
                {isOwnProfile && (
                  <Link to="/dashboard/resume">
                    <Button size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      {user?.isPremium ? 'Manage Resume' : 'Upgrade for Resume'}
                    </Button>
                  </Link>
                )}
              </div>

              {user?.isPremium ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        Professional Resume Available
                      </h4>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Your resume is ready for download and sharing.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 text-center">
                  <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                    Premium Feature
                  </h4>
                  <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
                    Upgrade to Premium to create and share professional resumes.
                  </p>
                  <Link to="/dashboard/premium">
                    <Button size="sm">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;