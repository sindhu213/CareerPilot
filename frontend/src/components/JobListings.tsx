import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { 
  Search, MapPin, Briefcase, Calendar, Building2, BookmarkPlus, Send, 
  Loader2, ExternalLink, Globe, Clock, DollarSign 
} from 'lucide-react';
import { toast } from 'sonner';
import { debounce } from 'lodash';

type Job = {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_employment_type?: string;
  job_posted_at_datetime_utc?: string;
  job_description?: string;
  job_apply_link?: string;
  job_is_remote?: boolean;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_salary_currency?: string;
  job_salary_min?: number;
  job_salary_max?: number;
};

const JobSkeleton = () => (
  <Card className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-3 flex-1">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-5 w-64" />
      </div>
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-5 w-36" />
    </div>
    <div className="flex gap-3">
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-12 w-40" />
    </div>
  </Card>
);

const JobCard = memo(({ job, onKnowMore }: { job: Job; onKnowMore: (job: Job) => void }) => {
  const salary = job.job_salary_min && job.job_salary_max
    ? `${job.job_salary_min.toLocaleString()} - ${job.job_salary_max.toLocaleString()} ${job.job_salary_currency || ''}`
    : job.job_salary_min
    ? `${job.job_salary_min.toLocaleString()}+ ${job.job_salary_currency || ''}`
    : null;

  return (
    <Card className="p-6 hover:shadow-2xl transition-all duration-300 border rounded-2xl cursor-pointer group">
      <div onClick={() => onKnowMore(job)} className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-primary group-hover:underline">
              {job.job_title}
            </h3>
            <p className="text-lg font-medium mt-1 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {job.employer_name}
            </p>
          </div>
          {job.job_is_remote && <Badge className="text-lg px-4">Remote</Badge>}
        </div>

        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <span className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {job.job_city ? `${job.job_city}, ` : ""}{job.job_country || "Worldwide"}
          </span>
          <span className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {job.job_employment_type || "Full-time"}
          </span>
          {salary && (
            <span className="flex items-center gap-2 text-green-600 font-semibold">
              <DollarSign className="h-5 w-5" />
              {salary}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" size="lg" onClick={(e) => { e.stopPropagation(); onKnowMore(job); }}>
          Know More
        </Button>
        <Button size="lg" onClick={(e) => { e.stopPropagation(); window.open(job.job_apply_link || "#", "_blank"); }}>
          <Send className="mr-2 h-5 w-5" /> Apply Now
        </Button>
      </div>
    </Card>
  );
});

export function JobListings({ user, onNavigate }: { user: any; onNavigate: (p: string) => void }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const fetchJobs = useCallback(async (page: number = 1, filters?: { query?: string; location?: string; type?: string }) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters?.query) params.set("query", filters.query);
      if (filters?.location) params.set("location", filters.location);
      if (filters?.type) params.set("jobType", filters.type);
      params.set("page", page.toString());

      const res = await fetch(`http://localhost:5001/api/jobs/search?${params}`);
      if (!res.ok) throw new Error("Failed");

      const result = await res.json();
      setJobs(result.data || []);
      setCurrentPage(result.pagination.currentPage);
      setHasNext(result.pagination.hasNext);
      setHasPrev(result.pagination.hasPrev);
    } catch (err) {
      toast.error("Failed to load jobs");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((q: string, loc: string, typ: string) => {
      fetchJobs(1, { query: q || undefined, location: loc || undefined, type: typ || undefined });
    }, 600),
    [fetchJobs]
  );

  useEffect(() => {
    debouncedSearch(query, location, type);
    return () => debouncedSearch.cancel();
  }, [query, location, type, debouncedSearch]);

  // Initial load
  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  const goNext = () => hasNext && fetchJobs(currentPage + 1, { query, location, type });
  const goPrev = () => hasPrev && fetchJobs(currentPage - 1, { query, location, type });

  return (
    <DashboardLayout currentPage="jobs" onNavigate={onNavigate} userName={user?.name}>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">Global Job Opportunities</h1>

        <Card className="p-6 mb-8 shadow-xl">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Any job worldwide..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Input placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} className="h-12" />
            <Input placeholder="Job type (optional)" value={type} onChange={(e) => setType(e.target.value)} className="h-12" />
          </div>
        </Card>

        {/* Skeleton Loader */}
        {isLoading && (
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => <JobSkeleton key={i} />)}
          </div>
        )}

        {/* Jobs */}
        {!isLoading && jobs.length > 0 && (
          <div className="space-y-8">
            {jobs.map(job => (
              <JobCard key={job.job_id} job={job} onKnowMore={setSelectedJob} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {(hasPrev || hasNext) && (
          <div className="flex justify-center gap-8 mt-12">
            <Button onClick={goPrev} disabled={!hasPrev || isLoading} size="lg" variant="outline">
              Previous
            </Button>
            <span className="text-xl font-medium self-center">Page {currentPage}</span>
            <Button onClick={goNext} disabled={!hasNext || isLoading} size="lg">
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Next"}
            </Button>
          </div>
        )}

        {/* Full Job Modal */}
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold">{selectedJob.job_title}</DialogTitle>
                  <DialogDescription className="text-xl">
                    {selectedJob.employer_name} • {selectedJob.job_country || "Global"}
                    {selectedJob.job_is_remote && " • Remote"}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-8 space-y-10">
                  {selectedJob.job_description && (
                    <section>
                      <h3 className="text-2xl font-bold mb-4">Description</h3>
                      <p className="whitespace-pre-line text-muted-foreground leading-relaxed text-lg">
                        {selectedJob.job_description}
                      </p>
                    </section>
                  )}

                  

                  {selectedJob.job_highlights?.Qualifications?.length && (
                    <section>
                      <h3 className="text-2xl font-bold mb-4">Requirements</h3>
                      <ul className="list-disc pl-8 space-y-2 text-muted-foreground text-lg">
                        {selectedJob.job_highlights.Qualifications.map((q, i) => <li key={i}>{q}</li>)}
                      </ul>
                    </section>
                  )}

                  {selectedJob.job_highlights?.Responsibilities?.length && (
                    <section>
                      <h3 className="text-2xl font-bold mb-4">Responsibilities</h3>
                      <ul className="list-disc pl-8 space-y-2 text-muted-foreground text-lg">
                        {selectedJob.job_highlights.Responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </section>
                  )}

                  <Button 
                    size="lg" 
                    className="w-full h-16 text-xl font-bold"
                    onClick={() => window.open(selectedJob.job_apply_link || "#", "_blank")}
                  >
                    <ExternalLink className="mr-3 h-7 w-7" />
                    Apply Now
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
















