"use client";

import { useState } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Eye, 
  Copy, 
  Check 
} from "lucide-react";

type Basics = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  headline?: string;
};

type EducationItem = {
  institution?: string;
  degree?: string;
  endDate?: string;
};

type WorkExperienceItem = {
  company?: string;
  position?: string;
  duration?: string;
  highlights?: string[];
};

type ProjectItem = {
  name?: string;
  description?: string;
  technologies?: string[];
};

type StructuredResume = {
  basics?: Basics;
  education?: EducationItem[];
  workExperience?: WorkExperienceItem[];
  projects?: ProjectItem[];
};

type ResumeRendererProps = {
  resumeText: string;
  structuredResumeStr: string | null;
  className?: string;
};

export default function ResumeRenderer({ resumeText, structuredResumeStr, className = "" }: ResumeRendererProps) {
  const [activeTab, setActiveTab] = useState<"formatted" | "raw">("formatted");
  const [copied, setCopied] = useState(false);

  let structured: StructuredResume | null = null;
  if (structuredResumeStr) {
    try {
      structured = JSON.parse(structuredResumeStr);
      // If structured is parsed but has no meaningful content, fallback to raw tab by default
      const hasContent = 
        structured?.basics?.name || 
        (structured?.workExperience && structured.workExperience.length > 0) ||
        (structured?.education && structured.education.length > 0) ||
        (structured?.projects && structured.projects.length > 0);
      
      if (!hasContent) {
        structured = null;
      }
    } catch (e) {
      structured = null;
    }
  }

  // Force default tab to raw if structured data is unavailable
  const currentTab = structured ? activeTab : "raw";

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col h-full bg-slate-950/40 rounded-2xl border border-white/5 overflow-hidden shadow-2xl ${className}`}>
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          {structured ? (
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab("formatted")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  currentTab === "formatted"
                    ? "bg-gradient-to-r from-red-500 to-indigo-600 text-white shadow-md shadow-red-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Formatted CV
              </button>
              <button
                onClick={() => setActiveTab("raw")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  currentTab === "raw"
                    ? "bg-gradient-to-r from-red-500 to-indigo-600 text-white shadow-md shadow-red-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Raw Resume Text
              </button>
            </div>
          ) : (
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-400" />
              Applicant Resume (Raw Text)
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all font-bold"
          title="Copy raw resume text"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Text
            </>
          )}
        </button>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        {currentTab === "formatted" && structured ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header / Basics */}
            <div className="border-b border-white/5 pb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {structured.basics?.name || "Candidate Name"}
              </h2>
              {structured.basics?.headline && (
                <p className="text-sm font-semibold text-slate-300 mt-1 uppercase tracking-wider text-indigo-400">
                  {structured.basics.headline}
                </p>
              )}

              {/* Contact Info Row */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-slate-400">
                {structured.basics?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-red-400/80" />
                    {structured.basics.email}
                  </span>
                )}
                {structured.basics?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-red-400/80" />
                    {structured.basics.phone}
                  </span>
                )}
                {structured.basics?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400/80" />
                    {structured.basics.location}
                  </span>
                )}
              </div>
            </div>

            {/* Work Experience */}
            {structured.workExperience && structured.workExperience.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  Work Experience
                </h3>
                <div className="space-y-6">
                  {structured.workExperience.map((work, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-indigo-500/20 last:border-0 pb-1">
                      <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 border border-slate-950" />
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {work.position || "Position"}
                          </h4>
                          <span className="text-xs font-semibold text-slate-300">
                            {work.company || "Company"}
                          </span>
                        </div>
                        {work.duration && (
                          <span className="text-[10px] font-bold font-mono text-slate-400 bg-white/5 border border-white/5 px-2 py-1 rounded-md self-start md:self-center">
                            {work.duration}
                          </span>
                        )}
                      </div>
                      {work.highlights && work.highlights.length > 0 && (
                        <ul className="space-y-1.5">
                          {work.highlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {structured.projects && structured.projects.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-white/5 pb-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-400" />
                  Projects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {structured.projects.map((proj, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2">{proj.name || "Project Name"}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          {proj.description}
                        </p>
                      </div>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {proj.technologies.map((tech, tIdx) => (
                            <span key={tIdx} className="text-[10px] font-bold bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/10">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {structured.education && structured.education.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-white/5 pb-2">
                  <GraduationCap className="w-4.5 h-4.5 text-indigo-400" />
                  Education
                </h3>
                <div className="space-y-4">
                  {structured.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {edu.degree || "Degree/Program"}
                        </h4>
                        <span className="text-xs text-slate-300">
                          {edu.institution || "Institution"}
                        </span>
                      </div>
                      {edu.endDate && (
                        <span className="text-[10px] font-bold font-mono text-slate-400 bg-white/5 border border-white/5 px-2 py-1 rounded-md">
                          Graduated {edu.endDate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed select-all bg-black/20 p-4 rounded-xl border border-white/5 animate-in fade-in duration-200">
            {resumeText || "No resume text available."}
          </div>
        )}
      </div>
    </div>
  );
}
