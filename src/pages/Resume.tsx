import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Edit, 
  Eye, 
  Share2, 
  Plus, 
  Trash2, 
  Save,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    twitter: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number;
    category: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
  }>;
}

const Resume: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      twitter: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  useEffect(() => {
    // Load resume data from localStorage
    const savedResume = localStorage.getItem('proofmint_resume');
    if (savedResume) {
      try {
        setResumeData(JSON.parse(savedResume));
      } catch (error) {
        console.error('Failed to parse saved resume:', error);
      }
    }
  }, []);

  const saveResume = () => {
    localStorage.setItem('proofmint_resume', JSON.stringify(resumeData));
    toast.success('Resume saved successfully!');
    setIsEditing(false);
  };

  const exportToPDF = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resumeData.personalInfo.name || 'resume'}.pdf`);
      toast.success('Resume exported to PDF!');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExp],
    });
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEdu],
    });
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      level: 5,
      category: 'Technical',
    };
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill],
    });
  };

  const renderEditForm = () => (
    <div className="space-y-8">
      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={resumeData.personalInfo.name}
            onChange={(e) => setResumeData({
              ...resumeData,
              personalInfo: { ...resumeData.personalInfo, name: e.target.value }
            })}
          />
          <Input
            label="Professional Title"
            value={resumeData.personalInfo.title}
            onChange={(e) => setResumeData({
              ...resumeData,
              personalInfo: { ...resumeData.personalInfo, title: e.target.value }
            })}
          />
          <Input
            label="Email"
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => setResumeData({
              ...resumeData,
              personalInfo: { ...resumeData.personalInfo, email: e.target.value }
            })}
          />
          <Input
            label="Phone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => setResumeData({
              ...resumeData,
              personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
            })}
          />
          <Input
            label="Location"
            value={resumeData.personalInfo.location}
            onChange={(e) => setResumeData({
              ...resumeData,
              personalInfo: { ...resumeData.personalInfo, location: e.target.value }
            })}
          />
          <Input
            label="Website"
            value={resumeData.personalInfo.website}
            onChange={(e) => setResumeData({
              ...resumeData,
              personalInfo: { ...resumeData.personalInfo, website: e.target.value }
            })}
          />
          <Input
            label="LinkedIn"
            value={resumeData.personalInfo.linkedin}
            onChange={(e) => setResumeData({
              ...resumeData,
              personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
            })}
          />
          <Input
            label="GitHub"
            value={resumeData.personalInfo.github}
            onChange={(e) => setResumeData({
              ...resumeData,
              personalInfo: { ...resumeData.personalInfo, github: e.target.value }
            })}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Professional Summary
          </label>
          <textarea
            className="w-full px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            rows={4}
            value={resumeData.personalInfo.summary}
            onChange={(e) => setResumeData({
              ...resumeData,
              personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
            })}
            placeholder="Write a brief professional summary..."
          />
        </div>
      </Card>

      {/* Experience */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Work Experience
          </h3>
          <Button onClick={addExperience} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
        <div className="space-y-4">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="p-4 bg-white/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Company"
                  value={exp.company}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience];
                    newExp[index].company = e.target.value;
                    setResumeData({ ...resumeData, experience: newExp });
                  }}
                />
                <Input
                  label="Position"
                  value={exp.position}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience];
                    newExp[index].position = e.target.value;
                    setResumeData({ ...resumeData, experience: newExp });
                  }}
                />
                <Input
                  label="Start Date"
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience];
                    newExp[index].startDate = e.target.value;
                    setResumeData({ ...resumeData, experience: newExp });
                  }}
                />
                <Input
                  label="End Date"
                  type="month"
                  value={exp.endDate}
                  disabled={exp.current}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience];
                    newExp[index].endDate = e.target.value;
                    setResumeData({ ...resumeData, experience: newExp });
                  }}
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience];
                    newExp[index].current = e.target.checked;
                    if (e.target.checked) {
                      newExp[index].endDate = '';
                    }
                    setResumeData({ ...resumeData, experience: newExp });
                  }}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Currently working here
                </label>
              </div>
              <textarea
                className="w-full px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                rows={3}
                value={exp.description}
                onChange={(e) => {
                  const newExp = [...resumeData.experience];
                  newExp[index].description = e.target.value;
                  setResumeData({ ...resumeData, experience: newExp });
                }}
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Skills
          </h3>
          <Button onClick={addSkill} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumeData.skills.map((skill, index) => (
            <div key={skill.id} className="p-4 bg-white/10 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <Input
                  label="Skill Name"
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...resumeData.skills];
                    newSkills[index].name = e.target.value;
                    setResumeData({ ...resumeData, skills: newSkills });
                  }}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={skill.category}
                    onChange={(e) => {
                      const newSkills = [...resumeData.skills];
                      newSkills[index].category = e.target.value;
                      setResumeData({ ...resumeData, skills: newSkills });
                    }}
                    className="w-full px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Language">Language</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Proficiency Level: {skill.level}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skill.level}
                  onChange={(e) => {
                    const newSkills = [...resumeData.skills];
                    newSkills[index].level = parseInt(e.target.value);
                    setResumeData({ ...resumeData, skills: newSkills });
                  }}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderPreview = () => (
    <div id="resume-preview" className="bg-white text-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {resumeData.personalInfo.name || 'Your Name'}
        </h1>
        <h2 className="text-xl text-gray-600 mb-4">
          {resumeData.personalInfo.title || 'Professional Title'}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {resumeData.personalInfo.email && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {resumeData.personalInfo.email}
            </div>
          )}
          {resumeData.personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {resumeData.personalInfo.phone}
            </div>
          )}
          {resumeData.personalInfo.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {resumeData.personalInfo.location}
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
          {resumeData.personalInfo.website && (
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              {resumeData.personalInfo.website}
            </div>
          )}
          {resumeData.personalInfo.linkedin && (
            <div className="flex items-center">
              <Linkedin className="w-4 h-4 mr-1" />
              LinkedIn
            </div>
          )}
          {resumeData.personalInfo.github && (
            <div className="flex items-center">
              <Github className="w-4 h-4 mr-1" />
              GitHub
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {resumeData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Work Experience
          </h3>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(
              resumeData.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill);
                return acc;
              }, {} as Record<string, typeof resumeData.skills>)
            ).map(([category, skills]) => (
              <div key={category}>
                <h4 className="font-semibold text-gray-900 mb-2">{category}</h4>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between">
                      <span className="text-gray-700">{skill.name}</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(skill.level / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{skill.level}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Resume Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage your professional resume with verified project data.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === 'preview' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('preview')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={activeTab === 'edit' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('edit')}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing && (
            <Button onClick={saveResume}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'edit' ? (
          <div>
            {renderEditForm()}
            <div className="mt-8 flex justify-end">
              <Button onClick={saveResume}>
                <Save className="w-4 h-4 mr-2" />
                Save Resume
              </Button>
            </div>
          </div>
        ) : (
          <Card className="p-0 overflow-hidden">
            {resumeData.personalInfo.name ? (
              renderPreview()
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Resume Data
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start building your professional resume by adding your information.
                </p>
                <Button onClick={() => setActiveTab('edit')}>
                  <Edit className="w-4 h-4 mr-2" />
                  Start Building Resume
                </Button>
              </div>
            )}
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Resume;