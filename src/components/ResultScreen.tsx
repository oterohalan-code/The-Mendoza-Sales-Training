import React from "react";
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Activity, 
  Download, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { SimulationResult } from "../types";
import { cn } from "../lib/utils";
import { generateSessionPDF } from "../lib/pdfGenerator";
import { motion } from "motion/react";

interface ResultScreenProps {
  result: SimulationResult;
  onClose: () => void;
}

export default function ResultScreen({ result, onClose }: ResultScreenProps) {
  const metrics = [
    { label: "Tonalidad", value: result.metrics.tonality, icon: Activity },
    { label: "Escucha Activa", value: result.metrics.activeListening, icon: Target },
    { label: "Objeciones", value: result.metrics.objectionHandling, icon: TrendingUp },
    { label: "Nivel NEPQ", value: result.metrics.nepqLevel, icon: Trophy },
    { label: "Ritmo", value: result.metrics.pacing, icon: Activity },
    { label: "Confianza", value: result.metrics.confidence, icon: ShieldCheck },
    { label: "Preguntas", value: result.metrics.questioningQuality, icon: MessageSquare },
    { label: "Cierre", value: result.metrics.closingAbility, icon: Target },
  ];

  if (result.metrics.compliance !== undefined) {
    metrics.push({ label: "Compliance", value: result.metrics.compliance, icon: ShieldCheck });
  }
  if (result.metrics.evidenceGathering !== undefined) {
    metrics.push({ label: "Evidencias", value: result.metrics.evidenceGathering, icon: CheckCircle2 });
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          {result.passed ? (
            <div className="relative">
              <div className="absolute inset-0 bg-mendoza-emerald/20 rounded-full blur-2xl animate-pulse" />
              <CheckCircle2 className="w-20 h-20 text-mendoza-emerald relative z-10" />
            </div>
          ) : (
            <XCircle className="w-20 h-20 text-red-500" />
          )}
        </div>
        <h2 className={cn(
          "text-4xl font-black uppercase tracking-tight",
          result.passed ? "text-mendoza-emerald" : "text-red-500"
        )}>
          {result.passed ? "¡Simulación Aprobada!" : "Simulación Fallida"}
        </h2>
        <p className="text-zinc-400 text-lg">
          Has obtenido un score de <span className="text-white font-bold">{result.score}/100</span> en el nivel <span className="text-white font-bold">{result.level}</span>.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl text-center group hover:border-mendoza-emerald/30 transition-colors"
          >
            <m.icon className="w-5 h-5 text-mendoza-emerald mx-auto mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />
            <p className="text-xl font-bold text-white mb-0.5">{m.value}%</p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">{m.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-mendoza-gold/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-mendoza-gold" />
            </div>
            <h3 className="text-lg font-bold text-white">Feedback de Sab</h3>
          </div>
          <p className="text-zinc-300 leading-relaxed italic border-l-2 border-mendoza-gold/30 pl-4 py-1">
            "{result.feedback}"
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mendoza-navy rounded-lg">
                <Activity className="w-5 h-5 text-mendoza-gold" />
              </div>
              <h3 className="text-lg font-bold text-white">Transcripción</h3>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
              {result.transcript.length} Intervenciones
            </span>
          </div>
          <div className="max-h-[200px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {result.transcript.map((t, i) => (
              <div key={i} className={cn(
                "p-3 rounded-lg text-xs leading-relaxed",
                t.role === 'user' ? "bg-mendoza-navy/30 text-zinc-200 border-l-2 border-mendoza-gold" : "bg-zinc-800/30 text-zinc-400"
              )}>
                <span className="font-bold uppercase text-[9px] block mb-1 opacity-50">
                  {t.role === 'user' ? 'Agente' : 'Cliente'}
                </span>
                {t.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => generateSessionPDF(result)}
          className="flex-1 flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-2xl transition-all font-bold border border-zinc-700"
        >
          <Download className="w-5 h-5" />
          Descargar Reporte PDF
        </button>
        <button
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-3 bg-mendoza-gold hover:bg-mendoza-gold-dark text-mendoza-navy py-4 rounded-2xl transition-all font-black uppercase tracking-widest shadow-[0_0_30px_rgba(197,160,89,0.3)]"
        >
          Continuar al Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
