import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Upload, 
  TrendingUp, 
  Briefcase, 
  CheckSquare,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import type { Page } from '../App';

type DashboardLayoutProps = {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userName: string;
};

export function DashboardLayout({ children, currentPage, onNavigate, userName }: DashboardLayoutProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
    { id: 'resume-analyzer', label: 'Resume Analyzer', icon: Upload },
    { id: 'career-paths', label: 'Career Paths', icon: TrendingUp },
    { id: 'jobs', label: 'Job Listings', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: CheckSquare },
  ] as const;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <h2 className="text-primary">CareerPilot</h2>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as Page)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="size-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="p-3 bg-muted rounded-lg mb-2">
            <p className="text-sm">Welcome back,</p>
            <p className="text-sm truncate">{userName}</p>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground"
            onClick={() => window.location.reload()}
          >
            <LogOut className="size-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
