import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { 
  Trophy, 
  Target, 
  Activity, 
  Award, 
  MessageSquare, 
  Download, 
  ChevronDown, 
  ChevronUp,
  User,
  Mail,
  Shield,
  Calendar,
  Star,
  Zap,
  Brain
} from "lucide-react";
import { UserProgress, UserProfile } from "../types";
import { generateSessionPDF } from "../lib/pdfGenerator";
import { cn } from "../lib/utils";

interface DashboardProps {
  progress: UserProgress;
  user: UserProfile;
}

export default function Dashboard({ progress, user }: DashboardProps) {
  const [expandedSession, setExpandedSession] = React.useState<string | null>(null);
  const history = [...progress.history].reverse(); // Show newest first

  const latestResult = history[0];

  const radarData = latestResult
    ? [
        { subject: "Tonalidad", A: latestResult.metrics.tonality, fullMark: 100 },
        { subject: "Escucha", A: latestResult.metrics.activeListening, fullMark: 100 },
        { subject: "Objeciones", A: latestResult.metrics.objectionHandling, fullMark: 100 },
        { subject: "NEPQ", A: latestResult.metrics.nepqLevel, fullMark: 100 },
        { subject: "Ritmo", A: latestResult.metrics.pacing, fullMark: 100 },
        { subject: "Confianza", A: latestResult.metrics.confidence, fullMark: 100 },
        { subject: "Preguntas", A: latestResult.metrics.questioningQuality, fullMark: 100 },
        { subject: "Cierre", A: latestResult.metrics.closingAbility, fullMark: 100 },
        { subject: "Rapport", A: latestResult.metrics.rapportBuilding, fullMark: 100 },
      ]
    : [];

  const trendData = history.map((h, i) => ({
    name: "Sim " + (i + 1),
    score: h.score,
    level: h.level,
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mendoza-navy to-zinc-900 border border-zinc-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-mendoza-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-mendoza-gold to-mendoza-gold-dark p-1 shadow-[0_0_40px_rgba(197,160,89,0.2)] group-hover:shadow-[0_0_50px_rgba(197,160,89,0.4)] transition-all duration-500">
              <div className="w-full h-full rounded-xl bg-zinc-950 flex items-center justify-center overflow-hidden">
                <User className="w-20 h-20 text-mendoza-gold opacity-80" />
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-mendoza-emerald text-white p-2.5 rounded-xl shadow-xl border-2 border-zinc-950">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
              <h2 className="text-4xl font-black text-white tracking-tight">{user.name}</h2>
              <div className="flex gap-2 self-center">
                <span className="px-4 py-1.5 bg-mendoza-gold/10 text-mendoza-gold text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-mendoza-gold/20">
                  {user.role === 'DV' ? 'Agente Elite' : user.role}
                </span>
                <span className="px-4 py-1.5 bg-mendoza-emerald/10 text-mendoza-emerald text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-mendoza-emerald/20">
                  Elite Certified
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-zinc-400 text-sm mb-8">
              <div className="flex items-center gap-2.5 group cursor-pointer hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-mendoza-gold" />
                {user.email}
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-mendoza-gold" />
                Miembro desde Abril 2024
              </div>
              {user.tlName && (
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-mendoza-gold" />
                  TL: {user.tlName}
                </div>
              )}
              {user.supervisorName && (
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-mendoza-gold" />
                  Sup: {user.supervisorName}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Status', value: 'Activo', icon: Star, color: 'text-mendoza-emerald' },
                { label: 'Racha', value: '5 Días', icon: Zap, color: 'text-mendoza-gold' },
                { label: 'Nivel', value: progress.highestLevelPassed || 'Básico', icon: Award, color: 'text-white' },
                { label: 'Puntos', value: '12,450 XP', icon: Trophy, color: 'text-white' },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-950/40 backdrop-blur-md border border-zinc-800/50 p-4 rounded-2xl hover:bg-zinc-950/60 transition-colors">
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1.5">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <stat.icon className={cn("w-3.5 h-3.5 fill-current", stat.color)} />
                    <p className="text-sm font-bold text-white uppercase tracking-tight">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Promedio Global', value: progress.averageScore.toFixed(1), icon: Trophy, trend: '+2.4%' },
          { label: 'Sesiones Totales', value: progress.totalSimulations, icon: Target, trend: 'Activo' },
          { label: 'Hito de Carrera', value: progress.highestLevelPassed || 'N/A', icon: Award, trend: 'Top 5%' },
          { label: 'Último Desempeño', value: latestResult?.score || 0, icon: Activity, trend: 'Reciente' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-3xl group hover:border-mendoza-gold/40 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-zinc-950/50 text-mendoza-gold rounded-2xl group-hover:scale-110 transition-transform duration-500 border border-zinc-800">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-mendoza-emerald bg-mendoza-emerald/10 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white tracking-tighter italic">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                Evolución Elite
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Seguimiento de progreso histórico</p>
            </div>
            <div className="w-12 h-1.5 bg-mendoza-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.3)]" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{ dy: 10 }} />
                <YAxis stroke="#52525b" fontSize={10} domain={[0, 100]} tickLine={false} axisLine={false} tick={{ dx: -10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    borderRadius: '16px',
                    border: '1px solid #3f3f46',
                    fontSize: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: "#C5A059", fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#C5A059"
                  strokeWidth={5}
                  dot={{ fill: "#C5A059", r: 5, strokeWidth: 3, stroke: '#09090b' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                ADN de Ventas
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Perfil de habilidades actual</p>
            </div>
            <div className="w-12 h-1.5 bg-mendoza-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.3)]" />
          </div>
          {latestResult ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  data={radarData}
                >
                  <PolarGrid stroke="#27272a" strokeWidth={1} />
                  <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: '900' }} />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="#27272a"
                    tick={false}
                  />
                  <Radar
                    name="Métricas"
                    dataKey="A"
                    stroke="#C5A059"
                    fill="#C5A059"
                    fillOpacity={0.4}
                    strokeWidth={3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#09090b",
                      borderColor: "#27272a",
                      borderRadius: '16px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-zinc-600 italic font-medium">
              Completa tu primera simulación para ver tu ADN
            </div>
          )}
        </div>
      </div>

      {/* Session History */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-mendoza-gold" />
              Bitácora de Entrenamiento
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Historial detallado de intervenciones</p>
          </div>
          <div className="w-12 h-1.5 bg-mendoza-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.3)]" />
        </div>
        
        <div className="space-y-6">
          {history.length > 0 ? history.map((session) => (
            <div key={session.id} className="group border border-zinc-800/50 rounded-3xl overflow-hidden bg-zinc-950/20 hover:bg-zinc-950/40 transition-all duration-500 hover:border-mendoza-gold/20">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-lg shadow-2xl transition-all duration-500 group-hover:scale-105",
                    session.passed 
                      ? "bg-mendoza-emerald/10 text-mendoza-emerald border border-mendoza-emerald/20" 
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                  )}>
                    {session.score}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <p className="text-base font-black text-white uppercase tracking-tight">{session.level}</p>
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                      <p className="text-xs text-zinc-500 font-bold">{new Date(session.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-mendoza-gold uppercase font-black tracking-[0.25em]">{session.transcript.length} Intervenciones</p>
                      <span className="text-[10px] text-zinc-700">•</span>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">ID: {session.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      generateSessionPDF(session);
                    }}
                    className="p-3.5 bg-zinc-900/80 hover:bg-mendoza-gold hover:text-mendoza-navy border border-zinc-800 rounded-2xl transition-all duration-300 text-zinc-400 shadow-lg group/btn"
                    title="Descargar Reporte Elite"
                  >
                    <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <div className="p-2.5 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    {expandedSession === session.id ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                  </div>
                </div>
              </div>
              
              {expandedSession === session.id && (
                <div className="p-8 border-t border-zinc-800/50 bg-zinc-950/90 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-mendoza-gold/10 rounded-lg">
                          <Brain className="w-5 h-5 text-mendoza-gold" />
                        </div>
                        <p className="text-xs text-zinc-400 uppercase font-black tracking-[0.2em]">Diagnóstico de Sab</p>
                      </div>
                      <div className="p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800/50 shadow-inner">
                        <p className="text-sm text-zinc-300 italic leading-relaxed font-medium">"{session.feedback}"</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-mendoza-gold/10 rounded-lg">
                          <Activity className="w-5 h-5 text-mendoza-gold" />
                        </div>
                        <p className="text-xs text-zinc-400 uppercase font-black tracking-[0.2em]">Transcripción Elite</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                        {session.transcript.map((t, idx) => (
                          <div key={idx} className={cn(
                            "p-4 rounded-2xl text-[11px] leading-relaxed border transition-all duration-300",
                            t.role === 'user' 
                              ? "bg-mendoza-navy/40 text-zinc-100 border-mendoza-gold/30 shadow-lg" 
                              : "bg-zinc-900/60 text-zinc-400 border-zinc-800/60"
                          )}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={cn(
                                "font-black uppercase text-[9px] tracking-[0.2em]",
                                t.role === 'user' ? "text-mendoza-gold" : "text-zinc-600"
                              )}>
                                {t.role === 'user' ? 'Agente Elite' : 'Cliente Potencial'}
                              </span>
                              <span className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">
                                {t.role === 'user' ? 'Intervención' : 'Respuesta'}
                              </span>
                            </div>
                            <p className="font-medium">{t.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/20">
              <div className="p-4 bg-zinc-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                <Target className="w-8 h-8 text-zinc-700" />
              </div>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">No se han registrado sesiones de entrenamiento aún.</p>
              <p className="text-zinc-700 text-xs mt-2">Inicia tu primera simulación para comenzar tu camino a la élite.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
