import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import CoachDashboard from "./components/CoachDashboard";
import DiagnosticDashboard from "./components/DiagnosticDashboard";
import SimulationRoom from "./components/SimulationRoom";
import ResultScreen from "./components/ResultScreen";
import { DifficultyLevel, SimulationResult, UserProgress, SimulationMode, UserProfile, UserRole, Notification } from "./types";
import { LayoutDashboard, ArrowLeft, Scale, Bell, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "./lib/utils";

const INITIAL_PROGRESS: UserProgress = {
  totalSimulations: 0,
  averageScore: 0,
  highestLevelPassed: null,
  history: [],
  notifications: [
    {
      id: '1',
      type: 'system',
      title: 'Bienvenido a Mendoza Elite',
      message: 'Comienza tu entrenamiento para alcanzar el nivel Master.',
      date: new Date().toISOString(),
      read: false
    }
  ]
};

const DEFAULT_USER: UserProfile = {
  id: 'user-1',
  name: 'Alan Otero',
  email: 'oteroalan299@gmail.com',
  role: 'DV', // Default role
  progress: INITIAL_PROGRESS
};

const Logo = () => (
  <div className="flex items-center gap-3 group">
    <div className="relative w-10 h-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-mendoza-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 w-10 h-10 bg-mendoza-navy rounded-xl flex items-center justify-center border border-mendoza-gold shadow-[0_0_15px_rgba(197,160,89,0.2)] group-hover:shadow-[0_0_25px_rgba(197,160,89,0.4)] transition-all">
        <Scale className="w-5 h-5 text-mendoza-gold" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-serif font-bold tracking-[0.2em] leading-none text-white group-hover:text-mendoza-gold transition-colors">THE MENDOZA</span>
      <span className="text-[8px] font-sans tracking-[0.4em] text-mendoza-gold mt-1">LAW FIRM</span>
    </div>
  </div>
);

export default function App() {
  const [view, setView] = useState<string>("landing");
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>("Basic");
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [selectedMode, setSelectedMode] = useState<SimulationMode>("standard");
  const [selectedFocusArea, setSelectedFocusArea] = useState<string | undefined>(undefined);
  const [voiceConfig, setVoiceConfig] = useState<{ pitch: number, speed: number } | undefined>(undefined);
  const [lastResult, setLastResult] = useState<SimulationResult | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load user from local storage
  useEffect(() => {
    const saved = localStorage.getItem("mendozaUserProfile");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing user profile", e);
      }
    }
  }, []);

  // Save user to local storage
  const saveUser = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem("mendozaUserProfile", JSON.stringify(newUser));
  };

  const handleSimulationComplete = (result: SimulationResult) => {
    const newHistory = [...user.progress.history, result];
    const totalScore = newHistory.reduce((acc, curr) => acc + curr.score, 0);

    let highest = user.progress.highestLevelPassed;
    if (result.passed) {
      const levels: DifficultyLevel[] = ["Basic", "Intermediate", "Advanced", "Master"];
      const currentHighestIdx = highest ? levels.indexOf(highest) : -1;
      const resultIdx = levels.indexOf(result.level);
      if (resultIdx > currentHighestIdx) {
        highest = result.level;
      }
    }

    const newProgress: UserProgress = {
      ...user.progress,
      totalSimulations: newHistory.length,
      averageScore: totalScore / newHistory.length,
      highestLevelPassed: highest,
      history: newHistory,
    };

    saveUser({
      ...user,
      progress: newProgress
    });

    setLastResult(result);
    setView("result");
  };

  const handleStartSimulation = (gender: 'male' | 'female', level: DifficultyLevel, mode: SimulationMode = "standard", focusArea?: string, voiceConfig?: { pitch: number, speed: number }) => {
    setSelectedGender(gender);
    setSelectedLevel(level);
    setSelectedMode(mode);
    setSelectedFocusArea(focusArea);
    setVoiceConfig(voiceConfig);
    setView("simulation");
  };

  const markNotificationsRead = () => {
    const newNotifications = user.progress.notifications?.map(n => ({ ...n, read: true })) || [];
    saveUser({
      ...user,
      progress: {
        ...user.progress,
        notifications: newNotifications
      }
    });
  };

  const unreadCount = user.progress.notifications?.filter(n => !n.read).length || 0;

  const renderContent = () => {
    const Layout = ({ children, title, showBack = true, showNewSimulation = false }: { children: React.ReactNode, title?: string, showBack?: boolean, showNewSimulation?: boolean }) => (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-mendoza-emerald/30 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-mendoza-emerald/15 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-mendoza-gold/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
        
        <nav className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="cursor-pointer" onClick={() => setView("home")}>
                <Logo />
              </div>
              <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) markNotificationsRead();
                    }}
                    className="p-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all relative group"
                  >
                    <Bell className="w-5 h-5 text-zinc-400 group-hover:text-mendoza-gold transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-mendoza-emerald text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-zinc-950 animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-4 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Notificaciones</h4>
                        <span className="text-[10px] text-mendoza-gold font-bold">{unreadCount} Nuevas</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {user.progress.notifications && user.progress.notifications.length > 0 ? (
                          user.progress.notifications.map((n) => (
                            <div key={n.id} className={cn("p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer", !n.read && "bg-mendoza-emerald/5")}>
                              <p className="text-xs font-bold text-white mb-1">{n.title}</p>
                              <p className="text-[10px] text-zinc-400 leading-relaxed mb-2">{n.message}</p>
                              <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{new Date(n.date).toLocaleDateString()}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-zinc-500 text-xs italic">No hay notificaciones</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mendoza-gold to-mendoza-gold-dark flex items-center justify-center border border-mendoza-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                    <UserIcon className="w-5 h-5 text-mendoza-navy" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[10px] text-mendoza-gold font-black uppercase tracking-wider">
                      {user.role} {user.shift ? `• Turno ${user.shift}` : ''}
                    </p>
                  </div>
                </div>

                <button onClick={() => setView('landing')} className="p-2.5 rounded-xl border border-zinc-800 hover:bg-red-500/10 hover:border-red-500/50 transition-all group">
                  <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-8">
            {showBack && (
              <button 
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver al Setup
              </button>
            )}
            {showNewSimulation && (
              <button
                onClick={() => setView("home")}
                className="px-6 py-2 bg-mendoza-gold hover:bg-mendoza-gold-dark text-mendoza-navy font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)]"
              >
                Nueva Simulación
              </button>
            )}
          </div>
          {children}
        </div>
      </div>
    );

    switch (view) {
      case "landing":
        return <LandingPage onStart={() => setView("auth")} />;

      case "auth":
        return <AuthPage onLogin={(userData) => {
          saveUser({ ...user, ...userData } as UserProfile);
          setView("home");
        }} />;

      case "home":
        return (
          <Home 
            progress={user.progress} 
            userRole={user.role}
            onStartSimulation={handleStartSimulation} 
            onNavigate={(newView) => setView(newView)} 
          />
        );

      case "dashboard":
        return (
          <Layout showNewSimulation>
            <Dashboard progress={user.progress} user={user} />
          </Layout>
        );

      case "coach-dashboard":
        return (
          <Layout>
            <CoachDashboard progress={user.progress} userRole={user.role} user={user} />
          </Layout>
        );

      case "diagnostic":
        return (
          <Layout>
            <DiagnosticDashboard progress={user.progress} />
          </Layout>
        );

      case "simulation":
        return (
          <Layout showBack={false}>
            <div className="max-w-4xl mx-auto">
              <SimulationRoom
                level={selectedLevel}
                selectedGender={selectedGender}
                mode={selectedMode}
                focusArea={selectedFocusArea}
                voiceConfig={voiceConfig}
                onComplete={handleSimulationComplete}
                onCancel={() => setView("home")}
              />
            </div>
          </Layout>
        );

      case "result":
        return (
          <Layout showBack={false}>
            <div className="max-w-4xl mx-auto">
              {lastResult && (
                <ResultScreen 
                  result={lastResult} 
                  onClose={() => setView("dashboard")} 
                />
              )}
            </div>
          </Layout>
        );
      
      default:
        return <LandingPage onStart={() => setView("auth")} />;
    }
  };

  return renderContent();
}
