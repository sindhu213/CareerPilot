import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User } from '../App';

type AuthPageProps = {
  onLogin: (user: User) => void;
  onBack: () => void;
};

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // inside AuthPage component (modify existing handlers)
const API = "http://localhost:5001/api/auth";

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // important: accept httpOnly cookie
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Login failed");
      return;
    }

    toast.success("Login successful!");
    onLogin(data.user);
  } catch (err) {
    console.error(err);
    toast.error("Network error");
  }
};

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (!signupName || !signupEmail || !signupPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        github: "", 
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Signup failed");
      return;
    }

    toast.success("Account created successfully!");
    onLogin(data.user);
  } catch (err) {
    console.error(err);
    toast.error("Network error");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={onBack}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="size-6 text-primary-foreground" />
            </div>
            <h2 className="text-primary">CareerPilot</h2>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your Name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
