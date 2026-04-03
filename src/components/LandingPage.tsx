import React from "react";
import { Scale, Bot, Brain, FileText, ArrowRight, CheckCircle2, ShieldCheck, Zap, Award, Target } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-mendoza-gold/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-mendoza-gold/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-mendoza-gold/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative z-10 w-20 h-20 bg-mendoza-navy rounded-2xl flex items-center justify-center border-2 border-mendoza-gold shadow-[0_0_30px_rgba(197,160,89,0.4)]">
              <Scale className="w-10 h-10 text-mendoza-gold" />
            </div>
          </div>
          
          <span className="text-xs tracking-[0.5em] text-mendoza-gold font-black uppercase mb-4 block">
            Mendoza Law Firm
          </span>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
            SALES <span className="text-mendoza-gold">TRAINING</span>
          </h1>
          
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Domina el framework NEPQ con simulaciones de IA de alta fidelidad. 
            Entrena objeciones, tonalidad y cierre sin arriesgar leads reales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStart}
              className="group relative px-10 py-5 bg-mendoza-gold hover:bg-mendoza-gold-dark text-mendoza-navy font-black tracking-widest text-sm rounded-2xl transition-all shadow-[0_0_40px_rgba(197,160,89,0.3)] flex items-center gap-3 hover:scale-105 active:scale-95"
            >
              INICIAR ENTRENAMIENTO
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-3 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-mendoza-gold" />
              Entorno Seguro • 100% Privado
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <div className="w-6 h-10 rounded-full border-2 border-white flex justify-center p-1">
            <div className="w-1 h-2 bg-mendoza-gold rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 border-y border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-8">
          <div className="max-w-5xl mx-auto py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-mendoza-navy/30 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-[#C5A059]" />
                </div>
                <span className="text-3xl font-black mb-1">4</span>
                <span className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Niveles NEPQ</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-mendoza-navy/30 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-[#C5A059]" />
                </div>
                <span className="text-3xl font-black mb-1">IA</span>
                <span className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Conversacional</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-mendoza-navy/30 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[#C5A059]" />
                </div>
                <span className="text-3xl font-black mb-1">PDF</span>
                <span className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Reportes</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-mendoza-navy/30 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-[#C5A059]" />
                </div>
                <span className="text-3xl font-black mb-1">✓</span>
                <span className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Certificación</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-32">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-mendoza-gold rounded-full" />
              <span className="text-xs font-black text-mendoza-gold tracking-[0.3em] uppercase mb-6 block">
                El Problema
              </span>
              <h2 className="text-4xl font-black mb-8 leading-tight">
                El 68% de los cierres se pierden por mal manejo de objeciones
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Los agentes practican con leads reales, pierden clientes y destruyen oportunidades. No hay forma segura de entrenar objeciones sin arriesgar ingresos. Las capacitaciones genéricas no replican la presión emocional de una llamada real.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-mendoza-emerald rounded-full" />
              <span className="text-xs font-black text-mendoza-emerald tracking-[0.3em] uppercase mb-6 block">
                La Solución
              </span>
              <h2 className="text-4xl font-black mb-8 leading-tight">
                Un compañero de entrenamiento que nunca se cansa
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Mendoza Sales Training simula clientes con personalidades únicas, objeciones reales y respuestas emocionales. Entrena a cualquier hora, sin riesgo, con feedback inmediato de IA y métricas de evolución. El framework NEPQ guía cada interacción hacia el dominio del cierre ético.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-8 py-32 text-center bg-zinc-950/30">
          <h2 className="text-sm font-black text-mendoza-gold tracking-[0.5em] uppercase mb-16">
            Características Elite
          </h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-10 hover:border-mendoza-gold/30 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-mendoza-navy/30 flex items-center justify-center mb-8 border border-mendoza-navy/30 group-hover:scale-110 transition-transform">
                <Bot className="w-8 h-8 text-mendoza-gold" />
              </div>
              <h3 className="text-2xl font-black mb-4">IA Adaptativa</h3>
              <p className="text-zinc-400 leading-relaxed">
                Nuestra IA no sigue un guion. Reacciona a tu tono, empatía y técnica, escalando la dificultad según tu desempeño.
              </p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-10 hover:border-mendoza-gold/30 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-mendoza-navy/30 flex items-center justify-center mb-8 border border-mendoza-navy/30 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-mendoza-gold" />
              </div>
              <h3 className="text-2xl font-black mb-4">Framework NEPQ</h3>
              <p className="text-zinc-400 leading-relaxed">
                Entrenamiento especializado en Neuro-Emotional Persuasion Questions para desarmar la resistencia del prospecto.
              </p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-10 hover:border-mendoza-gold/30 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-mendoza-navy/30 flex items-center justify-center mb-8 border border-mendoza-navy/30 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-mendoza-gold" />
              </div>
              <h3 className="text-2xl font-black mb-4">Reportes & Certificación</h3>
              <p className="text-zinc-400 leading-relaxed">
                Reportes PDF detallados, métricas de evolución, diagnóstico de Sab y certificación interna al alcanzar nivel Máster.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-12 border-t border-zinc-900 text-center">
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">
            Acceso Restringido • Mendoza Law Firm © 2024
          </p>
        </div>
    </div>
  );
}
