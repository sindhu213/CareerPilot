import { DashboardLayout } from './DashboardLayout';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar,
  Building2,
  MapPin,
  ExternalLink
} from 'lucide-react';
import type { User, Page } from '../App';
import { useState, useEffect } from 'react';

type ApplicationsProps = {
  user: User;
  onNavigate: (page: Page) => void;
};

type Application = {
  _id: number;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'interview' | 'rejected' | 'accepted';
  nextStep?: string;
  notes?: string;
  jobUrl?: string;
};

export function Applications({ user, onNavigate }: ApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    status: 'pending' as Application['status'],
    notes: '',
    jobUrl: ''
  });

  const API_BASE = 'http://localhost:5001/api';

  // Fetch applications from database
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const userId = (user as any)._id;

      const response = await fetch(`${API_BASE}/applications?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const newApplication = {
      ...formData,
      appliedDate: new Date().toISOString().split('T')[0],
      userId: (user as any)._id,
      authUserId: (user as any).authUserId
    };
    
    console.log('Sending application data:', newApplication); 

    const response = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newApplication),
    });

    console.log('Response status:', response.status); 
    
    if (response.ok) {
      const savedApplication = await response.json();
      console.log('Saved application:', savedApplication); 
      setApplications(prev => [...prev, savedApplication]);
      
      // Reset form
      setFormData({
        jobTitle: '',
        company: '',
        location: '',
        status: 'pending',
        notes: '',
        jobUrl: ''
      });
    } else {
      const errorText = await response.text();
      console.error('Failed to add application. Error:', errorText);
    }
  } catch (error) {
    console.error('Error adding application:', error);
  }
};

const handleDeleteApplication = async (applicationId: number) => {
  if (!confirm('Are you sure you want to delete this application?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/applications/${applicationId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the application from the state
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      console.log('Application deleted successfully');
    } else {
      console.error('Failed to delete application');
    }
  } catch (error) {
    console.error('Error deleting application:', error);
  }
};

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="size-5 text-green-600" />;
      case 'interview':
        return <Calendar className="size-5 text-blue-600" />;
      case 'pending':
        return <Clock className="size-5 text-orange-600" />;
      case 'rejected':
        return <XCircle className="size-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    const variants = {
      accepted: 'default' as const,
      interview: 'default' as const,
      pending: 'secondary' as const,
      rejected: 'destructive' as const,
    };

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filterByStatus = (status: Application['status']) => 
    applications.filter(app => app.status === status);

  const stats = {
    total: applications.length,
    pending: filterByStatus('pending').length,
    interview: filterByStatus('interview').length,
    accepted: filterByStatus('accepted').length,
    rejected: filterByStatus('rejected').length,
  };

 const ApplicationCard = ({ app }: { app: Application }) => (
  <Card className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {getStatusIcon(app.status)}
          <h3>{app.jobTitle}</h3>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="size-4 text-muted-foreground" />
          <span className="text-sm">{app.company}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          <span>{app.location}</span>
        </div>
      </div>
      {getStatusBadge(app.status)}
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="size-4 text-muted-foreground" />
        <span className="text-muted-foreground">Applied:</span>
        <span>{new Date(app.appliedDate).toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</span>
      </div>
      
      {app.nextStep && (
        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm">
            <strong>Next Step:</strong> {app.nextStep}
          </p>
        </div>
      )}

      {app.notes && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Notes:</strong> {app.notes}
          </p>
        </div>
      )}
    </div>

    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => app.jobUrl && window.open(app.jobUrl, '_blank')}
        disabled={!app.jobUrl}
      >
        <ExternalLink className="size-4 mr-2" />
        View Job
      </Button>

      {/* Add Delete Button */}
      <Button 
        variant="destructive" 
        size="sm"
        onClick={() => handleDeleteApplication(app._id)}
      >
        <XCircle className="size-4 mr-2" />
        Delete
      </Button>

    </div>
  </Card>
);

  return (
    <DashboardLayout currentPage="applications" onNavigate={onNavigate} userName={user.name}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-2">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage all your job applications in one place
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total</p>
            <div className="text-2xl">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <div className="text-2xl text-orange-600">{stats.pending}</div>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Interview</p>
            <div className="text-2xl text-blue-600">{stats.interview}</div>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Accepted</p>
            <div className="text-2xl text-green-600">{stats.accepted}</div>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Rejected</p>
            <div className="text-2xl text-red-600">{stats.rejected}</div>
          </Card>
        </div>

        {/* Add Application Form */}

<Card className="p-6 mb-8">
  <h2 className="text-lg font-semibold mb-4">Add New Application</h2>
  <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">Job Title</label>
      <input 
        type="text" 
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleInputChange}
        placeholder="e.g. Frontend Developer"
        className="w-full border rounded-lg p-2"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Company</label>
      <input 
        type="text" 
        name="company"
        value={formData.company}
        onChange={handleInputChange}
        placeholder="e.g. TechCorp Solutions"
        className="w-full border rounded-lg p-2"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Location</label>
      <input 
        type="text" 
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        placeholder="e.g. Bangalore, India"
        className="w-full border rounded-lg p-2"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Job URL</label>
      <input 
        type="url" 
        name="jobUrl"
        value={formData.jobUrl}
        onChange={handleInputChange}
        placeholder="e.g. https://company.com/job-posting"
        className="w-full border rounded-lg p-2"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Status</label>
      <select 
        name="status"
        value={formData.status}
        onChange={handleInputChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="pending">Pending</option>
        <option value="interview">Interview</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-1">Notes</label>
      <textarea 
        name="notes"
        value={formData.notes}
        onChange={handleInputChange}
        placeholder="Add any notes about this application..."
        className="w-full border rounded-lg p-2"
        rows={3}
      />
    </div>
    <div className="md:col-span-2 flex justify-end">
      <Button type="submit">Add Application</Button>
    </div>
  </form>
</Card>

        {/* Applications List */}
        {isLoading ? (
  <Card className="p-12 text-center">
    <p className="text-muted-foreground">Loading applications...</p>
  </Card>
) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="interview">Interview ({stats.interview})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-4">
            {applications.map(app => <ApplicationCard key={app._id} app={app} />)}
          </TabsContent>

          <TabsContent value="pending" className="mt-6 space-y-4">
            {filterByStatus('pending').map(app => <ApplicationCard key={app._id} app={app} />)}
            {filterByStatus('pending').length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No pending applications</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="interview" className="mt-6 space-y-4">
            {filterByStatus('interview').map(app => <ApplicationCard key={app._id} app={app} />)}
            {filterByStatus('interview').length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No interviews scheduled</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="mt-6 space-y-4">
            {filterByStatus('accepted').map(app => <ApplicationCard key={app._id} app={app} />)}
            {filterByStatus('accepted').length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No accepted offers yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6 space-y-4">
            {filterByStatus('rejected').map(app => <ApplicationCard key={app._id} app={app} />)}
            {filterByStatus('rejected').length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No rejected applications</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
)}
      </div>
    </DashboardLayout>
  );
}