import React, { useState } from 'react';
import { SubTask, Project, ChatMessage } from '../types';
import { 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Award, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  Link, 
  Github, 
  Send, 
  FileText, 
  Users, 
  FileCode,
  Bug,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  tasks: SubTask[];
  setTasks: React.Dispatch<React.SetStateAction<SubTask[]>>;
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  aiTokens: number;
  setAiTokens: React.Dispatch<React.SetStateAction<number>>;
  demoLink: string;
  setDemoLink: (link: string) => void;
  githubLink: string;
  setGithubLink: (link: string) => void;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function AdminPanel({
  tasks,
  setTasks,
  project,
  setProject,
  credits,
  setCredits,
  aiTokens,
  setAiTokens,
  demoLink,
  setDemoLink,
  githubLink,
  setGithubLink,
  chatHistory,
  setChatHistory
}: AdminPanelProps) {
  // Task creator state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'frontend' | 'backend' | 'database'>('frontend');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskSteps, setNewTaskSteps] = useState('');
  const [taskAddedSuccess, setTaskAddedSuccess] = useState(false);

  // Evaluation state
  const [evaluationStatus, setEvaluationStatus] = useState<'Approved with Distinction' | 'Approved' | 'Request Changes' | 'Rejected'>('Approved');
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [evalSuccessMessage, setEvalSuccessMessage] = useState<string | null>(null);

  // Quick settings
  const [tempCredits, setTempCredits] = useState<number>(100);
  const [tempTokens, setTempTokens] = useState<number>(25);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const stepsArray = newTaskSteps
      .split('\n')
      .map(step => step.trim())
      .filter(step => step.length > 0);

    const defaultSteps = stepsArray.length > 0 ? stepsArray : ['Analyze design specifications', 'Implement component logic and testing', 'Verify and deploy to production environment'];

    const customTask: SubTask = {
      id: `custom-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'Custom technical deliverable added by admin.',
      status: 'todo',
      category: newTaskCategory,
      detailedSteps: defaultSteps
    };

    setTasks(prev => [...prev, customTask]);
    
    // Auto post a notification message in the chat as the Mentor
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [
      ...prev,
      {
        id: `admin-task-added-${Date.now()}`,
        sender: 'mentor',
        text: `### 📋 New Sprint Requirement Added!\nAn admin has added a new deliverable under **${newTaskCategory.toUpperCase()}**:\n\n**${customTask.title}**\n\n*${customTask.description}*\n\nPlease check your Workspace or Kanban board to complete this task.`,
        timestamp: timestampStr
      }
    ]);

    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskSteps('');
    setTaskAddedSuccess(true);
    setTimeout(() => setTaskAddedSuccess(false), 3000);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    
    let xpBonus = 0;
    let messageText = '';
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (evaluationStatus === 'Approved with Distinction') {
      xpBonus = 250;
      setProject(prev => ({ ...prev, status: 'completed' }));
      messageText = `### 🏆 PROJECT APPROVED WITH DISTINCTION! ⭐⭐⭐\n\nExcellent work! I have evaluated your final submission links and the quality is outstanding. \n\n**Mentor Feedback:** ${evaluationFeedback || "Superb implementation of full-stack requirements, highly secure backend middleware, and clean UI catalog."}\n\nI have awarded you **+250 SkillWallet Credits** for this exceptional performance! You are now ready to export your validated credentials!`;
    } else if (evaluationStatus === 'Approved') {
      xpBonus = 150;
      setProject(prev => ({ ...prev, status: 'completed' }));
      messageText = `### 🎓 PROJECT EVALUATION APPROVED! 🎉\n\nCongratulations, you have passed the review! Your links met all core specifications for the ShopEZ Sprint.\n\n**Mentor Feedback:** ${evaluationFeedback || "All criteria successfully resolved. Great handling of MongoDB database collections and user validation steps."}\n\nI have awarded you **+150 SkillWallet Credits** for successful project completion.`;
    } else if (evaluationStatus === 'Request Changes') {
      messageText = `### ⚠️ EVALUATION UPDATE: CHANGES REQUESTED 🛠️\n\nYour submission was reviewed, but some adjustments are required before we can sign off on your credentials.\n\n**Mentor Feedback:** ${evaluationFeedback || "Please review the CORS configuration or double-check the search catalog filters in React."}\n\nYour project status has been updated to require revisions. Please update the codebase or links and submit again.`;
    } else {
      messageText = `### ❌ EVALUATION UPDATE: REJECTED\n\nThe current sprint submission has been rejected. It does not meet the specified security and performance benchmarks.\n\n**Mentor Feedback:** ${evaluationFeedback || "Key endpoints are unresponsive. Please debug your backend routers or DB connection scripts."}\n\nPlease check your specs and request a follow-up code review once resolved.`;
    }

    setCredits(prev => prev + xpBonus);
    setChatHistory(prev => [
      ...prev,
      {
        id: `eval-${Date.now()}`,
        sender: 'mentor',
        text: messageText,
        timestamp: timestampStr
      }
    ]);

    setEvaluationFeedback('');
    setEvalSuccessMessage(`Evaluation submitted! Candidate notified with status: "${evaluationStatus}"`);
    setTimeout(() => setEvalSuccessMessage(null), 5000);
  };

  const triggerBugSimulation = () => {
    const bugTask: SubTask = {
      id: `bug-${Date.now()}`,
      title: '🔴 CRITICAL: Fix API Router CORS Security Vulnerability',
      description: 'The security auditor has identified that Express CORS is allowing wildcard origins in production mode. Refactor server routing CORS settings.',
      status: 'todo',
      category: 'backend',
      detailedSteps: [
        'Install helmet middleware and configure origin whitelists',
        'Verify cookie credentials are not leaked during API handshake',
        'Test secure CORS response headers using Postman variables'
      ]
    };

    setTasks(prev => [bugTask, ...prev]);
    
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [
      ...prev,
      {
        id: `bug-notif-${Date.now()}`,
        sender: 'mentor',
        text: `### ⚠️ CRITICAL SPRINT ADVISORY! 🚨\n\nOur system detected an unresolved vulnerability in your Express backend! I have injected an urgent deliverable:\n\n**${bugTask.title}**\n\n*${bugTask.description}*\n\nPlease resolve this immediately to prevent credit penalties!`,
        timestamp: timestampStr
      }
    ]);
  };

  const simulatePeerContributions = () => {
    setChatHistory(prev => [
      ...prev,
      {
        id: `peer-${Date.now()}`,
        sender: 'mentor',
        text: `### 👥 Peer Contribution Update\n\n**Suhail Ahmed (Backend API Engineer)** has pushed a commit to resolve MERN Router issues and earned **+15 Sprint XP**.\n\n**Priya Sharma (Database Schema Lead)** has finalized Mongoose index schema configurations. Progress is looking solid!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const resetProject = () => {
    setProject({
      id: 'shopez-ecommerce',
      title: 'SHOPEZ : E-commerce Application',
      tags: ['Retail', 'Group'],
      description: 'ShopEZ is your one-stop destination for effortless online shopping. With a user-friendly interface and a comprehensive product catalog, finding the perfect items has never been easier. Seamlessly navigate through detailed product descriptions, customer reviews, and available discounts to make informed decisions. Enjoy a secure checkout process and receive instant order confirmation. For sellers, our robust dashboard provides efficient order management and insightful analytics to drive business growth. Experience the future of online shopping with ShopEZ today.',
      skillsRequired: [
        'HTML5',
        'CSS3',
        'JavaScript',
        'React.js (Javascript Library)',
        'Node.js (Javascript Library)',
        'Express.js (Javascript Library)',
        'MongoDB',
        '.NET Development'
      ],
      complexity: 'Medium',
      duration: '56m',
      status: 'pending',
      progress: 0
    });

    // Reset tasks
    setTasks([
      {
        id: 'back-1',
        title: 'Initialize Node/Express backend & set up routing framework',
        description: 'Set up package.json, configure tsconfig for backend TypeScript compilation, initialize Express application, and define robust folder structure (controllers, models, routes).',
        status: 'todo',
        category: 'backend',
        detailedSteps: [
          'Create standard express entrypoint in server.ts',
          'Mount middlewares for parsing json requests and cors settings',
          'Create folder structure for models, views, and controller endpoints',
          'Set up a healthcheck API route and verify server starts properly'
        ]
      },
      {
        id: 'back-2',
        title: 'Implement User JWT Authentication & secure middlewares',
        description: 'Create endpoints for user register and login. Implement secure password hashing with bcrypt, sign JSON Web Tokens, and write a verification middleware to secure private routes.',
        status: 'todo',
        category: 'backend',
        detailedSteps: [
          'Design register and login controllers with credential checks',
          'Hash passwords securely using bcrypt/bcryptjs prior to storage',
          'Generate JWT tokens on successful logins',
          'Write checkAuth middleware to authorize specific REST endpoints'
        ]
      },
      {
        id: 'back-3',
        title: 'Create RESTful APIs for Products and Cart CRUD operations',
        description: 'Build robust controllers to handle fetching products with search/filters, and managing items inside the persistent shopping cart.',
        status: 'todo',
        category: 'backend',
        detailedSteps: [
          'Write route for GET /api/products with title and tag queries',
          'Write API route for POST /api/cart to append/update product quantities',
          'Implement item removal and clear cart endpoints'
        ]
      },
      {
        id: 'front-1',
        title: 'Build responsive product catalog & category filters',
        description: 'Create clean, grid-aligned card layouts for products featuring high-contrast typography, interactive zoom effects, price labels, and category selector pills.',
        status: 'todo',
        category: 'frontend',
        detailedSteps: [
          'Design modular ProductCard component using modern Tailwind styles',
          'Implement interactive Search bar and filtering tabs',
          'Set up state manager to store filtered search results',
          'Ensure grid transitions smoothly across small and large viewports'
        ]
      },
      {
        id: 'front-2',
        title: 'Develop Interactive Cart drawer & Checkout process',
        description: 'Create an engaging slide-out cart panel summarizing selected items, subtotal calculation, quantity steppers, and a Multi-step Checkout layout.',
        status: 'todo',
        category: 'frontend',
        detailedSteps: [
          'Write interactive drawer component showing cart item counts',
          'Add plus/minus buttons to adjust checkout product amounts',
          'Design responsive checkout page containing shipment address forms',
          'Hook submit button to call the secure backend checkout API'
        ]
      },
      {
        id: 'front-3',
        title: 'Add status animations & real-time order tracking',
        description: 'Enhance visual quality using motion transition effects on item additions, checkout status updates, and a progress tracker for active shipments.',
        status: 'todo',
        category: 'frontend',
        detailedSteps: [
          'Animate button clicks with active scale feedback',
          'Render a visual stepper diagram detailing order preparation states',
          'Display helpful alert banners upon checkout complete'
        ]
      },
      {
        id: 'db-1',
        title: 'Design MongoDB collections schemas & indexing configurations',
        description: 'Structure Mongoose schemas for User, Product, and Order models. Setup appropriate validation constraints and indexes to optimize lookup speeds.',
        status: 'todo',
        category: 'database',
        detailedSteps: [
          'Draft mongoose schema definitions with type validation rules',
          'Configure product name and category fields with lookup index tags',
          'Set up database connection module with auto-reconnect listeners'
        ]
      },
      {
        id: 'db-2',
        title: 'Set up Seed script with rich dummy inventory records',
        description: 'Write a background utility script to populate the database with varied product records, high-resolution image links, and inventory thresholds.',
        status: 'todo',
        category: 'database',
        detailedSteps: [
          'Create data list detailing product prices, images, and descriptions',
          'Write seed script to purge existing collections and inject records',
          'Integrate command to allow mentor/developer to trigger seeds'
        ]
      }
    ]);

    setDemoLink('');
    setGithubLink('');
    setCredits(400);
    setAiTokens(10);
    
    setChatHistory([
      {
        id: 'welcome-reset',
        sender: 'mentor',
        text: "### Project Reset Complete! 🎓\nAll task progress, submitted URLs, and wallets have been cleared. Ready to accept specifications and code the ShopEZ platform again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 bg-indigo-50 border border-indigo-100 rounded text-indigo-600">
              <Settings className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600">ADMINISTRATIVE INTERFACES</span>
          </div>
          <h3 className="text-lg font-black font-headline text-gray-800">SkillWallet Admin Console</h3>
          <p className="text-xs text-gray-400">Evaluate student work, add tasks, customize balances, and simulate sprint scenarios.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50/50 border border-indigo-100/30 px-3.5 py-1.5 rounded-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">SYSTEM ROOT ACCESS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Columns - Task Creator and Evaluation Hub */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TASK CREATOR & DELIVERABLES MANAGEMENT */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 font-headline mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#0035c5]" />
              <span>Add Custom Sprint Deliverable</span>
            </h4>

            {taskAddedSuccess && (
              <div className="mb-4 p-3.5 bg-green-50 border border-green-100 text-green-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Deliverable added successfully and pushed to Kanban and Workspace!</span>
              </div>
            )}

            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Add Staged Stripe Sandbox Payment Checkout"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-700"
                  >
                    <option value="frontend">Frontend Development</option>
                    <option value="backend">Backend Development</option>
                    <option value="database">Database Management</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Short Description</label>
                <textarea
                  placeholder="Provide details about the technical design specification requirements..."
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Detailed Steps (One per line)</label>
                <textarea
                  placeholder="e.g. Register stripe credentials&#10;Create client routing triggers&#10;Verify test payments in console"
                  rows={3}
                  value={newTaskSteps}
                  onChange={(e) => setNewTaskSteps(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-800 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Inject New Requirement</span>
              </button>
            </form>
          </div>

          {/* PROJECT SUBMISSION & EVALUATION PANEL */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 font-headline mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Sprint Evaluation Hub</span>
            </h4>

            {evalSuccessMessage && (
              <div className="mb-4 p-3.5 bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>{evalSuccessMessage}</span>
              </div>
            )}

            {/* Submitted URL statuses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1 tracking-wider">Candidate Live Demo</span>
                {demoLink ? (
                  <a 
                    href={demoLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-extrabold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span className="truncate">{demoLink}</span>
                  </a>
                ) : (
                  <span className="text-xs font-semibold text-gray-400 italic">No Demo URL submitted yet</span>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1 tracking-wider">Candidate GitHub Repo</span>
                {githubLink ? (
                  <a 
                    href={githubLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-extrabold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <Github className="w-3.5 h-3.5 text-gray-700" />
                    <span className="truncate">{githubLink}</span>
                  </a>
                ) : (
                  <span className="text-xs font-semibold text-gray-400 italic">No GitHub URL submitted yet</span>
                )}
              </div>
            </div>

            <form onSubmit={handleEvaluate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Review Status</label>
                  <select
                    value={evaluationStatus}
                    onChange={(e) => setEvaluationStatus(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-700"
                  >
                    <option value="Approved">Approved (Pass)</option>
                    <option value="Approved with Distinction">Approved with Distinction (Excel)</option>
                    <option value="Request Changes">Request Changes (Revisions)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <span className="text-[10px] text-gray-400 italic font-medium leading-tight">
                    *Approving will mark the student's project as 'Completed' and unlock digital credentials!
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Mentor Evaluation Feedback Notes</label>
                <textarea
                  required
                  placeholder="Provide technical feedback, code analysis summaries, and next step guidelines for the candidate..."
                  rows={3}
                  value={evaluationFeedback}
                  onChange={(e) => setEvaluationFeedback(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0035c5] hover:bg-opacity-95 text-white font-extrabold text-xs py-2.5 rounded-lg shadow cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Evaluation & Notify Candidate</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Columns - Balance Customization & Simulation Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BALANCE CUSTOMIZATION */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 font-headline mb-4 pb-2 border-b border-gray-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-yellow-500" />
              <span>Wallet Customizer</span>
            </h4>

            <div className="space-y-4">
              {/* Credits adjust */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">
                  Direct Credits Reward (+ / -)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={tempCredits}
                    onChange={(e) => setTempCredits(Number(e.target.value))}
                    className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 text-xs outline-none"
                  />
                  <button
                    onClick={() => {
                      setCredits(prev => Math.max(0, prev + tempCredits));
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Add Credits
                  </button>
                  <button
                    onClick={() => {
                      setCredits(prev => Math.max(0, prev - tempCredits));
                    }}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Deduct
                  </button>
                </div>
              </div>

              {/* Tokens adjust */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">
                  AI Token Tokens Reward
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={tempTokens}
                    onChange={(e) => setTempTokens(Number(e.target.value))}
                    className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 text-xs outline-none"
                  />
                  <button
                    onClick={() => {
                      setAiTokens(prev => Math.max(0, prev + tempTokens));
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Add Tokens
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATION EVENTS PANEL */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 font-headline mb-4 pb-2 border-b border-gray-100 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-teal-600 animate-spin-slow" />
              <span>Sprint Simulations</span>
            </h4>

            <div className="space-y-3.5">
              <button
                onClick={triggerBugSimulation}
                className="w-full flex items-center gap-3 p-3 bg-rose-50 hover:bg-rose-100/70 border border-rose-100 rounded-xl transition-all text-left cursor-pointer group"
              >
                <Bug className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
                <div>
                  <h5 className="text-xs font-extrabold text-rose-900">Inject Critical Vulnerability</h5>
                  <p className="text-[10px] text-rose-600">Creates a high-priority bug security ticket deliverable.</p>
                </div>
              </button>

              <button
                onClick={simulatePeerContributions}
                className="w-full flex items-center gap-3 p-3 bg-teal-50 hover:bg-teal-100/70 border border-teal-100 rounded-xl transition-all text-left cursor-pointer group"
              >
                <Users className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
                <div>
                  <h5 className="text-xs font-extrabold text-teal-900">Simulate Teammate Activity</h5>
                  <p className="text-[10px] text-teal-600">Simulates team commits and posts peer review logs.</p>
                </div>
              </button>

              <button
                onClick={resetProject}
                className="w-full flex items-center gap-3 p-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-all text-left cursor-pointer group"
              >
                <RefreshCw className="w-5 h-5 text-slate-600 group-hover:rotate-45 transition-transform" />
                <div>
                  <h5 className="text-xs font-extrabold text-slate-800">Hard Reset Project Sprint</h5>
                  <p className="text-[10px] text-slate-500">Purges links, progress, acceptance, and logs.</p>
                </div>
              </button>
            </div>
          </div>

          {/* ACTIVE DELIVERABLES CHECKLIST READ-ONLY */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Task Checklist ({tasks.length})
            </h4>
            <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar text-[11px] pr-1">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100/60">
                  <div className="truncate pr-2">
                    <span className="font-extrabold text-gray-700 block truncate">{task.title}</span>
                    <span className="text-[9px] uppercase font-bold text-gray-400">{task.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      task.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : task.status === 'in_progress' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-500'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 hover:text-rose-600 text-gray-400 transition-colors cursor-pointer"
                      title="Delete Deliverable"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
