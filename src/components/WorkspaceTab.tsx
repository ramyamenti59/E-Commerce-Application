import React, { useState } from 'react';
import { SubTask } from '../types';
import { Play, CheckCircle2, Circle, AlertCircle, Sparkles, Terminal, Code2, BookOpen } from 'lucide-react';

interface WorkspaceTabProps {
  tasks: SubTask[];
  onToggleStep: (taskId: string, stepIndex: number) => void;
  onCompleteTask: (taskId: string) => void;
  onAskMentor: (prompt: string, context: string) => void;
  earnedCredits: (amount: number) => void;
}

export default function WorkspaceTab({ 
  tasks, 
  onToggleStep, 
  onCompleteTask, 
  onAskMentor,
  earnedCredits 
}: WorkspaceTabProps) {
  const [selectedTask, setSelectedTask] = useState<SubTask>(tasks[0] || null);
  const [code, setCode] = useState<string>(`// Write your e-commerce logic here!
// Example: Create an Express Route or Mongo model.

function calculateCartTotal(items) {
  return items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

// Test cart calculations
const testCart = [
  { name: 'ShopEZ Premium Shoes', price: 120, quantity: 2 },
  { name: 'Wireless Bluetooth Headset', price: 45, quantity: 1 }
];

console.log("Subtotal:", calculateCartTotal(testCart));
`);

  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to ShopEZ Mock Node Sandbox v1.4.0",
    "Select any task from the left panel to begin coding.",
    "Ready for compilation..."
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  // Update selected task reference on updates
  const activeTask = tasks.find(t => t.id === selectedTask?.id) || selectedTask;

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput(prev => [...prev, `[Compiling] Building task pipeline: ${activeTask.title}...`]);
    
    setTimeout(() => {
      setIsRunning(false);
      setIsPassed(true);
      setTerminalOutput(prev => [
        ...prev,
        "✔ JavaScript bundle parsed successfully.",
        "✔ Test Case 1: Subtotal addition matched ($285.00).",
        "✔ Test Case 2: Handled discount coupons (10% applied, safe).",
        "🎉 SUCCESS: All ShopEZ spec assertions passed!",
        "✨ SkillWallet credits updated! +25 credits awarded for verification."
      ]);
      onCompleteTask(activeTask.id);
      earnedCredits(25);
    }, 1500);
  };

  const loadBoilerplate = () => {
    if (activeTask.category === 'backend') {
      setCode(`import express from 'express';
const router = express.Router();

// Define e-commerce route
router.get('/products', (req, res) => {
  const mockInventory = [
    { id: 1, name: 'ShopEZ Classic Tee', price: 29.99 },
    { id: 2, name: 'ShopEZ Active Hoody', price: 59.99 }
  ];
  res.status(200).json(mockInventory);
});

export default router;`);
    } else if (activeTask.category === 'frontend') {
      setCode(`import React, { useState } from 'react';

export default function ShopEZCard({ product }) {
  const [added, setAdded] = useState(false);
  
  return (
    <div className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
      <h3 className="font-headline font-bold text-lg text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{product.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-[#0035c5] font-extrabold">\${product.price}</span>
        <button 
          onClick={() => setAdded(true)}
          className="px-4 py-1.5 bg-[#0035c5] text-white rounded-lg text-xs font-semibold hover:bg-opacity-90 active:scale-95 transition-all"
        >
          {added ? 'In Cart ✔' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}`);
    } else {
      setCode(`import mongoose from 'mongoose';

// MongoDB Schema for inventory items
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sku: { type: String, unique: true },
  price: { type: Number, required: true },
  stockCount: { type: Number, default: 25 },
  tags: [String]
});

export default mongoose.model('Product', ProductSchema);`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-10rem)]">
      {/* Left Column: Tasks Selection Drawer */}
      <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-4 flex flex-col shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
          <BookOpen className="w-5 h-5 text-[#0035c5]" />
          <h3 className="font-bold text-gray-800 font-headline">Select Coding Spec</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] lg:max-h-[480px] pr-1">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => {
                setSelectedTask(task);
                setIsPassed(false);
              }}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                activeTask.id === task.id
                  ? 'bg-blue-50/70 border-blue-200 shadow-sm'
                  : 'bg-white border-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded ${
                  task.category === 'backend' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                  task.category === 'frontend' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}>
                  {task.category}
                </span>
                
                {task.status === 'completed' ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Completed ✔
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    To Do
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">{task.title}</h4>
            </button>
          ))}
        </div>

        {/* Selected Task details */}
        {activeTask && (
          <div className="mt-5 p-4 bg-gray-50 border border-gray-100 rounded-xl">
            <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider mb-2">Detailed Deliverables</h4>
            <div className="space-y-2.5">
              {activeTask.detailedSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-normal">
                  <button 
                    onClick={() => onToggleStep(activeTask.id, idx)}
                    className="mt-0.5 text-gray-400 hover:text-[#0035c5] cursor-pointer"
                  >
                    {activeTask.status === 'completed' || idx === 0 /* Simple mock checklist state */ ? (
                      <CheckCircle2 className="w-4 h-4 text-[#0035c5] fill-blue-50" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>
                  <span className="flex-1">{step}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-2">
              <button 
                onClick={() => onAskMentor(`Can you help me understand how to complete the task: "${activeTask.title}"?`, activeTask.title)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-[#0035c5] bg-blue-50 border border-blue-100 px-2 py-1 rounded hover:bg-blue-100 transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-blue-500" />
                Ask Mentor for Help
              </button>
              <button 
                onClick={loadBoilerplate}
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition-all cursor-pointer"
              >
                <Code2 className="w-3 h-3" />
                Load Template
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Code Editor & Testing Terminal */}
      <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col shadow-lg text-white">
        {/* Editor Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#6aff88]" />
            <span className="text-xs font-mono font-bold tracking-wider text-gray-300">
              {activeTask.category === 'backend' ? 'routes/api.ts' : 
               activeTask.category === 'frontend' ? 'components/ProductCard.tsx' : 'config/schema.ts'}
            </span>
          </div>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 bg-[#0035c5] hover:bg-opacity-90 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Compiling...' : 'Run & Test Code'}</span>
          </button>
        </div>

        {/* Text Area Code Editor */}
        <div className="flex-1 min-h-[220px] font-mono text-xs text-[#a5f3fc] bg-gray-950 p-3 rounded-lg border border-gray-800 focus-within:border-cyan-500/50 transition-all">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full min-h-[220px] bg-transparent border-0 outline-none resize-none font-mono text-[#e0f2fe] placeholder-gray-600 leading-relaxed custom-scrollbar"
            spellCheck="false"
          />
        </div>

        {/* Console Terminal Output */}
        <div className="mt-4 bg-black rounded-lg border border-gray-800 p-3">
          <div className="flex items-center justify-between text-gray-500 text-[10px] font-mono border-b border-gray-900 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#6aff88]" />
              <span>TERMINAL OUTPUT</span>
            </div>
            <span>LOGS</span>
          </div>

          <div className="font-mono text-[11px] space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar">
            {terminalOutput.map((log, idx) => {
              let style = "text-gray-400";
              if (log.startsWith("✔") || log.startsWith("🎉")) style = "text-[#6aff88]";
              if (log.startsWith("[Compiling]")) style = "text-yellow-400";
              if (log.startsWith("✨")) style = "text-cyan-400 font-bold";
              
              return (
                <p key={idx} className={style}>{log}</p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
