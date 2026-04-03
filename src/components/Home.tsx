import React, { useState, useMemo } from 'react';
import { Trophy, TrendingUp, BarChart2, Briefcase, Brain, ShieldCheck, Download, Crown, Clock, LogOut, Scale, Target, Sparkles, ArrowRight, Settings2 } from 'lucide-react';
import { UserProgress, DifficultyLevel, SimulationMode, UserRole } from '../types';
import { generateIntegralReport } from '../lib/pdfGenerator';

interface HomeProps {
  progress: UserProgress;
  userRole: UserRole;
  onStartSimulation: (gender: 'male' | 'female', level: DifficultyLevel, mode: SimulationMode, focusArea?: string, voiceConfig?: { pitch: number, speed: number }) => void;
  onNavigate: (view: string) => void;
}

const Logo = () => (
  <div className="flex items-center gap-3 group">
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div className="absolute inset-0 bg-mendoza-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 w-12 h-12 bg-mendoza-navy rounded-2xl flex items-center justify-center border-2 border-mendoza-gold shadow-[0_0_20px_rgba(197,160,89,0.3)] group-hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] transition-all">
        <Scale className="w-6 h-6 text-mendoza-gold" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-serif font-bold tracking-[0.2em] leading-none text-white group-hover:text-mendoza-gold transition-colors">THE MENDOZA</span>
      <span className="text-[10px] font-sans tracking-[0.5em] text-mendoza-gold mt-1">LAW FIRM</span>
    </div>
  </div>
);

export default function Home({ progress, userRole, onStartSimulation, onNavigate }: HomeProps) {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>('Basic');
  const [selectedMode, setSelectedMode] = useState<SimulationMode>('standard');
  const [voicePitch, setVoicePitch] = useState<number>(5);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);

  const isManagement = ['Supervision', 'Gerencia', 'Direccion'].includes(userRole);
  const isTeamLeader = userRole === 'TeamLeader';

  const bestScore = progress.history.reduce((max, curr) => Math.max(max, curr.score), 0);

  // Calculate weakest area
  const weakestArea = useMemo(() => {
    if (progress.history.length === 0) return null;
    
    const totals: any = {
      tonality: 0,
      activeListening: 0,
      objectionHandling: 0,
      nepqLevel: 0,
      pacing: 0,
      confidence: 0,
      questioningQuality: 0,
      closingAbility: 0,
      rapportBuilding: 0
    };

    progress.history.forEach(res => {
      Object.keys(totals).forEach(key => {
        totals[key] += (res.metrics as any)[key] || 0;
      });
    });

    const averages = Object.entries(totals).map(([key, val]: [string, any]) => ({
      key,
      avg: val / progress.history.length
    }));

    return averages.sort((a, b) => a.avg - b.avg)[0];
  }, [progress.history]);

  const areaLabels: any = {
    tonality: 'Tonalidad',
    activeListening: 'Escucha Activa',
    objectionHandling: 'Manejo de Objeciones',
    nepqLevel: 'Nivel NEPQ',
    pacing: 'Ritmo/Pacing',
    confidence: 'Confianza',
    questioningQuality: 'Calidad de Preguntas',
    closingAbility: 'Habilidad de Cierre',
    rapportBuilding: 'Rapport'
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex relative overflow-hidden">
      {/* Background Glows - Enhanced for vibrancy */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-mendoza-emerald/15 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-mendoza-gold/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-mendoza-navy/15 rounded-full blur-[120px] translate-x-1/2 pointer-events-none" />

      {/* Left side - Hero Image */}
      <div className="hidden lg:block w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1200&auto=format&fit=crop" 
          alt="Mendoza Elite Training" 
          className="w-full h-full object-cover grayscale-[0.1] contrast-125 brightness-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-950/70 to-zinc-950 pointer-events-none" />
        <div className="absolute inset-0 bg-mendoza-navy/30 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40 opacity-90 pointer-events-none" />
        
        {/* Overlay Text for Hero */}
        <div className="absolute bottom-16 left-16 max-w-lg">
          <div className="w-16 h-1.5 bg-mendoza-gold mb-8 shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
          <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
            DOMINA EL ARTE <br />
            DE LA <span className="text-mendoza-gold">PERSUASIÓN</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed font-medium">
            Entrenamiento de élite diseñado por Mendoza Law Firm. Transforma cada interacción en una oportunidad de éxito.
          </p>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col h-screen overflow-y-auto relative z-10 custom-scrollbar">
        {/* Top Nav Icons - Role Based */}
        <div className="flex justify-end gap-3 mb-12 flex-wrap">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="p-2 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-colors" 
            title="Evolución del Agente"
          >
            <BarChart2 className="w-5 h-5 text-zinc-400" />
          </button>
          
          {(isTeamLeader || isManagement) && (
            <button 
              onClick={() => onNavigate('coach-dashboard')} 
              className="p-2 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-colors" 
              title="Dashboard de Coach"
            >
              <Briefcase className="w-5 h-5 text-zinc-400" />
            </button>
          )}

          {isManagement && (
            <button 
              onClick={() => onNavigate('diagnostic')} 
              className="p-2 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-colors" 
              title="Diagnóstico Estratégico"
            >
              <Brain className="w-5 h-5 text-zinc-400" />
            </button>
          )}

          <button 
            onClick={() => generateIntegralReport(progress)} 
            className="p-2 rounded-full border border-mendoza-gold/30 bg-mendoza-gold/5 hover:bg-mendoza-gold/10 transition-colors" 
            title="Descargar Reporte Integral"
          >
            <Download className="w-5 h-5 text-mendoza-gold" />
          </button>

          <button 
            onClick={() => onNavigate('landing')} 
            className="p-2 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-colors" 
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Header */}
        <div className="mb-16">
          <Logo />
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl font-black text-[#C5A059] leading-[1.1] mb-6 tracking-tight">
          The<br/>Mendoza<br/>Sales Training
        </h1>

        <p className="text-zinc-400 text-lg mb-10 max-w-md leading-relaxed">
          Tu centro de mando. Motivación diaria, progreso y acceso inmediato a la Simulación.
        </p>

        {/* Stats */}
        <div className="flex gap-4 mb-12">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-start gap-2 min-w-[140px]">
            <div className="flex items-center gap-2">
              <Trophy className="text-orange-500 w-4 h-4" />
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Sesiones</p>
            </div>
            <p className="text-2xl font-bold text-white">{progress.totalSimulations}</p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-start gap-2 min-w-[140px]">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-red-500 w-4 h-4" />
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Mejor</p>
            </div>
            <p className="text-2xl font-bold text-white">{bestScore}</p>
          </div>
        </div>

        {/* Areas of Opportunity Section */}
        {weakestArea && (
          <div className="mb-12 p-6 bg-mendoza-gold/5 border border-mendoza-gold/20 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-24 h-24 text-mendoza-gold" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-mendoza-gold animate-pulse" />
                <h3 className="text-sm font-bold text-mendoza-gold uppercase tracking-widest">Área de Oportunidad Detectada</h3>
              </div>
              <p className="text-2xl font-black text-white mb-2">
                {areaLabels[weakestArea.key]}
              </p>
              <p className="text-zinc-400 text-sm mb-6 max-w-sm">
                Sab ha detectado que necesitas reforzar tu técnica en {areaLabels[weakestArea.key].toLowerCase()}. ¿Quieres una sesión enfocada?
              </p>
              <button 
                onClick={() => {
                  setSelectedMode('focused');
                  // Trigger simulation with focus
                  if (selectedGender) {
                    onStartSimulation(selectedGender, selectedLevel, 'focused', weakestArea.key, { pitch: voicePitch, speed: voiceSpeed });
                  } else {
                    // Scroll to gender selection
                    document.getElementById('gender-selection')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3 bg-mendoza-gold text-mendoza-navy font-bold rounded-xl hover:bg-mendoza-gold-dark transition-all flex items-center gap-2"
              >
                Entrenamiento Enfocado
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Avatar Selection */}
        <div id="gender-selection">
          <h3 className="text-xs text-zinc-500 uppercase tracking-[0.15em] mb-4 font-bold">Selecciona el perfil del cliente</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <button 
              onClick={() => setSelectedGender('male')}
              className={`group relative overflow-hidden rounded-2xl border-2 text-left transition-all duration-500 h-64 ${selectedGender === 'male' ? 'border-mendoza-gold shadow-[0_0_30px_rgba(197,160,89,0.2)]' : 'border-zinc-800 hover:border-zinc-600'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" 
                alt="Hombre" 
                className="w-full h-full object-cover animate-breathe" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h4 className="text-white font-bold text-2xl mb-1">Perfil Vulnerable</h4>
                <p className="text-zinc-400 text-sm">Trauma migratorio y desconfianza</p>
              </div>
            </button>
            
            <button 
              onClick={() => setSelectedGender('female')}
              className={`group relative overflow-hidden rounded-2xl border-2 text-left transition-all duration-500 h-64 ${selectedGender === 'female' ? 'border-mendoza-gold shadow-[0_0_30px_rgba(197,160,89,0.2)]' : 'border-zinc-800 hover:border-zinc-600'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop" 
                alt="Mujer" 
                className="w-full h-full object-cover animate-breathe" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h4 className="text-white font-bold text-2xl mb-1">Perfil Estratégico</h4>
                <p className="text-zinc-400 text-sm">Escéptica ante promesas legales</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mode Selection */}
        <h3 className="text-xs text-zinc-500 uppercase tracking-[0.15em] mb-4 font-bold">Modo de Entrenamiento</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelectedMode('standard')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedMode === 'standard' ? 'bg-mendoza-gold/10 border-mendoza-gold' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${selectedMode === 'standard' ? 'bg-mendoza-gold text-mendoza-navy' : 'bg-zinc-800 text-zinc-400'}`}>
                <Trophy className="w-4 h-4" />
              </div>
              <span className="font-bold text-white">Simulación Estándar</span>
            </div>
            <p className="text-xs text-zinc-400">Enfoque en manejo de objeciones (mínimo 8) y cierre de venta. El cliente ya fue evaluado y espera el pago final.</p>
          </button>

          <button
            onClick={() => setSelectedMode('discovery')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedMode === 'discovery' ? 'bg-mendoza-gold/10 border-mendoza-gold' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${selectedMode === 'discovery' ? 'bg-mendoza-gold text-mendoza-navy' : 'bg-zinc-800 text-zinc-400'}`}>
                <Brain className="w-4 h-4" />
              </div>
              <span className="font-bold text-white">Práctica de Descubrimiento</span>
            </div>
            <p className="text-xs text-zinc-400">Enfócate en extraer elementos de abuso para calificar el caso.</p>
          </button>
        </div>

        {/* Difficulty Selection */}
        <h3 className="text-xs text-zinc-500 uppercase tracking-[0.15em] mb-4 font-bold">Selecciona la dificultad</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {(['Basic', 'Intermediate', 'Advanced', 'Master'] as DifficultyLevel[]).map((level) => {
            const levels: DifficultyLevel[] = ['Basic', 'Intermediate', 'Advanced', 'Master'];
            const levelIdx = levels.indexOf(level);
            const highestIdx = progress.highestLevelPassed ? levels.indexOf(progress.highestLevelPassed) : -1;
            const isUnlocked = levelIdx === 0 || levelIdx <= highestIdx + 1;

            return (
              <button
                key={level}
                disabled={!isUnlocked}
                onClick={() => setSelectedLevel(level)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  !isUnlocked ? 'bg-zinc-900/30 border-zinc-800/50 opacity-50 cursor-not-allowed' :
                  selectedLevel === level ? 'bg-mendoza-gold/10 border-mendoza-gold text-mendoza-gold' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 text-zinc-300'
                }`}
              >
                <span className="text-sm font-bold">{level}</span>
              </button>
            );
          })}
        </div>

        {/* Voice Options Selection */}
        <h3 className="text-xs text-zinc-500 uppercase tracking-[0.15em] mb-4 font-bold flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Opciones de Voz del Avatar
        </h3>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-white">Tono de Voz (Pitch)</label>
              <span className="text-xs text-zinc-400 font-mono">{voicePitch} / 10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              value={voicePitch}
              onChange={(e) => setVoicePitch(Number(e.target.value))}
              className="w-full accent-mendoza-gold"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
              <span>Más Grave</span>
              <span>Más Agudo</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-white">Velocidad (Speed)</label>
              <span className="text-xs text-zinc-400 font-mono">{voiceSpeed.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(Number(e.target.value))}
              className="w-full accent-mendoza-gold"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
              <span>Más Lento</span>
              <span>Más Rápido</span>
            </div>
          </div>
          
          <p className="text-[10px] text-zinc-500 italic">
            * Nota: Estos ajustes se inyectan en el System Prompt para modificar la actuación del avatar.
          </p>
        </div>

        <button 
          disabled={!selectedGender}
          onClick={() => selectedGender && onStartSimulation(selectedGender, selectedLevel, selectedMode, undefined, { pitch: voicePitch, speed: voiceSpeed })}
          className="w-full py-4 bg-mendoza-emerald hover:bg-mendoza-emerald-dark disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:shadow-none"
        >
          Iniciar Simulación
        </button>
      </div>
    </div>
  );
}
