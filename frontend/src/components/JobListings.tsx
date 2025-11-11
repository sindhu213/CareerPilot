import { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Building2,
  BookmarkPlus,
  Send
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User, Page } from '../App';

type JobListingsProps = {
  user: User;
  onNavigate: (page: Page) => void;
};

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  postedDate: string;
  description: string;
  skills: string[];
  matchScore: number;
};

export function JobListings({ user, onNavigate }: JobListingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const jobs: Job[] = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'Bangalore, India',
      type: 'Full-time',
      experience: '1-3 years',
      salary: '₹6-10 LPA',
      postedDate: '2 days ago',
      description: 'We are looking for a skilled Frontend Developer to join our dynamic team. You will work on building responsive web applications using React and modern JavaScript.',
      skills: ['React', 'JavaScript', 'CSS', 'Git'],
      matchScore: 95
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'DataSystems Inc',
      location: 'Mumbai, India',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₹8-14 LPA',
      postedDate: '3 days ago',
      description: 'Join our team to build scalable full-stack applications. Experience with React, Node.js, and MongoDB required.',
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      matchScore: 78
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'StartupX',
      location: 'Remote',
      type: 'Contract',
      experience: '0-2 years',
      salary: '₹5-8 LPA',
      postedDate: '1 week ago',
      description: 'Early-stage startup looking for passionate React developers. Great opportunity to learn and grow.',
      skills: ['React', 'JavaScript', 'TypeScript'],
      matchScore: 88
    },
    {
      id: 4,
      title: 'Software Development Engineer',
      company: 'MegaCorp Technologies',
      location: 'Hyderabad, India',
      type: 'Full-time',
      experience: '0-1 years',
      salary: '₹7-12 LPA',
      postedDate: '4 days ago',
      description: 'Looking for fresh graduates or early career professionals with strong programming fundamentals.',
      skills: ['Python', 'Java', 'Data Structures', 'Algorithms'],
      matchScore: 65
    },
    {
      id: 5,
      title: 'UI/UX Developer',
      company: 'DesignHub',
      location: 'Pune, India',
      type: 'Full-time',
      experience: '1-3 years',
      salary: '₹6-9 LPA',
      postedDate: '5 days ago',
      description: 'Create beautiful user interfaces and experiences. Strong design sense and React skills required.',
      skills: ['React', 'Figma', 'CSS', 'User Experience'],
      matchScore: 72
    },
    {
      id: 6,
      title: 'Junior Python Developer',
      company: 'AI Innovations',
      location: 'Delhi, India',
      type: 'Full-time',
      experience: '0-2 years',
      salary: '₹5-8 LPA',
      postedDate: '1 week ago',
      description: 'Work on AI/ML projects using Python. Great learning opportunity for those interested in AI.',
      skills: ['Python', 'Machine Learning', 'TensorFlow'],
      matchScore: 60
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || 
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleApply = (jobId: number) => {
    toast.success('Application submitted successfully!');
  };

  const handleSave = (jobId: number) => {
    toast.success('Job saved to your list!');
  };

  return (
    <DashboardLayout currentPage="jobs" onNavigate={onNavigate} userName={user.name}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-2">Job Listings</h1>
          <p className="text-muted-foreground">
            Browse and apply to jobs matched to your profile
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
          </p>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3>{job.title}</h3>
                    {job.matchScore >= 80 && (
                      <Badge className="bg-green-600">
                        {job.matchScore}% Match
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="size-4 text-muted-foreground" />
                    <span className="text-sm">{job.company}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleSave(job.id)}>
                  <BookmarkPlus className="size-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {job.description}
              </p>

              <div className="grid md:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="size-4 text-muted-foreground" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" />
                  <span>{job.postedDate}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => {
                   const hasSkill = user.skills?.includes(skill) ?? false;
                    return (
                      <Badge 
                        key={skill} 
                        variant={hasSkill ? 'default' : 'outline'}
                      >
                        {skill}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleApply(job.id)}>
                  <Send className="size-4 mr-2" />
                  Quick Apply
                </Button>
                <Button variant="outline">
                  View Details
                </Button>
              </div>
            </Card>
          ))}

          {filteredJobs.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No jobs found matching your criteria. Try adjusting your filters.
              </p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
