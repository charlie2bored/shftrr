import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';

interface UpgradePromptProps {
  onDismiss?: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-blue-500/50 p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-500/20 rounded-full p-3">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          Free Tier Limit Reached
        </h2>

        <p className="text-gray-300 mb-6 leading-relaxed">
          You've used all 20 free requests for today. Upgrade to a paid plan to continue getting personalized career coaching from Gemini AI.
        </p>

        <div className="space-y-3">
          <a
            href="https://ai.google.dev/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Zap className="w-4 h-4" />
            Upgrade to Gemini API
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>

          <button
            onClick={onDismiss}
            className="w-full px-4 py-2 text-gray-400 hover:text-gray-300 text-sm transition-colors duration-200"
          >
            Continue with Limited Features
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Your conversation history is saved and will be available after upgrading.
          </p>
        </div>
      </div>
    </div>
  );
};

