import { DashboardLayout } from "./DashboardLayout";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  FileText,
  TrendingUp,
  Briefcase,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { User, Page } from "../App";

type DashboardProps = {
  user: User;
  onNavigate: (page: Page) => void;
};

// Add this interface
interface Application {
  _id: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'interview' | 'rejected' | 'accepted';
  appliedDate: string;
  location: string;
  notes?: string;
  jobUrl?: string;
}

export function Dashboard({
  user,
  onNavigate,
}: DashboardProps) {
  const profileCompletion = calculateProfileCompletion(user);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    skills: 0
  });

  // Add this state for recent applications
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

  useEffect(() => {
    async function getStats() {
      try {
        console.log("auth:" ,user.authUserId)
        const res = await fetch(`http://localhost:5001/api/stats?userId=${user.authUserId}`);
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error("Error fetching dashboard stats", e);
      }
    }
    getStats();
  }, [user.authUserId]);

  // Add this new useEffect for fetching recent applications
  useEffect(() => {
    async function fetchRecentApplications() {
      try {
        const userId = (user as any)._id;
        const response = await fetch(`http://localhost:5001/api/applications?userId=${userId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Get only the 5 most recent applications
          const sortedApplications = data
            .sort((a: Application, b: Application) => 
              new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
            )
            .slice(0, 3);
          setRecentApplications(sortedApplications);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoadingApplications(false);
      }
    }

    fetchRecentApplications();
  }, []);

  const quickActions = [
    {
      label: "Build Resume",
      icon: FileText,
      page: "resume-builder" as Page,
      description: "Create a professional resume",
    },
    {
      label: "Analyze Resume",
      icon: Target,
      page: "resume-analyzer" as Page,
      description: "Get AI-powered insights",
    },
    {
      label: "Explore Careers",
      icon: TrendingUp,
      page: "career-paths" as Page,
      description: "Discover career paths",
    },
    {
      label: "Browse Jobs",
      icon: Briefcase,
      page: "jobs" as Page,
      description: "Find opportunities",
    },
  ];

  return (
    <DashboardLayout
      currentPage="dashboard"
      onNavigate={onNavigate}
      userName={user.name}
    >
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">
            Here's your career journey overview
          </p>
        </div>

        {/* Profile Completion */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="mb-1">Complete Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                {profileCompletion}% complete - Add more details
                to unlock better recommendations
              </p>
            </div>
            <Button onClick={() => onNavigate("profile")}>
              Update Profile
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
          <Progress value={profileCompletion} className="h-2" />
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Applications
              </p>
              <Briefcase className="size-4 text-muted-foreground" />
            </div>
            <div className="text-3xl mb-1">{stats.applications}</div>
            <p className="text-xs text-muted-foreground">
              Updated live
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Interviews
              </p>
              <Clock className="size-4 text-muted-foreground" />
            </div>
            <div className="text-3xl mb-1">{stats.interviews}</div>
            <p className="text-xs text-muted-foreground">
              Counted from applications
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Skills Added
              </p>
              <Target className="size-4 text-muted-foreground" />
            </div>
            <div className="text-3xl mb-1">
              {stats.skills}
            </div>

            <p className="text-xs text-muted-foreground">
              Keep growing
            </p>
          </Card>
        </div>

       <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="flex flex-col">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="grid gap-4 flex-1">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.page}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onNavigate(action.page)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="size-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1">{action.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="size-5 text-muted-foreground" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activity - UPDATED SECTION */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3>Recent Applications</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("applications")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3 flex-1">
              {loadingApplications ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : recentApplications.length === 0 ? (
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    No applications yet. Start tracking your job applications!
                  </p>
                </Card>
              ) : (
                recentApplications.map((app) => (
                  <Card key={app._id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{app.jobTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          {app.company}
                        </p>
                      </div>
                      <Badge
                        variant={
                          app.status === "interview"
                            ? "default"
                            : app.status === "pending"
                              ? "secondary"
                              : app.status === "rejected"
                                ? "destructive"
                                : "default"
                        }
                      >
                        {app.status === "interview" && (
                          <CheckCircle2 className="size-3 mr-1" />
                        )}
                        {app.status === "pending" && (
                          <Clock className="size-3 mr-1" />
                        )}
                        {app.status === "rejected" && (
                          <AlertCircle className="size-3 mr-1" />
                        )}
                        {app.status === "accepted" && (
                          <CheckCircle2 className="size-3 mr-1" />
                        )}
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function calculateProfileCompletion(user: User): number {
  let completion = 0;

  // Basic info
  if (user.name) completion += 15;
  if (user.email) completion += 15;

  // Skills
  const techSkillsCount = user.technicalSkills?.length || 0;
  const softSkillsCount = user.softSkills?.length || 0;
  const toolsCount = user.toolsAndTechnologies?.length || 0;
  if (techSkillsCount + softSkillsCount + toolsCount > 0)
    completion += 15;

  // Education
  if ((user.education?.length || 0) > 0) completion += 15;

  // Interests
  if ((user.interests?.length || 0) > 0) completion += 10;

  // Languages
  if ((user.languages?.length || 0) > 0) completion += 10;

  // Important Links
  if (user.github) completion += 15; // mandatory
  if (user.linkedin || user.portfolio) completion += 5; // optional

  return completion > 100 ? 100 : completion;
}