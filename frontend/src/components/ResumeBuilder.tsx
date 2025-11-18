import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Download, Eye, Plus, X, Save, History, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import type { User, Page } from "../App";
import jsPDF from "jspdf";

type ResumeBuilderProps = {
  user: User;
  onNavigate: (page: Page) => void;
  onResumeGenerated: (pdfUrl: string) => void;
};

type Experience = {
  title: string;
  company: string;
  duration: string;
  description: string;
};

type Project = {
  name: string;
  description: string;
  technologies: string;
};

type Education = {
  degree: string;
  institution: string;
  year: string;
  description: string;
};

type SavedResumeData = {
  experiences: Experience[];
  projects: Project[];
  educations: Education[];
  summary: string;
  linkedin: string;
  github: string;
  portfolio: string;
  phone: string;
  address: string;
  certifications: string[];
  hobbies: string[];
};

type ResumeHistory = {
  _id?: string;
  userId: string;
  resumeName: string;
  data: SavedResumeData;
  createdAt: string;
  updatedAt: string;
};

export function ResumeBuilder({
  user,
  onNavigate,
  onResumeGenerated,
}: ResumeBuilderProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [resumeHistory, setResumeHistory] = useState<ResumeHistory[]>([]);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Draft state (editable)
  const [experiences, setExperiences] = useState<Experience[]>([
    { title: "", company: "", duration: "", description: "" },
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { name: "", description: "", technologies: "" },
  ]);
  const [educations, setEducations] = useState<Education[]>([
    { degree: "", institution: "", year: "", description: "" },
  ]);
  const [summary, setSummary] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [certifications, setCertifications] = useState<string[]>([""]);
  const [hobbies, setHobbies] = useState<string[]>([""]);

  // Saved state (used for preview and download)
  const [savedData, setSavedData] = useState<SavedResumeData | null>(null);

  const isDataSaved = savedData !== null;

  // MongoDB API endpoints - Update these with your actual backend URL
  const API_BASE_URL = "http://localhost:5001/api";

  // Fetch resume history on component mount
  useEffect(() => {
    fetchResumeHistory();
  }, []);

  const fetchResumeHistory = async () => {
    try {
      setIsLoading(true);
      console.log(user.email)
      const response = await fetch(`${API_BASE_URL}/resumes?userId=${encodeURIComponent(user.email)}`, 
        {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResumeHistory(data);
      }
    } catch (error) {
      console.error("Error fetching resume history:", error);
      toast.error("Failed to load resume history");
    } finally {
      setIsLoading(false);
    }
  };

  const saveResumeToMongoDB = async () => {
    if (!resumeName.trim()) {
      toast.error("Please enter a resume name");
      return;
    }

    if (resumeHistory.length >= 3 && !currentResumeId) {
      toast.error("Maximum 3 resumes allowed. Please delete one to create a new resume.");
      return;
    }

    const dataToSave: SavedResumeData = {
      experiences: [...experiences],
      projects: [...projects],
      educations: [...educations],
      summary,
      linkedin,
      github,
      portfolio,
      phone,
      address,
      certifications: [...certifications],
      hobbies: [...hobbies],
    };

    try {
      setIsLoading(true);
      const url = currentResumeId
        ? `${API_BASE_URL}/resumes/${currentResumeId}`
        : `${API_BASE_URL}/resumes`;

      const method = currentResumeId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user.email,
          resumeName,
          data: dataToSave,
        }),
      });

      if (response.ok) {
        const savedResume = await response.json();
        setSavedData(dataToSave);
        setCurrentResumeId(savedResume._id);
        await fetchResumeHistory();
        toast.success(
          currentResumeId
            ? "Resume updated successfully!"
            : "Resume saved successfully!"
        );
      } else {
        toast.error("Failed to save resume");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume");
    } finally {
      setIsLoading(false);
    }
  };

  const loadResumeFromHistory = (resume: ResumeHistory) => {
    const data = resume.data;
    setExperiences(data.experiences);
    setProjects(data.projects);
    setEducations(data.educations);
    setSummary(data.summary);
    setLinkedin(data.linkedin);
    setGithub(data.github);
    setPortfolio(data.portfolio);
    setPhone(data.phone);
    setAddress(data.address);
    setCertifications(data.certifications);
    setHobbies(data.hobbies);
    setSavedData(data);
    setResumeName(resume.resumeName);
    setCurrentResumeId(resume._id || null);
    setShowHistory(false);
    toast.success(`Loaded resume: ${resume.resumeName}`);
  };

  const deleteResumeFromHistory = async (resumeId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchResumeHistory();
        if (currentResumeId === resumeId) {
          resetForm();
        }
        toast.success("Resume deleted successfully");
      } else {
        toast.error("Failed to delete resume");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setExperiences([{ title: "", company: "", duration: "", description: "" }]);
    setProjects([{ name: "", description: "", technologies: "" }]);
    setEducations([{ degree: "", institution: "", year: "", description: "" }]);
    setSummary("");
    setLinkedin("");
    setGithub("");
    setPortfolio("");
    setPhone("");
    setAddress("");
    setCertifications([""]);
    setHobbies([""]);
    setSavedData(null);
    setResumeName("");
    setCurrentResumeId(null);
  };

  const handleSave = () => {
    const dataToSave: SavedResumeData = {
      experiences: [...experiences],
      projects: [...projects],
      educations: [...educations],
      summary,
      linkedin,
      github,
      portfolio,
      phone,
      address,
      certifications: [...certifications],
      hobbies: [...hobbies],
    };
    setSavedData(dataToSave);
    toast.success("Resume data saved locally!");
  };

  const handlePreview = () => {
    if (!isDataSaved) {
      toast.error("Please save your changes before previewing");
      return;
    }
    setShowPreview(!showPreview);
  };

  const handleDownloadClick = () => {
    if (!isDataSaved) {
      toast.error("Please save your changes before downloading");
      return;
    }
    handleDownload();
  };

  const handleDownload = () => {
  if (!savedData) return;

  try {
    const doc = new jsPDF();
    let y = 20; // vertical cursor

    // ---------- HEADER ----------
    doc.setFontSize(22);
    doc.text(user.name || "Your Name", 10, y);
    y += 10;

    doc.setFontSize(11);
    if (user.location) {
      doc.text(`${user.location}`, 10, y);
      y += 6;
    }
    if (user.email) {
      doc.text(`${user.email}`, 10, y);
      y += 6;
    }
    if (savedData.phone) {
      doc.text(`${savedData.phone}`, 10, y);
      y += 6;
    }
    if (savedData.linkedin) {
      doc.text(`${savedData.linkedin}`, 10, y);
      y += 6;
    }
    if (savedData.github) {
      doc.text(`${savedData.github}`, 10, y);
      y += 10;
    }

    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    y += 10;

    // ========== SUMMARY ==========
    if (savedData.summary) {
      doc.setFontSize(14);
      doc.text("Professional Summary", 10, y);
      y += 8;

      doc.setFontSize(11);
      const lines = doc.splitTextToSize(savedData.summary, 180);
      doc.text(lines, 10, y);
      y += lines.length * 6 + 6;
    }

    // ========== EDUCATION ==========
    if (savedData.educations?.some(e => e.degree)) {
      doc.setFontSize(14);
      doc.text("Education", 10, y);
      y += 8;

      doc.setFontSize(11);
      savedData.educations.forEach(edu => {
        if (!edu.degree) return;
        doc.text(`${edu.degree}`, 10, y);
        y += 6;
        doc.text(`${edu.institution} | ${edu.year}`, 10, y);
        y += 8;
        if (edu.description) {
          const ed = doc.splitTextToSize(edu.description, 180);
          doc.text(ed, 10, y);
          y += ed.length * 6 + 4;
        }
      });

      y += 6;
    }

    // ========== EXPERIENCE ==========
    if (savedData.experiences?.some(e => e.title)) {
      doc.setFontSize(14);
      doc.text("Experience", 10, y);
      y += 8;

      doc.setFontSize(11);
      savedData.experiences.forEach(exp => {
        if (!exp.title) return;

        doc.text(`${exp.title} — ${exp.company}`, 10, y);
        y += 6;
        if (exp.duration) {
          doc.text(`${exp.duration}`, 10, y);
          y += 6;
        }
        if (exp.description) {
          const ex = doc.splitTextToSize(exp.description, 180);
          doc.text(ex, 10, y);
          y += ex.length * 6 + 6;
        }
      });

      y += 6;
    }

    // ========== PROJECTS ==========
    if (savedData.projects?.some(p => p.name)) {
      doc.setFontSize(14);
      doc.text("Projects", 10, y);
      y += 8;

      doc.setFontSize(11);
      savedData.projects.forEach(proj => {
        if (!proj.name) return;
        doc.text(`${proj.name}`, 10, y);
        y += 6;
        if (proj.technologies) {
          doc.text(`Tech: ${proj.technologies}`, 10, y);
          y += 6;
        }
        if (proj.description) {
          const pr = doc.splitTextToSize(proj.description, 180);
          doc.text(pr, 10, y);
          y += pr.length * 6 + 6;
        }
      });

      y += 6;
    }

    // ========== CERTIFICATIONS ==========
    if (savedData.certifications?.length) {
      doc.setFontSize(14);
      doc.text("Certifications", 10, y);
      y += 8;

      doc.setFontSize(11);
      savedData.certifications.forEach(cert => {
        doc.text(`• ${cert}`, 10, y);
        y += 6;
      });

      y += 6;
    }

    // ========== SKILLS (FROM USER MODEL) ==========
    if (
      user.technicalSkills?.length ||
      user.softSkills?.length ||
      user.toolsAndTechnologies?.length
    ) {
      doc.setFontSize(14);
      doc.text("Skills", 10, y);
      y += 8;

      doc.setFontSize(12);
      if (user.technicalSkills?.length) {
        doc.text("Technical Skills:", 10, y);
        y += 6;
        doc.setFontSize(11);
        const tech = doc.splitTextToSize(user.technicalSkills.join(", "), 180);
        doc.text(tech, 10, y);
        y += tech.length * 6 + 6;
      }

      doc.setFontSize(12);
      if (user.softSkills?.length) {
        doc.text("Soft Skills:", 10, y);
        y += 6;
        doc.setFontSize(11);
        const soft = doc.splitTextToSize(user.softSkills.join(", "), 180);
        doc.text(soft, 10, y);
        y += soft.length * 6 + 6;
      }

      doc.setFontSize(12);
      if (user.toolsAndTechnologies?.length) {
        doc.text("Tools & Technologies:", 10, y);
        y += 6;
        doc.setFontSize(11);
        const tools = doc.splitTextToSize(user.toolsAndTechnologies.join(", "), 180);
        doc.text(tools, 10, y);
        y += tools.length * 6 + 6;
      }

      y += 6;
    }

    // ========== LANGUAGES ==========
    if (user.languages?.length) {
      doc.setFontSize(14);
      doc.text("Languages", 10, y);
      y += 8;

      doc.setFontSize(11);
      const langs = doc.splitTextToSize(user.languages.join(", "), 180);
      doc.text(langs, 10, y);
      y += langs.length * 6 + 6;
    }

    // ========== INTERESTS ==========
    if (user.interests?.length) {
      doc.setFontSize(14);
      doc.text("Interests", 10, y);
      y += 8;

      doc.setFontSize(11);
      user.interests.forEach(interest => {
        doc.text(`• ${interest}`, 10, y);
        y += 6;
      });
    }

    // ---------- DOWNLOAD ----------
    const blob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${resumeName || user.name || "resume"}.pdf`;
    link.click();

    toast.success("Resume downloaded successfully!");

  } catch (error) {
    console.error(error);
    toast.error("Failed to generate resume.");
  }
};

  // --- Experience Handlers ---
  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { title: "", company: "", duration: "", description: "" },
    ]);
  };
  const handleUpdateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };
  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // --- Project Handlers ---
  const handleAddProject = () =>
    setProjects([...projects, { name: "", description: "", technologies: "" }]);
  const handleUpdateProject = (
    index: number,
    field: keyof Project,
    value: string
  ) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };
  const handleRemoveProject = (index: number) =>
    setProjects(projects.filter((_, i) => i !== index));

  // --- Certification Handlers ---
  const handleAddCertification = () => setCertifications([...certifications, ""]);
  const handleUpdateCertification = (index: number, value: string) => {
    const updated = [...certifications];
    updated[index] = value;
    setCertifications(updated);
  };
  const handleRemoveCertification = (index: number) =>
    setCertifications(certifications.filter((_, i) => i !== index));

  // --- Hobby Handlers ---
  const handleAddHobby = () => setHobbies([...hobbies, ""]);
  const handleUpdateHobby = (index: number, value: string) => {
    const updated = [...hobbies];
    updated[index] = value;
    setHobbies(updated);
  };
  const handleRemoveHobby = (index: number) =>
    setHobbies(hobbies.filter((_, i) => i !== index));

  // --- Education Handlers ---
  const handleAddEducation = () =>
    setEducations([
      ...educations,
      { degree: "", institution: "", year: "", description: "" },
    ]);
  const handleUpdateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };
  const handleRemoveEducation = (index: number) =>
    setEducations(educations.filter((_, i) => i !== index));

  const ResumePreview = () => {
  if (!savedData || !user) return null;

  // Merge all dynamic skills from user model
  const allSkills = [
    ...(user.technicalSkills || []),
    ...(user.softSkills || []),
    ...(user.toolsAndTechnologies || []),
  ];

  return (
    <div className="bg-white text-black p-8 space-y-6">

      {/* HEADER */}
      <div className="text-center border-b-2 border-black pb-4">
        <h1 className="text-3xl mb-2">{user.name || "Your Name"}</h1>

        {/* Contact */}
        {savedData.phone && <p className="text-sm">📞 {savedData.phone}</p>}
        {savedData.address && <p className="text-sm">🏠 {savedData.address}</p>}
        
        <p className="text-sm">{user.email}</p>

        {user.linkedin && (
          <p className="text-sm">🔗 LinkedIn: {user.linkedin}</p>
        )}

        {user.github && (
          <p className="text-sm">🐱 GitHub: {user.github}</p>
        )}

        {user.portfolio && (
          <p className="text-sm">💼 Portfolio: {user.portfolio}</p>
        )}
      </div>

      {/* EDUCATION */}
      {savedData.educations?.some(e => e.degree) && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">Education</h2>
          <div className="space-y-3">
            {savedData.educations
              .filter(e => e.degree)
              .map((edu, idx) => (
                <div key={idx}>
                  <h3 className="text-base">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">
                    {edu.institution} | {edu.year}
                  </p>
                  {edu.description && (
                    <p className="text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUMMARY */}
      {savedData.summary && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">
            Professional Summary
          </h2>
          <p className="text-sm">{savedData.summary}</p>
        </div>
      )}

      {/* SKILLS (DIRECTLY FROM USER MODEL) */}
      {allSkills.length > 0 && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-sm bg-gray-200 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* EXPERIENCE */}
      {savedData.experiences?.some(e => e.title) && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">Experience</h2>
          <div className="space-y-3">
            {savedData.experiences
              .filter(e => e.title)
              .map((exp, idx) => (
                <div key={idx}>
                  <h3 className="text-base">{exp.title}</h3>
                  <p className="text-sm text-gray-600">
                    {exp.company} | {exp.duration}
                  </p>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {savedData.projects?.some(p => p.name) && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">Projects</h2>
          <div className="space-y-3">
            {savedData.projects
              .filter(p => p.name)
              .map((proj, idx) => (
                <div key={idx}>
                  <h3 className="text-base">{proj.name}</h3>
                  <p className="text-sm">{proj.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Technologies: {proj.technologies}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CERTIFICATIONS */}
      {savedData.certifications?.some(c => c) && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">Certifications</h2>
          <ul className="list-disc pl-5 text-sm">
            {savedData.certifications
              .filter(c => c)
              .map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
          </ul>
        </div>
      )}

      {/* HOBBIES */}
      {savedData.hobbies?.some(h => h) && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">
            Hobbies & Interests
          </h2>
          <ul className="list-disc pl-5 text-sm">
            {savedData.hobbies
              .filter(h => h)
              .map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

  const HistoryTab = () => (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Resume History</h2>
          <p className="text-muted-foreground">
            You can save up to 3 resumes. Load or delete existing resumes.
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowHistory(false)}>
          Back to Editor
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          <p>Loading resume history...</p>
        </Card>
      ) : resumeHistory.length === 0 ? (
        <Card className="p-8 text-center">
          <History className="size-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg mb-2">No Resumes Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first resume to get started!
          </p>
          <Button onClick={() => setShowHistory(false)}>
            Create Resume
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {resumeHistory.map((resume) => (
            <Card key={resume._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {resume.resumeName}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      Created: {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {resume.data.experiences.filter((e) => e.title).length >
                        0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {
                            resume.data.experiences.filter((e) => e.title)
                              .length
                          }{" "}
                          Experience(s)
                        </span>
                      )}
                      {resume.data.projects.filter((p) => p.name).length >
                        0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {resume.data.projects.filter((p) => p.name).length}{" "}
                          Project(s)
                        </span>
                      )}
                      {resume.data.educations.filter((e) => e.degree).length >
                        0 && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {
                            resume.data.educations.filter((e) => e.degree)
                              .length
                          }{" "}
                          Education(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadResumeFromHistory(resume)}
                  >
                    <Edit className="size-4 mr-2" />
                    Load
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteResumeFromHistory(resume._id!)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {resumeHistory.length < 3 && (
        <Card className="p-4 bg-accent">
          <p className="text-sm text-muted-foreground">
            💡 You have {3 - resumeHistory.length} resume slot(s) remaining.
          </p>
        </Card>
      )}
    </div>
  );

  return (
    <DashboardLayout
      currentPage="resume-builder"
      onNavigate={onNavigate}
      userName={user.name}
    >
        <div className="p-8">
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="mb-2">Resume Builder</h1>
        <p className="text-muted-foreground">
          Create a professional resume using your profile data
        </p>

        {/* How It Works */}
        <div className="mt-6 max-w-xl">
          <h2 className="text-base font-semibold mb-1">How it works</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your data is saved locally when you click the save button. Only then
            can you preview the resume template. Once you're satisfied with how
            it appears, you can save it to the database or download it for job
            applications.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History className="size-4 mr-2" />
          History ({resumeHistory.length}/3)
        </Button>

        {!showHistory && (
          <>
            {currentResumeId && (
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  toast.success("Ready to create a new resume!");
                }}
              >
                <Plus className="size-4 mr-2" />
                New Resume
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!isDataSaved}
            >
              <Eye className="size-4 mr-2" />
              {showPreview ? "Edit" : "Preview"}
            </Button>

            <Button onClick={handleDownloadClick} disabled={!isDataSaved}>
              <Download className="size-4 mr-2" />
              Download PDF
            </Button>

            <Button onClick={handleSave}>
              <Save className="size-4 mr-2" />
              Save
            </Button>
          </>
        )}
      </div>
    </div>

        {showHistory ? (
          <HistoryTab />
        ) : showPreview ? (
          <Card className="max-w-4xl mx-auto">
            <ResumePreview />
          </Card>
        ) : (
          <div className="max-w-4xl space-y-6">
            {/* Resume Name */}
            <Card className="p-6">
              <h3 className="mb-4">Resume Name</h3>
              <Input
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="e.g., Software Engineer Resume"
              />
              <div className="mt-4">
                <Button
                  onClick={saveResumeToMongoDB}
                  disabled={isLoading || !resumeName.trim()}
                  className="w-full"
                >
                  {isLoading
                    ? "Saving..."
                    : currentResumeId
                    ? "Update in Database"
                    : "Save to Database"}
                </Button>
              </div>
            </Card>

            {/* Professional Summary */}
            <Card className="p-6">
              <h3 className="mb-4">Professional Summary</h3>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write a brief summary about yourself, your expertise, and career goals..."
                rows={4}
              />
            </Card>

            {/* Education */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Education</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddEducation}
                >
                  <Plus className="size-4 mr-2" />
                  Add Education
                </Button>
              </div>
              <div className="space-y-6">
                {educations.map((edu, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <h4>Education {index + 1}</h4>
                      {educations.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEducation(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            handleUpdateEducation(
                              index,
                              "degree",
                              e.target.value
                            )
                          }
                          placeholder="e.g., B.Tech in CSE"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) =>
                            handleUpdateEducation(
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Sarala Birla University"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Year / Duration</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) =>
                          handleUpdateEducation(index, "year", e.target.value)
                        }
                        placeholder="e.g., 2022 - 2026"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={edu.description}
                        onChange={(e) =>
                          handleUpdateEducation(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Optional description / achievements"
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact & Links */}
            <Card className="p-6">
              <h3 className="mb-4">Contact & Links</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +91 9876543210"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., Ranchi, Jharkhand"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>GitHub</Label>
                  <Input
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Portfolio / Website</Label>
                  <Input
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Certifications</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCertification}
                >
                  <Plus className="size-4 mr-2" />
                  Add Certification
                </Button>
              </div>
              <div className="space-y-3">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={cert}
                      onChange={(e) =>
                        handleUpdateCertification(idx, e.target.value)
                      }
                      placeholder="Enter certification name"
                    />
                    {certifications.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCertification(idx)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Hobbies */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Hobbies & Interests</h3>
                <Button variant="outline" size="sm" onClick={handleAddHobby}>
                  <Plus className="size-4 mr-2" />
                  Add Hobby
                </Button>
              </div>
              <div className="space-y-3">
                {hobbies.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={h}
                      onChange={(e) => handleUpdateHobby(idx, e.target.value)}
                      placeholder="Enter hobby or interest"
                    />
                    {hobbies.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveHobby(idx)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Experience Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Work Experience</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddExperience}
                >
                  <Plus className="size-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <h4>Experience {index + 1}</h4>
                      {experiences.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExperience(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) =>
                            handleUpdateExperience(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Software Engineer"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) =>
                            handleUpdateExperience(
                              index,
                              "company",
                              e.target.value
                            )
                          }
                          placeholder="e.g., TechCorp"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={exp.duration}
                        onChange={(e) =>
                          handleUpdateExperience(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Jan 2023 - Present"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) =>
                          handleUpdateExperience(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Projects Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Projects</h3>
                <Button variant="outline" size="sm" onClick={handleAddProject}>
                  <Plus className="size-4 mr-2" />
                  Add Project
                </Button>
              </div>
              <div className="space-y-6">
                {projects.map((proj, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <h4>Project {index + 1}</h4>
                      {projects.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProject(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Label>Project Name</Label>
                      <Input
                        value={proj.name}
                        onChange={(e) =>
                          handleUpdateProject(index, "name", e.target.value)
                        }
                        placeholder="e.g., CareerPilot Platform"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={proj.description}
                        onChange={(e) =>
                          handleUpdateProject(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe what the project does and your role..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Technologies Used</Label>
                      <Input
                        value={proj.technologies}
                        onChange={(e) =>
                          handleUpdateProject(
                            index,
                            "technologies",
                            e.target.value
                          )
                        }
                        placeholder="e.g., React, Node.js, MongoDB"
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-4 bg-accent">
              <p className="text-sm text-muted-foreground">
                💡 Your basic info, skills, and education from your profile are
                automatically included. Update your{" "}
                <button
                  onClick={() => onNavigate("profile")}
                  className="text-primary underline"
                >
                  profile
                </button>{" "}
                to modify them.
              </p>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}