import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Search, 
  User, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  Smile,
  ArrowLeft,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  mediaUrl?: string;
}

interface ChatUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  lastSeen: string;
  online: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadChatData();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatData = () => {
    try {
      // Load mock users
      const mockUsers: ChatUser[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          username: 'alexj',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          lastSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          online: true
        },
        {
          id: '2',
          name: 'Sarah Chen',
          username: 'sarahc',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
          lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          online: false
        },
        {
          id: '3',
          name: 'Mike Rodriguez',
          username: 'miker',
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
          lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          online: false
        }
      ];
      setUsers(mockUsers);

      // Load conversations from localStorage with CORRECT key
      const savedConversations = JSON.parse(localStorage.getItem(`proofboard_conversations_${user?.id}`) || '[]');
      if (savedConversations.length === 0) {
        // Create mock conversations
        const mockConversations: Conversation[] = [
          {
            id: '1',
            participants: [user?.id || '', '1'],
            unreadCount: 2
          },
          {
            id: '2',
            participants: [user?.id || '', '2'],
            unreadCount: 0
          }
        ];
        setConversations(mockConversations);
        localStorage.setItem(`proofboard_conversations_${user?.id}`, JSON.stringify(mockConversations));
      } else {
        setConversations(savedConversations);
      }

      // Load messages from localStorage with CORRECT key
      const savedMessages = JSON.parse(localStorage.getItem(`proofboard_messages_${user?.id}`) || '[]');
      if (savedMessages.length === 0) {
        // Create mock messages
        const mockMessages: Message[] = [
          {
            id: '1',
            senderId: '1',
            receiverId: user?.id || '',
            content: 'Hey! I saw your portfolio project. Really impressive work!',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            read: false,
            type: 'text'
          },
          {
            id: '2',
            senderId: user?.id || '',
            receiverId: '1',
            content: 'Thank you! I appreciate the feedback. Are you working on anything similar?',
            timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            read: true,
            type: 'text'
          },
          {
            id: '3',
            senderId: '1',
            receiverId: user?.id || '',
            content: 'Yes, I\'m building a similar project but with a different tech stack. Would love to collaborate!',
            timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
            read: false,
            type: 'text'
          },
          {
            id: '4',
            senderId: '2',
            receiverId: user?.id || '',
            content: 'Hi! I loved your design portfolio. The UI/UX work is fantastic!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            read: true,
            type: 'text'
          }
        ];
        setMessages(mockMessages);
        localStorage.setItem(`proofboard_messages_${user?.id}`, JSON.stringify(mockMessages));
      } else {
        setMessages(savedMessages);
      }
    } catch (error) {
      console.error('Failed to load chat data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageType: 'text' | 'image' = 'text', mediaFile?: File) => {
    if ((!newMessage.trim() && !mediaFile) || !selectedConversation || !user) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    const receiverId = conversation.participants.find(p => p !== user.id);
    if (!receiverId) return;

    let mediaUrl = '';
    if (mediaFile) {
      // Simulate file upload
      mediaUrl = URL.createObjectURL(mediaFile);
    }

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: receiverId,
      content: messageType === 'text' ? newMessage.trim() : `Shared ${messageType}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: messageType,
      mediaUrl
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`proofboard_messages_${user.id}`, JSON.stringify(updatedMessages));

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: receiverId,
        receiverId: user.id,
        content: getRandomReply(),
        timestamp: new Date().toISOString(),
        read: false,
        type: 'text'
      };

      const newMessages = [...updatedMessages, replyMessage];
      setMessages(newMessages);
      localStorage.setItem(`proofboard_messages_${user.id}`, JSON.stringify(newMessages));
      toast.success('New message received!');
    }, 2000);

    setNewMessage('');
    toast.success('Message sent!');
  };

  const getRandomReply = () => {
    const replies = [
      "That's awesome! Thanks for sharing.",
      "Great work! I'd love to learn more about this.",
      "Impressive! How did you implement that feature?",
      "Nice! This gives me some ideas for my own project.",
      "Thanks for the update! Looking forward to seeing more.",
      "Excellent work! The design looks really clean.",
      "This is exactly what I was looking for. Thank you!",
      "Amazing! How long did this take to build?"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        sendMessage('image', file);
      } else {
        sendMessage('file', file);
      }
    }
  };

  const getConversationMessages = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return [];

    return messages.filter(m => 
      conversation.participants.includes(m.senderId) && 
      conversation.participants.includes(m.receiverId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getConversationUser = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation || !user) return null;

    const otherUserId = conversation.participants.find(p => p !== user.id);
    return users.find(u => u.id === otherUserId) || null;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const otherUser = getConversationUser(conversation.id);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           otherUser?.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedConversationMessages = selectedConversation ? getConversationMessages(selectedConversation) : [];
  const selectedUser = selectedConversation ? getConversationUser(selectedConversation) : null;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 animate-pulse"></div>
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Messages
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect and collaborate with other creators in the community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Conversations List */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-white/20 dark:border-gray-700/20">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-full">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  No conversations yet
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start a conversation with other creators
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredConversations.map((conversation) => {
                  const otherUser = getConversationUser(conversation.id);
                  const lastMessage = getConversationMessages(conversation.id).slice(-1)[0];
                  
                  if (!otherUser) return null;

                  return (
                    <motion.button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        selectedConversation === conversation.id
                          ? 'bg-purple-500/20 border border-purple-500/30'
                          : 'hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.name}
                            className="w-12 h-12 rounded-full"
                          />
                          {otherUser.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {otherUser.name}
                            </h4>
                            {lastMessage && (
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {lastMessage ? lastMessage.content : 'No messages yet'}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col">
          {selectedConversation && selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-white/20 dark:border-gray-700/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {selectedUser.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedUser.online ? 'Online' : `Last seen ${getTimeAgo(selectedUser.lastSeen)}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedConversationMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      No messages yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start the conversation by sending a message
                    </p>
                  </div>
                ) : (
                  selectedConversationMessages.map((message) => {
                    const isOwn = message.senderId === user?.id;
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-white/10 text-gray-900 dark:text-white'
                        }`}>
                          {message.type === 'image' && message.mediaUrl && (
                            <img
                              src={message.mediaUrl}
                              alt="Shared image"
                              className="w-full h-auto rounded mb-2 max-w-xs"
                            />
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwn ? 'text-purple-100' : 'text-gray-500'
                          }`}>
                            {getTimeAgo(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-white/20 dark:border-gray-700/20">
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    className="hidden"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="pr-10"
                    />
                    <Button size="sm" variant="ghost" className="absolute right-2 top-1">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={() => sendMessage()} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;