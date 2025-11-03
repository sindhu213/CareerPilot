import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { ProfilePage } from './components/ProfilePage';
import { ResumeBuilder } from './components/ResumeBuilder';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { CareerPaths } from './components/CareerPaths';
import { JobListings } from './components/JobListings';
import { Applications } from './components/Applications';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Toaster } from './components/ui/sonner';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  linkedin?: string;
  github: string;
  portfolio?: string;
  profileImageUrl?: string;
  technicalSkills: string[];
  softSkills: string[];
  toolsAndTechnologies: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    grade?: string;
  }>;
  languages?: string[];
  interests: string[];
  resumeUrl?: string;
};

export type Page =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'profile'
  | 'resume-builder'
  | 'resume-analyzer'
  | 'career-paths'
  | 'jobs'
  | 'applications';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async (userData: User) => {
    try {
      const res = await fetch('http://localhost:5001/api/users', {
        credentials: 'include',
      });
      if (res.ok) {
        const fullProfile = await res.json();
        setUser(fullProfile);
        setCurrentPage('dashboard');
      } else {
        // if profile doesn’t exist yet, create a blank one
        const createRes = await fetch('http://localhost:5001/api/users', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ github: userData.name.toLowerCase() }),
        });
        const newProfile = await createRes.json();
        setUser(newProfile);
        setCurrentPage('dashboard');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error logging out', err);
    } finally {
      setUser(null);
      setCurrentPage('landing');
    }
  };

  // ---------------- PAGE RENDERING ----------------
  const renderPage = () => {
    if (!user && currentPage !== 'landing' && currentPage !== 'auth') {
      return <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />;
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />;
      case 'dashboard':
        return <Dashboard user={user!} onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'profile':
        return <ProfilePage user={user!} onUpdateUser={setUser} onNavigate={setCurrentPage} />;
      case 'resume-builder':
        return <ResumeBuilder user={user!} onNavigate={setCurrentPage} />;
      case 'resume-analyzer':
        return <ResumeAnalyzer user={user!} onNavigate={setCurrentPage} />;
      case 'career-paths':
        return <CareerPaths user={user!} onNavigate={setCurrentPage} />;
      case 'jobs':
        return <JobListings user={user!} onNavigate={setCurrentPage} />;
      case 'applications':
        return <Applications user={user!} onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
    }
  };

  // ---------------- MAIN RENDER ----------------
  return (
    <div className="size-full bg-background">
      {renderPage()}
      {user && <ChatbotWidget />}
      <Toaster />
    </div>
  );
}