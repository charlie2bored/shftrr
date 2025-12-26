"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2, FileText, MessageSquare } from 'lucide-react';
import { ChatRequest } from '@/lib/types';

interface VentAreaProps {
  resumeText: string;
  ventText: string;
  onResumeChange: (text: string) => void;
  onVentChange: (text: string) => void;
  onSend: (request: ChatRequest) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function VentArea({
  resumeText,
  ventText,
  onResumeChange,
  onVentChange,
  onSend,
  isLoading,
  disabled = false
}: VentAreaProps) {
  const [activeTab, setActiveTab] = useState<'resume' | 'vent'>('vent');
  const ventTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!resumeText.trim() || !ventText.trim() || isLoading) return;

    onSend({
      resume_text: resumeText,
      vent_text: ventText,
      temperature: 0.7,
      max_tokens: 2048,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-focus vent textarea when component mounts
  useEffect(() => {
    if (ventTextareaRef.current && activeTab === 'vent') {
      ventTextareaRef.current.focus();
    }
  }, [activeTab]);

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          Career Pivot Coach
        </h1>
        <p className="text-slate-400 mb-6">
          Share your resume and frustrations to get personalized career guidance
        </p>

        <Card className="bg-slate-800/50 border-slate-700">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'resume'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Resume
            </button>
            <button
              onClick={() => setActiveTab('vent')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'vent'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Vent
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'resume' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Paste your resume content here
                  </label>
                  <Textarea
                    value={resumeText}
                    onChange={(e) => onResumeChange(e.target.value)}
                    placeholder="Copy and paste your resume text, LinkedIn profile, or any career summary..."
                    className="min-h-[400px] bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    disabled={disabled}
                  />
                </div>
                <div className="text-xs text-slate-500">
                  💡 Include your work experience, skills, education, and achievements for better guidance.
                </div>
              </div>
            )}

            {activeTab === 'vent' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What's frustrating you about your current work?
                  </label>
                  <Textarea
                    ref={ventTextareaRef}
                    value={ventText}
                    onChange={(e) => onVentChange(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Tell me everything that's bothering you about your job, career, or work life. Be honest - this is a safe space..."
                    className="min-h-[300px] bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none glowing-textarea"
                    disabled={disabled || isLoading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    💡 Press Ctrl/Cmd + Enter to send • {ventText.length} characters
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!resumeText.trim() || !ventText.trim() || isLoading || disabled}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Getting your roadmap...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Status Messages */}
        {isLoading && (
          <div className="mt-4 p-3 bg-gray-800/20 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is analyzing your situation and crafting your personalized roadmap...</span>
            </div>
          </div>
        )}

        {(!resumeText.trim() || !ventText.trim()) && !isLoading && (
          <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400">
              <FileText className="w-4 h-4" />
              <span className="text-sm">
                {!resumeText.trim() && !ventText.trim()
                  ? "Add your resume and share what's bothering you to get started."
                  : !resumeText.trim()
                  ? "Please add your resume to get personalized guidance."
                  : "Share what's frustrating you about work to continue."
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
