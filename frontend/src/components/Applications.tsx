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

type ApplicationsProps = {
  user: User;
  onNavigate: (page: Page) => void;
};

type Application = {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'interview' | 'rejected' | 'accepted';
  nextStep?: string;
  notes?: string;
};

export function Applications({ user, onNavigate }: ApplicationsProps) {
  const applications: Application[] = [
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'Bangalore, India',
      appliedDate: '2025-10-19',
      status: 'pending',
      notes: 'Waiting for HR response'
    },
    {
      id: 2,
      jobTitle: 'Full Stack Engineer',
      company: 'DataSystems Inc',
      location: 'Mumbai, India',
      appliedDate: '2025-10-16',
      status: 'interview',
      nextStep: 'Technical interview on Oct 25, 2025 at 2:00 PM',
      notes: 'Prepare system design questions'
    },
    {
      id: 3,
      jobTitle: 'React Developer',
      company: 'StartupX',
      location: 'Remote',
      appliedDate: '2025-10-14',
      status: 'rejected',
      notes: 'Looking for more experience'
    },
    {
      id: 4,
      jobTitle: 'Software Development Engineer',
      company: 'MegaCorp Technologies',
      location: 'Hyderabad, India',
      appliedDate: '2025-10-12',
      status: 'accepted',
      nextStep: 'Start date: November 1, 2025',
      notes: 'Offer letter received!'
    },
    {
      id: 5,
      jobTitle: 'UI/UX Developer',
      company: 'DesignHub',
      location: 'Pune, India',
      appliedDate: '2025-10-10',
      status: 'interview',
      nextStep: 'Design challenge due Oct 23, 2025',
      notes: 'Submit portfolio samples'
    },
    {
      id: 6,
      jobTitle: 'Junior Python Developer',
      company: 'AI Innovations',
      location: 'Delhi, India',
      appliedDate: '2025-10-08',
      status: 'pending',
      notes: 'Applied through referral'
    },
  ];

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
        <Button variant="outline" size="sm">
          <ExternalLink className="size-4 mr-2" />
          View Job
        </Button>
        {app.status === 'interview' && (
          <Button size="sm">Prepare for Interview</Button>
        )}
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
  <form className="grid md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">Job Title</label>
      <input 
        type="text" 
        placeholder="e.g. Frontend Developer"
        className="w-full border rounded-lg p-2"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Company</label>
      <input 
        type="text" 
        placeholder="e.g. TechCorp Solutions"
        className="w-full border rounded-lg p-2"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Location</label>
      <input 
        type="text" 
        placeholder="e.g. Bangalore, India"
        className="w-full border rounded-lg p-2"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Status</label>
      <select className="w-full border rounded-lg p-2">
        <option value="pending">Pending</option>
        <option value="interview">Interview</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-1">Notes</label>
      <textarea 
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
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="interview">Interview ({stats.interview})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-4">
            {applications.map(app => <ApplicationCard key={app.id} app={app} />)}
          </TabsContent>

          <TabsContent value="pending" className="mt-6 space-y-4">
            {filterByStatus('pending').map(app => <ApplicationCard key={app.id} app={app} />)}
            {filterByStatus('pending').length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No pending applications</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="interview" className="mt-6 space-y-4">
            {filterByStatus('interview').map(app => <ApplicationCard key={app.id} app={app} />)}
            {filterByStatus('interview').length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No interviews scheduled</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="mt-6 space-y-4">
            {filterByStatus('accepted').map(app => <ApplicationCard key={app.id} app={app} />)}
            {filterByStatus('accepted').length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No accepted offers yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6 space-y-4">
            {filterByStatus('rejected').map(app => <ApplicationCard key={app.id} app={app} />)}
            {filterByStatus('rejected').length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No rejected applications</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
