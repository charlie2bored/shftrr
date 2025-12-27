"use client";

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, LogOut, User, MessageSquare, Settings, Briefcase, Target, TrendingUp, Loader2 } from 'lucide-react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useGeminiChat, type GeminiChatRequest, type GeminiChatResponse } from '@/lib/use-gemini-chat';
import { TypingIndicator, SkeletonMessage } from '@/components/Skeleton';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { SuspenseWrapper } from '@/components/SuspenseWrapper';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { JobApplicationTracker } from '@/components/job-tracker/JobApplicationTracker';
import { useToast } from '@/lib/toast-context';
import { buttonHover, inputFocus, cardHover, fadeInUp } from '@/lib/animations';
import dynamic from 'next/dynamic';

// Dynamic import for SettingsModal to reduce bundle size
const SettingsModal = dynamic(() => import('./components/SettingsModal'), {
  loading: () => null, // No loading state needed for modal
});

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  toolCalls?: any[];
  toolResults?: any[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export default function ShftrrDashboard() {
  const { data: session, status } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [ventText, setVentText] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [currentTab, setCurrentTab] = useState<'chat' | 'jobs' | 'goals'>('chat');
  const tabs = ['chat', 'jobs', 'goals'] as const;
  const router = useRouter();

  // Get current chat session
  const currentChat = chatSessions.find(session => session.id === currentChatId);
  const chatMessages = currentChat?.messages || [];
  const { sendMessage, isLoading, error } = useGeminiChat(undefined, () => {
    setShowUpgradePrompt(true);
  });
  const { success, error: showError } = useToast();

  // Chat session management functions
  const createNewChat = (): string => {
    const newChatId = Date.now().toString();
    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    return newChatId;
  };

  const switchToChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const deleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== chatId));
    if (currentChatId === chatId) {
      // If we're deleting the current chat, switch to the first available chat or create a new one
      const remainingChats = chatSessions.filter(session => session.id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const updateChatTitle = (chatId: string, title: string) => {
    setChatSessions(prev => prev.map(session =>
      session.id === chatId
        ? { ...session, title, updatedAt: new Date() }
        : session
    ));
  };

  const generateChatTitle = (messages: ChatMessage[]): string => {
    if (messages.length === 0) return 'New Chat';

    // Use the first user message as the title, truncated to 30 characters
    const firstUserMessage = messages.find(msg => msg.isUser);
    if (firstUserMessage) {
      return firstUserMessage.text.length > 30
        ? firstUserMessage.text.substring(0, 30) + '...'
        : firstUserMessage.text;
    }

    return 'New Chat';
  };

  const updateCurrentChatMessages = (messages: ChatMessage[]) => {
    if (!currentChatId) return;

    setChatSessions(prev => prev.map(session =>
      session.id === currentChatId
        ? {
            ...session,
            messages,
            title: generateChatTitle(messages),
            updatedAt: new Date()
          }
        : session
    ));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load chat sessions from localStorage on component mount
  useEffect(() => {
    if (isClient) {
      try {
        const savedSessions = localStorage.getItem('shftrr-chat-sessions');
        if (savedSessions) {
          const parsedSessions = JSON.parse(savedSessions);
          // Convert timestamp strings back to Date objects
          const sessionsWithDates = parsedSessions.map((session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          setChatSessions(sessionsWithDates);

          // Set current chat to the most recently updated one
          if (sessionsWithDates.length > 0) {
            const mostRecent = sessionsWithDates.reduce((prev: ChatSession, current: ChatSession) =>
              prev.updatedAt > current.updatedAt ? prev : current
            );
            setCurrentChatId(mostRecent.id);
          }
        } else {
          // Create initial chat session if none exist
          createNewChat();
        }
      } catch (error) {
        console.error('Error loading chat sessions from localStorage:', error);
        // Create initial chat session on error
        createNewChat();
      }
    }
  }, [isClient]);

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (isClient && chatSessions.length > 0) {
      try {
        localStorage.setItem('shftrr-chat-sessions', JSON.stringify(chatSessions));
      } catch (error) {
        console.error('Error saving chat sessions to localStorage:', error);
      }
    }
  }, [chatSessions, isClient]);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show sign-in prompt for unauthenticated users
  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-300 via-cyan-400 to-teal-600 bg-clip-text text-transparent">
              shftrr.
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your AI career coach awaits
          </p>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Sign in to start your personalized career coaching journey with AI-powered guidance and strategic planning.
          </p>
          <div className="space-y-4">
            <a
              href="/auth/signin"
              className="inline-block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="inline-block w-full px-6 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-lg transition-colors duration-200"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check onboarding status for authenticated users
  useEffect(() => {
    if (session?.user && isClient) {
      checkOnboardingStatus();
    }
  }, [session, isClient]);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/onboarding');
      const data = await response.json();

      setOnboardingCompleted(data.completed || false);

      // Redirect to onboarding if not completed
      if (!data.completed) {
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      // Default to completed to avoid blocking the user
      setOnboardingCompleted(true);
    }
  };

  // Show loading while checking onboarding status
  if (session && onboardingCompleted === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Setting up your personalized experience...</p>
        </div>
      </div>
    );
  }

  const handleNewChat = () => {
    // Create a new chat session
    createNewChat();
    setVentText('');
    setInputValue('');
    setShowTyping(false);
    setShowUpgradePrompt(false);
    // Show success toast
    success("New chat started", "Ready for a fresh conversation!");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && !isLoading) {
      const userInput = inputValue.trim();

      // Add user message to current chat
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: userInput,
        isUser: true,
        timestamp: new Date(),
      };
      updateCurrentChatMessages([...chatMessages, userMessage]);
      setVentText(userInput);

      // Prepare conversation history for Gemini
      const conversationMessages = chatMessages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      // Add current user message
      conversationMessages.push({
        role: 'user',
        content: userInput
      });

      // Send to Gemini
      const chatRequest: GeminiChatRequest = {
        messages: conversationMessages,
        resumeText: resumeText,
        ventText: userInput,
        temperature: 0.7,
      };

      setInputValue('');
      setShowTyping(true);

      // Show success toast for message sent
      success("Message sent", "AI is analyzing your career question...");

      // Add AI placeholder message
      const aiMessageId = `ai-${Date.now()}`;
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        text: '',
        isUser: false,
        timestamp: new Date(),
      };
      updateCurrentChatMessages([...chatMessages, aiMessage]);

      // Send request and handle response
      sendMessage(
        chatRequest,
        (chunk) => {
          // Update AI message with response
          const updatedMessages = chatMessages.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, text: chunk }
                : msg
          );
          updateCurrentChatMessages(updatedMessages);
        },
        (fullResponse: GeminiChatResponse) => {
          setShowTyping(false);

          console.log('Received response:', fullResponse.response);
          console.log('Response length:', fullResponse.response?.length);

          // Update the AI message with response
          let finalText = fullResponse.response;

          // Optional debug logging (only in development)
          if (process.env.NODE_ENV === 'development') {
            if (fullResponse.toolCalls && fullResponse.toolCalls.length > 0) {
              console.log('🔧 Tools used:', fullResponse.toolCalls.length);
            }
            if (fullResponse.toolResults && fullResponse.toolResults.length > 0) {
              console.log('📊 Tool results:', fullResponse.toolResults.length);
            }
          }

          const finalMessages = chatMessages.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, text: finalText, toolCalls: fullResponse.toolCalls, toolResults: fullResponse.toolResults }
                : msg
          );
          updateCurrentChatMessages(finalMessages);

          // Response processed successfully

              console.log('Gemini Response complete:', fullResponse);
        }
      ).catch((err) => {
        setShowTyping(false);
        console.error('Chat error details:', err);

        // Provide more specific error messages
        let errorMessage = "Failed to get response";
        let errorDescription = "Please check your connection and try again.";

        if (err.message?.includes('500')) {
          errorMessage = "Server error";
          errorDescription = "The AI service is temporarily unavailable. Please try again in a moment.";
        } else if (err.message?.includes('429') || err.message?.includes('quota')) {
          errorMessage = "Rate limit exceeded";
          errorDescription = "Too many requests. Please wait a moment before trying again.";
        } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
          errorMessage = "Connection error";
          errorDescription = "Please check your internet connection and try again.";
        }

        showError(errorMessage, errorDescription);
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar - 250px width, dark theme */}
        <aside className="w-[250px] bg-black text-white flex flex-col border-r border-gray-600" aria-label="Chat navigation">
          {/* Header - New Chat Button */}
          <div className="p-6 border-b border-gray-600">
            <button
              onClick={handleNewChat}
              className={`flex items-center gap-3 w-full text-left focus:outline-none rounded-lg p-2 -m-2 ${buttonHover}`}
              aria-label="Create new chat"
            >
              <span className="text-white text-sm font-normal">new chat</span>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Plus className="w-3.5 h-3.5 text-gray-900" />
              </div>
            </button>
          </div>

          {/* Chat History - Takes up available space */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Chat history">
            <div className="space-y-1">
              {chatSessions.map((session) => (
                <div key={session.id} className="relative group">
                  <button
                    onClick={() => switchToChat(session.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                      session.id === currentChatId
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-60" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-normal">
                          {session.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {session.messages.length > 0 ? `${session.messages.length} messages` : 'Empty chat'}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Delete button - appears on hover */}
                  {chatSessions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(session.id);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded hover:bg-red-600 flex items-center justify-center transition-opacity"
                      aria-label="Delete chat"
                    >
                      <span className="text-xs text-gray-400 hover:text-white">×</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* User Info and Actions - Fixed at bottom */}
          <div className="border-t border-gray-600 p-4">
            {/* Settings Button */}
            {session?.user && (
              <button
                onClick={() => setShowSettings(true)}
                className={`flex items-center gap-2 w-full mb-3 px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 ${buttonHover}`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            )}

            {/* Test User Button - Development Only */}
            {process.env.NODE_ENV === 'development' && !session?.user && (
              <button
                onClick={async () => {
                  try {
                    await signIn('credentials', {
                      email: 'test@example.com',
                      password: 'password123',
                      redirect: false,
                    });
                    success('Signed in as test user', 'Welcome back!');
                  } catch (error) {
                    showError('Sign in failed', 'Could not sign in as test user');
                  }
                }}
                className={`flex items-center gap-2 w-full mb-3 px-3 py-2 text-left text-sm text-orange-400 hover:text-orange-300 hover:bg-gray-800 rounded-lg transition-colors duration-200 ${buttonHover}`}
              >
                <User className="w-4 h-4" />
                Test User (Dev)
              </button>
            )}

          {session?.user && (
              <>
                {/* User Profile */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 border border-gray-700 mb-3">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>

                {/* Sign Out Button */}
              <button
                onClick={() => signOut()}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 ${buttonHover}`}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
              </>
          )}

          {!session && (
              <a
                href="/auth/signin"
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                Sign in
              </a>
            )}
            </div>
        </aside>

        {/* Main Center Content */}
        <main className="flex-1 bg-black flex flex-col" role="main">
          {/* Tab Navigation */}
          <div className="border-b border-gray-700 px-12">
            <nav className="flex space-x-8">
              {[
                { id: 'chat' as const, label: 'Career Chat', icon: MessageSquare },
                { id: 'jobs' as const, label: 'Job Tracker', icon: Briefcase },
                { id: 'goals' as const, label: 'Goals & Plans', icon: Target },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentTab(id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                    currentTab === id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col px-12 py-8 max-w-6xl mx-auto w-full">
            {/* Chat Tab */}
            {currentTab === 'chat' && (
              <>
                {/* Hero Section - Only shown when no messages */}
                {chatMessages.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                    <div className="text-center space-y-6">
                      <p className="text-white text-2xl font-normal leading-relaxed">welcome to</p>
                      <h1 className="text-7xl md:text-8xl font-bold leading-tight">
                        <span className="bg-gradient-to-r from-blue-300 via-cyan-400 to-teal-600 bg-clip-text text-transparent">
                          shftrr.
                        </span>
                      </h1>
                    </div>
                    <div className="w-full max-w-xs h-px bg-gray-600 opacity-30"></div>
                  </div>
                )}

                {/* Chat History */}
                {chatMessages.length > 0 && (
              <SuspenseWrapper
                fallback={
                  <div className="flex-1 overflow-y-auto space-y-12 py-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonMessage key={i} isUser={i % 2 === 0} />
                    ))}
                  </div>
                }
              >
                <div className="flex-1 overflow-y-auto space-y-12 py-8">
                  {chatMessages.map((message, index) => (
                    <div key={message.id} className={`${fadeInUp} flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
                      <div className={`p-6 rounded-2xl transition-all duration-200 ${
                        message.isUser
                          ? 'bg-blue-600/20 border border-blue-500/30 max-w-[80%] ml-auto text-white'
                          : 'bg-gray-900/50 border border-gray-800 max-w-[90%] mr-auto'
                      }`}>
                        {message.isUser ? (
                          <p className="text-white text-[14px] font-normal leading-relaxed">{message.text}</p>
                        ) : (
                          <div className="shftrr-response max-w-none">
                            <MarkdownRenderer content={message.text} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {showTyping && (
                    <div className="flex items-start">
                      <TypingIndicator />
                    </div>
                  )}
                </div>
              </SuspenseWrapper>
            )}

                {/* Input Field Area - Only show for chat tab */}
                {currentTab === 'chat' && (
                  <div className="mt-auto py-8">
              <div className="relative max-w-2xl mx-auto w-full">
                <label htmlFor="main-input" className="sr-only">
                  Start your conversation
                </label>
                <input
                  id="main-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLoading ? "AI is thinking..." : "Start here..."}
                  disabled={isLoading}
                  className={`w-full px-6 py-4 text-base rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${inputFocus}`}
                  aria-label="Start your conversation"
                  aria-describedby="input-help"
                  aria-invalid={error ? "true" : "false"}
                  role="textbox"
                  aria-multiline="false"
                />
                <div id="input-help" className="sr-only">
                  Press Enter to send your message to the AI career coach
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>
                )}

                {/* Job Tracker Tab */}
                {currentTab === ('jobs' as typeof currentTab) && (
                  <div className="flex-1">
                    <JobApplicationTracker />
                  </div>
                )}

                {/* Goals & Plans Tab */}
                {currentTab === ('goals' as typeof currentTab) && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Goals & Career Plans</h3>
                      <p className="text-gray-400">Coming soon! Set career goals and track your progress.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <UpgradePrompt onDismiss={() => setShowUpgradePrompt(false)} />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
