import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  Sparkles, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  Briefcase, 
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type LandingPageProps = {
  onGetStarted: () => void;
};

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <h1 className="text-primary">CareerPilot</h1>
          </div>
          <Button onClick={onGetStarted}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-6">
                <Sparkles className="size-4 text-primary" />
                <span className="text-sm text-primary">AI-Powered Career Platform</span>
              </div>
              <h1 className="text-5xl mb-6">
                 Intelligent AI Platform for Resume Enhancement and Career Planning 
              </h1>
              <p className="text-muted-foreground mb-8 text-lg">
                CareerPilot helps you discover your ideal career path with AI-powered insights, smart resume 
                enhancement, and personalized job matching — all within a secure, interactive platform built to 
                guide you from self-discovery to successful placement.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={onGetStarted}>
                  Start Your Journey
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
              <div className="mt-8 flex gap-8">
                <div>
                  <div className="text-3xl text-primary mb-1">10K+</div>
                  <div className="text-sm text-muted-foreground">Users Empowered</div>
                </div>
                <div>
                  <div className="text-3xl text-primary mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Career Paths</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759593218431-6f1585bc14de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBwcm9mZXNzaW9uYWwlMjBvZmZpY2V8ZW58MXx8fHwxNzYxMDM3ODg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Professional workspace"
                  className="size-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4">Powerful Features for Your Success</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, optimize, and advance your career in one intelligent platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="size-6 text-primary" />
              </div>
              <h3 className="mb-2">Smart Resume Builder</h3>
              <p className="text-sm text-muted-foreground">
                Create professional resumes with AI-powered suggestions and auto-filled content from your profile
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="size-6 text-primary" />
              </div>
              <h3 className="mb-2">Resume Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Upload existing resumes for AI-driven skill extraction and targeted improvement suggestions
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-primary" />
              </div>
              <h3 className="mb-2">Career Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized career path suggestions based on your skills, education, and interests
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h3 className="mb-2">AI Career Coach</h3>
              <p className="text-sm text-muted-foreground">
                24/7 AI chatbot assistance for career queries, skill gaps, and application strategies
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="size-6 text-primary" />
              </div>
              <h3 className="mb-2">Job Listings</h3>
              <p className="text-sm text-muted-foreground">
                Browse curated job opportunities with one-click applications tailored to your profile
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="size-6 text-primary" />
              </div>
              <h3 className="mb-2">Skill Gap Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Identify missing skills and get learning recommendations to bridge the gap
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="size-6 text-primary" />
              </div>
              <h3 className="mb-2">Secure Platform</h3>
              <p className="text-sm text-muted-foreground">
                JWT-based authentication ensures your data and career information stay protected
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="size-6 text-primary" />
              </div>
              <h3 className="mb-2">Personalized Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Track your progress, applications, and career milestones all in one place
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4">How CareerPilot Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to transform your career journey
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Create Profile', desc: 'Sign up and build your professional profile with skills, education, and interests' },
              { step: 2, title: 'Build/Analyze Resume', desc: 'Generate a new resume or upload existing one for AI-powered analysis' },
              { step: 3, title: 'Get Recommendations', desc: 'Receive personalized career paths and skill development suggestions' },
              { step: 4, title: 'Apply to Jobs', desc: 'Browse matched opportunities and apply with one click' }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="size-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-center mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground text-center">{item.desc}</p>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-4 text-primary-foreground">Ready to Pilot Your Career?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Join thousands of professionals who are already using AI to advance their careers
          </p>
          <Button size="lg" variant="secondary" onClick={onGetStarted}>
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CareerPilot. CSE Department Project - SBU.</p>
          <p className="mt-2">Developed by Sindhu Kumari, Anjali Kumari, Pragya Kumari</p>
        </div>
      </footer>
    </div>
  );
}
