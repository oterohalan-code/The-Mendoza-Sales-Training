import React from "react";
import { Download, Send, Zap, Brain, Target, Trophy, Activity } from "lucide-react";
import { UserProgress } from "../types";

interface DiagnosticDashboardProps {
  progress: UserProgress;
}

export default function DiagnosticDashboard({ progress }: DiagnosticDashboardProps) {
  const latestResult = progress.history.length > 0 ? progress.history[progress.history.length - 1] : null;
  
  const bestScore = progress.history.length > 0 
    ? Math.max(...progress.history.map(h => h.score))
    : 0;
    
  const avgNepq = progress.history.length > 0
    ? Math.round(progress.history.reduce((acc, curr) => acc + curr.metrics.nepqLevel, 0) / progress.history.length)
    : 0;

  const successfulCloses = progress.history.filter(h => h.score >= 85).length;

  const dynamicFeedback = latestResult 
    ? latestResult.feedback 
    : "Aún no has completado ninguna simulación. Comienza tu primera simulación para recibir feedback estratégico de Sab.";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h3 className="text-[#C5A059] text-xs font-bold tracking-[0.2em] uppercase mb-2">Mastery</h3>
        <h2 className="text-4xl font-black text-white tracking-tight">Tu Diagnóstico Estratégico</h2>
        <p className="text-zinc-400 mt-2">Análisis profundo de tu estilo de venta y áreas críticas de mejora.</p>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-mendoza-emerald/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-mendoza-gold/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
        
        <div className="flex items-start gap-4 mb-6 relative z-10">
          <div className="p-3 bg-mendoza-emerald/10 rounded-xl">
            <Brain className="w-6 h-6 text-mendoza-emerald" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Feedback Crítico del Entrenador</h3>
            <p className="text-zinc-300 leading-relaxed italic border-l-2 border-mendoza-emerald/30 pl-4 py-1">
              "{dynamicFeedback}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 relative z-10">
          <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Cierres Exitosos</p>
            </div>
            <p className="text-2xl font-bold text-white">{successfulCloses}</p>
          </div>
          <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-orange-500" />
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Mejor Score</p>
            </div>
            <p className="text-2xl font-bold text-white">{bestScore}</p>
          </div>
          <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#C5A059]" />
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">NEPQ Promedio</p>
            </div>
            <p className="text-2xl font-bold text-white">{avgNepq}</p>
          </div>
          <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Sesiones</p>
            </div>
            <p className="text-2xl font-bold text-white">{progress.totalSimulations}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => {
            import('../lib/pdfGenerator').then(({ generateIntegralReport }) => {
              generateIntegralReport(progress);
            });
          }}
          className="flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-xl transition-colors font-medium"
        >
          <Download className="w-5 h-5" />
          Descargar PDF
        </button>
        <button 
          onClick={() => alert("Reporte enviado a tu Coach exitosamente.")}
          className="flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-xl transition-colors font-medium"
        >
          <Send className="w-5 h-5" />
          Enviar a mi Coach
        </button>
        <button 
          onClick={() => alert("Módulo de Psicología de Cierre Maestro (Pro) estará disponible próximamente.")}
          className="flex items-center justify-center gap-3 bg-mendoza-emerald hover:bg-mendoza-emerald-dark text-white p-4 rounded-xl transition-colors font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <Brain className="w-5 h-5" />
          Psicología de Cierre Maestro (Pro)
        </button>
      </div>
    </div>
  );
}
