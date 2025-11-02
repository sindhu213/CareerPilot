
import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Download, Eye, Plus, X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import type { User, Page } from "../App";

type ResumeBuilderProps = {
  user: User;
  onNavigate: (page: Page) => void;
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

export function ResumeBuilder({
  user,
  onNavigate,
}: ResumeBuilderProps) {
  const [showPreview, setShowPreview] = useState(false);
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

  // New fields
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Dynamic fields
  const [certifications, setCertifications] = useState<
    string[]
  >([""]);
  const [hobbies, setHobbies] = useState<string[]>([""]);

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
    value: string,
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
    setProjects([
      ...projects,
      { name: "", description: "", technologies: "" },
    ]);
  const handleUpdateProject = (
    index: number,
    field: keyof Project,
    value: string,
  ) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };
  const handleRemoveProject = (index: number) =>
    setProjects(projects.filter((_, i) => i !== index));

  // --- Certification Handlers ---
  const handleAddCertification = () =>
    setCertifications([...certifications, ""]);
  const handleUpdateCertification = (
    index: number,
    value: string,
  ) => {
    const updated = [...certifications];
    updated[index] = value;
    setCertifications(updated);
  };
  const handleRemoveCertification = (index: number) =>
    setCertifications(
      certifications.filter((_, i) => i !== index),
    );

  // --- Hobby Handlers ---
  const handleAddHobby = () => setHobbies([...hobbies, ""]);
  const handleUpdateHobby = (index: number, value: string) => {
    const updated = [...hobbies];
    updated[index] = value;
    setHobbies(updated);
  };
  const handleRemoveHobby = (index: number) =>
    setHobbies(hobbies.filter((_, i) => i !== index));

  const handleDownload = () => {
    toast.success("Resume downloaded successfully!");
    // Implement jsPDF or html2pdf in production
  };

  // --- Education Handlers ---
  const handleAddEducation = () =>
    setEducations([
      ...educations,
      {
        degree: "",
        institution: "",
        year: "",
        description: "",
      },
    ]);
  const handleUpdateEducation = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };
  const handleRemoveEducation = (index: number) =>
    setEducations(educations.filter((_, i) => i !== index));

  const ResumePreview = () => (
    <div className="bg-white text-black p-8 space-y-6">
      <div className="text-center border-b-2 border-black pb-4">
        <h1 className="text-3xl mb-2">{user.name}</h1>
        {phone && <p className="text-sm">📞 {phone}</p>}
        {address && <p className="text-sm">🏠 {address}</p>}
        <p className="text-sm">{user.email}</p>
        {linkedin && (
          <p className="text-sm">🔗 LinkedIn: {linkedin}</p>
        )}
        {github && (
          <p className="text-sm">🐱 GitHub: {github}</p>
        )}
        {portfolio && (
          <p className="text-sm">💼 Portfolio: {portfolio}</p>
        )}
      </div>

      {educations.some((e) => e.degree) && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">
            Education
          </h2>
          <div className="space-y-3">
            {educations
              .filter((e) => e.degree)
              .map((edu, idx) => (
                <div key={idx}>
                  <h3 className="text-base">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">
                    {edu.institution} | {edu.year}
                  </p>
                  {edu.description && (
                    <p className="text-sm mt-1">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {summary && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">
            Professional Summary
          </h2>
          <p className="text-sm">{summary}</p>
        </div>
      )}

      {user.skills.length > 0 && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="text-sm bg-gray-200 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {experiences.some((e) => e.title) && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">
            Experience
          </h2>
          <div className="space-y-3">
            {experiences
              .filter((e) => e.title)
              .map((exp, idx) => (
                <div key={idx}>
                  <h3 className="text-base">{exp.title}</h3>
                  <p className="text-sm text-gray-600">
                    {exp.company} | {exp.duration}
                  </p>
                  <p className="text-sm mt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {projects.some((p) => p.name) && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">
            Projects
          </h2>
          <div className="space-y-3">
            {projects
              .filter((p) => p.name)
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

      {certifications.some((c) => c) && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">
            Certifications
          </h2>
          <ul className="list-disc pl-5 text-sm">
            {certifications
              .filter((c) => c)
              .map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
          </ul>
        </div>
      )}

      {hobbies.some((h) => h) && (
        <div>
          <h2 className="text-xl mb-2 border-b border-gray-300">
            Hobbies & Interests
          </h2>
          <ul className="list-disc pl-5 text-sm">
            {hobbies
              .filter((h) => h)
              .map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
          </ul>
        </div>
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
              Create a professional resume using your profile
              data
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="size-4 mr-2" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="size-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {showPreview ? (
          <Card className="max-w-4xl mx-auto">
            <ResumePreview />
          </Card>
        ) : (
          <div className="max-w-4xl space-y-6">
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

            {/* education */}

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
                          onClick={() =>
                            handleRemoveEducation(index)
                          }
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
                              e.target.value,
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
                              e.target.value,
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
                          handleUpdateEducation(
                            index,
                            "year",
                            e.target.value,
                          )
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
                            e.target.value,
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
                    onChange={(e) =>
                      setLinkedin(e.target.value)
                    }
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
                    onChange={(e) =>
                      setPortfolio(e.target.value)
                    }
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
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={cert}
                      onChange={(e) =>
                        handleUpdateCertification(
                          idx,
                          e.target.value,
                        )
                      }
                      placeholder="Enter certification name"
                    />
                    {certifications.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveCertification(idx)
                        }
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddHobby}
                >
                  <Plus className="size-4 mr-2" />
                  Add Hobby
                </Button>
              </div>
              <div className="space-y-3">
                {hobbies.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={h}
                      onChange={(e) =>
                        handleUpdateHobby(idx, e.target.value)
                      }
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
                          onClick={() =>
                            handleRemoveExperience(index)
                          }
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
                              e.target.value,
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
                              e.target.value,
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
                            e.target.value,
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
                            e.target.value,
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddProject}
                >
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
                          onClick={() =>
                            handleRemoveProject(index)
                          }
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
                          handleUpdateProject(
                            index,
                            "name",
                            e.target.value,
                          )
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
                            e.target.value,
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
                            e.target.value,
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
                💡 Your basic info, skills, and education from
                your profile are automatically included. Update
                your{" "}
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