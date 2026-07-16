import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PROJECT, 
  INITIAL_SUBTASKS, 
  HARDWARE_REQUIREMENTS,
  DEFAULT_MENTOR 
} from './projectData';
import { Project, SubTask, ChatMessage } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import WorkspaceTab from './components/WorkspaceTab';
import KanbanTab from './components/KanbanTab';
import TeamTab from './components/TeamTab';
import AICodingMentor from './components/AICodingMentor';
import AdminPanel from './components/AdminPanel';

import { 
  Play, 
  Code, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Link, 
  ExternalLink,
  ChevronDown,
  UserPlus,
  ArrowRight,
  Monitor,
  HardDrive,
  Cpu,
  Award,
  Wallet2,
  FileCode,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<string>('skill-wallet');
  const [activeTab, setActiveTab] = useState<'Overview' | 'Workspace' | 'Kanban' | 'Team'>('Overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Credits and Token States
  const [credits, setCredits] = useState<number>(400);
  const [aiTokens, setAiTokens] = useState<number>(10); // Start with 10 free tokens!
  
  // Project & Task States
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);
  const [tasks, setTasks] = useState<SubTask[]>(INITIAL_SUBTASKS);
  
  // Links Submissions
  const [demoLink, setDemoLink] = useState<string>('');
  const [githubLink, setGithubLink] = useState<string>('');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [tempDemo, setTempDemo] = useState('');
  const [tempGithub, setTempGithub] = useState('');

  // AI Mentor Chat States
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'mentor',
      text: "### Welcome to your ShopEZ Mentorship space! 🎓\n\nI'm your AI Mentor for this project. Ask me any technical questions about creating the frontend product lists in React, mounting routers in Express, or validating collections with MongoDB.\n\n*Select a task in the **Workspace** tab or ask me a custom question below to get started!*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [mentorActiveContext, setMentorActiveContext] = useState<string>('General project setup');

  // Accordion state for architecture sections
  const [openSection, setOpenSection] = useState<string | null>('architecture');

  // Sync Progress bar based on completed tasks & links
  useEffect(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    
    // Calculate progress: 80% tasks, 10% demo link, 10% github link
    let calculatedProgress = Math.round((completedTasks / totalTasks) * 80);
    if (demoLink) calculatedProgress += 10;
    if (githubLink) calculatedProgress += 10;

    setProject(prev => ({
      ...prev,
      progress: calculatedProgress
    }));
  }, [tasks, demoLink, githubLink]);

  // Handle Requirements Acceptance (transitions from Screen 2 to Screen 1)
  const handleAcceptRequirements = () => {
    setProject(prev => ({
      ...prev,
      status: 'accepted'
    }));
    setCredits(prev => prev + 50); // Welcome Bonus credits!
    
    // Auto add notification to terminal or log
    setChatHistory(prev => [
      ...prev,
      {
        id: 'accepted-req',
        sender: 'mentor',
        text: "### Congratulations! 🎉\n\nYou have accepted the project specifications. I have awarded you **+50 SkillWallet Credits** as a kickstart bonus.\n\nYou can now begin checking off deliverables in the **Workspace** tab or tracking your sprint stages on the **Kanban** board.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Toggle tasks check
  const handleToggleStep = (taskId: string, stepIdx: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        // Toggle task status if completing steps
        const isCompleted = task.status === 'completed';
        return {
          ...task,
          status: isCompleted ? 'todo' : 'completed'
        };
      }
      return task;
    }));
  };

  // Direct tasks completed on run
  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && task.status !== 'completed') {
        return { ...task, status: 'completed' };
      }
      return task;
    }));
  };

  const handleUpdateStatus = (taskId: string, newStatus: 'todo' | 'in_progress' | 'completed') => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  // Call server-side Gemini API
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory.slice(-6), // Send last 6 messages as context
          taskContext: mentorActiveContext
        })
      });

      const data = await response.json();
      
      const mentorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'mentor',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, mentorMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'mentor',
        text: "⚠️ **System Update:** I'm having trouble connecting to my servers right now. Please check if your GEMINI_API_KEY environment variable is defined correctly in your secrets configuration.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Buy AI tokens with Credits
  const buyTokens = () => {
    if (credits >= 100) {
      setCredits(prev => prev - 100);
      setAiTokens(prev => prev + 25);
    } else {
      alert("You need at least 100 SkillWallet Credits to purchase 25 AI Tokens.");
    }
  };

  // Award credits helper
  const earnedCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Top Header Persistent */}
      <Header 
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} 
        credits={credits}
        aiTokens={aiTokens}
        activePage={activePage}
        projectName={project.title}
      />

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-50 md:z-30`}>
        <Sidebar 
          activePage={activePage} 
          setActivePage={(page) => {
            setActivePage(page);
            setMobileMenuOpen(false);
          }}
          credits={credits}
        />
      </div>

      {/* Main Container Area */}
      <main className="pt-20 pb-24 md:pb-8 px-4 md:pl-[284px] md:pr-6 max-w-[1440px] mx-auto min-h-screen">
        
        {/* =========================================================
             ROUTE: SKILL WALLET (THE MAIN PORTFOLIO/SPEC WORKSPACE)
           ========================================================= */}
        {activePage === 'skill-wallet' && (
          <div>
            {/* If Project is in 'pending' status, show Screen 2: Tech Specs and acceptance */}
            {project.status === 'pending' ? (
              <div className="max-w-3xl mx-auto py-4">
                {/* Back Link / Spec Title */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-[#0035c5] uppercase tracking-wider">PROJECT REQUIREMENTS</span>
                    <div className="h-px flex-grow bg-gray-200" />
                  </div>
                  <h2 className="text-2xl font-black font-headline text-gray-800 leading-tight">
                    {project.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Tech Stack card (Bento Card style from screen 2) */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <Code className="w-5 h-5 text-[#0035c5]" />
                      <h3 className="text-lg font-bold font-headline text-gray-800">Tech Stack Overview</h3>
                    </div>

                    <div className="space-y-4">
                      {/* React */}
                      <div className="flex items-start gap-4">
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#0035c5] flex-shrink-0" />
                        <div>
                          <p className="text-xs font-black text-gray-800 mb-0.5">React.js Library</p>
                          <p className="text-xs text-gray-500 leading-relaxed">A JavaScript library for building dynamic and responsive user interfaces.</p>
                        </div>
                      </div>

                      {/* Express */}
                      <div className="flex items-start gap-4">
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#0035c5] flex-shrink-0" />
                        <div>
                          <p className="text-xs font-black text-gray-800 mb-0.5">Express.js Framework</p>
                          <p className="text-xs text-gray-500 leading-relaxed">A lightweight web framework for building secure and performant RESTful APIs.</p>
                        </div>
                      </div>

                      {/* MongoDB */}
                      <div className="flex items-start gap-4">
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#0035c5] flex-shrink-0" />
                        <div>
                          <p className="text-xs font-black text-gray-800 mb-0.5">MongoDB database</p>
                          <p className="text-xs text-gray-500 leading-relaxed">NoSQL database for flexible e-commerce catalog structures and query scalability.</p>
                        </div>
                      </div>

                      {/* Postman */}
                      <div className="flex items-start gap-4">
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#0035c5] flex-shrink-0" />
                        <div>
                          <p className="text-xs font-black text-gray-800 mb-0.5">Postman testing</p>
                          <p className="text-xs text-gray-500 leading-relaxed">Essential diagnostic sandbox tool for testing, securing, and documenting API endpoints.</p>
                        </div>
                      </div>

                      {/* VS Code */}
                      <div className="flex items-start gap-4">
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#0035c5] flex-shrink-0" />
                        <div>
                          <p className="text-xs font-black text-gray-800 mb-0.5">VS Code & Git version control</p>
                          <p className="text-xs text-gray-500 leading-relaxed">Primary local IDE environment and remote Git repos for collaborative development.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hardware Specs Card (From screen 2) */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <Monitor className="w-5 h-5 text-[#0035c5]" />
                      <h3 className="text-lg font-bold font-headline text-gray-800">Hardware Specifications</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {HARDWARE_REQUIREMENTS.map((req, idx) => (
                        <div key={idx} className="flex items-center p-4 bg-[#f8fafc] border border-gray-100 rounded-xl">
                          <div className="w-10 h-10 flex items-center justify-center bg-blue-100/50 rounded-xl mr-4 flex-shrink-0 text-[#0035c5]">
                            {req.icon === 'memory' && <Cpu className="w-5 h-5" />}
                            {req.icon === 'developer_board' && <Monitor className="w-5 h-5" />}
                            {req.icon === 'hard_drive' && <HardDrive className="w-5 h-5" />}
                            {req.icon === 'monitor' && <Monitor className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">{req.title}</p>
                            <p className="text-xs font-black text-gray-800">{req.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accept action button */}
                  <button
                    onClick={handleAcceptRequirements}
                    className="w-full bg-[#0035c5] hover:bg-opacity-95 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg shadow-blue-700/15 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Accept Project Requirements</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              // Active Project overview (Tabs layout)
              <div>
                
                {/* Project Overview Header & Breadcrumb */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black font-headline text-gray-800 leading-tight">
                      {project.title}
                    </h2>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-[#0035c5] text-white text-[10px] font-black uppercase rounded-full">Retail</span>
                      <span className="px-3 py-1 bg-blue-50 text-[#0035c5] border border-blue-100 text-[10px] font-black uppercase rounded-full">Group</span>
                    </div>
                  </div>

                  {/* Tab switches */}
                  <div className="flex bg-gray-200/50 border border-gray-200/70 p-1 rounded-xl w-fit">
                    {(['Overview', 'Workspace', 'Kanban', 'Team'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          activeTab === tab
                            ? 'bg-white text-gray-800 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* =========================================================
                     TAB: OVERVIEW
                   ========================================================= */}
                {activeTab === 'Overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left 8-col Area: Alert Banners, Summary, Skills required */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* Blue alert card */}
                      <div className="bg-gradient-to-r from-[#0047ff] to-[#0035c5] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 w-32 h-32 bg-white/5 rounded-full" />
                        <div className="absolute right-12 top-0 -translate-y-8 w-16 h-16 bg-white/10 rounded-full" />

                        <div className="flex items-start gap-3.5 mb-2 relative z-10">
                          <Link className="w-5 h-5 text-[#6aff88] mt-0.5" />
                          <div>
                            <h3 className="font-extrabold text-base font-headline">Add Demo and GitHub links!</h3>
                            <p className="text-xs text-blue-100 leading-relaxed mt-1">
                              Please update the demo and GitHub links so that your mentor can review and evaluate your project.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-5 relative z-10">
                          <button
                            onClick={() => setShowDemoModal(true)}
                            className="bg-white hover:bg-gray-50 text-[#0035c5] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold shadow-md shadow-blue-900/10 active:scale-[0.98] transition-transform cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-[#0035c5]" />
                            <span>{demoLink ? 'Update Demo' : 'Add Demo Link'}</span>
                          </button>
                          
                          <button
                            onClick={() => setShowGithubModal(true)}
                            className="bg-white hover:bg-gray-50 text-[#0035c5] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold shadow-md shadow-blue-900/10 active:scale-[0.98] transition-transform cursor-pointer"
                          >
                            <Code className="w-4 h-4" />
                            <span>{githubLink ? 'Update GitHub' : 'Add GitHub Link'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Summary Section */}
                      <article className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold font-headline text-gray-800 mb-3">Summary</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-6">
                          {project.description}
                        </p>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Skills Required</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.skillsRequired.map((skill, idx) => (
                              <span 
                                key={idx} 
                                className="bg-[#f8fafc] border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>

                      {/* Mentor Section */}
                      <div className="border border-gray-200 border-dashed rounded-2xl p-6 bg-white/50 text-center flex flex-col items-center justify-center shadow-sm">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md mb-3">
                          <img 
                            src={DEFAULT_MENTOR.avatarUrl} 
                            alt={DEFAULT_MENTOR.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h4 className="text-xs font-black text-gray-800">{DEFAULT_MENTOR.name}</h4>
                        <p className="text-[10px] text-gray-500 font-medium mb-3">{DEFAULT_MENTOR.role}</p>
                        
                        <button
                          onClick={() => {
                            setActiveTab('Workspace');
                            setMentorActiveContext("General design structure check");
                          }}
                          className="text-[10px] font-bold text-[#0035c5] bg-blue-50 hover:bg-blue-100/50 border border-blue-100 px-4 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          Request Code Review
                        </button>
                      </div>

                    </div>

                    {/* Right 4-col Area: Project Progress, Architecture items */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Project Progress Section */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Project Progress</h4>
                          <span className="bg-[#dde1ff] text-[#0033c0] text-[10px] font-black px-2.5 py-1 rounded-md">
                            {project.progress}% Completed
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#0035c5] transition-all duration-700 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>

                        {/* Links statuses */}
                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 text-[10px]">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <span className={`w-2 h-2 rounded-full ${demoLink ? 'bg-[#6aff88]' : 'bg-gray-300'}`} />
                            <span>Demo Link {demoLink ? '✔' : '❌'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <span className={`w-2 h-2 rounded-full ${githubLink ? 'bg-[#6aff88]' : 'bg-gray-300'}`} />
                            <span>GitHub Repo {githubLink ? '✔' : '❌'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Project Architecture Accordions */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <button
                          onClick={() => setOpenSection(openSection === 'architecture' ? null : 'architecture')}
                          className="w-full flex items-center justify-between font-bold text-gray-700 text-xs uppercase tracking-wide cursor-pointer"
                        >
                          <span>Project Architecture</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSection === 'architecture' ? 'rotate-180' : ''}`} />
                        </button>

                        {openSection === 'architecture' && (
                          <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3 mb-1">
                              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-[9px] text-gray-400 block mb-0.5">Complexity</span>
                                <span className="text-xs font-extrabold text-[#00551d]">Medium</span>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-[9px] text-gray-400 block mb-0.5">Duration</span>
                                <span className="text-xs font-extrabold text-green-700">56m</span>
                              </div>
                            </div>

                            {/* Section breakdown lists */}
                            <div className="space-y-2">
                              <div 
                                onClick={() => { setActiveTab('Workspace'); }}
                                className="flex items-center justify-between p-3 bg-[#f8fafc] border border-gray-100 hover:border-gray-200 rounded-xl cursor-pointer transition-all"
                              >
                                <span className="text-xs font-bold text-gray-700">Backend Development</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>

                              <div 
                                onClick={() => { setActiveTab('Workspace'); }}
                                className="flex items-center justify-between p-3 bg-[#f8fafc] border border-gray-100 hover:border-gray-200 rounded-xl cursor-pointer transition-all"
                              >
                                <span className="text-xs font-bold text-gray-700">Frontend Development</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>

                              <div 
                                onClick={() => { setActiveTab('Workspace'); }}
                                className="flex items-center justify-between p-3 bg-[#f8fafc] border border-gray-100 hover:border-gray-200 rounded-xl cursor-pointer transition-all"
                              >
                                <span className="text-xs font-bold text-gray-700">Database Management</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                )}

                {/* =========================================================
                     TAB: WORKSPACE (CODING EDITOR & SPEC ASSISTANT)
                   ========================================================= */}
                {activeTab === 'Workspace' && (
                  <WorkspaceTab 
                    tasks={tasks}
                    onToggleStep={handleToggleStep}
                    onCompleteTask={handleCompleteTask}
                    earnedCredits={earnedCredits}
                    onAskMentor={(prompt, context) => {
                      setMentorActiveContext(context);
                      // Set focus/ask trigger
                      handleSendMessage(prompt);
                    }}
                  />
                )}

                {/* =========================================================
                     TAB: KANBAN BOARD
                   ========================================================= */}
                {activeTab === 'Kanban' && (
                  <KanbanTab 
                    tasks={tasks}
                    onUpdateStatus={handleUpdateStatus}
                  />
                )}

                {/* =========================================================
                     TAB: TEAM MANAGEMENT
                   ========================================================= */}
                {activeTab === 'Team' && (
                  <TeamTab />
                )}

                {/* Persisted Sticky Chat Drawer helper for active assistance */}
                {activeTab !== 'Workspace' && (
                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <h3 className="font-bold text-sm text-gray-800 font-headline mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#0035c5]" />
                      <span>AI Mentorship Hub (Ask Questions Directly)</span>
                    </h3>
                    <AICodingMentor 
                      chatHistory={chatHistory}
                      onSendMessage={handleSendMessage}
                      isLoading={chatLoading}
                      activeContext={mentorActiveContext}
                    />
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* =========================================================
             ROUTE: DASHBOARD (HOME SCREEN STATS)
           ========================================================= */}
        {activePage === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-black font-headline text-gray-800 mb-2">My SkillWallet Dashboard</h3>
              <p className="text-xs text-gray-500">Track your credentials, completed project metrics, and active earnings split.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#dde1ff] border border-blue-200 p-5 rounded-2xl shadow-sm text-[#0033c0]">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-75">Completed Tasks</h4>
                <p className="text-3xl font-black font-headline mt-1">
                  {tasks.filter(t => t.status === 'completed').length} / {tasks.length}
                </p>
                <span className="text-[10px] font-medium mt-2 block">Check Workspace to code other specs.</span>
              </div>

              <div className="bg-green-50 border border-green-100 p-5 rounded-2xl shadow-sm text-green-800">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-75">Unlocked Credentials</h4>
                <p className="text-3xl font-black font-headline mt-1">3 Badges</p>
                <span className="text-[10px] font-medium mt-2 block">HTML, React.js & DB Schemas active!</span>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl shadow-sm text-amber-800">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-75">Mentor Rating</h4>
                <p className="text-3xl font-black font-headline mt-1">9.8 / 10</p>
                <span className="text-[10px] font-medium mt-2 block">Reviews compiled successfully.</span>
              </div>
            </div>

            {/* Quick overview link back to main work */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-extrabold text-gray-800">Resume ShopEZ E-commerce Sprint</h4>
                <p className="text-xs text-gray-400 mt-1">Implement responsive catalog layout and database schema setups now.</p>
              </div>
              <button 
                onClick={() => setActivePage('skill-wallet')}
                className="bg-[#0035c5] hover:bg-opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow cursor-pointer transition-transform active:scale-95 flex items-center gap-1"
              >
                <span>Open Project Wallet</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
             ROUTE: SKILL BANK (CURRICULUM MODULES)
           ========================================================= */}
        {activePage === 'skill-bank' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-black font-headline text-gray-800 mb-2">Skill Bank Library</h3>
              <p className="text-xs text-gray-500">Access verified curriculum resources and expert specifications to level up your engineering stacks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <span className="bg-blue-50 text-[#0035c5] text-[10px] font-bold uppercase px-2.5 py-1 rounded">Module 1</span>
                <h4 className="text-sm font-black text-gray-800 mt-3 mb-1.5 font-headline">Advanced MERN Stack Integrations</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">Master backend router security, JWT credentials verification, and Mongoose indexing algorithms.</p>
                <button 
                  onClick={() => { setActivePage('skill-wallet'); setActiveTab('Workspace'); }}
                  className="text-xs font-bold text-[#0035c5] hover:underline cursor-pointer"
                >
                  Start Coding Tasks ➔
                </button>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded">Module 2</span>
                <h4 className="text-sm font-black text-gray-800 mt-3 mb-1.5 font-headline">NoSQL Data structures optimization</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">Learn collection indexing, document relations schema design, and transactional seed script writes.</p>
                <button 
                  onClick={() => { setActivePage('skill-wallet'); setActiveTab('Workspace'); }}
                  className="text-xs font-bold text-[#0035c5] hover:underline cursor-pointer"
                >
                  Start Coding Tasks ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
             ROUTE: SKILL CARD (CREDENTIALS CERTIFICATE PASSPORT)
           ========================================================= */}
        {activePage === 'skill-card' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-indigo-950 to-blue-900 rounded-3xl p-6 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 translate-y-[-20%] translate-x-[20%] w-56 h-56 bg-blue-500/10 rounded-full blur-xl" />
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                  <h3 className="text-lg font-black font-headline tracking-wide">Developer SkillCard</h3>
                  <span className="text-[10px] text-blue-200/80 uppercase font-bold tracking-widest">Digital Passport ID</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg text-[#6aff88] border border-white/10">
                  MR
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <span className="text-[9px] text-blue-200 font-bold uppercase tracking-wider block">Assigned Candidate</span>
                  <p className="text-base font-black">ramyamenti59@gmail.com</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[9px] text-blue-200 font-bold uppercase tracking-wider block">Verified Skills</span>
                    <p className="font-bold text-[#6aff88]">React.js, Node.js, Express, MongoDB</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-blue-200 font-bold uppercase tracking-wider block">Accumulated Sprint XP</span>
                    <p className="font-bold">{credits} SkillPoints</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h4 className="font-extrabold text-sm text-gray-800 mb-3 font-headline">Verify Digital Badges</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">Your achievements are hashed cryptographically and ready to export directly to LinkedIn, GitHub, or your digital CV.</p>
              <button className="px-4 py-2 bg-blue-50 border border-blue-100 text-[#0035c5] rounded-xl text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer">
                Export Verified Passports
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
             ROUTE: SKILL CREDITS (TRANSACTION LEDGER)
           ========================================================= */}
        {activePage === 'skill-credits' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Tokens conversion widgets */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-black font-headline text-gray-800 mb-1">Skill Credits Shop</h3>
              <p className="text-xs text-gray-400 mb-5">Convert your developer credits to unlock more server-side Gemini AI queries and templates.</p>

              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">Purchase AI Token Pack</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Spend **100 Credits** to unlock **25 additional AI Tokens**.</p>
                </div>
                <button
                  onClick={buyTokens}
                  className="bg-[#0035c5] text-white px-5 py-2 rounded-xl text-xs font-bold shadow hover:bg-opacity-95 transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Purchase Pack (-100 cr)</span>
                </button>
              </div>
            </div>

            {/* Credits transaction ledger */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-800 font-headline mb-4 pb-2 border-b border-gray-100">
                Transaction Ledger
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <div>
                    <p className="font-bold text-gray-700">Sprint Acceptance Bonus</p>
                    <span className="text-[10px] text-gray-400">Accepted ShopEZ specifications</span>
                  </div>
                  <span className="text-green-600 font-extrabold">+50 cr</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <div>
                    <p className="font-bold text-gray-700">Account Setup reward</p>
                    <span className="text-[10px] text-gray-400">Credentials created</span>
                  </div>
                  <span className="text-green-600 font-extrabold">+400 cr</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
             ROUTE: ADMIN CONSOLE (MENTOR MANAGEMENT SYSTEM)
           ========================================================= */}
        {activePage === 'admin' && (
          <AdminPanel
            tasks={tasks}
            setTasks={setTasks}
            project={project}
            setProject={setProject}
            credits={credits}
            setCredits={setCredits}
            aiTokens={aiTokens}
            setAiTokens={setAiTokens}
            demoLink={demoLink}
            setDemoLink={setDemoLink}
            githubLink={githubLink}
            setGithubLink={setGithubLink}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        )}

      </main>

      {/* Persistent Bottom Nav Bar (Mobile viewport sizing only) */}
      <BottomNavBar activePage={activePage} setActivePage={setActivePage} />

      {/* =========================================================
           MODALS SECTION (Demo & Github Link submitters)
         ========================================================= */}
      {showDemoModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-100 shadow-2xl relative">
            <h4 className="text-base font-black font-headline text-gray-800 mb-2">Submit Live Demo URL</h4>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Ensure your local server is deployed or hosted publicly, then paste your demo URL below.</p>
            
            <input 
              type="url"
              required
              placeholder="https://shopez.skillwallet.ai"
              value={tempDemo}
              onChange={(e) => setTempDemo(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#0035c5] transition-all mb-4 text-gray-700"
            />

            <div className="flex justify-end gap-2.5 text-xs font-bold">
              <button 
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setDemoLink(tempDemo);
                  setShowDemoModal(false);
                  earnedCredits(50); // Award credits!
                  setChatHistory(prev => [
                    ...prev,
                    {
                      id: 'demo-link-submitted',
                      sender: 'mentor',
                      text: `### Great Job! 🚀\n\nYou have linked your active **Live Demo URL**: [${tempDemo}](${tempDemo}).\n\nI have awarded you **+50 SkillWallet Credits** as a reward for demonstrating project accessibility.`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="px-4 py-2 bg-[#0035c5] text-white rounded-xl shadow cursor-pointer active:scale-95 transition-all"
              >
                Submit Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {showGithubModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-100 shadow-2xl relative">
            <h4 className="text-base font-black font-headline text-gray-800 mb-2">Submit GitHub Repository</h4>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Paste your public repository link to coordinate source code verification audits.</p>
            
            <input 
              type="url"
              required
              placeholder="https://github.com/my-profile/shopez-ecommerce"
              value={tempGithub}
              onChange={(e) => setTempGithub(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#0035c5] transition-all mb-4 text-gray-700"
            />

            <div className="flex justify-end gap-2.5 text-xs font-bold">
              <button 
                onClick={() => setShowGithubModal(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setGithubLink(tempGithub);
                  setShowGithubModal(false);
                  earnedCredits(50); // Award credits!
                  setChatHistory(prev => [
                    ...prev,
                    {
                      id: 'github-link-submitted',
                      sender: 'mentor',
                      text: `### Excellent Work! 💻\n\nYou have successfully linked your **GitHub Repository**: [${tempGithub}](${tempGithub}).\n\nI have awarded you **+50 SkillWallet Credits** for managing source control properly.`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="px-4 py-2 bg-[#0035c5] text-white rounded-xl shadow cursor-pointer active:scale-95 transition-all"
              >
                Submit GitHub Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
