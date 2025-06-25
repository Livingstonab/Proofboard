export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  username: string;
  isPremium: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  thumbnail?: string;
  videoUrl?: string;
  fileUrl?: string;
  nftId?: string;
  algorandTxId?: string;
  translations?: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
  isPublic: boolean;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalProjects: number;
  totalViews: number;
  totalLikes: number;
  viewsOverTime: { date: string; views: number }[];
  projectTypes: { type: string; count: number }[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}