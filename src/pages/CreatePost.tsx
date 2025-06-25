import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Send, 
  Globe, 
  Users, 
  Lock,
  Upload,
  X,
  Smile,
  AtSign,
  Hash
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { uploadToIPFS } from '../lib/api';

interface Post {
  id: string;
  userId: string;
  content: string;
  mediaUrls: string[];
  mediaTypes: string[];
  visibility: 'public' | 'followers' | 'private';
  tags: string[];
  mentions: string[];
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [currentMention, setCurrentMention] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
    maxFiles: 5,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addMention = () => {
    if (currentMention.trim() && !mentions.includes(currentMention.trim())) {
      setMentions([...mentions, currentMention.trim()]);
      setCurrentMention('');
    }
  };

  const removeMention = (mention: string) => {
    setMentions(mentions.filter(m => m !== mention));
  };

  const handlePost = async () => {
    if (!user) {
      toast.error('Please log in to create a post');
      return;
    }

    if (!content.trim() && files.length === 0) {
      toast.error('Please add some content or media to your post');
      return;
    }

    setIsPosting(true);

    try {
      // Upload media files to IPFS
      const mediaUrls: string[] = [];
      const mediaTypes: string[] = [];

      for (const file of files) {
        const url = await uploadToIPFS(file);
        mediaUrls.push(url);
        mediaTypes.push(file.type);
      }

      // Create new post
      const newPost: Post = {
        id: Date.now().toString(),
        userId: user.id,
        content: content.trim(),
        mediaUrls,
        mediaTypes,
        visibility,
        tags,
        mentions,
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage with CORRECT key
      const existingPosts = JSON.parse(localStorage.getItem('proofboard_posts') || '[]');
      const updatedPosts = [newPost, ...existingPosts];
      localStorage.setItem('proofboard_posts', JSON.stringify(updatedPosts));

      // Update user's post count
      const userPosts = JSON.parse(localStorage.getItem(`proofboard_user_posts_${user.id}`) || '[]');
      localStorage.setItem(`proofboard_user_posts_${user.id}`, JSON.stringify([newPost.id, ...userPosts]));

      // Update analytics
      const analytics = JSON.parse(localStorage.getItem('proofboard_analytics') || '{}');
      const updatedAnalytics = {
        ...analytics,
        totalPosts: (analytics.totalPosts || 0) + 1,
        recentActivity: [
          {
            type: 'post_created',
            message: `Created a new post`,
            timestamp: new Date().toISOString()
          },
          ...(analytics.recentActivity || []).slice(0, 9)
        ]
      };
      localStorage.setItem('proofboard_analytics', JSON.stringify(updatedAnalytics));

      toast.success('Post created successfully!');
      navigate('/dashboard/explore');

    } catch (error) {
      console.error('Post creation error:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'followers':
        return <Users className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
    }
  };

  const getVisibilityLabel = () => {
    switch (visibility) {
      case 'public':
        return 'Public - Anyone can see this post';
      case 'followers':
        return 'Followers - Only your followers can see this post';
      case 'private':
        return 'Private - Only you can see this post';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          disabled={isPosting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Share your thoughts, updates, or showcase your work with the community.
        </p>
      </div>

      <Card className="p-6">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              @{user?.username}
            </p>
          </div>
        </div>

        {/* Content Input */}
        <div className="mb-6">
          <textarea
            className="w-full px-4 py-3 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {content.length}/500 characters
            </span>
            <Button size="sm" variant="ghost">
              <Smile className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Media Upload */}
        <div className="mb-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            {isDragActive ? (
              <p className="text-purple-600 dark:text-purple-400">Drop media here...</p>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Add photos or videos
                </p>
                <p className="text-sm text-gray-500">
                  Drag & drop or click to select (max 5 files, 100MB each)
                </p>
              </div>
            )}
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="w-3 h-3" />
                    ) : (
                      <Video className="w-3 h-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex items-center space-x-2 mb-2">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Add a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="pl-10"
              />
            </div>
            <Button onClick={addTag} size="sm" disabled={!currentTag.trim()}>
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mentions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mentions
          </label>
          <div className="flex items-center space-x-2 mb-2">
            <div className="relative flex-1">
              <AtSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Mention a user"
                value={currentMention}
                onChange={(e) => setCurrentMention(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMention()}
                className="pl-10"
              />
            </div>
            <Button onClick={addMention} size="sm" disabled={!currentMention.trim()}>
              Add
            </Button>
          </div>
          {mentions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mentions.map((mention) => (
                <span
                  key={mention}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                >
                  @{mention}
                  <button
                    onClick={() => removeMention(mention)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Visibility */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Who can see this post?
          </label>
          <div className="space-y-2">
            {(['public', 'followers', 'private'] as const).map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={visibility === option}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <div className="flex items-center space-x-2">
                  {option === 'public' && <Globe className="w-4 h-4 text-gray-500" />}
                  {option === 'followers' && <Users className="w-4 h-4 text-gray-500" />}
                  {option === 'private' && <Lock className="w-4 h-4 text-gray-500" />}
                  <span className="text-gray-700 dark:text-gray-300 capitalize">
                    {option}
                  </span>
                </div>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {getVisibilityLabel()}
          </p>
        </div>

        {/* Post Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {getVisibilityIcon()}
            <span>{visibility}</span>
          </div>
          <Button
            onClick={handlePost}
            isLoading={isPosting}
            disabled={(!content.trim() && files.length === 0) || isPosting}
          >
            <Send className="w-4 h-4 mr-2" />
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreatePost;