import { useState, useEffect } from 'react';
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
  Send,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User, Page } from '../App';

type JobListingsProps = {
  user: User;
  onNavigate: (page: Page) => void;
};

type Job = {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_employment_type: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_posted_at_datetime_utc?: string;
  job_description: string;
  job_required_skills?: string[];
  job_apply_link: string;
};

export function JobListings({ user, onNavigate }: JobListingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        query: searchQuery || 'software developer',
        page: currentPage.toString(),
      });

      if (locationFilter !== 'all') {
        params.append('location', locationFilter);
      }

      if (typeFilter !== 'all') {
        params.append('jobType', typeFilter);
      }

      const response = await fetch(`http://localhost:5001/api/jobs/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.data || []);
      setHasNextPage(data.pagination?.hasNext || false);
      setHasPrevPage(data.pagination?.hasPrev || false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs. Please try again.');
      setJobs([]);
      setHasNextPage(false);
      setHasPrevPage(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs();
  };

  const getLocation = (job: Job) => {
    const parts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
    return parts.join(', ') || 'Not specified';
  };

  const getSalary = (job: Job) => {
    if (job.job_min_salary && job.job_max_salary) {
      const currency = job.job_salary_currency || 'USD';
      return `${currency} ${job.job_min_salary.toLocaleString()}-${job.job_max_salary.toLocaleString()}`;
    }
    return 'Not specified';
  };

  const getPostedDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const calculateMatchScore = (job: Job): number => {
    if (!user.skills || user.skills.length === 0) return 0;
    
    const jobText = `${job.job_title} ${job.job_description}`.toLowerCase();
    const matchingSkills = user.skills.filter(skill => 
      jobText.includes(skill.toLowerCase())
    );
    
    return Math.round((matchingSkills.length / user.skills.length) * 100);
  };

  const extractSkills = (job: Job): string[] => {
    if (job.job_required_skills && job.job_required_skills.length > 0) {
      return job.job_required_skills;
    }

    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript',
      'CSS', 'HTML', 'MongoDB', 'SQL', 'AWS', 'Docker', 'Git', 'Angular',
      'Vue', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go'
    ];

    const description = job.job_description.toLowerCase();
    return commonSkills.filter(skill => 
      description.includes(skill.toLowerCase())
    ).slice(0, 6);
  };

  const formatDescription = (description: string, jobId: string): { preview: string; full: string; isTruncated: boolean } => {
    // Remove excessive whitespace and newlines
    const cleaned = description.replace(/\s+/g, ' ').trim();
    
    const isExpanded = expandedJobs.has(jobId);
    const previewLength = 300;
    const isTruncated = cleaned.length > previewLength;
    
    return {
      preview: isTruncated ? cleaned.substring(0, previewLength) : cleaned,
      full: cleaned,
      isTruncated
    };
  };

  const toggleDescription = (jobId: string) => {
    setExpandedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleApply = (job: Job) => {
    window.open(job.job_apply_link, '_blank');
    toast.success('Redirecting to application page...');
  };

  const handleSave = (job: Job) => {
    toast.success('Job saved to your list!');
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={locationFilter} onValueChange={(value) => {
              setLocationFilter(value);
              setCurrentPage(1);
            }}>
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

            <Select value={typeFilter} onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FULLTIME">Full-time</SelectItem>
                <SelectItem value="PARTTIME">Part-time</SelectItem>
                <SelectItem value="CONTRACTOR">Contract</SelectItem>
                <SelectItem value="INTERN">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Search className="size-4 mr-2" />
              Search Jobs
            </Button>
          </div>
        </Card>

        {/* Results Count and Pagination Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `Showing ${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'} - Page ${currentPage}`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Job Cards */}
        {!loading && (
          <>
            <div className="space-y-4">
              {jobs.map((job) => {
                const matchScore = calculateMatchScore(job);
                const skills = extractSkills(job);
                const location = getLocation(job);
                const salary = getSalary(job);
                const postedDate = getPostedDate(job.job_posted_at_datetime_utc);
                const { preview, full, isTruncated } = formatDescription(job.job_description, job.job_id);
                const isExpanded = expandedJobs.has(job.job_id);

                return (
                  <Card key={job.job_id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.job_title}</h3>
                          {matchScore >= 50 && (
                            <Badge className="bg-green-600">
                              {matchScore}% Match
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="size-4 text-muted-foreground" />
                          <span className="text-sm">{job.employer_name}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleSave(job)}>
                        <BookmarkPlus className="size-4" />
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground mb-2 leading-relaxed">
                      <p>{isExpanded ? full : preview}{!isExpanded && isTruncated && '...'}</p>
                      {isTruncated && (
                        <button 
                          onClick={() => toggleDescription(job.job_id)}
                          className="text-primary hover:underline mt-1 text-xs font-medium"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-4 gap-3 mb-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span className="truncate">{location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="size-4 text-muted-foreground" />
                        <span>{job.job_employment_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="size-4 text-muted-foreground" />
                        <span className="truncate">{salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="size-4 text-muted-foreground" />
                        <span>{postedDate}</span>
                      </div>
                    </div>

                    {skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => {
                            const hasSkill = user.skills?.some(s => 
                              s.toLowerCase() === skill.toLowerCase()
                            ) ?? false;
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
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleApply(job)}>
                        View Details
                      </Button>
                    </div>
                  </Card>
                );
              })}

              {jobs.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No jobs found matching your criteria. Try adjusting your filters or search query.
                  </p>
                </Card>
              )}
            </div>

            {/* Pagination Controls */}
            {jobs.length > 0 && (hasPrevPage || hasNextPage) && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={handlePrevPage}
                  disabled={!hasPrevPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage}
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}