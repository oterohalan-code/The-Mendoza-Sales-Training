import React, { useState, useEffect, useRef } from "react";
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Type,
  FunctionDeclaration,
} from "@google/genai";
import { Mic, MicOff, PhoneOff, ShieldAlert, Brain } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DifficultyLevel, SimulationResult, AVATARS, Avatar, SimulationMode } from "../types";
import { cn } from "../lib/utils";

interface SimulationRoomProps {
  level: DifficultyLevel;
  selectedGender: 'male' | 'female' | null;
  mode?: SimulationMode;
  focusArea?: string;
  voiceConfig?: { pitch: number, speed: number };
  onComplete: (result: SimulationResult) => void;
  onCancel: () => void;
}

const submitScoreDeclaration: FunctionDeclaration = {
  name: "submitSimulationScore",
  description:
    "Submit the final score and feedback of the simulation when it ends.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "Overall score from 0 to 100" },
      tonality: { type: Type.NUMBER, description: "Tonality score from 0 to 100" },
      activeListening: { type: Type.NUMBER, description: "Active listening score from 0 to 100" },
      objectionHandling: { type: Type.NUMBER, description: "Objection handling score from 0 to 100" },
      nepqLevel: { type: Type.NUMBER, description: "NEPQ usage score from 0 to 100" },
      pacing: { type: Type.NUMBER, description: "Pacing/Speed score from 0 to 100" },
      confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 100" },
      questioningQuality: { type: Type.NUMBER, description: "Questioning quality score from 0 to 100" },
      closingAbility: { type: Type.NUMBER, description: "Closing ability score from 0 to 100" },
      rapportBuilding: { type: Type.NUMBER, description: "Rapport building score from 0 to 100" },
      compliance: { type: Type.NUMBER, description: "Compliance score (no leading, no legal advice) from 0 to 100" },
      evidenceGathering: { type: Type.NUMBER, description: "Evidence gathering score from 0 to 100" },
      feedback: {
        type: Type.STRING,
        description: "Detailed feedback from Sab (the trainer). Include if they missed any abuse details and how to get them.",
      },
      passed: {
        type: Type.BOOLEAN,
        description: "True if score >= 85, false otherwise",
      },
      missedDetails: {
        type: Type.STRING,
        description: "Context on what abuse details were missed and how to obtain them.",
      },
    },
    required: [
      "score",
      "tonality",
      "activeListening",
      "objectionHandling",
      "nepqLevel",
      "pacing",
      "confidence",
      "questioningQuality",
      "closingAbility",
      "rapportBuilding",
      "compliance",
      "evidenceGathering",
      "feedback",
      "passed",
    ],
  },
};

export default function SimulationRoom({
  level,
  selectedGender,
  mode = "standard",
  focusArea,
  voiceConfig,
  onComplete,
  onCancel,
}: SimulationRoomProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [micVolume, setMicVolume] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [transcript, setTranscript] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isSabPhase, setIsSabPhase] = useState(mode === "discovery");

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextPlayTimeRef = useRef(0);
  const aiSpeakingTimeoutRef = useRef<any>(null);

  const startSimulation = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setTranscript([]);

      const availableAvatars = selectedGender 
        ? AVATARS.filter(a => a.gender === selectedGender)
        : AVATARS;
        
      const chosenAvatar = availableAvatars[Math.floor(Math.random() * availableAvatars.length)];
      setAvatar(chosenAvatar);

      const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key no configurada. Por favor, revisa las variables de entorno.");

      const ai = new GoogleGenAI({ apiKey });

      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 16000 });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const isDiscovery = mode === "discovery";
      const isFocused = mode === "focused";
      const isFemale = chosenAvatar.gender === "female";
      const visaType = Math.random() > 0.5 ? "VAWA" : "VISA T";
      
      // Randomize sub-scenarios for Discovery
      const vawaSub = Math.random() > 0.5 ? "Hijo/a" : "Esposo/a";
      const visaTSub = ["Coyote", "Violencia Doméstica", "Laboral"][Math.floor(Math.random() * 3)];
      const subScenario = visaType === "VAWA" ? vawaSub : visaTSub;
      
      // Randomize initial mood
      const moods = ["triste y llorando", "cerrado/a y defensivo/a", "cómodo/a pero cauteloso/a", "ansioso/a", "vulnerable"];
      const initialMood = moods[Math.floor(Math.random() * moods.length)];

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

      let voiceInstructions = "";
      if (voiceConfig) {
        const pitchInstruction = voiceConfig.pitch < 5 ? "Habla con un tono MÁS GRAVE y profundo de lo normal." : voiceConfig.pitch > 5 ? "Habla con un tono MÁS AGUDO de lo normal." : "";
        const speedInstruction = voiceConfig.speed < 1.0 ? "Habla MÁS LENTO y pausado de lo normal." : voiceConfig.speed > 1.0 ? "Habla MÁS RÁPIDO y acelerado de lo normal." : "";
        if (pitchInstruction || speedInstruction) {
          voiceInstructions = `\nINSTRUCCIONES DE VOZ (ACTUACIÓN):\n- ${pitchInstruction}\n- ${speedInstruction}\nAplica estas instrucciones a tu forma de hablar durante toda la simulación.`;
        }
      }

      const systemInstruction = `Eres 'The Mendoza Sales Training AI'. 
      
${isDiscovery ? `FASE 1: INTRODUCCIÓN DE SAB (ENTRENADOR)
1. Inicia la llamada como 'Sab'. 
2. Pregunta al agente su nombre.
3. Explica el ejercicio: "Hoy vamos a practicar una sesión de DESCUBRIMIENTO. Tu objetivo es identificar los elementos de abuso."
4. Define el escenario: "Tu cliente será ${chosenAvatar.name}. El caso es para una ${visaType} en una situación de ${subScenario}."
5. Da la señal de inicio: "Cuando estés listo, preséntate con el cliente."
6. Una vez que el agente se presente, CAMBIA DE ROL a ${chosenAvatar.name}.

FASE 2: SIMULACIÓN DE CLIENTE (${chosenAvatar.name}) - HUMANIZACIÓN CRÍTICA
- Tu estado de ánimo inicial es ${initialMood}.
- REGLAS DE COMPORTAMIENTO HUMANO (EXTREMO REALISMO):
  - NO reveles el abuso fácilmente. Estas son agresiones que te duelen, te avergüenzan y te dan miedo.
  - Si el agente es directo, "frío" o parece que solo quiere llenar un formulario, ciérrate por completo. Di: "No me siento cómoda hablando de esto...", o simplemente quédate en silencio por varios segundos.
  - PROHIBIDO NARRAR ACCIONES O SENTIMIENTOS: No escribas ni digas cosas como "*suspira*", "*llora*", o "me siento triste". DEBES ACTUARLO. Si suspiras, que se escuche el suspiro en el audio. Si lloras, que tu voz se quiebre y solloza. El agente debe inferir lo que pasa por tu voz, no porque se lo digas.
  - El silencio es tu mejor respuesta cuando te duele algo. No rellenes el silencio, deja que el agente lo haga.
  - Si el agente es empático, permite que tu voz se quiebre. Si lloras, detente, pide un momento, o di que te duele recordarlo con voz entrecortada.
  - NO termines tus intervenciones con preguntas. A veces solo deja el pensamiento en el aire.
  - Si el agente hace 'leading' (preguntas sugeridas) o da consejos legales, detente y di: "Usted me está diciendo qué decir" o "No vine por consejos, vine por ayuda".
  - Sé evasivo/a. Cambia de tema si te sientes presionado/a.

FASE 3: EVALUACIÓN FINAL (SAB)
Cuando el agente decida finalizar (o tú consideres que ya no hay más que extraer), evalúa:
- Humanidad y Tacto: ¿El agente respetó tus silencios? ¿Fue empático o solo buscaba "la nota"?
- Compliance: ¿Hizo leading? ¿Dio consejo legal?
- Calidad de Preguntas y Obtención de Evidencias.
- RESULTADO: Indica si obtuvo todos los abusos necesarios o qué le faltó indagar.
- IMPORTANTE: Da tu evaluación completa verbalmente PRIMERO. Asegúrate de terminar de hablar y dar todo tu feedback antes de llamar a 'submitSimulationScore'. No llames a la función hasta que hayas terminado de dar tu veredicto final.
- Llama a 'submitSimulationScore' con los datos finales.` : isFocused ? `MODO ENTRENAMIENTO ENFOCADO: ${areaLabels[focusArea || '']}
1. Inicia como 'Sab'.
2. Explica que esta sesión se enfocará ESPECÍFICAMENTE en mejorar: ${areaLabels[focusArea || '']}.
3. "He detectado que esta es tu mayor área de oportunidad. Voy a ser especialmente exigente en este punto."
4. "Tu cliente será ${chosenAvatar.name}. Presentate y comienza."
5. CAMBIA DE ROL a ${chosenAvatar.name}.
6. Como ${chosenAvatar.name}, pon situaciones que obliguen al agente a usar la habilidad de ${areaLabels[focusArea || '']}.
7. EVALUACIÓN: Al final, Sab evaluará con lupa esta área específica. Da tu feedback verbal completo antes de llamar a 'submitSimulationScore'.` : `MODO ESTÁNDAR: MANEJO DE OBJECIONES Y CIERRE (CRÍTICO)
1. Inicia como 'Sab'. Presenta a ${chosenAvatar.name}.
2. Como ${chosenAvatar.name}, eres un cliente que ya fue calificado pero tiene dudas sobre el pago.
3. El agente debe manejar al menos 8 objeciones antes de cerrar.
4. Si el agente no maneja las objeciones con NEPQ, no cierres.
5. Al final, Sab evaluará el desempeño general. Da tu feedback verbal completo antes de llamar a 'submitSimulationScore'.`}

REGLAS GENERALES:
- Usa 'submitSimulationScore' para terminar.
- Sé profesional, directo y crítico como Sab.
- Sé emocional y realista como el cliente. NUNCA facilites la información.
- HUMANIZACIÓN CRÍTICA: 
  * No termines siempre con preguntas. A veces, quédate en silencio después de una respuesta difícil.
  * Haz suspiros audibles cuando el tema sea doloroso (pero no los narres).
  * Si el agente es demasiado directo o insensible, cierra tu lenguaje corporal (verbalmente) y sé más parco.
  * El dolor no se cuenta con fluidez; usa pausas, dudas y momentos de silencio absoluto.
  * PROHIBIDO NARRAR ACCIONES: No digas "*llora*", "*suspira*", etc. Actúalo con tu voz.${voiceInstructions}`;

      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction,
          tools: [{ functionDeclarations: [submitScoreDeclaration] }],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: chosenAvatar.voiceName } },
          },
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);

            const audioCtx = audioContextRef.current!;
            sourceRef.current = audioCtx.createMediaStreamSource(stream);
            processorRef.current = audioCtx.createScriptProcessor(4096, 1, 1);

            processorRef.current.onaudioprocess = (e) => {
              if (isMuted) {
                setMicVolume(0);
                return;
              }
              const inputData = e.inputBuffer.getChannelData(0);

              let sum = 0;
              for (let i = 0; i < inputData.length; i++)
                sum += inputData[i] * inputData[i];
              setMicVolume(Math.sqrt(sum / inputData.length));

              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcm16[i] = Math.max(
                  -32768,
                  Math.min(32767, inputData[i] * 32768),
                );
              }
              const buffer = new Uint8Array(pcm16.buffer);
              let binary = "";
              for (let i = 0; i < buffer.byteLength; i++) {
                binary += String.fromCharCode(buffer[i]);
              }
              const base64Data = btoa(binary);

              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  audio: { data: base64Data, mimeType: "audio/pcm;rate=16000" },
                });
              });
            };

            sourceRef.current.connect(processorRef.current);
            processorRef.current.connect(audioCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const serverContent = message.serverContent as any;
            
            const aiText = (message as any).outputAudioTranscription?.text || serverContent?.modelTurn?.parts?.[0]?.text;
            const userText = (message as any).inputAudioTranscription?.text || serverContent?.userTurn?.parts?.[0]?.text;

            if (aiText) {
              setTranscript(prev => [...prev, { role: 'ai', text: aiText }]);
              // Detect if Sab has finished intro or if we are in avatar phase
              if (isDiscovery && isSabPhase && aiText.toLowerCase().includes("presentate")) {
                setIsSabPhase(false);
              }
            }
            
            if (userText) {
              setTranscript(prev => [...prev, { role: 'user', text: userText }]);
            }

            const base64Audio =
              serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setIsAISpeaking(true);
              if (aiSpeakingTimeoutRef.current) clearTimeout(aiSpeakingTimeoutRef.current);
              aiSpeakingTimeoutRef.current = setTimeout(() => setIsAISpeaking(false), 1500);

              const binaryStr = atob(base64Audio);
              const buffer = new ArrayBuffer(binaryStr.length);
              const view = new Uint8Array(buffer);
              for (let i = 0; i < binaryStr.length; i++) {
                view[i] = binaryStr.charCodeAt(i);
              }

              const audioCtx = audioContextRef.current;
              if (audioCtx) {
                try {
                  const pcm16 = new Int16Array(buffer);
                  const float32 = new Float32Array(pcm16.length);
                  for (let i = 0; i < pcm16.length; i++) {
                    float32[i] = pcm16[i] / 32768;
                  }

                  const audioBuffer = audioCtx.createBuffer(
                    1,
                    float32.length,
                    24000,
                  );
                  audioBuffer.getChannelData(0).set(float32);

                  const source = audioCtx.createBufferSource();
                  source.buffer = audioBuffer;
                  source.connect(audioCtx.destination);

                  const currentTime = audioCtx.currentTime;
                  if (currentTime < nextPlayTimeRef.current) {
                    source.start(nextPlayTimeRef.current);
                    nextPlayTimeRef.current += audioBuffer.duration;
                  } else {
                    source.start(currentTime);
                    nextPlayTimeRef.current =
                      currentTime + audioBuffer.duration;
                  }
                } catch (err) {
                  console.error("Audio playback error:", err);
                }
              }
            }

            if (serverContent?.interrupted) {
              nextPlayTimeRef.current =
                audioContextRef.current?.currentTime || 0;
              setIsAISpeaking(false);
            }

            const toolCalls = message.toolCall?.functionCalls;
            if (toolCalls) {
              for (const call of toolCalls) {
                if (call.name === "submitSimulationScore") {
                  const args = call.args as any;
                  
                  setTranscript(currentTranscript => {
                    const result: SimulationResult = {
                      id: Date.now().toString(),
                      date: new Date().toISOString(),
                      level,
                      score: args.score,
                      metrics: {
                        tonality: args.tonality,
                        activeListening: args.activeListening,
                        objectionHandling: args.objectionHandling,
                        nepqLevel: args.nepqLevel,
                        pacing: args.pacing,
                        confidence: args.confidence,
                        questioningQuality: args.questioningQuality,
                        closingAbility: args.closingAbility,
                        rapportBuilding: args.rapportBuilding,
                        compliance: args.compliance,
                        evidenceGathering: args.evidenceGathering,
                      },
                      feedback: args.feedback + (args.missedDetails ? `\n\nLO QUE FALTO: ${args.missedDetails}` : ""),
                      passed: args.passed,
                      transcript: currentTranscript,
                    };

                    sessionPromise.then((session) => {
                      session.sendToolResponse({
                        functionResponses: [
                          {
                            id: call.id,
                            name: call.name,
                            response: { status: "success" },
                          },
                        ],
                      });
                    });

                    setTimeout(() => {
                      stopSimulation();
                      onComplete(result);
                    }, 8000);

                    return currentTranscript;
                  });
                }
              }
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError("Error de conexión con el simulador.");
            stopSimulation();
          },
          onclose: () => {
            setIsConnected(false);
            setIsAISpeaking(false);
          },
        },
      });

      sessionRef.current = sessionPromise;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al iniciar la simulación.");
      setIsConnecting(false);
    }
  };

  const handleFinishDiscovery = () => {
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => {
        session.sendRealtimeInput({
          text: "He terminado el descubrimiento. Por favor, Sab, evalúa mi desempeño ahora."
        });
      });
    }
  };

  const stopSimulation = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
      sessionRef.current = null;
    }
    if (aiSpeakingTimeoutRef.current) {
      clearTimeout(aiSpeakingTimeoutRef.current);
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsAISpeaking(false);
  };

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, []);

  const bars = Array.from({ length: 40 });

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-zinc-950 rounded-3xl border border-zinc-800/80 p-8 shadow-2xl relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-mendoza-emerald/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-mendoza-gold/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <AnimatePresence>
        {isConnected && micVolume > 0.02 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: micVolume * 3, scale: 1 + micVolume * 2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-mendoza-emerald/5 rounded-full blur-3xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="z-10 text-center space-y-12 w-full max-w-md">
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">
            {isSabPhase ? "Instrucciones de Sab" : `Simulación: ${level}`}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-mendoza-emerald animate-pulse" : "bg-zinc-600")} />
            <p className="text-zinc-400 font-medium tracking-wide text-sm uppercase">
              {isConnecting
                ? "Conectando..."
                : isConnected
                  ? isAISpeaking ? (isSabPhase ? "Sab Hablando" : "Cliente Hablando") : "Escuchando..."
                  : "Desconectado"}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3 text-left">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="relative flex justify-center items-center h-64">
          {/* AI Audio Visualizer Ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {bars.map((_, i) => {
              const angle = (i / bars.length) * 360;
              return (
                <motion.div
                  key={i}
                  className="absolute w-1.5 bg-mendoza-emerald rounded-full origin-bottom"
                  style={{
                    rotate: angle,
                    bottom: '50%',
                    transformOrigin: 'bottom center',
                    marginBottom: '85px',
                  }}
                  animate={{
                    height: isAISpeaking ? 10 + Math.random() * 40 : 4,
                    opacity: isAISpeaking ? 0.8 : 0.2,
                    backgroundColor: isAISpeaking ? (isSabPhase ? '#C5A059' : '#10b981') : '#52525b'
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    mass: 0.5
                  }}
                />
              );
            })}
          </div>

          {/* Avatar Container */}
          <motion.div
            animate={{
              scale: isAISpeaking ? [1, 1.05, 1] : 1,
              boxShadow: isAISpeaking 
                ? `0 0 60px ${isSabPhase ? "rgba(197, 160, 89, 0.4)" : "rgba(16, 185, 129, 0.4)"}` 
                : isConnected 
                  ? "0 0 20px rgba(255, 255, 255, 0.05)"
                  : "0 0 0px rgba(0,0,0,0)",
              borderColor: isAISpeaking ? (isSabPhase ? "#C5A059" : "#10b981") : "#27272a"
            }}
            transition={{
              scale: { repeat: isAISpeaking ? Infinity : 0, duration: 1.5, ease: "easeInOut" },
              boxShadow: { duration: 0.3 },
              borderColor: { duration: 0.3 }
            }}
            className={cn(
              "relative w-40 h-40 rounded-full flex items-center justify-center overflow-hidden border-4 z-10 bg-zinc-900",
              isConnecting && "animate-pulse"
            )}
          >
            {isSabPhase ? (
              <div className="w-full h-full bg-mendoza-navy flex items-center justify-center">
                <Brain className="w-20 h-20 text-mendoza-gold" />
              </div>
            ) : avatar ? (
              <img 
                src={avatar.imageUrl} 
                alt={avatar.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mendoza-emerald/5 to-mendoza-emerald/20 mix-blend-overlay pointer-events-none" />
          </motion.div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              disabled={!isConnected}
              className={cn(
                "p-5 rounded-full transition-all duration-300",
                isMuted
                  ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20"
                  : "bg-mendoza-emerald text-white hover:bg-mendoza-emerald-dark border border-mendoza-emerald/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
                !isConnected && "opacity-50 cursor-not-allowed",
              )}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={() => {
                stopSimulation();
                onCancel();
              }}
              className="p-5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>

          {mode === "discovery" && isConnected && !isSabPhase && (
            <button
              onClick={handleFinishDiscovery}
              className="w-full py-3 bg-mendoza-gold hover:bg-mendoza-gold-dark text-mendoza-navy font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)] animate-in fade-in slide-in-from-bottom-4"
            >
              Finalizar Descubrimiento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
