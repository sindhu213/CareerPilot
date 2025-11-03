import { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { X, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User, Page } from '../App';

type ProfilePageProps = {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigate: (page: Page) => void;
};

export function ProfilePage({ user, onUpdateUser, onNavigate }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);

  // ---- Shared State ----
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [location, setLocation] = useState(user.location || '');
  const [linkedin, setLinkedin] = useState(user.linkedin || '');
  const [github, setGithub] = useState(user.github || '');
  const [portfolio, setPortfolio] = useState(user.portfolio || '');
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(user.profileImageUrl);

  const [technicalSkills, setTechnicalSkills] = useState<string[]>(user.technicalSkills || []);
  const [softSkills, setSoftSkills] = useState<string[]>(user.softSkills || []);
  const [toolsAndTechnologies, setToolsAndTechnologies] = useState<string[]>(user.toolsAndTechnologies || []);
  const [newSkill, setNewSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState<'technical' | 'soft' | 'tools'>('technical');

  const [education, setEducation] = useState(
    user.education?.length
      ? user.education
      : [{ degree: '', institution: '', year: '', grade: '' }]
  );

  const [languages, setLanguages] = useState<string[]>(user.languages || []);
  const [newLanguage, setNewLanguage] = useState('');
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [newInterest, setNewInterest] = useState('');

  // ---- Handlers ----
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImageUrl(URL.createObjectURL(file));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const skill = newSkill.trim();
    if (skillCategory === 'technical' && !technicalSkills.includes(skill))
      setTechnicalSkills([...technicalSkills, skill]);
    else if (skillCategory === 'soft' && !softSkills.includes(skill))
      setSoftSkills([...softSkills, skill]);
    else if (skillCategory === 'tools' && !toolsAndTechnologies.includes(skill))
      setToolsAndTechnologies([...toolsAndTechnologies, skill]);
    setNewSkill('');
  };

  const handleRemoveSkill = (category: string, skill: string) => {
    if (category === 'technical') setTechnicalSkills(technicalSkills.filter((s) => s !== skill));
    else if (category === 'soft') setSoftSkills(softSkills.filter((s) => s !== skill));
    else if (category === 'tools') setToolsAndTechnologies(toolsAndTechnologies.filter((s) => s !== skill));
  };

  const handleAddEducation = () => {
    setEducation([...education, { degree: '', institution: '', year: '', grade: '' }]);
  };
  const handleUpdateEducation = (i: number, field: string, value: string) => {
    const updated = [...education];
    updated[i] = { ...updated[i], [field]: value };
    setEducation(updated);
  };
  const handleRemoveEducation = (i: number) => {
    setEducation(education.filter((_, idx) => idx !== i));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };
  const handleRemoveLanguage = (lang: string) => setLanguages(languages.filter((l) => l !== lang));

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };
  const handleRemoveInterest = (interest: string) =>
    setInterests(interests.filter((i) => i !== interest));

  const handleSave = async () => {
    if (!github.trim()) {
      toast.error('GitHub link is mandatory.');
      return;
    }
    const updatedUser: User = {
      ...user,
      name,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolio,
      profileImageUrl,
      technicalSkills,
      softSkills,
      toolsAndTechnologies,
      education,
      languages,
      interests,
    };
    try {
      const res = await fetch("http://localhost:5001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(updatedUser),
      });

    if (!res.ok) throw new Error("Failed to save data");
    const savedUser = await res.json();

    onUpdateUser(savedUser);
    toast.success("Profile saved to MongoDB!");
    setIsEditing(false);
  } catch (error) {
    toast.error("Error saving data");
    console.error(error);
  }
  };

  // ---------------- VIEW MODE ----------------
  if (!isEditing) {
    return (
      <DashboardLayout currentPage="profile" onNavigate={onNavigate} userName={user.name}>
        <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-sm">
                  No Photo
                </div>
              )}
            </div>
            <h1 className="text-2xl font-semibold">{name || 'No name provided'}</h1>
            <p className="text-sm text-muted-foreground">{email || 'No email provided'}</p>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </div>

          <Card className="p-6 space-y-2">
            <h3 className="text-lg font-semibold mb-2">Basic Details</h3>
            <p><strong>Phone:</strong> {phone || 'Not provided'}</p>
            <p><strong>Location:</strong> {location || 'Not provided'}</p>
          </Card>

          <Card className="p-6 space-y-2">
            <h3 className="text-lg font-semibold mb-2">Important Links</h3>
            <p><strong>LinkedIn:</strong> {linkedin || 'Not provided'}</p>
            <p><strong>GitHub:</strong> {github || 'Not provided'}</p>
            <p><strong>Portfolio:</strong> {portfolio || 'Not provided'}</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Skills</h3>
            <SkillCategory title="Technical Skills" list={technicalSkills} />
            <SkillCategory title="Soft Skills" list={softSkills} />
            <SkillCategory title="Tools & Technologies" list={toolsAndTechnologies} />
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Education</h3>
            {education.map((edu, i) => (
              <div key={i}>
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">
                  {edu.institution} • {edu.year} {edu.grade && `• ${edu.grade}`}
                </p>
              </div>
            ))}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Languages</h3>
            <TagList list={languages} />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Career Interests</h3>
            <TagList list={interests} />
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // ---------------- EDIT MODE ----------------
  return (
    <DashboardLayout currentPage="profile" onNavigate={onNavigate} userName={user.name}>
      <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Edit Profile</h1>
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>

        {/* PHOTO */}
        <Card className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-sm">
                No Photo
              </div>
            )}
          </div>
          <label className="cursor-pointer flex items-center gap-1 text-sm text-primary hover:underline">
            <Upload className="size-4" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </Card>

        {/* BASIC DETAILS */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Basic Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={name} onChange={setName} />
            <Field label="Email" value={email} onChange={setEmail} />
            <Field label="Phone" value={phone} onChange={setPhone} />
            <Field label="Location" value={location} onChange={setLocation} />
          </div>
        </Card>

        {/* LINKS */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Important Links</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="LinkedIn (optional)" value={linkedin} onChange={setLinkedin} />
            <Field label="GitHub (mandatory)" value={github} onChange={setGithub} />
            <div className="sm:col-span-2">
              <Field label="Portfolio (optional)" value={portfolio} onChange={setPortfolio} />
            </div>
          </div>
        </Card>

        {/* SKILLS */}
        <Card className="p-6 space-y-6">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="flex gap-2 mb-3">
            <select
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value as any)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="technical">Technical</option>
              <option value="soft">Soft</option>
              <option value="tools">Tools & Technologies</option>
            </select>
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <Button onClick={handleAddSkill}><Plus className="size-4" /></Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <SkillCategory title="Technical Skills" list={technicalSkills} onRemove={(s) => handleRemoveSkill('technical', s)} />
            <SkillCategory title="Soft Skills" list={softSkills} onRemove={(s) => handleRemoveSkill('soft', s)} />
            <SkillCategory title="Tools & Technologies" list={toolsAndTechnologies} onRemove={(s) => handleRemoveSkill('tools', s)} />
          </div>
        </Card>

        {/* EDUCATION */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Education</h3>
            <Button variant="outline" size="sm" onClick={handleAddEducation}><Plus className="size-4 mr-1" /> Add</Button>
          </div>
          {education.map((edu, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3 mb-3">
              <div className="flex justify-end">
                {education.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveEducation(i)}>
                    <X className="size-4" />
                  </Button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Degree" value={edu.degree} onChange={(e) => handleUpdateEducation(i, 'degree', e.target.value)} />
                <Input placeholder="Institution" value={edu.institution} onChange={(e) => handleUpdateEducation(i, 'institution', e.target.value)} />
                <Input placeholder="Year" value={edu.year} onChange={(e) => handleUpdateEducation(i, 'year', e.target.value)} />
                <Input placeholder="Grade / GPA" value={edu.grade || ''} onChange={(e) => handleUpdateEducation(i, 'grade', e.target.value)} />
              </div>
            </div>
          ))}
        </Card>

        {/* LANGUAGES */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Languages</h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add a language..."
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddLanguage()}
            />
            <Button onClick={handleAddLanguage}><Plus className="size-4" /></Button>
          </div>
          <TagList list={languages} onRemove={handleRemoveLanguage} emptyText="No languages added yet" />
        </Card>

        {/* INTERESTS */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Career Interests</h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add an interest..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
            />
            <Button onClick={handleAddInterest}><Plus className="size-4" /></Button>
          </div>
          <TagList list={interests} onRemove={handleRemoveInterest} emptyText="No interests added yet" />
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSave} size="lg">Save Changes</Button>
          <Button variant="outline" size="lg" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper Components
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SkillCategory({ title, list, onRemove }: { title: string; list: string[]; onRemove?: (skill: string) => void }) {
  return (
    <div>
      <h4 className="font-medium mb-2">{title}</h4>
      {list.length ? (
        <div className="flex flex-wrap gap-2">
          {list.map((skill) => (
            <Badge key={skill} variant="secondary" className="px-3 py-1">
              {skill}
              {onRemove && (
                <button onClick={() => onRemove(skill)} className="ml-2 hover:text-destructive">
                  <X className="size-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No skills added</p>
      )}
    </div>
  );
}

function TagList({ list, onRemove, emptyText }: { list: string[]; onRemove?: (value: string) => void; emptyText?: string }) {
  if (!list.length) return <p className="text-sm text-muted-foreground">{emptyText || 'None'}</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((val) => (
        <Badge key={val} variant="secondary" className="px-3 py-1">
          {val}
          {onRemove && (
            <button onClick={() => onRemove(val)} className="ml-2 hover:text-destructive">
              <X className="size-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}