import React, { useState } from "react";
import { Scale, Shield, Users, Briefcase, Crown, UserCheck, ArrowRight, Mail, User, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserRole, UserProfile } from "../types";

interface AuthPageProps {
  onLogin: (userData: Partial<UserProfile>) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("DV");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shift, setShift] = useState<'AM' | 'PM'>('AM');
  const [tlName, setTlName] = useState("");
  const [tlEmail, setTlEmail] = useState("");

  const roles: { id: UserRole; icon: any; name: string; desc: string }[] = [
    { id: 'DV', icon: UserCheck, name: 'Individual (DV)', desc: 'Resultados propios' },
    { id: 'TeamLeader', icon: Users, name: 'Team Leader', desc: 'Supervisión de equipo' },
    { id: 'Supervision', icon: Shield, name: 'Supervisión', desc: 'Acceso total' },
    { id: 'Gerencia', icon: Briefcase, name: 'Gerencia', desc: 'Reportes colectivos' },
    { id: 'Direccion', icon: Crown, name: 'Dirección', desc: 'Control total' },
  ];

  const tlsAM = ["TL AM 1", "TL AM 2"];
  const tlsPM = ["TL PM 1", "TL PM 2"];

  const handleLogin = () => {
    if (!name || !email) {
      alert("Por favor ingresa tu nombre y correo.");
      return;
    }

    let supervisorName = "";
    let managerName = "Leonardo Pazos";

    if (shift === 'AM') supervisorName = "Gisela Zapata";
    if (shift === 'PM') supervisorName = "Alan Otero";

    if (selectedRole === 'DV' && (!tlName || !tlEmail)) {
      alert("Por favor selecciona tu TL e ingresa su correo para enlazarte.");
      return;
    }

    onLogin({
      name,
      email,
      role: selectedRole,
      shift: selectedRole === 'DV' ? shift : undefined,
      tlName: selectedRole === 'DV' ? tlName : undefined,
      tlEmail: selectedRole === 'DV' ? tlEmail : undefined,
      supervisorName,
      managerName
    });
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-sans flex flex-col items-center justify-center p-6 selection:bg-mendoza-gold/30 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-mendoza-gold/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md flex flex-col items-center relative z-10 h-[90vh] overflow-y-auto custom-scrollbar pb-10"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative w-24 h-24 flex items-center justify-center mb-6 mt-4 shrink-0"
        >
          <div className="absolute inset-0 bg-mendoza-gold/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative z-10 w-20 h-20 bg-mendoza-navy rounded-3xl flex items-center justify-center border-2 border-mendoza-gold shadow-[0_0_40px_rgba(197,160,89,0.4)]">
            <Scale className="w-10 h-10 text-mendoza-gold" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center shrink-0"
        >
          <span className="text-[10px] tracking-[0.5em] text-mendoza-gold font-black uppercase mb-2 block">
            Mendoza Law Firm
          </span>
          
          <h1 className="text-4xl font-black tracking-tighter mb-2 text-white">
            SALES <span className="text-mendoza-gold">TRAINING</span>
          </h1>
          
          <p className="text-zinc-500 mb-8 text-xs font-medium leading-relaxed max-w-[280px] mx-auto">
            Ingresa tus datos y selecciona tu rol operativo para acceder a la plataforma.
          </p>
        </motion.div>

        <div className="w-full space-y-4 mb-8">
          {/* Personal Info */}
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Tu Nombre Completo" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-mendoza-gold transition-colors"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="email" 
                placeholder="Tu Correo Electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-mendoza-gold transition-colors"
              />
            </div>
          </div>

          <div className="h-px w-full bg-zinc-800/50 my-6" />

          {/* Role Selection */}
          <div className="space-y-2">
            <h3 className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3">Selecciona tu Rol</h3>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role, idx) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all text-center ${
                    selectedRole === role.id 
                      ? 'bg-mendoza-gold/10 border-mendoza-gold text-mendoza-gold shadow-[0_0_15px_rgba(197,160,89,0.1)]' 
                      : 'bg-zinc-900/40 border-zinc-800/50 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900/60'
                  } ${role.id === 'DV' ? 'col-span-2' : ''}`}
                >
                  <role.icon className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">{role.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DVS Specific Fields */}
          <AnimatePresence>
            {selectedRole === 'DV' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden pt-4"
              >
                <div className="h-px w-full bg-zinc-800/50 mb-4" />
                <h3 className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Configuración de Equipo (DVS)</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setShift('AM'); setTlName(''); }}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${shift === 'AM' ? 'bg-mendoza-emerald/10 border-mendoza-emerald text-mendoza-emerald' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold">Turno AM</span>
                  </button>
                  <button
                    onClick={() => { setShift('PM'); setTlName(''); }}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${shift === 'PM' ? 'bg-mendoza-emerald/10 border-mendoza-emerald text-mendoza-emerald' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold">Turno PM</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <select 
                    value={tlName}
                    onChange={(e) => setTlName(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-mendoza-gold transition-colors appearance-none"
                  >
                    <option value="" disabled>Selecciona a tu Team Leader</option>
                    {(shift === 'AM' ? tlsAM : tlsPM).map(tl => (
                      <option key={tl} value={tl}>{tl}</option>
                    ))}
                  </select>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input 
                      type="email" 
                      placeholder="Correo de tu Team Leader" 
                      value={tlEmail}
                      onChange={(e) => setTlEmail(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-mendoza-gold transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-tight">
                    * Supervisor {shift}: <strong className="text-zinc-300">{shift === 'AM' ? 'Gisela Zapata' : 'Alan Otero'}</strong><br/>
                    * Gerente DVS: <strong className="text-zinc-300">Leonardo Pazos</strong>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          onClick={handleLogin}
          className="group w-full py-4 bg-mendoza-gold hover:bg-mendoza-gold-dark text-mendoza-navy font-black tracking-[0.2em] text-xs rounded-xl transition-all shadow-[0_0_30px_rgba(197,160,89,0.3)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          INGRESAR A LA PLATAFORMA
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black text-center shrink-0"
        >
          Acceso Restringido • Mendoza Law Firm © 2026
        </motion.div>
      </motion.div>
    </div>
  );
}
