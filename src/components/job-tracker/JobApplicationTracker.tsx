"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/toast-context';
import { format } from 'date-fns';

interface JobApplication {
  id: string;
  company: string;
  role: string;
  jobUrl?: string;
  jobBoard?: string;
  status: 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';
  appliedDate?: Date;
  nextActionDate?: Date;
  nextAction?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const STATUS_CONFIG = {
  wishlist: { label: 'Wishlist', color: 'bg-gray-500', icon: Clock },
  applied: { label: 'Applied', color: 'bg-blue-500', icon: CheckCircle },
  interview: { label: 'Interview', color: 'bg-yellow-500', icon: Calendar },
  offer: { label: 'Offer', color: 'bg-green-500', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500', icon: XCircle },
};

const JOB_BOARDS = [
  'LinkedIn',
  'Indeed',
  'Glassdoor',
  'Handshake',
  'Company Website',
  'AngelList',
  'We Work Remotely',
  'Remote.co',
  'Other'
];

export function JobApplicationTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<JobApplication>>({});
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/job-applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      showError('Failed to load applications', 'Please refresh the page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/job-applications/${editingId}` : '/api/job-applications';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        success(
          editingId ? 'Application updated' : 'Application added',
          'Your job application has been saved successfully'
        );
        await loadApplications();
        resetForm();
      } else {
        throw new Error('Failed to save application');
      }
    } catch (error) {
      console.error('Failed to save application:', error);
      showError('Failed to save application', 'Please try again');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        success('Application deleted', 'The application has been removed');
        await loadApplications();
      } else {
        throw new Error('Failed to delete application');
      }
    } catch (error) {
      console.error('Failed to delete application:', error);
      showError('Failed to delete application', 'Please try again');
    }
  };

  const resetForm = () => {
    setFormData({});
    setShowAddForm(false);
    setEditingId(null);
  };

  const startEdit = (application: JobApplication) => {
    setFormData(application);
    setEditingId(application.id);
    setShowAddForm(true);
  };

  const getStatusStats = () => {
    const stats = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Job Applications</h2>
          <p className="text-gray-400">Track your job search progress</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const count = stats[status] || 0;
          const Icon = config.icon;
          return (
            <Card key={status} className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{config.label}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${config.color.replace('bg-', 'text-')}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? 'Edit Application' : 'Add New Application'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Google, Microsoft"
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Software Engineer, Product Manager"
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobUrl" className="text-white">Job URL</Label>
                  <Input
                    id="jobUrl"
                    type="url"
                    value={formData.jobUrl || ''}
                    onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                    placeholder="https://..."
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobBoard" className="text-white">Job Board</Label>
                  <Select
                    value={formData.jobBoard || ''}
                    onValueChange={(value) => setFormData({ ...formData, jobBoard: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select job board" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {JOB_BOARDS.map((board) => (
                        <SelectItem key={board} value={board}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-white">Status</Label>
                  <Select
                    value={formData.status || 'wishlist'}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                        <SelectItem key={status} value={status}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appliedDate" className="text-white">Applied Date</Label>
                  <Input
                    id="appliedDate"
                    type="date"
                    value={formData.appliedDate ? format(new Date(formData.appliedDate), 'yyyy-MM-dd') : ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      appliedDate: e.target.value ? new Date(e.target.value) : undefined
                    })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextAction" className="text-white">Next Action</Label>
                <Input
                  id="nextAction"
                  value={formData.nextAction || ''}
                  onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                  placeholder="e.g., Follow up in 7 days, Prepare for interview"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextActionDate" className="text-white">Next Action Date</Label>
                <Input
                  id="nextActionDate"
                  type="date"
                  value={formData.nextActionDate ? format(new Date(formData.nextActionDate), 'yyyy-MM-dd') : ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    nextActionDate: e.target.value ? new Date(e.target.value) : undefined
                  })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-white">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes about this application..."
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? 'Update Application' : 'Add Application'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2">No applications yet</h3>
                <p>Start tracking your job applications to stay organized and follow up effectively.</p>
              </div>
              <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => {
            const statusConfig = STATUS_CONFIG[application.status];
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={application.id} className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {application.role}
                        </h3>
                        <Badge className={`${statusConfig.color} text-white`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <p className="text-gray-300 mb-3">{application.company}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                        {application.jobBoard && (
                          <div>
                            <span className="font-medium">Source:</span> {application.jobBoard}
                          </div>
                        )}
                        {application.appliedDate && (
                          <div>
                            <span className="font-medium">Applied:</span>{' '}
                            {format(new Date(application.appliedDate), 'MMM dd, yyyy')}
                          </div>
                        )}
                        {application.nextActionDate && (
                          <div>
                            <span className="font-medium">Next Action:</span>{' '}
                            {format(new Date(application.nextActionDate), 'MMM dd, yyyy')}
                          </div>
                        )}
                      </div>

                      {application.nextAction && (
                        <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                          <p className="text-blue-300 text-sm">
                            <strong>Next:</strong> {application.nextAction}
                          </p>
                        </div>
                      )}

                      {application.notes && (
                        <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                          <p className="text-gray-300 text-sm">{application.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {application.jobUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(application.jobUrl, '_blank')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(application)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(application.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
