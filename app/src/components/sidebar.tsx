"use client";

import { useState } from 'react';
import { EscapePlan } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, FileText, Calendar, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  escapePlans: EscapePlan[];
  selectedPlan: EscapePlan | null;
  onSelectPlan: (plan: EscapePlan | null) => void;
  onDeletePlan: (id: string) => void;
}

export function Sidebar({ escapePlans, selectedPlan, onSelectPlan, onDeletePlan }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const generateTitle = (ventText: string) => {
    const words = ventText.split(' ').slice(0, 6).join(' ');
    return words.length < ventText.length ? `${words}...` : words;
  };

  return (
    <div className={`bg-slate-900 border-r border-slate-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Escape Plans
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white"
          >
            {isCollapsed ? '→' : '←'}
          </Button>
        </div>
        {!isCollapsed && (
          <p className="text-sm text-slate-400 mt-1">
            {escapePlans.length} saved plan{escapePlans.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-4 space-y-3">
          {escapePlans.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              {!isCollapsed && (
                <>
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No escape plans yet</p>
                  <p className="text-xs mt-1">Start venting to create your first plan!</p>
                </>
              )}
            </div>
          ) : (
            escapePlans.map((plan) => (
              <Card
                key={plan.id}
                className={`p-3 cursor-pointer transition-all duration-200 hover:bg-slate-800 ${
                  selectedPlan?.id === plan.id
                    ? 'bg-slate-800 border-blue-500'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
                onClick={() => onSelectPlan(plan)}
              >
                {!isCollapsed && (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-white line-clamp-2">
                        {plan.title || generateTitle(plan.ventText)}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePlan(plan.id);
                        }}
                        className="text-slate-500 hover:text-gray-600 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span suppressHydrationWarning>
                          {formatDistanceToNow(plan.timestamp, { addSuffix: true })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MessageSquare className="w-3 h-3" />
                        {plan.ventText.length} chars
                      </div>

                      {selectedPlan?.id === plan.id && (
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </>
                )}

                {isCollapsed && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {selectedPlan?.id === plan.id && (
                      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
