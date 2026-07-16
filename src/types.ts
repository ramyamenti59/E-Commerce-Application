export interface SubTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  category: 'frontend' | 'backend' | 'database';
  detailedSteps: string[];
}

export interface Project {
  id: string;
  title: string;
  tags: string[];
  description: string;
  skillsRequired: string[];
  complexity: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  status: 'pending' | 'accepted' | 'completed';
  progress: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

export interface Mentor {
  name: string;
  avatarUrl: string;
  role: string;
}
