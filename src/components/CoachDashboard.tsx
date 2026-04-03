import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Users, TrendingUp, BarChart2, DollarSign, AlertTriangle, Bell, CheckCircle, UserPlus } from "lucide-react";
import { UserProgress, UserRole, Notification, UserProfile } from "../types";

interface CoachDashboardProps {
  progress: UserProgress;
  userRole: UserRole;
  user?: UserProfile;
}

export default function CoachDashboard({ progress, userRole, user }: CoachDashboardProps) {
  const isManagement = ['Supervision', 'Gerencia', 'Direccion'].includes(userRole);
  
  // Mock team data based on current user's progress to simulate a team environment
  const teamSize = isManagement ? 45 : 12;
  const avgScore = progress.averageScore > 0 ? Math.round(progress.averageScore) : 68;
  const totalSessions = progress.totalSimulations + (isManagement ? 412 : 142);
  const roiEst = `$${(totalSessions * 150).toLocaleString()}`;

  const teamNotifications: Notification[] = [
    { id: 'n1', type: 'evaluation', title: 'Nueva Evaluación', message: 'Sarah Connor completó una sesión de Descubrimiento con 92/100.', date: new Date().toISOString(), read: false, agentId: 'agent-2' },
    { id: 'n2', type: 'milestone', title: 'Meta Alcanzada', message: 'Maria Garcia alcanzó el nivel Advanced.', date: new Date().toISOString(), read: false, agentId: 'agent-4' },
    { id: 'n3', type: 'system', title: 'Alerta de Desempeño', message: 'John Smith tiene un puntaje bajo en NEPQ (45/100).', date: new Date().toISOString(), read: false, agentId: 'agent-3' },
  ];

  const teamRanking = [
    { id: 1, name: user?.name || "Alan Otero (Tú)", sessions: progress.totalSimulations || 0, avgScore: Math.round(progress.averageScore) || 0, skillIndex: Math.round(progress.averageScore * 0.9) || 0, best: progress.history.length > 0 ? Math.max(...progress.history.map(h => h.score)) : 0, last: progress.history.length > 0 ? new Date(progress.history[progress.history.length-1].date).toLocaleDateString() : "---" },
    { id: 2, name: "Sarah Connor", sessions: 45, avgScore: 82, skillIndex: 78, best: 95, last: "31 mar" },
    { id: 3, name: "John Smith", sessions: 12, avgScore: 45, skillIndex: 40, best: 62, last: "28 mar" },
    { id: 4, name: "Maria Garcia", sessions: 38, avgScore: 88, skillIndex: 85, best: 98, last: "2 abr" },
    { id: 5, name: "David Miller", sessions: 25, avgScore: 72, skillIndex: 68, best: 85, last: "1 abr" },
  ].sort((a, b) => b.avgScore - a.avgScore);

  const latestMetrics = progress.history.length > 0 ? progress.history[progress.history.length - 1].metrics : null;

  const radarData = latestMetrics ? [
    { subject: "NEPQ", A: latestMetrics.nepqLevel, fullMark: 100 },
    { subject: "Empatía", A: latestMetrics.rapportBuilding, fullMark: 100 },
    { subject: "Cierre", A: latestMetrics.closingAbility, fullMark: 100 },
    { subject: "Objeciones", A: latestMetrics.objectionHandling, fullMark: 100 },
    { subject: "Tono", A: latestMetrics.tonality, fullMark: 100 },
    { subject: "Escucha", A: latestMetrics.activeListening, fullMark: 100 },
  ] : [
    { subject: "NEPQ", A: 65, fullMark: 100 },
    { subject: "Empatía", A: 70, fullMark: 100 },
    { subject: "Cierre", A: 60, fullMark: 100 },
    { subject: "Objeciones", A: 55, fullMark: 100 },
    { subject: "Tono", A: 75, fullMark: 100 },
    { subject: "Escucha", A: 80, fullMark: 100 },
  ];

  const weaknesses = [...radarData].sort((a, b) => a.A - b.A).map(w => ({ name: w.subject, score: w.A }));

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h3 className="text-[#C5A059] text-xs font-bold tracking-[0.2em] uppercase mb-2">Oficina del Mánager</h3>
        <h2 className="text-4xl font-black text-white tracking-tight">Dashboard de Coach</h2>
        <p className="text-zinc-400 mt-2">Supervisión de equipos, debilidades grupales y proyección de impacto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-mendoza-emerald/30 transition-colors">
          <div className="absolute inset-0 bg-mendoza-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Users className="w-6 h-6 text-zinc-400 mb-3 relative z-10" />
          <p className="text-3xl font-bold text-white mb-1 relative z-10">{teamSize}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold relative z-10">Agentes</p>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-mendoza-emerald/30 transition-colors">
          <div className="absolute inset-0 bg-mendoza-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <TrendingUp className="w-6 h-6 text-zinc-400 mb-3 relative z-10" />
          <p className="text-3xl font-bold text-mendoza-emerald mb-1 relative z-10">{avgScore}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold relative z-10">Avg Score</p>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-mendoza-emerald/30 transition-colors">
          <div className="absolute inset-0 bg-mendoza-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <BarChart2 className="w-6 h-6 text-zinc-400 mb-3 relative z-10" />
          <p className="text-3xl font-bold text-mendoza-emerald mb-1 relative z-10">{totalSessions}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold relative z-10">Total Sesiones</p>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-mendoza-emerald/30 transition-colors">
          <div className="absolute inset-0 bg-mendoza-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <DollarSign className="w-6 h-6 text-zinc-400 mb-3 relative z-10" />
          <p className="text-3xl font-bold text-mendoza-emerald mb-1 relative z-10">{roiEst}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold relative z-10">ROI Est.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Ranking de Equipo</h3>
              </div>
              {isManagement && (
                <button 
                  onClick={() => alert("Abriendo formulario para añadir nuevo agente...")}
                  className="flex items-center gap-2 text-[10px] font-black text-mendoza-gold uppercase tracking-widest hover:text-white transition-colors"
                >
                  <UserPlus className="w-3 h-3" />
                  Añadir Agente
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/20 border-b border-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 font-bold">#</th>
                    <th className="px-6 py-4 font-bold">Agente</th>
                    <th className="px-6 py-4 font-bold text-center">Sesiones</th>
                    <th className="px-6 py-4 font-bold text-center">Avg Score</th>
                    <th className="px-6 py-4 font-bold text-center">Skill Index</th>
                    <th className="px-6 py-4 font-bold text-center">Mejor</th>
                    <th className="px-6 py-4 font-bold text-right">Última</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {teamRanking.map((agent, index) => (
                    <tr key={agent.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-zinc-400">{index + 1}</td>
                      <td className="px-6 py-4 font-bold text-white">{agent.name}</td>
                      <td className="px-6 py-4 text-center text-zinc-300">{agent.sessions}</td>
                      <td className="px-6 py-4 text-center font-bold text-mendoza-gold">{agent.avgScore}</td>
                      <td className="px-6 py-4 text-center text-mendoza-gold">{agent.skillIndex}</td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-500">{agent.best}</td>
                      <td className="px-6 py-4 text-right text-zinc-500">{agent.last}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-8">
                <AlertTriangle className="w-5 h-5 text-mendoza-gold" />
                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Mapa de Debilidades Grupal</h3>
              </div>
              <div className="space-y-6">
                {weaknesses.map((w) => (
                  <div key={w.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-zinc-300">{w.name}</span>
                      <span className="font-bold text-[#C5A059]">{w.score}</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#C5A059] rounded-full" 
                        style={{ width: `${w.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-6">ADN del Equipo</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#27272a" />
                    <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#27272a" tick={false} />
                    <Radar name="Equipo" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Notifications Tray */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-mendoza-gold" />
                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Alertas de Equipo</h3>
              </div>
              <span className="text-[10px] bg-mendoza-emerald/20 text-mendoza-emerald px-2 py-1 rounded-full font-black uppercase tracking-widest">3 Nuevas</span>
            </div>
            <div className="space-y-4">
              {teamNotifications.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-white group-hover:text-mendoza-gold transition-colors">{n.title}</p>
                    <span className="text-[8px] text-zinc-600 font-bold uppercase">{new Date(n.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => alert("Historial completo cargado.")}
              className="w-full mt-6 py-3 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:bg-zinc-800 transition-all"
            >
              Ver Historial Completo
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-6">Acciones de Coach</h3>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => alert("Generando reporte grupal en PDF...")}
                className="flex items-center justify-between p-4 rounded-xl bg-mendoza-emerald/10 border border-mendoza-emerald/20 hover:bg-mendoza-emerald/20 transition-all text-left"
              >
                <div>
                  <p className="text-xs font-bold text-mendoza-emerald">Generar Reporte Grupal</p>
                  <p className="text-[9px] text-mendoza-emerald/70 uppercase font-bold tracking-widest">PDF • Excel</p>
                </div>
                <CheckCircle className="w-4 h-4 text-mendoza-emerald" />
              </button>
              <button 
                onClick={() => alert("Abriendo calendario para programar feedback...")}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 transition-all text-left"
              >
                <div>
                  <p className="text-xs font-bold text-white">Programar Feedback</p>
                  <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Calendario</p>
                </div>
                <Users className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
