

import { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User, Page } from '../App';

type ResumeAnalyzerProps = {
  user: User;
  onNavigate: (page: Page) => void;
};

type AnalysisResult = {
  score: number;
  extractedSkills: string[];
  suggestions: string[];
  missingSkills: string[];
  strengths: string[];
};

export function ResumeAnalyzer({ user, onNavigate }: ResumeAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
  if (!file) {
    toast.error('Please upload a resume first');
    return;
  }
  setAnalyzing(true);

  try {
    const form = new FormData();
    form.append('file', file);
    if (jobDescription) form.append('jobDescription', jobDescription);
    // optionally include userId
    if (user?.id) form.append('userId', user.id);

    const resp = await fetch('http://localhost:5001/api/resume/analyze', {
      method: 'POST',
      body: form
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Failed to analyze');
    setAnalysis({
      score: data.analysis.score,
      extractedSkills: data.analysis.extracted_skills || [],
      suggestions: data.analysis.suggestions || [],
      missingSkills: data.analysis.missing_skills || [],
      strengths: data.analysis.strengths || []
    });
    toast.success('Resume analysis complete!');
  } catch (err) {
    console.error(err);
    toast.error('Analysis failed: ' + (err.message || 'Unknown error'));
  } finally {
    setAnalyzing(false);
  }
};

  return (
    <DashboardLayout
      currentPage="resume-analyzer"
      onNavigate={onNavigate}
      userName={user.name}
    >
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-2">Resume Analyzer</h1>
          <p className="text-muted-foreground">
            Upload your resume and optionally enter a job description for
            AI-powered analysis.
          </p>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Upload Section */}
          <Card className="p-8 space-y-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="size-8 text-primary" />
              </div>
              <h3 className="mb-2">Upload Your Resume</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Supported formats: PDF, DOCX (Max size: 5MB)
              </p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button asChild>
                  <span>Choose File</span>
                </Button>
              </label>

              {file && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <FileText className="size-4" />
                  <span>{file.name}</span>
                  <Badge variant="secondary">
                    {(file.size / 1024).toFixed(2)} KB
                  </Badge>
                </div>
              )}
            </div>

            {/* Optional Job Description */}
            <div className="space-y-2">
              <h3 className="text-base font-medium">Optional: Job Description</h3>
              <p className="text-sm text-muted-foreground">
                Paste a job description here to get a role-specific resume analysis.
              </p>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            {file && !analysis && (
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing
                  ? 'Analyzing...'
                  : jobDescription
                  ? 'Analyze Based on Job Description'
                  : 'Analyze Resume'}
              </Button>
            )}
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <>
              {/* Overall Score */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Overall Resume Score</h3>
                  <div className="text-3xl text-primary">{analysis.score}%</div>
                </div>
                <Progress value={analysis.score} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  {analysis.score >= 80
                    ? 'Excellent resume!'
                    : analysis.score >= 60
                    ? 'Good resume with room for improvement'
                    : 'Your resume needs significant improvements'}
                </p>
              </Card>

              {/* Extracted Skills */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="size-5 text-primary" />
                  <h3>Extracted Skills</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  AI detected the following skills from your resume:
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.extractedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      <CheckCircle2 className="size-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Strengths */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="size-5 text-green-600" />
                  <h3>Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Improvement Suggestions */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="size-5 text-primary" />
                  <h3>Improvement Suggestions</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="size-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-primary">{idx + 1}</span>
                      </div>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Missing Skills */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="size-5 text-orange-600" />
                  <h3>Recommended Skills to Add</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on {jobDescription ? 'this job description' : 'industry standards'},
                  consider learning these skills:
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button onClick={() => onNavigate('resume-builder')}>
                  Build Improved Resume
                </Button>
                <Button variant="outline" onClick={() => onNavigate('career-paths')}>
                  View Career Recommendations
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setJobDescription('');
                    setAnalysis(null);
                  }}
                >
                  Analyze Another Resume
                </Button>
              </div>
            </>
          )}

          {/* Info Alert */}
          {!analysis && (
            <Alert>
              <AlertDescription>
                <strong>How it works:</strong> Our AI analyzes your resume, extracts key
                skills, compares them with {jobDescription ? 'the provided job description' : 'industry benchmarks'}, 
                and offers personalized suggestions to make your resume stand out. All data is processed securely.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
