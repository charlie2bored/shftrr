"use client";

import { useState, useEffect } from 'react';
import { Plus, LogOut, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useGeminiChat, type GeminiChatRequest, type GeminiChatResponse } from '@/lib/use-gemini-chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TypingIndicator } from '@/components/Skeleton';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { useToast } from '@/lib/toast-context';
import { buttonHover, inputFocus, cardHover, fadeInUp } from '@/lib/animations';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  toolCalls?: any[];
  toolResults?: any[];
}

export default function ShftrrDashboard() {
  const { data: session, status } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [resumeText, setResumeText] = useState('');
  const [ventText, setVentText] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { sendMessage, isLoading, error } = useGeminiChat(undefined, () => {
    setShowUpgradePrompt(true);
  });
  const { success, error: showError } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const handleNewChat = () => {
    // Handle new chat creation
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && !isLoading) {
      const userInput = inputValue.trim();

      // Add user message to chat
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: userInput,
        isUser: true,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, userMessage]);
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
      setChatMessages(prev => [...prev, aiMessage]);

      // Send request and handle response
      sendMessage(
        chatRequest,
        (chunk) => {
          // Update AI message with response
          setChatMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, text: chunk }
                : msg
            )
          );
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

          setChatMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, text: finalText, toolCalls: fullResponse.toolCalls, toolResults: fullResponse.toolResults }
                : msg
            )
          );

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
          {/* Header */}
          <div className="p-6 border-b border-gray-600 mb-4">
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

          {/* User Info */}
          {session?.user && (
            <div className="px-6 mb-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 border border-gray-700">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
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

              <button
                onClick={() => signOut()}
                className={`flex items-center gap-2 w-full mt-3 px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 ${buttonHover}`}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}

          {!session && (
            <div className="px-6 mb-4">
              <a
                href="/auth/signin"
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                Sign in
              </a>
            </div>
          )}

          {/* Chat History - Empty for now */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Chat history">
            {/* Chat list would go here */}
          </nav>
        </aside>

        {/* Main Center Content */}
        <main className="flex-1 bg-black flex flex-col" role="main">
          {/* Content Area - Changed to left alignment */}
          <div className="flex-1 flex flex-col px-12 py-8 max-w-4xl mx-auto w-full">
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
              <div className="flex-1 overflow-y-auto space-y-12 py-8">
                {chatMessages.map((message, index) => (
                  <div key={message.id} className={`${fadeInUp} flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`p-6 rounded-2xl transition-all duration-200 ${
                      message.isUser
                        ? 'bg-blue-600/20 border border-blue-500/30 max-w-[80%] ml-auto text-white'
                        : 'bg-gray-900/50 border border-gray-800 max-w-[90%] mr-auto'
                    }`}>
                      {message.isUser ? (
                        <p className="text-white text-[15px] leading-relaxed">{message.text}</p>
                      ) : (
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-lg font-semibold text-white mb-3 mt-6">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-base font-medium text-white mb-2 mt-4">{children}</h3>,
                              p: ({ children }) => <p className="text-[15px] text-white leading-relaxed mb-4">{children}</p>,
                              ul: ({ children }) => <ul className="text-white mb-4 space-y-2 ml-6 list-disc">{children}</ul>,
                              ol: ({ children }) => <ol className="text-white mb-4 space-y-2 ml-6 list-decimal">{children}</ol>,
                              li: ({ children }) => <li className="text-[15px] leading-relaxed">{children}</li>,
                              strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                              em: ({ children }) => <em className="text-white italic">{children}</em>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-blue-500 pl-6 my-6 text-white italic bg-slate-800/30 py-4 px-6 rounded-r-lg">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
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
            )}

            {/* Input Field Area */}
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
                />
                {error && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <UpgradePrompt onDismiss={() => setShowUpgradePrompt(false)} />
      )}
    </div>
  );
}
