export type DifficultyLevel = "Basic" | "Intermediate" | "Advanced" | "Master";

export type ViewState = "landing" | "auth" | "home" | "dashboard" | "coach-dashboard" | "diagnostic" | "simulation" | "result" | "discovery";

export type SimulationMode = "standard" | "discovery" | "focused";

export interface Avatar {
  id: string;
  name: string;
  gender: 'male' | 'female';
  nationality: string;
  imageUrl: string;
  voiceName: string;
}

export const AVATARS: Avatar[] = [
  { 
    id: 'm1', 
    name: 'Carlos', 
    gender: 'male', 
    nationality: 'Mexicana', 
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', 
    voiceName: 'Charon' // More serious/deep voice
  },
  { 
    id: 'f1', 
    name: 'Valentina', 
    gender: 'female', 
    nationality: 'Colombiana', 
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop', 
    voiceName: 'Kore' 
  },
  { 
    id: 'm2', 
    name: 'Mateo', 
    gender: 'male', 
    nationality: 'Cubana', 
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop', 
    voiceName: 'Fenrir' 
  },
  { 
    id: 'f2', 
    name: 'Sofia', 
    gender: 'female', 
    nationality: 'Mexicana', 
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', 
    voiceName: 'Zephyr' 
  },
];

export interface SimulationResult {
  id: string;
  date: string;
  level: DifficultyLevel;
  score: number;
  metrics: {
    tonality: number;
    activeListening: number;
    objectionHandling: number;
    nepqLevel: number;
    pacing: number;
    confidence: number;
    questioningQuality: number;
    closingAbility: number;
    rapportBuilding: number;
    compliance?: number;
    evidenceGathering?: number;
  };
  feedback: string;
  passed: boolean;
  transcript?: { role: 'user' | 'ai', text: string }[];
}

export type UserRole = "DV" | "TeamLeader" | "Supervision" | "Gerencia" | "Direccion";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  shift?: 'AM' | 'PM';
  tlName?: string;
  tlEmail?: string;
  supervisorName?: string;
  managerName?: string;
  progress: UserProgress;
}

export interface UserProgress {
  totalSimulations: number;
  averageScore: number;
  highestLevelPassed: DifficultyLevel | null;
  history: SimulationResult[];
  notifications?: Notification[];
}

export interface Notification {
  id: string;
  type: 'evaluation' | 'milestone' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  agentId?: string;
}
